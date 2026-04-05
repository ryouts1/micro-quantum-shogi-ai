import { buildReplaySeries, computeStateInsights, getTopWorlds, scoreToWinRate } from '../game/analysis.js';
import { BOARD_SIZE, PIECE_LABELS, PLAYER_LABELS, PLAYERS } from '../game/constants.js';
import { getPieceInfo, getUncertainPieceIds } from '../game/selectors.js';
import { getTrainedModel, getTrainingSummary } from '../game/model.js';
import { actionToText } from '../game/rules.js';
import { formatPercent, formatSignedScore, stableStateHash } from '../game/utils.js';
import { renderWinRateChart } from './charts.js';

const ENGINE_OPTIONS = [
  { value: 'human', label: 'human' },
  { value: 'expectiminimax', label: 'expectiminimax' },
  { value: 'mcts', label: 'mcts' },
  { value: 'learned-hybrid', label: 'learned-hybrid' },
];

function makeSection(title, description = '') {
  const section = document.createElement('section');
  section.className = 'panel';

  const header = document.createElement('div');
  header.className = 'panel-header';
  header.innerHTML = `
    <div>
      <h2>${title}</h2>
      ${description ? `<p>${description}</p>` : ''}
    </div>
  `;
  section.appendChild(header);
  return section;
}

function engineSelect(app, owner) {
  const wrapper = document.createElement('label');
  wrapper.className = 'field';
  wrapper.innerHTML = `<span>${PLAYER_LABELS[owner]}</span>`;
  const select = document.createElement('select');
  ENGINE_OPTIONS.forEach(({ value, label }) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    if (app.controllers[owner] === value) {
      option.selected = true;
    }
    select.appendChild(option);
  });
  select.addEventListener('change', (event) => app.setController(owner, event.target.value));
  wrapper.appendChild(select);
  return wrapper;
}

function analysisEngineSelect(app) {
  const wrapper = document.createElement('label');
  wrapper.className = 'field';
  wrapper.innerHTML = '<span>解析エンジン</span>';
  const select = document.createElement('select');
  ENGINE_OPTIONS.filter((entry) => entry.value !== 'human').forEach(({ value, label }) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    if (app.analysisEngine === value) {
      option.selected = true;
    }
    select.appendChild(option);
  });
  select.addEventListener('change', (event) => app.setAnalysisEngine(event.target.value));
  wrapper.appendChild(select);
  return wrapper;
}

function numericField(labelText, value, step, onChange) {
  const wrapper = document.createElement('label');
  wrapper.className = 'field';
  wrapper.innerHTML = `<span>${labelText}</span>`;
  const input = document.createElement('input');
  input.type = 'number';
  input.min = '1';
  input.step = step;
  input.value = String(value);
  input.addEventListener('change', (event) => onChange(Number(event.target.value)));
  wrapper.appendChild(input);
  return wrapper;
}

function metricCard(label, value, extra = '') {
  const card = document.createElement('div');
  card.className = 'metric-card';
  card.innerHTML = `
    <span>${label}</span>
    <strong>${value}</strong>
    ${extra ? `<small>${extra}</small>` : ''}
  `;
  return card;
}

function buildWorldOccupancy(world) {
  const map = new Map();
  Object.values(world.pieces)
    .filter((piece) => !piece.captured)
    .forEach((piece) => {
      map.set(`${piece.x},${piece.y}`, piece);
    });
  return map;
}

function renderMiniWorldBoard(worldEntry) {
  const wrapper = document.createElement('div');
  wrapper.className = 'world-card';

  const header = document.createElement('div');
  header.className = 'world-card-header';
  header.innerHTML = `<strong>世界 ${worldEntry.index + 1}</strong><span>${formatPercent(worldEntry.weight)}</span>`;
  wrapper.appendChild(header);

  const board = document.createElement('div');
  board.className = 'mini-world-grid';
  const occupancy = buildWorldOccupancy(worldEntry.world);

  for (let y = 0; y < BOARD_SIZE; y += 1) {
    for (let x = 0; x < BOARD_SIZE; x += 1) {
      const cell = document.createElement('div');
      cell.className = 'mini-world-cell';
      const piece = occupancy.get(`${x},${y}`);
      if (piece) {
        cell.innerHTML = `<span class="mini-piece ${piece.owner}">${PIECE_LABELS[piece.type]}</span>`;
      }
      board.appendChild(cell);
    }
  }
  wrapper.appendChild(board);

  const footer = document.createElement('div');
  footer.className = 'world-card-footer';
  footer.innerHTML = `
    <div>先手 ${worldEntry.blackPieces.length} 枚 / 後手 ${worldEntry.whitePieces.length} 枚</div>
    <div>${worldEntry.blackPieces.slice(0, 3).map((piece) => piece.label).join(', ')}${worldEntry.blackPieces.length > 3 ? '…' : ''}</div>
  `;
  wrapper.appendChild(footer);
  return wrapper;
}

