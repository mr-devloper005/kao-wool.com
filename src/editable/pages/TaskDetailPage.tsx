import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft, ArrowUpRight, Bookmark, Camera, CheckCircle2, Clock,
  Download, ExternalLink, FileText, Globe2, Layers, Mail, MapPin,
  Phone, ShieldCheck, UserRound, Share2, Home, ChevronRight,
} from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableArticleComments } from '@/editable/components/EditableArticleComments'
import { getTaskTheme, taskThemeStyle, taskLabel as displayLabel } from '@/editable/theme/task-themes'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { Ads, getSlotSizes } from '@/lib/ads'

export const revalidate = 3

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  return [...media, ...images, ...singleImages].filter(Boolean).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.description) || asText(content.details) || post.summary || 'Details will appear here as soon as they are available.'
}

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

const safeUrl = (value: string) => /^https?:\/\//i.test(value) ? value : '#'

const linkifyMarkdown = (value: string) => value
  .replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi, (_m, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`)

const linkifyText = (value: string) => linkifyMarkdown(value)
  .replace(/(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi, (_m, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`)

const hardenLinks = (html: string) => html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_m, attrs) => {
  let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  if (!/\starget=/i.test(next)) next += ' target="_blank"'
  if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
  return `<a ${next}>`
})

