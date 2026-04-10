// Embeddings are handled automatically by Supabase AI via database trigger.
// See: supabase/migrations/005_search_function.sql
//
// The trigger `memories_generate_embedding` fires on INSERT or UPDATE of
// title/content and calls ai.embed('gte-small', ...) to generate a 384-dim
// vector stored in the `embedding` column.
//
// No application-level embedding generation is needed.
