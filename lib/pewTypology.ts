export interface PewTypologyExtended {
  value: string
  title: string
  share: string
  summary: string
  values: string
  rejects: string
  tell: string
}

/** Extended coder guidance for Pew June 2026 typology groups. Source: Pew Research Center. */
export const PEW_TYPOLOGY_EXTENDED: PewTypologyExtended[] = [
  {
    value: 'leftward_progressives',
    title: 'Leftward Progressives',
    share: '7% of adults',
    summary:
      "Almost entirely Democratic-leaning (<1% Republican). The youngest group; uniformly progressive; back Democrats but hold the party at arm's length.",
    values:
      'comfort with they/them pronouns (92%); a path to legal status over deportation (0% support a deportation effort); economic-outcome fatalism, i.e. that individuals have little control over financial success (81%); democratic-socialist politicians (66% like them); skeptical of U.S. military power.',
    rejects:
      'abortion restrictions (2% say illegal in most cases); the idea that violent crime is a very big national problem (18%); "secure borders" as a top priority (only 20% call it extremely/very important); Trump (near-0% approval).',
    tell: 'far more critical of the economic system and of the Democratic Party itself (61% favorable to the party vs. 77% among Loyal Liberals).',
  },
  {
    value: 'loyal_liberals',
    title: 'Loyal Liberals',
    share: '11%',
    summary:
      'Almost entirely Democratic (<1% Republican). Highly educated, institutionally trusting, internationalist.',
    values:
      'the Democratic Party (77% favorable — the highest of any group); U.S. global leadership and diplomacy; progressive social positions (69% comfortable with they/them); high political engagement (86% say the midterms really matter).',
    rejects:
      'abortion restrictions (4%); crime-as-crisis framing (19%); economic fatalism (only 33% — notably lower than other left groups, i.e. more optimistic about individual mobility); Trump/Republicans (2% Republican-favorable).',
    tell: 'more attached to and positive about the Democratic Party; less far-left on economics.',
  },
  {
    value: 'left_out_left',
    title: 'Left-Out Left',
    share: '12%',
    summary:
      'Overwhelmingly Democratic-leaning; a mix of liberal and moderate views. Financially stressed and prone to feeling politically ignored and pessimistic.',
    values:
      'economic fatalism (65%); Democratic lean, but cooler on the party than Loyal Liberals (52% favorable; only 20% feel the party cares about people like them).',
    rejects:
      'deportation effort (7%); strong Christian-culture framing (7%). More moderate than the far-left groups on gender (38% comfortable with they/them) and more likely than them to see crime as a big problem (43%).',
    tell: 'shares the party skepticism but from frustration/being-left-behind rather than ideology (only 22% like democratic-socialist politicians, vs. 66%).',
  },
  {
    value: 'order_and_opportunity_left',
    title: 'Order and Opportunity Left',
    share: '18% (largest group)',
    summary:
      'Democratic-leaning but not uniformly (≈65% Dem / 25% Rep). One of the most racially and ethnically diverse groups. The cross-pressured left edge.',
    values:
      'economically liberal; Democratic lean (58% Democratic-favorable); a path to legal status (only 15% back a deportation effort).',
    rejects:
      'more concerned about crime than other left groups (53% call violent crime a very big problem); more supportive of border security (74% call it important) and more open to immigration limits; lower comfort with they/them pronouns (14%); low economic fatalism (29%).',
    tell: 'looks left on party/economics but center-ish on crime, borders, and gender — the main boundary group on the left.',
  },
  {
    value: 'tuned_out_middle',
    title: 'Tuned-Out Middle',
    share: '9%',
    summary:
      'Politically divided (8% Rep / 9% Dem) and disengaged; exceptionally low interest in politics.',
    values:
      'nothing group-distinctive; genuinely mixed (43% Republican-favorable, 49% Democratic-favorable).',
    rejects:
      'political engagement itself (only 31% say the midterms really matter — the lowest of any group).',
    tell: 'the natural home for low-signal, low-engagement, or apolitical content. Default here when no group-distinctive values are present.',
  },
  {
    value: 'pragmatic_and_polite_right',
    title: 'Pragmatic and Polite Right',
    share: '11%',
    summary:
      'Republican-tilting by a modest margin (≈56% Rep / 37% Dem). The oldest group; conservative on economics, moderate on race and immigration, and strongly values civility.',
    values:
      'economic conservatism; border security (84% call it important); civility in politics (only 5% like it when politicians humiliate opponents — the lowest of any group); Reagan over Trump as best recent president (36% Reagan vs. 14% Trump).',
    rejects:
      'the hardline agenda — only 27% back a deportation effort; cool on Trump (36% approval, ~two-thirds disapprove); moderate on abortion (46% illegal) relative to the right anchors.',
    tell: 'defined by tone and moderation; the boundary group on the right.',
  },
  {
    value: 'unconventional_right',
    title: 'Unconventional Right',
    share: '12%',
    summary:
      'Republican-oriented and generally conservative but younger and much less engaged; support for Trump has slipped.',
    values:
      'border security (83%); generally conservative lean (65% Republican-favorable); split on deportation (51% back an effort).',
    rejects:
      'abortion (43% illegal — more moderate than the anchors) and the social safety net (more moderate). Cooling on Trump (53% approval; more name Reagan than Trump as best recent president).',
    tell: 'younger, less engaged, less civility-focused; harder on immigration but softer on Trump than the anchors.',
  },
  {
    value: 'faith_first_conservatives',
    title: 'Faith First Conservatives',
    share: '12%',
    summary:
      'Conservative Republicans (25% Rep / 1% Dem) defined by religion, morality and social traditionalism. A right anchor.',
    values:
      'a Christian-based national culture (82% — the highest of any group); abortion restrictions (83% illegal — the highest); border security (98%) and deportation (68%); strong Trump support (81% approval; 52% name him best recent president).',
    rejects:
      'comfort with they/them pronouns (3% — the lowest); Democratic Party (3% favorable).',
    tell: 'distinguished by religious/moral emphasis rather than combative style — only 27% like seeing opponents humiliated.',
  },
  {
    value: 'no_apologies_right',
    title: 'No Apologies Right',
    share: '9%',
    summary:
      'Hardline conservative Republicans (19% Rep / <1% Dem) with a combative political style and the strongest Trump support. A right anchor.',
    values:
      'the hardline agenda across the board — border security (100%), deportation (81%), abortion restrictions (73%), gun-carry comfort (70% — the highest); Trump (90% approval; 63% name him best recent president — the highest); a combative style (53% like it when politicians humiliate opponents — the highest); high engagement (84% say midterms matter).',
    rejects:
      'comfort with they/them pronouns (4%); the Democratic Party (1% favorable); economic fatalism (11% — the lowest).',
    tell: 'the difference is style and hardline intensity more than religiosity.',
  },
]

export const PEW_TYPOLOGY_SOURCE = {
  href: 'https://www.pewresearch.org/politics/2026/06/10/beyond-red-vs-blue-the-political-typology/',
  label: 'Beyond Red vs Blue: The Political Typology',
  citation: 'Pew Research Center, June 2026',
}
