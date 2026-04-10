import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceRoleClient } from '@/lib/supabase/service-role'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const serviceClient = createServiceRoleClient()

  // Get all tokens for this user with client info
  const { data: tokens, error } = await serviceClient
    .from('mcp_oauth_tokens')
    .select('id, client_id, created_at, expires_at, revoked_at, last_used_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Get client names for each unique client_id
  const clientIds = [...new Set((tokens || []).map((t) => t.client_id))]
  const { data: clients } = await serviceClient
    .from('mcp_oauth_clients')
    .select('client_id, client_name')
    .in('client_id', clientIds)

  const clientMap = new Map((clients || []).map((c) => [c.client_id, c.client_name]))

  const connections = (tokens || []).map((t) => ({
    id: t.id,
    client_id: t.client_id,
    client_name: clientMap.get(t.client_id) || 'Unknown Client',
    created_at: t.created_at,
    expires_at: t.expires_at,
    revoked_at: t.revoked_at,
    last_used_at: t.last_used_at,
    is_active: !t.revoked_at && new Date(t.expires_at).getTime() > Date.now(),
  }))

  return NextResponse.json({ connections })
}

// Revoke a specific token
export async function DELETE(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await request.json()
  if (!id) {
    return NextResponse.json({ error: 'Token id is required' }, { status: 400 })
  }

  const serviceClient = createServiceRoleClient()

  // Verify this token belongs to the user before revoking
  const { data: token } = await serviceClient
    .from('mcp_oauth_tokens')
    .select('id, user_id')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!token) {
    return NextResponse.json({ error: 'Token not found' }, { status: 404 })
  }

  await serviceClient
    .from('mcp_oauth_tokens')
    .update({ revoked_at: new Date().toISOString() })
    .eq('id', id)

  return NextResponse.json({ success: true })
}
