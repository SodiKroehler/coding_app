/** Static ICWSM24 CT coding guideline content (not DB-backed). */

export type CodebookVerdict = 'CT' | 'nonCT' | 'borderline'

export interface CodebookExampleCard {
  id: string
  exampleNumber: number
  /** Guideline this example illustrates, if any */
  guidelineId?: string
  verdict: CodebookVerdict
  postText: string
  originalUrl?: string
  justification: string
  actor?: string
  action?: string
  objective?: string
}

export interface CodebookGuideline {
  id: string
  title: string
  body: string
  /** Extra note / citation under the guideline */
  note?: string
  exampleIds: string[]
}

export const ICWSM_SOURCE = {
  title: 'CT Coding Guideline – ICWSM24',
  pdfPath: '/docs/CT-coding-guideline-ICWSM24.pdf',
  repoPath: 'docs/CT-coding-guideline-ICWSM24.pdf',
}

export const ICWSM_WORKING_DEFINITIONS = {
  theoretical:
    'A conspiracy theory is a set of narratives designed to accuse an Agent(s) (be they individuals, groups, or organizations) of committing a specific Action(s), which is believed to be working towards a secretive and malevolent Objective(s) (secret plot).',
  operational:
    'Following the theoretical definition, an online Conspiracy Theory is a social media post that contains a main narrative or claims that (a) represents a known conspiracy theory or (b) suggests a secret plan, along with (c) evidence of agreement or support to some extent for the mentioned conspiracy theory or secret plan.',
}

export const ICWSM_GUIDELINES: CodebookGuideline[] = [
  {
    id: 'known-cts',
    title: 'Popular and known conspiracies',
    body: 'If the post mentions existing or known CTs (e.g. Ukraine Biolab, Great Replacement, Space Force, 9/11, pizzagate/pedogate, QAnon, 5G, etc.) and the author also expresses agreement (to some extent) with the theories, the post is considered a CT.',
    note: 'Great Replacement example framing: Agent = U.S. gov./liberals; Action = replace White people with immigrants; Objective = remove the power of White people.',
    exampleIds: ['ex03'],
  },
  {
    id: 'content-sharing',
    title: 'Content sharing',
    body: 'If the author presents a second-hand comment to a cited video or post, and the linked video/post may be a CT, we will NOT consider the post itself a CT when it merely shares the link without endorsing the claim.',
    exampleIds: ['ex05'],
  },
  {
    id: 'rhetorical-vs-inquiry',
    title: 'Rhetorical question vs. genuine inquiry',
    body: 'Not all posts that mention a known CT promote it — some are genuine inquiries. Distinguish legitimate questions from rhetorical ones that enclose CT elements and hint at a clear conspiratorial answer.',
    exampleIds: ['ex06', 'ex07'],
  },
  {
    id: 'support-vs-criticism',
    title: 'Support/promotion vs. criticism/frustration/debunking',
    body: 'Presenting critical viewpoints and negative sentiments toward controversial subjects does not necessarily qualify a post as CT unless it expresses endorsement or support for a conspiracy belief.',
    exampleIds: ['ex08'],
  },
  {
    id: 'borderline',
    title: 'Borderline cases',
    body: 'Author intention is critical but often hard to judge on short posts. If intention is not clear, label as non-CT. If you are not sure, choose Borderline so the case can be addressed in consensus meetings.',
    exampleIds: ['ex09', 'ex10'],
  },
]

