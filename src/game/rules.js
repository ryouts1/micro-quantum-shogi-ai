import {
  BOARD_SIZE,
  DIRECTIONS,
  PIECE_TYPES,
  PLAYERS,
  PLAYER_LABELS,
  PIECE_LABELS,
} from './constants.js';
import { cloneState } from './setup.js';
import {
  getCertainPieceIds,
  getCertainPosition,
  getPieceInfo,
  getUncertainPieceIds,
  isPieceAliveInAnyWorld,
} from './selectors.js';
import {
  coordToText,
  deepClone,
  directionFor,
  inBounds,
  mergeWorlds,
  nextSeedValue,
  opponentOf,
  sampleByWeight,
} from './utils.js';

function buildBoard(world) {
  const board = new Map();
  for (const piece of Object.values(world.pieces)) {
    if (!piece.captured) {
      board.set(`${piece.x},${piece.y}`, piece.id);
    }
  }
  return board;
}

function getStepVectors(piece) {
  const forward = directionFor(piece.owner);

  switch (piece.type) {
    case PIECE_TYPES.KING:
      return DIRECTIONS.king;
    case PIECE_TYPES.GOLD:
      return [
        [0, forward],
        [1, forward],
        [-1, forward],
        [1, 0],
        [-1, 0],
        [0, -forward],
      ];
    case PIECE_TYPES.SILVER:
      return [
        [0, forward],
        [1, forward],
        [-1, forward],
        [1, -forward],
        [-1, -forward],
      ];
    case PIECE_TYPES.PAWN:
      return [[0, forward]];
    default:
      return [];
  }
}

function isSlider(piece) {
  return piece.type === PIECE_TYPES.ROOK || piece.type === PIECE_TYPES.BISHOP;
}

function getSliderDirections(piece) {
  if (piece.type === PIECE_TYPES.ROOK) {
    return DIRECTIONS.rook;
  }
  if (piece.type === PIECE_TYPES.BISHOP) {
    return DIRECTIONS.bishop;
  }
  return [];
}

function getPseudoDestinations(piece) {
  const destinations = [];

  if (isSlider(piece)) {
    for (const [dx, dy] of getSliderDirections(piece)) {
      let step = 1;
      while (true) {
        const x = piece.x + dx * step;
        const y = piece.y + dy * step;
        if (!inBounds(x, y)) {
          break;
        }
        destinations.push({ x, y });
        step += 1;
      }
    }
    return destinations;
  }

  for (const [dx, dy] of getStepVectors(piece)) {
    const x = piece.x + dx;
    const y = piece.y + dy;
    if (inBounds(x, y)) {
      destinations.push({ x, y });
    }
  }

  return destinations;
}

function getPathSquares(from, to, piece) {
  if (!isSlider(piece)) {
    return [];
  }

  const dx = Math.sign(to.x - from.x);
  const dy = Math.sign(to.y - from.y);
  const steps = Math.max(Math.abs(to.x - from.x), Math.abs(to.y - from.y));
  const path = [];

  for (let step = 1; step < steps; step += 1) {
    path.push({ x: from.x + dx * step, y: from.y + dy * step });
  }

  return path;
}

function inspectMoveAcrossWorlds(state, pieceId, to) {
  const referenceWorld = state.worlds[0];
  const referencePiece = referenceWorld.pieces[pieceId];
  if (!referencePiece || referencePiece.captured) {
    return { valid: false, reason: 'piece-missing' };
  }

  const from = getCertainPosition(state, pieceId);
  if (!from) {
    return { valid: false, reason: 'piece-uncertain' };
  }

  let targetId;

  for (const world of state.worlds) {
    const piece = world.pieces[pieceId];
    if (!piece || piece.captured || piece.x !== from.x || piece.y !== from.y) {
      return { valid: false, reason: 'piece-shifted' };
    }

    const board = buildBoard(world);
    for (const square of getPathSquares(from, to, piece)) {
      if (board.has(`${square.x},${square.y}`)) {
        return { valid: false, reason: 'path-blocked' };
      }
    }

    const occupantId = board.get(`${to.x},${to.y}`) ?? null;
    if (targetId === undefined) {
      targetId = occupantId;
    } else if (targetId !== occupantId) {
      return { valid: false, reason: 'target-uncertain' };
    }

    if (occupantId) {
      const occupant = world.pieces[occupantId];
      if (occupant.owner === piece.owner) {
        return { valid: false, reason: 'friendly-fire' };
      }
    }
  }

  return {
    valid: true,
    from,
    targetId: targetId ?? null,
  };
}

