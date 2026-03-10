import { getDB } from './db.js';

const MAX_PICKS_PER_MINUTE = 5;
const MAX_COMMENTS_PER_HOUR = 10;

/**
 * 檢查 IP 是否超過每分鐘抽站限制
 * @param {string} ip
 * @returns {{ allowed: boolean, remaining: number }}
 */
export function checkRateLimit(ip) {
  const db = getDB();

  // 以「分鐘」為單位的 window（格式：2026-03-09T10:15）
  const now = new Date();
  const windowStart = now.toISOString().slice(0, 16); // "2026-03-09T10:15"

  // 清理超過 2 分鐘的舊記錄
  const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000).toISOString().slice(0, 16);
  db.prepare('DELETE FROM rate_limits WHERE window_start < ?').run(twoMinutesAgo);

  // 查詢當前分鐘的記錄
  const row = db.prepare(
    'SELECT pick_count FROM rate_limits WHERE ip = ? AND window_start = ?'
  ).get(ip, windowStart);

  const currentCount = row ? row.pick_count : 0;

  if (currentCount >= MAX_PICKS_PER_MINUTE) {
    return { allowed: false, remaining: 0 };
  }

  // 更新或新增記錄
  db.prepare(`
    INSERT INTO rate_limits (ip, window_start, pick_count)
    VALUES (?, ?, 1)
    ON CONFLICT(ip, window_start) DO UPDATE SET pick_count = pick_count + 1
  `).run(ip, windowStart);

  return { allowed: true, remaining: MAX_PICKS_PER_MINUTE - currentCount - 1 };
}

/**
 * 檢查 IP 是否超過每小時留言限制
 * 使用 comment: 前綴區隔抽站記錄
 * @param {string} ip
 * @returns {{ allowed: boolean, remaining: number }}
 */
export function checkCommentRateLimit(ip) {
  const db = getDB();

  const now = new Date();
  const windowStart = now.toISOString().slice(0, 13);
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString().slice(0, 13);

  const prefixedIp = `comment:${ip}`;

  db.prepare('DELETE FROM rate_limits WHERE window_start < ?').run(twoHoursAgo);

  const row = db.prepare(
    'SELECT pick_count FROM rate_limits WHERE ip = ? AND window_start = ?'
  ).get(prefixedIp, windowStart);

  const currentCount = row ? row.pick_count : 0;

  if (currentCount >= MAX_COMMENTS_PER_HOUR) {
    return { allowed: false, remaining: 0 };
  }

  db.prepare(`
    INSERT INTO rate_limits (ip, window_start, pick_count)
    VALUES (?, ?, 1)
    ON CONFLICT(ip, window_start) DO UPDATE SET pick_count = pick_count + 1
  `).run(prefixedIp, windowStart);

  return { allowed: true, remaining: MAX_COMMENTS_PER_HOUR - currentCount - 1 };
}
