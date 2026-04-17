# Which Supabase Client to Use

| Use | Client |
|-----|--------|
| Server component reading data | `server.ts` (SSR, respects RLS) |
| API route that needs to bypass RLS | `service-role.ts` (NEVER in components) |
| Browser client component | `client.ts` |
| Proxy / Next.js proxy.ts | `middleware.ts` |

`service-role.ts` imports `'server-only'`. Never import it from a file without that directive somewhere above in the module graph.
