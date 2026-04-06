import test from 'node:test';
import assert from 'node:assert/strict';

import { getReactionGeometry, computeBounds } from '../src/chemistry/reactionPath.js';
import { listReactionPresets } from '../src/chemistry/reactionPresets.js';
import { solveExtendedHuckel } from '../src/physics/extendedHuckel.js';
import { sampleFieldOnGrid } from '../src/physics/sampler.js';
import { reactiveBasisWeightsForTest } from '../src/physics/reactiveSpace.js';

for (const preset of listReactionPresets()) {
  test(`reactive selector picks an occupied donor and a virtual acceptor for ${preset.id}`, () => {
    const geometry = getReactionGeometry(0.5, preset.id);
    const model = solveExtendedHuckel(geometry.atoms, { totalCharge: geometry.totalCharge });
    const reactive = model.reactiveOrbitals;

    assert.ok(model.occupancies[reactive.donorIndex] > 0, `donor occupancy = ${model.occupancies[reactive.donorIndex]}`);
    assert.equal(model.occupancies[reactive.acceptorIndex], 0);
    assert.ok(reactive.donorNorm > 0.15, `donor norm = ${reactive.donorNorm}`);
    assert.ok(reactive.acceptorNorm > 0.6, `acceptor norm = ${reactive.acceptorNorm}`);
    assert.ok(reactive.donorAcceptorGap > 0, `gap = ${reactive.donorAcceptorGap}`);
  });

  test(`reactive projector ignores all hydrogen spectator basis functions for ${preset.id}`, () => {
    const geometry = getReactionGeometry(0.5, preset.id);
    const model = solveExtendedHuckel(geometry.atoms, { totalCharge: geometry.totalCharge });
    const donorWeights = reactiveBasisWeightsForTest(model, 'donor');
    const channelWeights = reactiveBasisWeightsForTest(model, 'channel');

    model.basisFunctions.forEach((basisFunction, basisIndex) => {
      if (basisFunction.element === 'H') {
        assert.equal(donorWeights[basisIndex], 0);
        assert.equal(channelWeights[basisIndex], 0);
      }
    });
  });
}

test('reactive donor and acceptor probability clouds remain normalized over the sampled box for representative presets', () => {
  const cases = ['oh-cl', 'nh2-cl', 'cl-br'];
  for (const reactionId of cases) {
    const geometry = getReactionGeometry(0.5, reactionId);
    const model = solveExtendedHuckel(geometry.atoms, { totalCharge: geometry.totalCharge });
    const bounds = computeBounds(geometry.atoms, 2.8);

    const donor = sampleFieldOnGrid({
      currentModel: model,
      atoms: geometry.atoms,
      bounds,
      resolution: 24,
      view: 'reactive-donor'
    });
    const acceptor = sampleFieldOnGrid({
      currentModel: model,
      atoms: geometry.atoms,
      bounds,
      resolution: 24,
      view: 'reactive-acceptor'
    });

    assert.ok(Math.abs(donor.stats.integral - 1) < 0.25, `${reactionId} donor integral = ${donor.stats.integral}`);
    assert.ok(Math.abs(acceptor.stats.integral - 1) < 0.25, `${reactionId} acceptor integral = ${acceptor.stats.integral}`);
  }
});

test('reactive channel density keeps only a limited subset of the 22 valence electrons', () => {
  const cases = ['oh-cl', 'sh-cl', 'cl-br'];
  for (const reactionId of cases) {
    const geometry = getReactionGeometry(0.5, reactionId);
    const model = solveExtendedHuckel(geometry.atoms, { totalCharge: geometry.totalCharge });
    const sampled = sampleFieldOnGrid({
      currentModel: model,
      atoms: geometry.atoms,
      bounds: computeBounds(geometry.atoms, 2.8),
      resolution: 22,
      view: 'reactive-channel'
    });

    assert.ok(sampled.stats.integral > 4.0, `${reactionId} reactive integral = ${sampled.stats.integral}`);
    assert.ok(sampled.stats.integral < 6.2, `${reactionId} reactive integral = ${sampled.stats.integral}`);
  }
});
