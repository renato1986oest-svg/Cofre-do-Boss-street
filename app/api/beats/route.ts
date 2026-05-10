import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const genre = searchParams.get('genre') || '';
    const minBpm = searchParams.get('minBpm');
    const maxBpm = searchParams.get('maxBpm');

    let query = 'SELECT * FROM beats WHERE name LIKE ?';
    const params: any[] = [`%${search}%`];

    if (genre && genre !== 'All') {
      query += ' AND genre = ?';
      params.push(genre);
    }

    if (minBpm) {
      query += ' AND bpm >= ?';
      params.push(parseInt(minBpm));
    }

    if (maxBpm) {
      query += ' AND bpm <= ?';
      params.push(parseInt(maxBpm));
    }

    query += ' ORDER BY created_at DESC';

    const beats = db.prepare(query).all(...params);
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

    // In a real app we'd also delete the files from public/uploads
    // For this app, we'll just remove the DB entry
    db.prepare('DELETE FROM beats WHERE id = ?').run(id);
    db.prepare('DELETE FROM compositions WHERE beat_id = ?').run(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete beat' }, { status: 500 });
  }
}
