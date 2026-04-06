import test from 'node:test';
import assert from 'node:assert/strict';

import { getReactionGeometry } from '../src/chemistry/reactionPath.js';
import { buildValenceBasis, overlapIntegral } from '../src/physics/gaussianBasis.js';

test('buildValenceBasis creates the expected basis sizes for representative presets', () => {
  const ohCl = buildValenceBasis(getReactionGeometry(0, 'oh-cl').atoms, { totalCharge: -1 });
  const nh2Cl = buildValenceBasis(getReactionGeometry(0, 'nh2-cl').atoms, { totalCharge: -1 });
  const clBr = buildValenceBasis(getReactionGeometry(0, 'cl-br').atoms, { totalCharge: -1 });

  assert.equal(ohCl.functions.length, 16);
  assert.equal(nh2Cl.functions.length, 17);
  assert.equal(clBr.functions.length, 15);
  assert.equal(ohCl.electronCount, 22);
  assert.equal(nh2Cl.electronCount, 22);
  assert.equal(clBr.electronCount, 22);
});

test('basis functions are normalized on their own center across heavier-element presets', () => {
  const geometries = [
    getReactionGeometry(0.5, 'oh-i'),
    getReactionGeometry(0.5, 'sh-cl'),
    getReactionGeometry(0.5, 'nh2-cl')
  ];

  for (const geometry of geometries) {
    const basis = buildValenceBasis(geometry.atoms, { totalCharge: geometry.totalCharge }).functions;
    for (const basisFunction of basis) {
      const selfOverlap = overlapIntegral(basisFunction, basisFunction);
      assert.ok(Math.abs(selfOverlap - 1) < 1e-10, `${basisFunction.id} self-overlap = ${selfOverlap}`);
    }
  }
});
