import { getDB } from './db.js';

const MAX_PICKS_PER_HOUR = 5;

/**
 * 檢查 IP 是否超過每小時抽站限制
 * @param {string} ip
 * @returns {{ allowed: boolean, remaining: number }}
 */
export function checkRateLimit(ip) {
  const db = getDB();

  // 以「小時」為單位的 window（格式：2026-03-09T10）
  const now = new Date();
  const windowStart = now.toISOString().slice(0, 13); // "2026-03-09T10"

  // 清理超過 2 小時的舊記錄
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString().slice(0, 13);
  db.prepare('DELETE FROM rate_limits WHERE window_start < ?').run(twoHoursAgo);

  // 查詢當前小時的記錄
  const row = db.prepare(
    'SELECT pick_count FROM rate_limits WHERE ip = ? AND window_start = ?'
  ).get(ip, windowStart);

  const currentCount = row ? row.pick_count : 0;

  if (currentCount >= MAX_PICKS_PER_HOUR) {
    return { allowed: false, remaining: 0 };
  }

  // 更新或新增記錄
  db.prepare(`
    INSERT INTO rate_limits (ip, window_start, pick_count)
    VALUES (?, ?, 1)
    ON CONFLICT(ip, window_start) DO UPDATE SET pick_count = pick_count + 1
  `).run(ip, windowStart);

  return { allowed: true, remaining: MAX_PICKS_PER_HOUR - currentCount - 1 };
}
