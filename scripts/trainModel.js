import { mkdir, rename, writeFile } from 'node:fs/promises';

import { BOARD_SIZE, PIECE_TYPES, PLAYERS } from '../src/game/constants.js';
import { extractEvaluationFeatures, evaluateStateRaw } from '../src/game/evaluator.js';
import { actionToKey, applyAction, applyDeterministicAction, getObserveOutcomes, listLegalActions } from '../src/game/rules.js';
import { createInitialState } from '../src/game/setup.js';
import { makeSeededRng, stableStateHash } from '../src/game/utils.js';

function readCliArgs(argv) {
  const result = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) {
      continue;
    }
    const key = token.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith('--')) {
      result[key] = 'true';
      continue;
    }
    result[key] = next;
    index += 1;
  }
  return result;
}

const cli = readCliArgs(process.argv.slice(2));

function readNumber(name, fallback) {
  const raw = cli[name] ?? process.env[`TRAIN_${name.toUpperCase().replaceAll('-', '_')}`];
  if (raw == null || raw === '') {
    return fallback;
  }
  const value = Number(raw);
  return Number.isFinite(value) ? value : fallback;
}

function readString(name, fallback) {
  const raw = cli[name] ?? process.env[`TRAIN_${name.toUpperCase().replaceAll('-', '_')}`];
  return raw == null || raw === '' ? fallback : String(raw);
}

const TRAINING_CONFIG = {
  version: readString('version', 'selfplay-v2-large'),
  selfPlayGames: readNumber('games', 512),
  maxPlies: readNumber('max-plies', 48),
  openingBookDepth: readNumber('book-depth', 12),
  openingBookMinVisits: readNumber('book-min-visits', 4),
  openingBookTopActions: readNumber('book-top-actions', 5),
  openingBookMaxStates: readNumber('book-max-states', 240),
  sgdEpochs: readNumber('epochs', 36),
  learningRate: readNumber('lr', 0.065),
  l2: readNumber('l2', 0.0014),
  seed: readString('seed', 'mqs-learned-selfplay-v2-large'),
  reportLimit: readNumber('report-limit', 16),
  logEvery: readNumber('log-every', 64),
  workersRequested: readNumber('workers', 1),
};

const FEATURE_KEYS = Object.keys(extractEvaluationFeatures(createInitialState({ seed: 'feature-shape' })));
const PIECE_TYPES_IN_ORDER = [
  PIECE_TYPES.KING,
  PIECE_TYPES.ROOK,
  PIECE_TYPES.BISHOP,
  PIECE_TYPES.GOLD,
  PIECE_TYPES.SILVER,
  PIECE_TYPES.PAWN,
];

function createSquareTable() {
  return Array.from({ length: BOARD_SIZE * BOARD_SIZE }, () => ({ sum: 0, count: 0 }));
}

function toOwnerRelative(x, y, owner) {
  if (owner === PLAYERS.BLACK) {
    return { x, y };
  }
  return {
    x: BOARD_SIZE - 1 - x,
    y: BOARD_SIZE - 1 - y,
  };
}

function flattenIndex(x, y) {
  return y * BOARD_SIZE + x;
}

function targetFromResult(result) {
  if (!result || result.winner === 'draw') {
    return 0;
  }
  return result.winner === PLAYERS.BLACK ? 1 : -1;
}

function outcomeForActor(result, actor) {
  const blackTarget = targetFromResult(result);
  return actor === PLAYERS.BLACK ? blackTarget : -blackTarget;
}

function capturePriority(state, action) {
  if (action.type !== 'move' || !action.targetId) {
    return 0;
  }
  const targetType = state.worlds[0]?.pieces?.[action.targetId]?.type;
  return {
    [PIECE_TYPES.KING]: 900,
    [PIECE_TYPES.ROOK]: 220,
    [PIECE_TYPES.BISHOP]: 200,
    [PIECE_TYPES.GOLD]: 110,
    [PIECE_TYPES.SILVER]: 100,
    [PIECE_TYPES.PAWN]: 70,
  }[targetType] ?? 0;
}

function immediateSearchScore(state, action, perspective) {
  if (action.type === 'observe') {
    return getObserveOutcomes(state, action).reduce(
      (sum, outcome) => sum + outcome.probability * evaluateStateRaw(outcome.state, perspective),
      0,
    );
  }
  return evaluateStateRaw(applyDeterministicAction(state, action), perspective);
}

