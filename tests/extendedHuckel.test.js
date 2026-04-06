import test from 'node:test';
import assert from 'node:assert/strict';

import { getReactionGeometry } from '../src/chemistry/reactionPath.js';
import { countValenceElectrons } from '../src/chemistry/elements.js';
import { listReactionPresets } from '../src/chemistry/reactionPresets.js';
import { solveExtendedHuckel, evaluateDensityAtPoint } from '../src/physics/extendedHuckel.js';

for (const preset of listReactionPresets()) {
  test(`electron count and net charge are preserved for ${preset.id}`, () => {
    const geometry = getReactionGeometry(0.5, preset.id);
    const expectedValenceElectrons = countValenceElectrons(geometry.atoms, geometry.totalCharge);
    const model = solveExtendedHuckel(geometry.atoms, { totalCharge: geometry.totalCharge });
    assert.ok(Math.abs(model.electronCountCheck - expectedValenceElectrons) < 1e-8);

    const totalCharge = Object.values(model.charges).reduce((sum, charge) => sum + charge, 0);
    assert.ok(Math.abs(totalCharge - geometry.totalCharge) < 1e-8);
  });

  test(`reactive bond populations swap between reactants and products for ${preset.id}`, () => {
    const reactantGeometry = getReactionGeometry(0, preset.id);
    const productGeometry = getReactionGeometry(1, preset.id);
    const reactantModel = solveExtendedHuckel(reactantGeometry.atoms, { totalCharge: reactantGeometry.totalCharge });
    const productModel = solveExtendedHuckel(productGeometry.atoms, { totalCharge: productGeometry.totalCharge });

    assert.ok(productModel.overlapPopulations.nucleophileCarbon > reactantModel.overlapPopulations.nucleophileCarbon);
    assert.ok(productModel.overlapPopulations.carbonLeavingGroup < reactantModel.overlapPopulations.carbonLeavingGroup);
  });
}

test('density evaluated from the density matrix stays non-negative at sampled points for representative presets', () => {
  const cases = ['oh-cl', 'sh-cl', 'cl-br'];
  const points = [
    { x: 0, y: 0, z: 0 },
    { x: -2, y: 0, z: 0 },
    { x: 2, y: 0.3, z: -0.4 },
    { x: 0.2, y: 1.1, z: 0.7 }
  ];

  for (const reactionId of cases) {
    const geometry = getReactionGeometry(0.5, reactionId);
    const model = solveExtendedHuckel(geometry.atoms, { totalCharge: geometry.totalCharge });
    for (const point of points) {
      const density = evaluateDensityAtPoint(model, point);
      assert.ok(density >= -1e-10, `${reactionId} density(${JSON.stringify(point)}) = ${density}`);
    }
  }
});
