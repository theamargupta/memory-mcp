@AGENTS.md

# Memory MCP

## Overview
MCP server that solves AI context amnesia. Store knowledge once, serve it to all AI tools (Claude Code, Claude Chat, Cursor, Codex). 8 MCP tools, semantic search via pgvector, visual rules editor, multi-project scoping, OAuth 2.0 with PKCE.

## Nested Context
Area-specific rules live in nested CLAUDE.md files. When editing in these paths, consult the local file:
- `app/` — App Router, route groups (auth/dashboard/marketing)
- `app/api/` — API route conventions (MCP + REST)
- `lib/mcp/` — MCP server factory, tools, OAuth
- `lib/supabase/` — client selection (service-role vs SSR vs browser)
- `supabase/` — migrations, RLS, Edge Function
- `components/ui/` — ShadCN (auto-managed)

## Tech Stack
- Next.js 16.2.x (App Router, Server Components)
- React 19, TypeScript strict mode
- Tailwind CSS v4 (CSS variables, dark mode)
- ShadCN UI v4 (base-nova preset)
- Framer Motion for animations
- MCP SDK (@modelcontextprotocol/sdk)
- Supabase (PostgreSQL + pgvector + Auth + SSR)
- Supabase Edge Functions (Deno) for gte-small embeddings
- Zod v4 for validation
- Base UI React for unstyled components

## Commands
```
npm run dev     # Dev server on :3000
npm run build   # Production build
npm run start   # Production server
npm run lint    # ESLint
```

## Project Structure
```
app/
  (auth)/                 # Login, signup, callback
  (dashboard)/
    dashboard/            # Stats overview
    memories/             # Memory browser + editor
    projects/             # Project-scoped view
    rules/                # Visual .claude.md editor
    settings/             # OAuth connections, export/import
  (marketing)/            # Landing page
  api/
    mcp/route.ts          # MCP HTTP endpoint (POST, OAuth-gated)
    memories/             # REST CRUD endpoints
    connections/          # OAuth session management
  oauth/                  # OAuth flow (authorize, consent, callback)
  .well-known/            # OAuth discovery
components/
  ui/                     # ShadCN primitives (don't edit)
  dashboard/              # Dashboard sections
  memories/               # Memory browser, editor, search UI
  shared/                 # Nav, auth state, common
hooks/                    # React hooks
types/                    # TypeScript definitions
lib/
  mcp/
    server.ts             # MCP server factory (registers 8 tools)
    oauth.ts              # OAuth 2.0 + PKCE (600+ lines)
    tools/memories.ts     # Tool implementations (save, search, list, get, update, delete, get_rules, get_context)
  supabase/               # service-role.ts, client.ts, server.ts, middleware.ts
  embeddings.ts           # Calls Supabase Edge Function for gte-small
  cache-tags.ts           # On-demand revalidation
  utils.ts                # Helpers
supabase/
  migrations/             # 001-006 (memories, oauth, access_log, pgvector, search_function)
  functions/embed/        # Deno Edge Function for gte-small embeddings (384-dim)
```

## Memory Categories
preference, rule, project, decision, context, snippet, note, persona

## MCP Tools (8)
1. save_memory — Store new memory with embedding
2. search_memory — Semantic vector search
3. list_memories — Filter by category/project/tags
4. get_memory — Fetch single memory by ID
5. update_memory — Update content + re-embed
6. delete_memory — Soft delete (is_active = false)
7. get_rules — All rule-category memories (.claude.md style)
8. get_context — Combined rules + recent memories for a project

## Code Conventions
- Server Components by default, `'use client'` only when needed
- Components: PascalCase (MemoriesView, RulesEditor)
- Files: kebab-case (service-role.ts, cache-tags.ts)
- Constants: UPPER_SNAKE_CASE (ACCESS_TOKEN_TTL_SECONDS)
- `import 'server-only'` in OAuth, service-role, embeddings modules
- Soft deletes (is_active boolean) — never hard delete memories
- Glassmorphism styling (backdrop-blur, glass-border)
- Indigo accent color scheme

## Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Database
Supabase PostgreSQL + pgvector. Tables: memories (with embedding vector(384)), mcp_oauth_clients, mcp_oauth_authorization_codes, mcp_oauth_tokens, memory_access_log. RLS on all tables. Search via PL/pgSQL search_memories() function.

## Deployment
Vercel for Next.js app. Supabase Edge Functions: `supabase functions deploy embed`

## Rules
- All MCP tool inputs validated with Zod
- OAuth tokens stored as opaque hashes only
- Embeddings generated automatically on save/update
- Log every tool call to memory_access_log
- Service role client only in API routes
- Soft delete only — never DROP or hard delete user data
- server-only imports for sensitive modules