const sanitizeHtml = (html: string) => hardenLinks(html
  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
  .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"'))

const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value
    .split(/\n{2,}/)
    .map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`)
    .join('')
}

const summaryText = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || ''
const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
const leadText = (post: SitePost) => {
  const summary = summaryText(post)
  if (!summary) return ''
  const lead = stripHtml(summary)
  return lead && lead !== stripHtml(getBody(post)) ? lead : ''
}
const categoryOf = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const tagsOf = (post: SitePost) => Array.isArray(post.tags) ? post.tags.filter(Boolean).slice(0, 6) : []
function formatBytes(bytes: number): string {
  if (!bytes || Number.isNaN(bytes) || bytes < 0) return ''
  if (bytes < 1024) return `${bytes} B`
  const units = ['KB', 'MB', 'GB', 'TB']
  let n = bytes / 1024
  let i = 0
  while (n >= 1024 && i < units.length - 1) { n /= 1024; i += 1 }
  return `${n < 10 ? n.toFixed(1) : Math.round(n)} ${units[i]}`
}

/**
 * Resolve the real byte size of a remote file via HEAD (falling back to a
 * 1-byte Range GET when HEAD is unsupported). Returns '' on any failure so the
 * caller can pick its own fallback string.
 */
async function fetchRemoteFileSize(url: string): Promise<string> {
  if (!url || !/^https?:\/\//i.test(url)) return ''
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 4000)
  try {
    let response = await fetch(url, {
      method: 'HEAD',
      cache: 'force-cache',
      signal: controller.signal,
    }).catch(() => null)
    let total = Number(response?.headers.get('content-length') || 0)
    if (!response || !response.ok || !total) {
      response = await fetch(url, {
        method: 'GET',
        headers: { Range: 'bytes=0-0' },
        cache: 'force-cache',
        signal: controller.signal,
      }).catch(() => null)
      const range = response?.headers.get('content-range') || ''
      if (range.includes('/')) total = Number(range.split('/')[1]) || 0
      else if (!total) total = Number(response?.headers.get('content-length') || 0)
    }
    return formatBytes(total)
  } catch {
    return ''
  } finally {
    clearTimeout(timer)
  }
}

const mapSrcFor = (post: SitePost) => {
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
}

export function TaskDetailView({ task, post, related, comments = [] }: { task: TaskKey; post: SitePost; related: SitePost[]; comments?: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]">
        {task === 'listing' ? <ListingDetail post={post} related={related} /> : null}
        {task === 'classified' ? <ClassifiedDetail post={post} related={related} /> : null}
        {task === 'image' ? <ImageDetail post={post} related={related} /> : null}
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} related={related} /> : null}
        {task === 'article' ? <ArticleDetail post={post} related={related} comments={comments} /> : null}
      </main>
    </EditableSiteShell>
  )
}

function Kicker({ task, children }: { task: TaskKey; children?: React.ReactNode }) {
  const theme = getTaskTheme(task)
  return (
    <div className="editable-mono flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-[var(--tk-accent)]">
      <span>{theme.kicker}</span>
      {children ? <><span className="opacity-40">/</span><span className="text-[var(--tk-muted)]">{children}</span></> : null}
    </div>
  )
}

function BackLink({ task }: { task: TaskKey }) {
  const label = displayLabel(task)
  return (
    <Link href={getTaskConfig(task)?.route || '/'} className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--tk-muted)] transition hover:text-[var(--tk-text)]">
      <ArrowLeft className="h-4 w-4" /> Back to {label.toLowerCase()}
    </Link>
  )
}

/* ============================ Shared detail-layout blocks ============================ */
/*  Utility bar → Marquee cover → Facts strip → Section jump-nav →                       */
/*  Dossier rail + magazine article → Floating action dock → Related snap-rail          */

function DetailUtilityBar({ task, title }: { task: TaskKey; title: string }) {
  const label = displayLabel(task)
  const route = getTaskConfig(task)?.route || '/'
  return (
    <div className="border-b border-[var(--tk-line)] bg-black/25 backdrop-blur-md">
      <div className="mx-auto flex max-w-[var(--editable-container)] items-center justify-between gap-4 px-5 py-3.5 sm:px-8 lg:px-12">
        <nav aria-label="Breadcrumb" className="editable-mono flex min-w-0 items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] text-[var(--tk-muted)]">
          <Link href="/" className="inline-flex items-center gap-1.5 transition hover:text-white">
            <Home className="h-3 w-3" /> Home
          </Link>
          <ChevronRight className="h-3 w-3 opacity-40" />
          <Link href={route} className="transition hover:text-white">{label}</Link>
          <ChevronRight className="h-3 w-3 opacity-40" />
          <span className="min-w-0 flex-1 truncate text-white/85 normal-case tracking-normal">{title}</span>
        </nav>
        <div className="flex shrink-0 items-center gap-1.5">
          <UtilityAction icon={Share2} label="Share" />
          <UtilityAction icon={Bookmark} label="Save" />
        </div>
      </div>
    </div>
  )
}

function UtilityAction({ icon: Icon, label }: { icon: typeof Share2; label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--tk-line)] bg-white/[0.03] text-white/70 transition hover:border-[var(--tk-accent)] hover:text-[var(--tk-accent)]"
    >
      <Icon className="h-4 w-4" />
    </button>
  )
}

function FactsStrip({ items }: { items: Array<{ icon: typeof MapPin; label: string; value: string }> }) {
  const visible = items.filter((item) => item.value)
  if (!visible.length) return null
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {visible.map((item, i) => {
        const Icon = item.icon
        return (
          <div key={i} className="rounded-2xl border border-[var(--tk-line)] bg-white/[0.03] p-5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]">
              <Icon className="h-4 w-4" />
            </span>
            <p className="editable-mono mt-5 text-[10px] uppercase tracking-[0.14em] text-[var(--tk-muted)]">{item.label}</p>
            <p className="mt-1.5 line-clamp-1 text-sm font-semibold text-white">{item.value}</p>
          </div>
        )
      })}
    </div>
  )
}

function SectionNav({ items }: { items: Array<{ id: string; label: string }> }) {
  return (
    <div className="sticky top-[72px] z-30 border-y border-[var(--tk-line)] bg-[var(--tk-bg)]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-[var(--editable-container)] items-center gap-1.5 overflow-x-auto px-5 py-3 sm:px-8 lg:px-12">
        {items.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="editable-mono shrink-0 rounded-full border border-transparent px-4 py-1.5 text-[11px] uppercase tracking-[0.16em] text-white/70 transition hover:border-[var(--tk-line)] hover:bg-white/[0.03] hover:text-white"
          >
            {section.label}
          </a>
        ))}
      </div>
    </div>
  )
}

function DossierTile({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[var(--tk-line)] bg-[var(--tk-surface)] p-5">
      <p className="editable-mono text-[10px] uppercase tracking-[0.16em] text-[var(--tk-accent)]">{label}</p>
      <div className="mt-3">{children}</div>
    </div>
  )
}

function DossierRow({ icon: Icon, label, value, href, external }: { icon: typeof MapPin; label: string; value: string; href?: string; external?: boolean }) {
  const inner = (
    <div className="group/row flex items-start gap-3 rounded-xl border border-transparent px-2 py-2 transition hover:border-[var(--tk-line)] hover:bg-white/[0.03]">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--tk-accent)]" />
      <div className="min-w-0 flex-1">
        <p className="editable-mono text-[9px] uppercase tracking-[0.14em] text-[var(--tk-muted)]">{label}</p>
        <p className="mt-1 break-words text-sm font-medium text-white">{value}</p>
      </div>
    </div>
  )
  if (!href) return inner
  return (
    <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined} className="block">
      {inner}
    </a>
  )
}

type DockAction = { label: string; href: string; icon: typeof ArrowUpRight; download?: boolean; external?: boolean }

function FloatingActionDock({ primary, secondary }: { primary?: DockAction; secondary?: DockAction }) {
  if (!primary && !secondary) return null
  const render = (action: DockAction, variant: 'primary' | 'secondary') => (
    <a
      href={action.href}
      target={action.external ? '_blank' : undefined}
      rel={action.external ? 'noreferrer' : undefined}
      download={action.download ? true : undefined}
      className={
        variant === 'primary'
          ? 'inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent)] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--tk-on-accent)] transition hover:brightness-110'
          : 'inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.02] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-white transition hover:border-[var(--tk-accent)] hover:text-[var(--tk-accent)]'
      }
    >
      {variant === 'primary' ? (
        <>{action.label} <action.icon className="h-3.5 w-3.5" /></>
      ) : (
        <><action.icon className="h-3.5 w-3.5" /> {action.label}</>
      )}
    </a>
  )
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 sm:bottom-6 lg:justify-end lg:pr-8">
      <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-[var(--tk-line)] bg-[var(--tk-bg)]/95 p-1.5 shadow-[0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl">
        {secondary ? render(secondary, 'secondary') : null}
        {primary ? render(primary, 'primary') : null}
      </div>
    </div>
  )
}

function SectionHeading({ id, kicker, title }: { id: string; kicker: string; title: string }) {
  return (
    <div id={id} className="scroll-mt-[160px]">
      <p className="editable-mono text-[10px] uppercase tracking-[0.16em] text-[var(--tk-accent)]">{kicker}</p>
      <h2 className="editable-display mt-3 text-3xl font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[38px]">{title}</h2>
    </div>
  )
}

/* ============================ ARTICLE ============================ */
function ArticleDetail({ post, related, comments }: { post: SitePost; related: SitePost[]; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const images = getImages(post)
  return (
    <>
      <article className="mx-auto max-w-4xl px-5 py-14 sm:px-8 sm:py-24">
        <BackLink task="article" />
        <p className="editable-mono mt-12 text-[11px] uppercase tracking-[0.16em] text-[var(--tk-accent)]">{categoryOf(post, 'Story')}</p>
        <h1 className="editable-display mt-5 text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.035em] sm:text-5xl lg:text-[64px]">{post.title}</h1>
        <div className="mt-6 flex items-center gap-3 text-sm text-[var(--tk-muted)]">
          <span>{SITE_CONFIG.name}</span>
        </div>
        {images[0] ? <img src={images[0]} alt="" className="mt-12 aspect-[16/9] w-full rounded-3xl border border-[var(--tk-line)] object-cover" /> : null}
        <BodyContent post={post} />
        <TagStrip tags={tagsOf(post)} />
        <EditableArticleComments slug={post.slug} comments={comments} />
      </article>
      <RelatedStrip task="article" related={related} />
    </>
  )
}

/* ============================ LISTING ============================ */
function ListingDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const hero = images[0]
  const address = getField(post, ['address', 'location', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  const hours = getField(post, ['hours', 'openingHours', 'timings'])
  const mapSrc = mapSrcFor(post)
  const category = getField(post, ['category'])
  const primaryAction: DockAction | undefined = website
    ? { label: 'Visit website', href: website, icon: ArrowUpRight, external: true }
    : phone
      ? { label: 'Call now', href: `tel:${phone}`, icon: Phone }
      : email
        ? { label: 'Email', href: `mailto:${email}`, icon: Mail }
        : undefined
  const secondaryAction: DockAction | undefined =
    primaryAction && phone && primaryAction.label !== 'Call now'
      ? { label: 'Call', href: `tel:${phone}`, icon: Phone }
      : primaryAction && email && primaryAction.label !== 'Email'
        ? { label: 'Email', href: `mailto:${email}`, icon: Mail }
        : undefined
  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'details', label: 'Details' },
    ...(mapSrc || images.length > 1 ? [{ id: 'preview', label: 'Preview' }] : []),
    { id: 'related', label: 'Related' },
  ]

  return (
    <>
      <DetailUtilityBar task="listing" title={post.title} />

      {/* Marquee cover — asymmetric split */}
      <section className="mx-auto max-w-[var(--editable-container)] px-5 pt-10 pb-14 sm:px-8 sm:pt-16 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div className="min-w-0">
            <Kicker task="listing">{category || 'Verified entry'}</Kicker>
            <h1 className="editable-display mt-6 text-balance text-[40px] font-semibold leading-[1.02] tracking-[-0.04em] sm:text-6xl lg:text-[80px]">
              {post.title}
            </h1>
            {leadText(post) ? (
              <p className="mt-7 max-w-xl text-lg leading-[1.55] text-[var(--tk-muted)] sm:text-xl">{leadText(post)}</p>
            ) : null}
            {primaryAction ? (
              <div className="mt-9 flex flex-wrap gap-3">
                <a
                  href={primaryAction.href}
                  target={primaryAction.external ? '_blank' : undefined}
                  rel={primaryAction.external ? 'noreferrer' : undefined}
                  className={dc.button.primary}
                >
                  {primaryAction.label} <primaryAction.icon className="h-4 w-4" />
                </a>
                {secondaryAction ? (
                  <a href={secondaryAction.href} className={dc.button.secondary}>
                    <secondaryAction.icon className="h-4 w-4" /> {secondaryAction.label}
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>

          {hero ? (
            <div className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-[var(--tk-line)] bg-[var(--tk-raised)]">
                <img src={hero} alt="" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_60%,rgba(15,15,14,0.35))]" />
                <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/45 px-3.5 py-1.5 editable-mono text-[10px] uppercase tracking-[0.16em] text-white backdrop-blur">
                  <ShieldCheck className="h-3 w-3 text-[var(--tk-accent)]" /> Verified
                </span>
              </div>
            </div>
          ) : (
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-[var(--tk-line)] bg-[var(--tk-surface)]">
              <div className="absolute inset-0 flex items-center justify-center">
                <MapPin className="h-16 w-16 text-[var(--tk-muted)]" />
              </div>
            </div>
          )}
        </div>

        {/* Facts strip — 4 chip-tiles */}
        <div className="mt-14">
          <FactsStrip
            items={[
              { icon: MapPin, label: 'Address', value: address },
              { icon: Phone, label: 'Phone', value: phone },
              { icon: Clock, label: 'Hours', value: hours || 'By appointment' },
              { icon: ShieldCheck, label: 'Status', value: 'Verified entry' },
            ]}
          />
        </div>
      </section>

      <SectionNav items={sections} />

      {/* Reading area — dossier rail + magazine feature */}
      <section className="mx-auto max-w-[var(--editable-container)] px-5 pb-24 sm:px-8 lg:px-12">
        <div className="mt-14 grid gap-12 lg:grid-cols-[300px_minmax(0,1fr)]">
          {/* Dossier rail */}
          <aside className="min-w-0 lg:sticky lg:top-[140px] lg:self-start">
            <div className="space-y-4">
              <DossierTile label="Contact">
                <div className="grid gap-1">
                  {address ? <DossierRow icon={MapPin} label="Address" value={address} /> : null}
                  {phone ? <DossierRow icon={Phone} label="Phone" value={phone} href={`tel:${phone}`} /> : null}
                  {email ? <DossierRow icon={Mail} label="Email" value={email} href={`mailto:${email}`} /> : null}
                  {website ? <DossierRow icon={Globe2} label="Website" value={website} href={website} external /> : null}
                  {hours ? <DossierRow icon={Clock} label="Hours" value={hours} /> : null}
                </div>
              </DossierTile>

              <DossierTile label="Why trust this entry">
                <ul className="grid gap-3">
                  {[
                    { label: 'Verified location', copy: 'Address and hours checked by our team.' },
                    { label: 'Direct contact', copy: 'Reach the entry — no middle-layer forms.' },
                    { label: 'Community-vetted', copy: 'Feedback from neighbours keeps it honest.' },
                  ].map((item) => (
                    <li key={item.label} className="flex items-start gap-2.5">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--tk-accent)]" />
                      <div>
                        <p className="text-sm font-semibold text-white">{item.label}</p>
                        <p className="mt-1 text-xs leading-5 text-[var(--tk-muted)]">{item.copy}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </DossierTile>

              <div>
                <Ads slot="sidebar" size={pickRandom(getSlotSizes('sidebar'))} showLabel />
              </div>
            </div>
          </aside>

          {/* Article column */}
          <div className="min-w-0 space-y-16">
            <div>
              <SectionHeading id="overview" kicker="[ 01 ] Overview" title="At a glance" />
              <p className="mt-6 max-w-3xl text-lg leading-[1.65] text-[var(--tk-muted)] sm:text-xl">
                {leadText(post) || `${post.title} sits inside the ${displayLabel('listing').toLowerCase()} — verified for the details that matter before you visit.`}
              </p>
              <div className="mt-8 flex flex-wrap gap-2">
                {[
                  category ? `#${category}` : null,
                  address ? '#neighbourhood' : null,
                  hours ? '#hours-listed' : null,
                  '#verified',
                ].filter(Boolean).map((chip) => (
                  <span key={chip as string} className="editable-mono rounded-full border border-[var(--tk-line)] bg-white/[0.03] px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-white/80">
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <SectionHeading id="details" kicker="[ 02 ] Details" title="The full record" />
              <BodyContent post={post} />
              <TagStrip tags={tagsOf(post)} />
            </div>

            {(mapSrc || images.length > 1) ? (
              <div>
                <SectionHeading id="preview" kicker="[ 03 ] Preview" title="See it before you go" />
                {images.length > 1 ? (
                  <ImageStrip images={images.slice(1)} label="Gallery" />
                ) : null}
                {mapSrc ? (
                  <div className="mt-10 overflow-hidden rounded-3xl border border-[var(--tk-line)] bg-[var(--tk-surface)]">
                    <div className="flex items-center gap-2 border-b border-[var(--tk-line)] bg-black/20 px-5 py-3">
                      <MapPin className="h-4 w-4 text-[var(--tk-accent)]" />
                      <span className="editable-mono text-[11px] uppercase tracking-[0.16em] text-white/80">{address || 'Map view'}</span>
                    </div>
                    <iframe src={mapSrc} title="Map" loading="lazy" className="h-[440px] w-full border-0" />
                  </div>
                ) : null}
              </div>
            ) : null}

            <div id="related" className="scroll-mt-[160px]">
              <RelatedStrip task="listing" related={related} inline />
            </div>
          </div>
        </div>
      </section>

      <FloatingActionDock primary={primaryAction} secondary={secondaryAction} />
    </>
  )
}

