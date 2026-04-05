import { BOARD_SIZE, FILE_LABELS, RANK_LABELS } from './constants.js';

export function deepClone(value) {
  return structuredClone(value);
}

export function inBounds(x, y) {
  return x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE;
}

export function opponentOf(player) {
  return player === 'black' ? 'white' : 'black';
}

export function directionFor(owner) {
  return owner === 'black' ? -1 : 1;
}

export function coordToText(x, y) {
  return `${RANK_LABELS[y]}${FILE_LABELS[x]}`;
}

export function normalizeWorlds(worlds) {
  const total = worlds.reduce((sum, world) => sum + world.weight, 0);
  if (total === 0) {
    return worlds.map((world) => ({ ...world, weight: 1 / Math.max(worlds.length, 1) }));
  }

  return worlds.map((world) => ({
    ...world,
    weight: world.weight / total,
  }));
}

export function hashWorld(world) {
  const entries = Object.values(world.pieces)
    .map((piece) => {
      const position = piece.captured ? 'captured' : `${piece.x},${piece.y}`;
      return `${piece.id}:${position}`;
    })
    .sort();

  return entries.join('|');
}

export function mergeWorlds(worlds) {
  const merged = new Map();

  for (const world of worlds) {
    const key = hashWorld(world);
    if (!merged.has(key)) {
      merged.set(key, {
        weight: 0,
        pieces: deepClone(world.pieces),
      });
    }

    merged.get(key).weight += world.weight;
  }

  return normalizeWorlds([...merged.values()]);
}

export function stableStateHash(state) {
  const worldHash = state.worlds
    .map((world) => `${world.weight.toFixed(6)}:${hashWorld(world)}`)
    .sort()
    .join(' || ');

  return [
    state.turn,
    state.turnCount,
    state.halfmoveClock,
    `${state.charges.black}/${state.charges.white}`,
    worldHash,
    state.result ? `${state.result.winner}:${state.result.reason}` : 'live',
  ].join(' :: ');
}

export function hashStringToSeed(value) {
  const text = String(value ?? '0');
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function normalizeSeed(seed) {
  if (typeof seed === 'number' && Number.isFinite(seed)) {
    const normalized = seed >>> 0;
    return normalized || 0x9e3779b9;
  }
  return normalizeSeed(hashStringToSeed(seed));
}

export function nextSeedValue(seedInput) {
  const seed = normalizeSeed(seedInput);
  const nextSeed = (seed + 0x6d2b79f5) >>> 0;
  let t = nextSeed;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  const value = ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  return {
    seed: nextSeed,
    value,
  };
}

export function makeSeededRng(seedInput) {
  let seed = normalizeSeed(seedInput);
  return () => {
    const next = nextSeedValue(seed);
    seed = next.seed;
    return next.value;
  };
}

export function sampleByWeight(items, rng = Math.random) {
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  let threshold = rng() * total;

  for (const item of items) {
    threshold -= item.weight;
    if (threshold <= 0) {
      return item;
    }
  }

  return items.at(-1);
}

export function weightedAverage(items, selector) {
  return items.reduce((sum, item) => sum + item.weight * selector(item), 0);
}

export function formatPercent(value) {
  return `${(value * 100).toFixed(1)}%`;
}

export function formatSignedScore(value) {
  if (!Number.isFinite(value)) {
    return '∞';
  }
  const clipped = Math.abs(value) >= 100_000 ? value / 1000 : value;
  const precision = Math.abs(clipped) >= 100 ? 0 : 1;
  return `${clipped > 0 ? '+' : ''}${clipped.toFixed(precision)}`;
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function pieceSortKey(piece) {
  return `${piece.owner}-${piece.type}-${piece.id}`;
}
