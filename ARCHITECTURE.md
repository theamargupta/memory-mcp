# Memory MCP — Architecture Document

**A standalone personal knowledge layer for all your AI tools**

Version: 0.2 · Author: Amar Gupta · Date: April 2026

---

## 1. The Problem

Every AI tool you use starts with zero context:

- **Claude Chat** — doesn't know your tech stack, preferences, or past decisions
- **Claude Code** — no idea about your project structure or coding style
- **Cursor / Codex** — starts blank every session

You repeat yourself constantly: "I use Next.js 16, Tailwind v4, Supabase, deploy on Vercel..."

---

## 2. The Solution

**Memory MCP** — a standalone app where you store personal knowledge once, and every AI tool can access it.

```
┌──────────────────────────────────────────────────────────┐
│                    MEMORY MCP DASHBOARD                   │
│              (Next.js App — memorymcp.dev)                 │
│                                                           │
│  ┌────────────┐ ┌────────────┐ ┌───────────────────────┐ │
│  │  Memories  │ │   Rules    │ │  Projects / Contexts  │ │
│  │  Browser   │ │  .claude.md│ │  per-project memory   │ │
│  └────────────┘ └────────────┘ └───────────────────────┘ │
│                                                           │
│  Create · Edit · Tag · Search · Delete · Import/Export    │
│  MCP Connection Manager (view/revoke active sessions)     │
└──────────────────────────┬────────────────────────────────┘
                           │
                      Supabase DB
                     (PostgreSQL + pgvector)
                           │
               ┌───────────┴───────────┐
               │                       │
      Streamable HTTP MCP          REST API
      + OAuth 2.0 (single endpoint) (Dashboard)
               │
    ┌──────────┼──────────┬──────────┐
    │          │          │          │
Claude Chat  Claude    Cursor    Codex
(Connector)  Code       IDE      CLI
             (--transport http)
```

**One MCP endpoint. One OAuth flow. All clients.**

```bash
# Claude Code — one command + browser auth:
claude mcp add --transport http memory-mcp https://memorymcp.dev/api/mcp

# Claude Chat — Settings → Connectors → Add Custom Connector
# URL: https://memorymcp.dev/api/mcp → OAuth in browser → done
```

---

## 3. What Is a "Memory"?

A memory is any piece of knowledge you want your AI tools to remember.

### 3.1 Memory Categories

| Category       | Example                                                    |
|---------------|-------------------------------------------------------------|
| `preference`  | "I use Tailwind v4, never styled-components"                |
| `rule`        | "Always use `const` over `let`. Never use `any` in TS"     |
| `project`     | "Project X uses Next.js 16, deployed on Vercel, uses Supabase" |
| `decision`    | "Chose PostgreSQL over MongoDB because of relational needs" |
| `context`     | "Working on a SaaS for freelancers, target market: India"   |
| `snippet`     | "Auth middleware pattern we use across all projects"        |
| `note`        | "Client wants dashboard redesign by May 2026"              |
| `persona`     | "I'm a full-stack dev, 7+ years, based in Delhi"           |

### 3.2 Memory Schema

```sql
CREATE TABLE memories (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id),
  
  -- Content
  title         TEXT NOT NULL,
  content       TEXT NOT NULL,
  category      TEXT NOT NULL DEFAULT 'note',
  tags          TEXT[] DEFAULT '{}',
  
  -- Context
  project       TEXT,                    -- optional project scope
  source        TEXT DEFAULT 'manual',   -- 'manual' | 'claude_chat' | 'claude_code' | 'cursor' | 'api'
  
  -- Search
  embedding     vector(1536),            -- pgvector for semantic search
  
  -- Metadata
  metadata      JSONB DEFAULT '{}',
  is_active     BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now(),
  expires_at    TIMESTAMPTZ              -- optional auto-expiry
);
```

### 3.3 Example Memories

