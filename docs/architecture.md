# アーキテクチャ概要

この作品は、UI から見える派手さよりも、ルールエンジンを独立させて説明しやすくすることを優先しています。

## 層の分け方

```text
UI (src/ui)
  ├─ board.js       盤面描画とセル選択
  ├─ panels.js      設定、解析、リプレイ、量子状態ビュー
  ├─ charts.js      評価推移チャート
  └─ app.js         画面全体の状態遷移

Game Core (src/game)
  ├─ rules.js       合法手生成、状態遷移、collapse
  ├─ ai.js          Expectiminimax / MCTS / learned-hybrid
  ├─ evaluator.js   局面評価
  ├─ model.js       学習済みモデルの読み出し
  ├─ trainedModel.js 自己対局から生成した埋め込みデータ
  ├─ heatmap.js     候補手ごとの近似勝率
  ├─ analysis.js    エントロピー、推移、状態要約
  ├─ replay.js      JSON リプレイ
  ├─ selectors.js   state からの読み取り
  ├─ setup.js       初期局面と seed
  └─ utils.js       共通関数、hash、乱数
```

## 中心となるデータ構造

### state

```js
{
  turn,
  worlds,
  charges,
  turnCount,
  halfmoveClock,
  result,
  rngState,
  meta,
}
```

### world

```js
{
  weight,
  pieces,
}
```

### piece

```js
{
  id,
  owner,
  type,
  x,
  y,
  captured,
}
```

量子状態は「駒ごとに確率を持たせる」のではなく、「重み付き world の集合」として保持しています。この形にすると、

- 観測でどの世界へ collapse するかを自然に扱える
- AI が belief state をそのまま読める
- リプレイで局面丸ごと保存しやすい

という利点があります。

## データフロー

### 通常の着手

1. UI で駒を選ぶ
2. `rules.js` が合法手を返す
3. `applyAction` / `applyDeterministicAction` で state を更新する
4. 新しい state を履歴へ積む
5. `analysis.js` や `selectors.js` が表示用データを作る

### 観測

1. `observe` アクションを選ぶ
2. `applyAction` が `rngState` から乱数を引く
3. 重みに応じて 1 世界をサンプリングする
4. その世界だけを残して collapse する
5. 次の `rngState` を state に保存する

## AI と UI を分離した理由

`src/game` を UI 非依存にしているので、同じロジックを次の用途に流用できます。

- ブラウザ UI
- 自己対戦スクリプト
- リプレイ生成
- 将来的な Web Worker 化

今回も `scripts/generateSampleReplay.js` と `scripts/generateReplayReport.js` は、UI を介さずに同じルールエンジンを使っています。

## なぜ state を履歴ごと保存するのか

リプレイを「着手列だけ」で保存する方法もありますが、この作品では各手ごとの state を丸ごと保存しています。理由は次の通りです。

- 観測の結果が即座に再生できる
- seed の違いを気にせず履歴を読み込める
- 過去局面をそのまま評価・可視化できる

サイズは多少増えますが、5x5 の小規模盤面では十分許容範囲です。

## 学習パイプライン

ブラウザ本体とは別に、`scripts/trainModel.js` と `scripts/benchmarkModel.js` を用意しています。

- `trainModel.js` : 自己対局から `trainedModel.js` を再生成する
- `benchmarkModel.js` : learned-hybrid を簡易比較してレポートを残す

これにより、ゲーム本体と学習処理の責務を分離したまま、同じルールエンジンを再利用できます。
