import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET() {
  const supabase = createServerClient()

  const [{ data: examples }, { data: notes }] = await Promise.all([
    supabase
      .from('codebook_examples')
      .select('*, tweets(id, content, author, platform, posted_at)')
      .order('code')
      .order('added_at'),
    supabase
      .from('codebook_notes')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1),
  ])

  return NextResponse.json({
    examples: examples ?? [],
    notes: notes?.[0] ?? null,
  })
}