```json
{
  "title": "Tech Stack Preference",
  "content": "I use Next.js 16 with App Router, Tailwind v4, Supabase for backend, Vercel for deployment. TypeScript strict mode always. ShadCN for UI components. Zustand for state management.",
  "category": "preference",
  "tags": ["tech-stack", "frontend", "backend"],
  "project": null,
  "source": "manual"
}
```

```json
{
  "title": "Claude Code Rules",
  "content": "When writing code: use functional components only, prefer server components in Next.js, use Zod for all validation, write JSDoc comments on exported functions, use path aliases (@/), never use default exports except for pages.",
  "category": "rule",
  "tags": ["coding-style", "claude-code", "nextjs"],
  "project": null,
  "source": "manual"
}
```

```json
{
  "title": "InvenSync360 Project Context",
  "content": "Inventory and billing tool for Indian SMBs. Next.js frontend, MongoDB backend, multi-tenant. Currently has 50 active users. Focus on GST compliance and WhatsApp invoice sharing.",
  "category": "project",
  "tags": ["invensync", "saas", "india"],
  "project": "invensync360",
  "source": "claude_chat"
}
```

---

## 4. Tech Stack

| Layer          | Technology                    | Why                                          |
|---------------|-------------------------------|----------------------------------------------|
| Frontend      | Next.js 16 (App Router)       | Your stack, SSR, fast                        |
| UI            | Tailwind v4 + ShadCN          | Your stack, rapid UI                         |
| Auth (Web)    | Supabase Auth                 | Built-in, handles social login               |
| Auth (MCP)    | Self-contained OAuth 2.0 + DCR | Proven pattern from Devfrend                |
| Database      | Supabase PostgreSQL            | Managed, RLS, realtime                       |
| Vector Search | pgvector (Supabase extension)  | Native PG, no external service needed        |
| Embeddings    | Supabase AI (gte-small) or OpenAI | Generate vectors for semantic search      |
| MCP Server    | Next.js API Route + @modelcontextprotocol/sdk | Single Streamable HTTP endpoint |
| Deployment    | Vercel                         | Your stack, edge functions                   |

---

## 5. MCP Tools (What AI Clients Can Do)

### 5.1 Tool Definitions

```
┌─────────────────────────────────────────────────────────────┐
│                     MCP TOOLS                                │
├─────────────────┬───────────────────────────────────────────┤
│ save_memory     │ Store a new memory with content,          │
│                 │ category, tags, and optional project       │
├─────────────────┼───────────────────────────────────────────┤
│ search_memory   │ Semantic search across all memories       │
│                 │ using natural language query               │
├─────────────────┼───────────────────────────────────────────┤
│ list_memories   │ Browse memories by category, tags,        │
│                 │ project, or date range                     │
├─────────────────┼───────────────────────────────────────────┤
│ get_memory      │ Retrieve a specific memory by ID          │
├─────────────────┼───────────────────────────────────────────┤
│ update_memory   │ Modify title, content, tags, or           │
│                 │ category of an existing memory             │
├─────────────────┼───────────────────────────────────────────┤
│ delete_memory   │ Remove a memory (soft delete)             │
├─────────────────┼───────────────────────────────────────────┤
│ get_rules       │ Fetch all 'rule' category memories —      │
│                 │ shortcut for .claude.md style rules        │
├─────────────────┼───────────────────────────────────────────┤
│ get_context     │ Fetch all memories for a specific         │
│                 │ project — instant project onboarding       │
└─────────────────┴───────────────────────────────────────────┘
```

### 5.2 Tool Implementation Pattern (from Devfrend)

Every tool extracts `userId` from `authInfo.extra.userId` and scopes all queries:

```typescript
// Pattern: every tool gets userId from OAuth token
server.tool("save_memory", schema, async (params, { authInfo }) => {
  const userId = authInfo?.extra?.userId;
  if (!userId) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("memories")
    .insert({ ...params, user_id: userId })
    .select()
    .single();

  // Invalidate dashboard cache
  revalidateTag(`memories:${userId}`);

  return { content: [{ type: "text", text: JSON.stringify(data) }] };
});
```

