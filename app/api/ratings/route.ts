import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { LABEL_COLUMNS } from '@/lib/dimensions'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { tweet_id, rater_id, round_id, labels } = body as {
    tweet_id: string
    rater_id: string
    round_id: string
    labels: Record<string, string>
  }

  if (!tweet_id || !rater_id || !round_id || !labels) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const id = `${tweet_id}__${rater_id}__${round_id}`
  const supabase = createServerClient()

  // Build only the label columns we know about
  const labelData: Record<string, string> = {}
  for (const col of LABEL_COLUMNS) {
    if (labels[col] !== undefined) {
      labelData[col] = labels[col]
    }
  }

  const { error } = await supabase.from('ratings').insert({
    id,
    tweet_id,
    rater_id,
    round_id,
    ...labelData,
  })

  if (error) {
    if (error.code === '23505') {
      // Unique constraint violation — already rated
      return NextResponse.json({ error: 'Already rated' }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ id }, { status: 201 })
}
