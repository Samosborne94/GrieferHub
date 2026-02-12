# Ralph Agent - Quick Start Guide

Get up and running with Ralph in 5 minutes.

## Prerequisites

- Node.js 18+
- Git repository initialized
- npm or yarn installed

## Installation

### 1. Install Dependencies

```bash
npm install
```

This installs required packages:
- `ajv` - JSON schema validation
- `ajv-formats` - Date/time format validation
- `ts-node` - TypeScript execution

### 2. Initialize Ralph

```bash
npm run ralph:init
```

This creates `prd.json` in your project root with a sample story.

### 3. Customize Your PRD

Edit `prd.json` to add your user stories:

```json
{
  "meta": {
    "version": "1.0.0",
    "project": "YourProject",
    "created": "2026-01-18T00:00:00Z"
  },
  "stories": [
    {
      "id": "PROJ-001",
      "title": "Your first story",
      "description": "Detailed description here",
      "acceptance": [
        "Criterion 1",
        "Criterion 2",
        "All tests pass"
      ],
      "priority": "high",
      "passes": false
    }
  ],
  "config": {
    "testCommand": "npm test",
    "buildCommand": "npm run build",
    "autoCommit": true
  }
}
```

### 4. Validate PRD

```bash
npm run ralph:validate
```

This checks:
- JSON schema compliance
- Circular dependencies
- Missing dependencies
- Best practice warnings

### 5. Run Ralph

```bash
npm run ralph
```

Ralph will:
1. Load and validate PRD
2. Select next story
3. Display story details
4. Wait for implementation
5. Run tests
6. Commit if tests pass
7. Continue to next story

## File Structure

After initialization, you'll have:

```
your-project/
├── .agent/
│   ├── core/                 # Agent implementation
│   ├── schemas/              # PRD schema
│   ├── scripts/              # CLI entry point
│   ├── memory/               # Created on first run
│   │   ├── progress.txt     # Execution log
│   │   └── AGENTS.md        # Learned patterns
│   ├── README.md            # Full documentation
│   └── QUICKSTART.md        # This file
├── prd.json                  # Your PRD
└── package.json              # Updated with ralph scripts
```

## Basic Workflow

### Day 1: Setup

```bash
# Initialize
npm run ralph:init

# Edit prd.json with your stories

# Validate
npm run ralph:validate
```

### Day 2: First Story

```bash
# Run Ralph
npm run ralph

# Ralph displays next story
# You implement the feature manually
# Run tests: npm test
# Ralph detects success and commits
```

### Day 3+: Iterate

```bash
# Ralph continues from where it left off
npm run ralph

# Check progress
cat .agent/memory/progress.txt

# Review learned patterns
cat .agent/memory/AGENTS.md
```

## Common Commands

```bash
# Run with default prd.json
npm run ralph

# Run with custom PRD
npm run ralph -- --prd custom.json

# Validate only
npm run ralph:validate

# Initialize new PRD
npm run ralph:init

# Show help
npm run ralph:help
```

## Example PRD

Here's a complete example for adding a user profile page:

```json
{
  "meta": {
    "version": "1.0.0",
    "project": "MyApp",
    "created": "2026-01-18T00:00:00Z",
    "owner": "Dev Team"
  },
  "stories": [
    {
      "id": "FEAT-001",
      "title": "User profile page layout",
      "description": "Create basic profile page structure",
      "acceptance": [
        "Page accessible at /profile/[username]",
        "Shows username and avatar",
        "Responsive design",
        "All tests pass"
      ],
      "dependencies": [],
      "priority": "high",
      "estimatedHours": 3,
      "tags": ["ui", "profile"],
      "passes": false
    },
    {
      "id": "FEAT-002",
      "title": "Profile statistics",
      "description": "Add stats cards to profile",
      "acceptance": [
        "Shows total posts",
        "Shows join date",
        "Shows activity count",
        "All tests pass"
      ],
      "dependencies": ["FEAT-001"],
      "priority": "medium",
      "estimatedHours": 2,
      "tags": ["ui", "profile", "stats"],
      "passes": false
    }
  ],
  "config": {
    "testCommand": "npm test",
    "buildCommand": "npm run build",
    "lintCommand": "npm run lint",
    "maxRetries": 3,
    "autoCommit": true,
    "tokenBudget": 150000,
    "haltOnFailure": false
  }
}
```

