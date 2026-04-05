import { computeStateInsights } from '../game/analysis.js';
import { chooseBestAction } from '../game/ai.js';
import { computeHeatmapForPiece } from '../game/heatmap.js';
import { createReplayEntry, deserializeReplay, serializeReplay } from '../game/replay.js';
import { applyAction, getLegalActionsForPiece, listLegalActions } from '../game/rules.js';
import { getCertainPieceAt, getPieceInfo } from '../game/selectors.js';
import { createInitialState } from '../game/setup.js';
import { coordToText, formatPercent, stableStateHash } from '../game/utils.js';
import { renderBoard } from './board.js';
import { renderSidebar } from './panels.js';

export class QuantumShogiApp {
  constructor(root) {
    this.root = root;
    this.controllers = {
      black: 'human',
      white: 'learned-hybrid',
    };
    this.aiConfig = {
      expectiminimaxDepth: 2,
      mctsIterations: 220,
    };
    this.analysisEngine = 'learned-hybrid';
    this.analysisResult = null;
    this.isAnalysisBusy = false;
    this.moveMode = 'classical';
    this.quantumDraft = [];
    this.heatmap = null;
    this.selectedPieceId = null;
    this.viewIndex = 0;
    this.history = [];
    this.notice = '';
    this.isAiThinking = false;
    this.replayAutoplay = false;
    this.aiTimer = null;
    this.analysisTimer = null;
    this.replayTimer = null;
    this.loadedReplayMeta = null;

    this.resetGame(false);
  }

  get viewedState() {
    return this.history[this.viewIndex].state;
  }

  get liveState() {
    return this.history.at(-1).state;
  }

  isViewingLive() {
    return this.viewIndex === this.history.length - 1;
  }

  canInteract() {
    return this.isViewingLive() && !this.isAiThinking && !this.liveState.result && this.controllers[this.liveState.turn] === 'human';
  }

  setNotice(text) {
    this.notice = text;
    this.render();
  }

  clearTransientState() {
    this.selectedPieceId = null;
    this.quantumDraft = [];
    this.heatmap = null;
  }

  clearAnalysis() {
    clearTimeout(this.analysisTimer);
    this.analysisTimer = null;
    this.analysisResult = null;
    this.isAnalysisBusy = false;
  }

  resetGame(renderAfter = true) {
    this.stopReplayAutoplay();
    clearTimeout(this.aiTimer);
    this.clearAnalysis();
    const initialState = createInitialState({ seed: Date.now() });
    this.history = [createReplayEntry(initialState, null, '新規対局')];
    this.viewIndex = 0;
    this.notice = '';
    this.loadedReplayMeta = null;
    this.isAiThinking = false;
    this.clearTransientState();
    if (renderAfter) {
      this.render();
      this.maybeTriggerAi();
    }
  }

  setController(owner, engine) {
    this.controllers[owner] = engine;
    this.render();
    this.maybeTriggerAi();
  }

  setAiDepth(depth) {
    this.aiConfig.expectiminimaxDepth = Math.max(1, Number(depth) || 1);
    this.clearAnalysis();
    this.render();
  }

  setMctsIterations(iterations) {
    this.aiConfig.mctsIterations = Math.max(20, Number(iterations) || 20);
    this.clearAnalysis();
    this.render();
  }

  setMoveMode(mode) {
    this.moveMode = mode;
    this.quantumDraft = [];
    this.render();
  }

  setAnalysisEngine(engine) {
    this.analysisEngine = engine;
    this.clearAnalysis();
    this.render();
  }

  getSelectedPieceInfo() {
    if (!this.selectedPieceId) {
      return null;
    }
    const info = getPieceInfo(this.viewedState, this.selectedPieceId);
    if (!info) {
      this.selectedPieceId = null;
      return null;
    }
    return info;
  }

  getSelectedClassicalMoves() {
    if (!this.selectedPieceId) {
      return [];
    }
    return getLegalActionsForPiece(this.viewedState, this.selectedPieceId).filter((action) => action.mode === 'classical');
  }

  getSelectedQuantumCandidates() {
    if (!this.selectedPieceId || this.viewedState.charges[this.viewedState.turn] <= 0) {
      return [];
    }

    const candidates = new Map();
    getLegalActionsForPiece(this.viewedState, this.selectedPieceId)
      .filter((action) => action.mode === 'quantum')
      .forEach((action) => {
        action.branches.forEach((branch) => {
          const key = `${branch.x},${branch.y}`;
          if (!candidates.has(key)) {
            candidates.set(key, {
              x: branch.x,
              y: branch.y,
              label: coordToText(branch.x, branch.y),
            });
          }
        });
      });

    return [...candidates.values()];
  }

