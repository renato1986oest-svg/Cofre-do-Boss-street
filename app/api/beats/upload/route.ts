import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { writeFile } from 'fs/promises';
import path from 'path';

// We need uuid but it's not installed. I'll use a simple random string for now.
function generateId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const genre = formData.get('genre') as string;
    const bpm = parseInt(formData.get('bpm') as string) || 0;
    const audioFile = formData.get('audio') as File;
    const coverFile = formData.get('cover') as File;

    if (!audioFile || !coverFile || !name || !genre) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const audioExt = path.extname(audioFile.name);
    const coverExt = path.extname(coverFile.name);
    
    const audioId = generateId();
    const coverId = generateId();

    const audioName = `${audioId}${audioExt}`;
    const coverName = `${coverId}${coverExt}`;

    const audioPath = path.join(process.cwd(), 'public', 'uploads', 'audio', audioName);
    const coverPath = path.join(process.cwd(), 'public', 'uploads', 'covers', coverName);

    const audioBuffer = Buffer.from(await audioFile.arrayBuffer());
    const coverBuffer = Buffer.from(await coverFile.arrayBuffer());

    await writeFile(audioPath, audioBuffer);
    await writeFile(coverPath, coverBuffer);

    const audioUrl = `/uploads/audio/${audioName}`;
    const coverUrl = `/uploads/covers/${coverName}`;

    const info = db.prepare(`
      INSERT INTO beats (name, genre, bpm, audio_url, cover_url)
      VALUES (?, ?, ?, ?, ?)
    `).run(name, genre, bpm, audioUrl, coverUrl);

    return NextResponse.json({ success: true, id: info.lastInsertRowid });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload beat' }, { status: 500 });
  }
}
