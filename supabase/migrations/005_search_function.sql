-- Phase 3: Semantic search RPC function using Supabase AI (gte-small, 384-dim)

CREATE OR REPLACE FUNCTION search_memories(
  query_text TEXT,
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
DECLARE
  query_embedding vector(384);
BEGIN
  -- Generate embedding using Supabase AI
  SELECT ai.embed('gte-small', query_text)::vector(384) INTO query_embedding;

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

-- Helper function to generate and store embedding for a memory
CREATE OR REPLACE FUNCTION generate_memory_embedding()
RETURNS TRIGGER AS $$
BEGIN
  NEW.embedding := ai.embed('gte-small', NEW.title || E'\n\n' || NEW.content)::vector(384);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Auto-generate embeddings on insert and content updates
CREATE TRIGGER memories_generate_embedding
  BEFORE INSERT OR UPDATE OF title, content ON memories
  FOR EACH ROW
  EXECUTE FUNCTION generate_memory_embedding();
