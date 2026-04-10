import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateEmbedding } from '@/lib/embeddings'
import type { MemoryInsert } from '@/types'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = request.nextUrl
  const category = searchParams.get('category')
  const project = searchParams.get('project')
  const tag = searchParams.get('tag')
  const search = searchParams.get('q')
  const limit = Math.min(Number(searchParams.get('limit') || 50), 100)
  const offset = Number(searchParams.get('offset') || 0)

  let query = supabase
    .from('memories')
    .select('*', { count: 'exact' })
    .eq('user_id', user.id)
    .eq('is_active', true)
    .order('updated_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (category) query = query.eq('category', category)
  if (project) query = query.eq('project', project)
  if (tag) query = query.contains('tags', [tag])
  if (search) query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`)

  const { data, error, count } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data, count })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body: MemoryInsert = await request.json()

  if (!body.title?.trim() || !body.content?.trim()) {
    return NextResponse.json(
      { error: 'title and content are required' },
      { status: 400 }
    )
  }

  const embedding = await generateEmbedding(`${body.title.trim()}\n\n${body.content.trim()}`)

  const { data, error } = await supabase
    .from('memories')
    .insert({
      user_id: user.id,
      title: body.title.trim(),
      content: body.content.trim(),
      category: body.category || 'note',
      tags: body.tags || [],
      project: body.project?.trim() || null,
      source: body.source || 'manual',
      metadata: body.metadata || {},
      ...(embedding ? { embedding } : {}),
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data }, { status: 201 })
}
