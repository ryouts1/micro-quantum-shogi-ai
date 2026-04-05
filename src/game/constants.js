export const BOARD_SIZE = 5;
export const PLAYERS = {
  BLACK: 'black',
  WHITE: 'white',
};

export const PLAYER_LABELS = {
  [PLAYERS.BLACK]: '先手',
  [PLAYERS.WHITE]: '後手',
};

export const PIECE_TYPES = {
  KING: 'king',
  GOLD: 'gold',
  SILVER: 'silver',
  BISHOP: 'bishop',
  ROOK: 'rook',
  PAWN: 'pawn',
};

export const PIECE_LABELS = {
  [PIECE_TYPES.KING]: '王',
  [PIECE_TYPES.GOLD]: '金',
  [PIECE_TYPES.SILVER]: '銀',
  [PIECE_TYPES.BISHOP]: '角',
  [PIECE_TYPES.ROOK]: '飛',
  [PIECE_TYPES.PAWN]: '歩',
};

export const PIECE_VALUES = {
  [PIECE_TYPES.KING]: 10_000,
  [PIECE_TYPES.ROOK]: 900,
  [PIECE_TYPES.BISHOP]: 780,
  [PIECE_TYPES.GOLD]: 600,
  [PIECE_TYPES.SILVER]: 520,
  [PIECE_TYPES.PAWN]: 180,
};

export const INITIAL_QUANTUM_CHARGES = 3;
export const MAX_TURNS = 120;
export const NO_PROGRESS_LIMIT = 40;

export const FILE_LABELS = ['1', '2', '3', '4', '5'];
export const RANK_LABELS = ['A', 'B', 'C', 'D', 'E'];

export const DIRECTIONS = {
  king: [
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0],
    [-1, -1],
  ],
  rook: [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
  ],
  bishop: [
    [1, -1],
    [1, 1],
    [-1, 1],
    [-1, -1],
  ],
};

export const INITIAL_PIECES = [
  { id: 'w-rook', owner: PLAYERS.WHITE, type: PIECE_TYPES.ROOK, x: 0, y: 0 },
  { id: 'w-bishop', owner: PLAYERS.WHITE, type: PIECE_TYPES.BISHOP, x: 1, y: 0 },
  { id: 'w-king', owner: PLAYERS.WHITE, type: PIECE_TYPES.KING, x: 2, y: 0 },
  { id: 'w-gold', owner: PLAYERS.WHITE, type: PIECE_TYPES.GOLD, x: 3, y: 0 },
  { id: 'w-silver', owner: PLAYERS.WHITE, type: PIECE_TYPES.SILVER, x: 4, y: 0 },
  { id: 'w-pawn-1', owner: PLAYERS.WHITE, type: PIECE_TYPES.PAWN, x: 1, y: 1 },
  { id: 'w-pawn-2', owner: PLAYERS.WHITE, type: PIECE_TYPES.PAWN, x: 3, y: 1 },
  { id: 'b-silver', owner: PLAYERS.BLACK, type: PIECE_TYPES.SILVER, x: 0, y: 4 },
  { id: 'b-gold', owner: PLAYERS.BLACK, type: PIECE_TYPES.GOLD, x: 1, y: 4 },
  { id: 'b-king', owner: PLAYERS.BLACK, type: PIECE_TYPES.KING, x: 2, y: 4 },
  { id: 'b-bishop', owner: PLAYERS.BLACK, type: PIECE_TYPES.BISHOP, x: 3, y: 4 },
  { id: 'b-rook', owner: PLAYERS.BLACK, type: PIECE_TYPES.ROOK, x: 4, y: 4 },
  { id: 'b-pawn-1', owner: PLAYERS.BLACK, type: PIECE_TYPES.PAWN, x: 1, y: 3 },
  { id: 'b-pawn-2', owner: PLAYERS.BLACK, type: PIECE_TYPES.PAWN, x: 3, y: 3 },
];

export const HEATMAP_COLORS = {
  low: '#205072',
  medium: '#f6bd60',
  high: '#f94144',
};
