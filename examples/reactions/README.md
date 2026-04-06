# Bundled reaction JSON examples

このフォルダには、そのまま UI から読み込める reaction JSON の例を複数入れています。`Load JSON` は 1 ファイルずつ読み込むので、必要なものだけ順番に読み込んでください。

## 収録ファイル

- `minimal-single-reaction.json`
  - 最小の 1 反応だけを持つ object-form JSON
- `custom-sn2-library.json`
  - methyl / primary を混ぜた小さな showcase library
- `halide-leaving-group-comparison.json`
  - `OH⁻ + CH₃Cl/Br/I` をまとめて比較する library
- `donor-family-comparison.json`
  - `OH⁻ / HS⁻ / NH₂⁻ / F⁻` の donor 側の違いを見る library
- `primary-substrate-series.json`
  - `ethyl chloride / ethyl bromide` を使う primary-sn2 library
- `array-format-example.json`
  - トップレベルが配列そのものの JSON 例

## 使い方

1. アプリを起動する
2. `Reaction JSON import` でこのフォルダ内の JSON を 1 つ選ぶ
3. `Load JSON` を押す
4. `Reaction preset` の `Imported JSON` グループから選ぶ
5. built-in だけに戻したいときは `Built-ins only` を押す

## 注意

- 例同士で ID が衝突しないように、すべて `example-...` の id にしています
- 対応している family は現状 `methyl-sn2` と `primary-sn2` です
- nucleophile 側は単一重原子 + 任意の `Nu–H` spectator の範囲に絞っています
