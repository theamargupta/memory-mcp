# Supabase Migrations + Edge Function

## Migrations
`NNN_snake_case_name.sql`, next NNN after `006_fix_search_function.sql`.

Every new table:
```sql
alter table X enable row level security;
create policy "users read own" on X for select using (user_id = auth.uid());
```

Embeddings: `vector(384)` only (gte-small via `functions/embed`).

## Edge Function (`functions/embed`)
Deno runtime. Imports via `npm:` or URLs. Deploy with `supabase functions deploy embed`. Changing the model requires bumping the vector dimension in ALL relevant tables — huge blast radius.
