import { DIMENSIONS } from '@/lib/dimensions'
import type { ExplorerRaterRating } from '@/lib/types'

/** Score at or above which a post counts as a (real) disagreement */
export const DEFAULT_DISAGREEMENT_THRESHOLD = 0.5

interface ScoredField {
  key: keyof ExplorerRaterRating
  weight: number
  distance?: (a: string, b: string) => number
}

// Main label dimensions carry their own weights; optional template fields count a little.
const SCORED_FIELDS: ScoredField[] = [
  ...DIMENSIONS.map((d) => ({
    key: d.dbColumn as keyof ExplorerRaterRating,
    weight: d.disagreementWeight,
    distance: d.distance,
  })),
  { key: 'actor_political_leaning', weight: 0.1 },
  { key: 'actor_portrayal', weight: 0.1 },
  { key: 'victim_political_leaning', weight: 0.1 },
]

/**
 * Weighted disagreement: for each field, the mean distance over all rater pairs
 * that filled it in, times the field's weight, summed across fields.
 * e.g. L,L,C → 0.33 · L,L,R → 0.67 · two raters L vs R → 1.0
 */
export function disagreementScore(ratings: ExplorerRaterRating[]): number {
  let score = 0
  for (const field of SCORED_FIELDS) {
    const vals = ratings
      .map((r) => r[field.key])
      .filter((v): v is string => typeof v === 'string' && v !== '')
    if (vals.length < 2) continue

    let total = 0
    let pairs = 0
    for (let i = 0; i < vals.length; i++) {
      for (let j = i + 1; j < vals.length; j++) {
        pairs++
        if (vals[i] !== vals[j]) total += field.distance?.(vals[i], vals[j]) ?? 1
      }
    }
    score += field.weight * (total / pairs)
  }
  return Math.round(score * 100) / 100
}
