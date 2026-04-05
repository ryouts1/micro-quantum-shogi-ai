# micro-quantum-shogi [L]

5x5 の簡易量子将棋です。駒の不確定性は「確率付きの複数世界」として保持し、観測で 1 つの世界に collapse します。対局 UI、Expectiminimax / MCTS / learned-hybrid AI、決定的リプレイ、勝率ヒートマップ、評価推移、量子状態ビュー、自己対局で作った学習済みモデルまでを 1 つのリポジトリにまとめました。

今回の版では、探索アルゴリズムを置くだけでなく、自己対局から作った軽量モデルを同梱しています。ニューラルネットではありませんが、学習済みの piece-square table、線形評価重み、序盤ブックを評価関数と手の優先度に反映しています。

## この作品で見せたいこと

- ルール設計: 量子っぽい不確定性を、説明できるルールに落とす
- 状態管理: UI / AI / リプレイが同じ belief state を共有する
- 探索実装: Expectiminimax と MCTS を同一エンジン上で比較する
- 学習導入: 自己対局から軽量モデルを作って探索に混ぜる
- 可視化: 分岐した世界、候補手、評価推移を UI に載せる
- 品質担保: seed、テスト、補助ドキュメント、サンプルデータまで揃える

## 何ができるか

- 5x5 量子将棋のブラウザ対局
- Human / Expectiminimax / MCTS / learned-hybrid の切り替え
- 量子移動と観測 collapse
- 勝率ヒートマップと量子候補ランキング
- 上位世界をミニ盤面で並べる量子状態ビュー
- 候補手ランキングを出す AI 解析パネル
- リプレイスライダ、自動再生、評価推移チャート
- JSON リプレイの書き出し / 読み込み
- 学習済みモデルのメタ情報表示
- サンプルリプレイ、学習レポート、簡易ベンチマークの同梱

## ルールの要点

### 盤面と駒

- 盤面は 5x5
- 駒は 王 / 金 / 銀 / 角 / 飛 / 歩
- 成り・持ち駒・打ちはなし
- 勝敗は相手の王の捕獲で決まる

### 量子移動

- 各プレイヤーは量子チャージを 3 回持つ
- 量子移動は非捕獲移動のみ
- 1 枚の確定駒を 2 つの合法マスへ同時に分岐させる
- 分岐後は 50% / 50% の 2 世界として保持する

### 観測

- 不確定な駒に対して観測を行うと、状態全体が 1 つの世界に collapse する
- 観測も 1 手として扱う
- 不確定な駒はそのままでは捕まえられない。観測で世界を確定させてから捕獲する

### 実装上の整理

量子捕獲まで全面的に許すと、王の生死や捕獲結果自体が分岐し、合法手判定と探索が急に複雑になります。この作品では次の制約を置いています。

- 量子移動は非捕獲のみ
- 捕獲は古典移動のみ
- 合法手判定は「全世界で同じ意味を持つ手」だけを採用

この制約のおかげで、量子状態があってもルールの意味がぶれず、AI とリプレイが一貫したデータ構造で扱えます。

## 学習済み AI の作り方

今回の学習部分は、深層学習ではなく、ポートフォリオで説明しやすい軽量な自己対局ベースです。

- `scripts/trainModel.js`
  - 浅い自己対局を複数回まわす
  - 局面特徴を集めて線形重みを学習する
  - piece-square table を作る
  - 序盤の exact-state opening book を作る
- `scripts/benchmarkModel.js`
  - learned-hybrid を expectiminimax / mcts と軽く比較する
  - レポートを `sample-data/reports/benchmark-report.json` に保存する

学習済みモデルは `src/game/trainedModel.js` に埋め込み済みです。UI の「学習済みモデル」パネルから、自己対局数、局面数、序盤ブック状態数、簡易ベンチマーク結果を確認できます。

### learned-hybrid の中身

learned-hybrid は別物の巨大 AI ではなく、既存の探索を次のように束ねたものです。

1. 序盤で exact-state opening book があればそれを優先する
2. それ以外は Expectiminimax と MCTS の候補を両方計算する
3. 学習済み評価と action prior を混ぜて最終ランキングを作る

この構成にした理由は、面接で「学習で全部置き換えた」のではなく、「探索のどこに学習情報を差し込んだか」を説明しやすいからです。

## 画面で見てほしい場所

1. 盤面で確定駒を選ぶ
2. 勝率ヒートマップを出す
3. 量子状態ビューで世界の分岐を見る
4. AI 解析パネルで候補手ランキングを見る
5. 学習済みモデルパネルで自己対局データを見る
6. リプレイで評価推移をスクラブする

これだけで、ルール設計・状態表現・探索・軽量学習・可視化のつながりが伝わる構成にしています。

## ディレクトリ構成

