import type { SupabaseClient } from '@supabase/supabase-js'

/** Special rater that stores team gold labels. Nobody logs in as this user. */
export const CONSENSUS_RATER_NAME = 'CONSENSUS'
export const CONSENSUS_RATER_EMAIL = 'consensus@internal.invalid'

export async function getConsensusRaterId(
  supabase: SupabaseClient
): Promise<string | null> {
  const byEmail = await supabase
    .from('raters')
    .select('id')
    .eq('email', CONSENSUS_RATER_EMAIL)
    .maybeSingle()
  if (byEmail.data?.id) return byEmail.data.id as string

  const byName = await supabase
    .from('raters')
    .select('id')
    .eq('name', CONSENSUS_RATER_NAME)
    .maybeSingle()
  return (byName.data?.id as string | undefined) ?? null
}

export function isConsensusRater(rater: {
  name?: string | null
  email?: string | null
}): boolean {
  return rater.email === CONSENSUS_RATER_EMAIL || rater.name === CONSENSUS_RATER_NAME
}
