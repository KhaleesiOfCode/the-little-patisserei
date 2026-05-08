# AGENTS.md

## Project Overview

Briefly describe what this project does, the tech stack, and the main goal.

## Repository Structure

- `src/` — application source code
- `components/` — reusable UI components
- `lib/` — shared utilities
- `scripts/` — automation scripts
- `docs/` — documentation and planning notes

## Development Commands

- Install dependencies: `npm install`
- Start development: `npm run dev`
- Run lint: `npm run lint`
- Run tests: `npm test`
- Build project: `npm run build`

## Coding Standards

- Use TypeScript where possible.
- Keep changes minimal and task-focused.
- Avoid large rewrites unless explicitly requested.
- Prefer readable code over clever code.
- Add comments only where logic is not obvious.

## Safety Rules

- Always inspect files before editing.
- Do not delete files without explicit approval.
- Do not run destructive commands such as `rm -rf`, `git reset --hard`, or database migrations without approval.
- Do not expose or modify secrets in `.env` files.
- Do not push to remote unless explicitly asked.

## Git Workflow

- Run `git status` before changes.
- Stage only relevant files.
- Show a summary of changed files before committing.
- Use clear commit messages.

## Agent Response Style

- Explain what changed.
- Mention files modified.
- Mention tests or checks run.
- If something was not tested, say so clearly.