function trainingActionBias(state, action, rng) {
  let bias = capturePriority(state, action);
  if (action.type === 'observe') {
    bias -= 14;
  } else if (action.mode === 'quantum') {
    bias += 28;
  }
  bias += (rng() - 0.5) * 30;
  return bias;
}

function sampleWeighted(scored, rng, limit = 4) {
  const top = scored.slice(0, Math.min(limit, scored.length));
  const maxScore = top[0]?.score ?? 0;
  const weighted = top.map((entry, index) => ({
    ...entry,
    weight: Math.exp((entry.score - maxScore) / 90) * (top.length - index + 0.75),
  }));
  const total = weighted.reduce((sum, entry) => sum + entry.weight, 0);
  let threshold = rng() * total;
  for (const entry of weighted) {
    threshold -= entry.weight;
    if (threshold <= 0) {
      return entry.action;
    }
  }
  return weighted.at(-1)?.action ?? null;
}

function chooseSelfPlayAction(state, rng) {
  const actions = listLegalActions(state);
  if (!actions.length) {
    return null;
  }

  const scored = actions.map((action) => ({
    action,
    score: immediateSearchScore(state, action, state.turn) + trainingActionBias(state, action, rng),
  })).sort((a, b) => b.score - a.score);

  if (rng() < 0.08) {
    return sampleWeighted(scored, rng, 6);
  }
  return sampleWeighted(scored, rng, 4);
}

function recordActionProfile(store, key, value) {
  if (!key) {
    return;
  }
  if (!store[key]) {
    store[key] = { sum: 0, count: 0 };
  }
  store[key].sum += value;
  store[key].count += 1;
}

function finalizeAverageMap(store, minimumCount = 1, scale = 1) {
  return Object.fromEntries(
    Object.entries(store)
      .filter(([, entry]) => entry.count >= minimumCount)
      .map(([key, entry]) => [key, Number(((entry.sum / entry.count) * scale).toFixed(4))])
      .sort((a, b) => a[0].localeCompare(b[0])),
  );
}

function buildModelModuleText(model) {
  return `export const TRAINED_MODEL = ${JSON.stringify(model, null, 2)};\n`;
}

async function writeAtomic(url, content) {
  const tempUrl = new URL(`${url.href}.tmp`);
  await writeFile(tempUrl, content, 'utf8');
  await rename(tempUrl, url);
}

function shuffleInPlace(items, rng) {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(rng() * (index + 1));
    [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
  }
}

function trainLinearModel(samples, config) {
  const weights = Object.fromEntries(FEATURE_KEYS.map((key) => [key, 0]));
  let bias = 0;
  let learningRate = config.learningRate;
  const rng = makeSeededRng(`${config.seed}::sgd`);
  const pool = [...samples];

  for (let epoch = 0; epoch < config.sgdEpochs; epoch += 1) {
    shuffleInPlace(pool, rng);
    for (const sample of pool) {
      const raw = FEATURE_KEYS.reduce((sum, key) => sum + weights[key] * sample.features[key], bias);
      const prediction = Math.tanh(raw);
      const error = prediction - sample.target;
      const gradientScale = 2 * error * (1 - prediction ** 2);
      bias -= learningRate * gradientScale;
      for (const key of FEATURE_KEYS) {
        weights[key] -= learningRate * ((gradientScale * sample.features[key]) + config.l2 * weights[key]);
      }
    }
    learningRate *= 0.93;
  }

  const mae = pool.reduce((sum, sample) => {
    const raw = FEATURE_KEYS.reduce((acc, key) => acc + weights[key] * sample.features[key], bias);
    return sum + Math.abs(Math.tanh(raw) - sample.target);
  }, 0) / Math.max(pool.length, 1);

  return {
    bias: Number(bias.toFixed(6)),
    weights: Object.fromEntries(FEATURE_KEYS.map((key) => [key, Number(weights[key].toFixed(6))])),
    mae: Number(mae.toFixed(4)),
  };
}

function flattenPieceSquares(tables) {
  return Object.fromEntries(
    PIECE_TYPES_IN_ORDER.map((pieceType) => [
      pieceType,
      tables[pieceType].map((entry) => {
        if (!entry.count) {
          return 0;
        }
        return Number(((entry.sum / entry.count) * 1.35).toFixed(4));
      }),
    ]),
  );
}

