-- Phase 3: Enable pgvector and add embedding column
-- Uses Supabase AI (gte-small) — 384 dimensions, no external API key needed

CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding column to memories table (384-dim for gte-small)
ALTER TABLE memories ADD COLUMN IF NOT EXISTS embedding vector(384);

-- Index for fast vector similarity search
CREATE INDEX IF NOT EXISTS idx_memories_embedding ON memories
  USING hnsw (embedding vector_cosine_ops);
