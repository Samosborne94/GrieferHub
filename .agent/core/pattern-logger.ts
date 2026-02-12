/**
 * Pattern Logger
 * Learns from successes and failures, building "Prompt DNA" (AGENTS.md)
 */

import fs from 'fs/promises';
import { PRDStory } from './prd-validator';

export interface Pattern {
  id: string;
  type: 'success' | 'failure' | 'rule';
  story?: string;
  description: string;
  filesAffected?: string[];
  solution?: string;
  timestamp: string;
  tags?: string[];
}

export class PatternLogger {
  private filePath: string;
  private patterns: Pattern[] = [];

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  /**
   * Initialize pattern logger
   */
  async initialize(): Promise<void> {
    try {
      const content = await fs.readFile(this.filePath, 'utf-8');
      this.parsePatterns(content);
    } catch {
      // File doesn't exist, create it
      const header = [
        '# Agent Patterns & Learnings',
        '',
        'This file contains the accumulated knowledge and patterns discovered by the Ralph agent.',
        'Each pattern represents a reusable solution or important lesson learned during development.',
        '',
        '## Pattern Types',
        '',
        '- **Success Patterns**: Proven solutions that worked well',
        '- **Failure Patterns**: Common mistakes to avoid',
        '- **Rules**: General principles and best practices',
        '',
        '---',
        ''
      ].join('\n');

      await fs.writeFile(this.filePath, header, 'utf-8');
    }
  }

  /**
   * Parse existing patterns from markdown
   */
  private parsePatterns(content: string): void {
    // Simple parser - could be enhanced
    const sections = content.split('## ').slice(1);

    for (const section of sections) {
      const lines = section.split('\n');
      const titleMatch = lines[0].match(/\[([A-Z]+-[0-9]+)\] (.+)/);

      if (titleMatch) {
        const [, id, description] = titleMatch;

        this.patterns.push({
          id,
          type: 'success', // Default
          description,
          timestamp: new Date().toISOString()
        });
      }
    }
  }

  /**
   * Log successful implementation
   */
  async logSuccess(story: PRDStory, filesAffected: string[]): Promise<void> {
    const pattern: Pattern = {
      id: story.id,
      type: 'success',
      story: story.title,
      description: this.extractSuccessPattern(story, filesAffected),
      filesAffected,
      timestamp: new Date().toISOString(),
      tags: story.tags || []
    };

    await this.addPattern(pattern);
  }

  /**
   * Log failure for learning
   */
  async logFailure(story: PRDStory, error: string): Promise<void> {
    const pattern: Pattern = {
      id: `${story.id}-failure`,
      type: 'failure',
      story: story.title,
      description: this.extractFailurePattern(story, error),
      solution: 'To be determined',
      timestamp: new Date().toISOString(),
      tags: [...(story.tags || []), 'failure']
    };

    await this.addPattern(pattern);
  }

  /**
   * Log a general rule or principle
   */
  async logRule(rule: string, tags?: string[]): Promise<void> {
    const pattern: Pattern = {
      id: `RULE-${Date.now()}`,
      type: 'rule',
      description: rule,
      timestamp: new Date().toISOString(),
      tags
    };

    await this.addPattern(pattern);
  }

  /**
   * Extract success pattern from story
   */
  private extractSuccessPattern(story: PRDStory, files: string[]): string {
    const parts: string[] = [];

    parts.push(`Successfully implemented: ${story.title}`);

    if (files.length > 0) {
      const fileTypes = this.categorizeFiles(files);
      parts.push(`\n\n**Files Modified**: ${files.length} file(s)`);

      if (fileTypes.components.length > 0) {
        parts.push(`- Components: ${fileTypes.components.join(', ')}`);
      }
      if (fileTypes.api.length > 0) {
        parts.push(`- API routes: ${fileTypes.api.join(', ')}`);
      }
      if (fileTypes.types.length > 0) {
        parts.push(`- Types: ${fileTypes.types.join(', ')}`);
      }
      if (fileTypes.other.length > 0) {
        parts.push(`- Other: ${fileTypes.other.join(', ')}`);
      }
    }

    if (story.acceptance.length > 0) {
      parts.push('\n\n**Acceptance Criteria Met**:');
      story.acceptance.forEach((ac, i) => {
        parts.push(`${i + 1}. ${ac}`);
      });
    }

    return parts.join('\n');
  }

