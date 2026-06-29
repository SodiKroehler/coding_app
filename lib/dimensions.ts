export interface DimensionOption {
  value: string
  label: string
}

export interface Dimension {
  id: string
  label: string
  dbColumn: string
  options: DimensionOption[]
  description: string
}

export const DIMENSIONS: Dimension[] = [
  {
    id: 'conspiracy',
    label: 'Conspiracy Classification',
    dbColumn: 'conspiracy_label',
    description:
      'Does this post assert or imply a conspiracy theory — an unfounded claim that powerful actors are secretly coordinating to harm or deceive the public?',
    options: [
      { value: 'CT', label: 'Conspiracy Theory (CT)' },
      { value: 'nonCT', label: 'Non-Conspiracy (nonCT)' },
      { value: 'unclear', label: 'Unclear' },
    ],
  },
  {
    id: 'polarity',
    label: 'Political Lean',
    dbColumn: 'polarity_label',
    description:
      'What is the primary political orientation of the content or the framing of the post?',
    options: [
      { value: 'left', label: 'Left' },
      { value: 'center', label: 'Center' },
      { value: 'right', label: 'Right' },
      { value: 'unclear', label: 'Unclear' },
    ],
  },
]

// Map dbColumn → dimension for easy lookup
export const DIMENSION_BY_COLUMN = Object.fromEntries(
  DIMENSIONS.map((d) => [d.dbColumn, d])
)

export const LABEL_COLUMNS = DIMENSIONS.map((d) => d.dbColumn)
