/**
 * PRD Validator
 * Validates PRD JSON against schema and provides helpful error messages
 */

import Ajv, { ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';
import fs from 'fs/promises';
import path from 'path';

export interface PRDMeta {
  version: string;
  project: string;
  created: string;
  updated?: string;
  owner?: string;
}

export interface PRDStory {
  id: string;
  title: string;
  description: string;
  acceptance: string[];
  dependencies?: string[];
  priority?: 'critical' | 'high' | 'medium' | 'low';
  estimatedHours?: number;
  tags?: string[];
  passes: boolean;
  implemented?: boolean;
  verified?: boolean;
  files?: string[];
  commits?: string[];
  startedAt?: string;
  completedAt?: string;
  errors?: Array<{
    message: string;
    timestamp: string;
    resolved?: boolean;
  }>;
}

export interface PRDConfig {
  testCommand?: string;
  buildCommand?: string;
  lintCommand?: string;
  maxRetries?: number;
  autoCommit?: boolean;
  tokenBudget?: number;
  haltOnFailure?: boolean;
}

export interface PRD {
  meta: PRDMeta;
  stories: PRDStory[];
  config?: PRDConfig;
}

export class PRDValidator {
  private ajv: Ajv;
  private validator: ValidateFunction | null = null;

  constructor() {
    this.ajv = new Ajv({ allErrors: true, verbose: true });
    addFormats(this.ajv);
  }

  /**
   * Load and compile schema
   */
  async loadSchema(schemaPath: string): Promise<void> {
    try {
      const schemaContent = await fs.readFile(schemaPath, 'utf-8');
      const schema = JSON.parse(schemaContent);
      this.validator = this.ajv.compile(schema);
    } catch (error) {
      throw new Error(`Failed to load schema: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Validate PRD data
   */
  validate(prd: unknown): { valid: boolean; errors: string[] } {
    if (!this.validator) {
      throw new Error('Schema not loaded. Call loadSchema() first.');
    }

    const valid = this.validator(prd);
    const errors: string[] = [];

    if (!valid && this.validator.errors) {
      for (const error of this.validator.errors) {
        const path = error.instancePath || 'root';
        const message = error.message || 'unknown error';
        errors.push(`${path}: ${message}`);
      }
    }

    return { valid: valid as boolean, errors };
  }

  /**
   * Validate PRD file
   */
  async validateFile(prdPath: string): Promise<{ valid: boolean; errors: string[]; prd?: PRD }> {
    try {
      const content = await fs.readFile(prdPath, 'utf-8');
      const prd = JSON.parse(content) as PRD;

      const result = this.validate(prd);

      if (result.valid) {
        return { valid: true, errors: [], prd };
      }

      return { valid: false, errors: result.errors };
    } catch (error) {
      return {
        valid: false,
        errors: [`Failed to read/parse PRD file: ${error instanceof Error ? error.message : String(error)}`]
      };
    }
  }

  /**
   * Check for circular dependencies
   */
  checkCircularDependencies(stories: PRDStory[]): string[] {
    const errors: string[] = [];
    const graph = new Map<string, Set<string>>();

    // Build dependency graph
    for (const story of stories) {
      graph.set(story.id, new Set(story.dependencies || []));
    }

    // DFS to detect cycles
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const hasCycle = (storyId: string, path: string[]): boolean => {
      if (recursionStack.has(storyId)) {
        errors.push(`Circular dependency detected: ${[...path, storyId].join(' -> ')}`);
        return true;
      }

      if (visited.has(storyId)) {
        return false;
      }

      visited.add(storyId);
      recursionStack.add(storyId);

      const dependencies = graph.get(storyId) || new Set();
      for (const dep of dependencies) {
        if (hasCycle(dep, [...path, storyId])) {
          return true;
        }
      }

      recursionStack.delete(storyId);
      return false;
    };

    for (const story of stories) {
      if (!visited.has(story.id)) {
        hasCycle(story.id, []);
      }
    }

    return errors;
  }

  /**
   * Check for missing dependencies
   */
  checkMissingDependencies(stories: PRDStory[]): string[] {
    const errors: string[] = [];
    const storyIds = new Set(stories.map(s => s.id));

    for (const story of stories) {
      for (const dep of story.dependencies || []) {
        if (!storyIds.has(dep)) {
          errors.push(`Story ${story.id} depends on non-existent story ${dep}`);
        }
      }
    }

    return errors;
  }

  /**
   * Full validation with dependency checks
   */
  async fullValidation(prdPath: string): Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
    prd?: PRD;
  }> {
    const result = await this.validateFile(prdPath);
    const warnings: string[] = [];

    if (!result.valid || !result.prd) {
      return { valid: false, errors: result.errors, warnings };
    }

    // Check for missing dependencies
    const missingDeps = this.checkMissingDependencies(result.prd.stories);
    if (missingDeps.length > 0) {
      result.errors.push(...missingDeps);
      result.valid = false;
    }

    // Check for circular dependencies
    const circularDeps = this.checkCircularDependencies(result.prd.stories);
    if (circularDeps.length > 0) {
      result.errors.push(...circularDeps);
      result.valid = false;
    }

    // Warnings for best practices
    for (const story of result.prd.stories) {
      if (!story.priority) {
        warnings.push(`Story ${story.id} has no priority set`);
      }
      if (!story.estimatedHours) {
        warnings.push(`Story ${story.id} has no time estimate`);
      }
      if (story.acceptance.length === 0) {
        warnings.push(`Story ${story.id} has no acceptance criteria`);
      }
    }

    return { valid: result.valid, errors: result.errors, warnings, prd: result.prd };
  }
}

/**
 * CLI usage
 */
export async function validatePRDCLI(prdPath: string, schemaPath: string): Promise<void> {
  const validator = new PRDValidator();

  console.log('Loading schema...');
  await validator.loadSchema(schemaPath);

  console.log('Validating PRD...');
  const result = await validator.fullValidation(prdPath);

  if (result.valid) {
    console.log('✅ PRD is valid!');

    if (result.warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      result.warnings.forEach(w => console.log(`  - ${w}`));
    }

    if (result.prd) {
      console.log(`\n📊 Stats:`);
      console.log(`  - Total stories: ${result.prd.stories.length}`);
      console.log(`  - Completed: ${result.prd.stories.filter(s => s.passes).length}`);
      console.log(`  - Remaining: ${result.prd.stories.filter(s => !s.passes).length}`);
    }
  } else {
    console.error('❌ PRD validation failed!\n');
    console.error('Errors:');
    result.errors.forEach(e => console.error(`  - ${e}`));
    process.exit(1);
  }
}