  selectPiece(pieceId) {
    this.selectedPieceId = pieceId;
    this.quantumDraft = [];
    this.heatmap = null;
    this.render();
  }

  handleBoardClick(x, y) {
    const current = this.viewedState;
    const clickedPiece = getCertainPieceAt(current, x, y);

    if (this.canInteract() && this.selectedPieceId && this.moveMode === 'classical') {
      const destination = this.getSelectedClassicalMoves().find((action) => action.to.x === x && action.to.y === y);
      if (destination) {
        this.applyActionAndRecord(destination);
        return;
      }
    }

    if (this.canInteract() && this.selectedPieceId && this.moveMode === 'quantum') {
      const candidate = this.getSelectedQuantumCandidates().find((entry) => entry.x === x && entry.y === y);
      if (candidate) {
        const key = `${candidate.x},${candidate.y}`;
        const exists = this.quantumDraft.find((entry) => `${entry.x},${entry.y}` === key);
        if (exists) {
          this.quantumDraft = this.quantumDraft.filter((entry) => `${entry.x},${entry.y}` !== key);
        } else if (this.quantumDraft.length < 2) {
          this.quantumDraft = [...this.quantumDraft, candidate];
        } else {
          this.quantumDraft = [this.quantumDraft[1], candidate];
        }
        this.render();
        return;
      }
    }

    if (clickedPiece && clickedPiece.owner === current.turn) {
      this.selectPiece(clickedPiece.id);
      return;
    }

    this.clearTransientState();
    this.render();
  }

  clearQuantumDraft() {
    this.quantumDraft = [];
    this.render();
  }

  commitQuantumDraft() {
    if (!this.canInteract() || this.quantumDraft.length !== 2 || !this.selectedPieceId) {
      return;
    }

    const targetKey = [...this.quantumDraft]
      .map((entry) => `${entry.x},${entry.y}`)
      .sort()
      .join('|');

    const action = getLegalActionsForPiece(this.liveState, this.selectedPieceId)
      .filter((candidate) => candidate.mode === 'quantum')
      .find((candidate) =>
        [...candidate.branches]
          .map((branch) => `${branch.x},${branch.y}`)
          .sort()
          .join('|') === targetKey,
      );

    if (action) {
      this.applyActionAndRecord(action);
    }
  }

  observePiece(pieceId) {
    if (!this.canInteract()) {
      return;
    }
    const action = listLegalActions(this.liveState).find((candidate) => candidate.type === 'observe' && candidate.pieceId === pieceId);
    if (action) {
      this.applyActionAndRecord(action);
    }
  }

  computeHeatmap() {
    if (!this.selectedPieceId) {
      return;
    }
    this.heatmap = computeHeatmapForPiece(this.viewedState, this.selectedPieceId, {
      engine: this.analysisEngine,
      perspective: this.viewedState.turn,
      depth: Math.max(1, this.aiConfig.expectiminimaxDepth - 1),
      iterations: Math.max(40, Math.floor(this.aiConfig.mctsIterations / 2)),
    });
    this.render();
  }

  clearHeatmap() {
    this.heatmap = null;
    this.render();
  }

  analyzeViewedState() {
    this.clearAnalysis();
    this.isAnalysisBusy = true;
    this.render();

    this.analysisTimer = setTimeout(() => {
      const state = this.viewedState;
      const result = chooseBestAction(state, this.analysisEngine, {
        depth: this.aiConfig.expectiminimaxDepth,
        iterations: this.aiConfig.mctsIterations,
        perspective: state.turn,
        seed: `analysis::${this.analysisEngine}::${stableStateHash(state)}`,
      });
      this.analysisResult = {
        stateHash: stableStateHash(state),
        engine: this.analysisEngine,
        turn: state.turn,
        score: result.score,
        ranking: result.ranking.slice(0, 6),
      };
      this.isAnalysisBusy = false;
      this.render();
    }, 30);
  }

  applyActionAndRecord(action) {
    const nextState = applyAction(this.liveState, action);
    this.history.push(createReplayEntry(nextState, action));
    this.viewIndex = this.history.length - 1;
    this.notice = '';
    this.isAiThinking = false;
    this.clearTransientState();
    this.clearAnalysis();
    this.render();
    this.maybeTriggerAi();
  }

