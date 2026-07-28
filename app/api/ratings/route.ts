import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { LABEL_COLUMNS } from '@/lib/dimensions'
import { STANCE_OPTIONS, type Stance } from '@/lib/knownConspiracies'

function optText(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed || null
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const {
    tweet_id,
    rater_id,
    round_id,
    labels,
    note,
    stance,
    actor,
    action,
    target,
    known_conspiracy,
    known_conspiracy_other,
  } = body as {
    tweet_id: string
    rater_id: string
    round_id: string
    labels: Record<string, string>
    note?: string | null
    stance?: string
    actor?: string | null
    action?: string | null
    target?: string | null
    known_conspiracy?: string | null
    known_conspiracy_other?: string | null
  }

  if (!tweet_id || !rater_id || !round_id || !labels) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const resolvedStance = (stance ?? 'NEUTRAL') as Stance
  if (!STANCE_OPTIONS.includes(resolvedStance)) {
    return NextResponse.json({ error: 'Invalid stance' }, { status: 400 })
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
    stance: resolvedStance,
    actor: optText(actor),
    action: optText(action),
    target: optText(target),
    known_conspiracy: optText(known_conspiracy),
    known_conspiracy_other: optText(known_conspiracy_other),
    note: optText(note),
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
