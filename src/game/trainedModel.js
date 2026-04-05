export const TRAINED_MODEL = {
  "meta": {
    "version": "selfplay-v2-xl",
    "generatedAt": "2026-04-05T11:10:47.129Z",
    "trainer": "scripts/trainModel.js",
    "selfPlayGames": 1200,
    "sampledPositions": 13107,
    "openingStates": 225,
    "bookDepth": 12,
    "openingBookMaxStates": 240,
    "priorScale": 52,
    "workersRequested": 1,
    "benchmarkGames": 4,
    "benchmarkWinRate": "63%",
    "notes": "Large-batch one-ply stochastic self-play. Lightweight linear + piece-square model; no neural network."
  },
  "linear": {
    "bias": -0.107159,
    "weights": {
      "materialDiff": 0.229123,
      "mobilityDiff": -0.377643,
      "uncertaintyDiff": 0.537384,
      "chargeDiff": 1.257672,
      "centerDiff": 1.164572,
      "kingGuardDiff": 0.007924,
      "entropy": -0.076923,
      "worldCount": -0.076923,
      "tempo": -0.044558,
      "progress": -0.018085,
      "certainDiff": 0.461575
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
      -1.35,
      0.3682,
      0,
      0,
      -0.0794,
      -0.9346,
      -0.5759,
      1.35,
      0,
      0.3631,
      -0.2028,
      -0.7549,
      -1.35,
      1.35,
      -0.1646,
      0.0713,
      -0.8534,
      0
    ],
    "rook": [
      0,
      0,
      0,
      0,
      -0.0441,
      0,
      0,
      0,
      0,
      0.4411,
      0,
      0,
      0,
      0.9,
      0.2464,
      0,
      0,
      0,
      0,
      0.8878,
      0,
      0,
      0,
      0,
      -0.0779
    ],
    "bishop": [
      0,
      0,
      0,
      1.0216,
      0,
      -1.0289,
      0,
      -0.15,
      0,
      0.6023,
      0,
      0.3265,
      0,
      1.125,
      0,
      0,
      0,
      0.7064,
      0,
      1.0793,
      0,
      0,
      0,
      -0.1595,
      0
    ],
    "gold": [
      0,
      0,
      0,
      0,
      0,
      0,
      1.35,
      -1.35,
      0,
      0,
      1.2214,
      0.9479,
      0,
      0,
      0,
      -0.2904,
      0.1566,
      -1.17,
      1.35,
      0,
      -0.0113,
      0.0599,
      1.35,
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
      -1.35,
      0,
      0,
      0,
      -1.35,
      0,
      0,
      0,
      0,
      -0.525,
      -1.35,
      0,
      0,
      0,
      0.0492,
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
      -0.3938,
      0,
      0.1558,
      0,
      0,
      0.3809,
      0,
      -0.1572,
      0,
      0,
      -0.0672,
      0,
      0.1505,
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
      "classical": 0.0539,
      "observe": -0.3667,
      "quantum": -0.6875
    },
    "byPiece": {
      "move:classical:bishop": 0.3411,
      "move:classical:gold": 0.0827,
      "move:classical:king": -0.5413,
      "move:classical:pawn": 0.2417,
      "move:classical:rook": 0.0036,
      "move:classical:silver": -0.3951,
      "move:quantum:bishop": -0.6286,
      "move:quantum:king": -1.1,
      "observe:bishop": 0,
      "observe:king": -1.1
    },
    "captureTarget": {
      "bishop": -0.2569,
      "gold": 0.3915,
      "king": 1.15,
      "pawn": 0.4244,
      "rook": 0.0602,
      "silver": -0.0429
    }
  },
  "openingBook": {
    "black :: 1 :: 0 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:1,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:4,4|b-silver:0,4|w-bishop:1,0|w-gold:3,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,0|w-silver:4,0 :: live": {
      "total": 1200,
      "actions": [
        {
          "key": "move:b-rook:4,2",
          "plays": 28,
          "score": 0.1875,
          "rawScore": 0.2143
        },
        {
          "key": "move:b-rook:4,0",
          "plays": 1167,
          "score": 0.047,
          "rawScore": 0.0471
        },
        {
          "key": "move:b-bishop:1,2",
          "plays": 2,
          "score": 0,
          "rawScore": 0
        },
        {
          "key": "move:b-bishop:0,1",
          "plays": 3,
          "score": -0.4286,
          "rawScore": -1
        }
      ]
    },
    "white :: 2 :: 0 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:1,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:4,0|b-silver:0,4|w-bishop:1,0|w-gold:3,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,0|w-silver:captured :: live": {
      "total": 1167,
      "actions": [
        {
          "key": "move:w-rook:0,4",
          "plays": 2,
          "score": 0.3333,
          "rawScore": 1
        },
        {
          "key": "move:w-gold:4,0",
          "plays": 1165,
          "score": -0.0488,
          "rawScore": -0.0489
        }
      ]
    },
    "black :: 3 :: 0 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:1,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:0,4|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,0|w-silver:captured :: live": {
      "total": 1165,
      "actions": [
        {
          "key": "move:b-bishop:1,2",
          "plays": 639,
          "score": 0.4463,
          "rawScore": 0.4491
        },
        {
          "key": "move:b-bishop:2,3",
          "plays": 14,
          "score": 0.2222,
          "rawScore": 0.2857
        },
        {
          "key": "move:b-pawn-2:3,2",
          "plays": 234,
          "score": -0.2185,
          "rawScore": -0.2222
        },
        {
          "key": "move:b-silver:0,3",
          "plays": 86,
          "score": -0.2889,
          "rawScore": -0.3023
        },
        {
          "key": "quantum:b-bishop:0,1|4,3",
          "plays": 5,
          "score": -0.5556,
          "rawScore": -1
        }
      ]
    },
    "black :: 5 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:1,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:0,4|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:1,2|w-pawn-2:3,1|w-rook:0,0|w-silver:captured :: live": {
      "total": 641,
      "actions": [
        {
          "key": "move:b-pawn-1:1,2",
          "plays": 593,
          "score": 0.4807,
          "rawScore": 0.484
        },
        {
          "key": "move:b-pawn-2:3,2",
          "plays": 23,
          "score": 0.1111,
          "rawScore": 0.1304
        },
        {
          "key": "move:b-king:2,3",
          "plays": 18,
          "score": -0.0909,
          "rawScore": -0.1111
        },
        {
          "key": "move:b-king:3,4",
          "plays": 7,
          "score": -0.0909,
          "rawScore": -0.1429
        }
      ]
    },
    "white :: 4 :: 1 :: 3/3 :: 1.000000:b-bishop:1,2|b-gold:1,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:0,4|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,0|w-silver:captured :: live": {
      "total": 639,
      "actions": [
        {
          "key": "move:w-pawn-1:1,2",
          "plays": 639,
          "score": -0.4463,
          "rawScore": -0.4491
        }
      ]
    },
    "white :: 6 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:1,4|b-king:2,4|b-pawn-1:1,2|b-pawn-2:3,3|b-rook:captured|b-silver:0,4|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:captured|w-pawn-2:3,1|w-rook:0,0|w-silver:captured :: live": {
      "total": 593,
      "actions": [
        {
          "key": "move:w-bishop:3,2",
          "plays": 2,
          "score": -0.3333,
          "rawScore": -1
        },
        {
          "key": "move:w-rook:0,3",
          "plays": 2,
          "score": -0.3333,
          "rawScore": -1
        },
        {
          "key": "move:w-rook:0,4",
          "plays": 588,
          "score": -0.4764,
          "rawScore": -0.4796
        }
      ]
    },
    "black :: 7 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:1,4|b-king:2,4|b-pawn-1:1,2|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:captured|w-pawn-2:3,1|w-rook:0,4|w-silver:captured :: live": {
      "total": 588,
      "actions": [
        {
          "key": "move:b-gold:0,4",
          "plays": 588,
          "score": 0.4764,
          "rawScore": 0.4796
        }
      ]
    },
    "white :: 8 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,4|b-pawn-1:1,2|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:captured|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 588,
      "actions": [
        {
          "key": "move:w-bishop:3,2",
          "plays": 228,
          "score": 0.2069,
          "rawScore": 0.2105
        },
        {
          "key": "move:w-gold:4,1",
          "plays": 26,
          "score": -0.1333,
          "rawScore": -0.1538
        },
        {
          "key": "move:w-bishop:2,1",
          "plays": 6,
          "score": -0.2,
          "rawScore": -0.3333
        },
        {
          "key": "move:w-king:2,1",
          "plays": 3,
          "score": -0.4286,
          "rawScore": -1
        },
        {
          "key": "move:w-bishop:4,3",
          "plays": 20,
          "score": -0.6667,
          "rawScore": -0.8
        }
      ]
    },
    "black :: 9 :: 1 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,4|b-pawn-1:1,2|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:1,0|w-gold:4,0|w-king:1,1|w-pawn-1:captured|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 305,
      "actions": [
        {
          "key": "move:b-pawn-1:1,1",
          "plays": 305,
          "score": 0.9871,
          "rawScore": 1
        }
      ]
    },
    "white :: 4 :: 1 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:1,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,2|b-rook:captured|b-silver:0,4|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,0|w-silver:captured :: live": {
      "total": 234,
      "actions": [
        {
          "key": "move:w-bishop:3,2",
          "plays": 32,
          "score": 0.5,
          "rawScore": 0.5625
        },
        {
          "key": "move:w-pawn-2:3,2",
          "plays": 4,
          "score": 0.25,
          "rawScore": 0.5
        },
        {
          "key": "move:w-rook:0,4",
          "plays": 198,
          "score": 0.1584,
          "rawScore": 0.1616
        }
      ]
    },
    "white :: 10 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,4|b-pawn-1:1,2|b-pawn-2:3,2|b-rook:captured|b-silver:captured|w-bishop:captured|w-gold:4,0|w-king:2,0|w-pawn-1:captured|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 230,
      "actions": [
        {
          "key": "move:w-king:2,1",
          "plays": 6,
          "score": 0.4,
          "rawScore": 0.6667
        },
        {
          "key": "move:w-pawn-2:3,2",
          "plays": 190,
          "score": 0.3918,
          "rawScore": 0.4
        },
        {
          "key": "move:w-king:1,1",
          "plays": 32,
          "score": -0.8889,
          "rawScore": -1
        }
      ]
    },
    "black :: 9 :: 1 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,4|b-pawn-1:1,2|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:3,2|w-gold:4,0|w-king:2,0|w-pawn-1:captured|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 228,
      "actions": [
        {
          "key": "move:b-pawn-2:3,2",
          "plays": 228,
          "score": -0.2069,
          "rawScore": -0.2105
        }
      ]
    },
    "black :: 5 :: 0 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:1,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,2|b-rook:captured|b-silver:captured|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,4|w-silver:captured :: live": {
      "total": 198,
      "actions": [
        {
          "key": "move:b-gold:0,4",
          "plays": 198,
          "score": -0.1584,
          "rawScore": -0.1616
        }
      ]
    },
    "white :: 6 :: 0 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:0,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,2|b-rook:captured|b-silver:captured|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 198,
      "actions": [
        {
          "key": "move:w-pawn-2:3,2",
          "plays": 11,
          "score": 0.3333,
          "rawScore": 0.4545
        },
        {
          "key": "move:w-bishop:3,2",
          "plays": 186,
          "score": 0.1368,
          "rawScore": 0.1398
        }
      ]
    },
    "black :: 11 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,4|b-pawn-1:1,2|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:captured|w-gold:4,0|w-king:2,0|w-pawn-1:captured|w-pawn-2:3,2|w-rook:captured|w-silver:captured :: live": {
      "total": 190,
      "actions": [
        {
          "key": "move:b-king:1,3",
          "plays": 14,
          "score": 0.4444,
          "rawScore": 0.5714
        },
        {
          "key": "move:b-king:2,3",
          "plays": 49,
          "score": 0.3962,
          "rawScore": 0.4286
        },
        {
          "key": "move:b-gold:1,3",
          "plays": 18,
          "score": 0.1818,
          "rawScore": 0.2222
        },
        {
          "key": "move:b-king:3,3",
          "plays": 108,
          "score": -0.9643,
          "rawScore": -1
        }
      ]
    },
    "black :: 7 :: 0 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:0,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:3,2|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 187,
      "actions": [
        {
          "key": "move:b-bishop:1,2",
          "plays": 57,
          "score": 0.3443,
          "rawScore": 0.3684
        },
        {
          "key": "move:b-bishop:2,3",
          "plays": 30,
          "score": 0.2353,
          "rawScore": 0.2667
        },
        {
          "key": "move:b-king:3,3",
          "plays": 88,
          "score": -0.4783,
          "rawScore": -0.5
        },
        {
          "key": "move:b-king:2,3",
          "plays": 12,
          "score": -0.75,
          "rawScore": -1
        }
      ]
    },
    "white :: 4 :: 1 :: 3/3 :: 1.000000:b-bishop:0,1|b-gold:1,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:0,4|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,0|w-silver:captured :: live": {
      "total": 186,
      "actions": [
        {
          "key": "move:w-bishop:0,1",
          "plays": 90,
          "score": 0.9362,
          "rawScore": 0.9778
        },
        {
          "key": "move:w-rook:0,1",
          "plays": 96,
          "score": 0.62,
          "rawScore": 0.6458
        }
      ]
    },
    "white :: 12 :: 1 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:3,3|b-pawn-1:1,2|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:captured|w-gold:4,0|w-king:2,0|w-pawn-1:captured|w-pawn-2:3,2|w-rook:captured|w-silver:captured :: live": {
      "total": 108,
      "actions": [
        {
          "key": "move:w-pawn-2:3,3",
          "plays": 108,
          "score": 0.9643,
          "rawScore": 1
        }
      ]
    },
    "black :: 5 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:1,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:0,4|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,1|w-silver:captured :: live": {
      "total": 98,
      "actions": [
        {
          "key": "move:b-silver:0,3",
          "plays": 4,
          "score": -0.25,
          "rawScore": -0.5
        },
        {
          "key": "move:b-king:2,3",
          "plays": 48,
          "score": -0.4615,
          "rawScore": -0.5
        },
        {
          "key": "move:b-pawn-1:1,2",
          "plays": 20,
          "score": -0.5833,
          "rawScore": -0.7
        },
        {
          "key": "move:b-king:3,4",
          "plays": 15,
          "score": -0.6842,
          "rawScore": -0.8667
        },
        {
          "key": "move:b-pawn-2:3,2",
          "plays": 11,
          "score": -0.7333,
          "rawScore": -1
        }
      ]
    },
    "black :: 5 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:1,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:0,4|w-bishop:0,1|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,0|w-silver:captured :: live": {
      "total": 91,
      "actions": [
        {
          "key": "move:b-king:3,4",
          "plays": 7,
          "score": -0.6364,
          "rawScore": -1
        },
        {
          "key": "move:b-gold:2,3",
          "plays": 10,
          "score": -0.7143,
          "rawScore": -1
        },
        {
          "key": "move:b-pawn-1:1,2",
          "plays": 21,
          "score": -0.76,
          "rawScore": -0.9048
        },
        {
          "key": "move:b-king:2,3",
          "plays": 53,
          "score": -0.9298,
          "rawScore": -1
        }
      ]
    },
    "white :: 8 :: 1 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:0,4|b-king:3,3|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:3,2|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 88,
      "actions": [
        {
          "key": "move:w-pawn-1:1,2",
          "plays": 50,
          "score": 0.9259,
          "rawScore": 1
        },
        {
          "key": "move:w-gold:3,0",
          "plays": 9,
          "score": 0.6923,
          "rawScore": 1
        },
        {
          "key": "move:w-king:2,1",
          "plays": 4,
          "score": 0.5,
          "rawScore": 1
        },
        {
          "key": "move:w-bishop:2,3",
          "plays": 24,
          "score": -0.7143,
          "rawScore": -0.8333
        }
      ]
    },
    "white :: 4 :: 1 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:1,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:0,3|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,0|w-silver:captured :: live": {
      "total": 86,
      "actions": [
        {
          "key": "move:w-rook:0,3",
          "plays": 86,
          "score": 0.2889,
          "rawScore": 0.3023
        }
      ]
    },
    "black :: 5 :: 0 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:1,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,3|w-silver:captured :: live": {
      "total": 86,
      "actions": [
        {
          "key": "move:b-gold:0,3",
          "plays": 86,
          "score": -0.2889,
          "rawScore": -0.3023
        }
      ]
    },
    "white :: 6 :: 0 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:0,3|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 86,
      "actions": [
        {
          "key": "move:w-bishop:3,2",
          "plays": 57,
          "score": 0.541,
          "rawScore": 0.5789
        },
        {
          "key": "move:w-bishop:2,1",
          "plays": 7,
          "score": 0.2727,
          "rawScore": 0.4286
        },
        {
          "key": "move:w-king:2,1",
          "plays": 3,
          "score": -0.1429,
          "rawScore": -0.3333
        },
        {
          "key": "move:w-pawn-1:1,2",
          "plays": 16,
          "score": -0.3,
          "rawScore": -0.375
        },
        {
          "key": "move:w-gold:4,1",
          "plays": 3,
          "score": -0.4286,
          "rawScore": -1
        }
      ]
    },
    "black :: 9 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:3,2|w-gold:4,0|w-king:2,0|w-pawn-1:1,2|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 74,
      "actions": [
        {
          "key": "move:b-pawn-1:1,2",
          "plays": 53,
          "score": 0.7544,
          "rawScore": 0.8113
        },
        {
          "key": "move:b-king:2,3",
          "plays": 10,
          "score": -0.7143,
          "rawScore": -1
        },
        {
          "key": "move:b-king:3,3",
          "plays": 10,
          "score": -0.7143,
          "rawScore": -1
        }
      ]
    },
    "black :: 7 :: 1 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:0,3|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:3,2|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 57,
      "actions": [
        {
          "key": "move:b-pawn-2:3,2",
          "plays": 57,
          "score": -0.541,
          "rawScore": -0.5789
        }
      ]
    },
    "white :: 8 :: 0 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:0,3|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,2|b-rook:captured|b-silver:captured|w-bishop:captured|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 57,
      "actions": [
        {
          "key": "move:w-pawn-2:3,2",
          "plays": 49,
          "score": 0.6226,
          "rawScore": 0.6735
        },
        {
          "key": "move:w-king:2,1",
          "plays": 5,
          "score": 0.3333,
          "rawScore": 0.6
        },
        {
          "key": "move:w-pawn-1:1,2",
          "plays": 3,
          "score": -0.4286,
          "rawScore": -1
        }
      ]
    },
    "white :: 8 :: 1 :: 3/3 :: 1.000000:b-bishop:1,2|b-gold:0,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:3,2|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 57,
      "actions": [
        {
          "key": "move:w-pawn-1:1,2",
          "plays": 57,
          "score": -0.3443,
          "rawScore": -0.3684
        }
      ]
    },
    "white :: 10 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,4|b-pawn-1:1,2|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:3,2|w-gold:4,0|w-king:2,0|w-pawn-1:captured|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 55,
      "actions": [
        {
          "key": "move:w-gold:3,0",
          "plays": 5,
          "score": 0.3333,
          "rawScore": 0.6
        },
        {
          "key": "move:w-king:1,0",
          "plays": 2,
          "score": 0,
          "rawScore": 0
        },
        {
          "key": "move:w-king:1,1",
          "plays": 48,
          "score": -0.9231,
          "rawScore": -1
        }
      ]
    },
    "white :: 6 :: 1 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:1,4|b-king:2,3|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:0,4|w-bishop:0,1|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,0|w-silver:captured :: live": {
      "total": 53,
      "actions": [
        {
          "key": "move:w-bishop:2,3",
          "plays": 53,
          "score": 0.9298,
          "rawScore": 1
        }
      ]
    },
    "white :: 10 :: 0 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:0,4|b-king:3,2|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:captured|w-gold:4,0|w-king:2,0|w-pawn-1:1,2|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 51,
      "actions": [
        {
          "key": "move:w-pawn-2:3,2",
          "plays": 51,
          "score": 0.9273,
          "rawScore": 1
        }
      ]
    },
    "black :: 9 :: 2 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:0,4|b-king:3,3|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:3,2|w-gold:4,0|w-king:2,0|w-pawn-1:1,2|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 50,
      "actions": [
        {
          "key": "move:b-king:3,2",
          "plays": 50,
          "score": -0.9259,
          "rawScore": -1
        }
      ]
    },
    "black :: 9 :: 0 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:0,3|b-king:2,4|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:captured|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,2|w-rook:captured|w-silver:captured :: live": {
      "total": 49,
      "actions": [
        {
          "key": "move:b-bishop:1,2",
          "plays": 8,
          "score": 0.6667,
          "rawScore": 1
        },
        {
          "key": "move:b-king:2,3",
          "plays": 3,
          "score": -0.4286,
          "rawScore": -1
        },
        {
          "key": "move:b-bishop:0,1",
          "plays": 4,
          "score": -0.5,
          "rawScore": -1
        },
        {
          "key": "move:b-king:3,3",
          "plays": 33,
          "score": -0.8919,
          "rawScore": -1
        }
      ]
    },
    "white :: 12 :: 1 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,3|b-pawn-1:1,2|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:captured|w-gold:4,0|w-king:2,0|w-pawn-1:captured|w-pawn-2:3,2|w-rook:captured|w-silver:captured :: live": {
      "total": 49,
      "actions": [
        {
          "key": "move:w-king:2,1",
          "plays": 9,
          "score": 0.5385,
          "rawScore": 0.7778
        },
        {
          "key": "move:w-gold:3,1",
          "plays": 4,
          "score": 0.5,
          "rawScore": 1
        },
        {
          "key": "move:w-king:3,1",
          "plays": 2,
          "score": 0.3333,
          "rawScore": 1
        },
        {
          "key": "move:w-king:1,1",
          "plays": 33,
          "score": -0.8919,
          "rawScore": -1
        }
      ]
    },
    "black :: 11 :: 1 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,4|b-pawn-1:1,2|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:3,2|w-gold:4,0|w-king:1,1|w-pawn-1:captured|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 48,
      "actions": [
        {
          "key": "move:b-pawn-1:1,1",
          "plays": 48,
          "score": 0.9231,
          "rawScore": 1
        }
      ]
    },
    "white :: 6 :: 1 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:1,4|b-king:2,3|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:0,4|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,1|w-silver:captured :: live": {
      "total": 48,
      "actions": [
        {
          "key": "move:w-rook:0,4",
          "plays": 48,
          "score": 0.4615,
          "rawScore": 0.5
        }
      ]
    },
    "black :: 7 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:1,4|b-king:2,3|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,4|w-silver:captured :: live": {
      "total": 48,
      "actions": [
        {
          "key": "move:b-gold:0,4",
          "plays": 48,
          "score": -0.4615,
          "rawScore": -0.5
        }
      ]
    },
    "white :: 8 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,3|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 48,
      "actions": [
        {
          "key": "move:w-bishop:2,1",
          "plays": 31,
          "score": 0.7714,
          "rawScore": 0.871
        },
        {
          "key": "move:w-bishop:3,2",
          "plays": 8,
          "score": 0.1667,
          "rawScore": 0.25
        },
        {
          "key": "move:w-pawn-1:1,2",
          "plays": 9,
          "score": -0.3846,
          "rawScore": -0.5556
        }
      ]
    },
    "white :: 10 :: 1 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:0,3|b-king:3,3|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:captured|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,2|w-rook:captured|w-silver:captured :: live": {
      "total": 33,
      "actions": [
        {
          "key": "move:w-pawn-2:3,3",
          "plays": 33,
          "score": 0.8919,
          "rawScore": 1
        }
      ]
    },
    "black :: 11 :: 1 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,4|b-pawn-1:1,2|b-pawn-2:3,2|b-rook:captured|b-silver:captured|w-bishop:captured|w-gold:4,0|w-king:1,1|w-pawn-1:captured|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 32,
      "actions": [
        {
          "key": "move:b-pawn-1:1,1",
          "plays": 32,
          "score": 0.8889,
          "rawScore": 1
        }
      ]
    },
    "black :: 5 :: 0 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:1,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:0,4|w-bishop:3,2|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,0|w-silver:captured :: live": {
      "total": 32,
      "actions": [
        {
          "key": "move:b-bishop:1,2",
          "plays": 6,
          "score": 0.4,
          "rawScore": 0.6667
        },
        {
          "key": "move:b-bishop:0,1",
          "plays": 2,
          "score": -0.3333,
          "rawScore": -1
        },
        {
          "key": "move:b-king:3,3",
          "plays": 23,
          "score": -0.7778,
          "rawScore": -0.913
        }
      ]
    },
    "black :: 9 :: 1 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,3|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:2,1|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 31,
      "actions": [
        {
          "key": "move:b-gold:0,3",
          "plays": 3,
          "score": -0.4286,
          "rawScore": -1
        },
        {
          "key": "move:b-pawn-2:3,2",
          "plays": 9,
          "score": -0.5385,
          "rawScore": -0.7778
        },
        {
          "key": "move:b-pawn-1:1,2",
          "plays": 19,
          "score": -0.7391,
          "rawScore": -0.8947
        }
      ]
    },
    "white :: 8 :: 1 :: 3/3 :: 1.000000:b-bishop:2,3|b-gold:0,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:3,2|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 30,
      "actions": [
        {
          "key": "move:w-bishop:2,3",
          "plays": 30,
          "score": -0.2353,
          "rawScore": -0.2667
        }
      ]
    },
    "black :: 9 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:2,3|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 30,
      "actions": [
        {
          "key": "move:b-king:2,3",
          "plays": 30,
          "score": 0.2353,
          "rawScore": 0.2667
        }
      ]
    },
    "white :: 10 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,3|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:captured|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 30,
      "actions": [
        {
          "key": "move:w-king:2,1",
          "plays": 18,
          "score": 0.0909,
          "rawScore": 0.1111
        },
        {
          "key": "move:w-pawn-2:3,2",
          "plays": 5,
          "score": -0.3333,
          "rawScore": -0.6
        },
        {
          "key": "move:w-king:1,0",
          "plays": 2,
          "score": -0.3333,
          "rawScore": -1
        },
        {
          "key": "move:w-gold:4,1",
          "plays": 2,
          "score": -0.3333,
          "rawScore": -1
        },
        {
          "key": "move:w-pawn-1:1,2",
          "plays": 3,
          "score": -0.4286,
          "rawScore": -1
        }
      ]
    },
    "white :: 2 :: 1 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:1,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:4,2|b-silver:0,4|w-bishop:1,0|w-gold:3,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,0|w-silver:4,0 :: live": {
      "total": 28,
      "actions": [
        {
          "key": "move:w-rook:0,4",
          "plays": 24,
          "score": -0.1429,
          "rawScore": -0.1667
        },
        {
          "key": "move:w-bishop:3,2",
          "plays": 4,
          "score": -0.25,
          "rawScore": -0.5
        }
      ]
    },
    "black :: 9 :: 1 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,4|b-pawn-1:1,2|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:1,0|w-gold:4,1|w-king:2,0|w-pawn-1:captured|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 26,
      "actions": [
        {
          "key": "move:b-king:2,3",
          "plays": 13,
          "score": 0.6471,
          "rawScore": 0.8462
        },
        {
          "key": "move:b-pawn-2:3,2",
          "plays": 11,
          "score": -0.6,
          "rawScore": -0.8182
        }
      ]
    },
    "black :: 9 :: 2 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:0,4|b-king:3,3|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:2,3|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 24,
      "actions": [
        {
          "key": "move:b-bishop:2,3",
          "plays": 24,
          "score": 0.7143,
          "rawScore": 0.8333
        }
      ]
    },
    "white :: 10 :: 0 :: 3/3 :: 1.000000:b-bishop:2,3|b-gold:0,4|b-king:3,3|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:captured|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 24,
      "actions": [
        {
          "key": "move:w-gold:4,1",
          "plays": 2,
          "score": 0,
          "rawScore": 0
        },
        {
          "key": "move:w-king:2,1",
          "plays": 4,
          "score": -0.5,
          "rawScore": -1
        },
        {
          "key": "move:w-pawn-2:3,2",
          "plays": 18,
          "score": -0.7273,
          "rawScore": -0.8889
        }
      ]
    },
    "black :: 3 :: 0 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:1,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:4,2|b-silver:captured|w-bishop:1,0|w-gold:3,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,4|w-silver:4,0 :: live": {
      "total": 24,
      "actions": [
        {
          "key": "move:b-gold:0,4",
          "plays": 24,
          "score": 0.1429,
          "rawScore": 0.1667
        }
      ]
    },
    "white :: 4 :: 0 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:0,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:4,2|b-silver:captured|w-bishop:1,0|w-gold:3,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:4,0 :: live": {
      "total": 24,
      "actions": [
        {
          "key": "move:w-bishop:3,2",
          "plays": 14,
          "score": 0,
          "rawScore": 0
        },
        {
          "key": "move:w-pawn-2:3,2",
          "plays": 2,
          "score": 0,
          "rawScore": 0
        },
        {
          "key": "quantum:w-bishop:3,2|4,3",
          "plays": 7,
          "score": -0.2727,
          "rawScore": -0.4286
        }
      ]
    },
    "white :: 6 :: 1 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:1,4|b-king:3,3|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:0,4|w-bishop:3,2|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,0|w-silver:captured :: live": {
      "total": 23,
      "actions": [
        {
          "key": "move:w-rook:0,4",
          "plays": 11,
          "score": 0.7333,
          "rawScore": 1
        },
        {
          "key": "move:w-bishop:1,4",
          "plays": 12,
          "score": 0.625,
          "rawScore": 0.8333
        }
      ]
    },
    "white :: 6 :: 1 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:1,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,2|b-rook:captured|b-silver:0,4|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:1,2|w-pawn-2:3,1|w-rook:0,0|w-silver:captured :: live": {
      "total": 23,
      "actions": [
        {
          "key": "move:w-rook:0,4",
          "plays": 20,
          "score": 0,
          "rawScore": 0
        },
        {
          "key": "move:w-bishop:3,2",
          "plays": 3,
          "score": -0.4286,
          "rawScore": -1
        }
      ]
    },
    "white :: 6 :: 1 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:1,4|b-king:2,4|b-pawn-1:1,2|b-pawn-2:3,3|b-rook:captured|b-silver:0,4|w-bishop:0,1|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,0|w-silver:captured :: live": {
      "total": 21,
      "actions": [
        {
          "key": "move:w-bishop:1,2",
          "plays": 21,
          "score": 0.76,
          "rawScore": 0.9048
        }
      ]
    },
    "black :: 7 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:1,4|b-king:2,4|b-pawn-1:captured|b-pawn-2:3,3|b-rook:captured|b-silver:0,4|w-bishop:1,2|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,0|w-silver:captured :: live": {
      "total": 21,
      "actions": [
        {
          "key": "move:b-gold:2,3",
          "plays": 5,
          "score": -0.3333,
          "rawScore": -0.6
        },
        {
          "key": "move:b-king:3,4",
          "plays": 2,
          "score": -0.3333,
          "rawScore": -1
        },
        {
          "key": "move:b-king:2,3",
          "plays": 14,
          "score": -0.7778,
          "rawScore": -1
        }
      ]
    },
    "black :: 9 :: 1 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,4|b-pawn-1:1,2|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:4,3|w-gold:4,0|w-king:2,0|w-pawn-1:captured|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 20,
      "actions": [
        {
          "key": "move:b-king:2,3",
          "plays": 9,
          "score": 0.5385,
          "rawScore": 0.7778
        },
        {
          "key": "move:b-pawn-2:3,2",
          "plays": 8,
          "score": 0.5,
          "rawScore": 0.75
        },
        {
          "key": "move:b-king:1,3",
          "plays": 2,
          "score": 0.3333,
          "rawScore": 1
        }
      ]
    },
    "black :: 7 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:1,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,2|b-rook:captured|b-silver:captured|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:1,2|w-pawn-2:3,1|w-rook:0,4|w-silver:captured :: live": {
      "total": 20,
      "actions": [
        {
          "key": "move:b-gold:0,4",
          "plays": 20,
          "score": 0,
          "rawScore": 0
        }
      ]
    },
    "white :: 8 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,2|b-rook:captured|b-silver:captured|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:1,2|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 20,
      "actions": [
        {
          "key": "move:w-pawn-2:3,2",
          "plays": 2,
          "score": 0.3333,
          "rawScore": 1
        },
        {
          "key": "move:w-bishop:3,2",
          "plays": 17,
          "score": -0.1429,
          "rawScore": -0.1765
        }
      ]
    },
    "white :: 6 :: 1 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:1,4|b-king:2,4|b-pawn-1:1,2|b-pawn-2:3,3|b-rook:captured|b-silver:0,4|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,1|w-silver:captured :: live": {
      "total": 20,
      "actions": [
        {
          "key": "move:w-rook:0,4",
          "plays": 20,
          "score": 0.5833,
          "rawScore": 0.7
        }
      ]
    },
    "black :: 7 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:1,4|b-king:2,4|b-pawn-1:1,2|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,4|w-silver:captured :: live": {
      "total": 20,
      "actions": [
        {
          "key": "move:b-gold:0,4",
          "plays": 20,
          "score": -0.5833,
          "rawScore": -0.7
        }
      ]
    },
    "white :: 8 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,4|b-pawn-1:1,2|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 20,
      "actions": [
        {
          "key": "move:w-pawn-1:1,2",
          "plays": 17,
          "score": 0.5238,
          "rawScore": 0.6471
        },
        {
          "key": "move:w-bishop:3,2",
          "plays": 2,
          "score": 0.3333,
          "rawScore": 1
        }
      ]
    },
    "white :: 10 :: 2 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,3|b-pawn-1:1,2|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:2,1|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 19,
      "actions": [
        {
          "key": "move:w-pawn-1:1,2",
          "plays": 10,
          "score": 0.7143,
          "rawScore": 1
        },
        {
          "key": "move:w-bishop:1,2",
          "plays": 8,
          "score": 0.6667,
          "rawScore": 1
        }
      ]
    },
    "black :: 11 :: 1 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,3|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:captured|w-gold:4,0|w-king:2,1|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 18,
      "actions": [
        {
          "key": "move:b-pawn-1:1,2",
          "plays": 9,
          "score": 0.0769,
          "rawScore": 0.1111
        },
        {
          "key": "move:b-gold:0,3",
          "plays": 3,
          "score": -0.1429,
          "rawScore": -0.3333
        },
        {
          "key": "move:b-king:3,3",
          "plays": 6,
          "score": -0.2,
          "rawScore": -0.3333
        }
      ]
    },
    "black :: 11 :: 1 :: 3/3 :: 1.000000:b-bishop:2,3|b-gold:0,4|b-king:3,3|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:captured|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,2|w-rook:captured|w-silver:captured :: live": {
      "total": 18,
      "actions": [
        {
          "key": "move:b-bishop:3,2",
          "plays": 13,
          "score": 0.7647,
          "rawScore": 1
        },
        {
          "key": "move:b-king:3,2",
          "plays": 4,
          "score": 0.5,
          "rawScore": 1
        }
      ]
    },
    "white :: 12 :: 1 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:1,3|b-king:2,4|b-pawn-1:1,2|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:captured|w-gold:4,0|w-king:2,0|w-pawn-1:captured|w-pawn-2:3,2|w-rook:captured|w-silver:captured :: live": {
      "total": 18,
      "actions": [
        {
          "key": "move:w-king:2,1",
          "plays": 6,
          "score": 0.6,
          "rawScore": 1
        },
        {
          "key": "move:w-king:1,1",
          "plays": 11,
          "score": -0.7333,
          "rawScore": -1
        }
      ]
    },
    "white :: 6 :: 1 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:1,4|b-king:2,3|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:0,4|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:1,2|w-pawn-2:3,1|w-rook:0,0|w-silver:captured :: live": {
      "total": 18,
      "actions": [
        {
          "key": "move:w-rook:0,4",
          "plays": 18,
          "score": 0.0909,
          "rawScore": 0.1111
        }
      ]
    },
    "black :: 7 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:1,4|b-king:2,3|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:1,2|w-pawn-2:3,1|w-rook:0,4|w-silver:captured :: live": {
      "total": 18,
      "actions": [
        {
          "key": "move:b-gold:0,4",
          "plays": 18,
          "score": -0.0909,
          "rawScore": -0.1111
        }
      ]
    },
    "white :: 8 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,3|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:1,2|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 18,
      "actions": [
        {
          "key": "move:w-pawn-1:1,3",
          "plays": 8,
          "score": 0.5,
          "rawScore": 0.75
        },
        {
          "key": "move:w-king:1,1",
          "plays": 8,
          "score": -0.1667,
          "rawScore": -0.25
        }
      ]
    },
    "black :: 9 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,4|b-pawn-1:captured|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:1,2|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 17,
      "actions": [
        {
          "key": "move:b-king:1,3",
          "plays": 2,
          "score": -0.3333,
          "rawScore": -1
        },
        {
          "key": "move:b-king:2,3",
          "plays": 9,
          "score": -0.3846,
          "rawScore": -0.5556
        },
        {
          "key": "move:b-pawn-2:3,2",
          "plays": 5,
          "score": -0.5556,
          "rawScore": -1
        }
      ]
    },
    "black :: 7 :: 1 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:0,3|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:1,2|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 16,
      "actions": [
        {
          "key": "move:b-bishop:1,2",
          "plays": 10,
          "score": 0.2857,
          "rawScore": 0.4
        },
        {
          "key": "move:b-gold:1,2",
          "plays": 5,
          "score": 0.1111,
          "rawScore": 0.2
        }
      ]
    },
    "white :: 6 :: 1 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:1,4|b-king:3,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:0,4|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,1|w-silver:captured :: live": {
      "total": 15,
      "actions": [
        {
          "key": "move:w-rook:0,4",
          "plays": 15,
          "score": 0.6842,
          "rawScore": 0.8667
        }
      ]
    },
    "black :: 7 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:1,4|b-king:3,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,4|w-silver:captured :: live": {
      "total": 15,
      "actions": [
        {
          "key": "move:b-gold:0,4",
          "plays": 15,
          "score": -0.6842,
          "rawScore": -0.8667
        }
      ]
    },
    "white :: 8 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:3,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 15,
      "actions": [
        {
          "key": "move:w-bishop:2,1",
          "plays": 6,
          "score": 0.6,
          "rawScore": 1
        },
        {
          "key": "move:w-bishop:3,2",
          "plays": 9,
          "score": 0.5385,
          "rawScore": 0.7778
        }
      ]
    },
    "white :: 12 :: 1 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:1,3|b-pawn-1:1,2|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:captured|w-gold:4,0|w-king:2,0|w-pawn-1:captured|w-pawn-2:3,2|w-rook:captured|w-silver:captured :: live": {
      "total": 14,
      "actions": [
        {
          "key": "move:w-king:2,1",
          "plays": 4,
          "score": 0,
          "rawScore": 0
        },
        {
          "key": "move:w-gold:3,1",
          "plays": 2,
          "score": 0,
          "rawScore": 0
        },
        {
          "key": "move:w-king:1,1",
          "plays": 8,
          "score": -0.6667,
          "rawScore": -1
        }
      ]
    },
    "white :: 8 :: 1 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:1,4|b-king:2,3|b-pawn-1:captured|b-pawn-2:3,3|b-rook:captured|b-silver:0,4|w-bishop:1,2|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,0|w-silver:captured :: live": {
      "total": 14,
      "actions": [
        {
          "key": "move:w-bishop:2,3",
          "plays": 14,
          "score": 0.7778,
          "rawScore": 1
        }
      ]
    },
    "white :: 4 :: 1 :: 3/3 :: 1.000000:b-bishop:2,3|b-gold:1,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:0,4|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,0|w-silver:captured :: live": {
      "total": 14,
      "actions": [
        {
          "key": "move:w-rook:0,4",
          "plays": 14,
          "score": -0.2222,
          "rawScore": -0.2857
        }
      ]
    },
    "black :: 5 :: 0 :: 3/3 :: 1.000000:b-bishop:2,3|b-gold:1,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,4|w-silver:captured :: live": {
      "total": 14,
      "actions": [
        {
          "key": "move:b-gold:0,4",
          "plays": 14,
          "score": 0.2222,
          "rawScore": 0.2857
        }
      ]
    },
    "white :: 6 :: 0 :: 3/3 :: 1.000000:b-bishop:2,3|b-gold:0,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 14,
      "actions": [
        {
          "key": "move:w-bishop:2,1",
          "plays": 3,
          "score": 0.4286,
          "rawScore": 1
        },
        {
          "key": "move:w-pawn-1:1,2",
          "plays": 3,
          "score": 0.1429,
          "rawScore": 0.3333
        },
        {
          "key": "move:w-pawn-2:3,2",
          "plays": 2,
          "score": -0.3333,
          "rawScore": -1
        },
        {
          "key": "move:w-bishop:3,2",
          "plays": 5,
          "score": -0.5556,
          "rawScore": -1
        }
      ]
    },
    "black :: 5 :: 1 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:0,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:4,2|b-silver:captured|w-bishop:3,2|w-gold:3,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:4,0 :: live": {
      "total": 14,
      "actions": [
        {
          "key": "move:b-rook:3,2",
          "plays": 8,
          "score": 0.3333,
          "rawScore": 0.5
        },
        {
          "key": "move:b-pawn-2:3,2",
          "plays": 6,
          "score": -0.4,
          "rawScore": -0.6667
        }
      ]
    },
    "white :: 12 :: 0 :: 3/3 :: 1.000000:b-bishop:3,2|b-gold:0,4|b-king:3,3|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:captured|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:captured|w-rook:captured|w-silver:captured :: live": {
      "total": 13,
      "actions": [
        {
          "key": "move:w-king:2,1",
          "plays": 11,
          "score": -0.7333,
          "rawScore": -1
        }
      ]
    },
    "white :: 10 :: 2 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,3|b-pawn-1:1,2|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:1,0|w-gold:4,1|w-king:2,0|w-pawn-1:captured|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 13,
      "actions": [
        {
          "key": "move:w-king:1,1",
          "plays": 12,
          "score": -0.75,
          "rawScore": -1
        }
      ]
    },
    "white :: 8 :: 1 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:0,4|b-king:2,3|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:3,2|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 12,
      "actions": [
        {
          "key": "move:w-bishop:2,3",
          "plays": 12,
          "score": 0.75,
          "rawScore": 1
        }
      ]
    },
    "black :: 11 :: 3 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,3|b-pawn-1:1,2|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:1,0|w-gold:4,1|w-king:1,1|w-pawn-1:captured|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 12,
      "actions": [
        {
          "key": "move:b-pawn-1:1,1",
          "plays": 12,
          "score": 0.75,
          "rawScore": 1
        }
      ]
    },
    "black :: 7 :: 0 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:captured|b-king:3,3|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:0,4|w-bishop:1,4|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,0|w-silver:captured :: live": {
      "total": 12,
      "actions": [
        {
          "key": "move:b-silver:0,3",
          "plays": 2,
          "score": 0,
          "rawScore": 0
        },
        {
          "key": "move:b-bishop:1,2",
          "plays": 3,
          "score": -0.4286,
          "rawScore": -1
        },
        {
          "key": "move:b-bishop:2,3",
          "plays": 6,
          "score": -0.6,
          "rawScore": -1
        }
      ]
    },
    "white :: 6 :: 1 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:1,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,2|b-rook:captured|b-silver:0,4|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,1|w-silver:captured :: live": {
      "total": 11,
      "actions": [
        {
          "key": "move:w-rook:0,4",
          "plays": 9,
          "score": 0.6923,
          "rawScore": 1
        },
        {
          "key": "move:w-bishop:3,2",
          "plays": 2,
          "score": 0.3333,
          "rawScore": 1
        }
      ]
    },
    "white :: 10 :: 2 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,4|b-pawn-1:1,2|b-pawn-2:3,2|b-rook:captured|b-silver:captured|w-bishop:1,0|w-gold:4,1|w-king:2,0|w-pawn-1:captured|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 11,
      "actions": [
        {
          "key": "move:w-gold:3,2",
          "plays": 3,
          "score": 0.4286,
          "rawScore": 1
        },
        {
          "key": "move:w-bishop:3,2",
          "plays": 6,
          "score": 0.4,
          "rawScore": 0.6667
        },
        {
          "key": "move:w-pawn-2:3,2",
          "plays": 2,
          "score": 0.3333,
          "rawScore": 1
        }
      ]
    },
    "black :: 7 :: 0 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:1,4|b-king:3,3|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:3,2|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,4|w-silver:captured :: live": {
      "total": 11,
      "actions": [
        {
          "key": "move:b-king:3,2",
          "plays": 10,
          "score": -0.7143,
          "rawScore": -1
        }
      ]
    },
    "black :: 7 :: 0 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:0,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,2|w-rook:captured|w-silver:captured :: live": {
      "total": 11,
      "actions": [
        {
          "key": "move:b-bishop:1,2",
          "plays": 6,
          "score": 0,
          "rawScore": 0
        },
        {
          "key": "move:b-king:3,3",
          "plays": 5,
          "score": -0.5556,
          "rawScore": -1
        }
      ]
    },
    "white :: 10 :: 1 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,3|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:3,2|w-gold:4,0|w-king:2,0|w-pawn-1:1,2|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 10,
      "actions": [
        {
          "key": "move:w-bishop:2,3",
          "plays": 10,
          "score": 0.7143,
          "rawScore": 1
        }
      ]
    },
    "white :: 12 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:3,2|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:captured|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:captured|w-rook:captured|w-silver:captured :: live": {
      "total": 10,
      "actions": [
        {
          "key": "move:w-gold:3,1",
          "plays": 3,
          "score": 0.4286,
          "rawScore": 1
        },
        {
          "key": "move:w-king:3,1",
          "plays": 3,
          "score": -0.4286,
          "rawScore": -1
        },
        {
          "key": "move:w-king:2,1",
          "plays": 4,
          "score": -0.5,
          "rawScore": -1
        }
      ]
    },
    "white :: 8 :: 0 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:1,4|b-king:3,2|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:captured|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,4|w-silver:captured :: live": {
      "total": 10,
      "actions": [
        {
          "key": "move:w-pawn-2:3,2",
          "plays": 10,
          "score": 0.7143,
          "rawScore": 1
        }
      ]
    },
    "white :: 6 :: 1 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:2,3|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:0,4|w-bishop:0,1|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,0|w-silver:captured :: live": {
      "total": 10,
      "actions": [
        {
          "key": "move:w-bishop:2,3",
          "plays": 10,
          "score": 0.7143,
          "rawScore": 1
        }
      ]
    },
    "black :: 7 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:captured|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:0,4|w-bishop:2,3|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,0|w-silver:captured :: live": {
      "total": 10,
      "actions": [
        {
          "key": "move:b-king:2,3",
          "plays": 10,
          "score": -0.7143,
          "rawScore": -1
        }
      ]
    },
    "white :: 8 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:captured|b-king:2,3|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:0,4|w-bishop:captured|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,0|w-silver:captured :: live": {
      "total": 10,
      "actions": [
        {
          "key": "move:w-rook:0,4",
          "plays": 10,
          "score": 0.7143,
          "rawScore": 1
        }
      ]
    },
    "black :: 9 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:captured|b-king:2,3|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:captured|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,4|w-silver:captured :: live": {
      "total": 10,
      "actions": [
        {
          "key": "move:b-king:2,4",
          "plays": 3,
          "score": -0.4286,
          "rawScore": -1
        },
        {
          "key": "move:b-king:1,4",
          "plays": 6,
          "score": -0.6,
          "rawScore": -1
        }
      ]
    },
    "black :: 11 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,3|b-pawn-1:captured|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:2,1|w-gold:4,0|w-king:2,0|w-pawn-1:1,2|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 10,
      "actions": [
        {
          "key": "move:b-king:1,2",
          "plays": 9,
          "score": -0.6923,
          "rawScore": -1
        }
      ]
    },
    "white :: 8 :: 0 :: 3/3 :: 1.000000:b-bishop:1,2|b-gold:0,3|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:captured|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 10,
      "actions": [
        {
          "key": "move:w-bishop:3,2",
          "plays": 6,
          "score": 0,
          "rawScore": 0
        },
        {
          "key": "move:w-king:1,1",
          "plays": 3,
          "score": -0.4286,
          "rawScore": -1
        }
      ]
    },
    "white :: 10 :: 1 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:3,3|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:3,2|w-gold:4,0|w-king:2,0|w-pawn-1:1,2|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 10,
      "actions": [
        {
          "key": "move:w-king:1,1",
          "plays": 5,
          "score": 0.5556,
          "rawScore": 1
        },
        {
          "key": "move:w-pawn-1:1,3",
          "plays": 5,
          "score": 0.5556,
          "rawScore": 1
        }
      ]
    },
    "black :: 7 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:1,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,2|b-rook:captured|b-silver:captured|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,4|w-silver:captured :: live": {
      "total": 9,
      "actions": [
        {
          "key": "move:b-gold:0,4",
          "plays": 9,
          "score": -0.6923,
          "rawScore": -1
        }
      ]
    },
    "white :: 8 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,2|b-rook:captured|b-silver:captured|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 9,
      "actions": [
        {
          "key": "move:w-bishop:3,2",
          "plays": 9,
          "score": 0.6923,
          "rawScore": 1
        }
      ]
    },
    "black :: 9 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:3,2|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 9,
      "actions": [
        {
          "key": "move:b-king:2,3",
          "plays": 8,
          "score": -0.6667,
          "rawScore": -1
        }
      ]
    },
    "white :: 10 :: 2 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,3|b-pawn-1:1,2|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:4,3|w-gold:4,0|w-king:2,0|w-pawn-1:captured|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 9,
      "actions": [
        {
          "key": "move:w-king:2,1",
          "plays": 2,
          "score": 0,
          "rawScore": 0
        },
        {
          "key": "move:w-king:1,1",
          "plays": 7,
          "score": -0.6364,
          "rawScore": -1
        }
      ]
    },
    "white :: 10 :: 2 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,3|b-pawn-1:1,3|b-pawn-2:3,2|b-rook:captured|b-silver:captured|w-bishop:2,1|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 9,
      "actions": [
        {
          "key": "move:w-pawn-2:3,2",
          "plays": 7,
          "score": 0.4545,
          "rawScore": 0.7143
        },
        {
          "key": "move:w-bishop:3,2",
          "plays": 2,
          "score": 0.3333,
          "rawScore": 1
        }
      ]
    },
    "black :: 9 :: 1 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:3,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:3,2|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 9,
      "actions": [
        {
          "key": "move:b-pawn-2:3,2",
          "plays": 9,
          "score": -0.5385,
          "rawScore": -0.7778
        }
      ]
    },
    "white :: 10 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:3,4|b-pawn-1:1,3|b-pawn-2:3,2|b-rook:captured|b-silver:captured|w-bishop:captured|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 9,
      "actions": [
        {
          "key": "move:w-pawn-2:3,2",
          "plays": 8,
          "score": 0.6667,
          "rawScore": 1
        }
      ]
    },
    "black :: 9 :: 1 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,3|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:1,2|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 9,
      "actions": [
        {
          "key": "move:b-king:1,2",
          "plays": 6,
          "score": 0.6,
          "rawScore": 1
        },
        {
          "key": "move:b-pawn-1:1,2",
          "plays": 2,
          "score": 0,
          "rawScore": 0
        }
      ]
    },
    "white :: 8 :: 0 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:0,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,2|b-rook:captured|b-silver:captured|w-bishop:captured|w-gold:3,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:captured|w-rook:captured|w-silver:4,0 :: live": {
      "total": 9,
      "actions": [
        {
          "key": "move:w-king:2,1",
          "plays": 6,
          "score": -0.2,
          "rawScore": -0.3333
        },
        {
          "key": "move:w-pawn-1:1,2",
          "plays": 3,
          "score": -0.4286,
          "rawScore": -1
        }
      ]
    },
    "black :: 7 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:1,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:0,4|w-bishop:3,2|w-gold:4,0|w-king:2,0|w-pawn-1:1,2|w-pawn-2:3,1|w-rook:0,0|w-silver:captured :: live": {
      "total": 9,
      "actions": [
        {
          "key": "move:b-pawn-1:1,2",
          "plays": 8,
          "score": 0.6667,
          "rawScore": 1
        }
      ]
    },
    "white :: 12 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:1,2|b-pawn-1:captured|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:2,1|w-gold:4,0|w-king:2,0|w-pawn-1:captured|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 9,
      "actions": [
        {
          "key": "move:w-bishop:1,2",
          "plays": 9,
          "score": 0.6923,
          "rawScore": 1
        }
      ]
    },
    "black :: 9 :: 2 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:0,4|b-king:3,3|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:3,2|w-gold:3,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 9,
      "actions": [
        {
          "key": "move:b-king:3,2",
          "plays": 9,
          "score": -0.6923,
          "rawScore": -1
        }
      ]
    },
    "white :: 10 :: 0 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:0,4|b-king:3,2|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:captured|w-gold:3,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 9,
      "actions": [
        {
          "key": "move:w-pawn-2:3,2",
          "plays": 9,
          "score": 0.6923,
          "rawScore": 1
        }
      ]
    },
    "white :: 12 :: 2 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,3|b-pawn-1:1,2|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:captured|w-gold:4,0|w-king:2,1|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 9,
      "actions": [
        {
          "key": "move:w-pawn-1:1,2",
          "plays": 4,
          "score": 0.5,
          "rawScore": 1
        },
        {
          "key": "move:w-king:1,2",
          "plays": 5,
          "score": -0.5556,
          "rawScore": -1
        }
      ]
    },
    "white :: 10 :: 1 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,3|b-pawn-1:captured|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:1,2|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 9,
      "actions": [
        {
          "key": "move:w-king:1,1",
          "plays": 6,
          "score": 0.6,
          "rawScore": 1
        }
      ]
    },
    "white :: 10 :: 1 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,3|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:3,2|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 8,
      "actions": [
        {
          "key": "move:w-bishop:2,3",
          "plays": 8,
          "score": 0.6667,
          "rawScore": 1
        }
      ]
    },
    "black :: 9 :: 1 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,3|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:3,2|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 8,
      "actions": [
        {
          "key": "move:b-pawn-2:3,2",
          "plays": 5,
          "score": 0.1111,
          "rawScore": 0.2
        },
        {
          "key": "move:b-king:3,2",
          "plays": 3,
          "score": -0.4286,
          "rawScore": -1
        }
      ]
    },
    "black :: 11 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:3,4|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:captured|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,2|w-rook:captured|w-silver:captured :: live": {
      "total": 8,
      "actions": [
        {
          "key": "move:b-gold:1,4",
          "plays": 2,
          "score": -0.3333,
          "rawScore": -1
        },
        {
          "key": "move:b-king:3,3",
          "plays": 5,
          "score": -0.5556,
          "rawScore": -1
        }
      ]
    },
    "white :: 6 :: 0 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:0,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:3,2|b-silver:captured|w-bishop:captured|w-gold:3,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:4,0 :: live": {
      "total": 8,
      "actions": [
        {
          "key": "move:w-pawn-2:3,2",
          "plays": 8,
          "score": -0.3333,
          "rawScore": -0.5
        }
      ]
    },
    "black :: 7 :: 0 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:0,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:captured|w-gold:3,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,2|w-rook:captured|w-silver:4,0 :: live": {
      "total": 8,
      "actions": [
        {
          "key": "move:b-pawn-2:3,2",
          "plays": 8,
          "score": 0.3333,
          "rawScore": 0.5
        }
      ]
    },
    "black :: 9 :: 0 :: 3/3 :: 1.000000:b-bishop:2,3|b-gold:captured|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:0,3|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 8,
      "actions": [
        {
          "key": "move:b-bishop:3,2",
          "plays": 2,
          "score": 0,
          "rawScore": 0
        },
        {
          "key": "move:b-bishop:1,2",
          "plays": 6,
          "score": -0.6,
          "rawScore": -1
        }
      ]
    },
    "black :: 9 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,3|b-pawn-1:captured|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:1,3|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 8,
      "actions": [
        {
          "key": "move:b-king:1,3",
          "plays": 2,
          "score": 0,
          "rawScore": 0
        },
        {
          "key": "move:b-gold:1,3",
          "plays": 6,
          "score": -0.6,
          "rawScore": -1
        }
      ]
    },
    "white :: 8 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:1,4|b-king:2,4|b-pawn-1:1,2|b-pawn-2:captured|b-rook:captured|b-silver:0,4|w-bishop:3,2|w-gold:4,0|w-king:2,0|w-pawn-1:captured|w-pawn-2:3,1|w-rook:0,0|w-silver:captured :: live": {
      "total": 8,
      "actions": [
        {
          "key": "move:w-rook:0,4",
          "plays": 2,
          "score": -0.3333,
          "rawScore": -1
        },
        {
          "key": "move:w-bishop:1,4",
          "plays": 6,
          "score": -0.6,
          "rawScore": -1
        }
      ]
    },
    "black :: 11 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,3|b-pawn-1:captured|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:1,2|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 8,
      "actions": [
        {
          "key": "move:b-king:1,2",
          "plays": 8,
          "score": -0.6667,
          "rawScore": -1
        }
      ]
    },
    "white :: 12 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:1,2|b-pawn-1:captured|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:captured|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 8,
      "actions": [
        {
          "key": "move:w-pawn-1:1,2",
          "plays": 8,
          "score": 0.6667,
          "rawScore": 1
        }
      ]
    },
    "white :: 10 :: 1 :: 3/3 :: 1.000000:b-bishop:1,2|b-gold:0,3|b-king:2,4|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:captured|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,2|w-rook:captured|w-silver:captured :: live": {
      "total": 8,
      "actions": [
        {
          "key": "move:w-pawn-1:1,2",
          "plays": 8,
          "score": -0.6667,
          "rawScore": -1
        }
      ]
    },
    "black :: 11 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,3|b-king:2,4|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:captured|w-gold:4,0|w-king:2,0|w-pawn-1:1,2|w-pawn-2:3,2|w-rook:captured|w-silver:captured :: live": {
      "total": 8,
      "actions": [
        {
          "key": "move:b-gold:1,2",
          "plays": 5,
          "score": 0.5556,
          "rawScore": 1
        },
        {
          "key": "move:b-pawn-1:1,2",
          "plays": 3,
          "score": 0.4286,
          "rawScore": 1
        }
      ]
    },
    "black :: 9 :: 1 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,3|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:1,0|w-gold:4,0|w-king:1,1|w-pawn-1:1,2|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 8,
      "actions": [
        {
          "key": "move:b-pawn-1:1,2",
          "plays": 5,
          "score": 0.5556,
          "rawScore": 1
        },
        {
          "key": "move:b-king:1,2",
          "plays": 3,
          "score": -0.4286,
          "rawScore": -1
        }
      ]
    },
    "black :: 9 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:1,2|w-pawn-2:3,2|w-rook:captured|w-silver:captured :: live": {
      "total": 8,
      "actions": [
        {
          "key": "move:b-pawn-1:1,2",
          "plays": 6,
          "score": 0,
          "rawScore": 0
        },
        {
          "key": "move:b-king:3,3",
          "plays": 2,
          "score": -0.3333,
          "rawScore": -1
        }
      ]
    },
    "white :: 10 :: 2 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,4|b-pawn-1:1,2|b-pawn-2:3,2|b-rook:captured|b-silver:captured|w-bishop:4,3|w-gold:4,0|w-king:2,0|w-pawn-1:captured|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 8,
      "actions": [
        {
          "key": "move:w-bishop:3,2",
          "plays": 7,
          "score": -0.4545,
          "rawScore": -0.7143
        }
      ]
    },
    "black :: 11 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,4|b-pawn-1:captured|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:3,2|w-gold:4,0|w-king:2,0|w-pawn-1:1,2|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 7,
      "actions": [
        {
          "key": "move:b-king:3,3",
          "plays": 3,
          "score": -0.4286,
          "rawScore": -1
        },
        {
          "key": "move:b-king:2,3",
          "plays": 4,
          "score": -0.5,
          "rawScore": -1
        }
      ]
    },
    "black :: 11 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,3|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:2,1|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,2|w-rook:captured|w-silver:captured :: live": {
      "total": 7,
      "actions": [
        {
          "key": "move:b-king:3,2",
          "plays": 5,
          "score": -0.5556,
          "rawScore": -1
        }
      ]
    },
    "black :: 11 :: 3 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,3|b-pawn-1:1,2|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:4,3|w-gold:4,0|w-king:1,1|w-pawn-1:captured|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 7,
      "actions": [
        {
          "key": "move:b-pawn-1:1,1",
          "plays": 7,
          "score": 0.6364,
          "rawScore": 1
        }
      ]
    },
    "black :: 7 :: 1 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:0,3|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:2,1|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 7,
      "actions": [
        {
          "key": "move:b-bishop:2,3",
          "plays": 5,
          "score": -0.3333,
          "rawScore": -0.6
        }
      ]
    },
    "white :: 8 :: 2 :: 3/3 :: 1.000000:b-bishop:2,3|b-gold:0,3|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:2,1|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 7,
      "actions": [
        {
          "key": "move:w-bishop:0,3",
          "plays": 7,
          "score": 0.4545,
          "rawScore": 0.7143
        }
      ]
    },
    "white :: 6 :: 1 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:1,4|b-king:3,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:0,4|w-bishop:0,1|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,0|w-silver:captured :: live": {
      "total": 7,
      "actions": [
        {
          "key": "move:w-bishop:3,4",
          "plays": 7,
          "score": 0.6364,
          "rawScore": 1
        }
      ]
    },
    "white :: 6 :: 0 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:0,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,2|b-rook:4,2|b-silver:captured|w-bishop:captured|w-gold:3,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:4,0 :: live": {
      "total": 7,
      "actions": [
        {
          "key": "move:w-pawn-2:3,2",
          "plays": 5,
          "score": 0.5556,
          "rawScore": 1
        }
      ]
    },
    "black :: 5 :: 1 :: 3/2 :: 0.500000:b-bishop:3,4|b-gold:0,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:4,2|b-silver:captured|w-bishop:3,2|w-gold:3,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:4,0 || 0.500000:b-bishop:3,4|b-gold:0,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:4,2|b-silver:captured|w-bishop:4,3|w-gold:3,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:4,0 :: live": {
      "total": 7,
      "actions": [
        {
          "key": "move:b-rook:4,0",
          "plays": 7,
          "score": 0.2727,
          "rawScore": 0.4286
        }
      ]
    },
    "white :: 6 :: 0 :: 3/2 :: 0.500000:b-bishop:3,4|b-gold:0,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:4,0|b-silver:captured|w-bishop:3,2|w-gold:3,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:captured || 0.500000:b-bishop:3,4|b-gold:0,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:4,0|b-silver:captured|w-bishop:4,3|w-gold:3,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 7,
      "actions": [
        {
          "key": "move:w-gold:4,0",
          "plays": 7,
          "score": -0.2727,
          "rawScore": -0.4286
        }
      ]
    },
    "black :: 7 :: 0 :: 3/2 :: 0.500000:b-bishop:3,4|b-gold:0,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:3,2|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:captured || 0.500000:b-bishop:3,4|b-gold:0,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:4,3|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 7,
      "actions": [
        {
          "key": "move:b-bishop:1,2",
          "plays": 6,
          "score": 0.2,
          "rawScore": 0.3333
        }
      ]
    },
    "white :: 10 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,4|b-pawn-1:1,2|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:captured|w-pawn-2:3,2|w-rook:captured|w-silver:captured :: live": {
      "total": 7,
      "actions": [
        {
          "key": "move:w-pawn-2:3,3",
          "plays": 4,
          "score": 0,
          "rawScore": 0
        },
        {
          "key": "move:w-king:1,1",
          "plays": 2,
          "score": -0.3333,
          "rawScore": -1
        }
      ]
    },
    "black :: 11 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,4|b-pawn-1:1,2|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:3,2|w-gold:4,0|w-king:2,0|w-pawn-1:captured|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 7,
      "actions": [
        {
          "key": "move:b-king:3,3",
          "plays": 4,
          "score": 0.5,
          "rawScore": 1
        },
        {
          "key": "move:b-gold:1,3",
          "plays": 2,
          "score": 0.3333,
          "rawScore": 1
        }
      ]
    },
    "white :: 6 :: 1 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:1,4|b-king:3,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:0,4|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:1,2|w-pawn-2:3,1|w-rook:0,0|w-silver:captured :: live": {
      "total": 7,
      "actions": [
        {
          "key": "move:w-rook:0,4",
          "plays": 7,
          "score": 0.0909,
          "rawScore": 0.1429
        }
      ]
    },
    "black :: 7 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:1,4|b-king:3,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:1,2|w-pawn-2:3,1|w-rook:0,4|w-silver:captured :: live": {
      "total": 7,
      "actions": [
        {
          "key": "move:b-gold:0,4",
          "plays": 7,
          "score": -0.0909,
          "rawScore": -0.1429
        }
      ]
    },
    "white :: 8 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:3,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:1,2|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 7,
      "actions": [
        {
          "key": "move:w-king:1,1",
          "plays": 2,
          "score": 0.3333,
          "rawScore": 1
        },
        {
          "key": "move:w-pawn-1:1,3",
          "plays": 2,
          "score": 0,
          "rawScore": 0
        },
        {
          "key": "move:w-bishop:3,2",
          "plays": 3,
          "score": -0.1429,
          "rawScore": -0.3333
        }
      ]
    },
    "black :: 9 :: 1 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:3,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:2,1|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 6,
      "actions": [
        {
          "key": "move:b-pawn-2:3,2",
          "plays": 2,
          "score": -0.3333,
          "rawScore": -1
        },
        {
          "key": "move:b-pawn-1:1,2",
          "plays": 2,
          "score": -0.3333,
          "rawScore": -1
        }
      ]
    },
    "white :: 10 :: 1 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:captured|b-king:1,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:captured|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,4|w-silver:captured :: live": {
      "total": 6,
      "actions": [
        {
          "key": "move:w-rook:1,4",
          "plays": 6,
          "score": 0.6,
          "rawScore": 1
        }
      ]
    },
    "white :: 8 :: 1 :: 3/3 :: 1.000000:b-bishop:2,3|b-gold:captured|b-king:3,3|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:0,4|w-bishop:1,4|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,0|w-silver:captured :: live": {
      "total": 6,
      "actions": [
        {
          "key": "move:w-bishop:2,3",
          "plays": 6,
          "score": 0.6,
          "rawScore": 1
        }
      ]
    },
    "black :: 9 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:captured|b-king:3,3|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:0,4|w-bishop:2,3|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,0|w-silver:captured :: live": {
      "total": 6,
      "actions": [
        {
          "key": "move:b-king:2,3",
          "plays": 6,
          "score": -0.6,
          "rawScore": -1
        }
      ]
    },
    "white :: 10 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:captured|b-king:2,3|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:0,4|w-bishop:captured|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,0|w-silver:captured :: live": {
      "total": 6,
      "actions": [
        {
          "key": "move:w-rook:0,4",
          "plays": 6,
          "score": 0.6,
          "rawScore": 1
        }
      ]
    },
    "black :: 11 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:captured|b-king:2,3|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:captured|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,4|w-silver:captured :: live": {
      "total": 6,
      "actions": [
        {
          "key": "move:b-king:1,4",
          "plays": 2,
          "score": -0.3333,
          "rawScore": -1
        },
        {
          "key": "move:b-king:3,3",
          "plays": 3,
          "score": -0.4286,
          "rawScore": -1
        }
      ]
    },
    "white :: 10 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:1,2|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:captured|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 6,
      "actions": [
        {
          "key": "move:w-bishop:3,2",
          "plays": 3,
          "score": -0.4286,
          "rawScore": -1
        },
        {
          "key": "move:w-king:1,1",
          "plays": 3,
          "score": -0.4286,
          "rawScore": -1
        }
      ]
    },
    "black :: 9 :: 1 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:0,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,2|b-rook:captured|b-silver:captured|w-bishop:captured|w-gold:3,0|w-king:2,1|w-pawn-1:1,1|w-pawn-2:captured|w-rook:captured|w-silver:4,0 :: live": {
      "total": 6,
      "actions": [
        {
          "key": "move:b-king:3,3",
          "plays": 4,
          "score": 0.5,
          "rawScore": 1
        }
      ]
    },
    "white :: 10 :: 1 :: 3/3 :: 1.000000:b-bishop:1,2|b-gold:captured|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:0,3|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 6,
      "actions": [
        {
          "key": "move:w-bishop:1,2",
          "plays": 6,
          "score": 0.6,
          "rawScore": 1
        }
      ]
    },
    "black :: 11 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:captured|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:1,2|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 6,
      "actions": [
        {
          "key": "move:b-pawn-1:1,2",
          "plays": 6,
          "score": -0.6,
          "rawScore": -1
        }
      ]
    },
    "white :: 12 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:captured|b-king:2,4|b-pawn-1:1,2|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:captured|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 6,
      "actions": [
        {
          "key": "move:w-pawn-1:1,2",
          "plays": 5,
          "score": 0.5556,
          "rawScore": 1
        }
      ]
    },
    "white :: 12 :: 2 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:3,3|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:captured|w-gold:4,0|w-king:2,1|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 6,
      "actions": [
        {
          "key": "move:w-pawn-2:3,2",
          "plays": 4,
          "score": 0.5,
          "rawScore": 1
        }
      ]
    },
    "white :: 10 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:1,3|b-king:2,3|b-pawn-1:captured|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:captured|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 6,
      "actions": [
        {
          "key": "move:w-king:1,1",
          "plays": 6,
          "score": 0.6,
          "rawScore": 1
        }
      ]
    },
    "black :: 11 :: 1 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:1,3|b-king:2,3|b-pawn-1:captured|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:1,0|w-gold:4,0|w-king:1,1|w-pawn-1:captured|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 6,
      "actions": [
        {
          "key": "move:b-king:3,2",
          "plays": 5,
          "score": -0.5556,
          "rawScore": -1
        }
      ]
    },
    "black :: 9 :: 1 :: 3/3 :: 1.000000:b-bishop:1,2|b-gold:0,3|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:3,2|w-gold:4,0|w-king:2,0|w-pawn-1:captured|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 6,
      "actions": [
        {
          "key": "move:b-pawn-2:3,2",
          "plays": 6,
          "score": 0,
          "rawScore": 0
        }
      ]
    },
    "white :: 10 :: 0 :: 3/3 :: 1.000000:b-bishop:1,2|b-gold:0,3|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,2|b-rook:captured|b-silver:captured|w-bishop:captured|w-gold:4,0|w-king:2,0|w-pawn-1:captured|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 6,
      "actions": [
        {
          "key": "move:w-pawn-2:3,2",
          "plays": 5,
          "score": 0.1111,
          "rawScore": 0.2
        }
      ]
    },
    "black :: 11 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,4|b-pawn-1:1,2|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:3,2|w-gold:4,1|w-king:2,0|w-pawn-1:captured|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 6,
      "actions": [
        {
          "key": "move:b-king:2,3",
          "plays": 5,
          "score": -0.5556,
          "rawScore": -1
        }
      ]
    },
    "white :: 8 :: 1 :: 3/2 :: 0.500000:b-bishop:1,2|b-gold:0,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:3,2|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:captured || 0.500000:b-bishop:1,2|b-gold:0,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:4,3|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 6,
      "actions": [
        {
          "key": "move:w-pawn-1:1,2",
          "plays": 6,
          "score": -0.2,
          "rawScore": -0.3333
        }
      ]
    },
    "black :: 9 :: 0 :: 3/2 :: 0.500000:b-bishop:captured|b-gold:0,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:3,2|w-gold:4,0|w-king:2,0|w-pawn-1:1,2|w-pawn-2:3,1|w-rook:captured|w-silver:captured || 0.500000:b-bishop:captured|b-gold:0,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:4,3|w-gold:4,0|w-king:2,0|w-pawn-1:1,2|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 6,
      "actions": [
        {
          "key": "move:b-pawn-1:1,2",
          "plays": 6,
          "score": 0.2,
          "rawScore": 0.3333
        }
      ]
    },
    "white :: 10 :: 0 :: 3/2 :: 0.500000:b-bishop:captured|b-gold:0,4|b-king:2,4|b-pawn-1:1,2|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:3,2|w-gold:4,0|w-king:2,0|w-pawn-1:captured|w-pawn-2:3,1|w-rook:captured|w-silver:captured || 0.500000:b-bishop:captured|b-gold:0,4|b-king:2,4|b-pawn-1:1,2|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:4,3|w-gold:4,0|w-king:2,0|w-pawn-1:captured|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 6,
      "actions": [
        {
          "key": "observe:w-bishop",
          "plays": 3,
          "score": 0.1429,
          "rawScore": 0.3333
        },
        {
          "key": "move:w-king:1,1",
          "plays": 3,
          "score": -0.4286,
          "rawScore": -1
        }
      ]
    },
    "black :: 9 :: 1 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,4|b-pawn-1:1,2|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:2,1|w-gold:4,0|w-king:2,0|w-pawn-1:captured|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 6,
      "actions": [
        {
          "key": "move:b-king:2,3",
          "plays": 3,
          "score": 0.4286,
          "rawScore": 1
        },
        {
          "key": "move:b-pawn-2:3,2",
          "plays": 2,
          "score": -0.3333,
          "rawScore": -1
        }
      ]
    },
    "black :: 11 :: 2 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,3|b-pawn-1:captured|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:1,0|w-gold:4,0|w-king:1,1|w-pawn-1:1,2|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 6,
      "actions": [
        {
          "key": "move:b-king:1,2",
          "plays": 5,
          "score": -0.5556,
          "rawScore": -1
        }
      ]
    },
    "black :: 11 :: 1 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,4|b-pawn-1:1,2|b-pawn-2:3,2|b-rook:captured|b-silver:captured|w-bishop:captured|w-gold:4,0|w-king:2,1|w-pawn-1:captured|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 6,
      "actions": [
        {
          "key": "move:b-king:3,3",
          "plays": 2,
          "score": -0.3333,
          "rawScore": -1
        },
        {
          "key": "move:b-pawn-2:3,1",
          "plays": 3,
          "score": -0.4286,
          "rawScore": -1
        }
      ]
    },
    "white :: 8 :: 1 :: 3/3 :: 1.000000:b-bishop:1,2|b-gold:0,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,2|w-rook:captured|w-silver:captured :: live": {
      "total": 6,
      "actions": [
        {
          "key": "move:w-pawn-1:1,2",
          "plays": 6,
          "score": 0,
          "rawScore": 0
        }
      ]
    },
    "white :: 6 :: 1 :: 3/3 :: 1.000000:b-bishop:1,2|b-gold:1,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:0,4|w-bishop:3,2|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,0|w-silver:captured :: live": {
      "total": 6,
      "actions": [
        {
          "key": "move:w-pawn-1:1,2",
          "plays": 6,
          "score": -0.4,
          "rawScore": -0.6667
        }
      ]
    },
    "black :: 9 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:captured|b-king:2,4|b-pawn-1:1,2|b-pawn-2:captured|b-rook:captured|b-silver:0,4|w-bishop:1,4|w-gold:4,0|w-king:2,0|w-pawn-1:captured|w-pawn-2:3,1|w-rook:0,0|w-silver:captured :: live": {
      "total": 6,
      "actions": [
        {
          "key": "move:b-king:1,4",
          "plays": 6,
          "score": 0.6,
          "rawScore": 1
        }
      ]
    },
    "white :: 10 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:captured|b-king:1,4|b-pawn-1:1,2|b-pawn-2:captured|b-rook:captured|b-silver:0,4|w-bishop:captured|w-gold:4,0|w-king:2,0|w-pawn-1:captured|w-pawn-2:3,1|w-rook:0,0|w-silver:captured :: live": {
      "total": 6,
      "actions": [
        {
          "key": "move:w-rook:0,4",
          "plays": 6,
          "score": -0.6,
          "rawScore": -1
        }
      ]
    },
    "black :: 11 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:captured|b-king:1,4|b-pawn-1:1,2|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:captured|w-gold:4,0|w-king:2,0|w-pawn-1:captured|w-pawn-2:3,1|w-rook:0,4|w-silver:captured :: live": {
      "total": 6,
      "actions": [
        {
          "key": "move:b-king:0,4",
          "plays": 6,
          "score": 0.6,
          "rawScore": 1
        }
      ]
    },
    "white :: 12 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:captured|b-king:0,4|b-pawn-1:1,2|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:captured|w-gold:4,0|w-king:2,0|w-pawn-1:captured|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 6,
      "actions": [
        {
          "key": "move:w-king:1,1",
          "plays": 5,
          "score": -0.5556,
          "rawScore": -1
        }
      ]
    },
    "black :: 11 :: 1 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,3|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:captured|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,2|w-rook:captured|w-silver:captured :: live": {
      "total": 5,
      "actions": [
        {
          "key": "move:b-king:3,2",
          "plays": 5,
          "score": 0.3333,
          "rawScore": 0.6
        }
      ]
    },
    "white :: 12 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:3,2|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:2,1|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:captured|w-rook:captured|w-silver:captured :: live": {
      "total": 5,
      "actions": [
        {
          "key": "move:w-bishop:3,2",
          "plays": 5,
          "score": 0.5556,
          "rawScore": 1
        }
      ]
    },
    "white :: 8 :: 1 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:2,3|b-king:2,4|b-pawn-1:captured|b-pawn-2:3,3|b-rook:captured|b-silver:0,4|w-bishop:1,2|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,0|w-silver:captured :: live": {
      "total": 5,
      "actions": [
        {
          "key": "move:w-bishop:2,3",
          "plays": 5,
          "score": 0.3333,
          "rawScore": 0.6
        }
      ]
    },
    "black :: 9 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:captured|b-king:2,4|b-pawn-1:captured|b-pawn-2:3,3|b-rook:captured|b-silver:0,4|w-bishop:2,3|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,0|w-silver:captured :: live": {
      "total": 5,
      "actions": [
        {
          "key": "move:b-king:2,3",
          "plays": 5,
          "score": -0.3333,
          "rawScore": -0.6
        }
      ]
    },
    "white :: 10 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:captured|b-king:2,3|b-pawn-1:captured|b-pawn-2:3,3|b-rook:captured|b-silver:0,4|w-bishop:captured|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,0|w-silver:captured :: live": {
      "total": 5,
      "actions": [
        {
          "key": "move:w-rook:0,4",
          "plays": 5,
          "score": 0.3333,
          "rawScore": 0.6
        }
      ]
    },
    "black :: 11 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:captured|b-king:2,3|b-pawn-1:captured|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:captured|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,4|w-silver:captured :: live": {
      "total": 5,
      "actions": [
        {
          "key": "move:b-king:1,4",
          "plays": 2,
          "score": -0.3333,
          "rawScore": -1
        }
      ]
    },
    "black :: 9 :: 1 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:0,3|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,2|b-rook:captured|b-silver:captured|w-bishop:captured|w-gold:4,0|w-king:2,1|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 5,
      "actions": [
        {
          "key": "move:b-king:3,3",
          "plays": 4,
          "score": -0.25,
          "rawScore": -0.5
        }
      ]
    },
    "white :: 12 :: 0 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:0,3|b-king:3,2|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:captured|w-gold:4,0|w-king:2,1|w-pawn-1:1,1|w-pawn-2:captured|w-rook:captured|w-silver:captured :: live": {
      "total": 5,
      "actions": [
        {
          "key": "move:w-king:3,2",
          "plays": 5,
          "score": 0.5556,
          "rawScore": 1
        }
      ]
    },
    "white :: 12 :: 1 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:3,3|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:captured|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,2|w-rook:captured|w-silver:captured :: live": {
      "total": 5,
      "actions": [
        {
          "key": "move:w-pawn-2:3,3",
          "plays": 5,
          "score": 0.5556,
          "rawScore": 1
        }
      ]
    },
    "black :: 11 :: 1 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,4|b-pawn-1:1,2|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:3,2|w-gold:3,0|w-king:2,0|w-pawn-1:captured|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 5,
      "actions": [
        {
          "key": "move:b-king:2,3",
          "plays": 4,
          "score": -0.5,
          "rawScore": -1
        }
      ]
    },
    "white :: 4 :: 1 :: 2/3 :: 0.500000:b-bishop:0,1|b-gold:1,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:0,4|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,0|w-silver:captured || 0.500000:b-bishop:4,3|b-gold:1,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:0,4|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,0|w-silver:captured :: live": {
      "total": 5,
      "actions": [
        {
          "key": "move:w-bishop:2,1",
          "plays": 3,
          "score": 0.4286,
          "rawScore": 1
        }
      ]
    },
    "white :: 8 :: 0 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:1,2|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:captured|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 5,
      "actions": [
        {
          "key": "move:w-king:1,1",
          "plays": 3,
          "score": -0.4286,
          "rawScore": -1
        }
      ]
    },
    "white :: 10 :: 1 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,4|b-pawn-1:captured|b-pawn-2:3,2|b-rook:captured|b-silver:captured|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:1,2|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 5,
      "actions": [
        {
          "key": "move:w-bishop:3,2",
          "plays": 5,
          "score": 0.5556,
          "rawScore": 1
        }
      ]
    },
    "black :: 7 :: 1 :: 3/3 :: 1.000000:b-bishop:2,3|b-gold:0,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:3,2|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 5,
      "actions": [
        {
          "key": "move:b-bishop:3,2",
          "plays": 3,
          "score": 0.4286,
          "rawScore": 1
        },
        {
          "key": "move:b-pawn-2:3,2",
          "plays": 2,
          "score": 0.3333,
          "rawScore": 1
        }
      ]
    },
    "white :: 8 :: 1 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:0,4|b-king:3,3|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,2|w-rook:captured|w-silver:captured :: live": {
      "total": 5,
      "actions": [
        {
          "key": "move:w-pawn-2:3,3",
          "plays": 5,
          "score": 0.5556,
          "rawScore": 1
        }
      ]
    },
    "black :: 7 :: 0 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:0,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:captured|b-rook:4,2|b-silver:captured|w-bishop:captured|w-gold:3,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,2|w-rook:captured|w-silver:4,0 :: live": {
      "total": 5,
      "actions": [
        {
          "key": "move:b-rook:4,0",
          "plays": 5,
          "score": -0.5556,
          "rawScore": -1
        }
      ]
    },
    "white :: 8 :: 0 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:0,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:captured|b-rook:4,0|b-silver:captured|w-bishop:captured|w-gold:3,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,2|w-rook:captured|w-silver:captured :: live": {
      "total": 5,
      "actions": [
        {
          "key": "move:w-gold:4,0",
          "plays": 5,
          "score": 0.5556,
          "rawScore": 1
        }
      ]
    },
    "black :: 9 :: 0 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:0,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:captured|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,2|w-rook:captured|w-silver:captured :: live": {
      "total": 5,
      "actions": [
        {
          "key": "move:b-bishop:1,2",
          "plays": 2,
          "score": -0.3333,
          "rawScore": -1
        },
        {
          "key": "move:b-king:3,3",
          "plays": 3,
          "score": -0.4286,
          "rawScore": -1
        }
      ]
    },
    "white :: 12 :: 2 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:1,3|b-king:3,2|b-pawn-1:captured|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:1,0|w-gold:4,0|w-king:1,1|w-pawn-1:captured|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 5,
      "actions": [
        {
          "key": "move:w-bishop:3,2",
          "plays": 3,
          "score": 0.4286,
          "rawScore": 1
        },
        {
          "key": "move:w-pawn-2:3,2",
          "plays": 2,
          "score": 0.3333,
          "rawScore": 1
        }
      ]
    },
    "white :: 12 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:1,2|b-king:2,4|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:captured|w-gold:4,0|w-king:2,0|w-pawn-1:captured|w-pawn-2:3,2|w-rook:captured|w-silver:captured :: live": {
      "total": 5,
      "actions": [
        {
          "key": "move:w-king:1,1",
          "plays": 5,
          "score": -0.5556,
          "rawScore": -1
        }
      ]
    },
    "black :: 11 :: 0 :: 3/3 :: 1.000000:b-bishop:1,2|b-gold:0,3|b-king:2,4|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:captured|w-gold:4,0|w-king:2,0|w-pawn-1:captured|w-pawn-2:3,2|w-rook:captured|w-silver:captured :: live": {
      "total": 5,
      "actions": [
        {
          "key": "move:b-gold:0,2",
          "plays": 2,
          "score": 0.3333,
          "rawScore": 1
        },
        {
          "key": "move:b-king:3,3",
          "plays": 3,
          "score": -0.4286,
          "rawScore": -1
        }
      ]
    },
    "white :: 10 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,3|b-pawn-1:1,2|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:1,0|w-gold:4,0|w-king:1,1|w-pawn-1:captured|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 5,
      "actions": [
        {
          "key": "move:w-king:1,2",
          "plays": 4,
          "score": -0.5,
          "rawScore": -1
        }
      ]
    },
    "black :: 11 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,3|b-pawn-1:captured|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:1,0|w-gold:4,0|w-king:1,2|w-pawn-1:captured|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 5,
      "actions": [
        {
          "key": "move:b-king:1,2",
          "plays": 5,
          "score": 0.5556,
          "rawScore": 1
        }
      ]
    },
    "white :: 12 :: 1 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,3|b-pawn-1:1,2|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:3,2|w-gold:4,1|w-king:2,0|w-pawn-1:captured|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
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
    "white :: 10 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,3|b-pawn-1:1,3|b-pawn-2:3,2|b-rook:captured|b-silver:captured|w-bishop:captured|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 5,
      "actions": [
        {
          "key": "move:w-pawn-2:3,2",
          "plays": 5,
          "score": -0.1111,
          "rawScore": -0.2
        }
      ]
    },
    "black :: 11 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,3|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:captured|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,2|w-rook:captured|w-silver:captured :: live": {
      "total": 5,
      "actions": [
        {
          "key": "move:b-king:3,2",
          "plays": 5,
          "score": 0.1111,
          "rawScore": 0.2
        }
      ]
    },
    "black :: 11 :: 2 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:3,3|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:3,2|w-gold:4,0|w-king:1,1|w-pawn-1:1,2|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 5,
      "actions": [
        {
          "key": "move:b-king:3,2",
          "plays": 5,
          "score": -0.5556,
          "rawScore": -1
        }
      ]
    },
    "white :: 12 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:3,2|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:captured|w-gold:4,0|w-king:1,1|w-pawn-1:1,2|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 5,
      "actions": [
        {
          "key": "move:w-pawn-2:3,2",
          "plays": 5,
          "score": 0.5556,
          "rawScore": 1
        }
      ]
    },
    "black :: 11 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:3,3|b-pawn-1:captured|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:3,2|w-gold:4,0|w-king:2,0|w-pawn-1:1,3|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 5,
      "actions": [
        {
          "key": "move:b-king:3,2",
          "plays": 5,
          "score": -0.5556,
          "rawScore": -1
        }
      ]
    },
    "white :: 12 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:3,2|b-pawn-1:captured|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:captured|w-gold:4,0|w-king:2,0|w-pawn-1:1,3|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 5,
      "actions": [
        {
          "key": "move:w-pawn-2:3,2",
          "plays": 5,
          "score": 0.5556,
          "rawScore": 1
        }
      ]
    },
    "white :: 12 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:1,2|b-pawn-1:captured|b-pawn-2:3,3|b-rook:captured|b-silver:captured|w-bishop:1,0|w-gold:4,0|w-king:1,1|w-pawn-1:captured|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 5,
      "actions": [
        {
          "key": "move:w-king:1,2",
          "plays": 5,
          "score": 0.5556,
          "rawScore": 1
        }
      ]
    },
    "white :: 12 :: 1 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,3|b-pawn-1:captured|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:3,2|w-gold:4,0|w-king:2,0|w-pawn-1:1,2|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
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
    "black :: 11 :: 1 :: 3/3 :: 1.000000:b-bishop:2,3|b-gold:0,4|b-king:3,3|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:captured|w-gold:4,0|w-king:2,1|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 4,
      "actions": [
        {
          "key": "move:b-gold:0,3",
          "plays": 3,
          "score": 0.4286,
          "rawScore": 1
        }
      ]
    },
    "white :: 10 :: 0 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:1,2|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,2|b-rook:captured|b-silver:captured|w-bishop:captured|w-gold:4,0|w-king:2,0|w-pawn-1:captured|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 4,
      "actions": [
        {
          "key": "move:w-pawn-2:3,2",
          "plays": 2,
          "score": 0,
          "rawScore": 0
        },
        {
          "key": "move:w-king:1,1",
          "plays": 2,
          "score": -0.3333,
          "rawScore": -1
        }
      ]
    },
    "black :: 9 :: 2 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:0,4|b-king:3,3|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:3,2|w-gold:4,0|w-king:2,1|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 4,
      "actions": [
        {
          "key": "move:b-king:3,2",
          "plays": 4,
          "score": -0.5,
          "rawScore": -1
        }
      ]
    },
    "white :: 10 :: 0 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:0,4|b-king:3,2|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:captured|w-gold:4,0|w-king:2,1|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 4,
      "actions": [
        {
          "key": "move:w-king:3,2",
          "plays": 4,
          "score": 0.5,
          "rawScore": 1
        }
      ]
    },
    "white :: 10 :: 2 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:0,3|b-king:3,3|b-pawn-1:1,3|b-pawn-2:3,2|b-rook:captured|b-silver:captured|w-bishop:captured|w-gold:4,0|w-king:2,1|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 4,
      "actions": [
        {
          "key": "move:w-pawn-2:3,2",
          "plays": 3,
          "score": 0.4286,
          "rawScore": 1
        }
      ]
    },
    "black :: 7 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:1,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:0,4|w-bishop:3,2|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,1|w-silver:captured :: live": {
      "total": 4,
      "actions": [
        {
          "key": "move:b-king:3,3",
          "plays": 3,
          "score": -0.4286,
          "rawScore": -1
        }
      ]
    },
    "white :: 12 :: 2 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,3|b-pawn-1:1,2|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:3,2|w-gold:3,0|w-king:2,0|w-pawn-1:captured|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
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
    "white :: 10 :: 2 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:0,4|b-king:3,3|b-pawn-1:1,3|b-pawn-2:3,2|b-rook:captured|b-silver:captured|w-bishop:captured|w-gold:3,0|w-king:2,1|w-pawn-1:1,1|w-pawn-2:captured|w-rook:captured|w-silver:4,0 :: live": {
      "total": 4,
      "actions": [
        {
          "key": "move:w-king:3,2",
          "plays": 4,
          "score": -0.5,
          "rawScore": -1
        }
      ]
    },
    "black :: 11 :: 0 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:0,4|b-king:3,3|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:captured|w-gold:3,0|w-king:3,2|w-pawn-1:1,1|w-pawn-2:captured|w-rook:captured|w-silver:4,0 :: live": {
      "total": 4,
      "actions": [
        {
          "key": "move:b-king:3,2",
          "plays": 4,
          "score": 0.5,
          "rawScore": 1
        }
      ]
    },
    "black :: 3 :: 2 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:1,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:4,2|b-silver:0,4|w-bishop:3,2|w-gold:3,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,0|w-silver:4,0 :: live": {
      "total": 4,
      "actions": [
        {
          "key": "move:b-rook:3,2",
          "plays": 3,
          "score": 0.4286,
          "rawScore": 1
        }
      ]
    },
    "white :: 10 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,2|b-rook:captured|b-silver:captured|w-bishop:captured|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:captured|w-rook:captured|w-silver:captured :: live": {
      "total": 4,
      "actions": [
        {
          "key": "move:w-king:3,1",
          "plays": 2,
          "score": -0.3333,
          "rawScore": -1
        }
      ]
    },
    "white :: 12 :: 0 :: 3/3 :: 1.000000:b-bishop:2,3|b-gold:0,4|b-king:3,2|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:captured|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:captured|w-rook:captured|w-silver:captured :: live": {
      "total": 4,
      "actions": [
        {
          "key": "move:w-king:2,1",
          "plays": 2,
          "score": -0.3333,
          "rawScore": -1
        }
      ]
    },
    "white :: 10 :: 1 :: 3/3 :: 1.000000:b-bishop:0,1|b-gold:0,3|b-king:2,4|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:captured|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,2|w-rook:captured|w-silver:captured :: live": {
      "total": 4,
      "actions": [
        {
          "key": "move:w-king:2,1",
          "plays": 2,
          "score": 0.3333,
          "rawScore": 1
        }
      ]
    },
    "black :: 11 :: 1 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:2,4|b-pawn-1:1,2|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:captured|w-pawn-2:3,3|w-rook:captured|w-silver:captured :: live": {
      "total": 4,
      "actions": [
        {
          "key": "move:b-king:3,3",
          "plays": 4,
          "score": 0,
          "rawScore": 0
        }
      ]
    },
    "white :: 12 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:3,3|b-pawn-1:1,2|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:captured|w-pawn-2:captured|w-rook:captured|w-silver:captured :: live": {
      "total": 4,
      "actions": [
        {
          "key": "move:w-bishop:3,2",
          "plays": 4,
          "score": 0,
          "rawScore": 0
        }
      ]
    },
    "white :: 6 :: 1 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:1,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:3,3|b-rook:captured|b-silver:0,3|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,1|w-rook:0,1|w-silver:captured :: live": {
      "total": 4,
      "actions": [
        {
          "key": "move:w-rook:0,3",
          "plays": 3,
          "score": 0.1429,
          "rawScore": 0.3333
        }
      ]
    },
    "white :: 12 :: 1 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:0,4|b-king:3,3|b-pawn-1:1,2|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:3,2|w-gold:4,0|w-king:2,0|w-pawn-1:captured|w-pawn-2:3,1|w-rook:captured|w-silver:captured :: live": {
      "total": 4,
      "actions": [
        {
          "key": "move:w-king:1,1",
          "plays": 4,
          "score": -0.5,
          "rawScore": -1
        }
      ]
    },
    "black :: 5 :: 0 :: 3/3 :: 1.000000:b-bishop:3,4|b-gold:1,4|b-king:2,4|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:0,4|w-bishop:1,0|w-gold:4,0|w-king:2,0|w-pawn-1:1,1|w-pawn-2:3,2|w-rook:0,0|w-silver:captured :: live": {
      "total": 4,
      "actions": [
        {
          "key": "move:b-king:3,3",
          "plays": 3,
          "score": -0.4286,
          "rawScore": -1
        }
      ]
    },
    "black :: 9 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:captured|b-king:3,3|b-pawn-1:1,3|b-pawn-2:captured|b-rook:captured|b-silver:0,4|w-bishop:1,4|w-gold:4,0|w-king:2,0|w-pawn-1:1,2|w-pawn-2:3,1|w-rook:0,0|w-silver:captured :: live": {
      "total": 4,
      "actions": [
        {
          "key": "move:b-pawn-1:1,2",
          "plays": 4,
          "score": -0.5,
          "rawScore": -1
        }
      ]
    },
    "white :: 10 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:captured|b-king:3,3|b-pawn-1:1,2|b-pawn-2:captured|b-rook:captured|b-silver:0,4|w-bishop:1,4|w-gold:4,0|w-king:2,0|w-pawn-1:captured|w-pawn-2:3,1|w-rook:0,0|w-silver:captured :: live": {
      "total": 4,
      "actions": [
        {
          "key": "move:w-rook:0,4",
          "plays": 4,
          "score": 0.5,
          "rawScore": 1
        }
      ]
    },
    "black :: 11 :: 0 :: 3/3 :: 1.000000:b-bishop:captured|b-gold:captured|b-king:3,3|b-pawn-1:1,2|b-pawn-2:captured|b-rook:captured|b-silver:captured|w-bishop:1,4|w-gold:4,0|w-king:2,0|w-pawn-1:captured|w-pawn-2:3,1|w-rook:0,4|w-silver:captured :: live": {
      "total": 4,
      "actions": [
        {
          "key": "move:b-pawn-1:1,1",
          "plays": 3,
          "score": -0.4286,
          "rawScore": -1
        }
      ]
    }
  },
  "benchmarks": {
    "generatedAt": "2026-04-05T11:11:22.722Z",
    "config": {
      "gamesPerMatchup": 1,
      "maxPlies": 18,
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
          "iterations": 30
        },
        "learned-hybrid": {
          "depth": 1,
          "iterations": 45
        }
      }
    },
    "summary": {
      "totalGames": 4,
      "learnedWins": 1,
      "learnedLosses": 0,
      "draws": 3,
      "totalPoints": 2.5,
      "pointRate": 0.625,
      "trainedAsBlack": "1-0-1",
      "trainedAsWhite": "0-0-2",
      "averagePlies": 16.25,
      "note": "low-budget controller check: learned-hybrid vs expectiminimax / mcts with shared trained evaluator"
    },
    "games": [
      {
        "label": "learned-black-vs-expect",
        "black": "learned-hybrid",
        "white": "expectiminimax",
        "learnedSide": "black",
        "winner": "black",
        "reason": "王を捕獲",
        "plies": 11,
        "learnedPoint": 1
      },
      {
        "label": "expect-black-vs-learned",
        "black": "expectiminimax",
        "white": "learned-hybrid",
        "learnedSide": "white",
        "winner": "draw",
        "reason": "max-ply",
        "plies": 18,
        "learnedPoint": 0.5
      },
      {
        "label": "learned-black-vs-mcts",
        "black": "learned-hybrid",
        "white": "mcts",
        "learnedSide": "black",
        "winner": "draw",
        "reason": "max-ply",
        "plies": 18,
        "learnedPoint": 0.5
      },
      {
        "label": "mcts-black-vs-learned",
        "black": "mcts",
        "white": "learned-hybrid",
        "learnedSide": "white",
        "winner": "draw",
        "reason": "max-ply",
        "plies": 18,
        "learnedPoint": 0.5
      }
    ]
  }
};
