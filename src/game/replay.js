import { actionToKey, actionToText } from './rules.js';
import { deepClone } from './utils.js';

const REPLAY_SCHEMA_VERSION = 2;

export function snapshotState(state) {
  return deepClone(state);
}

export function createReplayEntry(state, action = null, note = '') {
  return {
    state: snapshotState(state),
    action,
    actionKey: action ? actionToKey(action) : 'start',
    actionText: action ? actionToText(action) : '開始局面',
    note,
    timestamp: new Date().toISOString(),
  };
}

export function serializeReplay(entries, meta = {}) {
  return JSON.stringify(
    {
      schemaVersion: REPLAY_SCHEMA_VERSION,
      meta: {
        exportedAt: new Date().toISOString(),
        variant: 'micro-quantum-shogi',
        ...meta,
      },
      entries,
    },
    null,
    2,
  );
}

export function deserializeReplay(text) {
  const parsed = JSON.parse(text);
  if (!parsed || !Array.isArray(parsed.entries)) {
    throw new Error('リプレイ形式が不正です。');
  }

  if (parsed.meta?.variant && parsed.meta.variant !== 'micro-quantum-shogi') {
    throw new Error('この JSON は micro-quantum-shogi 用のリプレイではありません。');
  }

  const invalidEntry = parsed.entries.find((entry) => !entry || !entry.state || !Array.isArray(entry.state.worlds));
  if (invalidEntry) {
    throw new Error('リプレイ内の局面データが壊れています。');
  }

  return parsed;
}