function renderTrainingSection() {
  const summary = getTrainingSummary();
  const model = getTrainedModel();
  const section = makeSection('学習済みモデル', '自己対局から作った軽量モデルを評価関数・手の優先度・序盤ブックに反映しています。');

  const metrics = document.createElement('div');
  metrics.className = 'metric-grid';
  metrics.appendChild(metricCard('モデル', summary.version ?? 'unknown', summary.generatedAt ? summary.generatedAt.slice(0, 10) : 'generatedAt unavailable'));
  metrics.appendChild(metricCard('自己対局', String(summary.selfPlayGames ?? 0), `局面 ${summary.sampledPositions ?? 0}`));
  metrics.appendChild(metricCard('序盤ブック状態', String(summary.openingStates ?? 0), summary.bookDepth ? `book depth ${summary.bookDepth}` : 'exact state book'));
  metrics.appendChild(metricCard('比較対局', String(summary.benchmarkGames ?? 0), summary.benchmarkWinRate ? `勝率 ${summary.benchmarkWinRate}` : 'baseline comparison'));
  section.appendChild(metrics);

  if (summary.notes) {
    const note = document.createElement('div');
    note.className = 'helper-text';
    note.textContent = summary.notes;
    section.appendChild(note);
  }

  const benchmark = model.benchmarks?.summary;
  if (benchmark) {
    const detail = document.createElement('div');
    detail.className = 'analysis-summary compact';
    detail.innerHTML = `
      <div><span>学習済み先手</span><strong>${benchmark.trainedAsBlack ?? '—'}</strong></div>
      <div><span>学習済み後手</span><strong>${benchmark.trainedAsWhite ?? '—'}</strong></div>
      <div><span>引き分け</span><strong>${benchmark.draws ?? '—'}</strong></div>
      <div><span>備考</span><strong>${benchmark.note ?? 'baseline vs learned-hybrid'}</strong></div>
    `;
    section.appendChild(detail);
  }

  return section;
}

function renderControls(app) {
  const section = makeSection('対局設定', '人間同士、AI 同士、片側 AI の検証をそのまま切り替えられます。');
  const grid = document.createElement('div');
  grid.className = 'field-grid';
  grid.appendChild(engineSelect(app, PLAYERS.BLACK));
  grid.appendChild(engineSelect(app, PLAYERS.WHITE));
  grid.appendChild(numericField('Expectiminimax 深さ', app.aiConfig.expectiminimaxDepth, 1, (value) => app.setAiDepth(value)));
  grid.appendChild(numericField('MCTS 試行回数', app.aiConfig.mctsIterations, 10, (value) => app.setMctsIterations(value)));
  section.appendChild(grid);

  const buttons = document.createElement('div');
  buttons.className = 'button-row';

  const reset = document.createElement('button');
  reset.type = 'button';
  reset.textContent = '新しく始める';
  reset.addEventListener('click', () => app.resetGame());
  buttons.appendChild(reset);

  const exportButton = document.createElement('button');
  exportButton.type = 'button';
  exportButton.textContent = 'リプレイを書き出す';
  exportButton.addEventListener('click', () => app.exportReplay());
  buttons.appendChild(exportButton);

  const sampleButton = document.createElement('button');
  sampleButton.type = 'button';
  sampleButton.textContent = 'サンプルを読む';
  sampleButton.addEventListener('click', () => app.loadSampleReplay());
  buttons.appendChild(sampleButton);

  const fileLabel = document.createElement('label');
  fileLabel.className = 'file-button';
  fileLabel.textContent = 'JSON を読み込む';
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json,application/json';
  input.addEventListener('change', (event) => {
    const [file] = event.target.files || [];
    if (file) {
      app.importReplayFile(file);
    }
    event.target.value = '';
  });
  fileLabel.appendChild(input);
  buttons.appendChild(fileLabel);

  section.appendChild(buttons);
  return section;
}

