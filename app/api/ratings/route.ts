import { NextRequest, NextResponse } from 'next/server'
import { getConsensusRaterId } from '@/lib/consensus'
import { parseRatingWriteBody } from '@/lib/ratingWrite'
import { createServerClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = parseRatingWriteBody(body, { requireRaterId: true })
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 })
  }

  const { tweet_id, rater_id, round_id, columns } = parsed.data
  if (!rater_id) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const supabase = createServerClient()
  const consensusId = await getConsensusRaterId(supabase)
  if (consensusId && rater_id === consensusId) {
    return NextResponse.json(
      { error: 'CONSENSUS ratings cannot be created from /rate' },
      { status: 400 }
    )
  }

  const id = `${tweet_id}__${rater_id}__${round_id}`
  const { error } = await supabase.from('ratings').insert({
    id,
    tweet_id,
    rater_id,
    round_id,
    ...columns,
  })

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Already rated' }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ id }, { status: 201 })
}

export async function PATCH(req: NextRequest) {
  const body = await req.json()
  const parsed = parseRatingWriteBody(body, { requireRaterId: true })
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 })
  }

  const { tweet_id, rater_id, round_id, columns } = parsed.data
  if (!rater_id) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const supabase = createServerClient()
  const consensusId = await getConsensusRaterId(supabase)
  if (consensusId && rater_id === consensusId) {
    return NextResponse.json(
      { error: 'CONSENSUS ratings must be saved via /api/ratings/consensus' },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from('ratings')
    .update(columns)
    .eq('tweet_id', tweet_id)
    .eq('rater_id', rater_id)
    .eq('round_id', round_id)
    .select('id')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  if (!data?.length) {
    return NextResponse.json({ error: 'Rating not found' }, { status: 404 })
  }

  return NextResponse.json({ id: data[0].id })
}
