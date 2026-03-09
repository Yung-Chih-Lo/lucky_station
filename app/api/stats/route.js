import { NextResponse } from 'next/server';
import { getDB } from '../../../lib/db.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 100);

    const db = getDB();
    const rankings = db.prepare(`
      SELECT station_name, county, COUNT(*) as pick_count
      FROM station_picks
      GROUP BY station_name, county
      ORDER BY pick_count DESC, station_name ASC
      LIMIT ?
    `).all(limit);

    return NextResponse.json({ rankings });
  } catch (err) {
    console.error('[/api/stats]', err);
    return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 });
  }
}
