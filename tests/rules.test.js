import test from 'node:test';
import assert from 'node:assert/strict';

import { PLAYERS } from '../src/game/constants.js';
import { createInitialState } from '../src/game/setup.js';
import { applyAction, applyDeterministicAction, getObserveOutcomes, listLegalActions } from '../src/game/rules.js';

test('initial state exposes legal actions for the opening player', () => {
  const state = createInitialState();
  const actions = listLegalActions(state);
  assert.ok(actions.length > 0);
  assert.ok(actions.some((action) => action.mode === 'classical'));
  assert.ok(actions.some((action) => action.mode === 'quantum'));
});

test('quantum move splits the state into two weighted worlds and spends one charge', () => {
  const state = createInitialState();
  const action = listLegalActions(state).find((candidate) => candidate.mode === 'quantum');
  assert.ok(action, 'expected at least one quantum action');

  const next = applyDeterministicAction(state, action);
  assert.equal(next.worlds.length, 2);
  assert.equal(next.charges.black, state.charges.black - 1);
  assert.equal(next.turn, PLAYERS.WHITE);
  assert.equal(next.worlds[0].weight + next.worlds[1].weight, 1);
});

test('observe action collapses a branched state into one world', () => {
  const state = createInitialState();
  const quantumAction = listLegalActions(state).find((candidate) => candidate.mode === 'quantum');
  const branched = applyDeterministicAction(state, quantumAction);
  const observeAction = listLegalActions(branched).find((candidate) => candidate.type === 'observe');
  assert.ok(observeAction, 'expected an observe action after branching');

  const outcomes = getObserveOutcomes(branched, observeAction);
  assert.equal(outcomes.length, 2);

  const collapsed = applyAction(branched, observeAction, { rng: () => 0.01 });
  assert.equal(collapsed.worlds.length, 1);
  assert.equal(collapsed.turn, PLAYERS.BLACK);
});
