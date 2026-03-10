import { NextResponse } from 'next/server';
import { getDB } from '../../../lib/db.js';

const PAGE_SIZE = 10;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const station = searchParams.get('station') || '';
    const search = (searchParams.get('search') || '').slice(0, 100);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(parseInt(searchParams.get('limit') || String(PAGE_SIZE), 10), 50);
    const offset = (page - 1) * limit;

    const db = getDB();

    // 動態組合 WHERE 條件
    const conditions = [];
    const params = [];

    if (station) {
      conditions.push('c.station_name = ?');
      params.push(station);
    }
    if (search) {
      conditions.push('c.content LIKE ?');
      params.push(`%${search}%`);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const total = db.prepare(
      `SELECT COUNT(*) as count FROM comments c ${where}`
    ).get(...params).count;

    const comments = db.prepare(
      `SELECT c.id, c.station_name, c.county, c.content, c.created_at
       FROM comments c
       ${where}
       ORDER BY c.created_at DESC
       LIMIT ? OFFSET ?`
    ).all(...params, limit, offset);

    return NextResponse.json({
      comments,
      total,
      page,
      total_pages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error('[/api/comments GET]', err);
    return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 });
  }
}