/* ============================ CLASSIFIED ============================ */
function ClassifiedDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'availability', 'type'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  return (
    <>
      <section className="mx-auto grid max-w-[var(--editable-container)] gap-12 px-5 py-14 sm:px-8 sm:py-24 lg:grid-cols-[400px_minmax(0,1fr)] lg:px-12">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <BackLink task="classified" />
          <div className="mt-8 rounded-3xl border border-[var(--tk-line)] bg-[var(--tk-surface)] p-8">
            <Kicker task="classified">Offer</Kicker>
            <h1 className="editable-display mt-5 text-3xl font-semibold leading-[1.1] tracking-[-0.03em]">{post.title}</h1>
            <p className="editable-display mt-6 text-5xl font-semibold tracking-[-0.04em] text-[var(--tk-accent)]">{price || 'Open offer'}</p>
            <div className="mt-6 space-y-2.5">
              {condition ? <BadgeLine label="Condition" value={condition} /> : null}
              {location ? <BadgeLine label="Location" value={location} /> : null}
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              {phone ? <a href={`tel:${phone}`} className={dc.button.primary}><Phone className="h-4 w-4" /> Call</a> : null}
              {email ? <a href={`mailto:${email}`} className={dc.button.secondary}><Mail className="h-4 w-4" /> Email</a> : null}
            </div>
          </div>
        </aside>
        <article className="min-w-0">
          <ImageStrip images={images} label="Photos" large />
          <BodyContent post={post} />
          <TagStrip tags={tagsOf(post)} />
          {website ? (
            <Link href={website} target="_blank" rel="noreferrer" className={`${dc.button.primary} mt-10`}>Open the listing <ArrowUpRight className="h-4 w-4" /></Link>
          ) : null}
        </article>
      </section>
      <RelatedStrip task="classified" related={related} />
    </>
  )
}

