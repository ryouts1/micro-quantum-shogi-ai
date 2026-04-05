import test from 'node:test';
import assert from 'node:assert/strict';

import { chooseBestAction } from '../src/game/ai.js';
import { getOpeningBookRanking, getTrainingSummary } from '../src/game/model.js';
import { listLegalActions } from '../src/game/rules.js';
import { createInitialState } from '../src/game/setup.js';

test('trained model metadata is embedded in the repository', () => {
  const summary = getTrainingSummary();
  assert.ok((summary.selfPlayGames ?? 0) > 0);
  assert.ok((summary.sampledPositions ?? 0) > 0);
  assert.ok((summary.openingStates ?? 0) > 0);
});

test('learned-hybrid can use the opening book from the initial position', () => {
  const state = createInitialState({ seed: 'learned-opening-test' });
  const legalActions = listLegalActions(state);
  const ranking = getOpeningBookRanking(state, legalActions);
  assert.ok(ranking.length > 0, 'expected at least one opening-book action');

  const result = chooseBestAction(state, 'learned-hybrid', {
    perspective: state.turn,
    depth: 1,
    iterations: 60,
    seed: 'learned-opening-test',
  });

  assert.ok(result.action);
  assert.equal(result.source, 'opening-book');
}
);
