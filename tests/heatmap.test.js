import test from 'node:test';
import assert from 'node:assert/strict';

import { createInitialState } from '../src/game/setup.js';
import { getCertainPieceIds } from '../src/game/selectors.js';
import { computeHeatmapForPiece } from '../src/game/heatmap.js';

test('heatmap returns at least one classical destination for a movable opening piece', () => {
  const state = createInitialState();
  const pieceId = getCertainPieceIds(state, state.turn)[0];
  const heatmap = computeHeatmapForPiece(state, pieceId, { depth: 1, iterations: 40 });
  assert.ok(Array.isArray(heatmap.cells));
  assert.ok(Array.isArray(heatmap.quantumRanking));
});
