# CLAUDE.md — ICCU Access Card UI (React)

Strict, repository-aware rules for Claude Code. If a request conflicts with this file, follow this file.
If a request is ambiguous, choose the option that keeps the structure below simple and consistent.

Frontend for the reader registration and 85 × 55 mm access-card system of the library of
O'zbekiston Islom sivilizatsiyasi markazi. The backend (.NET 10) lives in a separate repository
(`D:\Projects\iccu-access-card`). The rules are the user's `tofan-ui` (Angular) rules moved to React.

Read before larger changes:

- [docs/backend-contract.md](docs/backend-contract.md): every endpoint, DTO, enum, error code and validation rule
- [docs/architecture.md](docs/architecture.md): structure, decisions and the reasons behind them
- [docs/roadmap.md](docs/roadmap.md): stages, status, open questions

Docs are written in Uzbek (Latin). Keep new docs and doc edits in Uzbek, in the same plain style.

## 1. Stack

- React 19, Vite, TypeScript (strict), React Router (data router, lazy routes)
- Tailwind CSS 4 + shadcn/ui (`radix-nova` style, `radix-ui`, `cn` package, lucide icons) in `src/shared/ui`
- TanStack Query (server state), TanStack Table (server-side paging and sorting)
- React Hook Form + Zod, `@microsoft/signalr`, Recharts, react-easy-crop
- Vitest + Testing Library + jsdom, ESLint (typescript-eslint strict, type-checked), Prettier, Sheriff
- npm. **No new dependency without asking the user first.**

## 2. Commands

```bash
npm run dev             # Vite on :5173, /api is proxied to http://localhost:5080 (backend)
npm run build           # tsc -b && vite build (must pass before finishing a task)
npm test                # Vitest (app: jsdom, scripts: node)
npm run lint            # eslint + lint:comments + lint:boundaries + format:check (must pass)
npm run lint:comments   # fails on any comment in any project file
npm run lint:boundaries # sheriff verify: fails on an import that breaks the table in 3.1
npm run format          # prettier --write .
npx shadcn@latest add <component>   # lands in src/shared/ui
```

After every task: run `lint`, `test`, `build`. Fix what you broke. Never disable a rule to make it pass.
There is no mock backend: the dev server needs the real backend (`dotnet run --project src/Iccu.Api`
in the backend repo; local users in `docs/backend-contract.md`, section 9).

## 3. Architecture (non-negotiable)

Feature-based structure. **No Clean Architecture layers** (no domain/application/infrastructure folders,
no repository abstractions, no use-case classes). It is a UI project; keep it flat and readable.

```text
src/
  main.tsx                  entry, renders <App />
  app/                      App, providers (QueryClient, auth, i18n), router
  routes/app-routes.tsx     top-level routes, every feature lazy
  core/                     app-wide singletons, never feature-specific
    http/                   api-client (fetch), ApiError, Result and PagedList types, paging query
    auth/                   in-memory session, AuthProvider, useAuth, single-flight refresh, RequireRole
    realtime/               SignalR connection (registrations hub)
    layout/                 admin shell, sidebar (menu by role), public layout
    feedback/               toast, confirm dialog, error → message
    i18n/                   dictionaries (uz, ru, en), typed keys, useT, date format (Asia/Tashkent)
  shared/                   business-agnostic, usable by any feature
    ui/                     shadcn/ui components (generated, then owned by us)
    components/             data-table, authorized-image, photo-cropper, file-download
    person-details/         PersonDetails form fields + Zod schema (used by 3 features)
    models/                 enums with labels, PagingState
    utils/                  pure functions
  features/
    auth/ public-registration/ registration-requests/ readers/ dashboard/ reports/ users/ not-found/
```

Inside a feature:

```text
features/readers/
  pages/readers-page.tsx, reader-page.tsx, reader-form-page.tsx
  components/reader-filters.tsx
  models/reader.ts, reader-filter.ts, reader-form.schema.ts
  api/readers.dto.ts         backend response, exact shape
  api/readers.mapper.ts      DTO ↔ model
  api/readers.service.ts     HTTP functions, only through core/http
  api/readers.queries.ts     TanStack Query hooks and query keys
  readers.routes.tsx         lazy routes of the feature
```

Every feature, even a single-page one, keeps its routed components in `pages/` and exports its routes
from `<feature>.routes.tsx`; `routes/app-routes.tsx` only lazy-loads them.

### 3.1 Dependency direction