### 5.3 Tool Input/Output Examples

**save_memory:**
```json
// Input
{
  "title": "API Error Handling Pattern",
  "content": "Always return { success: boolean, data?: T, error?: string }. Never throw from API routes.",
  "category": "rule",
  "tags": ["api", "error-handling", "pattern"],
  "project": "devfrend"
}

// Output
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Memory saved successfully",
  "title": "API Error Handling Pattern"
}
```

**search_memory:**
```json
// Input
{ "query": "how do we handle errors in APIs", "limit": 5 }

// Output
{
  "results": [
    {
      "id": "550e8400-...",
      "title": "API Error Handling Pattern",
      "content": "Always return { success: boolean, data?: T, error?: string }...",
      "category": "rule",
      "similarity": 0.92
    }
  ]
}
```

**get_rules:**
```json
// Input
{ "project": "devfrend" }

// Output — ready to inject into .claude.md
{
  "rules": [
    "Always use `const` over `let`. Never use `any` in TS.",
    "Use functional components only. Prefer server components.",
    "API pattern: { success, data, error }. Never throw from routes."
  ]
}
```

---

## 6. Request Flow (End-to-End)

Based on the proven Devfrend MCP + OAuth architecture:

```
Client (Claude Chat / Claude Code / Cursor / Codex)
    │
    ▼
1. GET /.well-known/oauth-authorization-server
   → Returns metadata (endpoints, scopes, PKCE requirement)
    │
    ▼
2. POST /oauth/register
   → Dynamic Client Registration (RFC 7591)
   → Gets client_id, validates redirect_uris against allowlist
    │
    ▼
3. GET /oauth/authorize
   → User sees consent page (login with Supabase Auth)
   → User grants Memory MCP access
    │
    ▼
4. POST /oauth/authorize (form submit)
   → PKCE S256 mandatory
   → Generates auth code (mcp_auth_<random>)
   → Stores SHA-256 hash of code (plaintext never stored), 10-min TTL
   → Redirects to client with ?code=...&state=...
    │
    ▼
5. POST /oauth/token (grant_type=authorization_code)
   → Verifies PKCE code_verifier, one-time-use code
   → Issues: access_token (1hr) + refresh_token (30 days)
   → Tokens are opaque random strings, hashes stored in DB
    │
    ▼
6. POST /api/mcp (Bearer token)
   → Verifies token via hash lookup in mcp_oauth_tokens
   → Creates new McpServer instance per request (stateless)
   → Dispatches to memory tools with user_id from token
    │
    ▼
7. POST /oauth/token (grant_type=refresh_token)
   → Rotates tokens: old revoked, new pair issued
    │
    ▼
8. POST /oauth/revoke
   → Soft-revoke (sets revoked_at), always returns 200 (RFC 7009)
```

---

## 7. OAuth Implementation Detail

### 7.1 Security Decisions (proven in Devfrend)

1. **Opaque tokens, not JWTs** — hashes in DB, instant revocation
2. **PKCE S256 mandatory** — no opt-out, even for public clients
3. **Token rotation on refresh** — old revoked, new pair created; stolen tokens detectable
4. **Auth codes one-time-use** — `used_at` set atomically on first exchange
5. **`server-only` import** in `lib/mcp/oauth.ts` — prevents client-side import
6. **Redirect URI allowlist** — Claude, ChatGPT, Cursor, localhost origins

### 7.2 Client Registration (`POST /oauth/register`)

- Validates and deduplicates `redirect_uris`
- Allowed redirect hosts:
  - `claude.ai`, `claude.com` (Claude Chat/Desktop)
  - `chatgpt.com`, `chat.openai.com`, `platform.openai.com`, `auth.openai.com`, `*.chatgpt.com`, `*.openai.com`
  - `localhost:*` (Claude Code, Cursor, Codex local callbacks)
