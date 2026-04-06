import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';

import { parseReactionLibraryText } from '../src/chemistry/reactionSchema.js';
import { getReactionGeometry } from '../src/chemistry/reactionPath.js';

const examplesDir = new URL('../examples/reactions/', import.meta.url);

test('all bundled reaction JSON examples parse successfully', async () => {
  const entries = await readdir(examplesDir, { withFileTypes: true });
  const jsonFiles = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
    .map((entry) => entry.name)
    .sort();

  assert.ok(jsonFiles.length >= 5, 'expected multiple bundled JSON examples');

  for (const filename of jsonFiles) {
    const sourceText = await readFile(new URL(filename, examplesDir), 'utf8');
    const library = parseReactionLibraryText(sourceText, { source: 'custom' });
    assert.ok(library.reactions.length >= 1, `${filename} should contain at least one reaction`);

    for (const reaction of library.reactions) {
      const geometry = getReactionGeometry(0.5, reaction);
      assert.equal(geometry.reaction.id, reaction.id);
      assert.ok(Number.isFinite(geometry.metrics.nucleophileCarbonDistance));
      assert.ok(Number.isFinite(geometry.metrics.carbonLeavingGroupDistance));
    }
  }
});
