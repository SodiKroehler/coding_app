/** Static seed list for the rate-screen "Known conspiracy" dropdown.
 *  Not stored in the DB — custom ("Other") values go on the rating row.
 *
 *  Lean labels for Enders/Uscinski-style items follow the ideology/partisanship
 *  forest plot (negative ≈ Liberal/Dem, positive ≈ Conservative/Rep).
 *  Items from the original app list that do not appear in that figure are
 *  marked `unclear`.
 *  `number` is display-only (alphabetical order); ratings still store `label`. */

export type ConspiracyLean = 'left' | 'right' | 'center' | 'unclear'

export interface KnownConspiracy {
  number: number
  label: string
  lean: ConspiracyLean
  description: string
}

/** Alphabetical by label; numbers are 1…N for the dropdown UI. */
export const KNOWN_CONSPIRACIES: KnownConspiracy[] = [
  { number: 1, label: '2024 election stolen from Harris', lean: 'unclear', description: 'Claims that the 2024 U.S. presidential election was stolen from Kamala Harris through fraud or manipulation. Asserts that certified results do not reflect a legitimate Harris victory.' },
  { number: 2, label: '5G Causes COVID', lean: 'right', description: 'Claims that 5G wireless networks cause, transmit, or enable COVID-19. Asserts a causal link between cellular infrastructure and the disease rather than viral transmission alone.' },
  { number: 3, label: '9/11 Truther', lean: 'right', description: 'Claims that the September 11, 2001 attacks were orchestrated or allowed by the U.S. government or other insiders rather than solely by al-Qaeda. Asserts controlled demolition, stand-down orders, or similar insider involvement.' },
  { number: 4, label: 'Alien Cover-up', lean: 'left', description: 'Claims that governments conceal evidence of extraterrestrial contact, craft, or bodies. Asserts systematic secrecy about UFO/UAP encounters and alien presence.' },
  { number: 5, label: 'Banks Manipulate the Economy', lean: 'center', description: 'Claims that major banks or central banks deliberately engineer crashes, inflation, or crises for profit or power. Asserts coordinated financial sabotage beyond ordinary market and policy dynamics.' },
  { number: 6, label: 'Biden drugged before 2024 debate', lean: 'unclear', description: 'Claims that Joe Biden was given drugs before the 2024 presidential debate to alter his performance. Asserts pharmacological manipulation—whether to boost or sabotage him—by handlers or opponents.' },
  { number: 7, label: 'Bill Gates Caused COVID', lean: 'right', description: 'Claims that Bill Gates created, funded, or otherwise caused the COVID-19 pandemic. Often ties the claim to vaccines, surveillance, or population-control agendas attributed to him or his foundation.' },
  { number: 8, label: 'Birther', lean: 'right', description: 'Claims that Barack Obama was not born in the United States and thus was ineligible for the presidency. Typically asserts that his Hawaiian birth certificate and related records are forged or incomplete.' },
  { number: 9, label: 'Bush Breached Levees', lean: 'left', description: 'Claims that the Bush administration deliberately destroyed New Orleans levees during Hurricane Katrina. Asserts intentional flooding for political, demographic, or real-estate motives.' },
  { number: 10, label: 'Bush Faked Employment Stats', lean: 'left', description: 'Claims that the George W. Bush administration fabricated or manipulated official employment statistics. Asserts deliberate falsification of labor-market data for political benefit.' },
  { number: 11, label: 'Cellphones Cause Cancer', lean: 'center', description: 'Claims that cellphone radiofrequency exposure causes cancer and that industry and regulators conceal the risk. Asserts a suppressed causal link between mobile-phone use and malignancy.' },
  { number: 12, label: 'Conspiracy to Kill Police', lean: 'right', description: 'Claims that activists, political groups, or officials coordinate a deliberate campaign to murder or eliminate police officers. Asserts organized targeting beyond isolated crimes or rhetoric.' },
  { number: 13, label: 'COVID Anti-vax', lean: 'right', description: 'Claims that COVID-19 vaccines are unsafe, ineffective, or part of a harmful agenda and should be rejected. Asserts that official safety and efficacy messaging conceals serious risks or ulterior motives.' },
  { number: 14, label: 'COVID Threat Exaggerated', lean: 'right', description: 'Claims that the severity, lethality, or public-health impact of COVID-19 was deliberately overstated by governments, media, or health authorities. Asserts that official case and death figures or policy responses were inflated relative to the true risk.' },
  { number: 15, label: 'Danger of GMOs', lean: 'center', description: 'Claims that genetically modified organisms in food pose severe hidden health or ecological dangers suppressed by industry and regulators. Asserts that safety assurances are corrupt or fraudulent.' },
  { number: 16, label: 'DC/Boulder attacks as false flags', lean: 'unclear', description: 'Claims that attacks in Washington, D.C. and/or Boulder were staged false-flag operations. Asserts government or insider authorship to justify policy, blame enemies, or shape public opinion.' },
  { number: 17, label: 'Deep State', lean: 'right', description: 'Claims that unelected bureaucrats, intelligence officials, or permanent government actors secretly control policy against elected leaders. Asserts a hidden power structure that undermines democratic accountability.' },
  { number: 18, label: 'Dems Infected Trump w/ COVID', lean: 'right', description: 'Claims that Democratic opponents deliberately infected Donald Trump with COVID-19. Asserts intentional biological sabotage rather than ordinary transmission.' },
  { number: 19, label: 'Elite Pedophile Rings', lean: 'right', description: 'Claims that wealthy or powerful elites operate secret child sexual-abuse networks. Asserts systemic trafficking and cover-ups protecting high-status perpetrators.' },
  { number: 20, label: 'Epstein eating children claims', lean: 'unclear', description: 'Claims that Jeffrey Epstein engaged in cannibalism of children. Asserts extreme ritual or sadistic consumption beyond documented sex-trafficking allegations.' },
  { number: 21, label: 'Epstein Murdered', lean: 'right', description: 'Claims that Jeffrey Epstein did not die by suicide in jail but was killed to silence him. Asserts involvement by powerful clients or institutions seeking to prevent further disclosures.' },
  { number: 22, label: 'Faked Moon Landing', lean: 'left', description: 'Claims that the Apollo moon landings were staged and filmed on Earth. Asserts that NASA and the U.S. government fabricated the lunar missions.' },
  { number: 23, label: 'FBI Iran warning as war pretext', lean: 'unclear', description: 'Claims that FBI or official warnings about Iranian threats are manufactured pretexts for war. Asserts threat inflation or fabricated intelligence to justify military action.' },
  { number: 24, label: 'FDA Promote Cancer', lean: 'right', description: 'Claims that the U.S. Food and Drug Administration deliberately promotes or fails to stop cancer-causing products for corrupt reasons. Asserts institutional complicity rather than ordinary regulatory failure.' },
  { number: 25, label: 'FDR Pearl Harbor', lean: 'center', description: 'Claims that Franklin D. Roosevelt knew of or allowed the Pearl Harbor attack to draw the U.S. into World War II. Asserts foreknowledge and deliberate non-prevention for political ends.' },
  { number: 26, label: 'Fluorescent Lightbulbs', lean: 'center', description: 'Claims that fluorescent or compact fluorescent bulbs are a deliberate health or surveillance hazard pushed by authorities. Asserts hidden toxic or control motives behind lighting mandates or product design.' },
  { number: 27, label: 'Fluoride in Water', lean: 'center', description: 'Claims that water fluoridation is a harmful or mind-control scheme rather than a dental-health measure. Asserts toxic or nefarious intent behind public fluoridation programs.' },
  { number: 28, label: 'Frame OJ Simpson', lean: 'left', description: 'Claims that O.J. Simpson was framed for the murders of Nicole Brown Simpson and Ron Goldman. Asserts planted evidence or a coordinated setup by police or others.' },
  { number: 29, label: 'Global Warming Hoax', lean: 'right', description: 'Claims that anthropogenic climate change is fabricated or greatly exaggerated by scientists, governments, or interest groups. Asserts that warming data, models, or consensus are manipulated for political or financial gain.' },
  { number: 30, label: 'GOP Steals Elections', lean: 'left', description: 'Claims that Republicans systematically steal elections through fraud, vote suppression machinery, or rigged systems. Asserts organized partisan theft of electoral outcomes.' },
  { number: 31, label: 'Gov\'t Assassinate Entertainers', lean: 'left', description: 'Claims that governments murder celebrities or entertainers who threaten powerful interests. Asserts official hit jobs disguised as accidents, overdoses, or suicides.' },
  { number: 32, label: 'Gov\'t Mind Control', lean: 'right', description: 'Claims that governments use technology, chemicals, media, or secret programs to control people’s thoughts or behavior. Asserts systematic psychological or neurological manipulation of populations.' },
  { number: 33, label: 'Government False Flags', lean: 'right', description: 'Claims that governments stage attacks or disasters and blame them on others to justify policy, war, or repression. Asserts covert authorship of events publicly attributed to external enemies or terrorists.' },
  { number: 34, label: 'Holocaust Denial', lean: 'center', description: 'Claims that the Nazi genocide of Jews and other victims did not occur as historically established, or that its scale and methods are fabricated or greatly exaggerated. Asserts that mainstream Holocaust history is a deliberate falsehood.' },
  { number: 35, label: 'Intentionally Spread AIDS', lean: 'center', description: 'Claims that HIV/AIDS was deliberately created or spread by governments or scientists as a bioweapon or population-control tool. Asserts intentional epidemic causation rather than natural zoonotic origin.' },
  { number: 36, label: 'Intentionally Spread Cancer', lean: 'center', description: 'Claims that governments, corporations, or other actors deliberately spread cancer through products, chemicals, or medical practices. Asserts purposeful induction of disease rather than negligence or environmental risk alone.' },
  { number: 37, label: 'Iran Hostage Conspiracy', lean: 'left', description: 'Claims that the 1979–81 Iran hostage crisis involved a secret deal or conspiracy with U.S. political actors—often that the Reagan campaign delayed release until after the 1980 election. Asserts collusion rather than solely Iranian initiative.' },
  { number: 38, label: 'Iran/Israel attack false flag for Epstein', lean: 'unclear', description: 'Claims that an Iran- or Israel-linked attack was staged as a false flag to distract from or bury Epstein-related revelations. Asserts geopolitical violence manufactured for narrative control around Epstein.' },
  { number: 39, label: 'JD Vance couch memoir claim', lean: 'unclear', description: 'Claims that JD Vance wrote about or admitted to sexual activity with a couch (a viral fabricated-memoir rumor). Asserts that such a confession appears in his writing despite no such passage existing.' },
  { number: 40, label: 'JFK Assassination', lean: 'center', description: 'Claims that John F. Kennedy’s assassination involved a conspiracy beyond Lee Harvey Oswald acting alone. Asserts additional shooters, institutional involvement, or an official cover-up.' },
  { number: 41, label: 'Koch Brothers World Control', lean: 'left', description: 'Claims that Charles and David Koch secretly control governments, media, or global policy through wealth and networks. Asserts hidden domination of political and economic systems.' },
  { number: 42, label: 'LA wildfires as gov/Israel inside job', lean: 'unclear', description: 'Claims that Los Angeles-area wildfires were deliberately set or enabled by the U.S. government and/or Israel. Asserts an inside-job arson or directed disaster rather than natural or accidental causes.' },
  { number: 43, label: 'MLK Assassination', lean: 'center', description: 'Claims that Martin Luther King Jr.’s assassination involved a government or broader conspiracy beyond James Earl Ray acting alone. Asserts official complicity or a cover-up of the true plot.' },
  { number: 44, label: 'MMR Anti-vax', lean: 'right', description: 'Claims that the measles-mumps-rubella vaccine causes autism or other severe harm and should be avoided. Asserts that official vaccine-safety science conceals or denies those risks.' },
  { number: 45, label: 'Mueller Investigating Clintons', lean: 'right', description: 'Claims that Robert Mueller’s Russia investigation was actually aimed at or secretly focused on Hillary Clinton and related figures rather than Trump-campaign–Russia ties. Asserts that public framing of the probe concealed that true target.' },
  { number: 46, label: 'Pharma Invents Diseases', lean: 'center', description: 'Claims that pharmaceutical companies invent or exaggerate diseases to sell unnecessary drugs. Asserts disease-mongering and fabricated medical conditions for profit.' },
  { number: 47, label: 'Processing Mail-in Ballots', lean: 'left', description: 'Claims that mail-in ballot handling is systematically rigged through fraudulent processing, ballot stuffing, or destruction. Asserts coordinated election fraud via absentee/mail voting procedures.' },
  { number: 48, label: 'Putin Poisoned Clinton', lean: 'left', description: 'Claims that Vladimir Putin or Russian agents poisoned Hillary Clinton. Asserts intentional toxic attack rather than ordinary illness or other causes.' },
  { number: 49, label: 'Raisi crash as CIA/Mossad hit', lean: 'unclear', description: 'Claims that Iranian President Ebrahim Raisi’s fatal helicopter crash was an assassination by the CIA and/or Mossad. Asserts deliberate downing disguised as an accident.' },
  { number: 50, label: 'RFK Assassination', lean: 'right', description: 'Claims that Robert F. Kennedy’s 1968 assassination involved a broader conspiracy beyond the convicted shooter. Asserts additional shooters, intelligence involvement, or a cover-up of the true plot.' },
  { number: 51, label: 'Rothschilds', lean: 'center', description: 'Claims that the Rothschild family secretly controls banks, governments, or world events. Asserts hidden dynastic power over global finance and politics.' },
  { number: 52, label: 'Russia Manipulates U.S. Policy', lean: 'left', description: 'Claims that Russia secretly directs or heavily controls U.S. government policy through kompromat, agents, or infiltration. Asserts Russian command over American decision-making beyond influence operations alone.' },
  { number: 53, label: 'Sandy Hook Faked', lean: 'right', description: 'Claims that the 2012 Sandy Hook Elementary School shooting was staged or did not occur as reported. Asserts crisis actors, fabricated victims, or a false-flag narrative for gun-control aims.' },
  { number: 54, label: 'Sascha Riley Trump abuse claims', lean: 'unclear', description: 'Claims based on Sascha (or similar-named) Riley allegations that Donald Trump engaged in child sexual abuse or related crimes. Asserts those accusations as suppressed truth about Trump’s conduct.' },
  { number: 55, label: 'Single Group Control', lean: 'center', description: 'Claims that one hidden group—ethnic, religious, financial, or secret society—secretly rules world affairs. Asserts concentrated cabal control over governments and institutions.' },
  { number: 56, label: 'Soros Control World', lean: 'right', description: 'Claims that billionaire George Soros secretly directs global politics, media, protests, or financial systems. Asserts that major events and institutions are steered through his funding and influence networks.' },
  { number: 57, label: 'Spread COVID on Purpose', lean: 'right', description: 'Claims that COVID-19 was intentionally released or disseminated by a government, lab, or other actor as a bioweapon or population-control measure. Asserts deliberate spread rather than accidental or natural origin alone.' },
  { number: 58, label: 'Trump assassination attempt was staged', lean: 'unclear', description: 'Claims that an apparent assassination attempt on Donald Trump was faked or allowed as a false flag. Asserts theatrical or insider-orchestrated violence for political gain.' },
  { number: 59, label: 'Trump Cover-up Symptoms', lean: 'left', description: 'Claims that Donald Trump or his circle concealed serious COVID-19 or other health symptoms from the public. Asserts deliberate medical deception about his condition.' },
  { number: 60, label: 'Trump Epstein child abuse (BlueAnon)', lean: 'unclear', description: 'Claims—often circulating in anti-Trump online spaces—that Donald Trump participated in Epstein-linked child sexual abuse. Asserts direct involvement in elite pedophile crimes with Epstein.' },
  { number: 61, label: 'Trump Faked COVID', lean: 'left', description: 'Claims that Donald Trump fabricated or staged his COVID-19 diagnosis or illness. Asserts the episode was a political performance rather than a genuine infection.' },
  { number: 62, label: 'Trump is a Russian Asset', lean: 'left', description: 'Claims that Donald Trump knowingly serves Russian intelligence or Kremlin interests. Asserts he is controlled or directed by Russia rather than merely friendly or influenced.' },
  { number: 63, label: 'Trump Made Deal w/ Putin', lean: 'left', description: 'Claims that Donald Trump struck a secret corrupt bargain with Vladimir Putin. Asserts a hidden quid pro quo governing policy, elections, or personal benefit.' },
  { number: 64, label: 'Trump suppressing Epstein files', lean: 'unclear', description: 'Claims that Donald Trump is actively blocking or burying Epstein-related documents and disclosures. Asserts a personal cover-up to hide compromising material.' },
  { number: 65, label: 'Vaccine Tracking Devices', lean: 'right', description: 'Claims that vaccines contain microchips, nanotechnology, or other devices used to track or control recipients. Asserts covert surveillance or behavioral control via immunization.' },
  { number: 66, label: 'Vance and the Pope', lean: 'unclear', description: 'Claims a conspiratorial narrative linking JD Vance and the Pope—often alleging secret coordination, betrayal, or sinister religious-political dealings. Asserts hidden collaboration or conflict beyond ordinary diplomatic or public interaction.' },
  { number: 67, label: 'Virginia Giuffre suicide narrative', lean: 'unclear', description: 'Claims that Virginia Giuffre’s death was not a suicide but murder, or that suicide narratives are being used to silence Epstein-related testimony. Asserts foul play or narrative manipulation around her death.' },]

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

export function knownConspiracyByLabel(label: string): KnownConspiracy | undefined {
  return KNOWN_CONSPIRACIES.find((c) => c.label === label)
}

export type Stance = 'PRO' | 'ANTI' | 'NEUTRAL'

export const STANCE_OPTIONS: Stance[] = ['PRO', 'ANTI', 'NEUTRAL']

export const DEFAULT_STANCE: Stance = 'NEUTRAL'

/** Optional lean of the named actor in the conspiracy template. */
export type ActorPoliticalLeaning = 'left' | 'right' | 'center' | 'unclear'

export const ACTOR_POLITICAL_LEANING_OPTIONS: {
  value: ActorPoliticalLeaning
  short: string
  label: string
}[] = [
  { value: 'left', short: 'L', label: 'Left' },
  { value: 'right', short: 'R', label: 'Right' },
  { value: 'center', short: 'C', label: 'Center' },
  { value: 'unclear', short: 'U', label: 'Unclear' },
]

/** Soft max words for actor / action / target free-text slots. */
export const TEMPLATE_MAX_WORDS = 100

export function wordCount(text: string): number {
  const trimmed = text.trim()
  if (!trimmed) return 0
  return trimmed.split(/\s+/).length
}