- Forces `token_endpoint_auth_method` to `'none'` (public clients)
- Generates `client_id` as `mcp_client_<18 random bytes as base64url>`

### 7.3 Authorization (`GET/POST /oauth/authorize`)

- **GET**: Consent page → user logs in via Supabase Auth
- **POST**: Validates PKCE, generates `mcp_auth_<32 random bytes>`, stores hash, redirects 303
- Consent page is inline HTML (no separate React page needed)

### 7.4 Token Exchange (`POST /oauth/token`)

**`authorization_code` grant:**
- Hash submitted code → lookup `mcp_oauth_authorization_codes.code_hash`
- Checks: not used, correct client_id, correct redirect_uri, not expired
- PKCE: `base64url(sha256(code_verifier))` must match stored `code_challenge`
- Mark code used, issue token pair

**`refresh_token` grant:**
- Hash submitted token → lookup in `mcp_oauth_tokens`
- Checks: not revoked, same scope
- Full rotation: old revoked, new pair issued

**`issueTokens()`:**
- Access: `mcp_at_<32 random bytes>` — 1 hour TTL
- Refresh: `mcp_rt_<32 random bytes>` — 30 day TTL
- SHA-256 hashes stored, never plaintext

### 7.5 Token Verification (every MCP request)

```
1. Parse Authorization: Bearer <token>
2. SHA-256 hash the token
3. Look up hash in mcp_oauth_tokens
4. Check: not revoked, not expired
5. Fire-and-forget: update last_used_at
6. Return { userId, clientId, scope }
7. Pass userId to tools via authInfo.extra.userId
```

If no/invalid token → 401 with `WWW-Authenticate` header → resource metadata.

---

## 8. MCP Server Detail (`POST /api/mcp`)

Stateless-per-request pattern (mandatory for Vercel serverless):

```typescript
// app/api/mcp/route.ts
export async function POST(request: Request) {
  // 1. Extract Bearer token
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return unauthorized();

  // 2. Verify token → get userId
  const authResult = await verifyOAuthAccessToken(token);
  if (!authResult) return unauthorized();

  // 3. Create NEW McpServer instance per request (stateless)
  const server = createMcpServer();

  // 4. Connect to Streamable HTTP transport
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined
  });
  await server.connect(transport);

  // 5. Dispatch with authInfo containing userId
  return transport.handleRequest(request, {
    extra: { userId: authResult.userId }
  });
}
```

### 8.1 Memory Tools (`lib/mcp/tools/memories.ts`)

| Tool | Operation | DB Query |
|------|-----------|----------|
| `save_memory` | INSERT | `.insert({ ...params, user_id: userId })` |
| `search_memory` | Vector similarity | `rpc('search_memories', { query_embedding, match_count, user_id })` |
| `list_memories` | SELECT + filters | `.select().eq('user_id', userId).eq('is_active', true)` + category/tags/project |
| `get_memory` | SELECT by ID | `.select().eq('id', memoryId).eq('user_id', userId).single()` |
| `update_memory` | PATCH | `.update(changes).eq('id', memoryId).eq('user_id', userId)` |
| `delete_memory` | Soft delete | `.update({ is_active: false }).eq('id', memoryId).eq('user_id', userId)` |
| `get_rules` | SELECT category='rule' | `.select().eq('user_id', userId).eq('category', 'rule').eq('is_active', true)` |
| `get_context` | SELECT by project | `.select().eq('user_id', userId).eq('project', projectName).eq('is_active', true)` |

### 8.2 Cache Invalidation

```typescript
// After save/update/delete — keeps dashboard in sync
revalidateTag(`memories:${userId}`);
```

---

## 9. Database Design

### 9.1 OAuth Tables (from Devfrend — proven)

