import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateEmbedding } from '@/lib/embeddings'

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Find memories without embeddings
  const { data: memories, error } = await supabase
    .from('memories')
    .select('id, title, content')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .is('embedding', null)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!memories || memories.length === 0) {
    return NextResponse.json({ message: 'All memories already have embeddings.', backfilled: 0 })
  }

  let backfilled = 0
  for (const mem of memories) {
    const embedding = await generateEmbedding(`${mem.title}\n\n${mem.content}`)
    if (!embedding) continue

    const { error: updateError } = await supabase
      .from('memories')
      .update({ embedding })
      .eq('id', mem.id)
      .eq('user_id', user.id)

    if (!updateError) backfilled++
  }

  return NextResponse.json({
    message: `Backfilled ${backfilled} of ${memories.length} memories.`,
    backfilled,
    total: memories.length,
  })
}
