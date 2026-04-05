import { PIECE_VALUES, PLAYERS } from './constants.js';
import {
  computePieceSquareScore,
  getAllFeatureWeights,
  getLinearBias,
} from './model.js';
import { getPieceInfo, getUncertainPieceIds } from './selectors.js';
import { getTerminalResult, listLegalActions } from './rules.js';
import { weightedAverage } from './utils.js';

function centerBonus(piece) {
  const centerX = 2;
  const centerY = 2;
  const distance = Math.abs(piece.x - centerX) + Math.abs(piece.y - centerY);
  return (4 - distance) * 8;
}

function worldMaterial(world, owner) {
  return Object.values(world.pieces)
    .filter((piece) => piece.owner === owner && !piece.captured)
    .reduce((sum, piece) => sum + PIECE_VALUES[piece.type] + centerBonus(piece), 0);
}

function uncertaintyBalance(state) {
  return getUncertainPieceIds(state).reduce(
    (balance, pieceId) => {
      const info = getPieceInfo(state, pieceId);
      if (!info) {
        return balance;
      }
      if (info.owner === PLAYERS.BLACK) {
        balance.black += 1;
      } else {
        balance.white += 1;
      }
      return balance;
    },
    { black: 0, white: 0 },
  );
}

function worldCenterControl(world, owner) {
  return Object.values(world.pieces)
    .filter((piece) => piece.owner === owner && !piece.captured)
    .reduce((sum, piece) => sum + centerBonus(piece), 0);
}

function worldKingGuard(world, owner) {
  const king = Object.values(world.pieces).find((piece) => piece.owner === owner && piece.type === 'king' && !piece.captured);
  if (!king) {
    return 0;
  }
  return Object.values(world.pieces)
    .filter((piece) => piece.owner === owner && piece.id !== king.id && !piece.captured)
    .reduce((sum, piece) => {
      const distance = Math.max(Math.abs(piece.x - king.x), Math.abs(piece.y - king.y));
      return sum + (distance <= 1 ? 1 : 0);
    }, 0);
}

function certainPieceCounts(state) {
  return Object.keys(state.worlds[0]?.pieces ?? {}).reduce(
    (counts, pieceId) => {
      const info = getPieceInfo(state, pieceId);
      if (!info?.certain) {
        return counts;
      }
      if (info.owner === PLAYERS.BLACK) {
        counts.black += 1;
      } else {
        counts.white += 1;
      }
      return counts;
    },
    { black: 0, white: 0 },
  );
}


