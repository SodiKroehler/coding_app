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

  // Get all tweet IDs already rated by this rater in this round
  const { data: rated } = await supabase
    .from('ratings')
    .select('tweet_id')
    .eq('rater_id', rater_id)
    .eq('round_id', round_id)

  const ratedIds = (rated ?? []).map((r) => r.tweet_id)

  // Find next assigned tweet not yet rated
  let query = supabase
    .from('assignments')
    .select('tweet_id, tweets(*)')
    .eq('rater_id', rater_id)
    .eq('round_id', round_id)
    .limit(1)

  if (ratedIds.length > 0) {
    query = query.not('tweet_id', 'in', `(${ratedIds.join(',')})`)
  }

  const { data, error } = await query.single()

  if (error || !data) {
    return NextResponse.json({ tweet: null })
  }

  return NextResponse.json({ tweet: data.tweets })
}
