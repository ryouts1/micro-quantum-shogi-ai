import { BOARD_SIZE, PIECE_TYPES, PLAYERS } from './constants.js';
import { getCertainPosition } from './selectors.js';
import { stableStateHash } from './utils.js';
import { TRAINED_MODEL } from './trainedModel.js';

const EMPTY_TABLE = Array.from({ length: BOARD_SIZE * BOARD_SIZE }, () => 0);

function flattenIndex(x, y) {
  return y * BOARD_SIZE + x;
}

export function toOwnerRelative(x, y, owner) {
  if (owner === PLAYERS.BLACK) {
    return { x, y };
  }
  return {
    x: BOARD_SIZE - 1 - x,
    y: BOARD_SIZE - 1 - y,
  };
}

export function getTrainingSummary() {
  return TRAINED_MODEL.meta ?? {};
}

export function getTrainedModel() {
  return TRAINED_MODEL;
}

export function getPieceSquareValue(pieceType, owner, x, y) {
  const relative = toOwnerRelative(x, y, owner);
  const table = TRAINED_MODEL.pieceSquare?.[pieceType] ?? EMPTY_TABLE;
  return table[flattenIndex(relative.x, relative.y)] ?? 0;
}

export function computePieceSquareScore(state, owner) {
  return state.worlds.reduce((total, world) => {
    const worldScore = Object.values(world.pieces)
      .filter((piece) => piece.owner === owner && !piece.captured)
      .reduce((sum, piece) => sum + getPieceSquareValue(piece.type, piece.owner, piece.x, piece.y), 0);
    return total + world.weight * worldScore;
  }, 0);
}

function actionProfileKey(action) {
  if (action.type === 'observe') {
    return `observe:${action.pieceType}`;
  }
  return `move:${action.mode}:${action.pieceType}`;
}

export function getActionModelBias(state, action) {
  const profiles = TRAINED_MODEL.actionProfiles ?? {};
  let bias = 0;

  const modeKey = action.type === 'observe' ? 'observe' : action.mode;
  bias += profiles.base?.[modeKey] ?? 0;
  bias += profiles.byPiece?.[actionProfileKey(action)] ?? 0;

  if (action.type === 'move' && action.targetId) {
    const targetType = state.worlds[0]?.pieces?.[action.targetId]?.type;
    if (targetType) {
      bias += profiles.captureTarget?.[targetType] ?? 0;
    }
  }

  if (action.type === 'move') {
    const from = getCertainPosition(state, action.pieceId);
    if (from) {
      const fromValue = getPieceSquareValue(action.pieceType, action.pieceOwner, from.x, from.y);
      if (action.mode === 'classical') {
        const toValue = getPieceSquareValue(action.pieceType, action.pieceOwner, action.to.x, action.to.y);
        bias += (toValue - fromValue) * 0.065;
      } else if (action.mode === 'quantum') {
        const branchValue = action.branches.reduce((sum, branch) => (
          sum + getPieceSquareValue(action.pieceType, action.pieceOwner, branch.x, branch.y)
        ), 0) / action.branches.length;
        bias += (branchValue - fromValue) * 0.05;
      }
    }
  }

  const priorScale = TRAINED_MODEL.meta?.priorScale ?? 48;
  return bias * priorScale;
}

export function getOpeningBookEntry(state) {
  const key = stableStateHash(state);
  return TRAINED_MODEL.openingBook?.[key] ?? null;
}

export function getOpeningBookRanking(state, legalActions = []) {
  const entry = getOpeningBookEntry(state);
  if (!entry?.actions?.length) {
    return [];
  }

  const legalByKey = new Map(legalActions.map((action) => {
    const key = action.type === 'observe'
      ? `observe:${action.pieceId}`
      : action.mode === 'classical'
        ? `move:${action.pieceId}:${action.to.x},${action.to.y}`
        : `quantum:${action.pieceId}:${[...action.branches].map((branch) => `${branch.x},${branch.y}`).sort().join('|')}`;
    return [key, action];
  }));

  return entry.actions
    .map((candidate) => {
      const action = legalByKey.get(candidate.key);
      if (!action) {
        return null;
      }
      return {
        ...candidate,
        action,
        value: (candidate.score ?? 0) * 260,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || b.plays - a.plays);
}

export function getFeatureWeight(featureKey) {
  return TRAINED_MODEL.linear?.weights?.[featureKey] ?? 0;
}

export function getLinearBias() {
  return TRAINED_MODEL.linear?.bias ?? 0;
}

export function getAllFeatureWeights() {
  return TRAINED_MODEL.linear?.weights ?? {};
}

export const TRAINABLE_PIECE_TYPES = [
  PIECE_TYPES.KING,
  PIECE_TYPES.ROOK,
  PIECE_TYPES.BISHOP,
  PIECE_TYPES.GOLD,
  PIECE_TYPES.SILVER,
  PIECE_TYPES.PAWN,
];