function createMoveAction(piece, to, mode, targetId = null, branches = null) {
  return {
    type: 'move',
    mode,
    pieceId: piece.id,
    pieceOwner: piece.owner,
    pieceType: piece.type,
    to,
    targetId,
    branches,
  };
}

function createObserveAction(pieceInfo) {
  return {
    type: 'observe',
    pieceId: pieceInfo.id,
    pieceOwner: pieceInfo.owner,
    pieceType: pieceInfo.type,
  };
}

function actionSorter(a, b) {
  const aKey = actionToKey(a);
  const bKey = actionToKey(b);
  return aKey.localeCompare(bKey);
}

function buildClassicalActions(state, pieceId) {
  const piece = state.worlds[0].pieces[pieceId];
  return getPseudoDestinations(piece)
    .map((to) => ({ to, inspection: inspectMoveAcrossWorlds(state, pieceId, to) }))
    .filter(({ inspection }) => inspection.valid)
    .map(({ to, inspection }) => createMoveAction(piece, to, 'classical', inspection.targetId));
}

export function getClassicalMovesForPiece(state, pieceId) {
  return buildClassicalActions(state, pieceId);
}

function buildQuantumActions(state, pieceId) {
  const piece = state.worlds[0].pieces[pieceId];
  const quietMoves = buildClassicalActions(state, pieceId).filter((action) => !action.targetId);
  const quantumActions = [];

  if (quietMoves.length < 2) {
    return quantumActions;
  }

  for (let i = 0; i < quietMoves.length; i += 1) {
    for (let j = i + 1; j < quietMoves.length; j += 1) {
      quantumActions.push(
        createMoveAction(piece, null, 'quantum', null, [quietMoves[i].to, quietMoves[j].to]),
      );
    }
  }

  return quantumActions;
}

export function listLegalActions(state, options = {}) {
  const { forOwner = state.turn, skipTerminalCheck = false } = options;

  if (!skipTerminalCheck && getTerminalResult(state)) {
    return [];
  }

  const actions = [];
  const certainPieces = getCertainPieceIds(state, forOwner).filter((pieceId) => isPieceAliveInAnyWorld(state, pieceId));

  for (const pieceId of certainPieces) {
    actions.push(...buildClassicalActions(state, pieceId));
    if (state.charges[forOwner] > 0) {
      actions.push(...buildQuantumActions(state, pieceId));
    }
  }

  for (const pieceId of getUncertainPieceIds(state)) {
    const info = getPieceInfo(state, pieceId);
    if (info && info.distribution.some((entry) => entry.kind === 'square')) {
      actions.push(createObserveAction(info));
    }
  }

  return actions.sort(actionSorter);
}

function applyClassicalMoveToWorld(world, action) {
  const nextWorld = deepClone(world);
  const piece = nextWorld.pieces[action.pieceId];
  piece.x = action.to.x;
  piece.y = action.to.y;

  if (action.targetId) {
    const target = nextWorld.pieces[action.targetId];
    target.captured = true;
    target.x = -1;
    target.y = -1;
  }

  return nextWorld;
}

function applyQuantumMoveToWorld(world, action, branchIndex) {
  const nextWorld = deepClone(world);
  const branch = action.branches[branchIndex];
  const piece = nextWorld.pieces[action.pieceId];
  piece.x = branch.x;
  piece.y = branch.y;
  return nextWorld;
}

function basicResultScan(state) {
  const blackKingAlive = isPieceAliveInAnyWorld(state, 'b-king');
  const whiteKingAlive = isPieceAliveInAnyWorld(state, 'w-king');

  if (!blackKingAlive && !whiteKingAlive) {
    return { winner: 'draw', reason: '両王同時消滅' };
  }
  if (!blackKingAlive) {
    return { winner: PLAYERS.WHITE, reason: '王を捕獲' };
  }
  if (!whiteKingAlive) {
    return { winner: PLAYERS.BLACK, reason: '王を捕獲' };
  }
  if (state.turnCount > state.maxTurns) {
    return { winner: 'draw', reason: '手数上限' };
  }
  if (state.halfmoveClock >= state.noProgressLimit) {
    return { winner: 'draw', reason: '進展なし' };
  }
  return null;
}