function renderTurnSection(app) {
  const state = app.viewedState;
  const insights = computeStateInsights(state);
  const section = makeSection('局面情報', '確率状態を数値で追えるように、世界数・エントロピー・期待材料をまとめています。');

  const metrics = document.createElement('div');
  metrics.className = 'metric-grid';
  metrics.appendChild(metricCard('手番', PLAYER_LABELS[state.turn], app.isViewingLive() ? '現在局面' : '履歴を表示中'));
  metrics.appendChild(metricCard('世界数', String(insights.worldCount), `不確定駒 ${insights.uncertainCounts.black + insights.uncertainCounts.white} 枚`));
  metrics.appendChild(metricCard('エントロピー', `${insights.entropy.toFixed(2)} bit`, '大きいほど状態が散っている'));
  metrics.appendChild(metricCard('先手勝率目安', formatPercent(insights.blackWinRate), `評価 ${formatSignedScore(insights.blackScore)}`));
  section.appendChild(metrics);

  const statusList = document.createElement('div');
  statusList.className = 'status-list';
  statusList.innerHTML = `
    <div><span>手数</span><strong>${state.turnCount}</strong></div>
    <div><span>量子チャージ</span><strong>先手 ${state.charges.black} / 後手 ${state.charges.white}</strong></div>
    <div><span>進展なしカウント</span><strong>${state.halfmoveClock}</strong></div>
    <div><span>確定駒数</span><strong>先手 ${insights.certainCounts.black} / 後手 ${insights.certainCounts.white}</strong></div>
    <div><span>期待材料</span><strong>先手 ${Math.round(insights.expectedMaterial.black)} / 後手 ${Math.round(insights.expectedMaterial.white)}</strong></div>
    <div><span>合法移動数</span><strong>先手 ${insights.moveCounts.black} / 後手 ${insights.moveCounts.white}</strong></div>
  `;
  section.appendChild(statusList);

  const result = state.result;
  if (result) {
    const resultNode = document.createElement('div');
    resultNode.className = `result-banner ${result.winner}`;
    resultNode.textContent = `${result.winner === 'draw' ? '引き分け' : `${PLAYER_LABELS[result.winner]} 勝ち`} — ${result.reason}`;
    section.appendChild(resultNode);
  } else if (app.isAiThinking) {
    const thinking = document.createElement('div');
    thinking.className = 'result-banner thinking';
    thinking.textContent = 'AI が読み中です。';
    section.appendChild(thinking);
  }

  return section;
}

function renderMoveComposer(app) {
  const section = makeSection('手の入力', '量子移動は 2 マス選択で確定します。履歴閲覧中でも駒の選択とヒートマップ確認は可能です。');
  const toggleRow = document.createElement('div');
  toggleRow.className = 'toggle-row';

  ['classical', 'quantum'].forEach((mode) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = mode === app.moveMode ? 'active' : '';
    button.textContent = mode === 'classical' ? '古典移動' : '量子移動';
    button.addEventListener('click', () => app.setMoveMode(mode));
    toggleRow.appendChild(button);
  });
  section.appendChild(toggleRow);

  const selected = app.getSelectedPieceInfo();
  const body = document.createElement('div');
  body.className = 'composer-body';

  if (!selected) {
    body.textContent = '手番側の確定駒を選ぶと、移動候補と量子候補を確認できます。';
    section.appendChild(body);
    return section;
  }

  const classicalCount = app.getSelectedClassicalMoves().length;
  const quantumCount = app.getSelectedQuantumCandidates().length;
  body.innerHTML = `
    <div><strong>${PLAYER_LABELS[selected.owner]} ${selected.label}</strong></div>
    <div>古典移動 ${classicalCount} 手 / 量子候補 ${quantumCount} マス</div>
  `;
  section.appendChild(body);

  if (app.moveMode === 'quantum') {
    const helper = document.createElement('div');
    helper.className = 'helper-text';
    helper.textContent = app.quantumDraft.length
      ? `選択中: ${app.quantumDraft.map((entry) => entry.label).join(' と ')}`
      : '候補マスを 2 つ選ぶと量子移動を確定できます。';
    section.appendChild(helper);

    const buttons = document.createElement('div');
    buttons.className = 'button-row';
    const commit = document.createElement('button');
    commit.type = 'button';
    commit.textContent = '量子移動を確定';
    commit.disabled = app.quantumDraft.length !== 2 || !app.canInteract();
    commit.addEventListener('click', () => app.commitQuantumDraft());
    buttons.appendChild(commit);

    const clear = document.createElement('button');
    clear.type = 'button';
    clear.textContent = '選択をクリア';
    clear.addEventListener('click', () => app.clearQuantumDraft());
    buttons.appendChild(clear);

    section.appendChild(buttons);
  }

  const heatmapButtons = document.createElement('div');
  heatmapButtons.className = 'button-row';
  const compute = document.createElement('button');
  compute.type = 'button';
  compute.textContent = '勝率ヒートマップ';
  compute.addEventListener('click', () => app.computeHeatmap());
  heatmapButtons.appendChild(compute);

  const clearHeat = document.createElement('button');
  clearHeat.type = 'button';
  clearHeat.textContent = 'ヒートマップ解除';
  clearHeat.addEventListener('click', () => app.clearHeatmap());
  heatmapButtons.appendChild(clearHeat);
  section.appendChild(heatmapButtons);

  if (app.heatmap?.quantumRanking?.length) {
    const list = document.createElement('ol');
    list.className = 'ranking-list';
    app.heatmap.quantumRanking.forEach((entry) => {
      const item = document.createElement('li');
      item.innerHTML = `<span>${actionToText(entry.action)}</span><strong>${Math.round(entry.winRate * 100)}%</strong>`;
      list.appendChild(item);
    });
    section.appendChild(list);
  }

  return section;
}

