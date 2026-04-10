-- Memory MCP: OAuth tables for MCP authentication
-- These tables are accessed ONLY via service-role client (RLS denies all)

CREATE TABLE mcp_oauth_clients (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id                   TEXT UNIQUE NOT NULL,
  client_secret_hash          TEXT,
  client_name                 TEXT,
  redirect_uris               JSONB NOT NULL,
  grant_types                 TEXT[] DEFAULT '{authorization_code,refresh_token}',
  response_types              TEXT[] DEFAULT '{code}',
  scope                       TEXT DEFAULT 'mcp:tools',
  token_endpoint_auth_method  TEXT DEFAULT 'none',
  metadata                    JSONB DEFAULT '{}',
  created_at                  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE mcp_oauth_authorization_codes (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code_hash             TEXT UNIQUE NOT NULL,
  client_id             TEXT NOT NULL REFERENCES mcp_oauth_clients(client_id),
  user_id               UUID NOT NULL REFERENCES auth.users(id),
  redirect_uri          TEXT NOT NULL,
  code_challenge        TEXT NOT NULL,
  code_challenge_method TEXT NOT NULL DEFAULT 'S256',
  scopes                TEXT[],
  resource              TEXT,
  expires_at            TIMESTAMPTZ NOT NULL,
  used_at               TIMESTAMPTZ,
  created_at            TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE mcp_oauth_tokens (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  access_token_hash   TEXT UNIQUE NOT NULL,
  refresh_token_hash  TEXT UNIQUE NOT NULL,
  client_id           TEXT NOT NULL REFERENCES mcp_oauth_clients(client_id),
  user_id             UUID NOT NULL REFERENCES auth.users(id),
  scopes              TEXT[],
  resource            TEXT,
  expires_at          TIMESTAMPTZ NOT NULL,
  refresh_expires_at  TIMESTAMPTZ NOT NULL,
  revoked_at          TIMESTAMPTZ,
  last_used_at        TIMESTAMPTZ,
  created_at          TIMESTAMPTZ DEFAULT now()
);

-- RLS: deny all — only service role can access
ALTER TABLE mcp_oauth_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE mcp_oauth_authorization_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE mcp_oauth_tokens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "deny_all" ON mcp_oauth_clients USING (false);
CREATE POLICY "deny_all" ON mcp_oauth_authorization_codes USING (false);
CREATE POLICY "deny_all" ON mcp_oauth_tokens USING (false);

-- Indexes for fast token lookups
CREATE INDEX idx_oauth_tokens_access ON mcp_oauth_tokens(access_token_hash);
CREATE INDEX idx_oauth_tokens_refresh ON mcp_oauth_tokens(refresh_token_hash);
CREATE INDEX idx_oauth_tokens_user ON mcp_oauth_tokens(user_id);
CREATE INDEX idx_oauth_codes_hash ON mcp_oauth_authorization_codes(code_hash);
