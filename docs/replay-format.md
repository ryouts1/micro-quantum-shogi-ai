# リプレイ JSON 形式

リプレイは `serializeReplay` / `deserializeReplay` で扱います。ファイルは次のような構造です。

```json
{
  "schemaVersion": 2,
  "meta": {
    "variant": "micro-quantum-shogi",
    "exportedAt": "2026-04-05T08:00:00.000Z"
  },
  "entries": [
    {
      "state": { "...": "..." },
      "action": null,
      "actionKey": "start",
      "actionText": "開始局面",
      "note": "新規対局",
      "timestamp": "2026-04-05T08:00:00.000Z"
    }
  ]
}
```

## フィールドの意味

### meta

- `variant`: この作品用の識別子
- `exportedAt`: 書き出し日時
- `label`, `controllers`, `aiConfig` などは任意の追加情報

### entries[n].state

局面をそのまま保存します。主な項目は次の通りです。

- `turn`: 次に指す側
- `worlds`: 重み付き world の配列
- `charges`: 先手 / 後手の量子チャージ残数
- `turnCount`: 現在の手数
- `halfmoveClock`: 進展なしカウント
- `result`: 終局している場合の結果
- `rngState`: 観測のための内部 seed

### entries[n].action

その局面に至る直前の手です。

- 古典移動: `type = "move"`, `mode = "classical"`
- 量子移動: `type = "move"`, `mode = "quantum"`
- 観測: `type = "observe"`

## この形式にした理由

着手だけを保存する方式より冗長ですが、この形式なら次の利点があります。

- 過去局面をすぐ UI に表示できる
- 勝率推移や量子状態ビューを履歴上でそのまま使える
- seed と実際の collapse 結果の両方を保持しやすい

5x5 の小規模ゲームなので、リプレイサイズは十分現実的です。