```text
micro-quantum-shogi/
├── README.md
├── package.json
├── server.js
├── docs/
│   ├── architecture.md
│   ├── design-decisions.md
│   ├── replay-format.md
│   ├── rules-ja.md
│   ├── test-plan.md
│   └── training.md
├── sample-data/
│   ├── replays/
│   │   └── ai-duel.json
│   └── reports/
│       ├── benchmark-report.json
│       ├── sample-replay-report.json
│       └── training-report.json
├── scripts/
│   ├── benchmarkModel.js
│   ├── generateReplayReport.js
│   ├── generateSampleReplay.js
│   └── trainModel.js
├── src/
│   ├── index.html
│   ├── main.js
│   ├── styles.css
│   ├── game/
│   │   ├── ai.js
│   │   ├── analysis.js
│   │   ├── constants.js
│   │   ├── evaluator.js
│   │   ├── heatmap.js
│   │   ├── model.js
│   │   ├── replay.js
│   │   ├── rules.js
│   │   ├── selectors.js
│   │   ├── setup.js
│   │   ├── trainedModel.js
│   │   └── utils.js
│   └── ui/
│       ├── app.js
│       ├── board.js
│       ├── charts.js
│       └── panels.js
└── tests/
    ├── ai.test.js
    ├── determinism.test.js
    ├── heatmap.test.js
    ├── learned.test.js
    ├── replay.test.js
    └── rules.test.js
```

## 起動方法

Node.js 20 以上を想定しています。

```bash
cd micro-quantum-shogi
npm start
```

起動後にブラウザで `http://localhost:4173` を開いてください。

## 主要スクリプト

```bash
npm start                # ローカルサーバー起動
npm test                 # ルール / AI / リプレイ / 学習済みモデルのテスト
npm run sample-replay    # サンプルリプレイ生成
npm run replay-report    # サンプルリプレイの集計レポート生成
npm run train-model      # 自己対局から trainedModel.js を再生成
npm run benchmark-model  # learned-hybrid の簡易比較を実行
```

## AI の実装方針

### Expectiminimax

- 観測を chance node として扱う
- belief state をそのまま確率付き状態として評価する
- 学習済み線形評価と piece-square table を併用する

### MCTS

- belief state 上で UCT を回す
- 観測で生じる collapse は seed 付き乱択でサンプリングする
- rollout は軽いヒューリスティック付きランダム方策を使う
- 学習済み action prior を unvisited node と rollout の両方に混ぜる

### learned-hybrid

- opening book があればその手を使う
- なければ Expectiminimax と MCTS のランキングを合成する
- 学習済み prior を最後の tie-break に使う

## サンプルデータ

- `sample-data/replays/ai-duel.json`
  - learned-hybrid と mcts のサンプル対局
- `sample-data/reports/sample-replay-report.json`
  - 量子手数、観測回数、平均世界数、最終結果を集計
- `sample-data/reports/training-report.json`
  - 自己対局数、特徴重み、opening book のプレビュー
- `sample-data/reports/benchmark-report.json`
  - learned-hybrid の低予算比較結果

## テスト

```bash
npm test
```

確認している内容は次の通りです。

- 初期局面で合法手が生成されること
- 量子移動で世界が分岐し、チャージが減ること
- 観測で世界が 1 つに collapse すること
- Expectiminimax が即王取りを優先すること
- MCTS が固定 seed で決定的に振る舞うこと
- learned-hybrid が初期局面で opening book を使えること
- 学習済みメタ情報が埋め込まれていること
- リプレイの JSON 化と復元が壊れていないこと

## ドキュメント

- `docs/architecture.md` : モジュール境界とデータフロー
- `docs/design-decisions.md` : 主要な設計判断
- `docs/replay-format.md` : リプレイ JSON の構造
- `docs/rules-ja.md` : ルールの日本語説明
- `docs/test-plan.md` : 何をどう検証しているか
- `docs/training.md` : 学習済みモデルの作り方と限界

## 既知の制約

- 本将棋のような王手・詰み・持ち駒・打ちは未実装
- 量子移動は非捕獲のみ
- ヒートマップは高速化優先の近似値
- 学習は軽量な自己対局ベースで、強い最適化までは狙っていない
- `benchmark-report.json` は短時間で回せる低予算比較で、統計的に強い主張はしていない

## 今後の改善案

- 王手判定を導入した上で合法手をさらに厳密化する
- Web Worker に AI を逃がして UI の反応を軽くする
- 自己対局数を増やし、opening explorer を UI に出す
- 簡易線形モデルから小さな value network へ発展させる
- 量子分岐の重みを 50/50 固定から拡張する

## この作品で採用側に伝わること

- 仕様が曖昧な題材を、破綻しない範囲でルール設計できる
- 探索アルゴリズムを UI までつないで見せられる
- 学習済みモデルを「探索のどこに混ぜたか」を説明できる
- 状態管理、可視化、テスト、補助文書までまとめて整えられる
- 小規模でも中身のあるポートフォリオ実装に仕上げられる
