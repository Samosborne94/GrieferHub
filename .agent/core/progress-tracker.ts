/**
 * Progress Tracker
 * Long-term memory system for agent (progress.txt)
 */

import fs from 'fs/promises';
import path from 'path';

export type LogLevel = 'info' | 'success' | 'warning' | 'error' | 'debug';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  metadata?: Record<string, any>;
}

export class ProgressTracker {
  private filePath: string;
  private buffer: LogEntry[] = [];
  private flushInterval: NodeJS.Timeout | null = null;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  /**
   * Initialize progress tracker
   */
  async initialize(): Promise<void> {
    try {
      await fs.access(this.filePath);
    } catch {
      // File doesn't exist, create it
      const header = [
        '# Ralph Agent Progress Log',
        `# Started: ${new Date().toISOString()}`,
        '# This file tracks the agent\'s execution history and learnings',
        '',
        '---',
        ''
      ].join('\n');

      await fs.writeFile(this.filePath, header, 'utf-8');
    }

    // Start auto-flush
    this.flushInterval = setInterval(() => this.flush(), 5000);
  }

  /**
   * Log a message
   */
  async log(message: string, level: LogLevel = 'info', metadata?: Record<string, any>): Promise<void> {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      metadata
    };

    this.buffer.push(entry);

    // Console output with colors
    const icon = this.getIcon(level);
    const color = this.getColor(level);
    console.log(`${icon} ${color}${message}\x1b[0m`);

    // Flush if buffer is large
    if (this.buffer.length >= 10) {
      await this.flush();
    }
  }

  /**
   * Get icon for log level
   */
  private getIcon(level: LogLevel): string {
    const icons: Record<LogLevel, string> = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌',
      debug: '🔍'
    };
    return icons[level];
  }

  /**
   * Get ANSI color for log level
   */
  private getColor(level: LogLevel): string {
    const colors: Record<LogLevel, string> = {
      info: '\x1b[36m',    // Cyan
      success: '\x1b[32m', // Green
      warning: '\x1b[33m', // Yellow
      error: '\x1b[31m',   // Red
      debug: '\x1b[90m'    // Gray
    };
    return colors[level];
  }

  /**
   * Flush buffer to file
   */
  async flush(): Promise<void> {
    if (this.buffer.length === 0) {
      return;
    }

    const entries = this.buffer.splice(0);
    const lines = entries.map(entry => {
      const metadata = entry.metadata ? ` | ${JSON.stringify(entry.metadata)}` : '';
      return `[${entry.timestamp}] [${entry.level.toUpperCase()}] ${entry.message}${metadata}`;
    });

    await fs.appendFile(this.filePath, lines.join('\n') + '\n', 'utf-8');
  }

  /**
   * Log story start
   */
  async logStoryStart(storyId: string, title: string): Promise<void> {
    await this.log(`\n${'='.repeat(60)}\nStarting Story: ${storyId} - ${title}\n${'='.repeat(60)}`, 'info');
  }

  /**
   * Log story completion
   */
  async logStoryComplete(storyId: string, duration: number, commitHash?: string): Promise<void> {
    const durationMin = (duration / 1000 / 60).toFixed(2);
    const commit = commitHash ? ` (${commitHash.substring(0, 7)})` : '';
    await this.log(`Story ${storyId} completed in ${durationMin}m${commit}`, 'success');
  }

  /**
   * Log story failure
   */
  async logStoryFailure(storyId: string, error: string, retryCount: number): Promise<void> {
    await this.log(`Story ${storyId} failed (retry ${retryCount})`, 'error', { error });
  }

  /**
   * Log learning
   */
  async logLearning(learning: string): Promise<void> {
    await this.log(`💡 Learning: ${learning}`, 'info');
  }

  /**
   * Read entire progress log
   */
  async read(): Promise<string> {
    try {
      return await fs.readFile(this.filePath, 'utf-8');
    } catch {
      return '';
    }
  }

  /**
   * Get recent entries
   */
  async getRecent(count: number = 50): Promise<LogEntry[]> {
    const content = await this.read();
    const lines = content.split('\n').filter(line => line.startsWith('['));

    const entries: LogEntry[] = [];
    for (const line of lines.slice(-count)) {
      const match = line.match(/\[([^\]]+)\] \[([^\]]+)\] (.+)/);
      if (match) {
        const [, timestamp, level, message] = match;
        entries.push({
          timestamp,
          level: level.toLowerCase() as LogLevel,
          message
        });
      }
    }

    return entries;
  }

  /**
   * Search logs
   */
  async search(query: string): Promise<LogEntry[]> {
    const content = await this.read();
    const lines = content.split('\n').filter(line =>
      line.toLowerCase().includes(query.toLowerCase())
    );

    const entries: LogEntry[] = [];
    for (const line of lines) {
      const match = line.match(/\[([^\]]+)\] \[([^\]]+)\] (.+)/);
      if (match) {
        const [, timestamp, level, message] = match;
        entries.push({
          timestamp,
          level: level.toLowerCase() as LogLevel,
          message
        });
      }
    }

    return entries;
  }

  /**
   * Get statistics
   */
  async getStats(): Promise<{
    total: number;
    byLevel: Record<LogLevel, number>;
    firstEntry?: string;
    lastEntry?: string;
  }> {
    const entries = await this.getRecent(1000);

    const stats = {
      total: entries.length,
      byLevel: {
        info: 0,
        success: 0,
        warning: 0,
        error: 0,
        debug: 0
      } as Record<LogLevel, number>,
      firstEntry: entries[0]?.timestamp,
      lastEntry: entries[entries.length - 1]?.timestamp
    };

    for (const entry of entries) {
      stats.byLevel[entry.level]++;
    }

    return stats;
  }

  /**
   * Cleanup
   */
  async cleanup(): Promise<void> {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    await this.flush();
  }
}