| Folder | May import | Must NOT import |
|---|---|---|
| `app` | `routes`, `core`, `shared` | `features` |
| `core` | other `core/` folders, `shared` | `features` |
| `shared` | `shared`, `core/http`, `core/feedback`, `core/i18n` | `features`, other `core/` folders |
| `features/<x>` | `core`, `shared`, its own files (relative imports) | other features |
| `routes` | `features` (their `*.routes.ts`, pages load lazily), `core/auth`, `core/layout`, `core/config` | `shared` |

- Enforced by Sheriff (`sheriff.config.ts`, `npm run lint:boundaries`), which follows the real file an
  import resolves to, so relative imports across folders are caught too. Sheriff walks from
  `src/main.tsx`, so test files are not checked by it; ESLint `no-restricted-imports` repeats the rules
  for aliases and shows them in the editor.
- Inside a feature use relative imports; across folders use `@core/*`, `@shared/*`, `@features/*`.
- If two features need the same code, move it to `shared/` (or `core/` if it is an app singleton).
  A feature may call an endpoint that "belongs" to another screen through its own service and DTO.
- Each feature must stay removable: deleting `features/<x>` breaks only its route entry and menu item.

### 3.2 Flow

```text
page / component  →  queries hook  →  service  →  core/http api-client  →  /api
       ↑ model            ↑ mapper(dto)
```

- Components never call `fetch` or a service. They use hooks from `api/<feature>.queries.ts`.
  The exceptions are the `shared/components` whose whole job is transport (`authorized-image`,
  `file-download`, photo upload); they go through `core/http`.
- Services use only `core/http`. `fetch` appears only in `core/http` and `core/auth`.
- Tokens are read only in `core/auth`.

## 4. React rules

- Function components only, named exports (`export function ReadersPage()`). No default exports in
  `src/` (React Router `lazy` picks named exports; only tool config files export default).
- Hooks rules and `react-hooks` lint are law. No `useEffect` for derived state or for data fetching;
  data comes from TanStack Query, derived values are computed during render.
- Props are `Readonly<...>`. No prop drilling beyond two levels: compose or lift into a hook.
- Server state lives only in TanStack Query. UI state lives in the component (`useState`) or in the URL
  (filters, paging: search params). **No global state library.**
- Forms: React Hook Form + `zodResolver`. Schemas mirror the backend rules in `docs/backend-contract.md`
  section 7; backend errors are applied with `setError` by field (`details.` prefix already stripped).
- Routing: lazy feature routes, guards as components in `core/auth` (`RequireAuth`, `RequireRole`).

## 5. UI rules

- shadcn/ui components live in `src/shared/ui`; add them with the CLI, then keep them lint-clean.
  Features use them, never copies of them.
- Repeated patterns (server data table, form field, confirm, photo crop, authorized image, download)
  live once in `shared/components/`.
- Server-side tables only on admin lists (TanStack Table in manual mode). No client-side paging.
- Styling: Tailwind classes and theme tokens from `src/index.css` only (`bg-primary`, `text-gold`, ...).
  No inline hex colors, no `style={{ color }}`, no `!important`.
- Toasts and confirms go through `core/feedback`, not `sonner` directly in features.
- Dates: backend sends UTC; display in `Asia/Tashkent` through `core/i18n` formatters. `DateOnly`
  stays a `YYYY-MM-DD` string.
- Public zone `/royxat` is mobile-first. Admin zone `/admin` targets library desktop browsers.

## 6. Backend integration

- Backend owns business rules. The UI validates for UX, never as the only guard.
- No OpenAPI codegen. DTOs are hand-written from `docs/backend-contract.md`.
- `api-client`: prefixes `/api`, attaches the Bearer token, unwraps `Result.data`, turns
  ProblemDetails (and empty or non-JSON bodies) into `ApiError { status, code, messages, fieldErrors }`.
- Errors are recognized by `code` (ProblemDetails `title`), never by message text. User-facing text comes
  from the backend `messages[locale]` for catalog codes, and from our i18n for `*Validator` codes.
- Enums are integers: a `const` object + union type + label keys in `shared/models`.
- Paging: `first`, `rows`, `sortField` (snake_case), `sortOrder` (`1` / `-1`), built in `core/http`.
- Images need the token: never `<img src="/api/files/...">`; use `shared/components/authorized-image`.
- Time-dependent rules take `now` / `today` as a parameter so they stay testable.

## 7. Auth

