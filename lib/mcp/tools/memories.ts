import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { getUserMemoriesCacheTag } from '@/lib/cache-tags'
import { revalidateTag } from 'next/cache'
import { generateEmbedding } from '@/lib/embeddings'

function stripNulls<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== null && v !== undefined)
  ) as Partial<T>
}

function logAccess(userId: string, action: string, source: string, memoryId?: string, query?: string) {
  const supabase = createServiceRoleClient()
  void supabase.from('memory_access_log').insert({
    user_id: userId,
    memory_id: memoryId || null,
    action,
    source,
    query: query || null,
  })
}

export function registerMemoryTools(server: McpServer) {
  // ── save_memory ────────────────────────────────────────
  server.tool(
    'save_memory',
    'Store a new memory with content, category, tags, and optional project scope.',
    {
      title: z.string().min(1).describe('Memory title'),
      content: z.string().min(1).describe('Memory content — the knowledge to store'),
      category: z
        .enum(['preference', 'rule', 'project', 'decision', 'context', 'snippet', 'note', 'persona'])
        .default('note')
        .describe('Category (default: note)'),
      tags: z.array(z.string()).default([]).describe('Tags for organizing'),
      project: z.string().optional().describe('Optional project scope'),
    },
    async ({ title, content, category, tags, project }, { authInfo }) => {
      const userId = authInfo?.extra?.userId as string
      if (!userId) throw new Error('Unauthorized')

      const supabase = createServiceRoleClient()
      const embedding = await generateEmbedding(`${title.trim()}\n\n${content.trim()}`)
      const { data, error } = await supabase
        .from('memories')
        .insert({
          user_id: userId,
          title: title.trim(),
          content: content.trim(),
          category,
          tags,
          project: project?.trim() || null,
          source: authInfo?.clientId?.startsWith('mcp_client_') ? 'api' : 'manual',
          ...(embedding ? { embedding } : {}),
        })
        .select('id, title, category')
        .single()

      if (error) return { content: [{ type: 'text' as const, text: `Error: ${error.message}` }], isError: true }

      revalidateTag(getUserMemoriesCacheTag(userId), 'max')
      logAccess(userId, 'save', authInfo?.clientId || 'mcp', data.id)

      return {
        content: [{ type: 'text' as const, text: JSON.stringify({ id: data.id, message: 'Memory saved successfully', title: data.title }) }],
      }
    }
  )

  // ── search_memory ──────────────────────────────────────
  server.tool(
    'search_memory',
    'Semantic search across all memories using natural language query. Uses AI-powered vector similarity.',
    {
      query: z.string().min(1).describe('Natural language search query'),
      limit: z.number().min(1).max(20).default(5).describe('Max results (default: 5)'),
      category: z
        .enum(['preference', 'rule', 'project', 'decision', 'context', 'snippet', 'note', 'persona'])
        .optional()
        .describe('Optional category filter'),
      project: z.string().optional().describe('Optional project filter'),
    },
    async ({ query, limit, category, project }, { authInfo }) => {
      const userId = authInfo?.extra?.userId as string
      if (!userId) throw new Error('Unauthorized')

      const supabase = createServiceRoleClient()
      const queryEmbedding = await generateEmbedding(query)
      if (!queryEmbedding) {
        return { content: [{ type: 'text' as const, text: 'Error: Failed to generate query embedding' }], isError: true }
      }
      const { data, error } = await supabase.rpc('search_memories', {
        query_embedding: JSON.stringify(queryEmbedding),
        match_count: limit,
        p_user_id: userId,
        p_category: category || null,
        p_project: project || null,
      })

      if (error) return { content: [{ type: 'text' as const, text: `Error: ${error.message}` }], isError: true }

      const results = (data || []).map(stripNulls)
      logAccess(userId, 'search', authInfo?.clientId || 'mcp', undefined, query)

      return {
        content: [{ type: 'text' as const, text: JSON.stringify({ results, count: results.length }) }],
      }
    }
  )

  // ── list_memories ──────────────────────────────────────
  server.tool(
    'list_memories',
    'Browse memories by category, tags, project, or date range.',
    {
      category: z
        .enum(['preference', 'rule', 'project', 'decision', 'context', 'snippet', 'note', 'persona'])
        .optional()
        .describe('Filter by category'),
      tag: z.string().optional().describe('Filter by tag'),
      project: z.string().optional().describe('Filter by project'),
      limit: z.number().min(1).max(50).default(20).describe('Max results (default: 20)'),
    },
    async ({ category, tag, project, limit }, { authInfo }) => {
      const userId = authInfo?.extra?.userId as string
      if (!userId) throw new Error('Unauthorized')

      const supabase = createServiceRoleClient()
      let query = supabase
        .from('memories')
        .select('id, title, content, category, tags, project, updated_at')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('updated_at', { ascending: false })
        .limit(limit)

      if (category) query = query.eq('category', category)
      if (tag) query = query.contains('tags', [tag])
      if (project) query = query.eq('project', project)

      const { data, error } = await query
      if (error) return { content: [{ type: 'text' as const, text: `Error: ${error.message}` }], isError: true }

      const cleaned = (data || []).map(stripNulls)
      logAccess(userId, 'list', authInfo?.clientId || 'mcp')

      return { content: [{ type: 'text' as const, text: JSON.stringify(cleaned) }] }
    }
  )

  // ── get_memory ─────────────────────────────────────────
  server.tool(
    'get_memory',
    'Retrieve a specific memory by ID.',
    {
      memory_id: z.string().uuid().describe('UUID of the memory'),
    },
    async ({ memory_id }, { authInfo }) => {
      const userId = authInfo?.extra?.userId as string
      if (!userId) throw new Error('Unauthorized')

      const supabase = createServiceRoleClient()
      const { data, error } = await supabase
        .from('memories')
        .select('*')
        .eq('id', memory_id)
        .eq('user_id', userId)
        .eq('is_active', true)
        .single()

      if (error || !data) {
        return { content: [{ type: 'text' as const, text: 'Error: Memory not found' }], isError: true }
      }

      logAccess(userId, 'get', authInfo?.clientId || 'mcp', memory_id)

      return { content: [{ type: 'text' as const, text: JSON.stringify(stripNulls(data)) }] }
    }
  )

  // ── update_memory ──────────────────────────────────────
  server.tool(
    'update_memory',
    "Modify title, content, tags, or category of an existing memory. PATCH semantics — omitted fields are left unchanged.",
    {
      memory_id: z.string().uuid().describe('UUID of the memory'),
      title: z.string().min(1).optional().describe('New title'),
      content: z.string().min(1).optional().describe('New content'),
      category: z
        .enum(['preference', 'rule', 'project', 'decision', 'context', 'snippet', 'note', 'persona'])
        .optional()
        .describe('New category'),
      tags: z.array(z.string()).optional().describe('New tags (replaces existing)'),
      project: z.string().nullable().optional().describe('New project or null to clear'),
    },
    async ({ memory_id, ...fields }, { authInfo }) => {
      const userId = authInfo?.extra?.userId as string
      if (!userId) throw new Error('Unauthorized')

      const supabase = createServiceRoleClient()
      const updates: Record<string, unknown> = {}
      if (fields.title !== undefined) updates.title = fields.title.trim()
      if (fields.content !== undefined) updates.content = fields.content.trim()
      if (fields.category !== undefined) updates.category = fields.category
      if (fields.tags !== undefined) updates.tags = fields.tags
      if (fields.project !== undefined) updates.project = fields.project?.trim() || null

      if (Object.keys(updates).length === 0) {
        return { content: [{ type: 'text' as const, text: 'Error: No fields to update' }], isError: true }
      }

      // Re-generate embedding if title or content changed
      if (updates.title !== undefined || updates.content !== undefined) {
        // Fetch current values for fields not being updated
        const { data: current } = await supabase
          .from('memories')
          .select('title, content')
          .eq('id', memory_id)
          .eq('user_id', userId)
          .single()
        if (current) {
          const newTitle = (updates.title as string) ?? current.title
          const newContent = (updates.content as string) ?? current.content
          const embedding = await generateEmbedding(`${newTitle}\n\n${newContent}`)
          if (embedding) updates.embedding = embedding
        }
      }

      const { data, error } = await supabase
        .from('memories')
        .update(updates)
        .eq('id', memory_id)
        .eq('user_id', userId)
        .eq('is_active', true)
        .select('id, title, category, updated_at')
        .single()

      if (error || !data) {
        return { content: [{ type: 'text' as const, text: 'Error: Memory not found' }], isError: true }
      }

      revalidateTag(getUserMemoriesCacheTag(userId), 'max')
      logAccess(userId, 'update', authInfo?.clientId || 'mcp', memory_id)

      return { content: [{ type: 'text' as const, text: JSON.stringify(stripNulls(data)) }] }
    }
  )

  // ── delete_memory ──────────────────────────────────────
  server.tool(
    'delete_memory',
    'Remove a memory (soft delete — can be undone).',
    {
      memory_id: z.string().uuid().describe('UUID of the memory to delete'),
    },
    async ({ memory_id }, { authInfo }) => {
      const userId = authInfo?.extra?.userId as string
      if (!userId) throw new Error('Unauthorized')

      const supabase = createServiceRoleClient()
      const { error } = await supabase
        .from('memories')
        .update({ is_active: false })
        .eq('id', memory_id)
        .eq('user_id', userId)

      if (error) return { content: [{ type: 'text' as const, text: `Error: ${error.message}` }], isError: true }

      revalidateTag(getUserMemoriesCacheTag(userId), 'max')
      logAccess(userId, 'delete', authInfo?.clientId || 'mcp', memory_id)

      return { content: [{ type: 'text' as const, text: JSON.stringify({ success: true }) }] }
    }
  )

  // ── get_rules ──────────────────────────────────────────
  server.tool(
    'get_rules',
    "Fetch all 'rule' category memories — shortcut for .claude.md style rules. Optionally filter by project.",
    {
      project: z.string().optional().describe('Optional project to scope rules to'),
    },
    async ({ project }, { authInfo }) => {
      const userId = authInfo?.extra?.userId as string
      if (!userId) throw new Error('Unauthorized')

      const supabase = createServiceRoleClient()
      let query = supabase
        .from('memories')
        .select('id, title, content, tags, project')
        .eq('user_id', userId)
        .eq('category', 'rule')
        .eq('is_active', true)
        .order('updated_at', { ascending: false })

      if (project) query = query.eq('project', project)

      const { data, error } = await query
      if (error) return { content: [{ type: 'text' as const, text: `Error: ${error.message}` }], isError: true }

      const rules = (data || []).map((r) => r.content)
      logAccess(userId, 'get_rules', authInfo?.clientId || 'mcp')

      return {
        content: [{ type: 'text' as const, text: JSON.stringify({ rules, count: rules.length }) }],
      }
    }
  )

  // ── get_context ────────────────────────────────────────
  server.tool(
    'get_context',
    'Fetch all memories for a specific project — instant project onboarding.',
    {
      project: z.string().min(1).describe('Project name to get context for'),
    },
    async ({ project }, { authInfo }) => {
      const userId = authInfo?.extra?.userId as string
      if (!userId) throw new Error('Unauthorized')

      const supabase = createServiceRoleClient()
      const { data, error } = await supabase
        .from('memories')
        .select('id, title, content, category, tags')
        .eq('user_id', userId)
        .eq('project', project)
        .eq('is_active', true)
        .order('category')
        .order('updated_at', { ascending: false })

      if (error) return { content: [{ type: 'text' as const, text: `Error: ${error.message}` }], isError: true }

      const cleaned = (data || []).map(stripNulls)
      logAccess(userId, 'get_context', authInfo?.clientId || 'mcp', undefined, project)

      return { content: [{ type: 'text' as const, text: JSON.stringify({ project, memories: cleaned, count: cleaned.length }) }] }
    }
  )
}