/* ============================ IMAGE ============================ */
function ImageDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const gallery = images.length ? images : ['/placeholder.svg?height=900&width=1200']
  return (
    <>
      <section className="mx-auto max-w-[var(--editable-container)] px-5 py-14 sm:px-8 sm:py-24 lg:px-12">
        <BackLink task="image" />
        <div className="mt-10 grid gap-12 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="columns-1 gap-6 [column-fill:_balance] sm:columns-2">
            {gallery.map((image, index) => (
              <figure key={`${image}-${index}`} className="mb-6 break-inside-avoid overflow-hidden rounded-3xl border border-[var(--tk-line)] bg-[var(--tk-surface)]">
                <img src={image} alt="" className="w-full object-cover" />
              </figure>
            ))}
          </div>
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className={dc.badge.accentPill}><Camera className="h-3 w-3" /> Visual story</div>
            <h1 className="editable-display mt-6 text-4xl font-semibold leading-[1.05] tracking-[-0.035em] sm:text-5xl">{post.title}</h1>
            {leadText(post) ? <p className="mt-6 text-lg leading-[1.6] text-[var(--tk-muted)]">{leadText(post)}</p> : null}
            <BodyContent post={post} compact />
            <TagStrip tags={tagsOf(post)} />
          </aside>
        </div>
      </section>
      <RelatedStrip task="image" related={related} />
    </>
  )
}

