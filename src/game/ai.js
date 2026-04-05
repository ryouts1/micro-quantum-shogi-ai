import { PIECE_TYPES } from './constants.js';
import { evaluateState } from './evaluator.js';
import { getActionModelBias, getOpeningBookRanking } from './model.js';
import {
  actionToKey,
  applyAction,
  applyDeterministicAction,
  getObserveOutcomes,
  getTerminalResult,
  isTerminalState,
  listLegalActions,
} from './rules.js';
import { makeSeededRng, stableStateHash } from './utils.js';

function actionPriorityBase(state, action) {
  if (action.type === 'observe') {
    return 5;
  }
  if (action.mode === 'classical' && action.targetId) {
    const target = state.worlds[0].pieces[action.targetId];
    if (target?.type === PIECE_TYPES.KING) {
      return 1000;
    }
    if (target?.type === PIECE_TYPES.ROOK) {
      return 220;
    }
    if (target?.type === PIECE_TYPES.BISHOP) {
      return 200;
    }
    return 130;
  }
  if (action.mode === 'quantum') {
    return 40;
  }
  return 10;
}

function actionPriority(state, action) {
  return actionPriorityBase(state, action) + getActionModelBias(state, action);
}

function orderActions(state, actions) {
  return [...actions].sort((a, b) => actionPriority(state, b) - actionPriority(state, a));
}

function transitionForAction(state, action) {
  if (action.type === 'observe') {
    return {
      kind: 'chance',
      outcomes: getObserveOutcomes(state, action),
    };
  }

  return {
    kind: 'deterministic',
    state: applyDeterministicAction(state, action),
  };
}

function expectiminimaxValue(state, depth, perspective, memo) {
  const memoKey = `${stableStateHash(state)}::${depth}::${perspective}`;
  if (memo.has(memoKey)) {
    return memo.get(memoKey);
  }

  const terminal = getTerminalResult(state);
  if (depth <= 0 || terminal || isTerminalState(state)) {
    const value = evaluateState(state, perspective);
    memo.set(memoKey, value);
    return value;
  }

  const actions = orderActions(state, listLegalActions(state));
  if (actions.length === 0) {
    const value = evaluateState(state, perspective);
    memo.set(memoKey, value);
    return value;
  }

  const maximizing = state.turn === perspective;
  let best = maximizing ? -Infinity : Infinity;

  for (const action of actions) {
    const transition = transitionForAction(state, action);
    let value;

    if (transition.kind === 'chance') {
      value = transition.outcomes.reduce(
        (sum, outcome) => sum + outcome.probability * expectiminimaxValue(outcome.state, depth - 1, perspective, memo),
        0,
      );
    } else {
      value = expectiminimaxValue(transition.state, depth - 1, perspective, memo);
    }

    if (maximizing) {
      best = Math.max(best, value);
    } else {
      best = Math.min(best, value);
    }
  }

  memo.set(memoKey, best);
  return best;
}

function rankingValueSort(a, b) {
  return b.value - a.value;
}

export function chooseBestActionExpectiminimax(state, config = {}) {
  const {
    depth = 2,
    perspective = state.turn,
  } = config;

  const memo = new Map();
  const actions = orderActions(state, listLegalActions(state));
  const maximizing = state.turn === perspective;

  let chosen = null;
  let bestValue = maximizing ? -Infinity : Infinity;
  const ranking = [];

  for (const action of actions) {
    const transition = transitionForAction(state, action);
    let value;
    if (transition.kind === 'chance') {
      value = transition.outcomes.reduce(
        (sum, outcome) => sum + outcome.probability * expectiminimaxValue(outcome.state, depth - 1, perspective, memo),
        0,
      );
    } else {
      value = expectiminimaxValue(transition.state, depth - 1, perspective, memo);
    }

    ranking.push({ action, value });

    if (maximizing ? value > bestValue : value < bestValue) {
      bestValue = value;
      chosen = action;
    }
  }

  ranking.sort((a, b) => (maximizing ? b.value - a.value : a.value - b.value));

  return {
    action: chosen,
    score: bestValue,
    ranking,
  };
}

