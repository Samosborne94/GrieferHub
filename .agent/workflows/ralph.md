---
description: How to use Ralph and PRD skills for autonomous execution
---

# Ralph & PRD Workflow

Follow these steps to generate requirements and execute tasks autonomously using the Ralph agent.

## 1. Create a PRD

Use the PRD skill to generate a detailed requirements document.

- **Action**: Load the `prd` skill and create a PRD for your feature.
- **Process**: Answer the clarifying questions provided by the skill.
- **Output**: The skill saves context to `tasks/prd-[feature-name].md`.

## 2. Convert PRD to Ralph format

Use the Ralph skill to convert the markdown PRD to a structured JSON format.

- **Action**: Load the `ralph` skill and convert `tasks/prd-[feature-name].md` to `prd.json`.
- **Output**: Creates `prd.json` with user stories structured for autonomous execution.

## 3. Run Ralph

Run the Ralph agent to execute the user stories.

### Using Amp (Default)

```bash
./scripts/ralph/ralph.sh [max_iterations]
```

### Using Claude Code

```bash
./scripts/ralph/ralph.sh --tool claude [max_iterations]
```

---

## 💡 Key Considerations

### Small, Right-Sized Tasks

Each PRD item should be small enough to complete in one context window. If a task is too big, the LLM may run out of context and produce poor code.

**Right-sized stories:**

- Add a database column and migration
- Add a UI component to an existing page
- Update a server action with new logic
- Add a filter dropdown to a list

**Too big (split these):**

- "Build the entire dashboard"
- "Add authentication"
- "Refactor the API"

### AGENTS.md Updates

After each iteration, Ralph updates `AGENTS.md` with learnings. This is critical for both future AI iterations and human developers to benefit from discovered patterns and conventions.
