import { NextRequest, NextResponse } from 'next/server'
import { CONSENSUS_RATER_NAME, getConsensusRaterId } from '@/lib/consensus'
import { LABEL_COLUMNS } from '@/lib/dimensions'
import { DEFAULT_DISAGREEMENT_THRESHOLD, disagreementScore } from '@/lib/disagreement'
import { createServerClient } from '@/lib/supabase'
import type { ExplorerRaterRating, ExplorerRow } from '@/lib/types'

interface AssignmentRow {
  tweet_id: string
  rater_id: string
  round_id: string
}

const RATING_EXTRA_COLUMNS = [
  'stance',
  'actor',
  'actor_political_leaning',
  'actor_portrayal',
  'victim_political_leaning',
  'action',
  'target',
  'known_conspiracy',
  'known_conspiracy_other',
  'note',
  'created_at',
] as const

type RatingRow = {
  tweet_id: string
  rater_id: string
  round_id: string
  conspiracy_label: string | null
  post_polarity_label: string | null
  poster_polarity_label: string | null
  stance: string | null
  actor: string | null
  actor_political_leaning: string | null
  actor_portrayal: string | null
  victim_political_leaning: string | null
  action: string | null
  target: string | null
  known_conspiracy: string | null
  known_conspiracy_other: string | null
  note: string | null
  created_at: string | null
}

function toExplorerRating(
  r: RatingRow,
  raterName: string
): ExplorerRaterRating {
  return {
    rater_id: r.rater_id,
    rater_name: raterName,
    round_id: r.round_id,
    conspiracy_label: r.conspiracy_label,
    post_polarity_label: r.post_polarity_label,
    poster_polarity_label: r.poster_polarity_label,
    stance: r.stance,
    actor: r.actor,
    actor_political_leaning: r.actor_political_leaning,
    actor_portrayal: r.actor_portrayal,
    victim_political_leaning: r.victim_political_leaning,
    action: r.action,
    target: r.target,
    known_conspiracy: r.known_conspiracy,
    known_conspiracy_other: r.known_conspiracy_other,
    note: r.note,
    created_at: r.created_at,
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const round_id = searchParams.get('round_id')

  const supabase = createServerClient()
  const consensusId = await getConsensusRaterId(supabase)

  let assignmentQuery = supabase
    .from('assignments')
    .select('tweet_id, rater_id, round_id')

  if (round_id) assignmentQuery = assignmentQuery.eq('round_id', round_id)

  const { data: rawAssignments, error: aErr } = await assignmentQuery
  if (aErr) return NextResponse.json({ error: aErr.message }, { status: 500 })
  const assignments = (rawAssignments ?? []) as unknown as AssignmentRow[]

  const tweetIds = [...new Set(assignments.map((a) => a.tweet_id))]
  if (tweetIds.length === 0) return NextResponse.json({ rows: [] })

  const { data: tweets, error: tErr } = await supabase
    .from('tweets')
    .select('*')
    .in('id', tweetIds)
  if (tErr) return NextResponse.json({ error: tErr.message }, { status: 500 })

  const { data: raters, error: ratersErr } = await supabase.from('raters').select('id, name')
  if (ratersErr) return NextResponse.json({ error: ratersErr.message }, { status: 500 })
  const namesById: Record<string, string> = {}
  for (const r of raters ?? []) {
    namesById[r.id] = r.name
  }

  const labelSelect = [
    'tweet_id',
    'rater_id',
    'round_id',
    ...LABEL_COLUMNS,
    ...RATING_EXTRA_COLUMNS,
  ].join(', ')
  let ratingsQuery = supabase.from('ratings').select(labelSelect).in('tweet_id', tweetIds)

  if (round_id) ratingsQuery = ratingsQuery.eq('round_id', round_id)

  const { data: rawRatings, error: rErr } = await ratingsQuery
  if (rErr) return NextResponse.json({ error: rErr.message }, { status: 500 })
  const ratings = (rawRatings ?? []) as unknown as RatingRow[]

  const assignmentsByTweet: Record<string, AssignmentRow[]> = {}
  for (const a of assignments) {
    if (!assignmentsByTweet[a.tweet_id]) assignmentsByTweet[a.tweet_id] = []
    assignmentsByTweet[a.tweet_id].push(a)
  }

  const ratingsByTweet: Record<string, RatingRow[]> = {}
  for (const r of ratings) {
    if (!ratingsByTweet[r.tweet_id]) ratingsByTweet[r.tweet_id] = []
    ratingsByTweet[r.tweet_id].push(r)
  }

  const rows: ExplorerRow[] = (tweets ?? []).map((tweet) => {
    const tweetRatings = ratingsByTweet[tweet.id] ?? []
    const tweetAssignments = assignmentsByTweet[tweet.id] ?? []

    const humanRatings = tweetRatings.filter((r) => r.rater_id !== consensusId)
    const consensusRows = consensusId
      ? tweetRatings.filter((r) => r.rater_id === consensusId)
      : []

    const raterLabels: ExplorerRaterRating[] = humanRatings.map((r) =>
      toExplorerRating(r, namesById[r.rater_id] ?? 'Unknown')
    )

    const consensusRatings: ExplorerRaterRating[] = consensusRows.map((r) =>
      toExplorerRating(r, namesById[r.rater_id] ?? CONSENSUS_RATER_NAME)
    )

    const score = disagreementScore(raterLabels)

    return {
      tweet,
      raterLabels,
      consensusRatings,
      disagreementScore: score,
      hasDisagreement: score >= DEFAULT_DISAGREEMENT_THRESHOLD,
      hasConsensus: consensusRatings.length > 0,
      totalAssigned: tweetAssignments.length,
      totalRated: humanRatings.length,
    }
  })

  rows.sort((a, b) => {
    if (a.disagreementScore !== b.disagreementScore) return b.disagreementScore - a.disagreementScore
    const aComplete = a.totalRated >= a.totalAssigned
    const bComplete = b.totalRated >= b.totalAssigned
    if (aComplete !== bComplete) return aComplete ? 1 : -1
    return 0
  })

  return NextResponse.json({ rows })
}
