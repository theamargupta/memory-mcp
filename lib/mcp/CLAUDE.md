# MCP Server

- `server.ts` is a factory — returns a fresh server per request.
- Tools registered from `tools/*.ts`.
- All tool inputs validated with Zod.
- Extract user id from the OAuth session handed in by the API route.
- Log every tool call (tool name, user id, inputs redacted) to `memory_access_log`.
- Soft delete only — `is_active=false`, never `delete`.
- Embeddings must be 384-dim. Changing this requires a coordinated migration + Edge Function redeploy.

## OAuth
`oauth.ts` is large (~600 lines). Changes here must be reviewed by the `oauth-reviewer` agent.