/* ============================ BOOKMARK ============================ */
function BookmarkDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <>
      <article className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-24">
        <BackLink task="sbm" />
        <div className="mt-12 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]"><Bookmark className="h-7 w-7" /></div>
        <div className="mt-8"><Kicker task="sbm">Saved resource</Kicker></div>
        <h1 className="editable-display mt-5 text-4xl font-semibold leading-[1.05] tracking-[-0.035em] sm:text-5xl">{post.title}</h1>
        {leadText(post) ? <p className="mt-8 text-lg leading-[1.6] text-[var(--tk-muted)]">{leadText(post)}</p> : null}
        {website ? (
          <Link href={website} target="_blank" rel="noreferrer" className={`${dc.button.primary} mt-10`}>
            Open resource <ExternalLink className="h-4 w-4" />
          </Link>
        ) : null}
        <BodyContent post={post} />
        <TagStrip tags={tagsOf(post)} />
      </article>
      <RelatedStrip task="sbm" related={related} />
    </>
  )
}

/* ============================ PDF (Reference Library) ============================ */
async function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  const filename = getField(post, ['filename', 'fileName']) || `${post.slug || 'reference'}.file`
  // Prefer the post's declared size; otherwise HEAD the file to read Content-Length.
  const declaredSize = getField(post, ['fileSize', 'size'])
  const resolvedSize = declaredSize || (fileUrl ? await fetchRemoteFileSize(fileUrl) : '')
  const fileSize = resolvedSize || '—'
  const category = categoryOf(post, 'Reference')
  const uploader = getField(post, ['uploader', 'author']) || SITE_CONFIG.name
  const inside = [
    'What it covers, in one page',
    'The core reference material',
    'Field-tested checklists and worksheets',
    'Where to go next',
  ]
  const primaryAction: DockAction | undefined = fileUrl
    ? { label: 'Download file', href: fileUrl, icon: Download, download: true }
    : undefined
  const secondaryAction: DockAction | undefined = fileUrl
    ? { label: 'Open', href: fileUrl, icon: ExternalLink, external: true }
    : undefined
  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'details', label: 'Details' },
    ...(fileUrl ? [{ id: 'preview', label: 'Preview' }] : []),
    { id: 'related', label: 'Related' },
  ]

  return (
    <>
      <DetailUtilityBar task="pdf" title={post.title} />

      {/* Marquee cover — kicker + huge H1 + vertical file spine */}
      <section className="mx-auto max-w-[var(--editable-container)] px-5 pt-10 pb-14 sm:px-8 sm:pt-16 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="min-w-0">
            <Kicker task="pdf">{category}</Kicker>
            <h1 className="editable-display mt-6 text-balance text-[42px] font-semibold leading-[0.98] tracking-[-0.045em] sm:text-7xl lg:text-[96px]">
              {post.title}
            </h1>
            {leadText(post) ? (
              <p className="mt-8 max-w-2xl text-lg leading-[1.55] text-[var(--tk-muted)] sm:text-xl">{leadText(post)}</p>
            ) : null}
            {primaryAction ? (
              <div className="mt-10 flex flex-wrap gap-3">
                <a href={primaryAction.href} download className={dc.button.primary}>
                  {primaryAction.label} <primaryAction.icon className="h-4 w-4" />
                </a>
                {secondaryAction ? (
                  <a href={secondaryAction.href} target="_blank" rel="noreferrer" className={dc.button.secondary}>
                    Open in new tab <secondaryAction.icon className="h-4 w-4" />
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>

          {/* Vertical file spine — big display glyph, not an image */}
          <div className="relative">
            <div className="relative aspect-[3/4] overflow-hidden rounded-3xl border border-[var(--tk-line)] bg-[linear-gradient(180deg,rgba(136,239,86,0.06),rgba(15,15,14,0.4))]">
              <div className="absolute inset-0 flex flex-col justify-between p-7 sm:p-8">
                <div>
                  <span className="editable-mono inline-flex items-center gap-2 rounded-full border border-[var(--tk-accent)]/40 bg-[var(--tk-accent-soft)] px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-[var(--tk-accent)]">
                    <FileText className="h-3 w-3" /> Reference file
                  </span>
                  <p className="editable-mono mt-6 text-[10px] uppercase tracking-[0.16em] text-white/60">Filename</p>
                  <p className="mt-1 break-all text-sm font-medium text-white">{filename}</p>
                </div>
                <div className="editable-display leading-none text-[24vw] font-semibold tracking-[-0.06em] text-[var(--tk-accent)] sm:text-[14vw] lg:text-[10vw]">
                  .file
                </div>
                <div className="grid grid-cols-2 gap-3">
                  
                  <SpineFact label="File size" value={fileSize} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Facts strip — 4 chip-tiles below marquee */}
        <div className="mt-14">
          <FactsStrip
            items={[
              { icon: Layers, label: 'File size', value: fileSize },
              { icon: Bookmark, label: 'Format', value: 'Portable file' },
              { icon: ShieldCheck, label: 'Category', value: category },
            ]}
          />
        </div>
      </section>

      <SectionNav items={sections} />

      {/* Reading area — dossier rail + article */}
      <section className="mx-auto max-w-[var(--editable-container)] px-5 pb-24 sm:px-8 lg:px-12">
        <div className="mt-14 grid gap-12 lg:grid-cols-[300px_minmax(0,1fr)]">
          {/* Dossier rail */}
          <aside className="min-w-0 lg:sticky lg:top-[140px] lg:self-start">
            <div className="space-y-4">
              <DossierTile label="File identity">
                <div className="grid gap-3">
                  {[
                    ['Filename', filename],
                    ['Category', category],
                 
                    ['File size', fileSize],
                    ['Uploaded by', uploader],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-start justify-between gap-3 border-t border-[var(--tk-line)] pt-3 first:border-t-0 first:pt-0">
                      <span className="editable-mono text-[9px] uppercase tracking-[0.14em] text-[var(--tk-muted)]">{label}</span>
                      <span className="min-w-0 flex-1 break-words text-right text-sm font-medium text-white">{value}</span>
                    </div>
                  ))}
                </div>
              </DossierTile>

              <DossierTile label="What is inside">
                <ul className="grid gap-2.5 text-sm text-[var(--tk-muted)]">
                  {inside.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <Layers className="mt-0.5 h-4 w-4 shrink-0 text-[var(--tk-accent)]" /> <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </DossierTile>

              <DossierTile label="Take it with you">
                <p className="text-sm leading-[1.6] text-[var(--tk-muted)]">
                  Download once, mark it up, and pass it to whoever needs it next.
                </p>
                {fileUrl ? (
                  <a href={fileUrl} download className={`${dc.button.primary} mt-5 w-full`}>
                    Download file <Download className="h-4 w-4" />
                  </a>
                ) : null}
              </DossierTile>
            </div>
          </aside>

          {/* Article column — no <img> anywhere in this column */}
          <div className="min-w-0 space-y-16">
            <div>
              <SectionHeading id="overview" kicker="[ 01 ] Overview" title="Why this reference exists" />
              {leadText(post) ? (
                <blockquote className="mt-8 border-l-2 border-[var(--tk-accent)] pl-6">
                  <p className="editable-display text-2xl font-medium leading-[1.35] tracking-[-0.02em] text-white/85 sm:text-3xl">
                    “{leadText(post)}”
                  </p>
                </blockquote>
              ) : null}
            </div>

            <div>
              <SectionHeading id="details" kicker="[ 02 ] Details" title="Inside the reference" />
              <BodyContent post={post} />
              <TagStrip tags={tagsOf(post)} />
            </div>

            {fileUrl ? (
              <div>
                <SectionHeading id="preview" kicker="[ 03 ] Preview" title="Read it right here" />
                <div className="mt-8 overflow-hidden rounded-3xl border border-[var(--tk-line)] bg-[var(--tk-raised)]">
                  <div className="flex items-center justify-between gap-3 border-b border-[var(--tk-line)] bg-[var(--tk-surface)] px-6 py-4">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-[var(--tk-accent)]" />
                      <span className="editable-mono text-[11px] uppercase tracking-[0.16em] text-[var(--tk-muted)]">Live preview · {filename}</span>
                    </div>
                    <a href={fileUrl} download className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent)] px-4 py-2 text-xs font-semibold text-[var(--tk-on-accent)] transition hover:brightness-110">
                      Download <Download className="h-3.5 w-3.5" />
                    </a>
                  </div>
                  <iframe src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`} title={post.title} className="h-[82vh] w-full bg-[var(--tk-raised)]" />
                </div>

                {/* Repeated CTA callout below preview */}
                <div className="mt-10 flex flex-col items-start justify-between gap-6 rounded-3xl border border-[var(--tk-line)] bg-[var(--tk-surface)] p-8 sm:flex-row sm:items-center">
                  <div>
                    <p className="editable-mono text-[11px] uppercase tracking-[0.16em] text-[var(--tk-accent)]">Keep this on hand</p>
                    <p className="editable-display mt-3 text-2xl font-semibold tracking-[-0.02em] text-white">Take it offline in one click.</p>
                  </div>
                  <a href={fileUrl} download className={dc.button.primary}>
                    Download file <Download className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ) : null}

            {/* Article-bottom ad — before related strip */}
            <div>
              <Ads slot="article-bottom" size={pickRandom(getSlotSizes('article-bottom'))} showLabel />
            </div>

            <div id="related" className="scroll-mt-[160px]">
              <PdfRelatedRail related={related} />
            </div>
          </div>
        </div>
      </section>

      <FloatingActionDock primary={primaryAction} secondary={secondaryAction} />
    </>
  )
}

function SpineFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/25 px-3 py-2 backdrop-blur">
      <p className="editable-mono text-[9px] uppercase tracking-[0.14em] text-white/60">{label}</p>
      <p className="mt-0.5 truncate text-sm font-semibold text-white">{value}</p>
    </div>
  )
}

/* ============================ PROFILE ============================ */
function ProfileDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  return (
    <>
      <section className="mx-auto max-w-[var(--editable-container)] px-5 py-14 sm:px-8 sm:py-24 lg:px-12">
        <BackLink task="profile" />
        <div className="mt-10 grid gap-12 lg:grid-cols-[380px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl border border-[var(--tk-line)] bg-[var(--tk-surface)] p-8 text-center">
              <div className="mx-auto flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border border-[var(--tk-line)] bg-[var(--tk-raised)]">
                {images[0] ? <img src={images[0]} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-14 w-14 text-[var(--tk-muted)]" />}
              </div>
              <h1 className="editable-display mt-6 text-2xl font-semibold tracking-[-0.02em]">{post.title}</h1>
              {role ? <p className="mt-2 editable-mono text-[11px] uppercase tracking-[0.16em] text-[var(--tk-accent)]">{role}</p> : null}
              <div className="mt-6 flex flex-col gap-3">
                {website ? <Link href={website} target="_blank" rel="noreferrer" className={dc.button.primary}>Website <ExternalLink className="h-4 w-4" /></Link> : null}
                {email ? <a href={`mailto:${email}`} className={dc.button.secondary}>Email <Mail className="h-4 w-4" /></a> : null}
              </div>
            </div>
          </aside>
          <article className="min-w-0">
            <Kicker task="profile">Profile</Kicker>
            <BodyContent post={post} />
            <ImageStrip images={images.slice(1)} label="Gallery" />
            <TagStrip tags={tagsOf(post)} />
          </article>
        </div>
      </section>
      <RelatedStrip task="profile" related={related} />
    </>
  )
}

/* ============================ Shared blocks ============================ */

function BodyContent({ post, compact = false }: { post: SitePost; compact?: boolean }) {
  return (
    <div
      className={`article-content mt-10 max-w-none text-[var(--tk-text)] ${compact ? 'text-[15px] leading-[1.65]' : 'text-[17px] leading-[1.75]'}`}
      dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }}
    />
  )
}

function TagStrip({ tags }: { tags: string[] }) {
  if (!tags.length) return null
  return (
    <div className="mt-10 flex flex-wrap gap-2.5 border-t border-[var(--tk-line)] pt-8">
      <span className="editable-mono self-center text-[11px] uppercase tracking-[0.16em] text-[var(--tk-muted)]">Tagged</span>
      {tags.map((tag) => (
        <span key={tag} className="rounded-full border border-[var(--tk-line)] bg-white/[0.03] px-3.5 py-1.5 text-xs font-medium text-white/85">
          {tag}
        </span>
      ))}
    </div>
  )
}

function ImageStrip({ images, label, large = false }: { images: string[]; label: string; large?: boolean }) {
  if (!images.length) return null
  return (
    <section className="mt-14">
      <p className="editable-mono text-[11px] uppercase tracking-[0.16em] text-[var(--tk-muted)]">{label}</p>
      <div className={`mt-5 grid gap-4 ${large ? 'sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-3'}`}>
        {images.slice(0, large ? 4 : 6).map((image, index) => (
          <img key={`${image}-${index}`} src={image} alt="" className="aspect-[4/3] w-full rounded-2xl border border-[var(--tk-line)] object-cover" />
        ))}
      </div>
    </section>
  )
}

function BadgeLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--tk-line)] bg-[var(--tk-raised)] px-4 py-3 text-sm">
      <span className="editable-mono text-[11px] uppercase tracking-[0.14em] text-[var(--tk-muted)]">{label}</span>
      <span className="font-semibold text-white">{value}</span>
    </div>
  )
}

function RelatedStrip({ task, related, inline = false }: { task: TaskKey; related: SitePost[]; inline?: boolean }) {
  if (!related.length) return null
  const label = displayLabel(task)
  const route = getTaskConfig(task)?.route || '/'
  return (
    <section className={inline ? 'mt-24 border-t border-[var(--tk-line)] pt-16' : 'border-t border-[var(--tk-line)]'}>
      <div className={inline ? '' : 'mx-auto max-w-[var(--editable-container)] px-5 py-20 sm:px-8 lg:px-12'}>
        <div className="flex items-end justify-between">
          <div>
            <p className="editable-mono text-[11px] uppercase tracking-[0.16em] text-[var(--tk-accent)]">Keep exploring</p>
            <h2 className="editable-display mt-4 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">More from the {label.toLowerCase()}</h2>
          </div>
          <Link href={route} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--tk-accent)]">View all <ArrowUpRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item) => <RelatedCard key={item.id || item.slug} task={task} post={item} />)}
        </div>
      </div>
    </section>
  )
}

function RelatedCard({ task, post }: { task: TaskKey; post: SitePost }) {
  const image = getImages(post)[0]
  const href = `${getTaskConfig(task)?.route || `/${task}`}/${post.slug}`
  return (
    <Link href={href} className="group block overflow-hidden rounded-3xl border border-[var(--tk-line)] bg-[var(--tk-surface)] transition duration-500 hover:-translate-y-1 hover:border-[var(--tk-accent)]/40">
      <div className="aspect-[16/10] overflow-hidden bg-[var(--tk-raised)]">
        {image ? <img src={image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" /> : <div className="flex h-full items-center justify-center"><FileText className="h-8 w-8 text-[var(--tk-muted)]" /></div>}
      </div>
      <div className="p-6">
        <h3 className="editable-display line-clamp-2 text-base font-semibold leading-[1.2] tracking-[-0.02em] text-white">{post.title}</h3>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--tk-muted)]">{stripHtml(summaryText(post))}</p>
      </div>
    </Link>
  )
}

/* Reference-library related — horizontal snap rail with dossier glyph tiles.
   No <img> tags — the article column stays image-free by design.            */
function PdfRelatedRail({ related }: { related: SitePost[] }) {
  if (!related.length) return null
  const route = getTaskConfig('pdf')?.route || '/pdf'
  return (
    <section>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="editable-mono text-[10px] uppercase tracking-[0.16em] text-[var(--tk-accent)]">[ 04 ] Related</p>
          <h2 className="editable-display mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-[38px]">
            More from the {displayLabel('pdf').toLowerCase()}
          </h2>
        </div>
        <Link href={route} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--tk-accent)]">
          View all <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-8 -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 sm:-mx-8 sm:px-8 lg:mx-0 lg:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {related.map((item) => {
          const href = `${route}/${item.slug}`
          const size = getField(item, ['fileSize', 'size']) || '—'
          const itemPages = getField(item, ['pages', 'pageCount']) || '—'
          const itemCategory = categoryOf(item, 'Reference')
          return (
            <Link
              key={item.id || item.slug}
              href={href}
              className="group flex w-[280px] shrink-0 snap-start flex-col rounded-3xl border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6 transition duration-500 hover:-translate-y-1 hover:border-[var(--tk-accent)]/45 sm:w-[320px]"
            >
              <div className="editable-display flex h-32 w-full items-center justify-center rounded-2xl border border-[var(--tk-line)] bg-[linear-gradient(180deg,rgba(136,239,86,0.06),rgba(15,15,14,0.4))] text-5xl font-semibold text-[var(--tk-accent)]">
                .ref
              </div>
              <span className="editable-mono mt-5 text-[10px] uppercase tracking-[0.14em] text-[var(--tk-muted)]">{itemCategory}</span>
              <h3 className="editable-display mt-2 line-clamp-2 text-base font-semibold leading-[1.2] tracking-[-0.02em] text-white">
                {item.title}
              </h3>
              <div className="mt-4 flex items-center gap-2">
                <span className="editable-mono rounded-full border border-[var(--tk-line)] bg-white/[0.03] px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-white/70">
                  {itemPages} pp
                </span>
                <span className="editable-mono rounded-full border border-[var(--tk-line)] bg-white/[0.03] px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-white/70">
                  {size}
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
