import type { TaskKey } from '@/lib/site-config'

export type TaskPageVoice = {
  eyebrow: string
  headline: string
  description: string
  filterLabel: string
  secondaryNote: string
  chips: string[]
}

export const taskPageVoices = {
  article: {
    eyebrow: 'Journal',
    headline: 'Long reads for the curious neighbourhood.',
    description: 'Field notes, guides, and explainers — written to help you find, evaluate, and act on what the directory turns up.',
    filterLabel: 'Choose a topic',
    secondaryNote: 'Editorial pacing built for reading, not skimming.',
    chips: ['Field notes', 'Explainers', 'Long reads'],
  },
  classified: {
    eyebrow: 'Marketplace',
    headline: 'Fresh offers and time-sensitive posts.',
    description: 'Short-lived opportunities from neighbours, small operators, and local outfits — surfaced fast so you can act on them.',
    filterLabel: 'Filter marketplace category',
    secondaryNote: 'Prioritise urgency, short summaries, and direct paths to reach out.',
    chips: ['Fast scan', 'Fresh offers', 'Direct contact'],
  },
  sbm: {
    eyebrow: 'Bookmarks',
    headline: 'Curated links worth keeping close.',
    description: 'Saved corners of the internet that pair well with our directory — tools, reference sites, and reading lists.',
    filterLabel: 'Filter collection',
    secondaryNote: 'Grouped resources with quiet metadata and a calm rhythm.',
    chips: ['Collections', 'Resources', 'Reference flow'],
  },
  profile: {
    eyebrow: 'Profiles',
    headline: 'The people and teams behind the entries.',
    description: 'Owners, curators, and contributors — with the identity cues and links you need before you reach out.',
    filterLabel: 'Filter profile category',
    secondaryNote: 'Identity and credibility first, then the grid.',
    chips: ['Identity first', 'Trust cues', 'Direct contact'],
  },
  pdf: {
    eyebrow: 'Reference Library',
    headline: 'Downloadable references, briefings, and field guides.',
    description: 'A shelf of references you can pull down in one click — briefings, field guides, checklists, and long-form primers to keep on hand.',
    filterLabel: 'Filter reference type',
    secondaryNote: 'Every entry has a preview, a category, and a one-click download.',
    chips: ['Briefings', 'Field guides', 'Downloadable'],
  },
  listing: {
    eyebrow: 'Local Directory',
    headline: 'The neighbourhood, catalogued.',
    description: 'A working directory of nearby places — with the details you actually need before you visit: hours, location, contact, and what it is really like.',
    filterLabel: 'Filter directory category',
    secondaryNote: 'Comparison, location, and direct-action paths come first.',
    chips: ['Neighbourhood', 'Compare', 'Direct action'],
  },
  image: {
    eyebrow: 'Visuals',
    headline: 'A visual take on the directory.',
    description: 'Photo-first posts and galleries — what the places look like before you go, and what they feel like once you get there.',
    filterLabel: 'Filter visual category',
    secondaryNote: 'Let the images carry the page before the copy does.',
    chips: ['Gallery', 'Visual-first', 'Neighbourhood mood'],
  },
} satisfies Record<TaskKey, TaskPageVoice>
