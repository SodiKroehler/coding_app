import type { RatingExtras } from '@/lib/ratingFormTypes'
import { LABEL_COLUMNS, REQUIRED_DIMENSIONS } from '@/lib/dimensions'
import {
  ACTOR_POLITICAL_LEANING_OPTIONS,
  ACTOR_PORTRAYAL_OPTIONS,
  DEFAULT_STANCE,
  KNOWN_CONSPIRACY_OTHER,
  STANCE_OPTIONS,
  VICTIM_POLITICAL_LEANING_OPTIONS,
  TEMPLATE_MAX_WORDS,
  wordCount,
  type ActorPoliticalLeaning,
  type ActorPortrayal,
  type Stance,
  type VictimPoliticalLeaning,
} from '@/lib/knownConspiracies'
import type { ExplorerRaterRating } from '@/lib/types'

export type { RatingExtras } from '@/lib/ratingFormTypes'

export function emptyExtras(): RatingExtras {
  return {
    stance: DEFAULT_STANCE,
    actor: '',
    actorPoliticalLeaning: '',
    actorPortrayal: '',
    victimPoliticalLeaning: '',
    action: '',
    target: '',
    knownConspiracy: '',
    knownConspiracyOther: '',
  }
}

export function formFromRating(rating: ExplorerRaterRating): {
  labels: Record<string, string>
  note: string
  extras: RatingExtras
} {
  const labels: Record<string, string> = {}
  for (const col of LABEL_COLUMNS) {
    const val = rating[col as keyof ExplorerRaterRating]
    if (typeof val === 'string' && val) labels[col] = val
  }

  const stance = STANCE_OPTIONS.includes(rating.stance as Stance)
    ? (rating.stance as Stance)
    : DEFAULT_STANCE

  const lean = rating.actor_political_leaning
  const actorPoliticalLeaning = ACTOR_POLITICAL_LEANING_OPTIONS.some((o) => o.value === lean)
    ? (lean as ActorPoliticalLeaning)
    : ''

  const portrayal = rating.actor_portrayal
  const actorPortrayal = ACTOR_PORTRAYAL_OPTIONS.some((o) => o.value === portrayal)
    ? (portrayal as ActorPortrayal)
    : ''

  const victimLean = rating.victim_political_leaning
  const victimPoliticalLeaning = VICTIM_POLITICAL_LEANING_OPTIONS.some((o) => o.value === victimLean)
    ? (victimLean as VictimPoliticalLeaning)
    : ''

  return {
    labels,
    note: rating.note ?? '',
    extras: {
      stance,
      actor: rating.actor ?? '',
      actorPoliticalLeaning,
      actorPortrayal,
      victimPoliticalLeaning,
      action: rating.action ?? '',
      target: rating.target ?? '',
      knownConspiracy: rating.known_conspiracy ?? '',
      knownConspiracyOther: rating.known_conspiracy_other ?? '',
    },
  }
}

export function validateRatingForm(
  labels: Record<string, string>,
  extras: RatingExtras
): string | null {
  const missing = REQUIRED_DIMENSIONS.filter((d) => !labels[d.dbColumn])
  if (missing.length > 0) {
    return `Please select: ${missing.map((d) => d.label).join(', ')}`
  }

  if (!extras.stance) return 'Please select a stance'

  for (const [field, value] of [
    ['actor', extras.actor],
    ['action', extras.action],
    ['target', extras.target],
  ] as const) {
    if (wordCount(value) > TEMPLATE_MAX_WORDS) {
      return `${field} must be at most ${TEMPLATE_MAX_WORDS} words`
    }
  }

  if (extras.knownConspiracy === KNOWN_CONSPIRACY_OTHER && !extras.knownConspiracyOther.trim()) {
    return 'Please describe the other conspiracy theory, or clear Known conspiracy'
  }

  return null
}

export function ratingRequestPayload(args: {
  tweet_id: string
  round_id: string
  rater_id?: string
  labels: Record<string, string>
  note: string
  extras: RatingExtras
}) {
  const labels: Record<string, string> = {}
  for (const col of LABEL_COLUMNS) {
    labels[col] = args.labels[col] ?? ''
  }

  return {
    tweet_id: args.tweet_id,
    round_id: args.round_id,
    ...(args.rater_id ? { rater_id: args.rater_id } : {}),
    labels,
    note: args.note.trim() || null,
    stance: args.extras.stance,
    actor: args.extras.actor.trim() || null,
    actor_political_leaning: args.extras.actorPoliticalLeaning || null,
    actor_portrayal: args.extras.actorPortrayal || null,
    victim_political_leaning: args.extras.victimPoliticalLeaning || null,
    action: args.extras.action.trim() || null,
    target: args.extras.target.trim() || null,
    known_conspiracy: args.extras.knownConspiracy || null,
    known_conspiracy_other:
      args.extras.knownConspiracy === KNOWN_CONSPIRACY_OTHER
        ? args.extras.knownConspiracyOther.trim() || null
        : null,
  }
}
