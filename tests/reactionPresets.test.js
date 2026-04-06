import test from 'node:test';
import assert from 'node:assert/strict';

import { listReactionPresets, getReactionPreset, hasReactionPreset } from '../src/chemistry/reactionPresets.js';

test('reaction preset library exposes multiple analogous SN2 cases', () => {
  const presets = listReactionPresets();
  assert.ok(presets.length >= 6);
  assert.equal(new Set(presets.map((preset) => preset.id)).size, presets.length);
  assert.ok(hasReactionPreset('oh-cl'));
  assert.equal(getReactionPreset('missing-id').id, 'oh-cl');
});
