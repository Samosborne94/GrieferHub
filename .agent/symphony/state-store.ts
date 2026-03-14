import fs from 'fs/promises';
import path from 'path';
import { PersistedAgentSession, SessionStateStore } from './types';

interface PersistedStateFile {
  version: 1;
  updatedAt: string;
  sessions: PersistedAgentSession[];
}

export class JsonSessionStateStore implements SessionStateStore {
  constructor(private readonly filePath: string) {}

  async load(): Promise<PersistedAgentSession[]> {
    try {
      const contents = await fs.readFile(this.filePath, 'utf-8');
      const parsed = JSON.parse(contents) as PersistedStateFile;
      return parsed.sessions.map(session => ({
        ...session,
        status: session.status === 'running' ? 'idle' : session.status
      }));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return [];
      }

      throw error;
    }
  }

  async save(sessions: PersistedAgentSession[]): Promise<void> {
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });

    const payload: PersistedStateFile = {
      version: 1,
      updatedAt: new Date().toISOString(),
      sessions
    };

    await fs.writeFile(this.filePath, JSON.stringify(payload, null, 2), 'utf-8');
  }
}
