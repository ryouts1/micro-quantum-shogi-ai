export const TRAINED_MODEL = {
  "meta": {
    "version": "selfplay-v1",
    "generatedAt": "2026-04-05T09:55:39.601Z",
    "trainer": "scripts/trainModel.js",
    "selfPlayGames": 84,
    "sampledPositions": 896,
    "openingStates": 38,
    "bookDepth": 10,
    "priorScale": 52,
    "benchmarkGames": 4,
    "benchmarkWinRate": "50%",
    "notes": "One-ply stochastic self-play. Lightweight linear + piece-square model; no neural network."
  },
  "linear": {
    "bias": -0.001155,
    "weights": {
      "materialDiff": 0.265818,
      "mobilityDiff": -0.146622,
      "uncertaintyDiff": 0,
      "chargeDiff": 0,
      "centerDiff": 1.180782,
      "kingGuardDiff": 0.08898,
      "entropy": 0,
      "worldCount": 0,
      "tempo": -0.11406,
      "progress": 0.318816,
      "certainDiff": -0.326506
    }
  },
  "pieceSquare": {
    "king": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      -0.27,
      0,
      -0.7147,
      0,
      0,
      0.675,
      -0.2554,
      -0.5786,
      0,
      1.35,
      1.35,
      0.0681,
      -0.6955,
      0
    ],
    "rook": [
      0,
      0,
      0,
      0,
      -0.0351,
      0,
      0,
      0,
      0,
      -0.3375,
      0,
      0,
      0,
      1.35,
      1.35,
      0,
      0,
      0,
      0,
      0.675,
      0,
      0,
      0,
      0,
      0
    ],
    "bishop": [
      0,
      0,
      0,
      1.1045,
      0,
      -1.05,
      0,
      -0.45,
      0,
      -1.35,
      0,
      0.3471,
      0,
      1.35,
      0,
      0,
      0,
      0.7714,
      0,
      1.35,
      0,
      0,
      0,
      -0.1026,
      0
    ],
    "gold": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1.35,
      0,
      0,
      0,
      -0.0482,
      -0.5786,
      0,
      0,
      0,
      0.0056,
      -0.0056,
      0,
      0,
      0
    ],
    "silver": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0.3375,
      0,
      0,
      0,
      0,
      -0.0534,
      0,
      0,
      0,
      0
    ],
    "pawn": [
      0,
      0,
      0,
      0,
      0,
      0,
      -1.35,
      0,
      1.35,
      0,
      0,
      0.279,
      0,
      -0.2287,
      0,
      0,
      -0.0169,
      0,
      0.1261,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "actionProfiles": {
    "base": {
      "classical": 0.0516
    },
    "byPiece": {
      "move:classical:bishop": 0.3194,
      "move:classical:gold": 0.1503,
      "move:classical:king": -0.6022,
      "move:classical:pawn": 0.2164,
      "move:classical:rook": -0.0195,
      "move:classical:silver": 0.275
    },
    "captureTarget": {
      "bishop": -0.1736,
      "gold": 0,
      "king": 1.15,
      "pawn": 0.4542,
      "rook": 0.0806,
      "silver": -0.0651
    }
  },
  "openingBook": {
    "black :: 1 :: 0 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:1,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:4,4|b-silver:0,4|w-bishop:1,0|w-gold:3,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,0|w-silver:4,0 :: live": {
      "total": 84,
      "actions": [
        {
          "key": "move:b-rook:4,0",
          "plays": 83,
          "score": -0.0115,
          "rawScore": -0.012
        }
      ]
    },
    "white :: 2 :: 0 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:1,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:4,0|b-silver:0,4|w-bishop:1,0|w-gold:3,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,0|w-silver:captured :: live": {
      "total": 83,
      "actions": [
        {
          "key": "move:w-gold:4,0",
          "plays": 83,
          "score": 0.0115,
          "rawScore": 0.012
        }
      ]
    },
    "black :: 3 :: 0 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:1,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:0,4|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,0|w-silver:captured :: live": {
      "total": 83,
      "actions": [
        {
          "key": "move:b-bishop:1,2",
          "plays": 41,
          "score": 0.2889,
          "rawScore": 0.3171
        },
        {
          "key": "move:b-silver:0,3",
          "plays": 8,
          "score": 0.1667,
          "rawScore": 0.25
        },
        {
          "key": "move:b-pawn-2:3,2",
          "plays": 19,
          "score": -0.3043,
          "rawScore": -0.3684
        },
        {
          "key": "move:b-bishop:0,1",
          "plays": 14,
          "score": -0.5556,
          "rawScore": -0.7143
        }
      ]
    },
    "white :: 4 :: 1 :: 3/3 :: 1.000000:b-bishop:1,2|b-gold:1,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:0,4|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,0|w-silver:captured :: live": {
      "total": 41,
      "actions": [
        {
          "key": "move:w-pawn-1:1,2",
          "plays": 41,
          "score": -0.2889,
          "rawScore": -0.3171
        }
      ]
    },
    "black :: 5 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:1,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:0,4|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:1,2|w-pawn-2:3,1|w-rook:0,0|w-silver:captured :: live": {
      "total": 41,
      "actions": [
        {
          "key": "move:b-pawn-1:1,2",
          "plays": 36,
          "score": 0.3,
          "rawScore": 0.3333
        },
        {
          "key": "move:b-king:3,4",
          "plays": 2,
          "score": 0,
          "rawScore": 0
        },
        {
          "key": "move:b-king:2,3",
          "plays": 2,
          "score": 0,
          "rawScore": 0
        }
      ]
    },
    "white :: 6 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:1,4|b-king:2,4|b-pawn-1:1,2|b-pawn-2:3,3|b-rook:captured|b-silver:0,4|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:captured|w-pawn-2:3,1|w-rook:0,0|w-silver:captured :: live": {
      "total": 36,
      "actions": [
        {
          "key": "move:w-rook:0,4",
          "plays": 36,
          "score": -0.3,
          "rawScore": -0.3333
        }
      ]
    },
    "black :: 7 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:1,4|b-king:2,4|b-pawn-1:1,2|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:captured|w-pawn-2:3,1|w-rook:0,4|w-silver:captured :: live": {
      "total": 36,
      "actions": [
        {
          "key": "move:b-gold:0,4",
          "plays": 36,
          "score": 0.3,
          "rawScore": 0.3333
        }
      ]
    },
    "white :: 8 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,4|b-pawn-1:1,2|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:captured|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 36,
      "actions": [
        {
          "key": "move:w-bishop:3,2",
          "plays": 15,
          "score": 0.2632,
          "rawScore": 0.3333
        },
        {
          "key": "move:w-gold:4,1",
          "plays": 4,
          "score": 0,
          "rawScore": 0
        },
        {
          "key": "move:w-king:1,1",
          "plays": 16,
          "score": -0.8,
          "rawScore": -1
        }
      ]
    },
    "white :: 4 :: 1 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:1,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,2|b-rook:captured|b-silver:0,4|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,0|w-silver:captured :: live": {
      "total": 19,
      "actions": [
        {
          "key": "move:w-bishop:3,2",
          "plays": 5,
          "score": 0.3333,
          "rawScore": 0.6
        },
        {
          "key": "move:w-rook:0,4",
          "plays": 14,
          "score": 0.2222,
          "rawScore": 0.2857
        }
      ]
    },
    "black :: 9 :: 1 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,4|b-pawn-1:1,2|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:1,0|w-gold:4,0|w-king:1,1|w-pawn-1:captured|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 16,
      "actions": [
        {
          "key": "move:b-pawn-1:1,1",
          "plays": 16,
          "score": 0.8,
          "rawScore": 1
        }
      ]
    },
    "black :: 9 :: 1 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,4|b-pawn-1:1,2|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:3,2|w-gold:4,0|w-king:2,0|w-pawn-1:captured|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 15,
      "actions": [
        {
          "key": "move:b-pawn-2:3,2",
          "plays": 15,
          "score": -0.2632,
          "rawScore": -0.3333
        }
      ]
    },
    "white :: 10 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,4|b-pawn-1:1,2|b-pawn-2:3,2|b-rook:captured|b-silver:captured|w-bishop:captured|w-gold:4,0|w-king:2,0|w-pawn-1:captured|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 15,
      "actions": [
        {
          "key": "move:w-pawn-2:3,2",
          "plays": 12,
          "score": 0.5,
          "rawScore": 0.6667
        },
        {
          "key": "move:w-king:1,1",
          "plays": 2,
          "score": -0.3333,
          "rawScore": -1
        }
      ]
    },
    "white :: 4 :: 1 :: 3/3 :: 1.000000:b-bishop:0,1|b-gold:1,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:0,4|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,0|w-silver:captured :: live": {
      "total": 14,
      "actions": [
        {
          "key": "move:w-bishop:0,1",
          "plays": 7,
          "score": 0.6364,
          "rawScore": 1
        },
        {
          "key": "move:w-rook:0,1",
          "plays": 7,
          "score": 0.2727,
          "rawScore": 0.4286
        }
      ]
    },
    "black :: 5 :: 0 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:1,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,2|b-rook:captured|b-silver:captured|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,4|w-silver:captured :: live": {
      "total": 14,
      "actions": [
        {
          "key": "move:b-gold:0,4",
          "plays": 14,
          "score": -0.2222,
          "rawScore": -0.2857
        }
      ]
    },
    "white :: 6 :: 0 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:0,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,2|b-rook:captured|b-silver:captured|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 14,
      "actions": [
        {
          "key": "move:w-bishop:3,2",
          "plays": 12,
          "score": 0.25,
          "rawScore": 0.3333
        },
        {
          "key": "move:w-pawn-2:3,2",
          "plays": 2,
          "score": 0,
          "rawScore": 0
        }
      ]
    },
    "black :: 7 :: 0 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:0,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:3,2|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 12,
      "actions": [
        {
          "key": "move:b-bishop:1,2",
          "plays": 3,
          "score": 0.1429,
          "rawScore": 0.3333
        },
        {
          "key": "move:b-bishop:2,3",
          "plays": 2,
          "score": 0,
          "rawScore": 0
        },
        {
          "key": "move:b-king:3,3",
          "plays": 3,
          "score": -0.1429,
          "rawScore": -0.3333
        },
        {
          "key": "move:b-king:2,3",
          "plays": 4,
          "score": -0.5,
          "rawScore": -1
        }
      ]
    },
    "white :: 4 :: 1 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:1,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:0,3|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,0|w-silver:captured :: live": {
      "total": 8,
      "actions": [
        {
          "key": "move:w-rook:0,3",
          "plays": 8,
          "score": -0.1667,
          "rawScore": -0.25
        }
      ]
    },
    "black :: 5 :: 0 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:1,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,3|w-silver:captured :: live": {
      "total": 8,
      "actions": [
        {
          "key": "move:b-gold:0,3",
          "plays": 8,
          "score": 0.1667,
          "rawScore": 0.25
        }
      ]
    },
    "white :: 6 :: 0 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:0,3|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 8,
      "actions": [
        {
          "key": "move:w-bishop:3,2",
          "plays": 5,
          "score": 0.1111,
          "rawScore": 0.2
        },
        {
          "key": "move:w-pawn-1:1,2",
          "plays": 3,
          "score": -0.4286,
          "rawScore": -1
        }
      ]
    },
    "black :: 5 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:1,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:0,4|w-bishop:0,1|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,0|w-silver:captured :: live": {
      "total": 7,
      "actions": [
        {
          "key": "move:b-king:2,3",
          "plays": 5,
          "score": -0.5556,
          "rawScore": -1
        }
      ]
    },
    "black :: 5 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:1,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:0,4|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,1|w-silver:captured :: live": {
      "total": 7,
      "actions": [
        {
          "key": "move:b-king:2,3",
          "plays": 4,
          "score": 0,
          "rawScore": 0
        },
        {
          "key": "move:b-king:3,4",
          "plays": 2,
          "score": -0.3333,
          "rawScore": -1
        }
      ]
    },
    "black :: 7 :: 1 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:0,3|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:3,2|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 5,
      "actions": [
        {
          "key": "move:b-pawn-2:3,2",
          "plays": 5,
          "score": -0.1111,
          "rawScore": -0.2
        }
      ]
    },
    "white :: 8 :: 0 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:0,3|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,2|b-rook:captured|b-silver:captured|w-bishop:captured|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 5,
      "actions": [
        {
          "key": "move:w-pawn-2:3,2",
          "plays": 3,
          "score": 0.1429,
          "rawScore": 0.3333
        },
        {
          "key": "move:w-pawn-1:1,2",
          "plays": 2,
          "score": 0,
          "rawScore": 0
        }
      ]
    },
    "black :: 5 :: 0 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:1,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:0,4|w-bishop:3,2|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,0|w-silver:captured :: live": {
      "total": 5,
      "actions": [
        {
          "key": "move:b-king:3,3",
          "plays": 4,
          "score": -0.5,
          "rawScore": -1
        }
      ]
    },
    "white :: 6 :: 1 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:1,4|b-king:2,3|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:0,4|w-bishop:0,1|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,0|w-silver:captured :: live": {
      "total": 5,
      "actions": [
        {
          "key": "move:w-bishop:2,3",
          "plays": 5,
          "score": 0.5556,
          "rawScore": 1
        }
      ]
    },
    "black :: 9 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:3,2|w-gold:4,0|w-king:2,0|w-pawn-1:1,2|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 4,
      "actions": [
        {
          "key": "move:b-pawn-1:1,2",
          "plays": 3,
          "score": 0.4286,
          "rawScore": 1
        }
      ]
    },
    "white :: 6 :: 1 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:1,4|b-king:3,3|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:0,4|w-bishop:3,2|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,0|w-silver:captured :: live": {
      "total": 4,
      "actions": [
        {
          "key": "move:w-bishop:1,4",
          "plays": 2,
          "score": 0.3333,
          "rawScore": 1
        },
        {
          "key": "move:w-rook:0,4",
          "plays": 2,
          "score": 0.3333,
          "rawScore": 1
        }
      ]
    },
    "black :: 9 :: 1 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,4|b-pawn-1:1,2|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:1,0|w-gold:4,1|w-king:2,0|w-pawn-1:captured|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 4,
      "actions": [
        {
          "key": "move:b-pawn-2:3,2",
          "plays": 2,
          "score": -0.3333,
          "rawScore": -1
        }
      ]
    },
    "white :: 6 :: 1 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:1,4|b-king:2,3|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:0,4|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,1|w-silver:captured :: live": {
      "total": 4,
      "actions": [
        {
          "key": "move:w-rook:0,4",
          "plays": 4,
          "score": 0,
          "rawScore": 0
        }
      ]
    },
    "black :: 7 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:1,4|b-king:2,3|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,4|w-silver:captured :: live": {
      "total": 4,
      "actions": [
        {
          "key": "move:b-gold:0,4",
          "plays": 4,
          "score": 0,
          "rawScore": 0
        }
      ]
    },
    "white :: 8 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,3|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 4,
      "actions": [
        {
          "key": "move:w-bishop:2,1",
          "plays": 3,
          "score": 0.1429,
          "rawScore": 0.3333
        }
      ]
    },
    "white :: 8 :: 1 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:0,4|b-king:2,3|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:3,2|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 4,
      "actions": [
        {
          "key": "move:w-bishop:2,3",
          "plays": 4,
          "score": 0.5,
          "rawScore": 1
        }
      ]
    },
    "black :: 7 :: 1 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:0,3|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:1,2|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 3,
      "actions": [
        {
          "key": "move:b-gold:1,2",
          "plays": 2,
          "score": 0.3333,
          "rawScore": 1
        }
      ]
    },
    "black :: 9 :: 0 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:0,3|b-king:2,4|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:captured|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,2|w-rook:captured|w-silver:captured :: live": {
      "total": 3,
      "actions": [
        {
          "key": "move:b-king:3,3",
          "plays": 2,
          "score": -0.3333,
          "rawScore": -1
        }
      ]
    },
    "white :: 8 :: 1 :: 3/3 :: 1.000000:b-bishop:1,2|b-gold:0,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:3,2|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 3,
      "actions": [
        {
          "key": "move:w-pawn-1:1,2",
          "plays": 3,
          "score": -0.1429,
          "rawScore": -0.3333
        }
      ]
    },
    "white :: 10 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,4|b-pawn-1:1,2|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:3,2|w-gold:4,0|w-king:2,0|w-pawn-1:captured|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 3,
      "actions": [
        {
          "key": "move:w-king:1,1",
          "plays": 3,
          "score": -0.4286,
          "rawScore": -1
        }
      ]
    },
    "white :: 8 :: 1 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:0,4|b-king:3,3|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:3,2|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 3,
      "actions": [
        {
          "key": "move:w-pawn-1:1,2",
          "plays": 2,
          "score": 0.3333,
          "rawScore": 1
        }
      ]
    },
    "black :: 9 :: 1 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,3|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:2,1|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 3,
      "actions": [
        {
          "key": "move:b-pawn-2:3,2",
          "plays": 2,
          "score": -0.3333,
          "rawScore": -1
        }
      ]
    }
  },
  "benchmarks": {
    "generatedAt": "2026-04-05T10:03:34.286Z",
    "config": {
      "gamesPerMatchup": 1,
      "maxPlies": 24,
      "matchups": [
        {
          "label": "learned-black-vs-expect",
          "black": "learned-hybrid",
          "white": "expectiminimax"
        },
        {
          "label": "expect-black-vs-learned",
          "black": "expectiminimax",
          "white": "learned-hybrid"
        },
        {
          "label": "learned-black-vs-mcts",
          "black": "learned-hybrid",
          "white": "mcts"
        },
        {
          "label": "mcts-black-vs-learned",
          "black": "mcts",
          "white": "learned-hybrid"
        }
      ],
      "engineSettings": {
        "expectiminimax": {
          "depth": 1
        },
        "mcts": {
          "iterations": 70
        },
        "learned-hybrid": {
          "depth": 1,
          "iterations": 90
        }
      }
    },
    "summary": {
      "totalGames": 4,
      "learnedWins": 2,
      "learnedLosses": 2,
      "draws": 0,
      "totalPoints": 2,
      "pointRate": 0.5,
      "trainedAsBlack": "1-1-0",
      "trainedAsWhite": "1-1-0",
      "averagePlies": 14,
      "note": "low-budget controller check: learned-hybrid vs expectiminimax / mcts with shared trained evaluator"
    },
    "games": [
      {
        "label": "learned-black-vs-expect",
        "black": "learned-hybrid",
        "white": "expectiminimax",
        "learnedSide": "black",
        "winner": "white",
        "reason": "王を捕獲",
        "plies": 12,
        "learnedPoint": 0
      },
      {
        "label": "expect-black-vs-learned",
        "black": "expectiminimax",
        "white": "learned-hybrid",
        "learnedSide": "white",
        "winner": "white",
        "reason": "王を捕獲",
        "plies": 12,
        "learnedPoint": 1
      },
      {
        "label": "learned-black-vs-mcts",
        "black": "learned-hybrid",
        "white": "mcts",
        "learnedSide": "black",
        "winner": "black",
        "reason": "王を捕獲",
        "plies": 19,
        "learnedPoint": 1
      },
      {
        "label": "mcts-black-vs-learned",
        "black": "mcts",
        "white": "learned-hybrid",
        "learnedSide": "white",
        "winner": "black",
        "reason": "王を捕獲",
        "plies": 13,
        "learnedPoint": 0
      }
    ]
  }
};
