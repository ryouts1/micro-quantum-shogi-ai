import {
  INITIAL_PIECES,
  INITIAL_QUANTUM_CHARGES,
  MAX_TURNS,
  NO_PROGRESS_LIMIT,
  PLAYERS,
} from './constants.js';
import { deepClone, normalizeSeed } from './utils.js';

export function createInitialWorld() {
  const pieces = Object.fromEntries(
    INITIAL_PIECES.map((piece) => [
      piece.id,
      {
        ...piece,
        captured: false,
      },
    ]),
  );

  return {
    weight: 1,
    pieces,
  };
}

export function createInitialState(options = {}) {
  const {
    seed = 'micro-quantum-shogi',
  } = options;

  return {
    turn: PLAYERS.BLACK,
    worlds: [createInitialWorld()],
    charges: {
      [PLAYERS.BLACK]: INITIAL_QUANTUM_CHARGES,
      [PLAYERS.WHITE]: INITIAL_QUANTUM_CHARGES,
    },
    turnCount: 1,
    halfmoveClock: 0,
    maxTurns: MAX_TURNS,
    noProgressLimit: NO_PROGRESS_LIMIT,
    result: null,
    rngState: normalizeSeed(seed),
    meta: {
      variant: 'micro-quantum-shogi',
      seed: normalizeSeed(seed),
    },
  };
}

export function cloneState(state) {
  return deepClone(state);
}