function buildOpeningBook(bookStore, config) {
  const entries = Object.entries(bookStore)
    .filter(([, entry]) => entry.total >= config.openingBookMinVisits)
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, config.openingBookMaxStates);

  return Object.fromEntries(entries.map(([stateHash, entry]) => {
    const rawActions = Object.entries(entry.actions).map(([key, record]) => {
      const rawScore = record.sum / record.count;
      const score = record.sum / (record.count + 4);
      return {
        key,
        plays: record.count,
        score: Number(score.toFixed(4)),
        rawScore: Number(rawScore.toFixed(4)),
      };
    });

    const stableActions = rawActions.some((candidate) => candidate.plays >= 2)
      ? rawActions.filter((candidate) => candidate.plays >= 2)
      : rawActions;

    const actions = stableActions
      .sort((a, b) => b.score - a.score || b.plays - a.plays)
      .slice(0, config.openingBookTopActions);

    return [stateHash, {
      total: entry.total,
      actions,
    }];
  }));
}

function summarizeOpeningBook(openingBook, limit) {
  return Object.entries(openingBook)
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, limit)
    .map(([stateHash, entry]) => ({
      stateHash,
      total: entry.total,
      topAction: entry.actions[0] ?? null,
    }));
}

function buildTrainingReport(model, config, extra = {}) {
  return {
    generatedAt: model.meta.generatedAt,
    version: model.meta.version,
    config,
    summary: model.meta,
    linear: model.linear,
    actionProfiles: model.actionProfiles,
    openingBookPreview: summarizeOpeningBook(model.openingBook, config.reportLimit),
    ...extra,
  };
}

