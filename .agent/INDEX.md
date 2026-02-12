# Ralph Agent - Documentation Index

**Welcome to Ralph!** 🤖

Ralph is an autonomous agent that executes Product Requirements Documents (PRDs) by iterating through user stories, implementing them, running tests, and learning from the process.

## 📖 Documentation Guide

Choose your path:

### 🚀 I want to get started NOW (5 minutes)
👉 **[QUICKSTART.md](./QUICKSTART.md)**

Quick commands:
```bash
npm install
npm run ralph:init
npm run ralph:validate
npm run ralph
```

### 📚 I want to understand how it works
👉 **[README.md](./README.md)**

Comprehensive guide covering:
- Overview and philosophy
- File structure
- PRD schema
- Memory systems
- Usage examples
- Best practices

### 🔄 I want to see visual workflows
👉 **[workflows/WORKFLOW_GUIDE.md](./workflows/WORKFLOW_GUIDE.md)**

Includes:
- Workflowy outline
- Mermaid diagrams
- State diagrams
- Integration patterns
- Obsidian integration

### 📊 I want to know what was built
👉 **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)**

Summary of:
- Files created
- Features implemented
- Usage examples
- Success metrics
- Next steps

### 🔧 I want technical details

**Core Components**:
- [core/agent-executor.ts](./core/agent-executor.ts) - Main execution loop
- [core/prd-validator.ts](./core/prd-validator.ts) - PRD validation
- [core/progress-tracker.ts](./core/progress-tracker.ts) - Memory system
- [core/pattern-logger.ts](./core/pattern-logger.ts) - Pattern learning

**Schema**:
- [schemas/prd-schema.json](./schemas/prd-schema.json) - JSON schema

**CLI**:
- [scripts/ralph.ts](./scripts/ralph.ts) - Command-line interface

## 🗂️ File Organization

```
.agent/
├── INDEX.md                   ← You are here
├── QUICKSTART.md              ← Start here (5 min)
├── README.md                  ← Full guide (30 min)
├── IMPLEMENTATION_SUMMARY.md  ← What was built
│
├── core/                      ← TypeScript implementation
│   ├── agent-executor.ts
│   ├── prd-validator.ts
│   ├── progress-tracker.ts
│   └── pattern-logger.ts
│
├── schemas/                   ← PRD validation
│   └── prd-schema.json
│
├── scripts/                   ← CLI entry point
│   └── ralph.ts
│
├── workflows/                 ← Visual guides
│   ├── innit.md
│   └── WORKFLOW_GUIDE.md
│
└── memory/                    ← Created on first run
    ├── progress.txt           ← Execution log
    └── AGENTS.md              ← Learned patterns
```

## 🎯 Quick Reference

### Commands

| Command | Description |
|---------|-------------|
| `npm run ralph` | Run agent with default PRD |
| `npm run ralph:init` | Create new PRD template |
| `npm run ralph:validate` | Validate PRD only |
| `npm run ralph:help` | Show help message |

### Key Files

| File | Purpose |
|------|---------|
| `prd.json` | Your user stories and configuration |
| `.agent/memory/progress.txt` | Execution log and history |
| `.agent/memory/AGENTS.md` | Learned patterns and knowledge |

### PRD Structure

```json
{
  "meta": { ... },           // Project metadata
  "stories": [ ... ],        // User stories
  "config": { ... }          // Agent configuration
}
```

## 🔍 Finding Information

### "How do I...?"

