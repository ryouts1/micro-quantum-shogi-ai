import test from 'node:test';
import assert from 'node:assert/strict';

import { getReactionGeometry, computeBounds } from '../src/chemistry/reactionPath.js';
import { computeReactionSnapshot, sampleFieldOnGrid } from '../src/physics/sampler.js';

for (const reactionId of ['oh-cl', 'oh-i', 'nh2-cl', 'cl-br']) {
  test(`valence density integrates to the expected 22 electrons for ${reactionId}`, () => {
    const geometry = getReactionGeometry(0.5, reactionId);
    const model = computeReactionSnapshot(geometry);
    const sampled = sampleFieldOnGrid({
      currentModel: model,
      atoms: geometry.atoms,
      bounds: computeBounds(geometry.atoms, 2.8),
      resolution: 18,
      view: 'valence-density'
    });

    assert.ok(Math.abs(sampled.stats.integral - 22) < 1.2, `${reactionId} integral = ${sampled.stats.integral}`);
  });
}

test('reactive flow integral stays small because the channel mostly redistributes density', () => {
  const geometry = getReactionGeometry(0.75, 'oh-cl');
  const currentModel = computeReactionSnapshot(geometry);
  const referenceModel = computeReactionSnapshot(getReactionGeometry(0, 'oh-cl'));
  const sampled = sampleFieldOnGrid({
    currentModel,
    referenceModel,
    atoms: geometry.atoms,
    bounds: computeBounds(geometry.atoms, 2.8),
    resolution: 20,
    view: 'reactive-flow'
  });

  assert.ok(Math.abs(sampled.stats.integral) < 0.35, `reactive flow integral = ${sampled.stats.integral}`);
});

test('reactive donor probability carries signed phase information and positive weight', () => {
  const geometry = getReactionGeometry(0.5, 'cl-br');
  const model = computeReactionSnapshot(geometry);
  const sampled = sampleFieldOnGrid({
    currentModel: model,
    atoms: geometry.atoms,
    bounds: computeBounds(geometry.atoms, 2.8),
    resolution: 24,
    view: 'reactive-donor'
  });

  assert.ok(Math.abs(sampled.stats.integral - 1) < 0.2, `integral = ${sampled.stats.integral}`);
  assert.ok(sampled.stats.signedMode, 'reactive donor view should carry signed phase information.');
  assert.ok(sampled.stats.maximumWeight > 0, 'Probability field should be positive somewhere.');
});
