-- Memory MCP: Usage tracking

CREATE TABLE memory_access_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  memory_id   UUID REFERENCES memories(id) ON DELETE SET NULL,
  action      TEXT NOT NULL,
  source      TEXT NOT NULL,
  query       TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE memory_access_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_logs" ON memory_access_log
  FOR ALL USING (auth.uid() = user_id);

CREATE INDEX idx_access_log_user ON memory_access_log(user_id);
CREATE INDEX idx_access_log_created ON memory_access_log(user_id, created_at DESC);
