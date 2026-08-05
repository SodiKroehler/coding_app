/** Static seed list for the rate-screen "Known conspiracy" dropdown.
 *  Not stored in the DB — custom ("Other") values go on the rating row.
 *
 *  Lean labels for Enders/Uscinski-style items follow the ideology/partisanship
 *  forest plot (negative ≈ Liberal/Dem, positive ≈ Conservative/Rep).
 *  Items from the original app list that do not appear in that figure are
 *  marked `unclear`. */

export type ConspiracyLean = 'left' | 'right' | 'center' | 'unclear'

export interface KnownConspiracy {
  label: string
  lean: ConspiracyLean
}

/** Graph items ordered roughly right → center → left, then original-only unclear. */
export const KNOWN_CONSPIRACIES: KnownConspiracy[] = [
  // —— Right-leaning (Conservative/Rep) ——
  { label: 'COVID Threat Exaggerated', lean: 'right' },
  { label: 'Birther', lean: 'right' },
  { label: 'Global Warming Hoax', lean: 'right' },
  { label: 'Mueller Investigating Clintons', lean: 'right' },
  { label: 'Soros Control World', lean: 'right' },
  { label: 'Dems Infected Trump w/ COVID', lean: 'right' },
  { label: 'Conspiracy to Kill Police', lean: 'right' },
  { label: 'Epstein Murdered', lean: 'right' },
  { label: 'Spread COVID on Purpose', lean: 'right' },
  { label: 'Bill Gates Caused COVID', lean: 'right' },
  { label: 'COVID Anti-vax', lean: 'right' },
  { label: 'Elite Pedophile Rings', lean: 'right' },
  { label: 'Deep State', lean: 'right' },
  { label: 'FDA Promote Cancer', lean: 'right' },
  { label: 'Vaccine Tracking Devices', lean: 'right' },
  { label: 'Sandy Hook Faked', lean: 'right' },
  { label: '9/11 Truther', lean: 'right' },
  { label: '5G Causes COVID', lean: 'right' },
  { label: 'Government False Flags', lean: 'right' },
  { label: 'RFK Assassination', lean: 'right' },
  { label: "Gov't Mind Control", lean: 'right' },
  { label: 'MMR Anti-vax', lean: 'right' },

  // —— Center / near-zero ——
  { label: 'Pharma Invents Diseases', lean: 'center' },
  { label: 'JFK Assassination', lean: 'center' },
  { label: 'Cellphones Cause Cancer', lean: 'center' },
  { label: 'Holocaust Denial', lean: 'center' },
  { label: 'Danger of GMOs', lean: 'center' },
  { label: 'Intentionally Spread Cancer', lean: 'center' },
  { label: 'Rothschilds', lean: 'center' },
  { label: 'Fluoride in Water', lean: 'center' },
  { label: 'Single Group Control', lean: 'center' },
  { label: 'Banks Manipulate the Economy', lean: 'center' },
  { label: 'Fluorescent Lightbulbs', lean: 'center' },
  { label: 'Intentionally Spread AIDS', lean: 'center' },
  { label: 'FDR Pearl Harbor', lean: 'center' },
  { label: 'MLK Assassination', lean: 'center' },

  // —— Left-leaning (Liberal/Dem) ——
  { label: 'Alien Cover-up', lean: 'left' },
  { label: 'Faked Moon Landing', lean: 'left' },
  { label: "Gov't Assassinate Entertainers", lean: 'left' },
  { label: 'Putin Poisoned Clinton', lean: 'left' },
  { label: 'Frame OJ Simpson', lean: 'left' },
  { label: 'Bush Breached Levees', lean: 'left' },
  { label: 'Koch Brothers World Control', lean: 'left' },
  { label: 'Iran Hostage Conspiracy', lean: 'left' },
  { label: 'Processing Mail-in Ballots', lean: 'left' },
  { label: 'Bush Faked Employment Stats', lean: 'left' },
  { label: 'Russia Manipulates U.S. Policy', lean: 'left' },
  { label: 'Trump Faked COVID', lean: 'left' },
  { label: 'Trump is a Russian Asset', lean: 'left' },
  { label: 'Trump Made Deal w/ Putin', lean: 'left' },
  { label: 'GOP Steals Elections', lean: 'left' },
  { label: 'Trump Cover-up Symptoms', lean: 'left' },

  // —— Original app list (not in graph) → unclear ——
  { label: 'Iran/Israel attack false flag for Epstein', lean: 'unclear' },
  { label: 'Trump assassination attempt was staged', lean: 'unclear' },
  { label: 'Trump Epstein child abuse (BlueAnon)', lean: 'unclear' },
  { label: '2024 election stolen from Harris', lean: 'unclear' },
  { label: 'LA wildfires as gov/Israel inside job', lean: 'unclear' },
  { label: 'Biden drugged before 2024 debate', lean: 'unclear' },
  { label: 'JD Vance couch memoir claim', lean: 'unclear' },
  { label: 'DC/Boulder attacks as false flags', lean: 'unclear' },
  { label: 'Sascha Riley Trump abuse claims', lean: 'unclear' },
  { label: 'Raisi crash as CIA/Mossad hit', lean: 'unclear' },
  { label: 'Trump suppressing Epstein files', lean: 'unclear' },
  { label: 'FBI Iran warning as war pretext', lean: 'unclear' },
  { label: 'Vance and the Pope', lean: 'unclear' },
  { label: 'Virginia Giuffre suicide narrative', lean: 'unclear' },
  { label: 'Epstein eating children claims', lean: 'unclear' },
]

export const KNOWN_CONSPIRACY_OTHER = 'other'

export const LEAN_OPTION_CLASS: Record<ConspiracyLean, string> = {
  left: 'bg-blue-100 text-blue-950',
  right: 'bg-red-100 text-red-950',
  center: 'bg-amber-100 text-amber-950',
  unclear: 'bg-white text-gray-900',
}

export function leanForKnownConspiracy(label: string): ConspiracyLean | null {
  if (!label || label === KNOWN_CONSPIRACY_OTHER) return null
  return KNOWN_CONSPIRACIES.find((c) => c.label === label)?.lean ?? null
}

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
