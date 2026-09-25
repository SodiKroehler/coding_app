import type {
  ActorPoliticalLeaning,
  ActorPortrayal,
  Stance,
  VictimPoliticalLeaning,
} from '@/lib/knownConspiracies'

export interface RatingExtras {
  stance: Stance
  actor: string
  actorPoliticalLeaning: ActorPoliticalLeaning | ''
  actorPortrayal: ActorPortrayal | ''
  victimPoliticalLeaning: VictimPoliticalLeaning | ''
  action: string
  target: string
  knownConspiracy: string
  knownConspiracyOther: string
}
