import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';

// Determine the SQLite file path. Default to a relative path inside the container
const dbPath = process.env.SQLITE_PATH || './data/databroker.sqlite';

// Ensure the directory exists
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

// Initialise the database connection with WAL journal mode for concurrency
export const db = new Database(dbPath);
db.pragma('journal_mode = WAL');