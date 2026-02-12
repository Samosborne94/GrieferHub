/**
 * Agent Executor
 * Core autonomous execution loop (Ralph agent)
 */

import { PRD, PRDStory, PRDValidator } from './prd-validator';
import { ProgressTracker } from './progress-tracker';
import { PatternLogger } from './pattern-logger';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

export interface ExecutionContext {
  prdPath: string;
  schemaPath: string;
  progressPath: string;
  agentsPath: string;
  workingDir: string;
  tokenBudget: number;
}

export interface ExecutionResult {
  storyId: string;
  success: boolean;
  testsPass: boolean;
  commitHash?: string;
  error?: string;
  filesChanged: string[];
  duration: number;
}

export class AgentExecutor {
  private validator: PRDValidator;
  private progressTracker: ProgressTracker;
  private patternLogger: PatternLogger;
  private context: ExecutionContext;

  constructor(context: ExecutionContext) {
    this.context = context;
    this.validator = new PRDValidator();
    this.progressTracker = new ProgressTracker(context.progressPath);
    this.patternLogger = new PatternLogger(context.agentsPath);
  }

  /**
   * Initialize the agent
   */
  async initialize(): Promise<void> {
    console.log('🤖 Initializing Ralph Agent...\n');

    // Load schema
    await this.validator.loadSchema(this.context.schemaPath);

    // Validate PRD
    const validation = await this.validator.fullValidation(this.context.prdPath);
    if (!validation.valid) {
      throw new Error(`PRD validation failed:\n${validation.errors.join('\n')}`);
    }

    // Initialize progress tracker
    await this.progressTracker.initialize();

    // Log initialization
    await this.progressTracker.log('Agent initialized successfully', 'info');

    console.log('✅ Agent initialized\n');
  }

  /**
   * Load PRD
   */
  async loadPRD(): Promise<PRD> {
    const content = await fs.readFile(this.context.prdPath, 'utf-8');
    return JSON.parse(content) as PRD;
  }

  /**
   * Save PRD
   */
  async savePRD(prd: PRD): Promise<void> {
    prd.meta.updated = new Date().toISOString();
    await fs.writeFile(
      this.context.prdPath,
      JSON.stringify(prd, null, 2),
      'utf-8'
    );
  }

  /**
   * Select next story to implement
   */
  selectNextStory(prd: PRD): PRDStory | null {
    const incomplete = prd.stories.filter(s => !s.passes);

    if (incomplete.length === 0) {
      return null;
    }

    // Filter by dependencies
    const ready = incomplete.filter(story => {
      const deps = story.dependencies || [];
      return deps.every(depId => {
        const depStory = prd.stories.find(s => s.id === depId);
        return depStory?.passes === true;
      });
    });

    if (ready.length === 0) {
      throw new Error('No stories ready (unmet dependencies or circular dependencies)');
    }

    // Sort by priority
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    ready.sort((a, b) => {
      const aPriority = priorityOrder[a.priority || 'medium'];
      const bPriority = priorityOrder[b.priority || 'medium'];
      return aPriority - bPriority;
    });

    return ready[0];
  }

  /**
   * Run tests
   */
  async runTests(prd: PRD): Promise<{ pass: boolean; output: string }> {
    const testCommand = prd.config?.testCommand || 'npm test';

    try {
      const { stdout, stderr } = await execAsync(testCommand, {
        cwd: this.context.workingDir,
        maxBuffer: 10 * 1024 * 1024 // 10MB buffer
      });

      return {
        pass: true,
        output: stdout + stderr
      };
    } catch (error: any) {
      return {
        pass: false,
        output: error.stdout + error.stderr
      };
    }
  }

  /**
   * Build project
   */
  async build(prd: PRD): Promise<{ success: boolean; output: string }> {
    const buildCommand = prd.config?.buildCommand || 'npm run build';

    try {
      const { stdout, stderr } = await execAsync(buildCommand, {
        cwd: this.context.workingDir,
        maxBuffer: 10 * 1024 * 1024
      });

      return {
        success: true,
        output: stdout + stderr
      };
    } catch (error: any) {
      return {
        success: false,
        output: error.stdout + error.stderr
      };
    }
  }

  /**
   * Lint code
   */
  async lint(prd: PRD): Promise<{ success: boolean; output: string }> {
    const lintCommand = prd.config?.lintCommand || 'npm run lint';

    try {
      const { stdout, stderr } = await execAsync(lintCommand, {
        cwd: this.context.workingDir
      });

      return {
        success: true,
        output: stdout + stderr
      };
    } catch (error: any) {
      return {
        success: false,
        output: error.stdout + error.stderr
      };
    }
  }

  /**
   * Get changed files
   */
  async getChangedFiles(): Promise<string[]> {
    try {
      const { stdout } = await execAsync('git diff --name-only HEAD', {
        cwd: this.context.workingDir
      });

      return stdout.trim().split('\n').filter(f => f.length > 0);
    } catch (error) {
      return [];
    }
  }

