# Project Decisions & Architecture Choices (DECISIONS.md)

This log records technical and architectural choices made where the specification provided alternatives or required simplest-option decisions (Rule 5).

## D-001: Runtime Environment
- **Choice:** Node.js v20.20.2 and npm 10.8.2 managed via Fast Node Manager (`fnm`).
- **Rationale:** Meets the Section A6 requirement of Node.js 20.6 or newer. Zero native build compilation issues; runs cleanly on Windows.

## D-002: Provider Abstraction & Adapters
- **Choice:** Built-in `fetch` for provider adapters without vendor SDKs. Supported providers: `anthropic`, `openai-compatible` (supporting OpenRouter, Groq, Ollama, LM Studio, etc.), and `mock`.
- **Rationale:** Keeps dependencies minimal and allows zero-code vendor switching via configuration in `server/.env`.

## D-003: UI Framework and Styling
- **Choice:** React 18 with Vite and TypeScript. Pure custom property CSS (`tokens.css`, `base.css`, `components.css`) without Tailwind or external UI component libraries.
- **Rationale:** Strictly enforces Section A6 and Section C2, keeping the design system transparent and inspectable for an academic viva.

## D-004: State Management
- **Choice:** React `useReducer` and Context API (`client/src/state/store.tsx`). No Redux or external state libraries.
- **Rationale:** Simplest state management approach specified in Section A6.

## D-005: Rule Engine Placement
- **Choice:** Client-side deterministic execution in `client/src/lib/evaluate.ts`.
- **Rationale:** As specified in Section D1, the rule engine is pure deterministic code with no secrets. Running it in the browser ensures instant calculation and allows line-by-line inspection.
