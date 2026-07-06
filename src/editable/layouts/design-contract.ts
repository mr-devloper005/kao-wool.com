import type { CSSProperties } from 'react'

/*
  Dark, neon-accented design tokens derived from https://grabin.webflow.io/.
  Every downstream component must consume the CSS variables + `dc` recipes
  below — nothing here should be hardcoded inside JSX files.
*/

export const editableRootStyle = {
  '--slot4-page-bg': '#0f0f0e',
  '--slot4-page-text': '#ffffff',
  '--slot4-panel-bg': '#171616',
  '--slot4-surface-bg': '#1b1a1a',
  '--slot4-muted-text': '#bdbdbd',
  '--slot4-soft-muted-text': '#8a8a88',
  '--slot4-accent': '#88ef56',
  '--slot4-accent-fill': '#88ef56',
  '--slot4-accent-soft': 'rgba(136,239,86,0.14)',
  '--slot4-on-accent': '#0f0f0e',
  '--slot4-dark-bg': '#0a0a09',
  '--slot4-dark-text': '#ffffff',
  '--slot4-media-bg': '#1b1a1a',
  '--slot4-cream': '#f9fafb',
  '--slot4-warm': '#171616',
  '--slot4-lavender': '#171616',
  '--slot4-gray': '#1b1a1a',
  '--slot4-body-gradient': 'radial-gradient(1200px 600px at 50% -10%, rgba(136,239,86,0.06), transparent 60%)',
  '--editable-page-bg': '#0f0f0e',
  '--editable-page-text': '#ffffff',
  '--editable-container': '1440px',
  '--editable-border': 'rgba(255,255,255,0.08)',
  '--editable-border-strong': 'rgba(255,255,255,0.18)',
  '--editable-nav-bg': 'rgba(15,15,14,0.72)',
  '--editable-nav-text': '#ffffff',
  '--editable-nav-active': '#88ef56',
  '--editable-nav-active-text': '#0f0f0e',
  '--editable-cta-bg': '#88ef56',
  '--editable-cta-text': '#0f0f0e',
  '--editable-search-bg': '#171616',
  '--editable-footer-bg': '#0a0a09',
  '--editable-footer-text': '#ffffff',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-accent)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[var(--slot4-accent)]',
  onAccentText: 'text-[var(--slot4-on-accent)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-cream)]',
  warmBg: 'bg-[var(--slot4-warm)]',
  lavenderBg: 'bg-[var(--slot4-lavender)]',
  grayBg: 'bg-[var(--slot4-gray)]',
  border: 'border-[var(--editable-border)]',
  borderStrong: 'border-[var(--editable-border-strong)]',
  darkBorder: 'border-white/10',
  shadow: 'shadow-none',
  shadowStrong: 'shadow-[0_20px_60px_rgba(0,0,0,0.5)]',
  overlay: 'bg-[linear-gradient(180deg,rgba(15,15,14,0.05),rgba(15,15,14,0.85))]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-[var(--editable-container)] px-5 sm:px-8 lg:px-12 xl:px-16',
    sectionY: 'py-20 sm:py-24 lg:py-32',
    sectionYSm: 'py-14 sm:py-16 lg:py-20',
    sectionYLg: 'py-24 sm:py-32 lg:py-40',
  },
  layout: {
    safeGrid: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center',
    rail: 'flex snap-x gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[280px] shrink-0 snap-start sm:w-[320px]',
  },
  type: {
    eyebrow: "editable-mono text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--slot4-accent)]",
    eyebrowMuted: "editable-mono text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--slot4-muted-text)]",
    heroTitle: "editable-display text-[42px] font-semibold leading-[1.02] tracking-[-0.04em] sm:text-6xl lg:text-[76px]",
    displayTitle: "editable-display text-6xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-7xl lg:text-[110px]",
    sectionTitle: "editable-display text-3xl font-semibold leading-[1.08] tracking-[-0.035em] sm:text-4xl lg:text-[42px]",
    body: 'text-base leading-[1.7]',
    emphasis: 'text-lg leading-[1.55] text-[var(--slot4-muted-text)] sm:text-xl',
  },
  surface: {
    card: `rounded-3xl border ${editablePalette.border} ${editablePalette.panelBg}`,
    soft: `rounded-3xl border ${editablePalette.border} bg-white/[0.02]`,
    dark: `rounded-3xl border ${editablePalette.border} ${editablePalette.darkBg}`,
    light: 'rounded-3xl bg-[var(--slot4-cream)] text-[var(--slot4-on-accent)]',
  },
  button: {
    primary:
      'inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-6 py-3.5 text-sm font-semibold tracking-[-0.005em] text-[var(--slot4-on-accent)] transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_0_6px_rgba(136,239,86,0.14)] active:scale-[0.98]',
    secondary:
      'inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/[0.02] px-6 py-3.5 text-sm font-semibold tracking-[-0.005em] text-white transition-all duration-300 hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)] active:scale-[0.98]',
    accent:
      'inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-6 py-3.5 text-sm font-semibold text-[var(--slot4-on-accent)] transition-all duration-300 hover:brightness-110 active:scale-[0.98]',
    ghost:
      'inline-flex items-center gap-1.5 text-sm font-semibold text-white transition hover:text-[var(--slot4-accent)]',
  },
  badge: {
    pill:
      'inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-3.5 py-1.5 editable-mono text-[11px] font-medium uppercase tracking-[0.16em] text-white/85',
    accentPill:
      'inline-flex items-center gap-2 rounded-full border border-[var(--slot4-accent)]/40 bg-[var(--slot4-accent-soft)] px-3.5 py-1.5 editable-mono text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--slot4-accent)]',
    dot: 'inline-block h-1.5 w-1.5 rounded-full bg-[var(--slot4-accent)]',
  },
  media: {
    frame: `relative overflow-hidden rounded-2xl ${editablePalette.mediaBg}`,
    frameFull: `relative overflow-hidden rounded-3xl ${editablePalette.mediaBg}`,
    ratio: 'aspect-[16/10]',
    ratioSquare: 'aspect-square',
    ratioPortrait: 'aspect-[3/4]',
  },
  motion: {
    lift:
      'transition-all duration-500 hover:-translate-y-1 hover:border-[var(--slot4-accent)]/45',
    fade: 'transition duration-300 hover:opacity-85',
    zoom: 'transition duration-700 group-hover:scale-[1.04]',
  },
  divider: 'h-px w-full bg-[var(--editable-border)]',
} as const

export const aiLayoutRules = [
  'The palette lives in editableRootStyle — change site-wide colours there, then let every section inherit.',
  'Every heading uses .editable-display; every eyebrow uses .editable-mono for the Roboto Mono label voice.',
  'Buttons are pills (rounded-full). Do not use rounded-lg/rounded-md for CTAs.',
  'Cards are dark panels on a darker page background, with a hairline white/8 border and 24px radius.',
  'Wrap section headers + grid items in <EditableReveal index={i}> so they fade+lift on scroll.',
  'Keep dynamic post fetching intact; do not replace posts with mock arrays.',
  'Use postHref() for all post links so task-specific routes keep working.',
] as const
