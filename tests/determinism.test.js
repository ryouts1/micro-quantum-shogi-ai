import test from 'node:test';
import assert from 'node:assert/strict';

import { chooseBestActionMcts } from '../src/game/ai.js';
import { computeBeliefEntropy } from '../src/game/analysis.js';
import { actionToKey, applyAction, applyDeterministicAction, listLegalActions } from '../src/game/rules.js';
import { createInitialState } from '../src/game/setup.js';
import { stableStateHash } from '../src/game/utils.js';

test('observation uses the state seed when no rng override is supplied', () => {
  const state = createInitialState({ seed: 12345 });
  const quantumAction = listLegalActions(state).find((candidate) => candidate.mode === 'quantum');
  assert.ok(quantumAction, 'expected a quantum action');

  const branched = applyDeterministicAction(state, quantumAction);
  const observeAction = listLegalActions(branched).find((candidate) => candidate.type === 'observe');
  assert.ok(observeAction, 'expected an observe action');

  const first = applyAction(branched, observeAction);
  const second = applyAction(branched, observeAction);

  assert.equal(stableStateHash(first), stableStateHash(second));
  assert.equal(first.rngState, second.rngState);
});

test('MCTS is deterministic when the seed is fixed', () => {
  const state = createInitialState({ seed: 7 });
  const resultA = chooseBestActionMcts(state, { perspective: state.turn, iterations: 80, seed: 'fixed-seed' });
  const resultB = chooseBestActionMcts(state, { perspective: state.turn, iterations: 80, seed: 'fixed-seed' });

  assert.ok(resultA.action);
  assert.equal(actionToKey(resultA.action), actionToKey(resultB.action));
  assert.equal(JSON.stringify(resultA.ranking), JSON.stringify(resultB.ranking));
});

test('branching into two equal worlds creates one bit of entropy', () => {
  const state = createInitialState({ seed: 99 });
  const quantumAction = listLegalActions(state).find((candidate) => candidate.mode === 'quantum');
  const branched = applyDeterministicAction(state, quantumAction);

  assert.equal(computeBeliefEntropy(branched).toFixed(2), '1.00');
});
