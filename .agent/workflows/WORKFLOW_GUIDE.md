# Ralph Agent Workflow Guide

This guide provides visual workflows and integration patterns for the Ralph autonomous agent.

## 📋 Workflowy Outline

**Copy this outline into Workflowy for high-level project tracking:**

```
* Ralph Agent: Autonomous PRD Execution #ralph #automation #workflow
  * Initialization Phase
    * Define PRD: Outline core requirements and goals
    * Convert to prd.json: Break down the PRD into structured user stories with unique IDs and acceptance criteria
    * Bootstrapping: Initialize progress.txt for long-term memory and AGENTS.md for pattern logging
    * Validation: Run ralph --validate to ensure PRD integrity

  * The Ralph Loop (ralph.ts)
    * Start Loop: Execute the autonomous script to begin the cycle
    * Selection: Agent scans prd.json to find the next story where passes: false
      * Check dependencies are met
      * Sort by priority (critical > high > medium > low)
      * Select highest priority ready story
    * Implementation: Agent writes code, runs tests, and executes the specific task
      * Invoke Claude Code (or manual implementation)
      * Monitor file changes
      * Track implementation progress

  * Verification & Learning
    * Testing: Run configured test command
      * npm test (or custom command)
      * Capture test output
      * Determine pass/fail status
    * Build: Optionally run build to ensure compilation
    * Lint: Optionally run linter for code quality
    * Commit: If tests pass, the agent performs a Git commit
      * Generate commit message from story
      * Include Co-Authored-By tag
      * Get commit hash
    * Update State: Set passes: true in prd.json for the completed story
      * Mark implemented: true
      * Add commit hash to story
      * Record completion timestamp
    * Log Progress: Save technical learnings and discovered patterns
      * Append to progress.txt with timestamps
      * Extract patterns for AGENTS.md
      * Categorize success/failure patterns

  * Termination
    * Story Check: Determine if more stories remain in prd.json
    * Completion: Once all stories are marked passes: true, the agent signals "Done!"
    * Summary: Display statistics and review files
      * Total stories completed
      * Success rate
      * Time metrics
      * Point to progress.txt and AGENTS.md

  * Error Handling
    * Retry Logic: On test failure, retry up to maxRetries times
    * Error Logging: Record errors in story.errors array
    * Halt Conditions: Optionally stop on first failure (haltOnFailure: true)
    * Recovery: Manual intervention possible at any point

  * Memory Systems
    * progress.txt: Long-term execution log
      * All agent activities logged with timestamps
      * Read at startup for context resumption
      * Searchable history
    * AGENTS.md: Pattern knowledge base
      * Success patterns: What worked
      * Failure patterns: What to avoid
      * Rules: General principles
      * Categorized by tags
```

## 🔄 Mermaid Workflow Diagrams

### Main Ralph Loop

```mermaid
graph TD
    Start([You write a PRD]) --> Convert[Convert to prd.json]
    Convert --> Validate{Validate PRD}
    Validate -- Invalid --> Fix[Fix errors]
    Fix --> Validate
    Validate -- Valid --> Run[Run ralph.sh]

    subgraph Execution_Loop [Autonomous Agent Loop]
        Pick[Agent picks next story] --> CheckDeps{Dependencies<br/>met?}
        CheckDeps -- No --> Pick
        CheckDeps -- Yes --> Impl[Implements it:<br/>Writes code, runs tests]
        Impl --> Test{Tests<br/>pass?}
        Test -- No --> Retry{Max<br/>retries?}
        Retry -- No --> Impl
        Retry -- Yes --> LogError[Log failure]
        Test -- Yes --> Commit[Commits changes<br/>if autoCommit=true]
        Commit --> Update[Updates prd.json:<br/>passes = true]
        Update --> Log[Logs to progress.txt<br/>& AGENTS.md]
        LogError --> LogFail[Log to progress.txt]
    end

    Run --> Pick
    Log --> More{More<br/>stories?}
    LogFail --> More
    More -- Yes --> Pick
    More -- No --> Done([Done! All stories complete])

    style Execution_Loop fill:#f0f4f8,stroke:#2c3e50,stroke-width:2px
    style Done fill:#d4edda,stroke:#28a745,stroke-width:3px
    style Start fill:#fff3cd,stroke:#ffc107,stroke-width:2px
```

### Story Execution Detail

```mermaid
graph LR
    subgraph Story_Execution [Single Story Execution]
        S1[Load story from PRD] --> S2[Log story start]
        S2 --> S3[Execute implementation]
        S3 --> S4[Track file changes]
        S4 --> S5[Run tests]
        S5 --> S6{Success?}
        S6 -- Yes --> S7[Git commit]
        S7 --> S8[Update PRD state]
        S8 --> S9[Log success pattern]
        S6 -- No --> S10[Log failure]
        S10 --> S11[Record error in PRD]
    end

    style Story_Execution fill:#e7f3ff,stroke:#0066cc,stroke-width:2px
```

### Memory System Flow

```mermaid
graph TD
    subgraph Memory [Memory Systems]
        M1[progress.txt] --> M2[Append execution log]
        M2 --> M3[Timestamped entries]
        M3 --> M4[Searchable history]

        M5[AGENTS.md] --> M6[Extract patterns]
        M6 --> M7{Pattern type}
        M7 -- Success --> M8[Success section]
        M7 -- Failure --> M9[Failure section]
        M7 -- Rule --> M10[Rules section]

        M4 --> M11[Context for next run]
        M8 --> M11
        M9 --> M11
        M10 --> M11
    end

    style Memory fill:#fff4e6,stroke:#ff9800,stroke-width:2px
```