export const ICWSM_EXAMPLES: CodebookExampleCard[] = [
  {
    id: 'ex01',
    exampleNumber: 1,
    verdict: 'CT',
    postText:
      "Electoral College. Votes don't matter. The banks own all 52 electoral voters. Your actual voting numbers do not matter. Your vote does not matter, the representative of your state could vote against you. Fraud doesn't matter one bit, the electoral voter already voted. Unless you have shit on them, it doesn't matter. Welcome back to reality. Make sure to vote for a rich guy who used slaves to become rich while your vote doesn't even matter lol. No votes matter.",
    justification:
      'The author elaborates on a scenario where a group of people — bankers and rich individuals — control the election results and the democratic process, robbing citizens of meaningful votes.',
    actor: 'Bankers / rich',
    action: 'Control electoral votes so individual votes do not matter',
    objective: 'Control democracy',
  },
  {
    id: 'ex02',
    exampleNumber: 2,
    verdict: 'CT',
    postText:
      "Suppose you have it backwards? What if the aim is not to eliminate the vaccinated, with the vaccine, but to eliminate the unvaccinated, as in all the MAGA types? Maybe it's a way to get rid of all the followers of Donald J. Trump? Seems like a lot of unvaccinated getting sick right now.",
    justification:
      'The post explains a conspiracy theory where COVID is created to eliminate Trump supporters and MAGA members — a group that tends to refuse the vaccine.',
    actor: 'Government',
    action: 'COVID virus as a bio-weapon',
    objective: 'Eliminate Trump supporters via vaccine',
  },
  {
    id: 'ex03',
    exampleNumber: 3,
    guidelineId: 'known-cts',
    verdict: 'CT',
    postText:
      'Space Force. And now we are being separated into our homes... Does anyone think these 2 events may be related...',
    originalUrl: 'https://www.reddit.com/r/conspiracy/comments/5wm3/space_force/',
    justification:
      "The post refers to the known 'Space Force' CT (following Trump's request for a new military branch; some speculated it would handle alien attacks). Affirming 'separated into our homes' and the rhetorical question reflect agreement with the theory.",
  },
  {
    id: 'ex04',
    exampleNumber: 4,
    verdict: 'nonCT',
    postText: 'New Forensics Tool to Detect NASA Fakes https://medium.com/p/434c0a85affa',
    originalUrl:
      'https://www.reddit.com/r/conspiracyundone/comments/utm2rn/new_forensics_tool_to_detect_nasa_fakes/',
    justification:
      'The text may indicate a potential relation to a CT, but the attitude of the author toward the event (existence of a new forensic tool) is not clear. Images and embedded links are not used as signals to label CT content.',
  },
  {
    id: 'ex05',
    exampleNumber: 5,
    guidelineId: 'content-sharing',
    verdict: 'nonCT',
    postText:
      'Elon Musk Neuralink Snuff device. I am into Snuff show for Elon Musk fun - link to neuralink CT',
    originalUrl:
      'https://www.reddit.com/r/conspiracy_commons/comments/mwc2uf/elon_musk_neuralink_snuff_device/',
    justification:
      "The linked content contains CT elements, but the post itself merely shares the link without commenting on its content. Labeling criteria do not treat links' content as a signal that the post is CT.",
  },
  {
    id: 'ex06',
    exampleNumber: 6,
    guidelineId: 'rhetorical-vs-inquiry',
    verdict: 'CT',
    postText:
      "Who's skeptical of the $1200? What are the odds that they will force you to get the vaccine? Feels like a trap",
    justification:
      'The post asks about stimulus checks, but the second part frames a hidden agenda (forced vaccine), and “Feels like a trap” signals the author’s belief in that agenda — rhetorical question enclosing CT elements + agreement.',
  },
  {
    id: 'ex07',
    exampleNumber: 7,
    guidelineId: 'rhetorical-vs-inquiry',
    verdict: 'nonCT',
    postText:
      'Are there any livestreams from Afghanistan that are not from a news source? Like people filming right now? Can’t find anything on YouTube.',
    justification:
      'The post asks for a source of information about the war in Afghanistan. The topic may have surrounding CTs, but the post does not promote any CT — it is a simple inquiry.',
  },
  {
    id: 'ex08',
    exampleNumber: 8,
    guidelineId: 'support-vs-criticism',
    verdict: 'nonCT',
    postText:
      'Oregon has made reading, math, and writing racist which I never thought we could be racist just for breathing! We should all embrace this and bring peace and global health!',
    justification:
      'Observation with criticism. Despite a controversial topic, there is no hidden or malicious agenda; the closing line promotes a peaceful message. Criticism ≠ CT without endorsement of a conspiracy belief.',
  },
  {
    id: 'ex09',
    exampleNumber: 9,
    guidelineId: 'borderline',
    verdict: 'borderline',
    postText:
      'Has anyone actually watched mainstream news lately? Ss: Traumatized everyone for a year and then subject them to this repetitive mind numbing terror frequency. Holy heck. I now see how people are like fucking zombies.',
    justification:
      'Team split: one reading sees media control as a tool to turn citizens into “zombies” for hidden agendas (agent: mainstream media); the other sees frustration/criticism without a clear agent or secret plot. Consensus never reached.',
  },
  {
    id: 'ex10',
    exampleNumber: 10,
    guidelineId: 'borderline',
    verdict: 'borderline',
    postText:
      'The LEFT exists to lure in the youth and radically change our culture/politics. The RIGHT exists to pacify patriots/old people by pretending to "oppose" the left. Truly take a step back and think about it. What exactly have the conservatives *actually conserved*? I mean really, they\'ve quite **literally** conserved nothing. Nothing at all. For 60 years. All they do is pacify the elderly and patriot-types until the leftist media has normalized whatever bullshit they\'re trying to push. Then they move on to the next thing and the "conservatives" move on as well, pretending to be outraged again. And so on and so fourth.',
    justification:
      'Team split: one reading sees Left/Right as a designed distraction from bigger hidden agendas; the other sees political frustration at both parties without promoting a CT. Consensus never reached.',
  },
]

export function exampleById(id: string): CodebookExampleCard | undefined {
  return ICWSM_EXAMPLES.find((e) => e.id === id)
}
