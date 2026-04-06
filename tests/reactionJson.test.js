import test from 'node:test';
import assert from 'node:assert/strict';

import { parseReactionLibraryText } from '../src/chemistry/reactionSchema.js';
import {
  importReactionLibraryFromText,
  resetCustomReactionPresets,
  hasReactionPreset,
  getReactionPreset,
  listCustomReactionPresets
} from '../src/chemistry/reactionPresets.js';
import { getReactionGeometry } from '../src/chemistry/reactionPath.js';

const CUSTOM_LIBRARY_TEXT = JSON.stringify({
  schemaVersion: 1,
  name: 'Custom analogous methyl SN2 reactions',
  reactions: [
    {
      id: 'custom-test-f-i',
      family: 'methyl-sn2',
      title: 'F⁻ + CH₃I → CH₃F + I⁻',
      shortTitle: 'Fluoride + methyl iodide',
      description: 'Custom JSON example for halide displacement.',
      substrateLabel: 'methyl iodide',
      productLabel: 'fluoromethane + iodide',
      totalCharge: -1,
      nucleophile: {
        symbol: 'F',
        display: 'F⁻',
        atomLabel: 'F',
        element: 'F',
        productFragment: 'CH₃F',
        distances: {
          reactant: 3.1,
          transition: 2.05,
          product: 1.38
        },
        hydrogens: null
      },
      leavingGroup: {
        symbol: 'I',
        display: 'I⁻',
        atomLabel: 'I',
        element: 'I',
        distances: {
          reactant: 2.14,
          transition: 2.05,
          product: 4.35
        }
      }
    }
  ]
});

test('reaction JSON parser normalizes the supported methyl SN2 schema', () => {
  const library = parseReactionLibraryText(CUSTOM_LIBRARY_TEXT, { source: 'custom' });
  assert.equal(library.schemaVersion, 1);
  assert.equal(library.reactions.length, 1);
  assert.equal(library.reactions[0].id, 'custom-test-f-i');
  assert.equal(library.reactions[0].source, 'custom');
  assert.equal(library.reactions[0].nucleophile.element, 'F');
  assert.equal(library.reactions[0].leavingGroup.element, 'I');
});

test('custom reaction JSON can be imported into the runtime preset registry', () => {
  resetCustomReactionPresets();
  try {
    const imported = importReactionLibraryFromText(CUSTOM_LIBRARY_TEXT, { source: 'custom', replace: true });
    assert.equal(imported.reactions.length, 1);
    assert.equal(listCustomReactionPresets().length, 1);
    assert.ok(hasReactionPreset('custom-test-f-i'));
    assert.equal(getReactionPreset('custom-test-f-i').source, 'custom');
  } finally {
    resetCustomReactionPresets();
  }
});

test('reaction geometry can be built directly from a JSON-derived reaction object', () => {
  const library = parseReactionLibraryText(CUSTOM_LIBRARY_TEXT, { source: 'custom' });
  const geometry = getReactionGeometry(0.5, library.reactions[0]);
  assert.equal(geometry.reaction.id, 'custom-test-f-i');
  assert.equal(geometry.atoms.filter((atom) => atom.role === 'nucleophile-hydrogen').length, 0);
  assert.ok(Math.abs(geometry.metrics.nucleophileCarbonDistance - 2.05) < 1e-9);
  assert.ok(Math.abs(geometry.metrics.carbonLeavingGroupDistance - 2.05) < 1e-9);
});

test('reaction JSON parser rejects unsupported families', () => {
  assert.throws(() => parseReactionLibraryText(JSON.stringify({
    schemaVersion: 1,
    reactions: [
      {
        id: 'bad-family',
        family: 'diels-alder',
        title: 'Unsupported reaction',
        substrateLabel: 'example substrate',
        productLabel: 'example product',
        totalCharge: 0,
        nucleophile: {
          symbol: 'O',
          display: 'O',
          atomLabel: 'O',
          element: 'O',
          distances: { reactant: 3, transition: 2, product: 1.4 },
          hydrogens: null
        },
        leavingGroup: {
          symbol: 'Cl',
          display: 'Cl',
          atomLabel: 'Cl',
          element: 'Cl',
          distances: { reactant: 1.8, transition: 2.0, product: 4 }
        }
      }
    ]
  })), /not supported yet/);
});
