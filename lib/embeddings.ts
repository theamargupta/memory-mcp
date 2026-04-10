import 'server-only'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Generate a 384-dim gte-small embedding via the Supabase Edge Function.
 * Returns null on failure so callers can degrade gracefully (save without embedding).
 */
export async function generateEmbedding(text: string): Promise<number[] | null> {
  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/embed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ input: text }),
    })

    if (!res.ok) return null

    const { embeddings } = await res.json()
    return embeddings as number[]
  } catch {
    return null
  }
}

/**
 * Generate embeddings for multiple texts in one call.
 */
export async function generateEmbeddings(texts: string[]): Promise<(number[] | null)[]> {
  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/embed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ input: texts }),
    })

    if (!res.ok) return texts.map(() => null)

    const { embeddings } = await res.json()
    return embeddings as (number[] | null)[]
  } catch {
    return texts.map(() => null)
  }
}
