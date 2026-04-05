import test from 'node:test';
import assert from 'node:assert/strict';

import { PLAYERS, PIECE_TYPES } from '../src/game/constants.js';
import { chooseBestActionExpectiminimax } from '../src/game/ai.js';

function createMinimalCaptureState() {
  const pieces = {
    'b-king': { id: 'b-king', owner: PLAYERS.BLACK, type: PIECE_TYPES.KING, x: 0, y: 4, captured: false },
    'w-king': { id: 'w-king', owner: PLAYERS.WHITE, type: PIECE_TYPES.KING, x: 4, y: 0, captured: false },
    'b-rook': { id: 'b-rook', owner: PLAYERS.BLACK, type: PIECE_TYPES.ROOK, x: 4, y: 3, captured: false },
  };

  return {
    turn: PLAYERS.BLACK,
    worlds: [{ weight: 1, pieces }],
    charges: { black: 1, white: 1 },
    turnCount: 1,
    halfmoveClock: 0,
    maxTurns: 120,
    noProgressLimit: 40,
    result: null,
    meta: { variant: 'micro-quantum-shogi' },
  };
}

test('expectiminimax captures the king when a direct capture exists', () => {
  const state = createMinimalCaptureState();
  const result = chooseBestActionExpectiminimax(state, { depth: 2, perspective: PLAYERS.BLACK });
  assert.ok(result.action, 'expected an action');
  assert.equal(result.action.mode, 'classical');
  assert.equal(result.action.targetId, 'w-king');
  assert.equal(result.action.to.x, 4);
  assert.equal(result.action.to.y, 0);
});