function createNode(state) {
  return {
    state,
    hash: stableStateHash(state),
    visits: 0,
    totalValue: 0,
    actionStats: null,
  };
}

function pickRandom(items, rng) {
  return items[Math.floor(rng() * items.length)] ?? null;
}

function rolloutPolicy(state, rng) {
  const actions = listLegalActions(state);
  if (actions.length === 0) {
    return null;
  }

  const scored = actions.map((action) => ({
    action,
    weight: Math.max(1, actionPriority(state, action) + 18),
  }));

  const total = scored.reduce((sum, entry) => sum + entry.weight, 0);
  let threshold = rng() * total;
  for (const entry of scored) {
    threshold -= entry.weight;
    if (threshold <= 0) {
      return entry.action;
    }
  }

  return scored.at(-1).action;
}

function rollout(state, perspective, maxDepth, rng) {
  let current = state;
  for (let depth = 0; depth < maxDepth; depth += 1) {
    if (getTerminalResult(current) || isTerminalState(current)) {
      break;
    }
    const action = rolloutPolicy(current, rng);
    if (!action) {
      break;
    }
    current = applyAction(current, action, { rng });
  }
  return evaluateState(current, perspective);
}

function ensureActionStats(node) {
  if (!node.actionStats) {
    node.actionStats = listLegalActions(node.state).map((action) => ({
      action,
      key: actionToKey(action),
      visits: 0,
      totalValue: 0,
      priorBias: getActionModelBias(node.state, action),
      children: new Map(),
    }));
  }
  return node.actionStats;
}

function selectActionStat(node, exploration, rng) {
  const actionStats = ensureActionStats(node);
  const unvisited = actionStats.filter((stat) => stat.visits === 0);
  if (unvisited.length) {
    const ordered = [...unvisited].sort((a, b) => b.priorBias - a.priorBias);
    const threshold = (ordered[0]?.priorBias ?? 0) - 8;
    return pickRandom(ordered.filter((stat) => stat.priorBias >= threshold), rng);
  }

  let best = actionStats[0];
  let bestScore = -Infinity;

  for (const stat of actionStats) {
    const exploitation = stat.totalValue / stat.visits;
    const explorationBonus = exploration * Math.sqrt(Math.log(node.visits + 1) / stat.visits);
    const priorBonus = stat.priorBias / (28 * (stat.visits + 1));
    const score = exploitation + explorationBonus + priorBonus;
    if (score > bestScore) {
      bestScore = score;
      best = stat;
    }
  }

  return best;
}

function sampleOutcome(state, action, rng) {
  if (action.type === 'observe') {
    return applyAction(state, action, { rng });
  }
  return applyDeterministicAction(state, action);
}

function mctsSimulate(node, perspective, config, rng) {
  const {
    exploration = 1.1,
    rolloutDepth = 10,
    maxTreeDepth = 12,
    depth = 0,
  } = config;

  const terminal = getTerminalResult(node.state);
  if (terminal || depth >= maxTreeDepth || isTerminalState(node.state)) {
    const value = evaluateState(node.state, perspective);
    node.visits += 1;
    node.totalValue += value;
    return value;
  }

  const actionStats = ensureActionStats(node);
  if (actionStats.length === 0) {
    const value = evaluateState(node.state, perspective);
    node.visits += 1;
    node.totalValue += value;
    return value;
  }

  const stat = selectActionStat(node, exploration, rng);
  const childState = sampleOutcome(node.state, stat.action, rng);
  const childHash = stableStateHash(childState);
  if (!stat.children.has(childHash)) {
    stat.children.set(childHash, createNode(childState));
  }
  const childNode = stat.children.get(childHash);

  let value;
  if (childNode.visits === 0) {
    value = rollout(childState, perspective, rolloutDepth, rng);
    childNode.visits += 1;
    childNode.totalValue += value;
  } else {
    value = mctsSimulate(childNode, perspective, {
      ...config,
      depth: depth + 1,
    }, rng);
  }

  stat.visits += 1;
  stat.totalValue += value;
  node.visits += 1;
  node.totalValue += value;
  return value;
}

