import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const genre = searchParams.get('genre') || '';

    const beats = await db.beats.findMany({ search, genre });
    return NextResponse.json(beats);
  } catch (error) {
    console.error('Error fetching beats:', error);
    return NextResponse.json({ error: 'Failed to fetch beats' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    await db.beats.delete(parseInt(id.toString()));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete beat' }, { status: 500 });
  }
}
