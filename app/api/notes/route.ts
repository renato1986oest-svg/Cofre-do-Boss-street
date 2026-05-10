import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const beatId = searchParams.get('beatId');

  if (!beatId) return NextResponse.json({ error: 'Missing beatId' }, { status: 400 });

  const note = db.prepare('SELECT * FROM compositions WHERE beat_id = ?').get(beatId) as any;
  return NextResponse.json(note || { content: '' });
}

export async function POST(request: Request) {
  try {
    const { beatId, content } = await request.json();

    if (!beatId) return NextResponse.json({ error: 'Missing beatId' }, { status: 400 });

    const existing = db.prepare('SELECT id FROM compositions WHERE beat_id = ?').get(beatId);

    if (existing) {
      db.prepare('UPDATE compositions SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE beat_id = ?')
        .run(content, beatId);
    } else {
      db.prepare('INSERT INTO compositions (beat_id, content) VALUES (?, ?)')
        .run(beatId, content);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save note' }, { status: 500 });
  }
}
