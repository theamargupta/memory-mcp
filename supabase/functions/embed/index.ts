// Supabase Edge Function — generates gte-small embeddings (384-dim)
// Replaces the broken ai.embed() calls that required a non-existent "ai" schema in Postgres.

import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const model = new Supabase.ai.Session("gte-small")

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "authorization, content-type, x-client-info, apikey",
      },
    })
  }

  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 })
  }

  const { input } = await req.json()

  if (!input || (typeof input !== "string" && !Array.isArray(input))) {
    return Response.json(
      { error: "input is required (string or string[])" },
      { status: 400 },
    )
  }

  const inputs = Array.isArray(input) ? input : [input]
  const embeddings: number[][] = []

  for (const text of inputs) {
    const embedding = await model.run(text, { mean_pool: true, normalize: true })
    embeddings.push(Array.from(embedding))
  }

  return Response.json({
    embeddings: Array.isArray(input) ? embeddings : embeddings[0],
  })
})
