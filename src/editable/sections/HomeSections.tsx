import Link from 'next/link'
import {
  ArrowUpRight, ArrowRight, BookOpen, Building2, Bookmark, Compass,
  FileText, Image as ImageIcon, Megaphone, Search, UserRound, Sparkles,
  MapPin, Download, ShieldCheck, Zap,
} from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { getEditablePostImage, getEditableExcerpt, getEditableCategory, postHref } from '@/editable/cards/PostCards'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { taskLabel as displayTaskLabel } from '@/editable/theme/task-themes'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const taskIcon: Record<TaskKey, typeof FileText> = {
  article: BookOpen,
  listing: Building2,
  classified: Megaphone,
  image: ImageIcon,
  sbm: Bookmark,
  pdf: FileText,
  profile: UserRound,
}

function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

function taskRoute(key: TaskKey) {
  return SITE_CONFIG.taskViews?.[key] || `/${key}`
}

/* ============================== HERO ============================== */

export function EditableHomeHero({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((s) => s.posts)])
  const hero = pagesContent.home.hero
  const title = hero.title
  const featured = pool.slice(0, 3)
  const counters = [
    { value: pool.length.toString(), label: 'Live entries' },
    { value: '24/7', label: 'Directory updates' },
    { value: '01', label: 'Offline-ready shelf' },
  ]

  return (
    <section className="editable-accent-halo relative overflow-hidden pt-8 pb-20 sm:pt-10 lg:pt-14 lg:pb-24">
      <div className={dc.shell.section}>
        {/* Announcement strip — thin, editorial */}
        <EditableReveal index={0}>
          <div className="flex flex-wrap items-center gap-3 border-b border-[var(--editable-border)] pb-5">
            <div className={dc.badge.accentPill}>
              <span className={dc.badge.dot} /> {hero.badge}
            </div>
            <span className="editable-mono hidden text-[11px] uppercase tracking-[0.16em] text-white/40 sm:inline">
              [ Home · v.01 ]
            </span>
            <Link href="/search" className="editable-mono ml-auto inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-white/60 transition hover:text-[var(--slot4-accent)]">
              Search everything <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </EditableReveal>

        {/* Main hero grid — title aligned to top of tiles */}
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.35fr_0.65fr] lg:gap-14 lg:items-start">
          <div className="flex flex-col">
            <EditableReveal index={1}>
              <p className="editable-mono text-[11px] uppercase tracking-[0.2em] text-[var(--slot4-accent)]">
                [ 00 · The neighbourhood, catalogued ]
              </p>
            </EditableReveal>

            <EditableReveal index={2}>
              <h1 className={`${dc.type.heroTitle} mt-6`}>
                <span className="block text-white">{title[0]}</span>
                <span className="block text-white/55">
                  {title[1]?.replace(/\.$/, '')}
                  <span className="text-[var(--slot4-accent)]">.</span>
                </span>
              </h1>
            </EditableReveal>

            <EditableReveal index={3}>
              <p className="mt-8 max-w-xl text-base leading-[1.6] text-white/65 sm:text-lg">
                {hero.description}
              </p>
            </EditableReveal>

            <EditableReveal index={4}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link href={hero.primaryCta.href} className={dc.button.primary}>
                  {hero.primaryCta.label} <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link href={hero.secondaryCta.href} className={dc.button.secondary}>
                  {hero.secondaryCta.label}
                </Link>
              </div>
            </EditableReveal>

            <EditableReveal index={5}>
              <form action="/search" className="mt-8 flex w-full max-w-xl items-center gap-2 rounded-full border border-[var(--editable-border)] bg-white/[0.03] p-1.5 pl-5 backdrop-blur-md transition focus-within:border-[var(--slot4-accent)]/60">
                <Search className="h-4 w-4 shrink-0 text-[var(--slot4-accent)]" />
                <input
                  name="q"
                  placeholder={hero.searchPlaceholder}
                  className="min-w-0 flex-1 bg-transparent py-2 text-sm text-white outline-none placeholder:text-white/40"
                />
                <button className="shrink-0 rounded-full bg-[var(--slot4-accent-fill)] px-5 py-2.5 text-sm font-semibold text-[var(--slot4-on-accent)] transition hover:brightness-110">
                  Search
                </button>
              </form>
            </EditableReveal>

            {/* Counter strip integrated into hero left column */}
            <EditableReveal index={6}>
              <div className="mt-12 grid grid-cols-3 gap-6 border-t border-[var(--editable-border)] pt-8">
                {counters.map((c) => (
                  <div key={c.label}>
                    <p className="editable-display text-4xl font-semibold leading-none tracking-[-0.04em] text-white sm:text-5xl lg:text-[56px]">
                      {c.value}
                    </p>
                    <p className="editable-mono mt-3 text-[10px] uppercase tracking-[0.16em] text-[var(--slot4-muted-text)]">
                      {c.label}
                    </p>
                  </div>
                ))}
              </div>
            </EditableReveal>
          </div>

          {/* Featured collage — tall lead tile + two stacked */}
          <EditableReveal index={5}>
            <div className="grid gap-3">
              {featured[0] ? (
                <Link
                  href={postHref(primaryTask, featured[0], primaryRoute)}
                  className={`group relative block overflow-hidden ${dc.surface.card} aspect-[4/5] ${dc.motion.lift}`}
                >
                  <img
                    src={getEditablePostImage(featured[0])}
                    alt={featured[0].title}
                    className={`absolute inset-0 h-full w-full object-cover opacity-90 ${dc.motion.zoom}`}
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_30%,rgba(15,15,14,0.95)_100%)]" />
                  <div className="absolute left-4 top-4">
                    <span className={dc.badge.accentPill}>
                      <span className={dc.badge.dot} /> Featured
                    </span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <span className="editable-mono text-[10px] uppercase tracking-[0.16em] text-[var(--slot4-accent)]">
                      {getEditableCategory(featured[0])}
                    </span>
                    <p className="editable-display mt-2 line-clamp-2 text-lg font-semibold leading-[1.2] text-white sm:text-xl">
                      {featured[0].title}
                    </p>
                  </div>
                </Link>
              ) : null}

              <div className="grid grid-cols-2 gap-3">
                {featured.slice(1, 3).map((post) => (
                  <Link
                    key={post.id || post.slug}
                    href={postHref(primaryTask, post, primaryRoute)}
                    className={`group relative block overflow-hidden ${dc.surface.card} aspect-square ${dc.motion.lift}`}
                  >
                    <img
                      src={getEditablePostImage(post)}
                      alt={post.title}
                      className={`absolute inset-0 h-full w-full object-cover opacity-85 ${dc.motion.zoom}`}
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(15,15,14,0.95)_100%)]" />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <span className="editable-mono text-[9px] uppercase tracking-[0.16em] text-[var(--slot4-accent)]">
                        {getEditableCategory(post)}
                      </span>
                      <p className="editable-display mt-1.5 line-clamp-2 text-sm font-semibold leading-[1.2] text-white">
                        {post.title}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </EditableReveal>
        </div>
      </div>
    </section>
  )
}

