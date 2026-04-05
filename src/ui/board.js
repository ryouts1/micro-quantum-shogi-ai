import { BOARD_SIZE, PIECE_LABELS, PLAYER_LABELS } from '../game/constants.js';
import { getCertainPosition, getCellSummary, getPieceInfo } from '../game/selectors.js';
import { coordToText, formatPercent } from '../game/utils.js';

function pieceChip(summary, compact = false) {
  const chip = document.createElement('div');
  chip.className = `piece-chip ${summary.owner} ${compact ? 'compact' : ''}`;
  chip.innerHTML = `
    <span class="piece-glyph">${PIECE_LABELS[summary.type]}</span>
    <span class="piece-meta">${formatPercent(summary.probability)}</span>
  `;
  return chip;
}

function addHeatmapOverlay(cell, entry) {
  const overlay = document.createElement('div');
  overlay.className = 'heat-overlay';
  overlay.style.setProperty('--heat', entry.winRate.toFixed(3));
  overlay.innerHTML = `<span>${Math.round(entry.winRate * 100)}%</span>`;
  cell.appendChild(overlay);
}

function renderLegend(app) {
  const legend = document.createElement('div');
  legend.className = 'board-legend';
  legend.innerHTML = `
    <div><span class="legend-dot quiet"></span>古典移動</div>
    <div><span class="legend-dot capture"></span>捕獲</div>
    <div><span class="legend-dot quantum"></span>量子候補</div>
    <div><span class="legend-note">${app.isViewingLive() ? '現在局面' : '過去局面を表示中'}</span></div>
  `;
  return legend;
}

export function renderBoard(app) {
  const section = document.createElement('section');
  section.className = 'panel board-panel';

  const header = document.createElement('div');
  header.className = 'panel-header';
  header.innerHTML = `
    <div>
      <h2>対局盤</h2>
      <p>選択した駒の移動先、量子候補、ヒートマップを同じ盤上で確認できます。</p>
    </div>
    <div class="turn-chip ${app.viewedState.turn}">${PLAYER_LABELS[app.viewedState.turn]} の手番</div>
  `;
  section.appendChild(header);
  section.appendChild(renderLegend(app));

  const boardShell = document.createElement('div');
  boardShell.className = 'board-shell';

  const board = document.createElement('div');
  board.className = 'board-grid';

  const selectedPieceId = app.selectedPieceId;
  const selectedPosition = selectedPieceId ? getCertainPosition(app.viewedState, selectedPieceId) : null;
  const classicalMoves = app.getSelectedClassicalMoves();
  const quantumCandidates = app.getSelectedQuantumCandidates();
  const heatmap = app.heatmap?.cells ?? [];

  for (let y = 0; y < BOARD_SIZE; y += 1) {
    for (let x = 0; x < BOARD_SIZE; x += 1) {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'board-cell';
      if ((x + y) % 2 === 0) {
        cell.classList.add('light');
      }

      const coord = document.createElement('div');
      coord.className = 'coord-label';
      coord.textContent = coordToText(x, y);
      cell.appendChild(coord);

      if (selectedPosition && selectedPosition.x === x && selectedPosition.y === y) {
        cell.classList.add('selected-origin');
      }

      const heatEntry = heatmap.find((entry) => entry.x === x && entry.y === y);
      if (heatEntry) {
        addHeatmapOverlay(cell, heatEntry);
      }

      const summary = getCellSummary(app.viewedState, x, y);
      if (summary.length === 1 && summary[0].probability > 0.999999) {
        cell.appendChild(pieceChip(summary[0]));
      } else if (summary.length > 0) {
        const stack = document.createElement('div');
        stack.className = 'quantum-stack';
        summary.slice(0, 3).forEach((entry) => stack.appendChild(pieceChip(entry, true)));
        cell.appendChild(stack);

        const badge = document.createElement('div');
        badge.className = 'uncertainty-badge';
        badge.textContent = `${summary.length}`;
        cell.appendChild(badge);
      }

      const classicalMove = classicalMoves.find((action) => action.to.x === x && action.to.y === y);
      if (classicalMove && app.moveMode === 'classical') {
        cell.classList.add('classical-target');
        const marker = document.createElement('div');
        marker.className = `move-marker ${classicalMove.targetId ? 'capture' : 'quiet'}`;
        cell.appendChild(marker);
      }

      const quantumCandidate = quantumCandidates.find((entry) => entry.x === x && entry.y === y);
      if (quantumCandidate && app.moveMode === 'quantum') {
        cell.classList.add('quantum-target');
        const marker = document.createElement('div');
        marker.className = 'move-marker quantum';
        cell.appendChild(marker);
      }

      if (app.quantumDraft.some((entry) => entry.x === x && entry.y === y)) {
        cell.classList.add('quantum-picked');
      }

      cell.addEventListener('click', () => app.handleBoardClick(x, y));
      board.appendChild(cell);
    }
  }

  boardShell.appendChild(board);
  section.appendChild(boardShell);

  const selectedInfo = selectedPieceId ? getPieceInfo(app.viewedState, selectedPieceId) : null;
  const footer = document.createElement('div');
  footer.className = 'board-footer';
  if (selectedInfo) {
    const bestCell = app.heatmap?.cells?.slice().sort((a, b) => b.winRate - a.winRate)[0];
    footer.innerHTML = `
      <div><strong>選択中:</strong> ${PLAYER_LABELS[selectedInfo.owner]} ${selectedInfo.label}</div>
      <div>分布: ${selectedInfo.distribution.map((entry) => entry.label).join(' / ')}</div>
      <div>${bestCell ? `ヒートマップ上位: ${coordToText(bestCell.x, bestCell.y)} (${Math.round(bestCell.winRate * 100)}%)` : '自駒を選ぶとヒートマップと量子候補を比較できます。'}</div>
    `;
  } else {
    footer.innerHTML = '<div>手番側の確定駒を選ぶと、移動候補や確率分布の見どころを追えます。</div>';
  }
  section.appendChild(footer);

  return section;
}