function finalizeState(state) {
  const result = basicResultScan(state);
  if (result) {
    state.result = result;
    return state;
  }

  const actions = listLegalActions(state, { skipTerminalCheck: true });
  if (actions.length === 0) {
    state.result = { winner: 'draw', reason: '合法手なし' };
  }

  return state;
}

function advanceTurn(state) {
  state.turn = opponentOf(state.turn);
  state.turnCount += 1;
  return state;
}

function collapseToWorld(state, world) {
  const child = cloneState(state);
  child.worlds = [{
    weight: 1,
    pieces: deepClone(world.pieces),
  }];
  child.halfmoveClock = state.halfmoveClock + 1;
  advanceTurn(child);
  return finalizeState(child);
}

export function applyDeterministicAction(state, action) {
  const nextState = cloneState(state);
  if (state.result) {
    return nextState;
  }

  if (action.type === 'move' && action.mode === 'classical') {
    nextState.worlds = state.worlds.map((world) => ({
      ...applyClassicalMoveToWorld(world, action),
      weight: world.weight,
    }));
    nextState.halfmoveClock = action.targetId ? 0 : state.halfmoveClock + 1;
    advanceTurn(nextState);
    return finalizeState(nextState);
  }

  if (action.type === 'move' && action.mode === 'quantum') {
    const splitWorlds = [];
    for (const world of state.worlds) {
      splitWorlds.push({
        ...applyQuantumMoveToWorld(world, action, 0),
        weight: world.weight * 0.5,
      });
      splitWorlds.push({
        ...applyQuantumMoveToWorld(world, action, 1),
        weight: world.weight * 0.5,
      });
    }
    nextState.worlds = mergeWorlds(splitWorlds);
    nextState.charges[state.turn] -= 1;
    nextState.halfmoveClock = state.halfmoveClock + 1;
    advanceTurn(nextState);
    return finalizeState(nextState);
  }

  throw new Error(`Deterministic apply called with unsupported action: ${action.type}/${action.mode}`);
}

export function getObserveOutcomes(state, action) {
  if (action.type !== 'observe') {
    return [];
  }

  return state.worlds.map((world) => ({
    probability: world.weight,
    state: collapseToWorld(state, world),
  }));
}

export function applyAction(state, action, options = {}) {
  const { rng } = options;

  if (action.type === 'observe') {
    let draw;
    let nextSeed = state.rngState;

    if (rng) {
      draw = rng();
    } else {
      const sampledSeed = nextSeedValue(state.rngState);
      draw = sampledSeed.value;
      nextSeed = sampledSeed.seed;
    }

    const sampled = sampleByWeight(
      state.worlds.map((world) => ({
        weight: world.weight,
        world,
      })),
      () => draw,
    );

    const nextState = collapseToWorld(state, sampled.world);
    nextState.rngState = nextSeed;
    return nextState;
  }

  return applyDeterministicAction(state, action);
}

export function getTerminalResult(state) {
  return state.result ?? basicResultScan(state) ?? null;
}

export function isTerminalState(state) {
  if (getTerminalResult(state)) {
    return true;
  }
  return listLegalActions(state, { skipTerminalCheck: true }).length === 0;
}

export function actionToText(action) {
  if (action.type === 'observe') {
    return `観測 ${PIECE_LABELS[action.pieceType]} (${PLAYER_LABELS[action.pieceOwner]})`;
  }

  const pieceLabel = PIECE_LABELS[action.pieceType];
  if (action.mode === 'classical') {
    const destination = coordToText(action.to.x, action.to.y);
    return action.targetId
      ? `${pieceLabel} → ${destination} で捕獲`
      : `${pieceLabel} → ${destination}`;
  }

  const [a, b] = action.branches;
  return `${pieceLabel} ⇢ {${coordToText(a.x, a.y)}, ${coordToText(b.x, b.y)}}`;
}

export function actionToKey(action) {
  if (action.type === 'observe') {
    return `observe:${action.pieceId}`;
  }

  if (action.mode === 'classical') {
    return `move:${action.pieceId}:${action.to.x},${action.to.y}`;
  }

  const branches = [...action.branches]
    .map((branch) => `${branch.x},${branch.y}`)
    .sort()
    .join('|');
  return `quantum:${action.pieceId}:${branches}`;
}

export function getLegalActionsForPiece(state, pieceId) {
  return listLegalActions(state).filter((action) => action.pieceId === pieceId && action.type === 'move');
}