  /**
   * Commit changes
   */
  async commit(story: PRDStory): Promise<string | null> {
    try {
      // Add all changes
      await execAsync('git add .', {
        cwd: this.context.workingDir
      });

      // Create commit message
      const message = `${story.id}: ${story.title}\n\n${story.description}\n\nCo-Authored-By: Ralph Agent <ralph@grieferhub.com>`;

      // Commit
      await execAsync(`git commit -m "${message.replace(/"/g, '\\"')}"`, {
        cwd: this.context.workingDir
      });

      // Get commit hash
      const { stdout } = await execAsync('git rev-parse HEAD', {
        cwd: this.context.workingDir
      });

      return stdout.trim();
    } catch (error) {
      console.error('Failed to commit:', error);
      return null;
    }
  }

  /**
   * Execute a single story
   * NOTE: This is a placeholder - actual implementation would invoke Claude Code
   */
  async executeStory(story: PRDStory): Promise<ExecutionResult> {
    const startTime = Date.now();

    await this.progressTracker.log(`Starting story ${story.id}: ${story.title}`, 'info');

    console.log(`\n📝 Story: ${story.id} - ${story.title}`);
    console.log(`Description: ${story.description}`);
    console.log(`Acceptance Criteria:`);
    story.acceptance.forEach((ac, i) => console.log(`  ${i + 1}. ${ac}`));
    console.log('');

    // TODO: Here you would integrate with Claude Code API
    // For now, this is a placeholder that assumes manual implementation
    console.log('⏸️  Waiting for manual implementation...');
    console.log('   (In production, this would invoke Claude Code autonomously)');
    console.log('   Press Ctrl+C to abort, or implement the story manually and run tests.');

    // Simulate implementation delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Get changed files
    const filesChanged = await this.getChangedFiles();

    // Run tests (this is where validation happens)
    const prd = await this.loadPRD();
    const testResult = await this.runTests(prd);

    const result: ExecutionResult = {
      storyId: story.id,
      success: testResult.pass,
      testsPass: testResult.pass,
      filesChanged,
      duration: Date.now() - startTime
    };

    if (testResult.pass) {
      // Commit if configured
      if (prd.config?.autoCommit) {
        const commitHash = await this.commit(story);
        if (commitHash) {
          result.commitHash = commitHash;
          await this.progressTracker.log(`Committed ${story.id} (${commitHash})`, 'success');
        }
      }

      // Log success pattern
      await this.patternLogger.logSuccess(story, filesChanged);
    } else {
      result.error = testResult.output;
      await this.progressTracker.log(`Tests failed for ${story.id}`, 'error');
      await this.patternLogger.logFailure(story, testResult.output);
    }

    return result;
  }

  /**
   * Main execution loop
   */
  async run(): Promise<void> {
    console.log('🚀 Starting Ralph Agent execution loop\n');

    let iteration = 0;
    let totalStories = 0;
    let completedStories = 0;

    while (true) {
      iteration++;

      // Load current PRD state
      const prd = await this.loadPRD();
      totalStories = prd.stories.length;
      completedStories = prd.stories.filter(s => s.passes).length;

      console.log(`\n${'='.repeat(60)}`);
      console.log(`Iteration ${iteration} | Progress: ${completedStories}/${totalStories} stories`);
      console.log('='.repeat(60));

      // Select next story
      const story = this.selectNextStory(prd);

      if (!story) {
        console.log('\n🎉 All stories complete!');
        await this.progressTracker.log('All stories completed successfully', 'success');
        break;
      }

      // Update story start time
      story.startedAt = new Date().toISOString();
      await this.savePRD(prd);

      // Execute story
      const result = await this.executeStory(story);

      // Update PRD
      const updatedPRD = await this.loadPRD();
      const storyToUpdate = updatedPRD.stories.find(s => s.id === story.id);

      if (storyToUpdate) {
        storyToUpdate.passes = result.testsPass;
        storyToUpdate.implemented = result.success;
        storyToUpdate.files = result.filesChanged;

        if (result.success) {
          storyToUpdate.completedAt = new Date().toISOString();
          if (result.commitHash) {
            storyToUpdate.commits = [...(storyToUpdate.commits || []), result.commitHash];
          }
        } else if (result.error) {
          storyToUpdate.errors = [
            ...(storyToUpdate.errors || []),
            {
              message: result.error,
              timestamp: new Date().toISOString(),
              resolved: false
            }
          ];
        }

        await this.savePRD(updatedPRD);
      }

      // Check if we should halt on failure
      if (!result.success && prd.config?.haltOnFailure) {
        console.log('\n⛔ Halting on failure (haltOnFailure=true)');
        await this.progressTracker.log('Execution halted on failure', 'error');
        break;
      }

      // Brief pause between iterations
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n✨ Ralph Agent execution complete');
  }
}
