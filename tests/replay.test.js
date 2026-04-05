import test from 'node:test';
import assert from 'node:assert/strict';

import { createReplayEntry, deserializeReplay, serializeReplay } from '../src/game/replay.js';
import { createInitialState } from '../src/game/setup.js';

test('replay serialization keeps variant metadata and entries', () => {
  const state = createInitialState({ seed: 2026 });
  const entries = [createReplayEntry(state, null, 'test')];
  const json = serializeReplay(entries, { label: 'unit-test' });
  const parsed = deserializeReplay(json);

  assert.equal(parsed.meta.variant, 'micro-quantum-shogi');
  assert.equal(parsed.meta.label, 'unit-test');
  assert.equal(parsed.entries.length, 1);
  assert.equal(parsed.entries[0].note, 'test');
});