```sql
-- OAuth clients (DCR). Public clients only.
CREATE TABLE mcp_oauth_clients (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id                   TEXT UNIQUE NOT NULL,
  client_secret_hash          TEXT,                        -- NULL for public clients
  redirect_uris               JSONB NOT NULL,
  token_endpoint_auth_method  TEXT DEFAULT 'none',
  metadata                    JSONB DEFAULT '{}',
  created_at                  TIMESTAMPTZ DEFAULT now()
);

-- Short-lived, single-use authorization codes
CREATE TABLE mcp_oauth_authorization_codes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code_hash       TEXT UNIQUE NOT NULL,                    -- SHA-256, never plaintext
  client_id       TEXT NOT NULL REFERENCES mcp_oauth_clients(client_id),
  user_id         UUID NOT NULL REFERENCES auth.users(id),
  redirect_uri    TEXT NOT NULL,
  scope           TEXT,
  code_challenge  TEXT NOT NULL,                           -- PKCE S256
  expires_at      TIMESTAMPTZ NOT NULL,                    -- 10-min TTL
  used_at         TIMESTAMPTZ,                             -- prevents replay
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- Access + refresh token pairs
CREATE TABLE mcp_oauth_tokens (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  access_token_hash   TEXT UNIQUE NOT NULL,
  refresh_token_hash  TEXT UNIQUE NOT NULL,
  client_id           TEXT NOT NULL REFERENCES mcp_oauth_clients(client_id),
  user_id             UUID NOT NULL REFERENCES auth.users(id),
  scope               TEXT,
  expires_at          TIMESTAMPTZ NOT NULL,                -- access: 1hr
  refresh_expires_at  TIMESTAMPTZ NOT NULL,                -- refresh: 30 days
  revoked_at          TIMESTAMPTZ,                         -- soft revoke
  last_used_at        TIMESTAMPTZ,
  created_at          TIMESTAMPTZ DEFAULT now()
);

-- RLS: ONLY service role can access OAuth tables
ALTER TABLE mcp_oauth_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE mcp_oauth_authorization_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE mcp_oauth_tokens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "deny_all" ON mcp_oauth_clients USING (false);
CREATE POLICY "deny_all" ON mcp_oauth_authorization_codes USING (false);
CREATE POLICY "deny_all" ON mcp_oauth_tokens USING (false);
```

### 9.2 Memory Tables

```sql
-- Core memories (see section 3.2 for full schema)
-- RLS: users can only access their own
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_memories" ON memories FOR ALL USING (auth.uid() = user_id);
```

### 9.3 Usage Tracking

```sql
CREATE TABLE memory_access_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id),
  memory_id   UUID REFERENCES memories(id),
  action      TEXT NOT NULL,
  source      TEXT NOT NULL,           -- client_id or 'dashboard'
  query       TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);
```

### 9.4 Indexes

```sql
-- Memory lookups
CREATE INDEX idx_memories_user ON memories(user_id);
CREATE INDEX idx_memories_category ON memories(user_id, category);
CREATE INDEX idx_memories_project ON memories(user_id, project);
CREATE INDEX idx_memories_tags ON memories USING GIN(tags);
CREATE INDEX idx_memories_active ON memories(user_id, is_active);

-- Vector search
CREATE INDEX idx_memories_embedding ON memories
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- OAuth fast lookups
CREATE INDEX idx_oauth_tokens_access ON mcp_oauth_tokens(access_token_hash);
CREATE INDEX idx_oauth_tokens_refresh ON mcp_oauth_tokens(refresh_token_hash);
CREATE INDEX idx_oauth_tokens_user ON mcp_oauth_tokens(user_id);
CREATE INDEX idx_oauth_codes_hash ON mcp_oauth_authorization_codes(code_hash);
```

---

## 10. Semantic Search

```
Query: "how do we handle API errors?"
  → Generate embedding (1536-dim vector)
  → pgvector cosine similarity search
  → Return top matches ranked by similarity
```

### Supabase RPC Function