| Question | Answer |
|----------|--------|
| Get started quickly? | [QUICKSTART.md](./QUICKSTART.md) |
| Understand the workflow? | [workflows/WORKFLOW_GUIDE.md](./workflows/WORKFLOW_GUIDE.md) |
| Define a story? | [README.md#prd-schema](./README.md) |
| Handle dependencies? | [README.md#dependency-resolution](./README.md) |
| Configure tests? | [QUICKSTART.md#configuration-options](./QUICKSTART.md) |
| Track progress? | [README.md#memory-systems](./README.md) |
| Learn from patterns? | Check `.agent/memory/AGENTS.md` |
| Troubleshoot errors? | [QUICKSTART.md#troubleshooting](./QUICKSTART.md) |

### "What is...?"

| Term | Definition |
|------|------------|
| PRD | Product Requirements Document - structured as JSON |
| Story | A single unit of work with acceptance criteria |
| Ralph | The autonomous agent (named after the workflow) |
| progress.txt | Long-term memory - execution log |
| AGENTS.md | Pattern DNA - learned knowledge |
| Dependency | Story that must complete before another |
| Priority | Urgency level: critical, high, medium, low |

## 🎓 Learning Path

### Beginner (Day 1)
1. Read [QUICKSTART.md](./QUICKSTART.md)
2. Run `npm run ralph:init`
3. Add 1-2 simple stories
4. Run `npm run ralph:validate`
5. Manually implement a story
6. Watch Ralph commit it

### Intermediate (Week 1)
1. Read [README.md](./README.md)
2. Add stories with dependencies
3. Configure custom test commands
4. Review `progress.txt` daily
5. Build up `AGENTS.md` patterns

### Advanced (Month 1)
1. Read [workflows/WORKFLOW_GUIDE.md](./workflows/WORKFLOW_GUIDE.md)
2. Integrate Claude Code API (future)
3. Set up GitHub Actions automation
4. Build pattern library
5. Customize for your workflow

## 📊 Visual Overview

### The Ralph Loop

```
prd.json → Agent → Select Story → Implement → Test → Commit → Update PRD
  ↑                                                                ↓
  └────────────────────────────────────────────────────────────────┘
                        Loop until all stories.passes = true
```

### Memory Systems

```
progress.txt         AGENTS.md
    ↓                    ↓
  History           Patterns
    ↓                    ↓
  Context           Knowledge
    ↓                    ↓
Resume execution   Better code
```

## 🎯 Use Cases

### Feature Development
- Define features as stories
- Dependencies ensure order
- Tests validate implementation
- Commits create audit trail

### API Integration
- OAuth flows as stories
- Data fetching dependent on auth
- Caching dependent on fetching
- Sequential execution guaranteed

### Refactoring
- Break refactor into steps
- Each step testable
- Dependencies prevent breakage
- Pattern learning improves future refactors

### Bug Fixes
- Define bug as story
- Acceptance = bug is fixed
- Test = bug doesn't reproduce
- Pattern = how to avoid similar bugs

## 🔗 External Resources

### Related Workflows
- [innit.md](./workflows/innit.md) - Original initialization workflow

### Integration Examples
- GitHub Actions (see WORKFLOW_GUIDE.md)
- Obsidian (see WORKFLOW_GUIDE.md)
- Workflowy (see WORKFLOW_GUIDE.md)

## 🆘 Getting Help

### Order of Operations

1. **Check QUICKSTART.md** - Solves 80% of issues
2. **Check README.md** - Detailed explanations
3. **Check WORKFLOW_GUIDE.md** - Visual guides
4. **Check progress.txt** - See what Ralph is doing
5. **Check AGENTS.md** - See what Ralph learned

### Common Issues

| Issue | Solution |
|-------|----------|
| PRD validation fails | Run `npm run ralph:validate` for details |
| Tests keep failing | Check `config.testCommand` in prd.json |
| Dependencies confusing | See dependency diagram in WORKFLOW_GUIDE.md |
| Agent stuck | Press Ctrl+C, manually update prd.json |

## 🎁 What You Have

After setup, you have:

1. ✅ **Autonomous execution** system
2. ✅ **Dependency management** built-in
3. ✅ **Test automation** integrated
4. ✅ **Git automation** ready
5. ✅ **Progress tracking** automatic
6. ✅ **Pattern learning** ongoing
7. ✅ **Knowledge accumulation** over time

## 🚀 Next Actions

Choose one:

**Option A: Quick Start (5 min)**
```bash
npm install
npm run ralph:init
# Edit prd.json
npm run ralph
```

**Option B: Deep Dive (30 min)**
```bash
cat .agent/README.md
cat .agent/workflows/WORKFLOW_GUIDE.md
# Then proceed with Option A
```

**Option C: Just Explore**
```bash
ls .agent/
cat .agent/QUICKSTART.md
cat prd.json
npm run ralph:validate
```

## 📞 Documentation Map

```
INDEX.md (you are here)
  │
  ├─ QUICKSTART.md ──────────────── Get running in 5 minutes
  │
  ├─ README.md ──────────────────── Comprehensive guide
  │   ├─ Overview
  │   ├─ Structure
  │   ├─ PRD Schema
  │   ├─ Memory Systems
  │   ├─ Usage Examples
  │   └─ Best Practices
  │
  ├─ WORKFLOW_GUIDE.md ───────────── Visual workflows
  │   ├─ Workflowy outline
  │   ├─ Mermaid diagrams
  │   ├─ State diagrams
  │   └─ Integration patterns
  │
  └─ IMPLEMENTATION_SUMMARY.md ───── What was built
      ├─ Files created
      ├─ Features implemented
      ├─ Example use cases
      └─ Next steps
```

## 🎉 Ready to Start?

Pick your speed:

- **🏃 Fast**: [QUICKSTART.md](./QUICKSTART.md) → 5 minutes
- **🚶 Steady**: [README.md](./README.md) → 30 minutes
- **🧘 Thorough**: Read all docs → 2 hours

All paths lead to the same place: **Autonomous PRD execution** 🤖

---

**Built with ❤️ for GrieferHub**
**Version**: 1.0.0
**Last Updated**: 2026-01-18

Happy automating! 🚀
