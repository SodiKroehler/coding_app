/** Static seed list for the rate-screen "Known conspiracy" dropdown.
 *  Not stored in the DB — custom ("Other") values go on the rating row. */
export const KNOWN_CONSPIRACIES = [
  'Iran/Israel attack false flag for Epstein',
  'Trump assassination attempt was staged',
  'Trump Epstein child abuse (BlueAnon)',
  '2024 election stolen from Harris',
  'LA wildfires as gov/Israel inside job',
  'Biden drugged before 2024 debate',
  'JD Vance couch memoir claim',
  'DC/Boulder attacks as false flags',
  'Sascha Riley Trump abuse claims',
  'Raisi crash as CIA/Mossad hit',
  'Trump suppressing Epstein files',
  'FBI Iran warning as war pretext',
  'Vance and the Pope',
  'Virginia Giuffre suicide narrative',
  'Epstein eating children claims',
] as const

export const KNOWN_CONSPIRACY_OTHER = 'other'

export type Stance = 'PRO' | 'ANTI' | 'NEUTRAL'

export const STANCE_OPTIONS: Stance[] = ['PRO', 'ANTI', 'NEUTRAL']

export const DEFAULT_STANCE: Stance = 'NEUTRAL'

/** Soft max words for actor / action / target free-text slots. */
export const TEMPLATE_MAX_WORDS = 100

export function wordCount(text: string): number {
  const trimmed = text.trim()
  if (!trimmed) return 0
  return trimmed.split(/\s+/).length
}
