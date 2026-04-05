import { PIECE_LABELS, PIECE_VALUES } from './constants.js';
import { coordToText, formatPercent, pieceSortKey, weightedAverage } from './utils.js';

export function getPieceWorldEntries(state, pieceId) {
  return state.worlds
    .map((world) => ({
      weight: world.weight,
      piece: world.pieces[pieceId],
    }))
    .filter(({ piece }) => Boolean(piece));
}

export function isPieceAliveInAnyWorld(state, pieceId) {
  return getPieceWorldEntries(state, pieceId).some(({ piece }) => !piece.captured);
}

export function getPieceDistribution(state, pieceId) {
  const totals = new Map();

  for (const { weight, piece } of getPieceWorldEntries(state, pieceId)) {
    const key = piece.captured ? 'captured' : `${piece.x},${piece.y}`;
    if (!totals.has(key)) {
      totals.set(key, 0);
    }
    totals.set(key, totals.get(key) + weight);
  }

  return [...totals.entries()]
    .map(([key, probability]) => {
      if (key === 'captured') {
        return {
          kind: 'captured',
          probability,
          label: `捕獲済み ${formatPercent(probability)}`,
        };
      }

      const [xText, yText] = key.split(',');
      const x = Number(xText);
      const y = Number(yText);
      return {
        kind: 'square',
        x,
        y,
        probability,
        label: `${coordToText(x, y)} ${formatPercent(probability)}`,
      };
    })
    .sort((a, b) => b.probability - a.probability);
}

export function getCertainPosition(state, pieceId) {
  const distribution = getPieceDistribution(state, pieceId);
  if (distribution.length !== 1) {
    return null;
  }

  const only = distribution[0];
  if (only.kind !== 'square' || only.probability < 0.999999) {
    return null;
  }

  return { x: only.x, y: only.y };
}

export function isPieceCertain(state, pieceId) {
  return Boolean(getCertainPosition(state, pieceId));
}

export function getAllPieceIds(state) {
  const ids = new Set();
  for (const world of state.worlds) {
    for (const pieceId of Object.keys(world.pieces)) {
      ids.add(pieceId);
    }
  }
  return [...ids].sort();
}

export function getCertainPieceIds(state, owner = null) {
  return getAllPieceIds(state).filter((pieceId) => {
    const entries = getPieceWorldEntries(state, pieceId);
    if (entries.length === 0) {
      return false;
    }
    const sample = entries[0].piece;
    if (owner && sample.owner !== owner) {
      return false;
    }
    return Boolean(getCertainPosition(state, pieceId));
  });
}

export function getUncertainPieceIds(state) {
  return getAllPieceIds(state).filter((pieceId) => {
    const distribution = getPieceDistribution(state, pieceId);
    return distribution.length > 1;
  });
}

export function getExpectedPieceValue(state, owner) {
  return weightedAverage(state.worlds, (world) =>
    Object.values(world.pieces)
      .filter((piece) => piece.owner === owner && !piece.captured)
      .reduce((sum, piece) => sum + PIECE_VALUES[piece.type], 0),
  );
}

export function getOccupancySummary(state) {
  const cells = new Map();

  for (const world of state.worlds) {
    for (const piece of Object.values(world.pieces)) {
      if (piece.captured) {
        continue;
      }

      const cellKey = `${piece.x},${piece.y}`;
      if (!cells.has(cellKey)) {
        cells.set(cellKey, new Map());
      }

      const pieceMap = cells.get(cellKey);
      if (!pieceMap.has(piece.id)) {
        pieceMap.set(piece.id, {
          id: piece.id,
          owner: piece.owner,
          type: piece.type,
          label: PIECE_LABELS[piece.type],
          probability: 0,
        });
      }

      pieceMap.get(piece.id).probability += world.weight;
    }
  }

  const result = new Map();
  for (const [cellKey, pieceMap] of cells.entries()) {
    result.set(
      cellKey,
      [...pieceMap.values()]
        .sort((a, b) => b.probability - a.probability || pieceSortKey(a).localeCompare(pieceSortKey(b))),
    );
  }

  return result;
}

export function getCellSummary(state, x, y) {
  return getOccupancySummary(state).get(`${x},${y}`) ?? [];
}

export function getCertainPieceAt(state, x, y) {
  const summary = getCellSummary(state, x, y);
  if (summary.length !== 1) {
    return null;
  }

  const only = summary[0];
  if (only.probability < 0.999999) {
    return null;
  }

  return only;
}

export function getPieceInfo(state, pieceId) {
  const entries = getPieceWorldEntries(state, pieceId);
  if (entries.length === 0) {
    return null;
  }

  const sample = entries[0].piece;
  const distribution = getPieceDistribution(state, pieceId);
  return {
    id: pieceId,
    owner: sample.owner,
    type: sample.type,
    label: PIECE_LABELS[sample.type],
    certain: distribution.length === 1 && distribution[0].kind === 'square',
    distribution,
  };
}

export function getKingsAlive(state) {
  const ids = ['b-king', 'w-king'];
  return Object.fromEntries(
    ids.map((pieceId) => [pieceId, isPieceAliveInAnyWorld(state, pieceId)]),
  );
}

export function summarizeWorlds(state) {
  return state.worlds.map((world, index) => ({
    index,
    weight: world.weight,
    pieces: Object.values(world.pieces)
      .filter((piece) => !piece.captured)
      .map((piece) => `${piece.id}@${coordToText(piece.x, piece.y)}`)
      .sort(),
  }));
}
