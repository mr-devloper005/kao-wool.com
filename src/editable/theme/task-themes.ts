import type { CSSProperties } from 'react'
import type { TaskKey } from '@/lib/site-config'

/*
  Shared dark-neon visual language for every task. Only the kicker/note copy
  varies per task. Tokens are delivered via CSS variables (`--tk-*`). Labels
  use the renamed pair — "Local Directory" for listing, "Reference Library"
  for pdf — to stay off the reserved words in the brief.
*/

export type TaskTheme = {
  kicker: string
  note: string
  dark: boolean
  fontDisplay: string
  fontBody: string
  bg: string
  surface: string
  raised: string
  text: string
  muted: string
  line: string
  accent: string
  accentSoft: string
  onAccent: string
  glow: string
  radius: string
}

const DISPLAY_FONT = "'Inter', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"

const base = {
  dark: true,
  fontDisplay: DISPLAY_FONT,
  fontBody: DISPLAY_FONT,
  bg: '#0f0f0e',
  surface: '#171616',
  raised: '#1b1a1a',
  text: '#ffffff',
  muted: '#bdbdbd',
  line: 'rgba(255,255,255,0.08)',
  accent: '#88ef56',
  accentSoft: 'rgba(136,239,86,0.14)',
  onAccent: '#0f0f0e',
  glow: 'rgba(136,239,86,0.18)',
  radius: '1.25rem',
} satisfies Omit<TaskTheme, 'kicker' | 'note'>

export const taskThemes: Record<TaskKey, TaskTheme> = {
  article: { ...base, kicker: 'Journal', note: 'Long reads, guides, and stories worth the time.' },
  listing: { ...base, kicker: 'Local Directory', note: 'Find, compare, and connect with neighbourhood spots.' },
  classified: { ...base, kicker: 'Marketplace', note: 'Fresh offers and time-sensitive posts, ready to act on.' },
  image: { ...base, kicker: 'Visuals', note: 'A curated feed of standout imagery and galleries.' },
  sbm: { ...base, kicker: 'Bookmarks', note: 'Saved resources and links worth keeping close.' },
  pdf: { ...base, kicker: 'Reference Library', note: 'Downloadable references, briefings, and field guides.' },
  profile: { ...base, kicker: 'Profiles', note: 'Discover people, teams, and businesses behind the work.' },
}

export function getTaskTheme(task: TaskKey): TaskTheme {
  return taskThemes[task] || taskThemes.article
}

export function taskThemeStyle(task: TaskKey): CSSProperties {
  const t = getTaskTheme(task)
  return {
    '--tk-bg': t.bg,
    '--tk-surface': t.surface,
    '--tk-raised': t.raised,
    '--tk-text': t.text,
    '--tk-muted': t.muted,
    '--tk-line': t.line,
    '--tk-accent': t.accent,
    '--tk-accent-soft': t.accentSoft,
    '--tk-on-accent': t.onAccent,
    '--tk-glow': t.glow,
    '--tk-radius': t.radius,
    '--slot4-accent': t.accent,
    '--slot4-accent-fill': t.accent,
    '--editable-font-display': t.fontDisplay,
    '--editable-font-body': t.fontBody,
    fontFamily: t.fontBody,
  } as CSSProperties
}

/** User-facing display label for a task (never the raw key). */
export const taskDisplayLabel: Record<TaskKey, { singular: string; plural: string }> = {
  article: { singular: 'Story', plural: 'Stories' },
  listing: { singular: 'Local Directory', plural: 'Local Directory' },
  classified: { singular: 'Offer', plural: 'Marketplace' },
  image: { singular: 'Visual', plural: 'Visuals' },
  sbm: { singular: 'Bookmark', plural: 'Bookmarks' },
  pdf: { singular: 'Reference Library', plural: 'Reference Library' },
  profile: { singular: 'Profile', plural: 'Profiles' },
}

export function taskLabel(task: TaskKey): string {
  return taskDisplayLabel[task]?.plural || getTaskTheme(task).kicker
}