## Understanding Story States

Each story has these key fields:

- `passes`: `false` → Story needs implementation
- `passes`: `true` → Story complete
- `implemented`: Set when code is written
- `verified`: Set when tests pass
- `commits`: Array of git commit hashes
- `files`: Array of files modified

## Monitoring Progress

### Check Recent Activity

```bash
# Last 20 lines of progress log
tail -20 .agent/memory/progress.txt
```

### View Statistics

```bash
npm run ralph:validate
```

Shows:
- Total stories: 10
- Completed: 6 (60%)
- Remaining: 4
- Next story: FEAT-007

### Search Patterns

```bash
# Find API-related patterns
grep "api" .agent/memory/AGENTS.md

# Find failures
grep "failure" .agent/memory/AGENTS.md
```

## Troubleshooting

### "PRD not found"

```bash
# Create one
npm run ralph:init
```

### "Validation failed"

```bash
# See details
npm run ralph:validate

# Common issues:
# - Missing required fields
# - Invalid story ID format (must be: ABC-123)
# - Circular dependencies
# - Missing dependency references
```

### "Tests keep failing"

```bash
# Check your test command
# Edit prd.json config:
{
  "config": {
    "testCommand": "npm test -- --verbose"
  }
}

# Or disable auto-retry
{
  "config": {
    "maxRetries": 1,
    "haltOnFailure": true
  }
}
```

### "Agent stuck on story"

Press `Ctrl+C` to stop, then:

```bash
# Manually set story as complete in prd.json
{
  "stories": [
    {
      "id": "STUCK-001",
      "passes": true,  // <-- Change this
      ...
    }
  ]
}

# Resume
npm run ralph
```

## Configuration Options

### Test Commands

```json
{
  "config": {
    "testCommand": "npm test",           // Standard
    "testCommand": "jest --coverage",    // With coverage
    "testCommand": "npm run test:e2e"    // E2E tests
  }
}
```

### Build Commands

```json
{
  "config": {
    "buildCommand": "npm run build",
    "buildCommand": "tsc && next build",
    "buildCommand": "vite build"
  }
}
```

### Retry Strategy

```json
{
  "config": {
    "maxRetries": 3,        // Try 3 times
    "haltOnFailure": false  // Continue on failure
  }
}
```

Or:

```json
{
  "config": {
    "maxRetries": 1,        // Only try once
    "haltOnFailure": true   // Stop on first failure
  }
}
```

### Token Budget

```json
{
  "config": {
    "tokenBudget": 150000,  // Stop if exceeded
    "tokenBudget": 50000    // Tighter budget
  }
}
```

## Next Steps

1. ✅ **Read full documentation**: `.agent/README.md`
2. ✅ **Review workflow guide**: `.agent/workflows/WORKFLOW_GUIDE.md`
3. ✅ **Define your PRD**: `prd.json`
4. ✅ **Run Ralph**: `npm run ralph`
5. ✅ **Monitor progress**: `.agent/memory/progress.txt`
6. ✅ **Learn from patterns**: `.agent/memory/AGENTS.md`

## Tips

1. **Start small**: Begin with 2-3 simple stories
2. **Clear acceptance**: Make criteria specific and testable
3. **Test command**: Ensure `npm test` works before running Ralph
4. **Dependencies**: Use sparingly to avoid blocking
5. **Priority**: Critical stories first, but don't over-prioritize
6. **Estimates**: Help with planning, not enforced
7. **Tags**: Use for organization and filtering

## Getting Help

```bash
# Show CLI help
npm run ralph:help

# View full docs
cat .agent/README.md

# Check examples
cat .agent/workflows/WORKFLOW_GUIDE.md
```

---

**Ready to start?**

```bash
npm run ralph:init
npm run ralph:validate
npm run ralph
```

Happy automating! 🤖
