# AGENTS.md

## Project Overview

The Little Patisserie is a Next.js 16 e-commerce bakery website for a Chennai-based artisan cake shop. Customers browse the menu, customise cakes, place orders (pickup/delivery/courier), and track them. Admin panel manages orders, menu items, gallery, and store status.

## Repository Structure

- `app/` — Next.js App Router pages and API routes
- `components/` — reusable UI components
- `lib/` — shared utilities (Supabase, auth, delivery zones, validation)
- `types/` — TypeScript type definitions
- `data/` — fallback product data
- `tests/` — Vitest unit tests
- `supabase/` — database migrations

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