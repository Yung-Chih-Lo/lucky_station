import Database from 'better-sqlite3';
import path from 'path';
import { mkdirSync } from 'fs';

const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), 'data', 'lucky_station.db');

// 確保資料庫目錄存在（Zeabur volume 第一次掛載時可能尚未建立）
mkdirSync(path.dirname(DB_PATH), { recursive: true });

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS station_picks (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  station_name    TEXT    NOT NULL,
  county          TEXT    NOT NULL,
  token           TEXT    UNIQUE NOT NULL,
  picked_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
  comment_used    INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS comments (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  token        TEXT    NOT NULL REFERENCES station_picks(token),
  station_name TEXT    NOT NULL,
  county       TEXT    NOT NULL,
  content      TEXT    NOT NULL,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rate_limits (
  ip           TEXT NOT NULL,
  window_start TEXT NOT NULL,
  pick_count   INTEGER DEFAULT 1,
  PRIMARY KEY (ip, window_start)
);

CREATE INDEX IF NOT EXISTS idx_station_picks_station ON station_picks(station_name);
CREATE INDEX IF NOT EXISTS idx_comments_station ON comments(station_name);
CREATE INDEX IF NOT EXISTS idx_comments_created ON comments(created_at);
`;

let db;

export function getDB() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.exec(SCHEMA_SQL);
  }
  return db;
}
