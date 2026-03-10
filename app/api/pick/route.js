import { NextResponse } from 'next/server';
import { getDB } from '../../../lib/db.js';
import { checkRateLimit } from '../../../lib/rateLimit.js';
import stationsData from '../../../constants/stations.json';

export async function POST(request) {
  try {
    const body = await request.json();
    const { station_name, county } = body;

    if (!station_name || !county) {
      return NextResponse.json({ error: '缺少必要欄位' }, { status: 400 });
    }

    // 白名單驗證：縣市與車站名稱必須存在於靜態資料中
    if (!stationsData[county]) {
      return NextResponse.json({ error: '無效的縣市' }, { status: 400 });
    }
    if (!stationsData[county].includes(station_name)) {
      return NextResponse.json({ error: '無效的車站名稱' }, { status: 400 });
    }

    // 取得客戶端 IP（Cloudflare 提供的 CF-Connecting-IP 不可被客戶端偽造）
    const ip =
      request.headers.get('cf-connecting-ip') ||
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      '127.0.0.1';

    // 頻率限制檢查
    const { allowed } = checkRateLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        { error: '你今天已經抽太多次囉！請稍後再試。' },
        { status: 429 }
      );
    }

    // 產生唯一 token
    const token = crypto.randomUUID();

    const db = getDB();
    db.prepare(
      'INSERT INTO station_picks (station_name, county, token) VALUES (?, ?, ?)'
    ).run(station_name, county, token);

    return NextResponse.json({ token, station_name, county });
  } catch (err) {
    console.error('[/api/pick]', err);
    return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 });
  }
}
