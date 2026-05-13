# Memory MCP — case study

> Portfolio piece by **[Amar Gupta](https://amargupta.tech)** ·
> [GitHub](https://github.com/theamargupta) ·
> [LinkedIn](https://www.linkedin.com/in/theamargupta/) ·
> [theamargupta.tech@gmail.com](mailto:theamargupta.tech@gmail.com)
>
> Live: [mcp.devfrend.com](https://mcp.devfrend.com) ·
> About page: [mcp.devfrend.com/about](https://mcp.devfrend.com/about)

---

## What it is

Memory MCP is an open-source MCP (Model Context Protocol) server that gives every AI tool you use — Claude Code, Claude Chat, Cursor, Codex — a **shared, semantically-searchable memory**.

You add a memory once through the dashboard (a coding rule, a tech-stack note, a decision rationale, a project context snippet). From then on, any AI client that holds an OAuth token reads from the same store via 8 MCP tools. No more pasting "I use Next.js 16, Tailwind v4, Supabase…" into every fresh session.

The repo is also a portfolio piece — it deliberately demonstrates skills that come up in senior / staff full-stack and AI-engineering interviews: protocol design, OAuth, vector search, Postgres RLS, App Router discipline.

---

## Why I built it

Three frustrations stacked up:

1. **AI tools forget everything between sessions.** Memory is the most-promised, least-delivered feature in agentic tooling. The big platforms each solve it for their own surface and call it done.
2. **Cross-tool memory is worse.** Switching from Claude Code to Cursor means re-explaining the project from scratch. There's no shared spine.
3. **The MCP spec already solves it — nobody had shipped the canonical implementation.** MCP gives every client a uniform tool-calling protocol; a memory server is the obvious first thing to build on top of it.

So I built one, and used it as the substrate underneath my other products (Setu, Sandesh, Sankalp, Swayam, Sathi). It's the most-dogfooded piece of infrastructure in my portfolio.

---

## Architecture

```
┌──────────────────────┐     OAuth 2.0 + PKCE   ┌────────────────────┐
│  Claude / Cursor /   │ ─────────────────────▶ │  /oauth/authorize  │
│  Codex (MCP client)  │ ◀──── access token ──  │  /oauth/callback   │
└──────────┬───────────┘                         └─────────┬──────────┘
           │                                               │
           │ POST /api/mcp  (Bearer <opaque-hash>)         │
           ▼                                               ▼
   ┌────────────────────┐                         ┌─────────────────┐
   │  MCP server        │                         │ mcp_oauth_*     │
   │  8 tools, Zod-     │                         │  tables (RLS)   │
   │  validated, logged │                         └─────────────────┘
   └─────────┬──────────┘
             │
             │ save_memory / search_memory / list_memories
             │ get_memory / update_memory / delete_memory
             │ get_rules / get_context
             ▼
   ┌────────────────────────────────────────────┐
   │                Supabase                    │
   │  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
   │  │ memories │  │ access_  │  │ Edge Fn  │  │
   │  │ + vector │  │   log    │  │ (embed)  │  │
   │  └────┬─────┘  └──────────┘  └────┬─────┘  │
   │       │ pgvector cosine            │       │
   │       └────────────────────────────┘       │
   │           PL/pgSQL search_memories()       │
   └─────────────────────────────────────────────┘
                  ▲
                  │  REST CRUD + on-demand revalidation
   ┌──────────────┴───────────────┐
   │  Next.js 16 dashboard        │
   │  /memories /rules /projects  │
   │  /settings (OAuth clients)   │
   └──────────────────────────────┘
```

### Request lifecycle (search example)

1. Claude Code calls `search_memory({ query: "tech stack" })` over HTTP to `/api/mcp` with a Bearer access token.
2. Route handler validates the token against `mcp_oauth_tokens` (opaque hash compare), resolves the user.
3. Server calls a Supabase Edge Function (Deno) running `gte-small` to embed the query into a 384-dim vector.
4. PL/pgSQL `search_memories(user_id, query_embedding, limit)` runs a cosine-distance scan against the `memories.embedding vector(384)` column.
5. Top-k rows return; access is logged to `memory_access_log` (who, which tool, when, with what query).
6. Response streams back to the MCP client as a tool result.

End-to-end: one HTTP round-trip, one Edge Function call, one cosine-distance query — nothing fancier than that.

---

## Key engineering decisions

**1. Hand-rolled OAuth 2.0 + PKCE rather than wrapping a library.**
The MCP spec for HTTP transports is strict about discovery (`/.well-known`) and PKCE. I wrote the authorize → consent → callback → token-exchange → introspection flow against the spec directly, ~600 lines in `lib/mcp/oauth.ts`. Tokens are stored as opaque hashes; the plaintext only lives in the MCP client. Refresh, revoke, and per-client scopes all map cleanly onto `mcp_oauth_clients` / `mcp_oauth_authorization_codes` / `mcp_oauth_tokens`.

**2. Embeddings stay in Postgres.**
pgvector + a Supabase Edge Function running gte-small gives me 384-dim embeddings without adding a vector DB to the stack. Search is one PL/pgSQL function (`search_memories`). One service, one schema, one place to back up. The latency difference vs. a dedicated vector DB at this scale is unmeasurable.

**3. Soft-delete-only data model.**
Memories never DROP — `is_active` flips. The `memory_access_log` keeps the audit trail. This is partly correctness (an agent that "deletes" a memory should be reversible) and partly a portfolio statement: the rules in this repo's CLAUDE.md explicitly forbid hard deletes of user data, and the schema makes that the path of least resistance.

**4. Service-role gated by `import 'server-only'`.**
Anything that bypasses RLS is in a module that throws at build time if imported from a client component. OAuth code, service-role queries, and the embeddings client all sit behind that wall. RLS is the primary auth surface; service-role is a deliberate, narrow escape hatch.

**5. Next.js 16 App Router discipline.**
Server Components by default. Route groups separate `(auth)`, `(dashboard)`, `(marketing)` cleanly. No `middleware.ts` — auth gating is a per-layout check, which keeps data flow explicit and avoids the silent-redirect class of bugs. On-demand revalidation via tagged caches (`lib/cache-tags.ts`) so dashboard reads stay fresh after MCP writes.

**6. Tailwind v4 + ShadCN UI + Framer Motion, no config file.**
The dashboard uses Tailwind v4's CSS-variable theme system — no `tailwind.config.ts`. Glassmorphism + indigo accent + Bricolage Grotesque / DM Sans / JetBrains Mono font stack. Animations are ambient, not load-bearing.

---

## What this demonstrates

| Skill | Where to look |
|---|---|
| MCP server design | `lib/mcp/server.ts` (factory + 8 tools), `lib/mcp/tools/memories.ts` |
| OAuth 2.0 + PKCE from spec | `lib/mcp/oauth.ts` (~600 lines), `app/oauth/`, `app/.well-known/` |
| Vector search with pgvector | `supabase/migrations/004-*.sql` (vector column), `supabase/functions/embed/` (Edge Fn), `search_memories` PL/pgSQL |
| Postgres RLS at the boundary | `supabase/migrations/*` — every table has RLS |
| Next.js 16 App Router | `app/(auth)`, `app/(dashboard)`, `app/(marketing)`, route handlers, on-demand revalidation |
| TypeScript discipline | strict mode, Zod v4 for every tool input |
| Edge functions / Deno | `supabase/functions/embed/` runs gte-small in Deno |
| Visual design | `app/page.tsx`, `app/(marketing)/by-amar/page.tsx`, `app/about/page.tsx` — Tailwind v4, Framer Motion |

---

## Where it fits in the portfolio

Memory MCP is the **memory substrate** for an eight-product portfolio:

- **[Setu](https://setu.devfrend.com)** — chat relay (browser/mobile/WhatsApp → Claude Code via MCP)
- **[Sandesh](https://sandesh.devfrend.com)** — content publishing (LinkedIn, Threads, Instagram, YouTube)
- **[Sankalp](https://sankalp.devfrend.com)** — job-application autopilot
- **[Swayam](https://swayam.devfrend.com)** — automation routines (scheduled Claude Code wakes)
- **[Sathi](https://sathi.devfrend.com)** — personal manager
- **[Sutra](https://sutra.devfrend.com)** — desktop Electron relay
- **[project-memory](https://pm.devfrend.com)** — multi-tenant memory MCP (the hosted SaaS evolution of this project)
- **[ai-chat-devfrend](https://devfrend.com)** — multi-tenant RAG chatbot platform

Memory MCP is the one I'd reach for first in a hiring conversation — it's small enough to walk through in a 30-minute interview, but the surface area (OAuth, embeddings, RLS, MCP protocol, Next.js App Router, dashboard UX) covers most of what senior full-stack + AI roles actually look for.

---

## Hiring

I'm open to **senior / staff full-stack, AI engineering, and MCP / agent-infra roles**.

- **Email:** [theamargupta.tech@gmail.com](mailto:theamargupta.tech@gmail.com)
- **Portfolio:** [amargupta.tech](https://amargupta.tech)
- **LinkedIn:** [in/theamargupta](https://www.linkedin.com/in/theamargupta/)
- **GitHub:** [@theamargupta](https://github.com/theamargupta)

Happy to walk a hiring panel through any layer of this system live — the OAuth broker, the embeddings pipeline, the RLS surface, or the Claude Code integration that makes it actually work.
