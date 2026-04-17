# App Router

- Route groups: `(auth)`, `(dashboard)`, `(marketing)` — do not flatten.
- Server Components by default; `'use client'` only for interactive UI.
- Auth gating lives in `proxy.ts` (Next.js 16 proxy, NOT middleware.ts).
- Metadata exports per route.
- Dark mode via `next-themes` is configured at the root layout.
