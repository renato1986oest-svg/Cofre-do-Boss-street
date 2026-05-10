import { promises as fs } from 'fs';
import path from 'path';

const DB_PATH = path.resolve(process.cwd(), 'cofre_data.json');

interface Beat {
  id: number;
  name: string;
  genre: string;
  bpm: number;
  audio_url: string;
  cover_url: string;
  created_at: string;
}

interface Composition {
  beat_id: number;
  content: string;
  updated_at: string;
}

interface DbSchema {
  beats: Beat[];
  compositions: Composition[];
}

async function readDb(): Promise<DbSchema> {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    const initial: DbSchema = { beats: [], compositions: [] };
    await fs.writeFile(DB_PATH, JSON.stringify(initial), 'utf-8');
    return initial;
  }
}

async function writeDb(data: DbSchema) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

export const db = {
  beats: {
    async findMany(filters: { search?: string; genre?: string }) {
      const data = await readDb();
      let results = data.beats;
      
      if (filters.search) {
        results = results.filter(b => b.name.toLowerCase().includes(filters.search!.toLowerCase()));
      }
      
      if (filters.genre && filters.genre !== 'All') {
        results = results.filter(b => b.genre === filters.genre);
      }
      
      return results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    },
    
    async create(beat: Omit<Beat, 'id' | 'created_at'>) {
      const data = await readDb();
      const newBeat: Beat = {
        ...beat,
        id: Date.now(),
        created_at: new Date().toISOString(),
      };
      data.beats.push(newBeat);
      await writeDb(data);
      return newBeat;
    },

    async delete(id: number) {
      const data = await readDb();
      data.beats = data.beats.filter(b => b.id !== id);
      data.compositions = data.compositions.filter(c => c.beat_id !== id);
      await writeDb(data);
    }
  },
  
  notes: {
    async get(beatId: number) {
      const data = await readDb();
      return data.compositions.find(c => c.beat_id === beatId);
    },
    
    async upsert(beatId: number, content: string) {
      const data = await readDb();
      const idx = data.compositions.findIndex(c => c.beat_id === beatId);
      
      if (idx > -1) {
        data.compositions[idx].content = content;
        data.compositions[idx].updated_at = new Date().toISOString();
      } else {
        data.compositions.push({
          beat_id: beatId,
          content,
          updated_at: new Date().toISOString()
        });
      }
      await writeDb(data);
    }
  }
};
