/**
 * Ideology values reference for proxy 1 (Post's Ideological Alignment).
 * Data lives in lib/codebook/ideologyValues.json (deep-research output,
 * Sep 2026, not yet reviewed). Coders cite IDs (e.g. "V8") in notes.
 */
import data from '@/lib/codebook/ideologyValues.json'

export type IdeologySignal = 'STRONG_LEFT' | 'WEAK_LEFT' | 'WEAK_RIGHT' | 'STRONG_RIGHT' | 'NONE'

export interface IdeologyPeriod {
  signal: IdeologySignal
  /** YYYY-MM */
  from: string
  /** YYYY-MM, or null for present */
  to: string | null
  note: string
}

export interface IdeologyValue {
  id: string
  heading: string
  description: string
  /** false = not a reliable partisan indicator; periods is empty */
  indicator: boolean
  periods: IdeologyPeriod[]
  sources: { label: string; url: string }[]
}

export const IDEOLOGY_VALUES_GENERATED: string = data.generated
export const IDEOLOGY_VALUES = data.values as IdeologyValue[]

export const SIGNAL_CLASS: Record<IdeologySignal, string> = {
  STRONG_LEFT: 'bg-blue-800 text-white',
  WEAK_LEFT: 'text-blue-500',
  WEAK_RIGHT: 'text-red-500',
  STRONG_RIGHT: 'bg-red-700 text-white',
  NONE: 'text-gray-500',
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function formatMonth(ym: string): string {
  const [year, month] = ym.split('-')
  return `${MONTHS[Number(month) - 1]} ${year}`
}

export function formatPeriod(p: IdeologyPeriod): string {
  return `${formatMonth(p.from)} – ${p.to ? formatMonth(p.to) : 'present'}`
}