### Dependency Resolution

```mermaid
graph TD
    subgraph Dependency_Resolution [Story Selection with Dependencies]
        D1[Get all incomplete stories] --> D2[Filter by dependencies]
        D2 --> D3{All deps<br/>completed?}
        D3 -- No --> D4[Skip story]
        D3 -- Yes --> D5[Story is ready]
        D4 --> D6[Next story]
        D6 --> D2
        D5 --> D7[Sort by priority]
        D7 --> D8[Return highest priority]
    end

    style Dependency_Resolution fill:#f3e5f5,stroke:#9c27b0,stroke-width:2px
```

## 🎯 Integration Patterns

### Pattern 1: Manual Implementation Mode

When Claude Code integration is not available:

```
1. Ralph selects next story
2. Ralph outputs story details to console
3. Developer implements manually
4. Developer runs tests: npm test
5. If tests pass:
   - Ralph detects success
   - Ralph commits changes
   - Ralph updates PRD
6. Ralph selects next story
```

### Pattern 2: Fully Autonomous Mode

With Claude Code API integration:

```
1. Ralph selects next story
2. Ralph formats story as prompt
3. Ralph invokes Claude Code API
4. Claude Code implements feature
5. Ralph monitors file changes
6. Ralph runs tests automatically
7. On success: commit, update, continue
8. On failure: retry or log error
```

### Pattern 3: Hybrid Mode

Semi-automated with checkpoints:

```
1. Ralph selects and displays story
2. User approves/modifies story
3. Ralph proceeds with implementation
4. Tests run automatically
5. User reviews changes before commit
6. Ralph commits and continues
```

## 📊 State Diagram

```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Validating: ralph --validate
    Idle --> Initializing: ralph --init
    Idle --> Running: ralph

    Validating --> Idle: Valid
    Validating --> Error: Invalid

    Initializing --> Idle: prd.json created

    Running --> SelectingStory
    SelectingStory --> Implementing: Story selected
    SelectingStory --> Complete: No more stories

    Implementing --> Testing: Code written
    Testing --> Committing: Tests pass
    Testing --> Retrying: Tests fail

    Retrying --> Implementing: Retry < max
    Retrying --> Logging: Max retries reached

    Committing --> UpdatingPRD
    UpdatingPRD --> LoggingPattern
    LoggingPattern --> SelectingStory

    Logging --> SelectingStory: Continue if !haltOnFailure
    Logging --> Complete: haltOnFailure=true

    Complete --> [*]
    Error --> [*]
```

## 🔧 Integration with Obsidian

### Daily Note Template

```markdown
# Ralph Agent Log - {{date}}

## Stories Completed Today
- [ ] Review completed stories
- [ ] Check AGENTS.md for new patterns

## Active Story
**ID**:
**Title**:
**Status**:

## Learnings
{{content from AGENTS.md}}

## Next Steps
- [ ]
```

### Obsidian Query

```dataview
TABLE
  story.id AS "ID",
  story.title AS "Title",
  story.passes AS "Complete"
FROM "prd.json"
WHERE story.passes = false
SORT story.priority DESC
```

## 🎨 Cost-Gate Pattern

Prevent runaway costs with token budget:

```json
{
  "config": {
    "tokenBudget": 100000,
    "haltOnFailure": true
  }
}
```

Ralph will:
1. Track tokens used per story
2. Halt if budget exceeded
3. Output "Debrief" for Workflowy

## 🚀 Meta-Workflow: Machine Building Machine

### Phase 1: Bootstrap
```
1. Create .agent/ infrastructure
2. Initialize progress.txt and AGENTS.md
3. Define prd.json schema
4. Validate setup
```

### Phase 2: Learning
```
1. Execute first story manually
2. Capture patterns in AGENTS.md
3. Refine PRD based on learnings
4. Update acceptance criteria
```

### Phase 3: Automation
```
1. Integrate Claude Code API
2. Enable autonomous execution
3. Monitor and adjust
4. Scale to parallel execution
```

### Phase 4: Meta
```
1. Ralph generates its own improvements
2. Ralph updates its own PRD
3. Self-optimizing agent
4. Continuous deployment
```

## 📈 Success Metrics

Track these in progress.txt:

- **Velocity**: Stories completed per day
- **Success Rate**: % of stories passing on first try
- **Retry Rate**: Avg retries per story
- **Pattern Growth**: New patterns learned per week
- **Token Efficiency**: Tokens per story

## 🔗 External Integrations

### GitHub Actions

```yaml
name: Ralph Agent
on:
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours
  workflow_dispatch:

jobs:
  ralph:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run Ralph
        run: npm run ralph
      - name: Commit changes
        run: |
          git config user.name "Ralph Agent"
          git commit -am "feat: Ralph autonomous update"
          git push
```

### Slack Notifications

```typescript
// In agent-executor.ts
async notifySlack(message: string) {
  await fetch(process.env.SLACK_WEBHOOK, {
    method: 'POST',
    body: JSON.stringify({ text: message })
  });
}
```

---

**Last Updated**: 2026-01-18
**Maintained By**: GrieferHub Development Team