- Access token in memory only (never `localStorage` / `sessionStorage`). Refresh token is the
  `HttpOnly` cookie on `/api/auth`; JavaScript never sees it.
- `core/auth/session.ts` holds the single `SessionStore` and connects it to `apiClient`. Components read
  it through `useSession()` / `useAuth()` only.
- The session is restored (`POST /api/auth/refresh`, once, even under StrictMode) only when an admin
  route is entered (`RequireAuth`, `GuestOnly`); the public `/royxat` never calls `/api/auth/*`.
  On `401`: one shared (single-flight) refresh, then retry once; a failed refresh ends the session.
- The login page shows why the session ended (`reason`: expired, outside the library network, ...).
  The return path is kept only when the session ended by itself, not after "Sign out".
- Profile comes from the `user` object of the login/refresh response, not from token claims.
- Roles: `Receptionist` and `Admin`. Hiding a button is UX, not security; the backend enforces.

## 8. Clean code

- No comments anywhere in the project: TS, TSX, JS, CSS, JSON, HTML, `.gitignore`-style files. That
  includes JSDoc, `/// <reference>`, `// @ts-...`, `/* eslint-disable */`, `{/* */}` in JSX.
  If code needs a comment, rename or extract instead. Enforced by the `iccu/no-comments` ESLint rule and
  `scripts/check-no-comments.mjs`. Markdown is exempt. Reasoning goes into commit messages and `docs/`.
- Names reveal intent (`ReadersPage`, `useReaders`, `toReader`). Forbidden names: `Helper`, `Util`,
  `Manager`, `CommonService`, `DataService`, `data` (except the backend's own `data` field in DTOs), `item2`.
- File names kebab-case (`reader-form-page.tsx`), components PascalCase (`ReaderFormPage`).
- Functions ≤ 25 lines (ESLint in `.ts` files), files ≤ 200 lines (ESLint `max-lines`), components ≤ 200 lines.
  Exempt: generated `src/shared/ui` (shadcn), dictionaries in `src/core/i18n/translations` (data), tests.
- No magic strings/numbers: constants, `const` objects or union types.
- No UI text in code: every label, message, toast, title and placeholder is a typed `core/i18n` key with
  `uz`, `ru` and `en` values. A missing translation breaks the build.
- No `any` of any kind, no `as unknown as`, no non-null `!`, no `@ts-ignore`, no `eslint-disable`.
- No dead code, no commented-out code, no `console.log`.
- `readonly` data, early returns, no clever one-liners.

## 9. Testing

- Every mapper, Zod schema, `api-client` behaviour (refresh, error parsing), auth rule and pure function
  gets a unit test.
- Forms and important components: Testing Library, input → rendered output / callbacks.
- Hook and component tests mock the feature service with `vi.mock`, never `fetch`
  (`core/http` and `core/auth` tests are the exception: they test the transport itself).
- Test file next to the code: `readers.mapper.test.ts`. Test names: `should <result> when <condition>`.
- Shared test helpers live in `src/test` (`@test/*`, e.g. `renderWithProviders`). Production code never
  imports them (Sheriff tag `type:test`).

## 10. How to work on a request

1. Which feature owns this screen? New screen group → new `features/<x>`.
2. Which endpoint and DTO (`docs/backend-contract.md`)? Which role may call it?
3. Which folder owns each part (section 3)? Does `shared/` or `core/` already have it?
4. Which tests prove it?

If a business rule is unclear, ask. If only the structure is unclear, follow this file.
Commit only when the user asks.

## 11. Forbidden

- Clean Architecture layer folders, repository abstractions, use-case classes
- OpenAPI code generators, axios, Redux/Zustand or any global state library, mock backends
- `fetch` outside `core/http` and `core/auth`; tokens outside `core/auth`
- Business logic in components; importing one feature from another
- `any`, `as unknown as`, `@ts-ignore`, `eslint-disable`, non-null `!`
- Inline colors, `!important`, `localStorage` for tokens
- Error handling by message text; hard-coded API hosts
- New dependencies without asking; comments of any kind in project files
- "Quick" shortcuts that break any rule above. Speed is allowed; structural shortcuts are not.

## 12. Definition of done

- [ ] Right feature, right folder, right file name
- [ ] Dependency table (3.1) respected
- [ ] DTO → mapper → model, errors by `code`
- [ ] All text through i18n (uz, ru, en)
- [ ] Tests added; `lint`, `test`, `build` pass
- [ ] Checked against the real backend when the stage touches the API
- [ ] `docs/` updated if behaviour or structure changed
