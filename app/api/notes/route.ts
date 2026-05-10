import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const beatId = searchParams.get('beatId');

  if (!beatId) return NextResponse.json({ error: 'Missing beatId' }, { status: 400 });

  const note = await db.notes.get(parseInt(beatId));
  return NextResponse.json(note || { content: '' });
}

export async function POST(request: Request) {
  try {
    const { beatId, content } = await request.json();

    if (!beatId) return NextResponse.json({ error: 'Missing beatId' }, { status: 400 });

    await db.notes.upsert(parseInt(beatId), content);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save note' }, { status: 500 });
  }
}
