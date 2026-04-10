-- Phase 3 fix: Remove ai.embed() dependency from search and trigger.
-- Embeddings are now generated in a Supabase Edge Function, not in Postgres.

-- 1. Drop the trigger that called ai.embed() on insert/update
DROP TRIGGER IF EXISTS memories_generate_embedding ON memories;
DROP FUNCTION IF EXISTS generate_memory_embedding();

-- 2. Drop the old text-based search_memories overload
DROP FUNCTION IF EXISTS search_memories(TEXT, INT, UUID, TEXT, TEXT);

-- 3. Replace search_memories to accept a pre-computed vector instead of text
CREATE OR REPLACE FUNCTION search_memories(
  query_embedding vector(384),
  match_count INT DEFAULT 5,
  p_user_id UUID DEFAULT NULL,
  p_category TEXT DEFAULT NULL,
  p_project TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  content TEXT,
  category TEXT,
  tags TEXT[],
  project TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT
    m.id, m.title, m.content, m.category, m.tags, m.project,
    1 - (m.embedding <=> query_embedding) AS similarity
  FROM memories m
  WHERE m.user_id = p_user_id
    AND m.is_active = true
    AND m.embedding IS NOT NULL
    AND (p_category IS NULL OR m.category = p_category)
    AND (p_project IS NULL OR m.project = p_project)
  ORDER BY m.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
