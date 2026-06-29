import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { LABEL_COLUMNS } from '@/lib/dimensions'
import type { ExplorerRow } from '@/lib/types'

interface AssignmentRow {
  tweet_id: string
  rater_id: string
  round_id: string
  raters: { id: string; name: string } | null
}

interface RatingRow {
  tweet_id: string
  rater_id: string
  round_id: string
  conspiracy_label: string | null
  polarity_label: string | null
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const round_id = searchParams.get('round_id')

  const supabase = createServerClient()

  // Fetch all assignments (with rater name)
  let assignmentQuery = supabase
    .from('assignments')
    .select('tweet_id, rater_id, round_id, raters(id, name)')

  if (round_id) assignmentQuery = assignmentQuery.eq('round_id', round_id)

  const { data: rawAssignments, error: aErr } = await assignmentQuery
  if (aErr) return NextResponse.json({ error: aErr.message }, { status: 500 })
  const assignments = (rawAssignments ?? []) as unknown as AssignmentRow[]

  const tweetIds = [...new Set(assignments.map((a) => a.tweet_id))]
  if (tweetIds.length === 0) return NextResponse.json({ rows: [] })

  // Fetch tweets
  const { data: tweets, error: tErr } = await supabase
    .from('tweets')
    .select('*')
    .in('id', tweetIds)
  if (tErr) return NextResponse.json({ error: tErr.message }, { status: 500 })

  // Fetch ratings (explicit column list avoids Supabase type parser issues)
  let ratingsQuery = supabase
    .from('ratings')
    .select('tweet_id, rater_id, round_id, conspiracy_label, polarity_label')
    .in('tweet_id', tweetIds)

  if (round_id) ratingsQuery = ratingsQuery.eq('round_id', round_id)

  const { data: rawRatings, error: rErr } = await ratingsQuery
  if (rErr) return NextResponse.json({ error: rErr.message }, { status: 500 })
  const ratings = (rawRatings ?? []) as unknown as RatingRow[]

  // Build rater name map: tweet_id → rater_id → name
  const raterNameMap: Record<string, Record<string, string>> = {}
  for (const a of assignments) {
    if (!raterNameMap[a.tweet_id]) raterNameMap[a.tweet_id] = {}
    if (a.raters) raterNameMap[a.tweet_id][a.rater_id] = a.raters.name
  }

  // Index assignments by tweet
  const assignmentsByTweet: Record<string, AssignmentRow[]> = {}
  for (const a of assignments) {
    if (!assignmentsByTweet[a.tweet_id]) assignmentsByTweet[a.tweet_id] = []
    assignmentsByTweet[a.tweet_id].push(a)
  }

  // Index ratings by tweet
  const ratingsByTweet: Record<string, RatingRow[]> = {}
  for (const r of ratings) {
    if (!ratingsByTweet[r.tweet_id]) ratingsByTweet[r.tweet_id] = []
    ratingsByTweet[r.tweet_id].push(r)
  }

  const rows: ExplorerRow[] = (tweets ?? []).map((tweet) => {
    const tweetRatings = ratingsByTweet[tweet.id] ?? []
    const tweetAssignments = assignmentsByTweet[tweet.id] ?? []
    const nameMap = raterNameMap[tweet.id] ?? {}

    const raterLabels = tweetRatings.map((r) => ({
      rater_id: r.rater_id,
      rater_name: nameMap[r.rater_id] ?? 'Unknown',
      conspiracy_label: r.conspiracy_label,
      polarity_label: r.polarity_label,
    }))

    // Detect disagreement across all label columns
    let hasDisagreement = false
    if (raterLabels.length >= 2) {
      for (const col of LABEL_COLUMNS) {
        const vals = raterLabels
          .map((rl) => (col === 'conspiracy_label' ? rl.conspiracy_label : rl.polarity_label))
          .filter(Boolean)
        if (vals.length >= 2 && new Set(vals).size > 1) {
          hasDisagreement = true
          break
        }
      }
    }

    return {
      tweet,
      raterLabels,
      hasDisagreement,
      totalAssigned: tweetAssignments.length,
      totalRated: tweetRatings.length,
    }
  })

  // Sort: disagreements first, then incomplete, then complete
  rows.sort((a, b) => {
    if (a.hasDisagreement !== b.hasDisagreement) return a.hasDisagreement ? -1 : 1
    const aComplete = a.totalRated >= a.totalAssigned
    const bComplete = b.totalRated >= b.totalAssigned
    if (aComplete !== bComplete) return aComplete ? 1 : -1
    return 0
  })

  return NextResponse.json({ rows })
}