```sql
CREATE OR REPLACE FUNCTION search_memories(
  query_embedding vector(1536),
  match_count INT DEFAULT 5,
  p_user_id UUID DEFAULT NULL,
  p_category TEXT DEFAULT NULL,
  p_project TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID, title TEXT, content TEXT, category TEXT,
  tags TEXT[], project TEXT, similarity FLOAT
)
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT
    m.id, m.title, m.content, m.category, m.tags, m.project,
    1 - (m.embedding <=> query_embedding) AS similarity
  FROM memories m
  WHERE m.user_id = p_user_id AND m.is_active = true
    AND (p_category IS NULL OR m.category = p_category)
    AND (p_project IS NULL OR m.project = p_project)
  ORDER BY m.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
```

---

## 11. File Map

Based on Devfrend's proven structure:

| Layer | Files | Purpose |
|-------|-------|---------|
| **Discovery** | `app/.well-known/oauth-authorization-server/route.ts`, `app/.well-known/oauth-protected-resource/api/mcp/route.ts` | Client auto-discovery |
| **OAuth Endpoints** | `app/oauth/register/route.ts`, `app/oauth/authorize/route.ts`, `app/oauth/token/route.ts`, `app/oauth/revoke/route.ts` | Full OAuth 2.0 flow |
| **Core OAuth Logic** | `lib/mcp/oauth.ts` (~500 lines) | **The brain** — all OAuth logic, PKCE, tokens |
| **MCP Server** | `lib/mcp/server.ts` | McpServer setup + tool registration |
| **MCP Endpoint** | `app/api/mcp/route.ts` | Auth check → MCP dispatch |
| **Memory Tools** | `lib/mcp/tools/memories.ts` | Tool implementations scoped by user_id |
| **Embeddings** | `lib/embeddings/generate.ts` | Vector generation for search |
| **Cache** | `lib/cache-tags.ts` | Dashboard sync on MCP mutations |
| **Session Mgmt** | `app/(dashboard)/settings/connections/` | View/revoke MCP sessions |

### Full Project Structure

```
memory-mcp/
├── app/
│   ├── (marketing)/page.tsx
│   ├── (auth)/login/page.tsx, callback/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx, page.tsx
│   │   ├── memories/page.tsx
│   │   ├── rules/page.tsx
│   │   ├── projects/page.tsx
│   │   └── settings/page.tsx, connections/page.tsx
│   ├── api/
│   │   ├── mcp/route.ts              # MCP endpoint
│   │   └── memories/route.ts, [id]/route.ts, search/route.ts, export/route.ts
│   ├── oauth/
│   │   ├── register/route.ts
│   │   ├── authorize/route.ts
│   │   ├── token/route.ts
│   │   └── revoke/route.ts
│   └── .well-known/
│       ├── oauth-authorization-server/route.ts
│       └── oauth-protected-resource/api/mcp/route.ts
│
├── lib/
│   ├── supabase/client.ts, server.ts, service-role.ts
│   ├── mcp/
│   │   ├── oauth.ts                  # THE BRAIN (~500 lines)
│   │   ├── server.ts                 # McpServer + tools
│   │   └── tools/memories.ts         # Memory CRUD + search
│   ├── embeddings/generate.ts
│   └── cache-tags.ts
│
├── components/memories/, rules/, shared/
├── supabase/migrations/001-004.sql
├── types/index.ts
├── package.json, next.config.ts, tailwind.config.ts, tsconfig.json
└── README.md
```

---

## 12. Dashboard Features

- **Memory Browser** — list, filter by category/tags/project, search
- **Quick Add** — create memories from dashboard
- **Rules Editor** — visual .claude.md manager, exportable
- **Project Grouping** — all memories scoped to a project
- **Import/Export** — bulk JSON import/export
- **MCP Connection Manager** — view active sessions (client name, last_used_at), revoke any
- **Usage Stats** — memory count, tool call frequency, search queries
- **Quick Setup Guide** — copy-paste configs for all clients

---

## 13. What We Port from Devfrend vs. Build New

### Directly Reusable (copy + adapt)

