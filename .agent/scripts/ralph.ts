#!/usr/bin/env node
/**
 * Ralph - Autonomous PRD Execution Agent
 *
 * Usage:
 *   npm run ralph                    # Run with default prd.json
 *   npm run ralph -- --prd custom.json
 *   npm run ralph -- --validate      # Only validate PRD
 *   npm run ralph -- --init          # Initialize new PRD
 */

import { AgentExecutor, ExecutionContext } from '../core/agent-executor';
import { PRDValidator } from '../core/prd-validator';
import path from 'path';
import fs from 'fs/promises';

interface CLIOptions {
  prd?: string;
  validate?: boolean;
  init?: boolean;
  help?: boolean;
}

const DEFAULT_PRD = path.join(process.cwd(), 'prd.json');
const SCHEMA_PATH = path.join(__dirname, '..', 'schemas', 'prd-schema.json');
const PROGRESS_PATH = path.join(process.cwd(), '.agent', 'memory', 'progress.txt');
const AGENTS_PATH = path.join(process.cwd(), '.agent', 'memory', 'AGENTS.md');

/**
 * Parse CLI arguments
 */
function parseArgs(): CLIOptions {
  const args = process.argv.slice(2);
  const options: CLIOptions = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    switch (arg) {
      case '--prd':
        options.prd = args[++i];
        break;
      case '--validate':
        options.validate = true;
        break;
      case '--init':
        options.init = true;
        break;
      case '--help':
      case '-h':
        options.help = true;
        break;
    }
  }

  return options;
}

/**
 * Display help
 */
function showHelp(): void {
  console.log(`
🤖 Ralph - Autonomous PRD Execution Agent

USAGE:
  ralph [OPTIONS]

OPTIONS:
  --prd <path>       Path to PRD JSON file (default: prd.json)
  --validate         Validate PRD without executing
  --init             Initialize new PRD template
  --help, -h         Show this help message

EXAMPLES:
  ralph                          # Run with default prd.json
  ralph --prd custom.json        # Run with custom PRD
  ralph --validate               # Validate prd.json
  ralph --init                   # Create new prd.json template

WORKFLOW:
  1. Write your PRD in plain text
  2. Convert to prd.json (or use --init)
  3. Run ralph to execute autonomously
  4. Review progress.txt and AGENTS.md

FILES:
  prd.json                       Product requirements
  .agent/memory/progress.txt     Execution log
  .agent/memory/AGENTS.md        Learned patterns

For more info, visit: https://github.com/grieferhub/ralph
  `);
}

/**
 * Initialize new PRD template
 */
async function initializePRD(prdPath: string): Promise<void> {
  const template = {
    meta: {
      version: '1.0.0',
      project: 'GrieferHub',
      created: new Date().toISOString(),
      owner: 'Development Team'
    },
    stories: [
      {
        id: 'GH-001',
        title: 'Example Story',
        description: 'This is an example story to demonstrate the PRD structure',
        acceptance: [
          'Acceptance criterion 1',
          'Acceptance criterion 2',
          'All tests pass'
        ],
        dependencies: [],
        priority: 'medium',
        estimatedHours: 2,
        tags: ['example'],
        passes: false,
        implemented: false,
        verified: false
      }
    ],
    config: {
      testCommand: 'npm test',
      buildCommand: 'npm run build',
      lintCommand: 'npm run lint',
      maxRetries: 3,
      autoCommit: true,
      tokenBudget: 150000,
      haltOnFailure: false
    }
  };

  await fs.writeFile(prdPath, JSON.stringify(template, null, 2), 'utf-8');

  console.log(`✅ Created PRD template: ${prdPath}`);
  console.log('\nNext steps:');
  console.log('1. Edit prd.json to define your stories');
  console.log('2. Run: ralph --validate');
  console.log('3. Run: ralph');
}

/**
 * Validate PRD
 */
async function validatePRD(prdPath: string): Promise<boolean> {
  console.log('📋 Validating PRD...\n');

  const validator = new PRDValidator();
  await validator.loadSchema(SCHEMA_PATH);

  const result = await validator.fullValidation(prdPath);

  if (result.valid) {
    console.log('✅ PRD is valid!\n');

    if (result.warnings.length > 0) {
      console.log('⚠️  Warnings:');
      result.warnings.forEach(w => console.log(`  - ${w}`));
      console.log('');
    }

    if (result.prd) {
      const total = result.prd.stories.length;
      const completed = result.prd.stories.filter(s => s.passes).length;
      const remaining = total - completed;

      console.log('📊 Statistics:');
      console.log(`  - Total stories: ${total}`);
      console.log(`  - Completed: ${completed} (${((completed / total) * 100).toFixed(1)}%)`);
      console.log(`  - Remaining: ${remaining}`);
      console.log('');

      // Show next story
      const executor = new AgentExecutor({
        prdPath,
        schemaPath: SCHEMA_PATH,
        progressPath: PROGRESS_PATH,
        agentsPath: AGENTS_PATH,
        workingDir: process.cwd(),
        tokenBudget: result.prd.config?.tokenBudget || 150000
      });

      const nextStory = executor.selectNextStory(result.prd);
      if (nextStory) {
        console.log('📝 Next story to implement:');
        console.log(`  ID: ${nextStory.id}`);
        console.log(`  Title: ${nextStory.title}`);
        console.log(`  Priority: ${nextStory.priority || 'medium'}`);
        console.log('');
      }
    }

    return true;
  } else {
    console.error('❌ PRD validation failed!\n');
    console.error('Errors:');
    result.errors.forEach(e => console.error(`  - ${e}`));
    console.log('');
    return false;
  }
}

/**
 * Main execution
 */
async function main(): Promise<void> {
  const options = parseArgs();

  if (options.help) {
    showHelp();
    return;
  }

  const prdPath = options.prd || DEFAULT_PRD;

  // Initialize
  if (options.init) {
    await initializePRD(prdPath);
    return;
  }

  // Validate
  if (options.validate) {
    const valid = await validatePRD(prdPath);
    process.exit(valid ? 0 : 1);
    return;
  }

  // Check if PRD exists
  try {
    await fs.access(prdPath);
  } catch {
    console.error(`❌ PRD not found: ${prdPath}`);
    console.log('\nRun: ralph --init');
    process.exit(1);
  }

  // Validate before execution
  const valid = await validatePRD(prdPath);
  if (!valid) {
    process.exit(1);
  }

  // Create execution context
  const context: ExecutionContext = {
    prdPath,
    schemaPath: SCHEMA_PATH,
    progressPath: PROGRESS_PATH,
    agentsPath: AGENTS_PATH,
    workingDir: process.cwd(),
    tokenBudget: 150000
  };

  // Execute
  const executor = new AgentExecutor(context);

  try {
    await executor.initialize();
    await executor.run();

    console.log('\n✨ Ralph execution complete!');
    console.log('\nReview:');
    console.log(`  - Progress log: ${PROGRESS_PATH}`);
    console.log(`  - Patterns: ${AGENTS_PATH}`);
    console.log(`  - PRD: ${prdPath}`);

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Execution failed:');
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

// Handle cleanup
process.on('SIGINT', async () => {
  console.log('\n\n⚠️  Interrupted by user');
  process.exit(130);
});

process.on('SIGTERM', async () => {
  console.log('\n\n⚠️  Terminated');
  process.exit(143);
});

// Run
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
