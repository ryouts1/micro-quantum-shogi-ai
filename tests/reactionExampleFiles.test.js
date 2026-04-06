import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { parseReactionLibraryText } from '../src/chemistry/reactionSchema.js';
import { getReactionGeometry } from '../src/chemistry/reactionPath.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const examplesDir = path.resolve(__dirname, '../examples/reactions');

test('bundled reaction JSON examples all parse and build a representative geometry', async () => {
  const filenames = (await readdir(examplesDir))
    .filter((name) => name.endsWith('.json'))
    .sort();

  assert.ok(filenames.length >= 5);

  for (const filename of filenames) {
    const sourceText = await readFile(path.join(examplesDir, filename), 'utf8');
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
