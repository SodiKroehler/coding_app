export interface DimensionOption {
  value: string
  label: string
  description: string
}

export interface DimensionInfoLink {
  href: string
  label: string
}

export interface Dimension {
  id: string
  label: string
  dbColumn: string
  options: DimensionOption[]
  description: string
  /** How the option picker is rendered in the rating UI */
  control: 'buttons' | 'select'
  /** Opening copy for the info popup (supports plain text; link rendered separately) */
  infoIntro: string
  /** Optional exact quote shown in the info popup */
  infoQuote?: string
  infoLink?: DimensionInfoLink
}

export const DIMENSIONS: Dimension[] = [
  {
    id: 'conspiracy',
    label: 'Conspiracy Classification',
    dbColumn: 'conspiracy_label',
    control: 'buttons',
    description:
      'Does this post assert or imply a conspiracy theory — a set of narratives accusing agents of a secretive, malevolent plot?',
    infoIntro:
      'Use this dimension to decide whether the post asserts or implies a conspiracy theory. Apply the definition below when coding.',
    infoQuote:
      'A conspiracy theory is a set of narratives designed to accuse an agent(s) (be they individuals, groups, or organizations) of committing a specific action(s), which is believed to be working towards a secretive and malevolent objective(s) (secret plot).',
    options: [
      {
        value: 'CT',
        label: 'Conspiracy Theory (CT)',
        description:
          'The post asserts or implies a conspiracy theory — a narrative accusing agents of a secretive, malevolent plot.',
      },
      {
        value: 'nonCT',
        label: 'Non-Conspiracy (nonCT)',
        description: 'The post does not assert or imply a conspiracy theory.',
      },
      {
        value: 'unclear',
        label: 'Unclear',
        description: 'It is ambiguous whether the post qualifies as a conspiracy theory.',
      },
    ],
  },
  {
    id: 'polarity',
    label: "Poster's political leaning",
    dbColumn: 'polarity_label',
    control: 'select',
    description:
      'Which Pew Research political typology group best matches the post’s political orientation or framing?',
    infoIntro:
      'These groups come from Pew Research Center’s June 2026 political typology study. Use them when deciding whether a tweet is left- or right-leaning — pick the group that best fits the content.',
    infoLink: {
      href: 'https://www.pewresearch.org/politics/2026/06/10/beyond-red-vs-blue-the-political-typology/',
      label: 'Beyond Red vs Blue: The Political Typology (Pew, June 2026)',
    },
    options: [
      {
        value: 'leftward_progressives',
        label: 'Leftward Progressives',
        description:
          'The youngest group (7%): uniformly progressive; back Democrats but eye the party skeptically.',
      },
      {
        value: 'loyal_liberals',
        label: 'Loyal Liberals',
        description:
          'Highly educated (11%): strongly attached to the Democratic Party; more trusting of institutions and invested in U.S. global leadership.',
      },
      {
        value: 'left_out_left',
        label: 'Left-Out Left',
        description:
          'Democratic-leaning (12%) with a mix of liberal and moderate views; financially stressed and prone to feeling politically ignored.',
      },
      {
        value: 'order_and_opportunity_left',
        label: 'Order and Opportunity Left',
        description:
          'Largest group (18%): lean Democratic but not uniformly; racially and ethnically diverse; economically liberal yet more concerned about crime and more open to immigration limits than other left groups.',
      },
      {
        value: 'tuned_out_middle',
        label: 'Tuned-Out Middle',
        description:
          'Politically divided and disengaged (9%), with exceptionally low interest in politics.',
      },
      {
        value: 'pragmatic_and_polite_right',
        label: 'Pragmatic and Polite Right',
        description:
          'Modest Republican tilt (11%): economically conservative but more moderate on race and immigration; the oldest group, prizing civility, and largely cool on Trump.',
      },
      {
        value: 'unconventional_right',
        label: 'Unconventional Right',
        description:
          'Republican-leaning and generally conservative (12%) but more moderate on abortion and the safety net; younger, less engaged, and cooling on Trump.',
      },
      {
        value: 'faith_first_conservatives',
        label: 'Faith First Conservatives',
        description:
          'Conservative Republicans (12%) defined by religion, morality and social traditionalism, with strong Trump support.',
      },
      {
        value: 'no_apologies_right',
        label: 'No Apologies Right',
        description:
          'Hardline conservative Republicans (9%) with a combative political style and the strongest Trump support.',
      },
      {
        value: 'unclear',
        label: 'Unclear',
        description: 'The post’s political lean cannot be mapped to a typology group with confidence.',
      },
    ],
  },
]

// Map dbColumn → dimension for easy lookup
export const DIMENSION_BY_COLUMN = Object.fromEntries(
  DIMENSIONS.map((d) => [d.dbColumn, d])
)

export const LABEL_COLUMNS = DIMENSIONS.map((d) => d.dbColumn)

export function labelForValue(dbColumn: string, value: string | null | undefined): string {
  if (value == null || value === '') return '—'
  const dim = DIMENSION_BY_COLUMN[dbColumn]
  return dim?.options.find((o) => o.value === value)?.label ?? value
}
