export interface DimensionOption {
  value: string
  label: string
  description: string
  /** Kept valid for existing data, but not offered as a choice on the form */
  hidden?: boolean
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
  control: 'buttons' | 'select'
  /** Must be set before submit */
  required: boolean
  /** Where it appears on the rate form */
  rateSection: 'core' | 'end'
  /** Codebook page anchor (without #) */
  codebookAnchor: string
  infoIntro: string
  infoQuote?: string
  infoLink?: DimensionInfoLink
  /** How much a split on this field counts toward the Explorer disagreement score */
  disagreementWeight: number
  /** Distance between two different values in [0, 1]; defaults to 1 */
  distance?: (a: string, b: string) => number
}

const POLARITY_POSITION: Record<string, number> = { left: -1, center: 0, unclear: 0, right: 1 }

export const DIMENSIONS: Dimension[] = [
  {
    id: 'conspiracy',
    label: 'Conspiracy Classification',
    dbColumn: 'conspiracy_label',
    control: 'buttons',
    required: true,
    rateSection: 'core',
    codebookAnchor: 'conspiracy',
    disagreementWeight: 1,
    // CT vs nonCT is a full split; anything involving borderline / unclear / link is half
    distance: (a, b) => {
      const pair = new Set([a, b])
      return pair.has('CT') && pair.has('nonCT') ? 1 : 0.5
    },
    description:
      'Does this post assert or imply a conspiracy theory — a set of narratives accusing agents of a secretive, malevolent plot?',
    infoIntro:
      'Use this dimension to decide whether the post asserts or implies a conspiracy theory. Apply the definition below when coding. See also ICWSM Additional guidelines in the codebook.',
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
        value: 'borderline',
        label: 'Borderline',
        description:
          'Author intent is unclear enough that CT vs nonCT cannot be decided confidently; flag for discussion (ICWSM guideline: if unsure, prefer nonCT or Borderline).',
      },
      {
        value: 'unclear',
        label: 'Unclear',
        description: 'It is ambiguous whether the post qualifies as a conspiracy theory.',
      },
      {
        value: 'link_to_ct',
        label: 'Link to a CT',
        description: 'The post links to or references a conspiracy theory without itself asserting one.',
      },
    ],
  },
  {
    id: 'post_polarity',
    label: "Post's Ideological Alignment",
    dbColumn: 'post_polarity_label',
    control: 'buttons',
    required: true,
    rateSection: 'core',
    codebookAnchor: 'post-polarity',
    disagreementWeight: 1,
    // left vs right is a full split; either vs center is half
    distance: (a, b) =>
      Math.abs((POLARITY_POSITION[a] ?? 0) - (POLARITY_POSITION[b] ?? 0)) / 2,
    description:
      "Do the post's claims align with values or political positions of Pew's left-oriented or right-oriented political typology groups?",
    infoIntro:
      "Proxy 1 of the working definition of a CT's political leaning (draft). Judge the claims of the post itself, not the poster. Use the political landscape at the time the post was made, or at the time the CT refers to if it concerns a specific historical period (e.g., the Obama administration).",
    infoQuote:
      "A CT is classified according to whether its claims align with values or political positions associated with one or more of Pew Research Center's left-oriented political typology groups at the time the CT post was made, or at the time referenced by the CT if it concerns a specific historical period.",
    infoLink: {
      href: 'https://www.pewresearch.org/politics/2026/06/10/beyond-red-vs-blue-the-political-typology/',
      label: 'Beyond Red vs Blue: The Political Typology (Pew, June 2026)',
    },
    options: [
      {
        value: 'left',
        label: 'Left',
        description:
          "The post's claims align with values or positions of Pew's left-oriented typology groups.",
      },
      {
        value: 'right',
        label: 'Right',
        description:
          "The post's claims align with values or positions of Pew's right-oriented typology groups.",
      },
      {
        value: 'center',
        label: 'Center / neither',
        description: "The post's claims are centrist, mixed, or align with neither side.",
      },
      {
        value: 'unclear',
        label: 'Unclear',
        description: 'Legacy option from earlier rounds; no longer offered on the form.',
        hidden: true,
      },
    ],
  },
  {
    id: 'poster_polarity',
    label: "Poster's political leaning",
    dbColumn: 'poster_polarity_label',
    control: 'select',
    required: false,
    rateSection: 'end',
    codebookAnchor: 'poster-polarity',
    disagreementWeight: 0.1,
    description:
      'Which Pew Research political typology group best matches the poster’s political orientation (optional).',
    infoIntro:
      'Optional. These groups come from Pew Research Center’s June 2026 political typology study. Use when you can place the poster (not just the post) into a typology group.',
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
        description: 'The poster’s lean cannot be mapped to a typology group with confidence.',
      },
    ],
  },
]

export const DIMENSION_BY_COLUMN = Object.fromEntries(
  DIMENSIONS.map((d) => [d.dbColumn, d])
)

export const LABEL_COLUMNS = DIMENSIONS.map((d) => d.dbColumn)

export const REQUIRED_DIMENSIONS = DIMENSIONS.filter((d) => d.required)

export const CORE_DIMENSIONS = DIMENSIONS.filter((d) => d.rateSection === 'core')

export const END_DIMENSIONS = DIMENSIONS.filter((d) => d.rateSection === 'end')

export function labelForValue(dbColumn: string, value: string | null | undefined): string {
  if (value == null || value === '') return '—'
  const dim = DIMENSION_BY_COLUMN[dbColumn]
  return dim?.options.find((o) => o.value === value)?.label ?? value
}
