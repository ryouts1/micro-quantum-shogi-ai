import { scoreToWinRate } from './analysis.js';
import { chooseBestAction, chooseBestActionExpectiminimax, chooseBestActionMcts } from './ai.js';
import { applyDeterministicAction, getLegalActionsForPiece } from './rules.js';

function evaluateChild(childState, engine, perspective, config) {
  if (engine === 'mcts') {
    return chooseBestActionMcts(childState, {
      perspective,
      iterations: config.iterations ?? 80,
      rolloutDepth: config.rolloutDepth ?? 8,
      maxTreeDepth: config.maxTreeDepth ?? 10,
      seed: config.seed,
    }).score;
  }

  if (engine === 'expectiminimax') {
    return chooseBestActionExpectiminimax(childState, {
      perspective,
      depth: config.depth ?? 1,
    }).score;
  }

  return chooseBestAction(childState, engine, {
    perspective,
    depth: config.depth ?? 1,
    iterations: config.iterations ?? 120,
    seed: config.seed,
  }).score;
}

export function computeHeatmapForPiece(state, pieceId, options = {}) {
  const {
    engine = 'expectiminimax',
    perspective = state.turn,
    depth = 1,
    iterations = 80,
  } = options;

  const actions = getLegalActionsForPiece(state, pieceId);
  const classicalMoves = actions.filter((action) => action.mode === 'classical');
  const quantumMoves = actions.filter((action) => action.mode === 'quantum');

  const cells = classicalMoves.map((action) => {
    const childState = applyDeterministicAction(state, action);
    const score = evaluateChild(childState, engine, perspective, { depth, iterations, seed: `${pieceId}:${action.mode}:${action.to.x},${action.to.y}` });
    return {
      x: action.to.x,
      y: action.to.y,
      action,
      score,
      winRate: scoreToWinRate(score),
      capture: Boolean(action.targetId),
    };
  });

  const quantumRanking = quantumMoves
    .map((action) => {
      const childState = applyDeterministicAction(state, action);
      const score = evaluateChild(childState, engine, perspective, {
        depth,
        iterations,
        seed: `${pieceId}:quantum:${action.branches.map((branch) => `${branch.x},${branch.y}`).join('|')}`,
      });
      return {
        action,
        score,
        winRate: scoreToWinRate(score),
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return {
    cells,
    quantumRanking,
  };
}