export function chooseBestActionMcts(state, config = {}) {
  const {
    perspective = state.turn,
    iterations = 180,
    exploration = 1.1,
    rolloutDepth = 10,
    maxTreeDepth = 12,
    seed = `mcts::${stableStateHash(state)}::${perspective}`,
  } = config;

  const root = createNode(state);
  ensureActionStats(root);

  if (!root.actionStats.length) {
    return {
      action: null,
      score: evaluateState(state, perspective),
      ranking: [],
    };
  }

  const rng = makeSeededRng(seed);

  for (let i = 0; i < iterations; i += 1) {
    mctsSimulate(root, perspective, {
      exploration,
      rolloutDepth,
      maxTreeDepth,
      depth: 0,
    }, rng);
  }

  const ranking = root.actionStats
    .map((stat) => ({
      action: stat.action,
      value: stat.visits ? stat.totalValue / stat.visits : -Infinity,
      visits: stat.visits,
    }))
    .sort((a, b) => b.visits - a.visits || b.value - a.value);

  return {
    action: ranking[0]?.action ?? null,
    score: ranking[0]?.value ?? evaluateState(state, perspective),
    ranking,
  };
}

function scoreToUnit(value) {
  return 1 / (1 + Math.exp(-value / 260));
}

function mergeRankingEntries(state, rankingBundles) {
  const actions = listLegalActions(state);
  const map = new Map(actions.map((action) => [actionToKey(action), {
    action,
    aggregate: 0,
    weightSum: 0,
    details: [],
  }]));

  for (const bundle of rankingBundles) {
    const bundleMap = new Map(bundle.entries.map((entry) => [actionToKey(entry.action), entry]));
    for (const [key, record] of map.entries()) {
      const entry = bundleMap.get(key);
      if (!entry) {
        continue;
      }
      const normalized = bundle.transform(entry);
      record.aggregate += normalized * bundle.weight;
      record.weightSum += bundle.weight;
      record.details.push({
        source: bundle.source,
        normalized,
      });
    }
  }

  const ranking = [...map.values()]
    .map((record) => {
      const priorUnit = scoreToUnit(getActionModelBias(state, record.action));
      const totalWeight = record.weightSum + 0.12;
      const unit = (record.aggregate + priorUnit * 0.12) / totalWeight;
      return {
        action: record.action,
        value: (unit - 0.5) * 560,
        details: record.details,
      };
    })
    .sort(rankingValueSort);

  return ranking;
}

export function chooseBestActionLearnedHybrid(state, config = {}) {
  const {
    perspective = state.turn,
    depth = 2,
    iterations = 220,
  } = config;

  const legalActions = listLegalActions(state);
  if (!legalActions.length) {
    return {
      action: null,
      score: evaluateState(state, perspective),
      ranking: [],
      source: 'no-legal-actions',
    };
  }

  const bookRanking = getOpeningBookRanking(state, legalActions);
  if (bookRanking.length) {
    return {
      action: bookRanking[0].action,
      score: bookRanking[0].value,
      ranking: bookRanking,
      source: 'opening-book',
    };
  }

  const expect = chooseBestActionExpectiminimax(state, {
    ...config,
    perspective,
    depth,
  });

  const mcts = chooseBestActionMcts(state, {
    ...config,
    perspective,
    iterations,
  });

  const ranking = mergeRankingEntries(state, [
    {
      source: 'expectiminimax',
      weight: 0.46,
      entries: expect.ranking.slice(0, 8),
      transform: (entry) => scoreToUnit(entry.value),
    },
    {
      source: 'mcts',
      weight: 0.42,
      entries: mcts.ranking.slice(0, 8),
      transform: (entry) => scoreToUnit(entry.value),
    },
  ]);

  return {
    action: ranking[0]?.action ?? null,
    score: ranking[0]?.value ?? evaluateState(state, perspective),
    ranking,
    source: 'hybrid-search',
  };
}

export function chooseBestAction(state, engine, config = {}) {
  if (engine === 'mcts') {
    return chooseBestActionMcts(state, config);
  }
  if (engine === 'learned-hybrid') {
    return chooseBestActionLearnedHybrid(state, config);
  }
  return chooseBestActionExpectiminimax(state, config);
}
