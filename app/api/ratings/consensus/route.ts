import { NextRequest, NextResponse } from 'next/server'
import { getConsensusRaterId } from '@/lib/consensus'
import { parseRatingWriteBody } from '@/lib/ratingWrite'
import { createServerClient } from '@/lib/supabase'

export async function PUT(req: NextRequest) {
  const body = await req.json()
  const parsed = parseRatingWriteBody(body, { requireRaterId: false })
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 })
  }

  const { tweet_id, round_id, columns } = parsed.data
  const supabase = createServerClient()
  const consensusId = await getConsensusRaterId(supabase)
  if (!consensusId) {
    return NextResponse.json(
      { error: 'CONSENSUS rater is not seeded. Run supabase/migrations/seed_consensus_rater.sql' },
      { status: 500 }
    )
  }

  const { data: existing, error: lookupError } = await supabase
    .from('ratings')
    .select('id')
    .eq('tweet_id', tweet_id)
    .eq('rater_id', consensusId)
    .eq('round_id', round_id)
    .maybeSingle()

  if (lookupError) {
    return NextResponse.json({ error: lookupError.message }, { status: 500 })
  }

  if (existing?.id) {
    const { error } = await supabase
      .from('ratings')
      .update(columns)
      .eq('id', existing.id)
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ id: existing.id })
  }

  const id = `${tweet_id}__${consensusId}__${round_id}`
  const { error } = await supabase.from('ratings').insert({
    id,
    tweet_id,
    rater_id: consensusId,
    round_id,
    ...columns,
  })

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Consensus already exists' }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ id }, { status: 201 })
}
