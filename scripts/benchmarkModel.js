import { rename, writeFile } from 'node:fs/promises';

import { chooseBestAction } from '../src/game/ai.js';
import { TRAINED_MODEL } from '../src/game/trainedModel.js';
import { applyAction } from '../src/game/rules.js';
import { createInitialState } from '../src/game/setup.js';

function readCliArgs(argv) {
  const result = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) {
      continue;
    }
    const key = token.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith('--')) {
      result[key] = 'true';
      continue;
    }
    result[key] = next;
    index += 1;
  }
  return result;
}

const cli = readCliArgs(process.argv.slice(2));

function readNumber(name, fallback) {
  const raw = cli[name] ?? process.env[`BENCH_${name.toUpperCase().replaceAll('-', '_')}`];
  if (raw == null || raw === '') {
    return fallback;
  }
  const value = Number(raw);
  return Number.isFinite(value) ? value : fallback;
}

const BENCHMARK_CONFIG = {
  gamesPerMatchup: readNumber('games-per-matchup', 1),
  maxPlies: readNumber('max-plies', 20),
  matchups: [
    { label: 'learned-black-vs-expect', black: 'learned-hybrid', white: 'expectiminimax' },
    { label: 'expect-black-vs-learned', black: 'expectiminimax', white: 'learned-hybrid' },
    { label: 'learned-black-vs-mcts', black: 'learned-hybrid', white: 'mcts' },
    { label: 'mcts-black-vs-learned', black: 'mcts', white: 'learned-hybrid' },
  ],
  engineSettings: {
    'expectiminimax': { depth: readNumber('expect-depth', 1) },
    'mcts': { iterations: readNumber('mcts-iters', 40) },
    'learned-hybrid': { depth: readNumber('learned-depth', 1), iterations: readNumber('learned-iters', 60) },
  },
};

function buildModelModuleText(model) {
  return `export const TRAINED_MODEL = ${JSON.stringify(model, null, 2)};\n`;
}

async function writeAtomic(url, content) {
  const tempUrl = new URL(`${url.href}.tmp`);
  await writeFile(tempUrl, content, 'utf8');
  await rename(tempUrl, url);
}

function playBenchmarkGame(matchup, index) {
  let state = createInitialState({ seed: `${matchup.label}::${index}` });
  let plies = 0;

  while (!state.result && plies < BENCHMARK_CONFIG.maxPlies) {
    const engine = state.turn === 'black' ? matchup.black : matchup.white;
    const result = chooseBestAction(state, engine, {
      perspective: state.turn,
      seed: `benchmark::${matchup.label}::${index}::${plies}`,
      ...BENCHMARK_CONFIG.engineSettings[engine],
    });
    if (!result.action) {
      break;
    }
    state = applyAction(state, result.action);
    plies += 1;
  }

  const learnedSide = matchup.black === 'learned-hybrid' ? 'black' : 'white';
  const winner = state.result?.winner ?? 'draw';
  const learnedPoint = winner === 'draw'
    ? 0.5
    : winner === learnedSide ? 1 : 0;

  return {
    label: matchup.label,
    black: matchup.black,
    white: matchup.white,
    learnedSide,
    winner,
    reason: state.result?.reason ?? 'max-ply',
    plies,
    learnedPoint,
  };
}

function tallyRecord(games, learnedSide) {
  const filtered = games.filter((game) => game.learnedSide === learnedSide);
  const wins = filtered.filter((game) => game.winner === learnedSide).length;
  const draws = filtered.filter((game) => game.winner === 'draw').length;
  const losses = filtered.length - wins - draws;
  return `${wins}-${losses}-${draws}`;
}

async function main() {
  const games = [];
  for (const matchup of BENCHMARK_CONFIG.matchups) {
    for (let index = 0; index < BENCHMARK_CONFIG.gamesPerMatchup; index += 1) {
      const game = playBenchmarkGame(matchup, index);
      games.push(game);
      console.log(`[benchmark] ${game.label} #${index} -> winner=${game.winner} plies=${game.plies} point=${game.learnedPoint}`);
    }
  }

  const totalGames = games.length;
  const totalPoints = games.reduce((sum, game) => sum + game.learnedPoint, 0);
  const learnedWins = games.filter((game) => game.learnedPoint === 1).length;
  const draws = games.filter((game) => game.learnedPoint === 0.5).length;
  const learnedLosses = totalGames - learnedWins - draws;
  const averagePlies = games.reduce((sum, game) => sum + game.plies, 0) / Math.max(totalGames, 1);
  const pointRate = totalPoints / Math.max(totalGames, 1);

  const report = {
    generatedAt: new Date().toISOString(),
    config: BENCHMARK_CONFIG,
    summary: {
      totalGames,
      learnedWins,
      learnedLosses,
      draws,
      totalPoints: Number(totalPoints.toFixed(2)),
      pointRate: Number(pointRate.toFixed(4)),
      trainedAsBlack: tallyRecord(games, 'black'),
      trainedAsWhite: tallyRecord(games, 'white'),
      averagePlies: Number(averagePlies.toFixed(2)),
      note: 'low-budget controller check: learned-hybrid vs expectiminimax / mcts with shared trained evaluator',
    },
    games,
  };

  const updatedModel = structuredClone(TRAINED_MODEL);
  updatedModel.meta.benchmarkGames = totalGames;
  updatedModel.meta.benchmarkWinRate = `${Math.round(pointRate * 100)}%`;
  updatedModel.benchmarks = report;

  await writeAtomic(new URL('../sample-data/reports/benchmark-report.json', import.meta.url), `${JSON.stringify(report, null, 2)}\n`);
  await writeAtomic(new URL('../src/game/trainedModel.js', import.meta.url), buildModelModuleText(updatedModel));

  console.log(JSON.stringify(report.summary, null, 2));
}

await main();
