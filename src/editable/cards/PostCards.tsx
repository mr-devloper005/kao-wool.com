import Link from 'next/link'
import { ArrowUpRight, Circle } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'

export function getEditablePostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const images = Array.isArray(content.images) ? content.images : []
  const contentImage = images.find((url): url is string => typeof url === 'string' && Boolean(url))
  const logo = typeof content.logo === 'string' ? content.logo : ''
  return mediaUrl || contentImage || logo || '/placeholder.svg?height=900&width=1400'
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    post?.summary ||
    ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

export function getEditableCategory(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Featured'
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

/* -------------------------------------------------------------------------- */
/*  EditorialFeatureCard — hero-style tall card with big image + gradient      */
/* -------------------------------------------------------------------------- */

export function EditorialFeatureCard({ post, href, label = 'Featured' }: { post: SitePost; href: string; label?: string }) {
  return (
    <Link href={href} className={`group relative block min-w-0 overflow-hidden ${dc.surface.dark} ${dc.motion.lift}`}>
      <div className="relative min-h-[540px] lg:min-h-[640px]">
        <img
          src={getEditablePostImage(post)}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover opacity-70 transition duration-700 group-hover:scale-[1.04] group-hover:opacity-80"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,15,14,0.15)_0%,rgba(15,15,14,0.6)_55%,rgba(15,15,14,0.95)_100%)]" />
        <div className="relative z-10 flex h-full min-h-[540px] flex-col justify-end p-7 sm:p-10 lg:min-h-[640px] lg:p-14">
          <span className={dc.badge.accentPill}>
            <span className={dc.badge.dot} />{label}
          </span>
          <h3 className="editable-display mt-6 max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.04em] text-white sm:text-5xl lg:text-[64px]">
            {post.title}
          </h3>
          <p className="mt-5 max-w-2xl text-base leading-[1.7] text-white/75 sm:text-lg">
            {getEditableExcerpt(post, 200)}
          </p>
          <span className="mt-9 inline-flex w-fit items-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-6 py-3.5 text-sm font-semibold text-[var(--slot4-on-accent)] transition group-hover:brightness-110">
            Read entry <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}

/* -------------------------------------------------------------------------- */
/*  RailPostCard — horizontal scroll card                                      */
/* -------------------------------------------------------------------------- */

export function RailPostCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group ${dc.layout.minRailCard} block overflow-hidden ${dc.surface.card} ${dc.motion.lift}`}>
      <div className={`${dc.media.frame} ${dc.media.ratio}`}>
        <img src={getEditablePostImage(post)} alt={post.title} className={`absolute inset-0 h-full w-full object-cover ${dc.motion.zoom}`} />
        <span className={`absolute left-4 top-4 ${dc.badge.pill}`}>
          <span className={dc.badge.dot} /> No. {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <div className="p-6">
        <p className={dc.type.eyebrow}>{getEditableCategory(post)}</p>
        <h3 className="editable-display mt-4 line-clamp-2 text-xl font-semibold leading-[1.15] tracking-[-0.025em] text-white">
          {post.title}
        </h3>
        <p className={`mt-3 line-clamp-3 text-sm leading-[1.6] ${pal.mutedText}`}>{getEditableExcerpt(post, 130)}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--slot4-accent)]">
          Open <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  )
}

/* -------------------------------------------------------------------------- */
/*  CompactIndexCard — index-style row                                         */
/* -------------------------------------------------------------------------- */

export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group block min-w-0 ${dc.surface.soft} p-6 ${dc.motion.lift}`}>
      <div className="flex items-start gap-5">
        <span className="editable-mono flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[var(--slot4-accent)]/30 bg-[var(--slot4-accent-soft)] text-xs font-semibold text-[var(--slot4-accent)]">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="min-w-0">
          <p className="editable-mono flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--slot4-accent)]">
            <Circle className="h-2 w-2 fill-[var(--slot4-accent)]" /> {getEditableCategory(post)}
          </p>
          <h3 className="editable-display mt-3 line-clamp-2 text-lg font-semibold leading-[1.2] tracking-[-0.02em] text-white">
            {post.title}
          </h3>
          <p className={`mt-2 line-clamp-2 text-sm leading-[1.55] ${pal.mutedText}`}>{getEditableExcerpt(post, 110)}</p>
        </div>
      </div>
    </Link>
  )
}

/* -------------------------------------------------------------------------- */
/*  ArticleListCard — landscape media + text                                   */
/* -------------------------------------------------------------------------- */

export function ArticleListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link
      href={href}
      className={`group grid min-w-0 gap-6 overflow-hidden ${dc.surface.card} p-5 ${dc.motion.lift} sm:grid-cols-[260px_minmax(0,1fr)]`}
    >
      <div className={`${dc.media.frame} aspect-[4/3] sm:aspect-auto sm:min-h-[220px]`}>
        <img src={getEditablePostImage(post)} alt={post.title} className={`absolute inset-0 h-full w-full object-cover ${dc.motion.zoom}`} />
      </div>
      <div className="min-w-0 p-2 sm:py-4 sm:pr-4">
        <p className={dc.type.eyebrow}>Entry {String(index + 1).padStart(2, '0')}</p>
        <h2 className="editable-display mt-4 line-clamp-3 text-2xl font-semibold leading-[1.1] tracking-[-0.03em] text-white sm:text-3xl">
          {post.title}
        </h2>
        <p className={`mt-4 line-clamp-3 text-sm leading-[1.65] ${pal.mutedText}`}>{getEditableExcerpt(post, 200)}</p>
        <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--slot4-accent)]">
          Open entry <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}
