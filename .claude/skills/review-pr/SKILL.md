---
name: review-pr
description: Review a pull request for code quality, security, and adherence to project standards
argument-hint: "[PR number or branch name]"
---

Review the PR specified by `$ARGUMENTS`. If no argument is provided, review the current branch's PR.

## Steps

1. **Fetch PR context**
   - Run `gh pr view $ARGUMENTS` to get the PR description
   - Run `gh pr diff $ARGUMENTS` to get the full diff
   - Run `gh pr view $ARGUMENTS --comments` to see existing discussion

2. **Check against PR template** (see PRTemplate.md)
   Verify the PR description includes:
   - Summary and Why sections filled in
   - Changes listed with checkboxes
   - How to test steps provided
   - Security / Risk section addressed
   - Checklist items completed

3. **Code review** — Evaluate the diff for:
   - **Correctness**: Logic errors, edge cases, off-by-ones
   - **Security**: Injection, XSS, leaked secrets, missing auth checks, OWASP top 10
   - **Performance**: N+1 queries, unnecessary re-renders, missing indexes
   - **Minimal diff**: No unrelated refactors, no drive-by changes
   - **Types**: Proper TypeScript types, no `any` abuse
   - **Error handling**: Appropriate at system boundaries (user input, external APIs)
   - **Tests**: Adequate coverage for new/changed behavior

4. **Output a structured review**

```
## PR Review: <title>

### Summary
<1-2 sentence summary of what this PR does>

### Template Compliance
- [ ] Summary filled in
- [ ] Why filled in
- [ ] Changes listed
- [ ] Test steps provided
- [ ] Security section addressed
- [ ] Checklist completed

### Issues Found
#### Blockers (must fix)
- <file:line> — description

#### Warnings (should fix)
- <file:line> — description

#### Nits (optional)
- <file:line> — description

### Security Assessment
<any security concerns or "No issues found">

### Verdict
APPROVE / REQUEST_CHANGES / COMMENT
<brief justification>
```

5. If the user confirms, post the review via `gh pr review $ARGUMENTS` with the appropriate flag (`--approve`, `--request-changes`, or `--comment`).