  /**
   * Extract failure pattern
   */
  private extractFailurePattern(story: PRDStory, error: string): string {
    const errorSummary = error.length > 200 ? error.substring(0, 200) + '...' : error;

    return [
      `Failed to implement: ${story.title}`,
      '',
      '**Error Summary**:',
      '```',
      errorSummary,
      '```',
      '',
      '**Next Steps**:',
      '- Review error logs',
      '- Check dependencies',
      '- Verify implementation approach'
    ].join('\n');
  }

  /**
   * Categorize files by type
   */
  private categorizeFiles(files: string[]): {
    components: string[];
    api: string[];
    types: string[];
    other: string[];
  } {
    const result = {
      components: [] as string[],
      api: [] as string[],
      types: [] as string[],
      other: [] as string[]
    };

    for (const file of files) {
      if (file.includes('/components/') || file.endsWith('.tsx') || file.endsWith('.jsx')) {
        result.components.push(file);
      } else if (file.includes('/api/')) {
        result.api.push(file);
      } else if (file.includes('/types/') || file.endsWith('.d.ts')) {
        result.types.push(file);
      } else {
        result.other.push(file);
      }
    }

    return result;
  }

  /**
   * Add pattern to file
   */
  private async addPattern(pattern: Pattern): Promise<void> {
    this.patterns.push(pattern);

    const section = this.formatPattern(pattern);

    await fs.appendFile(this.filePath, '\n' + section + '\n', 'utf-8');
  }

  /**
   * Format pattern as markdown
   */
  private formatPattern(pattern: Pattern): string {
    const icon = pattern.type === 'success' ? '✅' : pattern.type === 'failure' ? '❌' : '📋';
    const title = pattern.story ? `[${pattern.id}] ${pattern.story}` : pattern.id;

    const lines: string[] = [
      `## ${icon} ${title}`,
      '',
      `**Type**: ${pattern.type}`,
      `**Date**: ${new Date(pattern.timestamp).toLocaleString()}`,
    ];

    if (pattern.tags && pattern.tags.length > 0) {
      lines.push(`**Tags**: ${pattern.tags.join(', ')}`);
    }

    lines.push('');
    lines.push(pattern.description);

    if (pattern.solution) {
      lines.push('');
      lines.push(`**Solution**: ${pattern.solution}`);
    }

    lines.push('');
    lines.push('---');

    return lines.join('\n');
  }

  /**
   * Get all patterns
   */
  getPatterns(): Pattern[] {
    return this.patterns;
  }

  /**
   * Get patterns by type
   */
  getPatternsByType(type: 'success' | 'failure' | 'rule'): Pattern[] {
    return this.patterns.filter(p => p.type === type);
  }

  /**
   * Get patterns by tag
   */
  getPatternsByTag(tag: string): Pattern[] {
    return this.patterns.filter(p => p.tags?.includes(tag));
  }

  /**
   * Search patterns
   */
  searchPatterns(query: string): Pattern[] {
    const lowerQuery = query.toLowerCase();
    return this.patterns.filter(p =>
      p.description.toLowerCase().includes(lowerQuery) ||
      p.story?.toLowerCase().includes(lowerQuery) ||
      p.tags?.some(t => t.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * Generate summary statistics
   */
  getSummary(): {
    total: number;
    successes: number;
    failures: number;
    rules: number;
    recentPatterns: Pattern[];
  } {
    const successes = this.getPatternsByType('success');
    const failures = this.getPatternsByType('failure');
    const rules = this.getPatternsByType('rule');

    return {
      total: this.patterns.length,
      successes: successes.length,
      failures: failures.length,
      rules: rules.length,
      recentPatterns: this.patterns.slice(-5)
    };
  }

  /**
   * Export patterns as JSON
   */
  async exportJSON(outputPath: string): Promise<void> {
    await fs.writeFile(
      outputPath,
      JSON.stringify(this.patterns, null, 2),
      'utf-8'
    );
  }
}
