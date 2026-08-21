import type { ActorPoliticalLeaning, Stance } from '@/lib/knownConspiracies'

export interface RatingExtras {
  stance: Stance
  actor: string
  actorPoliticalLeaning: ActorPoliticalLeaning | ''
  action: string
  target: string
  knownConspiracy: string
  knownConspiracyOther: string
}
