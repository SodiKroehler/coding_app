import { DIMENSION_BY_COLUMN, LABEL_COLUMNS } from '@/lib/dimensions'
import {
  ACTOR_PORTRAYAL_OPTIONS,
  STANCE_OPTIONS,
  VICTIM_POLITICAL_LEANING_OPTIONS,
  type ActorPoliticalLeaning,
  type Stance,
} from '@/lib/knownConspiracies'

const ACTOR_LEAN_VALUES: ActorPoliticalLeaning[] = ['left', 'right', 'center', 'unclear']

function optText(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed || null
}

export type RatingColumnValues = {
  stance: Stance
  actor: string | null
  actor_political_leaning: string | null
  actor_portrayal: string | null
  victim_political_leaning: string | null
  action: string | null
  target: string | null
  known_conspiracy: string | null
  known_conspiracy_other: string | null
  note: string | null
} & Record<string, string | null | Stance>

export type ParsedRatingWrite = {
  tweet_id: string
  round_id: string
  rater_id: string | null
  columns: RatingColumnValues
}

export type ParseRatingWriteResult =
  | { ok: true; data: ParsedRatingWrite }
  | { ok: false; error: string }

export function parseRatingWriteBody(
  body: unknown,
  opts: { requireRaterId: boolean }
): ParseRatingWriteResult {
  if (body == null || typeof body !== 'object') {
    return { ok: false, error: 'Invalid body' }
  }

  const {
    tweet_id,
    rater_id,
    round_id,
    labels,
    note,
    stance,
    actor,
    actor_political_leaning,
    actor_portrayal,
    victim_political_leaning,
    action,
    target,
    known_conspiracy,
    known_conspiracy_other,
  } = body as Record<string, unknown>

  if (typeof tweet_id !== 'string' || !tweet_id || typeof round_id !== 'string' || !round_id) {
    return { ok: false, error: 'Missing required fields' }
  }

  if (labels == null || typeof labels !== 'object' || Array.isArray(labels)) {
    return { ok: false, error: 'Missing required fields' }
  }

  let resolvedRaterId: string | null = null
  if (opts.requireRaterId) {
    if (typeof rater_id !== 'string' || !rater_id) {
      return { ok: false, error: 'Missing required fields' }
    }
    resolvedRaterId = rater_id
  }

  const resolvedStance = (stance ?? 'NEUTRAL') as Stance
  if (!STANCE_OPTIONS.includes(resolvedStance)) {
    return { ok: false, error: 'Invalid stance' }
  }

  const actorLean = optText(actor_political_leaning)
  if (actorLean && !ACTOR_LEAN_VALUES.includes(actorLean as ActorPoliticalLeaning)) {
    return { ok: false, error: 'Invalid actor_political_leaning' }
  }

  const portrayal = optText(actor_portrayal)
  if (portrayal && !ACTOR_PORTRAYAL_OPTIONS.some((o) => o.value === portrayal)) {
    return { ok: false, error: 'Invalid actor_portrayal' }
  }

  const victimLean = optText(victim_political_leaning)
  if (victimLean && !VICTIM_POLITICAL_LEANING_OPTIONS.some((o) => o.value === victimLean)) {
    return { ok: false, error: 'Invalid victim_political_leaning' }
  }

  const labelRecord = labels as Record<string, unknown>
  const labelData: Record<string, string | null> = {}
  for (const col of LABEL_COLUMNS) {
    if (labelRecord[col] === undefined) continue
    const val = optText(labelRecord[col])
    const dim = DIMENSION_BY_COLUMN[col]
    if (!val) {
      if (dim?.required) {
        return { ok: false, error: `Missing required label: ${dim.label}` }
      }
      labelData[col] = null
      continue
    }
    if (dim && !dim.options.some((o) => o.value === val)) {
      return { ok: false, error: `Invalid value for ${col}` }
    }
    labelData[col] = val
  }

  for (const dim of LABEL_COLUMNS.map((col) => DIMENSION_BY_COLUMN[col])) {
    if (dim?.required && !labelData[dim.dbColumn]) {
      return { ok: false, error: `Missing required label: ${dim.label}` }
    }
  }

  return {
    ok: true,
    data: {
      tweet_id,
      round_id,
      rater_id: resolvedRaterId,
      columns: {
        stance: resolvedStance,
        actor: optText(actor),
        actor_political_leaning: actorLean,
        actor_portrayal: portrayal,
        victim_political_leaning: victimLean,
        action: optText(action),
        target: optText(target),
        known_conspiracy: optText(known_conspiracy),
        known_conspiracy_other: optText(known_conspiracy_other),
        note: optText(note),
        ...labelData,
      },
    },
  }
}