async function main() {
  const rng = makeSeededRng(TRAINING_CONFIG.seed);
  const pieceSquareTables = Object.fromEntries(PIECE_TYPES_IN_ORDER.map((pieceType) => [pieceType, createSquareTable()]));
  const actionProfiles = {
    base: {},
    byPiece: {},
    captureTarget: {},
  };
  const openingBookStore = {};
  const linearSamples = [];
  const gameSummaries = [];

  for (let gameIndex = 0; gameIndex < TRAINING_CONFIG.selfPlayGames; gameIndex += 1) {
    let state = createInitialState({ seed: `${TRAINING_CONFIG.seed}::game-${gameIndex}` });
    const trajectory = [];

    for (let ply = 0; ply < TRAINING_CONFIG.maxPlies && !state.result; ply += 1) {
      const action = chooseSelfPlayAction(state, rng);
      if (!action) {
        break;
      }

      trajectory.push({
        state,
        action,
        actor: state.turn,
        features: extractEvaluationFeatures(state),
        stateHash: ply < TRAINING_CONFIG.openingBookDepth ? stableStateHash(state) : null,
      });

      state = applyAction(state, action, { rng });
    }

    const resultTarget = targetFromResult(state.result);
    gameSummaries.push({
      gameIndex,
      winner: state.result?.winner ?? 'draw',
      reason: state.result?.reason ?? 'unknown',
      plies: trajectory.length,
      target: resultTarget,
    });

    for (const entry of trajectory) {
      linearSamples.push({
        features: entry.features,
        target: resultTarget,
      });

      const actorOutcome = outcomeForActor(state.result, entry.actor);
      const modeKey = entry.action.type === 'observe' ? 'observe' : entry.action.mode;
      recordActionProfile(actionProfiles.base, modeKey, actorOutcome);
      const pieceKey = entry.action.type === 'observe'
        ? `observe:${entry.action.pieceType}`
        : `move:${entry.action.mode}:${entry.action.pieceType}`;
      recordActionProfile(actionProfiles.byPiece, pieceKey, actorOutcome);
      if (entry.action.type === 'move' && entry.action.targetId) {
        const targetType = entry.state.worlds[0]?.pieces?.[entry.action.targetId]?.type;
        recordActionProfile(actionProfiles.captureTarget, targetType, actorOutcome);
      }

      if (entry.stateHash) {
        if (!openingBookStore[entry.stateHash]) {
          openingBookStore[entry.stateHash] = { total: 0, actions: {} };
        }
        openingBookStore[entry.stateHash].total += 1;
        const key = actionToKey(entry.action);
        if (!openingBookStore[entry.stateHash].actions[key]) {
          openingBookStore[entry.stateHash].actions[key] = { sum: 0, count: 0 };
        }
        openingBookStore[entry.stateHash].actions[key].sum += actorOutcome;
        openingBookStore[entry.stateHash].actions[key].count += 1;
      }

      for (const world of entry.state.worlds) {
        for (const piece of Object.values(world.pieces)) {
          if (piece.captured) {
            continue;
          }
          const relative = toOwnerRelative(piece.x, piece.y, piece.owner);
          const squareIndex = flattenIndex(relative.x, relative.y);
          const ownerOutcome = piece.owner === PLAYERS.BLACK ? resultTarget : -resultTarget;
          pieceSquareTables[piece.type][squareIndex].sum += ownerOutcome * world.weight;
          pieceSquareTables[piece.type][squareIndex].count += world.weight;
        }
      }
    }

    if ((gameIndex + 1) % TRAINING_CONFIG.logEvery === 0 || gameIndex + 1 === TRAINING_CONFIG.selfPlayGames) {
      const decisive = gameSummaries.filter((game) => game.winner !== 'draw').length;
      const averagePlies = gameSummaries.reduce((sum, game) => sum + game.plies, 0) / Math.max(gameSummaries.length, 1);
      console.log(JSON.stringify({
        progress: `${gameIndex + 1}/${TRAINING_CONFIG.selfPlayGames}`,
        decisiveGames: decisive,
        draws: gameSummaries.length - decisive,
        sampledPositions: linearSamples.length,
        averagePlies: Number(averagePlies.toFixed(2)),
      }));
    }
  }

  const linear = trainLinearModel(linearSamples, TRAINING_CONFIG);
  const openingBook = buildOpeningBook(openingBookStore, TRAINING_CONFIG);

  const model = {
    meta: {
      version: TRAINING_CONFIG.version,
      generatedAt: new Date().toISOString(),
      trainer: 'scripts/trainModel.js',
      selfPlayGames: TRAINING_CONFIG.selfPlayGames,
      sampledPositions: linearSamples.length,
      openingStates: Object.keys(openingBook).length,
      bookDepth: TRAINING_CONFIG.openingBookDepth,
      openingBookMaxStates: TRAINING_CONFIG.openingBookMaxStates,
      priorScale: 52,
      workersRequested: TRAINING_CONFIG.workersRequested,
      benchmarkGames: 0,
      benchmarkWinRate: null,
      notes: 'Large-batch one-ply stochastic self-play. Lightweight linear + piece-square model; no neural network.',
    },
    linear: {
      bias: linear.bias,
      weights: linear.weights,
    },
    pieceSquare: flattenPieceSquares(pieceSquareTables),
    actionProfiles: {
      base: finalizeAverageMap(actionProfiles.base, 1, 1.1),
      byPiece: finalizeAverageMap(actionProfiles.byPiece, 2, 1.1),
      captureTarget: finalizeAverageMap(actionProfiles.captureTarget, 2, 1.15),
    },
    openingBook,
    benchmarks: null,
  };

  const report = buildTrainingReport(model, TRAINING_CONFIG, {
    dataset: {
      decisiveGames: gameSummaries.filter((game) => game.winner !== 'draw').length,
      draws: gameSummaries.filter((game) => game.winner === 'draw').length,
      averagePlies: Number((gameSummaries.reduce((sum, game) => sum + game.plies, 0) / Math.max(gameSummaries.length, 1)).toFixed(2)),
      linearMae: linear.mae,
    },
    gamePreview: gameSummaries.slice(0, TRAINING_CONFIG.reportLimit),
  });

  await mkdir(new URL('../sample-data/reports/', import.meta.url), { recursive: true });
  await writeAtomic(new URL('../src/game/trainedModel.js', import.meta.url), buildModelModuleText(model));
  await writeAtomic(new URL('../sample-data/reports/training-report.json', import.meta.url), `${JSON.stringify(report, null, 2)}\n`);

  console.log(JSON.stringify({
    generatedAt: model.meta.generatedAt,
    selfPlayGames: model.meta.selfPlayGames,
    sampledPositions: model.meta.sampledPositions,
    openingStates: model.meta.openingStates,
    linearMae: linear.mae,
  }, null, 2));
}

await main();
