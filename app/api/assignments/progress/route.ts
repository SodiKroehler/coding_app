import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const rater_id = searchParams.get('rater_id')
  const round_id = searchParams.get('round_id')

  if (!rater_id || !round_id) {
    return NextResponse.json({ error: 'Missing rater_id or round_id' }, { status: 400 })
  }

  const supabase = createServerClient()

  const [{ count: total }, { count: rated }] = await Promise.all([
    supabase
      .from('assignments')
      .select('*', { count: 'exact', head: true })
      .eq('rater_id', rater_id)
      .eq('round_id', round_id),
    supabase
      .from('ratings')
      .select('*', { count: 'exact', head: true })
      .eq('rater_id', rater_id)
      .eq('round_id', round_id),
  ])

  return NextResponse.json({ total: total ?? 0, rated: rated ?? 0 })
}
