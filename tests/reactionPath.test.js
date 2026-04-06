import test from 'node:test';
import assert from 'node:assert/strict';

import { getReactionGeometry } from '../src/chemistry/reactionPath.js';
import { listReactionPresets } from '../src/chemistry/reactionPresets.js';

for (const preset of listReactionPresets()) {
  test(`reaction path matches configured endpoint distances for ${preset.id}`, () => {
    const reactant = getReactionGeometry(0, preset.id);
    const product = getReactionGeometry(1, preset.id);

    assert.ok(Math.abs(reactant.metrics.nucleophileCarbonDistance - preset.nucleophile.distances.reactant) < 1e-9);
    assert.ok(Math.abs(reactant.metrics.carbonLeavingGroupDistance - preset.leavingGroup.distances.reactant) < 1e-9);
    assert.ok(Math.abs(product.metrics.nucleophileCarbonDistance - preset.nucleophile.distances.product) < 1e-9);
    assert.ok(Math.abs(product.metrics.carbonLeavingGroupDistance - preset.leavingGroup.distances.product) < 1e-9);
  });

  test(`reaction path passes through the configured SN2-like transition geometry for ${preset.id}`, () => {
    const transition = getReactionGeometry(0.5, preset.id);
    assert.ok(Math.abs(transition.metrics.nucleophileCarbonDistance - preset.nucleophile.distances.transition) < 1e-9);
    assert.ok(Math.abs(transition.metrics.carbonLeavingGroupDistance - preset.leavingGroup.distances.transition) < 1e-9);
    assert.ok(Math.abs(transition.metrics.carbonInversionX) < 1e-9);
  });

  test(`methyl inversion changes sign across the reaction coordinate for ${preset.id}`, () => {
    const reactant = getReactionGeometry(0, preset.id);
    const product = getReactionGeometry(1, preset.id);

    assert.ok(reactant.metrics.carbonInversionX < 0);
    assert.ok(product.metrics.carbonInversionX > 0);
  });

  test(`nucleophile-side hydrogen count follows the preset for ${preset.id}`, () => {
    const geometry = getReactionGeometry(0.25, preset.id);
    const expectedHydrogenCount = preset.nucleophile.hydrogens?.count ?? 0;
    const actualHydrogenCount = geometry.atoms.filter((atom) => atom.role === 'nucleophile-hydrogen').length;
    assert.equal(actualHydrogenCount, expectedHydrogenCount);
  });
}