/* ============================== CATEGORY RAIL ============================== */

export function EditableStoryRail({ primaryRoute }: HomeSectionProps) {
  const categories = SITE_CONFIG.tasks.filter((t) => t.enabled)
  if (!categories.length) return null

  return (
    <section className={`${dc.shell.sectionY}`}>
      <div className={dc.shell.section}>
        <EditableReveal index={0}>
          <div className="flex flex-col justify-between gap-8 border-b border-[var(--editable-border)] pb-10 sm:flex-row sm:items-end">
            <div>
              <p className={dc.type.eyebrow}>[ 01 / Shelves ]</p>
              <h2 className={`${dc.type.sectionTitle} mt-5 max-w-3xl`}>
                One home for the neighbourhood — and every reference that pairs with it.
              </h2>
            </div>
            <Link href={primaryRoute} className={dc.button.ghost}>
              Open the directory <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </EditableReveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((task, i) => {
            const Icon = taskIcon[task.key as TaskKey] || FileText
            const label = displayTaskLabel(task.key as TaskKey)
            const route = taskRoute(task.key as TaskKey)
            return (
              <EditableReveal key={task.key} index={i}>
                <Link
                  href={route}
                  className={`group flex h-full flex-col justify-between gap-8 ${dc.surface.card} p-8 ${dc.motion.lift}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--slot4-accent)]/40 bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className="editable-mono text-[11px] uppercase tracking-[0.16em] text-white/50">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div>
                    <h3 className="editable-display text-2xl font-semibold leading-[1.15] tracking-[-0.025em] text-white">
                      {label}
                    </h3>
                    <p className="mt-3 text-sm leading-[1.6] text-white/60">
                      {task.description || 'Open this shelf to see what is new.'}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--slot4-accent)] transition group-hover:gap-3">
                      Open shelf <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </EditableReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ============================== MISSION / FEATURE SPLIT ============================== */

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const featured = dedupePosts([...posts, ...timeSections.flatMap((s) => s.posts)]).slice(0, 1)[0]
  const points = [
    { icon: Compass, label: 'Directory first', copy: 'Nearby places, verified for hours and location before they land.' },
    { icon: Download, label: 'Library on hand', copy: 'One-click references you can take offline.' },
    { icon: ShieldCheck, label: 'Trust cues', copy: 'Every entry has real context — not a padded review count.' },
    { icon: Zap, label: 'Quiet updates', copy: 'One quiet email a week. New entries, fresh references.' },
  ]

  return (
    <section className="border-y border-[var(--editable-border)] bg-[var(--slot4-panel-bg)]/60 py-24 sm:py-32">
      <div className={dc.shell.section}>
        <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <EditableReveal index={0}>
            <div>
              <p className={dc.type.eyebrow}>[ 02 / About ]</p>
              <h2 className={`${dc.type.sectionTitle} mt-5`}>
                Slow discovery. Fast decisions. Two shelves that keep talking.
              </h2>
              <p className="mt-6 max-w-lg text-lg leading-[1.6] text-white/60">
                {pagesContent.home.intro.paragraphs[0]}
              </p>
              <div className="mt-10 grid gap-5 sm:grid-cols-2">
                {points.map((p) => (
                  <div key={p.label} className="rounded-2xl border border-[var(--editable-border)] bg-white/[0.02] p-5">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
                      <p.icon className="h-4 w-4" />
                    </span>
                    <p className="editable-display mt-4 text-base font-semibold text-white">{p.label}</p>
                    <p className="mt-2 text-sm leading-[1.55] text-white/60">{p.copy}</p>
                  </div>
                ))}
              </div>
            </div>
          </EditableReveal>

          {featured ? (
            <EditableReveal index={2}>
              <Link
                href={postHref(primaryTask, featured, primaryRoute)}
                className={`group relative block overflow-hidden ${dc.surface.card} ${dc.motion.lift}`}
              >
                <div className="relative aspect-[4/5]">
                  <img
                    src={getEditablePostImage(featured)}
                    alt={featured.title}
                    className={`absolute inset-0 h-full w-full object-cover ${dc.motion.zoom}`}
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(15,15,14,0.95)_100%)]" />
                  <div className="absolute inset-0 flex flex-col justify-between p-8">
                    <div className={dc.badge.accentPill}>
                      <Sparkles className="h-3 w-3" /> Featured entry
                    </div>
                    <div>
                      <p className="editable-mono text-[11px] uppercase tracking-[0.16em] text-[var(--slot4-accent)]">
                        {getEditableCategory(featured)}
                      </p>
                      <h3 className="editable-display mt-3 text-3xl font-semibold leading-[1.05] tracking-[-0.03em] text-white sm:text-4xl">
                        {featured.title}
                      </h3>
                      <p className="mt-4 line-clamp-2 text-sm leading-[1.6] text-white/70">
                        {getEditableExcerpt(featured, 160)}
                      </p>
                      <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--slot4-accent)]">
                        Open entry <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </EditableReveal>
          ) : null}
        </div>
      </div>
    </section>
  )
}

/* ============================== TIME COLLECTIONS / PROCESS ============================== */

const sectionCopy: Record<string, { eyebrow: string; title: string; note: string }> = {
  spotlight: { eyebrow: '[ 03 / This week ]', title: 'Fresh from the shelves', note: 'New in the last 7 days — directory and library.' },
  browse: { eyebrow: '[ 04 / Trending ]', title: 'Reaching for these most', note: 'Popular this month across every shelf.' },
  index: { eyebrow: '[ 05 / Archive ]', title: 'Reliable go-tos', note: 'Evergreen entries and references still worth the time.' },
}

function TimeCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const category = getEditableCategory(post)
  const image = getEditablePostImage(post)
  return (
    <EditableReveal index={index}>
      <Link
        href={href}
        className={`group flex h-full flex-col overflow-hidden ${dc.surface.card} ${dc.motion.lift}`}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-[var(--slot4-media-bg)]">
          <img
            src={image}
            alt={post.title}
            className={`absolute inset-0 h-full w-full object-cover ${dc.motion.zoom}`}
            loading="lazy"
          />
          <span className={`absolute left-4 top-4 ${dc.badge.pill}`}>
            <span className={dc.badge.dot} /> {category}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-6">
          <h3 className="editable-display line-clamp-2 text-lg font-semibold leading-[1.2] tracking-[-0.02em] text-white group-hover:text-[var(--slot4-accent)]">
            {post.title}
          </h3>
          <p className="mt-3 line-clamp-2 flex-1 text-sm leading-[1.6] text-white/60">
            {getEditableExcerpt(post, 130)}
          </p>
          <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--slot4-accent)]">
            Open <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </Link>
    </EditableReveal>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const sections =
    timeSections.length > 0
      ? timeSections
      : ([
          { key: 'spotlight', posts: posts.slice(0, 8), href: primaryRoute },
          { key: 'browse', posts: posts.slice(8, 16), href: primaryRoute },
          { key: 'index', posts: posts.slice(16, 24), href: primaryRoute },
        ] as Pick<HomeTimeSection, 'key' | 'posts' | 'href'>[])

  const visible = sections.filter((s) => s.posts.length)
  if (!visible.length) return null

  return (
    <>
      {visible.map((section, sectionIndex) => {
        const copy = sectionCopy[section.key] || { eyebrow: '[ 0X / Discover ]', title: 'More on the shelves', note: 'Recently added.' }
        return (
          <section key={section.key} className="border-t border-[var(--editable-border)] py-24 sm:py-28">
            <div className={dc.shell.section}>
              <EditableReveal index={0}>
                <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
                  <div>
                    <p className={dc.type.eyebrow}>{copy.eyebrow}</p>
                    <h2 className={`${dc.type.sectionTitle} mt-5 max-w-3xl`}>{copy.title}</h2>
                    <p className="mt-4 max-w-xl text-base text-white/60">{copy.note}</p>
                  </div>
                  <Link href={section.href || primaryRoute} className={dc.button.secondary}>
                    View shelf <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </EditableReveal>

              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {section.posts.slice(0, sectionIndex === 0 ? 8 : 4).map((post, i) => (
                  <TimeCard
                    key={post.id || post.slug}
                    post={post}
                    href={postHref(primaryTask, post, primaryRoute)}
                    index={i}
                  />
                ))}
              </div>
            </div>
          </section>
        )
      })}
    </>
  )
}

/* ============================== CTA BAND ============================== */

export function EditableHomeCta() {
  const cta = pagesContent.home.cta
  return (
    <section className="editable-accent-halo relative border-t border-[var(--editable-border)] py-28 sm:py-36">
      <div className={dc.shell.section}>
        <EditableReveal index={0}>
          <div className="flex flex-col items-start justify-between gap-12 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <div className={dc.badge.accentPill}>
                <MapPin className="h-3 w-3" /> {cta.badge}
              </div>
              <h2 className="editable-display mt-8 text-[42px] font-semibold leading-[1.02] tracking-[-0.04em] text-white sm:text-6xl lg:text-[76px]">
                {cta.title}
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-[1.6] text-white/60">{cta.description}</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href={cta.primaryCta.href} className={dc.button.primary}>
                {cta.primaryCta.label} <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link href={cta.secondaryCta.href} className={dc.button.secondary}>
                {cta.secondaryCta.label}
              </Link>
            </div>
          </div>
        </EditableReveal>
      </div>
    </section>
  )
}