  jumpTo(index) {
    this.viewIndex = Math.max(0, Math.min(index, this.history.length - 1));
    this.clearTransientState();
    this.clearAnalysis();
    this.render();
    if (this.isViewingLive()) {
      this.maybeTriggerAi();
    }
  }

  toggleReplayAutoplay() {
    if (this.replayAutoplay) {
      this.stopReplayAutoplay();
    } else {
      this.replayAutoplay = true;
      this.replayTimer = setInterval(() => {
        if (this.viewIndex >= this.history.length - 1) {
          this.stopReplayAutoplay();
          return;
        }
        this.viewIndex += 1;
        this.clearTransientState();
        this.clearAnalysis();
        this.render();
      }, 700);
      this.render();
    }
  }

  stopReplayAutoplay() {
    this.replayAutoplay = false;
    clearInterval(this.replayTimer);
    this.replayTimer = null;
  }

  exportReplay() {
    const payload = serializeReplay(this.history, {
      controllers: this.controllers,
      aiConfig: this.aiConfig,
      analysisEngine: this.analysisEngine,
      finalWorlds: this.liveState.worlds.length,
    });
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `micro-quantum-shogi-replay-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async importReplayFile(file) {
    try {
      const text = await file.text();
      const parsed = deserializeReplay(text);
      this.history = parsed.entries;
      this.viewIndex = parsed.entries.length - 1;
      this.notice = 'リプレイを読み込みました。';
      this.loadedReplayMeta = parsed.meta ?? null;
      this.clearTransientState();
      this.clearAnalysis();
      this.render();
    } catch (error) {
      this.notice = error.message;
      this.render();
    }
  }

  async loadSampleReplay() {
    try {
      const response = await fetch('/sample-data/replays/ai-duel.json');
      if (!response.ok) {
        throw new Error('サンプルリプレイの読み込みに失敗しました。');
      }
      const parsed = deserializeReplay(await response.text());
      this.history = parsed.entries;
      this.viewIndex = parsed.entries.length - 1;
      this.notice = 'サンプルリプレイを読み込みました。';
      this.loadedReplayMeta = parsed.meta ?? null;
      this.clearTransientState();
      this.clearAnalysis();
      this.render();
    } catch (error) {
      this.notice = error.message;
      this.render();
    }
  }

  maybeTriggerAi() {
    clearTimeout(this.aiTimer);
    if (!this.isViewingLive()) {
      return;
    }
    const state = this.liveState;
    if (state.result) {
      return;
    }
    const engine = this.controllers[state.turn];
    if (engine === 'human') {
      return;
    }

    this.isAiThinking = true;
    this.render();
    this.aiTimer = setTimeout(() => {
      const live = this.liveState;
      const currentEngine = this.controllers[live.turn];
      const result = chooseBestAction(live, currentEngine, {
        depth: this.aiConfig.expectiminimaxDepth,
        iterations: this.aiConfig.mctsIterations,
        perspective: live.turn,
        seed: `autoplay::${currentEngine}::${stableStateHash(live)}`,
      });
      this.isAiThinking = false;
      if (result.action) {
        this.applyActionAndRecord(result.action);
      } else {
        this.render();
      }
    }, 80);
  }

  render() {
    this.root.innerHTML = '';

    const shell = document.createElement('div');
    shell.className = 'app-shell';

    const insights = computeStateInsights(this.viewedState);

    const hero = document.createElement('header');
    hero.className = 'hero';
    hero.innerHTML = `
      <div>
        <p class="eyebrow">micro-quantum-shogi [L]</p>
        <h1>5x5 の簡易量子将棋</h1>
        <p>確率状態・観測 collapse・自己対局で調整した評価関数・Expectiminimax / MCTS / learned-hybrid・決定的リプレイをひとまとめにした、説明しやすいポートフォリオ実装です。</p>
      </div>
      <div class="hero-stats">
        <div class="hero-stat"><span>世界数</span><strong>${insights.worldCount}</strong></div>
        <div class="hero-stat"><span>エントロピー</span><strong>${insights.entropy.toFixed(2)} bit</strong></div>
        <div class="hero-stat"><span>先手勝率目安</span><strong>${formatPercent(insights.blackWinRate)}</strong></div>
      </div>
    `;
    shell.appendChild(hero);

    if (this.notice) {
      const notice = document.createElement('div');
      notice.className = 'notice';
      notice.textContent = this.notice;
      shell.appendChild(notice);
    }

    const layout = document.createElement('div');
    layout.className = 'layout';
    layout.appendChild(renderBoard(this));
    layout.appendChild(renderSidebar(this));
    shell.appendChild(layout);

    this.root.appendChild(shell);
  }
}
