# Next.js Frontend Standards & Guidelines

> This document defines the architecture, conventions, and rules for all our Next.js (App Router) frontends.
> It serves as the primary reference for AI code assistants and as an onboarding guide for new developers.
> These standards must be followed consistently. Pair with `BACKEND_STANDARDS.md` for full-stack work.

---

## Table of Contents

1. [Core Principles](#1-core-principles)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Per-Page / Per-Component File Layout](#4-per-page--per-component-file-layout)
5. [Naming Conventions](#5-naming-conventions)
6. [Code Organization & Size Limits](#6-code-organization--size-limits)
7. [Component Code Order](#7-component-code-order)
8. [TypeScript](#8-typescript)
9. [Server vs Client Components](#9-server-vs-client-components)
10. [Required Route Segment Files](#10-required-route-segment-files)
11. [Data Fetching](#11-data-fetching)
12. [State Management](#12-state-management)
13. [Forms](#13-forms)
14. [Styling](#14-styling)
15. [Performance](#15-performance)
16. [SEO](#16-seo)
17. [Accessibility](#17-accessibility)
18. [Security](#18-security)
19. [Documentation](#19-documentation)
20. [General Coding Standards](#20-general-coding-standards)
21. [Anti-Patterns](#21-anti-patterns)
22. [ESLint Size Limit Enforcement](#22-eslint-size-limit-enforcement)
23. [AI Coding Instructions](#23-ai-coding-instructions)
24. [Definition of Done](#24-definition-of-done)
25. [Checklist: Before Submitting Code](#25-checklist-before-submitting-code)

---

## 1. Core Principles

- Maintainability and scalability come first; performance, accessibility, and browser compatibility next.
- Predictable patterns over clever shortcuts — the same problem is solved the same way across files.
- Server-first by default. Push interactivity to the leaf of the tree, not the root.
- Small, focused components — split by responsibility, not by file length.
- Treat AI generation as another contributor: write code so AI can extend it without spreading drift.
- If a rule below is broken, the violator MUST add a comment starting with `// VIOLATE: <clear and specific reason>`. Unjustified violations are not acceptable.

---

## 2. Tech Stack

Every project uses the following core stack. Do not deviate without explicit approval.

| Layer                    | Technology                                 | Notes                                                                   |
| ------------------------ | ------------------------------------------ | ----------------------------------------------------------------------- |
| **Framework**            | Next.js 14+ (App Router)                   | Pages Router not allowed for new projects                               |
| **Language**             | TypeScript                                 | `strict: true`                                                          |
| **UI Library**           | Ant Design                                 | Use built-in components before writing custom                           |
| **Styling**              | SCSS Modules                               | One `*.module.scss` per component                                       |
| **Forms**                | Ant Design `Form` (or a validator library) | Manual validation only with single-stage `onFinish` over the whole form |
| **Server Data Fetching** | Native `fetch` in Server Components        | Always set explicit `cache` / `next.revalidate` / `next.tags`           |
| **Client Data Fetching** | TanStack Query or SWR                      | Raw `useEffect(fetch)` is forbidden                                     |
| **Mutations**            | Server Actions or a typed API client       | Pair with `revalidatePath` / `revalidateTag`                            |
| **Image Handling**       | `next/image`                               | Required for all bitmap images                                          |
| **Icons**                | Project's main icon family                 | Don't mix icon libraries                                                |
| **Linter**               | ESLint                                     | Enforces size limits; see §22                                           |

---

## 3. Project Structure

```
project_root/
├── src/                          # ALL application logic and UI lives here
│   ├── <pageName>/               # One folder per page or feature (camelCase)
│   ├── components/               # Reusable React components
│   ├── scripts/                  # Reusable scripts and hooks (server- or client-safe)
│   ├── models/                   # Per-resource API URLs, frontend route paths, types
│   ├── types/                    # Cross-feature shared types (non-resource)
│   ├── utilities/                # Design-token references, utility classes, utility components
│   └── assets/                   # Fonts, logos, static images imported from code
│
├── app/                          # STRICTLY reserved for Next.js route segments
│   ├── layout.tsx
│   ├── page.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   ├── not-found.tsx
│   └── <route-segment>/          # kebab-case route folders
│       ├── page.tsx
│       ├── layout.tsx
│       └── ...
│
├── public/
├── next.config.ts
├── tsconfig.json
├── eslint.config.mjs
└── package.json
```

> **Project-specific addendum:** the actual list of folders, path-alias roots, and which utilities/scripts already exist is documented in [`TECHNICAL_REFERENCE.md`](TECHNICAL_REFERENCE.md). This section defines the structural rules; `TECHNICAL_REFERENCE.md` lists what's been built.

### Hard layout rules

These must be followed exactly. Common AI-generated drift comes from breaking them:

1. **`/src` holds all UI and application logic.** No business logic in `/app`.
2. **`/app` is route-segment-only.** A route segment file (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, `route.ts`) MUST be a thin shim that imports from `/src` and renders. No data fetching, no forms, no business code in `/app` files.
3. **One folder per page or feature under `src/`.** A page named `dashboard` has all its files under `src/dashboard/`. Sub-features can nest.
4. **Each `.tsx` file exports a single component.** Private file-local subcomponents are allowed; cross-file imports must resolve to one component per file.
5. **Reusables live at the level of their widest consumer.** If exactly one parent uses a sub-component, nest it inside that parent's folder. Promote it to `src/components/` only when a second consumer appears. The same rule applies to scripts, types, and data — don't pre-emptively put things in `src/scripts/` or `src/types/` if only one feature uses them; keep them in the feature's folder.
6. **No global "context", "store", "data", "hooks", "lang", or "styles" folder under `src/`.** Shared state is solved via the provider+`useSTH` pattern (§12). Static data lives next to the feature that owns it (§4) or, when truly cross-feature, inside the relevant `models/<x>.ts` (resource data) or `utilities/` (design tokens). Multi-language `*.lang.ts` files are added only when the project is genuinely multi-locale.

---

## 4. Per-Page / Per-Component File Layout

Every component or page folder follows the same shape. Files that don't apply may be omitted; files that do apply MUST use the suffix.

```
<name>/
├── <name>.index.tsx              # The component / page (default export)
├── <name>.module.scss            # Styles
├── <name>.script.ts              # Hooks, handlers, side-effect logic
├── <name>.data.ts                # Static data (lists, enums, fixtures)
├── <name>.type.ts                # TypeScript types and enums
├── <name>.lang.ts                # User-facing strings — ONLY in multi-locale projects
├── README.md                     # Required for reusable components (§19)
└── skeleton/                     # Optional: loading skeleton subcomponent
    └── ...
```

### File responsibilities

| File            | Holds                                                            | Forbidden                                                                                           |
| --------------- | ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `*.index.tsx`   | The single exported component, JSX, minimal binding              | Inline static data, large pure functions, raw API calls                                             |
| `*.script.ts`   | Hooks, event handlers, async functions called from the component | JSX, exported components                                                                            |
| `*.data.ts`     | Static lists, fixed config, enum-like constants                  | Anything that depends on render-time props or state                                                 |
| `*.type.ts`     | All `type` / `interface` / `enum` declarations                   | Runtime values                                                                                      |
| `*.lang.ts`     | User-facing strings                                              | Logic, computed values. **Skipped entirely in single-locale projects** — strings are inlined in JSX |
| `*.module.scss` | Styles scoped to this component                                  | Global selectors at root                                                                            |

### Page files

A Next.js page lives in `app/<route>/page.tsx` but **must be a thin shim**:

```tsx
// app/dashboard/page.tsx
import { DashboardPage } from 'src/dashboard/dashboard.index';
export { generateMetadata } from 'src/dashboard/dashboard.script';

export default DashboardPage;
```

The page implementation, metadata, fetching, and JSX live entirely in `src/dashboard/`.

---

## 5. Naming Conventions

The suffix conventions (`Comp`, `Page`, `Type`, `Enum`) are intentional — they disambiguate identifiers in IDE autocomplete when the same base name maps to multiple roles (component vs. type vs. enum).

### Identifiers

| Kind                                                                        | Convention                           | Example                           |
| --------------------------------------------------------------------------- | ------------------------------------ | --------------------------------- |
| CSS classes                                                                 | `kebab-case`, single-word preferred  | `.card`, `.title`, `.icon`        |
| SCSS variables                                                              | `camelCase`                          | `$primaryColor`                   |
| Non-exported variables / functions                                          | `camelCase`                          | `formatPrice`                     |
| Exported non-component, non-type values (constants, plain helper functions) | `PascalCase`                         | `BackendURLGen`, `FormatCurrency` |
| Function components in `*.index.tsx`                                        | `<PascalCase>Comp`                   | `UserCardComp`                    |
| Page components in `page.tsx`                                               | `<PascalCase>Page`                   | `DashboardPage`                   |
| Types in `*.type.ts`                                                        | `<PascalCase>Type` (exported or not) | `UserType`                        |
| Enums in `*.type.ts`                                                        | `<PascalCase>Enum` (exported or not) | `UserRoleEnum`                    |
| Object fields (project-internal)                                            | `camelCase`                          | `firstName`                       |
| Object fields (backend-shaped, on API request/response types)               | preserve backend casing              | `created_at`, `is_phone_active`   |

**On single-word CSS class names.** Default to a one-word class name in module SCSS — `.card`, `.title`, `.icon`, `.wrapper`, `.action`. CSS Modules hash the source name into a globally-unique identifier at build time, so the name in your SCSS file doesn't need to encode uniqueness across the codebase, and the JS consumer reads cleaner as `styles.card` than `styles['user-card']`. A well-designed component is small enough that 3–5 short class names cover everything; multi-word names usually signal that the component is either disambiguating siblings that don't need it (rename them shorter) or doing too much (split it). Multi-word `kebab-case` (`.search-button`, `.icon-trigger`) is the fallback for the rare case where a single word genuinely doesn't capture the concept.

### Exports & autocomplete hygiene — the `__` rule

The goal is to keep IDE autocomplete signal high: a name should appear in suggestions only when it's actually intended to be imported from where the suggestion is shown. The mechanism is a leading `__` on names that should NOT propagate as suggestions outside their intended scope.

| Case                                                                                                                                                                                                       | Convention                                                                                                                                                                                                                                                               | Why                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Reusable resource exposed via a folder barrel** (`src/components/index.ts`, `src/utilities/index.ts`, `src/types/index.ts`, `src/components/<x>/index.ts` if the component itself is a folder of pieces) | Inside the folder, files export `__PascalCase` private names. The barrel does `import __X from "..."; export { __X as X };`. Consumers see only `X`.                                                                                                                     | `__X` never auto-suggests outside the barrel; consumers get a clean, suffix-disambiguated name                                                                                                                                                                                                                                                                                                                                             |
| **Single component file** (`*.index.tsx`, `page.tsx`)                                                                                                                                                      | `export default XComp;` — no `__` rename                                                                                                                                                                                                                                 | The `Comp` / `Page` suffix already makes the name specific; default exports are referenced by the importer's local name anyway                                                                                                                                                                                                                                                                                                             |
| **Feature-internal helpers shared across files in one folder** (`*.data.ts`, `*.script.ts`, `*.type.ts` consumed only by the same feature's `*.index.tsx`)                                                 | Exported as `__name` and imported as `__name` within that folder                                                                                                                                                                                                         | Marks "do not import from outside this folder"; if AI accidentally suggests it elsewhere, the `__` is a visible warning sign                                                                                                                                                                                                                                                                                                               |
| **`scripts/` and `models/` files**                                                                                                                                                                         | Directly export PascalCase values; **NO barrel re-export** at the `scripts/` or `models/` level. Consumers import from the specific module path: `import { ClientFetch } from "scripts/clientFetch";`, `import { workspaceAPI, WorkspaceType } from "models/workspace";` | Two reasons. **(a)** A script may be server-only or client-only; a single barrel that pulls every script in would force the wrong runtime context onto importers. Splitting per-file lets each importer pick exactly what they need. **(b)** Models change frequently during development; a barrel re-export retriggers dev-mode rebuilds across every file that imports from `models/`. Direct-path imports keep the rebuild graph narrow |

In short: `__` is the autocomplete-quiet marker, used only in barrel `index.ts` files and feature-internal helpers. Single component files and reusable scripts/models export their names directly — their suffix conventions and specific module paths already keep autocomplete clean.

### Files and folders

| Kind                                  | Convention                                                 | Example                           |
| ------------------------------------- | ---------------------------------------------------------- | --------------------------------- |
| Files and folders under `src/`        | `camelCase`                                                | `userCard/`, `useAuth.ts`         |
| Folders under `app/` (project routes) | `kebab-case`                                               | `app/user-settings/`              |
| Dynamic route segments                | `camelCase` inside brackets                                | `app/users/[userId]/`             |
| Catch-all route                       | `[...param]`                                               | `app/docs/[...slug]/`             |
| Optional catch-all                    | `[[...param]]`                                             | `app/[[...slug]]/`                |
| Per-page folder files                 | `{pageName}.index.tsx`, `{pageName}.module.scss`, etc.     | See §4                            |
| Hook files                            | `use<PascalCase>.ts` (identifier matches file)             | `useAuth.ts`                      |
| Static data files                     | Must include the feature, directory, or functionality name | `sidebarLinks.ts` (not `data.ts`) |

---

## 6. Code Organization & Size Limits

These hard limits apply to every file and function. They are enforced via ESLint where possible (§22). The remaining limits are review-time rules.

| Constraint                                                                        | Limit     | Enforcement |
| --------------------------------------------------------------------------------- | --------- | ----------- |
| Component file (`*.index.tsx`, `page.tsx`, `layout.tsx`)                          | 250 lines | ESLint      |
| Function                                                                          | 70 lines  | ESLint      |
| Non-component JSX/TSX file (`*.script.ts`, `*.data.ts`, `*.lang.ts`, `*.type.ts`) | 220 lines | ESLint      |
| `useState` declarations per component                                             | 12        | Review      |
| Inline arrow functions inside JSX                                                 | 4         | Review      |
| SCSS file                                                                         | 220 lines | Review      |
| SCSS nesting depth                                                                | 5 levels  | Review      |

When you hit a limit, split — don't shrink. Extract a subcomponent, a hook, a data file, or a script module. Folder structure must reflect component design.

---

## 7. Component Code Order

Inside every component (`*.index.tsx`, `page.tsx`), declarations must appear in this order:

1. Imports
2. State declarations (`useState`)
3. Refs (`useRef`)
4. Effects (`useEffect`, `useLayoutEffect`)
5. Return JSX

Hook calls (`useMemo`, `useCallback`, custom hooks) belong with the bucket they relate to. Pure logic and handlers should live in `*.script.ts`, not in the component body.

---

## 8. TypeScript

- **Avoid `!` (non-null assertion).** Prefer narrowing or schema parsing.
- **Avoid `as` type assertions** for the same reason — both bypass the type system. Acceptable narrowings: `typeof`, `in`, custom type guards, schema parsing (e.g., Zod) at boundaries.
- **Prefer `unknown` over `any`** for values of unverified shape; narrow before use.
- **States with default values do not need explicit types.** Let TS infer.
- **Use discriminated unions over optional + flag props.** When a value or prop has mutually exclusive shapes (e.g., async state, button-vs-link variants), model it as a discriminated union with a literal `kind` / `status` field per variant — NOT optional fields plus a boolean flag.

  ```ts
  // Bad: optional + flag — invalid combinations are representable
  type Result = {
    isLoading: boolean;
    isError: boolean;
    data?: User;
    error?: Error;
  };

  // Good: discriminated union — TS narrows correctly
  type Result = { status: 'loading' } | { status: 'error'; error: Error } | { status: 'success'; data: User };

  if (result.status === 'success') {
    result.data; // typed as User, no optional chaining
  }
  ```

- **Import React APIs as named imports** (`import { useState, useEffect } from 'react'`). Do not namespace-import React (`import React from 'react'`) unless a JSX-pragma legacy file requires it.

---

## 9. Server vs Client Components

The App Router defaults to Server Components. Treat that as the rule, not an option.

- **Default to Server Components.** Add `'use client'` only at the leaf node that requires interactivity, browser-only APIs, or React state/effects.
- **Never place `'use client'` on a layout or page if a child can carry it.** Push the boundary down.
- **Mark Client Components explicitly.** The first non-comment line MUST be `'use client'`. Server Components MUST NOT carry it.
- **Enforce module boundaries:**
  - `import 'server-only'` at the top of any module that must not reach the client (DB clients, secrets, server SDKs, internal services).
  - `import 'client-only'` at the top of any module that must not run on the server (browser-only APIs, certain libraries).
- **Props crossing the Server → Client boundary must be serializable.** No functions, no class instances, no `Map` / `Set`, no raw `Date` (convert to ISO string).

---

## 10. Required Route Segment Files

Every route segment that fetches data MUST provide:

| File            | Required when                                  | Notes                                                    |
| --------------- | ---------------------------------------------- | -------------------------------------------------------- |
| `loading.tsx`   | The segment fetches data                       | Renders during the initial Suspense boundary             |
| `error.tsx`     | The segment can throw or fetch fails           | MUST be a Client Component; MUST expose a `reset` action |
| `not-found.tsx` | The segment renders content that may not exist | Triggered via `notFound()`                               |

```tsx
// app/<segment>/error.tsx
'use client';

export default function ErrorBoundaryComp({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  // Show user-facing message and a retry control
  return (...);
}
```

---

## 11. Data Fetching

The project provides two fetch wrappers — a **server-side** wrapper used inside Server Components and Route Handlers, and a **client-side** wrapper used inside Client Components. **Never call raw `fetch` from application code.** The wrappers handle auth headers, retries, error normalisation, logging, and (on the server) cache strategy. The actual wrapper names and APIs are documented in [`TECHNICAL_REFERENCE.md`](TECHNICAL_REFERENCE.md) and in their folder READMEs under `src/scripts/`.

The rule below is stack-agnostic; the names of the wrappers in this project are the only project-specific bit.

### Server Components — reads

- Fetch through the project's **server-side fetch wrapper**. Pass an explicit caching strategy on every call (static, time-based, tag-based, or no-store) — never rely on framework defaults.
- The wrapper attaches auth cookies and standardises the response envelope. Don't call `fetch()` directly inside a Server Component.

### Client Components — reads (rendering data fetched on mount)

- Use **TanStack Query** with the project's client-side fetch wrapper as the `queryFn`. Never call `fetch` or the wrapper directly inside `useEffect` for the purpose of populating render state.
- **Raw `useEffect(() => fetch(...))` for data fetching is forbidden** — no caching, no dedup, no error/loading primitives.
- Until a feature actually needs a list / detail read on mount, TanStack Query does not need to be wired up. Don't add it pre-emptively.

### Client Components — writes (event-handler-driven mutations)

- Call the **client-side fetch wrapper directly inside the handler**. Forms and click handlers are not "rendered data" — they don't belong in TanStack Query.
- Pair every fetch-triggering button with the project's async-click hook (see `TECHNICAL_REFERENCE.md`) so the loading state is automatic; do **not** add a separate `useState<boolean>` for "submitting".
- Display a user-facing message on both success and failure for user-initiated mutations.

### After a successful mutation

- Revalidate the affected paths/tags via `revalidatePath('/path/')` / `revalidateTag('tag')` on the server, or invalidate the relevant query keys (`queryClient.invalidateQueries`) on the client.
- Server Actions are acceptable for declarative mutations; otherwise the client-side fetch wrapper is the path.

---

## 12. State Management

- **Local first.** Use `useState` / `useReducer` until shared state is genuinely needed.
- **There is no global "store" or "context" folder.** Cross-component state (currently authenticated user, theme, locale, etc.) is solved via the **provider + `useSTH` pattern** described below — one provider component per concern, mounted at the level where that state is needed.
- **All declared `useState` MUST be read in render or effects.** Otherwise convert to `useRef`.

### The provider + `useSTH` pattern

Each piece of shared state lives in its own component folder (e.g. `src/components/profileProvider/`):

```
profileProvider/
├── profileProvider.index.tsx   # the Provider component, owns state
├── profileProvider.script.ts   # exports useProfile() — the consumer hook
├── profileProvider.type.ts     # types for the context value and props
└── README.md
```

Rules:

1. **One provider per concern.** Don't multiplex unrelated state through one provider — that's just a global store with extra steps.
2. **Mount the provider at the smallest useful boundary.** Profile lives at the app root because every page reads it. A "panel theme switcher" lives only inside the panel layout.
3. **The consumer hook (`useSTH`) throws if no provider is mounted above.** This converts a runtime "value is `undefined`" bug into a startup error with a useful stack.
4. **The hook is the only public surface.** Don't expose the underlying React Context object — hide it as a `__`-prefixed internal symbol so consumers can't subscribe outside the hook contract.
5. **Functions are allowed in the context value** (sign-out callbacks, refreshers, etc.). The "no functions in global state" rule from older Redux-shaped guidance does not apply here — providers are explicitly per-instance.
6. **Don't push render-state into a provider.** If only the parent and a single child read a value, that's prop-drilling territory — keep it as `useState` in the parent.

---

## 13. Forms

- Use **Ant Design `Form`** or a validator library (e.g., Zod + React Hook Form) for any form with more than one field or any validation.
- For ad-hoc cases without a library, use **single-stage validation** on `onFinish` over the whole form values — no per-field manual validation scattered across handlers.
- Schemas live in `*.script.ts` or `*.data.ts`, not inline in JSX.

---

## 14. Styling

- Use **SCSS Modules** for component styles. One `*.module.scss` per component.
- **Inline CSS (`style={...}`)** is permitted only for a single property OR a value that is dynamic at render time.
- **Default to utility classes for layout-only styling.** If an element's styling is entirely **spacing** (margin / padding / gap), **alignment** (flex / grid centering, `justify-*`, `align-*`), **display** (`d-flex`, `d-block`, `d-none`, …), or **text** (font size, weight, color, alignment, decoration) — or any combination of these — rely on the global utility classes in [`src/utilities/styles/`](../src/utilities/styles/) (inventoried in [`TECHNICAL_REFERENCE.md §4.2`](TECHNICAL_REFERENCE.md#42-utility-classes)). Do NOT create a `*.module.scss` class for styling that falls entirely within these categories. A module class is for styles utilities don't cover: custom backgrounds, borders, transitions, positioning, component-specific sizing, or any value that isn't a token in the scale.
- **Trivial styling uses utility classes; long utility strings move into the module.** Even outside the "layout-only" case above, when a few classes (≤5) cover the styling, apply them directly in TSX instead of creating a one-line SCSS class. Past 5 utility classes on a single element the rule inverts: the `className` string becomes unreadable, so move the styles into the component's `*.module.scss`. The goal is to avoid both extremes — neither ad-hoc SCSS classes that reinvent utilities, nor long utility-class strings that turn TSX into a stylesheet.
- **Snap to the spacing / typography scale.** When a design specifies a margin, padding, gap, font-size, or similar value that falls within ~25% of an existing utility-token step, use the existing token. Don't write custom CSS for a 2–3px difference — design tolerance is not pixel-exact, and ad-hoc values dilute the design system. Values that land closer to halfway between two tokens (>25% off both sides) are a real design decision: confirm with the designer or propose a new token rather than inlining a one-off.
- **Tag selectors must be nested.** Never put a bare tag selector (e.g., `span { ... }`) at the root of a module file — it leaks via specificity reasoning to readers. Wrap in a class.
- **Nesting depth ≤ 5 levels.**
- **Avoid duplicate elements for responsive design.** Use CSS to switch layout, not React conditionals that render two trees.
- **Ant Design customizations** must go through the AntD theme config or a global CSS file. Don't override AntD class names from inside component modules.
- **Style overrides into a child component's internals are forbidden.** Expose a `className` / `classNames` prop on the child instead.
- A parent's style modification of a child must total under 15 lines; beyond that, the child needs a real prop API.

---

## 15. Performance

- **Isolate dynamic content in the smallest possible component** so re-renders stay local.
- **Minimize dynamic props and state** to reduce re-renders.
- **Use `useCallback` properly** — only when the callback is passed to a memoized child or used as a dependency. Wrapping every handler is noise.
- **Every fetch-triggering button MUST show a loading state on click.**
- **Loading states are mandatory** wherever data is being fetched.
- **Empty states are mandatory** wherever a list / detail view can be empty.
- **Error states are mandatory** wherever a fetch can fail.
- **Use `next/image`** for all bitmap images. Set `priority` on the LCP image. Set `sizes` on responsive images.
- **For image fields with missing data, use icons as placeholders.**
- **Minimize DOM depth.** Avoid wrappers with only one child.

---

## 16. SEO

- **Page titles MUST be set via `generateMetadata`.** Do not hard-code `<title>` in JSX.
- **OG / Twitter card metadata** MUST be set via `generateMetadata` for any page reachable from social shares.
- **`robots.ts` and `sitemap.ts` MUST exist** at the project root (`app/robots.ts`, `app/sitemap.ts`).
- **Canonical URLs** MUST be declared via `generateMetadata` for any route reachable through multiple paths.
- **Content pages** (articles, products, listings, profiles) MUST emit JSON-LD structured data appropriate to their `schema.org` type.
- **Semantic HTML.** Exactly one `<h1>` per page. Use `<h2>`–`<h6>`, `<span>`, or `<label>` for non-heading titles. Use `<p>` only for prose paragraphs.
- **Prevent layout shift.** Pre-size images and reserved spaces.
- **All images MUST include a meaningful `alt`.** Decorative-only images use `alt=""`.
- **All URLs (routes, API calls, asset paths) end with `/`.** Configure `trailingSlash: true` in `next.config.ts`.

---

## 17. Accessibility

- **Every interactive element MUST be reachable and operable via keyboard** (Tab / Shift+Tab to traverse, Enter / Space to activate, Esc to dismiss overlays).
- **Manage focus on route changes and modal/dialog open/close.** Return focus to the triggering element when an overlay closes.
- **Use semantic landmark elements:** `<main>`, `<nav>`, `<header>`, `<footer>`, `<aside>`. Exactly one `<main>` per page.
- **Images include `alt` attributes** (covered in §16).

---

## 18. Security

- **Never include API keys or tokens in source code.** All secrets come from environment variables.
- **Only `NEXT_PUBLIC_*` env vars may be referenced from Client Components.** Anything else must stay in Server Components / Server Actions / route handlers.
- **Never log sensitive data** (tokens, passwords, PII) — including via `console.*`.

---

## 19. Documentation

- **Every reusable resource MUST ship a `README.md`** — that includes reusable components, reusable hooks/scripts that aren't single-file-obvious, models, and utility folders. The README covers:
  - Title and description
  - Public surface (props, exported functions, hook return shape — whatever applies)
  - Usage example
  - Description of subfolders/files
  - Notes (rationale, gotchas, RTL/UI specifics)
  - To-do list
- **`src/scripts/README.md`** must list every script in the folder with a one-paragraph description, even when individual scripts don't have their own folder. For multi-file scripts (e.g. fetch wrappers), each script-folder also gets its own README.
- **`src/models/README.md`** introduces the model concept and gives a one-paragraph description of each model's responsibility (not a field list — the type is the field list).
- **Every function (except trivial inline ones) MUST include at least one comment line** explaining what it does or why.
- **Non-obvious or business-critical logic MUST have explanatory comments.**

---

## 20. General Coding Standards

These are the cross-cutting rules. Every change must respect them.

- **No `console.log`, `console.error`, or debug output** in committed code. Use a project logger if observability is needed.
- **No class components.** Functional components only.
- **Conditions:** max 3 statements OR fits on one line. Otherwise, extract to a named variable.
- **Callback arguments:** one line, or extracted to a named variable.
- **All URLs end with `/`** (routes, API calls, asset paths).
- **Reuse the project's existing scripts before writing your own.** The inventory lives in `src/scripts/README.md` and `TECHNICAL_REFERENCE.md`; an async-click hook, fetch wrappers, URL generators, etc. already exist. Re-implementing them is a violation.
- **Reused values become constants.** If a number or string appears more than once, define it as a constant (enum, magic number).
- **API URLs and resource types live in `src/models/<resource>.ts`**, not in a global path map. Import them from the specific model module (`import { workspaceAPI, WorkspaceType } from "models/workspace";`).
- **Frontend route paths live in `src/models/<resource>.ts`** too, next to the API URLs and types. Each model exposes a single `<resource>Path` object: static routes are string properties (`workspacePath.list`), dynamic routes are function properties that take params and return the path (`workspacePath.detail(id)`). Every internal `href`, `router.push()`, and `redirect()` call MUST import its path from the model — no hard-coded route strings at the call site, no string concatenation to build a dynamic route by hand. External URLs (`https://...`) and anchor fragments (`#section`) are not model concerns and can be inline.
- **Static lists/data live in `*.data.ts`** — never inline in JSX.
- **Backend-shaped fields preserve backend casing.** Types describing API request/response payloads keep `snake_case` (`created_at`, `is_phone_active`, `member_workspaces`). Don't camelCase-rename them at the type boundary; the backend contract is the source of truth, and silent rewrites cause subtle bugs at fetch sites.
- **Use AntD components for any UI control AntD provides** — `Button`, `Input`, `Select`, `Checkbox`, `Radio`, `Switch`, `Form`, `Modal`, `Drawer`, `Menu`, `Table`, `Tabs`, etc. Raw `<button>` / `<input>` / `<select>` styled with custom CSS are forbidden for app-internal controls. The project has theme-customized the relevant AntD components via the root `ConfigProvider` (see [`TECHNICAL_REFERENCE.md` §10](TECHNICAL_REFERENCE.md#10-customized-antd-controls)) — **what AntD renders IS the design.** Reaching for raw HTML to "make it match the mockup" actively breaks the design system; if a needed visual variant isn't expressible through the theme, extend the theme rather than fork into raw HTML.
- **For a button that navigates, wrap an AntD `<Button>` inside Next.js `<Link>`** (from `next/link`). Do NOT use AntD's built-in `Button href` prop — it renders a plain `<a>` and triggers a full page reload, bypassing Next.js client-side routing and prefetching.
- **Client Components MUST be explicitly marked with `'use client'`** as the first non-comment line.
- **Build MUST compile without errors or warnings.**
- **Layout MUST be responsive.**

---

## 21. Anti-Patterns

The following are bugs whenever they appear. AI assistants MUST flag them and refuse to introduce them.

| Anti-pattern                                                                                              | What's wrong                                                                                   | Do this instead                                                                                                                  |
| --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `'use client'` on a layout or root page                                                                   | Forces every child to bundle for the client                                                    | Move it to the leaf that needs interactivity                                                                                     |
| Raw `fetch()` from application code                                                                       | Skips auth headers, retries, error normalisation, logging                                      | Use the project's server-side or client-side fetch wrapper (§11)                                                                 |
| `useEffect(() => fetch(...))` for data                                                                    | No caching, no dedup, no error/loading primitives                                              | TanStack Query (client reads) or Server Component (server reads); event-handler mutations call the client fetch wrapper directly |
| Separate `useState<boolean>` for a button's loading state                                                 | Reinvents the project's async-click hook                                                       | Use the project's async-click hook                                                                                               |
| Business logic in `app/*/page.tsx`                                                                        | Couples routing to logic                                                                       | Thin shim that imports from `src/<page>/`                                                                                        |
| Inline `as` or `!`                                                                                        | Bypasses type system                                                                           | Narrow with `typeof` / `in` / type guards / Zod                                                                                  |
| Optional fields + boolean flag for variants                                                               | Invalid states are representable                                                               | Discriminated union with `kind` / `status`                                                                                       |
| `useState` whose value is never read in render or effect                                                  | Adds noise and re-renders                                                                      | `useRef`                                                                                                                         |
| Re-introducing a `src/context/`, `src/store/`, or other global state folder                               | Replaced by the provider+`useSTH` pattern (§12)                                                | One provider component per concern, mounted at the smallest useful boundary                                                      |
| Re-introducing a global API-paths map (e.g. `src/data/apiPaths.ts`)                                       | Replaced by per-resource models                                                                | Each resource owns its URLs + types in `src/models/<resource>.ts`                                                                |
| Re-exporting scripts or models through a top-level barrel (`src/scripts/index.ts`, `src/models/index.ts`) | Mixes server-only and client-only modules; retriggers dev rebuilds across importers            | Import from the specific module path                                                                                             |
| Style overrides reaching into a child's class names                                                       | Breaks encapsulation                                                                           | Expose a `className` prop on the child                                                                                           |
| A `*.module.scss` class for styling that is entirely spacing / alignment / display / text                 | Reinvents utilities inside the module; ignores the design system                               | Apply the utility classes in TSX directly (see §14)                                                                              |
| A one-line SCSS class for styling that ≤5 utility classes would already cover                             | Reinvents the design system inside `*.module.scss`                                             | Apply the utility classes in TSX directly                                                                                        |
| Custom margin / padding / gap / font-size within ~25% of a scale token                                    | Dilutes the design system for sub-pixel design differences                                     | Snap to the nearest token                                                                                                        |
| Raw `<button>` / `<input>` / `<select>` styled with custom CSS where AntD has the equivalent              | Sidesteps the theme-customized AntD control that already matches the design                    | Use the AntD component; the theme handles the look (see TECHNICAL_REFERENCE §10)                                                 |
| AntD `<Button href="...">` for app-internal navigation                                                    | Renders a plain `<a>`, triggering a full page reload instead of Next.js client-side navigation | Wrap the AntD `<Button>` inside Next.js `<Link>` (from `next/link`)                                                              |
| Hard-coded internal `href` string (`href="/dashboard/"`, ``href={`/workspaces/${id}/`}``)                 | Bypasses the model — route shape isn't single-sourced and can drift between call sites         | Import the path from the resource's model (`workspacePath.list`, `workspacePath.detail(id)`)                                     |
| Wrapper element with a single child                                                                       | Pollutes the DOM                                                                               | Render the child directly                                                                                                        |
| Two duplicated trees for responsive design                                                                | Doubles the DOM                                                                                | One tree, switched via CSS                                                                                                       |
| `console.log` left in committed code                                                                      | Noise; potential PII leak                                                                      | Remove, or use the project logger                                                                                                |
| Non-`NEXT_PUBLIC_*` env vars referenced from Client Components                                            | Leaks server secrets to the browser                                                            | Read in Server Components / Server Actions only                                                                                  |
| Hard-coded `<title>` in JSX                                                                               | Bypasses Next.js metadata pipeline                                                             | `generateMetadata`                                                                                                               |

---

## 22. ESLint Size Limit Enforcement

The line/function limits in §6 are enforced by ESLint. Add the following to the project's flat-config ESLint setup:

```js
// eslint.config.mjs (flat config)
export default [
  // ...other config
  {
    rules: {
      'max-lines-per-function': [
        'error',
        {
          max: 70,
          skipBlankLines: true,
          skipComments: true,
          IIFEs: true,
        },
      ],
      complexity: ['warn', 10],
    },
  },
  {
    files: ['**/*.index.tsx', '**/page.tsx', '**/layout.tsx'],
    rules: {
      'max-lines': [
        'error',
        {
          max: 250,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
    },
  },
  {
    files: ['**/*.script.ts', '**/*.data.ts', '**/*.lang.ts', '**/*.type.ts'],
    rules: {
      'max-lines': [
        'error',
        {
          max: 220,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
    },
  },
];
```

**Limits NOT covered by built-in ESLint rules — review-time only until a custom plugin is added:**

- `useState` count per component: 12
- Inline arrow functions inside JSX: 4
- SCSS file size: 220 lines (Stylelint has no built-in line cap)

---

## 23. AI Coding Instructions

When AI generates, edits, or reviews frontend code, it MUST follow these rules:

1. **Respect the `/src` vs `/app` boundary.** Never put logic in `/app`. If a `page.tsx` contains anything beyond a thin shim, refactor it into `src/<page>/`.
2. **Default to Server Components.** Only add `'use client'` at the leaf that genuinely needs it. Justify every `'use client'` you add.
3. **Match existing patterns in the codebase.** If a feature already uses a pattern, follow it. Don't introduce a second way of doing the same thing.
4. **Honor the file split.** State and business logic go in `*.script.ts`, types in `*.type.ts`, static data in `*.data.ts`, JSX in `*.index.tsx`. Don't merge them. (`*.lang.ts` only exists in multi-locale projects.)
5. **Honor the size limits.** When a file is at the limit, split — don't shrink by deleting comments or compressing whitespace.
6. **Never weaken types.** No `any` without a `// VIOLATE:` comment explaining why. No `as` to silence the compiler. Prefer narrowing or schema parsing.
7. **Never introduce data-fetching anti-patterns.** No `useEffect(fetch)`. No fetching in `/app/*/page.tsx`. No missing `cache` / `revalidate` choice.
8. **Add loading, error, and empty states** for any new fetch-driven view.
9. **Follow the naming conventions exactly,** including the suffix rules (`Comp`, `Page`, `Type`, `Enum`).
10. **Never introduce security regressions.** No secrets in client code. No non-`NEXT_PUBLIC_*` env vars referenced from Client Components.
11. **Follow the anti-patterns list (§21).** If you spot an existing anti-pattern in nearby code, flag it but do not fix it unless explicitly asked.
12. **When unsure about scope, ask.** Don't invent components, fields, or routes the docs don't describe. Per `AGENTS.md`: "Don't invent."

---

## 24. Definition of Done

A frontend task is considered **done** when:

- [ ] Build compiles without errors or warnings.
- [ ] All affected route segments render loading, error, empty, and success states.
- [ ] Server-vs-Client boundary is correct (`'use client'` only where needed).
- [ ] Data fetching uses Server Components or TanStack Query / SWR — no `useEffect(fetch)`.
- [ ] Mutations revalidate the right paths/tags.
- [ ] Page metadata is set via `generateMetadata`.
- [ ] Layout is responsive and verified at common breakpoints.
- [ ] Accessibility verified: keyboard reachable, focus managed on transitions, semantic landmarks present.
- [ ] No `console.*`, no `any`, no `!`, no unjustified `as`.
- [ ] Naming, file split, and size limits respected.
- [ ] No secrets, debug code, or hard-coded URLs.

---

## 25. Checklist: Before Submitting Code

**Architecture & code layout**

- [ ] All UI/logic lives under `src/`; `app/` files are thin shims
- [ ] Single component exported per `.tsx` file
- [ ] Per-feature folder uses the file split (`*.index.tsx`, `*.script.ts`, `*.type.ts`, `*.data.ts`, `*.module.scss`; `*.lang.ts` only when multi-locale)
- [ ] File and folder names follow §5
- [ ] Component code order: imports → state → refs → effects → JSX
- [ ] File size limits respected (§6); ESLint passes
- [ ] No `useState` whose value is never read

**App Router & data**

- [ ] Server Components by default; `'use client'` only at the leaf
- [ ] No `'use client'` on a layout/root page that doesn't need it
- [ ] Server-only modules carry `import 'server-only'` where applicable
- [ ] Every `fetch` in a Server Component sets `cache` / `revalidate` / `tags` explicitly
- [ ] Client data fetching uses TanStack Query / SWR
- [ ] Mutations revalidate the affected paths/tags
- [ ] `loading.tsx`, `error.tsx`, `not-found.tsx` exist for data-fetching segments
- [ ] `error.tsx` is a Client Component and exposes `reset`

**TypeScript**

- [ ] No `any`, no `!`, no unjustified `as`
- [ ] Mutually exclusive shapes modeled as discriminated unions
- [ ] `unknown` over `any` for untyped boundaries

**UI quality**

- [ ] Loading, error, and empty states implemented and rendered
- [ ] Every fetch-triggering button shows a loading state on click
- [ ] User-facing message on success and failure for user-initiated mutations
- [ ] Layout is responsive
- [ ] No layout shift; images sized; LCP image has `priority`
- [ ] Single `<h1>` per page; semantic landmarks present
- [ ] All images have `alt`
- [ ] Keyboard navigation works; focus is managed on overlay open/close
- [ ] AntD components used for every control AntD covers; no raw `<button>` / `<input>` / `<select>` with custom CSS for app-internal controls
- [ ] Navigation buttons wrap an AntD `<Button>` inside Next.js `<Link>` — no `<Button href>`

**SEO**

- [ ] `generateMetadata` sets title, description, OG, Twitter card, canonical
- [ ] `robots.ts` and `sitemap.ts` exist
- [ ] JSON-LD on content pages

**Styling**

- [ ] One `*.module.scss` per component
- [ ] No bare tag selectors at the root of module files
- [ ] Nesting ≤ 5 levels
- [ ] AntD overrides via theme config or global CSS, not local modules
- [ ] No style overrides reaching into child internals (use a `className` prop)
- [ ] Layout-only styling (spacing / alignment / display / text, or a combination) is done with utility classes from `src/utilities/styles/`, not a `*.module.scss` class
- [ ] Trivial styling (≤5 properties) uses utility classes in TSX, not a one-line SCSS class; long utility strings (>5) moved into `*.module.scss`
- [ ] Spacing / typography values snap to the scale within ~25% tolerance — no custom px for 2–3px design differences

**Quality**

- [ ] No `console.*`
- [ ] All URLs end with `/`
- [ ] Reused values extracted to constants
- [ ] Static data lives in `*.data.ts`
- [ ] Internal `href` / `router.push()` / `redirect()` values come from the relevant model's path object — no hard-coded route strings, no manual concatenation for dynamic routes
- [ ] Reusable components have a `README.md`
- [ ] Functions and non-obvious logic have comments
- [ ] No `// VIOLATE:` comments without a clear, specific justification