function computeBeliefEntropyLocal(state) {
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

export function extractEvaluationFeatures(state) {
  const uncertainty = uncertaintyBalance(state);
  const mobilityBlack = listLegalActions(state, { forOwner: PLAYERS.BLACK, skipTerminalCheck: true }).filter((action) => action.type === 'move').length;
  const mobilityWhite = listLegalActions(state, { forOwner: PLAYERS.WHITE, skipTerminalCheck: true }).filter((action) => action.type === 'move').length;
  const materialBlack = weightedAverage(state.worlds, (world) => worldMaterial(world, PLAYERS.BLACK));
  const materialWhite = weightedAverage(state.worlds, (world) => worldMaterial(world, PLAYERS.WHITE));
  const centerBlack = weightedAverage(state.worlds, (world) => worldCenterControl(world, PLAYERS.BLACK));
  const centerWhite = weightedAverage(state.worlds, (world) => worldCenterControl(world, PLAYERS.WHITE));
  const guardBlack = weightedAverage(state.worlds, (world) => worldKingGuard(world, PLAYERS.BLACK));
  const guardWhite = weightedAverage(state.worlds, (world) => worldKingGuard(world, PLAYERS.WHITE));
  const certainCounts = certainPieceCounts(state);
  const entropy = computeBeliefEntropyLocal(state);

  return {
    materialDiff: (materialBlack - materialWhite) / 1000,
    mobilityDiff: (mobilityBlack - mobilityWhite) / 10,
    uncertaintyDiff: (uncertainty.white - uncertainty.black) / 6,
    chargeDiff: (state.charges.black - state.charges.white) / 3,
    centerDiff: (centerBlack - centerWhite) / 80,
    kingGuardDiff: (guardBlack - guardWhite) / 4,
    entropy: entropy / 4,
    worldCount: Math.log2(state.worlds.length || 1) / 4,
    tempo: state.turn === PLAYERS.BLACK ? 1 : -1,
    progress: state.halfmoveClock / Math.max(state.noProgressLimit, 1),
    certainDiff: (certainCounts.black - certainCounts.white) / 8,
  };
}

export function predictLearnedOutcomeFromFeatures(features) {
  const weights = getAllFeatureWeights();
  const bias = getLinearBias();
  const raw = Object.entries(features).reduce((sum, [key, value]) => sum + (weights[key] ?? 0) * value, bias);
  return Math.tanh(raw);
}

export function predictLearnedOutcome(state) {
  return predictLearnedOutcomeFromFeatures(extractEvaluationFeatures(state));
}

function scoreForBlackRaw(state) {
  const materialBlack = weightedAverage(state.worlds, (world) => worldMaterial(world, PLAYERS.BLACK));
  const materialWhite = weightedAverage(state.worlds, (world) => worldMaterial(world, PLAYERS.WHITE));
  const mobilityBlack = listLegalActions(state, { forOwner: PLAYERS.BLACK, skipTerminalCheck: true }).filter((action) => action.type === 'move').length;
  const mobilityWhite = listLegalActions(state, { forOwner: PLAYERS.WHITE, skipTerminalCheck: true }).filter((action) => action.type === 'move').length;
  const uncertainty = uncertaintyBalance(state);
  const chargeEdge = state.charges.black - state.charges.white;
  const kingGuardBlack = weightedAverage(state.worlds, (world) => worldKingGuard(world, PLAYERS.BLACK));
  const kingGuardWhite = weightedAverage(state.worlds, (world) => worldKingGuard(world, PLAYERS.WHITE));

  return (
    materialBlack -
    materialWhite +
    (mobilityBlack - mobilityWhite) * 14 +
    (uncertainty.white - uncertainty.black) * 20 +
    chargeEdge * 18 +
    (kingGuardBlack - kingGuardWhite) * 16
  );
}

function scoreForBlackLearned(state) {
  const outcome = predictLearnedOutcome(state);
  const pieceSquareBlack = computePieceSquareScore(state, PLAYERS.BLACK);
  const pieceSquareWhite = computePieceSquareScore(state, PLAYERS.WHITE);
  return outcome * 320 + (pieceSquareBlack - pieceSquareWhite) * 52;
}

export function evaluateStateRaw(state, perspective = state.turn) {
  const terminal = getTerminalResult(state);
  let blackScore;
  if (terminal) {
    if (terminal.winner === PLAYERS.BLACK) {
      blackScore = 1_000_000;
    } else if (terminal.winner === PLAYERS.WHITE) {
      blackScore = -1_000_000;
    } else {
      blackScore = 0;
    }
  } else {
    blackScore = scoreForBlackRaw(state);
  }
  return perspective === PLAYERS.BLACK ? blackScore : -blackScore;
}

export function evaluateState(state, perspective = state.turn) {
  const terminal = getTerminalResult(state);
  let blackScore;

  if (terminal) {
    if (terminal.winner === PLAYERS.BLACK) {
      blackScore = 1_000_000;
    } else if (terminal.winner === PLAYERS.WHITE) {
      blackScore = -1_000_000;
    } else {
      blackScore = 0;
    }
  } else {
    blackScore = scoreForBlackRaw(state) * 0.68 + scoreForBlackLearned(state) * 0.32;
  }

  return perspective === PLAYERS.BLACK ? blackScore : -blackScore;
}
