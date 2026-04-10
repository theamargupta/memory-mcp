import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateEmbedding } from '@/lib/embeddings'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const query = body.query
  const limit = Math.min(Number(body.limit || 10), 20)
  const category = body.category || null
  const project = body.project || null

  if (!query || typeof query !== 'string') {
    return NextResponse.json({ error: 'query is required' }, { status: 400 })
  }

  const queryEmbedding = await generateEmbedding(query)
  if (!queryEmbedding) {
    return NextResponse.json({ error: 'Failed to generate query embedding' }, { status: 502 })
  }

  const { data, error } = await supabase.rpc('search_memories', {
    query_embedding: JSON.stringify(queryEmbedding),
    match_count: limit,
    p_user_id: user.id,
    p_category: category,
    p_project: project,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ results: data || [] })
}