| Component | Adaptation |
|-----------|------------|
| `lib/mcp/oauth.ts` (~536 lines) | Swap `admin_users` → `auth.users`, remove role checks |
| `app/api/mcp/route.ts` | Same structure, different tools |
| `app/oauth/*/route.ts` (all 4) | Swap session check → Supabase Auth session |
| `.well-known/` routes (both) | Same |
| OAuth migration SQL | Same 3 tables |
| `lib/cache-tags.ts` | Same pattern, different tags |
| Session management actions | Same pattern |

### New Code

| Component | Reason |
|-----------|--------|
| `lib/mcp/tools/memories.ts` | New domain — CRUD + semantic search |
| `lib/embeddings/generate.ts` | pgvector integration |
| Dashboard pages | New UI — memories, rules, projects |
| Supabase Auth integration | Devfrend uses custom admin auth |
| `memories` table + migrations | New schema |
| Landing page | New product |

---

## 14. Build Milestones

### Phase 1 — Foundation (Week 1)
- [ ] Next.js scaffold + Supabase project
- [ ] Supabase Auth (login/signup)
- [ ] `memories` table migration + RLS
- [ ] REST API for CRUD
- [ ] Simple dashboard — list and create memories

### Phase 2 — MCP + OAuth (Week 2)
- [ ] Port `lib/mcp/oauth.ts` from Devfrend
- [ ] OAuth endpoints (register, authorize, token, revoke)
- [ ] `.well-known/` discovery routes
- [ ] MCP endpoint (`/api/mcp`)
- [ ] Memory tools (save, list, get, update, delete)
- [ ] Test: Claude Chat connector + Claude Code `claude mcp add`
- [ ] Connection manager UI

### Phase 3 — Semantic Search (Week 3)
- [ ] Enable pgvector on Supabase
- [ ] Embedding generation on save/update
- [ ] `search_memories` RPC function
- [ ] `search_memory` MCP tool
- [ ] `get_rules` + `get_context` tools
- [ ] Search UI on dashboard

### Phase 4 — Polish & Ship (Week 4)
- [ ] Rules editor (visual .claude.md manager)
- [ ] Project grouping page
- [ ] Import/Export
- [ ] Usage stats
- [ ] Landing page
- [ ] README + setup guides
- [ ] Open source on GitHub

---

## 15. Competitive Positioning

| Feature           | Memory MCP          | mem0.ai     | Claude Memory |
|-------------------|---------------------|-------------|---------------|
| Self-hosted       | ✅                  | ❌ (SaaS)   | ❌            |
| Cross-tool        | ✅ Any MCP client   | Limited     | Claude only   |
| Dashboard         | ✅                  | ✅          | ❌            |
| Semantic search   | ✅ pgvector         | ✅          | ❌            |
| Project scoping   | ✅                  | ❌          | ❌            |
| .claude.md rules  | ✅                  | ❌          | ❌            |
| Open source       | ✅                  | Partial     | ❌            |
| User owns data    | ✅                  | ❌          | ❌            |
| OAuth (no keys)   | ✅                  | API key     | N/A           |

---

## 16. Key Design Decisions

1. **Standalone product** — not a Devfrend module. Separate brand, audience, repo.

2. **Single MCP endpoint, all clients** — Streamable HTTP + OAuth. No stdio needed.

3. **Port OAuth from Devfrend** — `lib/mcp/oauth.ts` is battle-tested. Adapt, don't reinvent.

4. **Opaque tokens + DB hash lookup** — not JWTs. Instant revocation, `last_used_at` tracking.

5. **Stateless McpServer per request** — new instance every request for Vercel serverless.

6. **pgvector over external vector DB** — simple, no Pinecone dependency, personal-scale.

7. **Cache invalidation via `revalidateTag`** — MCP mutations sync dashboard instantly.

8. **Soft deletes** — `is_active = false`, allows undo + audit trail.

9. **Source tracking** — every memory records origin tool for usage analytics.

---

*The OAuth layer is proven in production (Devfrend). We port it, add memory tools, build the dashboard, ship.*
