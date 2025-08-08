import { db } from './db/sqlite';

/**
 * A simple key-value settings store. Values are stored as strings.
 */
export type Settings = Record<string, string>;

/**
 * Retrieve all settings from the database, falling back to process.env
 */
export function getSettings(): Settings {
  const rows = db.prepare('SELECT key, value FROM settings').all() as { key: string; value: string }[];
  const s: Settings = {};
  for (const row of rows) {
    s[row.key] = row.value;
  }
  // fallback to environment variables
  for (const [k, v] of Object.entries(process.env)) {
    if (s[k] === undefined && v !== undefined) s[k] = v as string;
  }
  return s;
}

/**
 * Upsert settings into the database. Performs all writes in a transaction.
 */
export function setSettings(kv: Record<string, string>) {
  const stmt = db.prepare(
    'INSERT INTO settings (key, value) VALUES (@key, @value) ON CONFLICT(key) DO UPDATE SET value = excluded.value'
  );
  const tx = db.transaction((obj: Record<string, string>) => {
    for (const [key, value] of Object.entries(obj)) {
      stmt.run({ key, value });
    }
  });
  tx(kv);
}