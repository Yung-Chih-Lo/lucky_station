import { NextResponse } from 'next/server';
import { getDB } from '../../../../lib/db.js';
import { checkCommentRateLimit } from '../../../../lib/rateLimit.js';

// GET /api/comments/[token] — 取得 token 對應的車站資訊
export async function GET(request, { params }) {
  try {
    const { token } = await params;
    const db = getDB();

    const pick = db.prepare(
      'SELECT station_name, county, comment_used FROM station_picks WHERE token = ?'
    ).get(token);

    if (!pick) {
      return NextResponse.json({ error: '無效的 token' }, { status: 404 });
    }

    return NextResponse.json({
      station_name: pick.station_name,
      county: pick.county,
      comment_used: pick.comment_used === 1,
    });
  } catch (err) {
    console.error('[/api/comments/[token] GET]', err);
    return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 });
  }
}

// POST /api/comments/[token] — 送出留言
export async function POST(request, { params }) {
  try {
    const { token } = await params;
    const body = await request.json();
    const { content, honeypot } = body;

    // Honeypot 檢查（機器人過濾）
    if (honeypot) {
      return NextResponse.json({ error: '驗證失敗' }, { status: 400 });
    }

    // 字數驗證
    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: '請填寫留言內容' }, { status: 400 });
    }
    const trimmed = content.trim();
    if (trimmed.length < 10) {
      return NextResponse.json({ error: '留言至少需要 10 個字' }, { status: 400 });
    }
    if (trimmed.length > 500) {
      return NextResponse.json({ error: '留言不能超過 500 個字' }, { status: 400 });
    }

    // 取得客戶端 IP（與 /api/pick 相同邏輯，生產環境須經 Cloudflare 代理）
    const ip =
      request.headers.get('cf-connecting-ip') ||
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      '127.0.0.1';

    const { allowed } = checkCommentRateLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        { error: '你今天已經留言太多次了！請稍後再試。' },
        { status: 429 }
      );
    }

    const db = getDB();

    // 驗證 token 是否存在且未使用
    const pick = db.prepare(
      'SELECT station_name, county, comment_used FROM station_picks WHERE token = ?'
    ).get(token);

    if (!pick) {
      return NextResponse.json({ error: '無效的 token' }, { status: 404 });
    }
    if (pick.comment_used === 1) {
      return NextResponse.json({ error: '此連結已使用過' }, { status: 409 });
    }

    // 在同一個 transaction 內寫入留言並標記 token 已使用
    const insertComment = db.prepare(
      'INSERT INTO comments (token, station_name, county, content) VALUES (?, ?, ?, ?)'
    );
    const markUsed = db.prepare(
      'UPDATE station_picks SET comment_used = 1 WHERE token = ?'
    );

    db.transaction(() => {
      insertComment.run(token, pick.station_name, pick.county, trimmed);
      markUsed.run(token);
    })();

    return NextResponse.json({ success: true, message: '留言已送出！' });
  } catch (err) {
    console.error('[/api/comments/[token] POST]', err);
    return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 });
  }
}
