import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';

import { parseReactionLibraryText } from '../src/chemistry/reactionSchema.js';
import { listBuiltInReactionPresets } from '../src/chemistry/reactionPresets.js';

const examplesDir = new URL('../examples/reactions/', import.meta.url);

test('bundled reaction JSON examples all parse successfully', async () => {
  const files = (await readdir(examplesDir)).filter((file) => file.endsWith('.json')).sort();
  assert.ok(files.length >= 6);

  for (const file of files) {
    const text = await readFile(new URL(file, examplesDir), 'utf8');
    const library = parseReactionLibraryText(text, { source: 'custom', libraryName: file });
    assert.ok(library.reactions.length >= 1, `${file} should contain at least one reaction.`);
  }
});

test('bundled reaction JSON example ids do not collide with built-in ids', async () => {
  const builtInIds = new Set(listBuiltInReactionPresets().map((preset) => preset.id));
  const files = (await readdir(examplesDir)).filter((file) => file.endsWith('.json')).sort();

  for (const file of files) {
    const text = await readFile(new URL(file, examplesDir), 'utf8');
    const library = parseReactionLibraryText(text, { source: 'custom', libraryName: file });
    for (const preset of library.reactions) {
      assert.equal(builtInIds.has(preset.id), false, `${file} should not reuse built-in id ${preset.id}`);
    }
  }
});
