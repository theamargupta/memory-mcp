# API Conventions

## MCP route (`api/mcp/route.ts`)
- POST only. Bearer token required.
- Builds a new MCP server per request (stateless — required for serverless).
- Extract user id from the validated OAuth token.
- Log every tool call to `memory_access_log`.

## REST routes (`api/memories/`, `api/connections/`)
- Zod v4 body validation (`import { z } from "zod"` — project uses top-level `zod`).
- Supabase SSR client (`lib/supabase/server.ts`) for user-authed; service-role only when RLS would block the operation.
- Response shape: `{ success: true, data }` or `{ success: false, error }`.

## Never
- Never use the service-role client from a client component.
- Never accept `user_id` from the request body — always derive from auth.
