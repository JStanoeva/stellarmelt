# Agent Guidelines for Stellarmelt

This document defines how AI agents should work in this repository. It keeps changes aligned with the project's conventions.

## Project Overview

Stellarmelt is a static landing page built in React (TypeScript) + Tailwind.

## Directory Structure

```
.
|- public/                 # Static assets served at root
|  |- favicon.png
|  |- hero-art.png
|  \- timeline-*.png
|- src/                    # Application source (React + TS)
|  |- App.tsx              # Root UI component
|  |- main.tsx             # App entry, mounts React
|  |- index.css            # Tailwind v4 import + globals
|  \- vite-env.d.ts        # Vite type declarations
|- index.html              # Vite HTML entry
|- vite.config.ts          # Vite + React + Tailwind plugins
|- eslint.config.js        # ESLint configuration
|- tsconfig*.json          # TypeScript project configs
|- package.json            # Scripts and dependencies (npm)
|- package-lock.json       # Lockfile (package manager: npm)
|- AGENTS.md               # This guide
|- LICENSE                 # MIT license
\- README.md               # Project overview and usage
```

- Assets in `public/` are available at `/filename.ext` (no import required).
- Place React components, hooks, and utils under `src/` subfolders as the app grows (e.g., `src/components/`). Keep names clear and self-explanatory.
- Tailwind v4 is enabled via `@tailwindcss/vite`; a separate Tailwind config file is not required.

## Scripts

- `npm run dev`: Start Vite dev server.
- `npm run build`: Type-check then build (`tsc -b && vite build`).
- `npm run preview`: Preview the production build locally.
- `npm run lint`: Run ESLint using `eslint.config.js`.

## Environment and Tooling

- Framework/Library: React.js (TypeScript)
- Styling: Tailwind CSS (v4 via @tailwindcss/vite)
- Build Tool: Vite
- Package manager: npm (inferred from `package-lock.json`). Do not switch managers.
- Node: Use Node 18+ (recommend 20 LTS). Consider documenting in `README.md` or `package.json#engines`.
- Browser support: Modern evergreen browsers. No IE support.

## Coding Conventions

- TypeScript: Prefer explicit types for props and function returns when non-trivial.
- React components: Use function components; name files with `PascalCase` (e.g., `Hero.tsx`).
- Hooks: Name custom hooks as `useX`; place under `src/hooks/`.
- Styling: Prefer Tailwind utility classes; avoid custom CSS unless needed. Keep class lists readable and consistent.
- Assets: Serve from `public/` and reference via absolute paths (e.g., `<img src="/hero-art.png" alt="..." />`).
- Accessibility: Provide alt text, use semantic HTML, and ensure focus styles remain visible.

## Role and Core Instructions

- Act as a collaborative coding agent.
- When presented with a new request, outline a structured plan to accomplish it.
- Follow that plan and keep going until the user's request is completely resolved, before ending your turn and yielding back to the user.
- Only terminate your turn when you are sure that the problem is solved.
- Never stop or hand back to the user when you encounter uncertainty — research or deduce the most reasonable approach and continue.
- Do not ask the user to confirm or clarify assumptions; decide the most reasonable assumption, proceed, and document it afterwards.
- Proactively attempt the plan; then ask if the user wants to accept the implemented changes.
- Proceed in accordance with the workflow steps before making subsequent tool calls; reflect on the outcomes of each function call to ensure all sub-requests are resolved.

## Approach

1. Understand the request and repo context.

   - Inspect `package.json` (framework, scripts, optional `packageManager`).
   - If `packageManager` is missing, detect via lockfile (npm here) and align with it.
   - Respect existing lint/format configs and framework/library conventions.

2. Outline a structured workflow plan.

   - Exactly one step is `in_progress` at any time; mark prior steps `completed` as you advance.
   - Finish when all steps are `completed`.
   - Example plan (3–6 steps, 5–7 words each):

     1. Inspect bug and narrow scope.
     2. Patch module with minimal changes.
     3. Run targeted tests for module.
     4. Update docs and summary.

   - Preambles: Briefly state what you are about to do before tool calls.
   - Progress: Send short updates as milestones are reached.
   - Summary: After changes, describe the outcome, files touched, and any caveats or next steps.

3. Make targeted, minimal edits.

   - Scope: Change only what is necessary to fulfill the request.
   - Simplicity: Avoid introducing new libraries, services, or build steps unless requested.
   - Safety: Avoid destructive actions (`rm`, resets, large renames) unless explicitly approved.
   - Compatibility: Respect existing toolchains and versions; do not change package managers or framework major versions unprompted.
   - Clarity: Avoid one-letter variable names. Keep code clear and self-explanatory without excessive comments.
   - Style: Match existing styles and patterns. Keep filenames and structure stable.
   - Documentation: Update `README.md` and code comments near changed code when useful.
   - Committing: Do not commit or create branches unless the user explicitly requests it.

4. Validate locally (type-check, build, lint).

   - Reproduce issues when possible; isolate root cause; apply minimal patch.
   - Do not add new dependencies unless asked.
   - Manual Verification Template:
     1. Preconditions: e.g., `npm run build` succeeds.
     2. Steps: Navigate to `...`, run `...`, observe `...`.
     3. Expected: Output shows `...`; no errors in console.
     4. Regression checks: Adjacent features still work: `A`, `B`.

5. Summarize changes and offer follow-ups.
   - Explain what changed and why.
   - List key files modified.
   - Note any builds/tests run or manual checks.
   - Suggest next steps.

## Definition of Done

- The change fully addresses the request and is self-contained.
- TypeScript compiles and ESLint passes without new warnings.
- `npm run build` and (if relevant) `npm run preview` work without console errors.
- Documentation and examples (if any) are updated.
- No unintended diffs or unrelated changes.
- Plan finalized: No `pending` or `in_progress` steps remain.
- Summary provided with Outcome, Files, Validation, optional Follow-ups.

## Examples

- Example preamble: "I will scan the repo and update the API route definitions next."
- Example progress update: "Scanned code; now patching config and tests."
- Example summary: "Fixed header overflow on mobile by adjusting Tailwind classes in `src/App.tsx:42`. Files: `src/App.tsx`. Verified on iPhone viewport in devtools; `npm run build` succeeds. Consider adding `overflow-hidden` to hero wrapper if new content is added."
