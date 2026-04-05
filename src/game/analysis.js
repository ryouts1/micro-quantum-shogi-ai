import { PLAYERS } from './constants.js';
import { evaluateState } from './evaluator.js';
import {
  getCertainPieceIds,
  getExpectedPieceValue,
  getUncertainPieceIds,
} from './selectors.js';
import { listLegalActions } from './rules.js';
import { coordToText, clamp } from './utils.js';

export function scoreToWinRate(score) {
  const normalized = 1 / (1 + Math.exp(-score / 280));
  return clamp(normalized, 0.01, 0.99);
}

export function computeBeliefEntropy(state) {
  if (state.worlds.length <= 1) {
    return 0;
  }

  return state.worlds.reduce((entropy, world) => {
    if (world.weight <= 0) {
      return entropy;
    }
    return entropy - world.weight * Math.log2(world.weight);
  }, 0);
}

function countPiecesByOwner(pieceIds) {
  return pieceIds.reduce(
    (counts, pieceId) => {
      if (pieceId.startsWith('b-')) {
        counts.black += 1;
      } else if (pieceId.startsWith('w-')) {
        counts.white += 1;
      }
      return counts;
    },
    { black: 0, white: 0 },
  );
}

export function computeStateInsights(state) {
  const certainCounts = countPiecesByOwner(getCertainPieceIds(state));
  const uncertainCounts = countPiecesByOwner(getUncertainPieceIds(state));

  const moveCounts = {
    black: listLegalActions(state, { forOwner: PLAYERS.BLACK, skipTerminalCheck: true }).filter((action) => action.type === 'move').length,
    white: listLegalActions(state, { forOwner: PLAYERS.WHITE, skipTerminalCheck: true }).filter((action) => action.type === 'move').length,
  };

  return {
    worldCount: state.worlds.length,
    entropy: computeBeliefEntropy(state),
    certainCounts,
    uncertainCounts,
    moveCounts,
    expectedMaterial: {
      black: getExpectedPieceValue(state, PLAYERS.BLACK),
      white: getExpectedPieceValue(state, PLAYERS.WHITE),
    },
    blackScore: evaluateState(state, PLAYERS.BLACK),
    blackWinRate: scoreToWinRate(evaluateState(state, PLAYERS.BLACK)),
  };
}

function summarizeWorldPieces(world, owner) {
  return Object.values(world.pieces)
    .filter((piece) => piece.owner === owner && !piece.captured)
    .sort((a, b) => a.y - b.y || a.x - b.x || a.id.localeCompare(b.id))
    .map((piece) => ({
      id: piece.id,
      type: piece.type,
      owner: piece.owner,
      x: piece.x,
      y: piece.y,
      label: `${coordToText(piece.x, piece.y)}`,
    }));
}

export function getTopWorlds(state, limit = 4) {
  return [...state.worlds]
    .sort((a, b) => b.weight - a.weight)
    .slice(0, limit)
    .map((world, index) => ({
      index,
      weight: world.weight,
      blackPieces: summarizeWorldPieces(world, PLAYERS.BLACK),
      whitePieces: summarizeWorldPieces(world, PLAYERS.WHITE),
      world,
    }));
}

export function buildReplaySeries(history) {
  return history.map((entry, index) => {
    const blackScore = evaluateState(entry.state, PLAYERS.BLACK);
    return {
      index,
      actionText: entry.actionText,
      blackScore,
      blackWinRate: scoreToWinRate(blackScore),
      worldCount: entry.state.worlds.length,
      entropy: computeBeliefEntropy(entry.state),
      turn: entry.state.turn,
      result: entry.state.result ?? null,
    };
  });
}