function renderObservationSection(app) {
  const section = makeSection('観測', '不確定な駒に 1 手使って collapse を起こします。観測は相手駒にも使えます。');
  const uncertainIds = getUncertainPieceIds(app.viewedState);
  if (!uncertainIds.length) {
    section.appendChild(document.createTextNode('いまは観測対象がありません。'));
    return section;
  }

  const list = document.createElement('div');
  list.className = 'uncertain-list';
  uncertainIds.forEach((pieceId) => {
    const info = getPieceInfo(app.viewedState, pieceId);
    const row = document.createElement('div');
    row.className = 'uncertain-item';

    const summary = document.createElement('div');
    summary.innerHTML = `<strong>${PLAYER_LABELS[info.owner]} ${info.label}</strong>`;
    const dist = document.createElement('div');
    dist.className = 'distribution-list';
    info.distribution.forEach((entry) => {
      const chip = document.createElement('span');
      chip.className = 'distribution-chip';
      chip.textContent = entry.label;
      dist.appendChild(chip);
    });
    summary.appendChild(dist);
    row.appendChild(summary);

    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = '観測';
    button.disabled = !app.canInteract();
    button.addEventListener('click', () => app.observePiece(pieceId));
    row.appendChild(button);
    list.appendChild(row);
  });
  section.appendChild(list);
  return section;
}

function renderWorldInspector(app) {
  const section = makeSection('量子状態ビュー', '上位世界をミニ盤面で並べ、どの分岐がどれだけ残っているかを見やすくしています。');
  const worlds = getTopWorlds(app.viewedState, 4);

  const strip = document.createElement('div');
  strip.className = 'metric-grid compact';
  const insights = computeStateInsights(app.viewedState);
  strip.appendChild(metricCard('上位 1 世界', worlds[0] ? formatPercent(worlds[0].weight) : '—'));
  strip.appendChild(metricCard('不確定駒', String(insights.uncertainCounts.black + insights.uncertainCounts.white)));
  strip.appendChild(metricCard('後手勝率目安', formatPercent(1 - insights.blackWinRate)));
  section.appendChild(strip);

  const worldGrid = document.createElement('div');
  worldGrid.className = 'world-grid';
  worlds.forEach((worldEntry) => worldGrid.appendChild(renderMiniWorldBoard(worldEntry)));
  section.appendChild(worldGrid);
  return section;
}

