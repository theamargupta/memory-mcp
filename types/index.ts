export type MemoryCategory =
  | 'preference'
  | 'rule'
  | 'project'
  | 'decision'
  | 'context'
  | 'snippet'
  | 'note'
  | 'persona'

export type MemorySource =
  | 'manual'
  | 'claude_chat'
  | 'claude_code'
  | 'cursor'
  | 'api'

export type Memory = {
  id: string
  user_id: string
  title: string
  content: string
  category: MemoryCategory
  tags: string[]
  project: string | null
  source: MemorySource
  metadata: Record<string, unknown>
  is_active: boolean
  created_at: string
  updated_at: string
  expires_at: string | null
}

export type MemoryInsert = {
  title: string
  content: string
  category?: MemoryCategory
  tags?: string[]
  project?: string | null
  source?: MemorySource
  metadata?: Record<string, unknown>
}

export type MemoryUpdate = {
  title?: string
  content?: string
  category?: MemoryCategory
  tags?: string[]
  project?: string | null
  metadata?: Record<string, unknown>
}
