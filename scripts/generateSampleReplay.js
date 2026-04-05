import { writeFile } from 'node:fs/promises';

import { chooseBestAction } from '../src/game/ai.js';
import { createReplayEntry, serializeReplay } from '../src/game/replay.js';
import { applyAction } from '../src/game/rules.js';
import { createInitialState } from '../src/game/setup.js';

let state = createInitialState({ seed: 'sample-replay' });
const history = [createReplayEntry(state, null, 'AI sample replay')];

for (let ply = 0; ply < 28 && !state.result; ply += 1) {
  const engine = state.turn === 'black' ? 'learned-hybrid' : 'mcts';
  const result = chooseBestAction(state, engine, {
    perspective: state.turn,
    depth: 1,
    iterations: engine === 'learned-hybrid' ? 90 : 70,
    seed: `sample::${ply}::${engine}`,
  });

  if (!result.action) {
    break;
  }

  state = applyAction(state, result.action);
  history.push(createReplayEntry(state, result.action));
}

const payload = serializeReplay(history, {
  label: 'sample-ai-duel',
  generatedBy: 'scripts/generateSampleReplay.js',
  controllers: {
    black: 'learned-hybrid',
    white: 'mcts',
  },
});

await writeFile(new URL('../sample-data/replays/ai-duel.json', import.meta.url), payload, 'utf8');
console.log(`Wrote ${history.length} replay entries.`);