function renderAnalysisSection(app) {
  const section = makeSection('AI 解析', '同じ局面に対して候補手ランキングを出し、探索エンジンの判断を読めるようにしています。');
  const controls = document.createElement('div');
  controls.className = 'field-grid';
  controls.appendChild(analysisEngineSelect(app));
  section.appendChild(controls);

  const actionRow = document.createElement('div');
  actionRow.className = 'button-row';
  const analyze = document.createElement('button');
  analyze.type = 'button';
  analyze.textContent = app.isAnalysisBusy ? '解析中…' : 'この局面を解析';
  analyze.disabled = app.isAnalysisBusy;
  analyze.addEventListener('click', () => app.analyzeViewedState());
  actionRow.appendChild(analyze);
  section.appendChild(actionRow);

  const stateHash = stableStateHash(app.viewedState);
  if (!app.analysisResult || app.analysisResult.stateHash !== stateHash) {
    const note = document.createElement('div');
    note.className = 'helper-text';
    note.textContent = '解析結果はまだありません。任意の局面で実行できます。';
    section.appendChild(note);
    return section;
  }

  const summary = document.createElement('div');
  summary.className = 'analysis-summary';
  summary.innerHTML = `
    <div><span>エンジン</span><strong>${app.analysisResult.engine}</strong></div>
    <div><span>手番</span><strong>${PLAYER_LABELS[app.viewedState.turn]}</strong></div>
    <div><span>評価</span><strong>${formatSignedScore(app.analysisResult.score)}</strong></div>
    <div><span>勝率目安</span><strong>${formatPercent(scoreToWinRate(app.analysisResult.score))}</strong></div>
  `;
  section.appendChild(summary);

  const list = document.createElement('ol');
  list.className = 'ranking-list detailed';
  app.analysisResult.ranking.forEach((entry) => {
    const item = document.createElement('li');
    const meta = [
      `評価 ${formatSignedScore(entry.value)}`,
      `勝率 ${formatPercent(scoreToWinRate(entry.value))}`,
    ];
    if (typeof entry.visits === 'number') {
      meta.push(`訪問 ${entry.visits}`);
    }
    item.innerHTML = `
      <div>
        <strong>${actionToText(entry.action)}</strong>
        <div class="ranking-meta">${meta.join(' / ')}</div>
      </div>
    `;
    list.appendChild(item);
  });
  section.appendChild(list);
  return section;
}

function renderReplaySection(app) {
  const section = makeSection('リプレイ', '履歴をスクラブしながら、先手勝率の推移と分岐の収束具合を確認できます。');

  const slider = document.createElement('input');
  slider.type = 'range';
  slider.min = '0';
  slider.max = String(Math.max(app.history.length - 1, 0));
  slider.value = String(app.viewIndex);
  slider.addEventListener('input', (event) => app.jumpTo(Number(event.target.value)));
  section.appendChild(slider);

  const controls = document.createElement('div');
  controls.className = 'button-row';
  const play = document.createElement('button');
  play.type = 'button';
  play.textContent = app.replayAutoplay ? '停止' : '自動再生';
  play.addEventListener('click', () => app.toggleReplayAutoplay());
  controls.appendChild(play);

  const latest = document.createElement('button');
  latest.type = 'button';
  latest.textContent = '最新局面へ';
  latest.addEventListener('click', () => app.jumpTo(app.history.length - 1));
  controls.appendChild(latest);
  section.appendChild(controls);

  const series = buildReplaySeries(app.history);
  section.appendChild(renderWinRateChart(series, app.viewIndex));

  const current = series[app.viewIndex];
  const summary = document.createElement('div');
  summary.className = 'analysis-summary compact';
  summary.innerHTML = `
    <div><span>表示位置</span><strong>${app.viewIndex + 1} / ${app.history.length}</strong></div>
    <div><span>先手勝率目安</span><strong>${formatPercent(current.blackWinRate)}</strong></div>
    <div><span>世界数</span><strong>${current.worldCount}</strong></div>
    <div><span>エントロピー</span><strong>${current.entropy.toFixed(2)} bit</strong></div>
  `;
  section.appendChild(summary);

  if (app.loadedReplayMeta) {
    const meta = document.createElement('div');
    meta.className = 'helper-text';
    const label = app.loadedReplayMeta.label ? `${app.loadedReplayMeta.label} / ` : '';
    meta.textContent = `${label}${app.loadedReplayMeta.exportedAt ?? 'metadata available'}`;
    section.appendChild(meta);
  }

  const list = document.createElement('ol');
  list.className = 'history-list';
  app.history.forEach((entry, index) => {
    const item = document.createElement('li');
    item.className = index === app.viewIndex ? 'current' : '';
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = `${index}. ${entry.actionText}`;
    button.addEventListener('click', () => app.jumpTo(index));
    item.appendChild(button);
    list.appendChild(item);
  });
  section.appendChild(list);
  return section;
}

export function renderSidebar(app) {
  const wrapper = document.createElement('div');
  wrapper.className = 'sidebar';

  wrapper.appendChild(renderTurnSection(app));
  wrapper.appendChild(renderControls(app));
  wrapper.appendChild(renderTrainingSection(app));
  wrapper.appendChild(renderMoveComposer(app));
  wrapper.appendChild(renderObservationSection(app));
  wrapper.appendChild(renderWorldInspector(app));
  wrapper.appendChild(renderAnalysisSection(app));
  wrapper.appendChild(renderReplaySection(app));

  return wrapper;
}
