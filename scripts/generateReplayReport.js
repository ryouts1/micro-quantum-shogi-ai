import { readFile, writeFile } from 'node:fs/promises';

import { computeBeliefEntropy } from '../src/game/analysis.js';

const replayText = await readFile(new URL('../sample-data/replays/ai-duel.json', import.meta.url), 'utf8');
const replay = JSON.parse(replayText);
const entries = replay.entries ?? [];
const last = entries.at(-1);

const plies = Math.max(entries.length - 1, 0);
const quantumMoves = entries.filter((entry) => entry.action?.mode === 'quantum').length;
const observeMoves = entries.filter((entry) => entry.action?.type === 'observe').length;
const maxWorlds = entries.reduce((max, entry) => Math.max(max, entry.state.worlds.length), 0);
const avgWorlds = entries.length ? entries.reduce((sum, entry) => sum + entry.state.worlds.length, 0) / entries.length : 0;
const avgEntropy = entries.length ? entries.reduce((sum, entry) => sum + computeBeliefEntropy(entry.state), 0) / entries.length : 0;

const report = {
  generatedAt: new Date().toISOString(),
  variant: 'micro-quantum-shogi',
  sourceReplay: replay.meta?.label ?? 'unknown',
  plies,
  quantumMoves,
  observeMoves,
  maxWorlds,
  averageWorlds: Number(avgWorlds.toFixed(2)),
  averageEntropy: Number(avgEntropy.toFixed(2)),
  finalResult: last?.state?.result ?? null,
  controllers: replay.meta?.controllers ?? null,
};

await writeFile(new URL('../sample-data/reports/sample-replay-report.json', import.meta.url), JSON.stringify(report, null, 2), 'utf8');
console.log('Wrote sample replay report.');
