/**
 * Actor/victim-based CT leaning, derived from proxies 2 and 3 of the working
 * definition (draft, Sep 2026). Computed on read — never stored — so changing
 * the rules here re-derives every rating.
 */

export type CtLeaning = 'left' | 'right' | 'unclear'

export interface CtLeaningInput {
  actor_political_leaning: string | null
  actor_portrayal: string | null
  victim_political_leaning: string | null
}

export interface CtLeaningResult {
  leaning: CtLeaning
  /** Which rule decided it; null when neither rule could */
  rule: 'actor' | 'victim' | null
}

// Rule 2: actor lean × portrayal
const ACTOR_RULE: Record<string, CtLeaning> = {
  'left:bad': 'right',
  'left:good': 'left',
  'right:bad': 'left',
  'right:good': 'right',
}

export function deriveCtLeaning(r: CtLeaningInput): CtLeaningResult {
  const byActor = ACTOR_RULE[`${r.actor_political_leaning}:${r.actor_portrayal}`]
  if (byActor) return { leaning: byActor, rule: 'actor' }

  // Rule 3: fall back to the political side portrayed as the target / victim
  if (r.victim_political_leaning === 'left' || r.victim_political_leaning === 'right') {
    return { leaning: r.victim_political_leaning, rule: 'victim' }
  }

  return { leaning: 'unclear', rule: null }
}

export function ctLeaningLabel(result: CtLeaningResult): string {
  const lean = { left: 'Left', right: 'Right', unclear: 'Unclear' }[result.leaning]
  if (result.rule === 'actor') return `${lean} (by actor)`
  if (result.rule === 'victim') return `${lean} (by victim)`
  return lean
}

export const CT_LEANING_RULES = {
  actor: {
    title: 'Rule 2 — Political leaning and role of the actor',
    body:
      'The political leaning of the actor(s) in the CT and whether they are portrayed as good or bad. The actor is the person, group, organization, or institution alleged to be carrying out or coordinating the conspiracy — not the target, beneficiary, or subject of the conspiracy.',
    table: [
      ['Left-leaning actor', 'portrayed as bad', 'Right-wing CT'],
      ['Left-leaning actor', 'portrayed as good', 'Left-wing CT'],
      ['Right-leaning actor', 'portrayed as bad', 'Left-wing CT'],
      ['Right-leaning actor', 'portrayed as good', 'Right-wing CT'],
    ],
    examples: [
      'Pizzagate: prominent Democrats (left actors) portrayed as bad → right-wing CT.',
      '9/11 was orchestrated by the Bush administration (right actor, bad) → left-wing CT.',
      'Musk used Starlink to swing the 2024 election for Trump (right actor, bad) → left-wing CT.',
      'QAnon: Trump secretly fighting a Satanic cabal (right actor, good) → right-wing CT.',
    ],
  },
  victim: {
    title: "Rule 3 — Political target of the conspiracy's objective",
    body:
      "If the actor's leaning or role cannot be determined, use the political target of the conspiracy's alleged secretive/malevolent objective. If the left is primarily portrayed as the target or victim, classify as left-wing; if the right, right-wing; if neither side is clearly targeted, unclear/non-partisan.",
    examples: [
      "The deep state is secretly working to bring down Trump: the actor's leaning is unclear, the target is right → right-wing CT.",
    ],
  },
} as const
