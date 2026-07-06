import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Filter, Search as SearchIcon } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { taskLabel as displayLabel } from '@/editable/theme/task-themes'
import { Ads, getSlotSizes } from '@/lib/ads'

export const revalidate = 3

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')
const compactText = (value: unknown) => typeof value === 'string' ? stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase() : ''
const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const compactRaw = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const getImage = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.find((item) => typeof item?.url === 'string')?.url : ''
  const images = Array.isArray(content.images) ? content.images.find((item) => typeof item === 'string') as string | undefined : ''
  return media || compactRaw(content.featuredImage) || compactRaw(content.image) || compactRaw(content.thumbnail) || images || ''
}
const summaryOf = (post: SitePost) => {
  const raw = post.summary || compactRaw(getContent(post).description) || compactRaw(getContent(post).excerpt) || ''
  return stripHtml(raw).replace(/\s+/g, ' ').trim()
}

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [post.title, post.summary, content.description, content.body, content.excerpt, content.category, Array.isArray(post.tags) ? post.tags.join(' ') : '']
    .some((value) => compactText(value).includes(query))
}

function SearchResultCard({ post, index }: { post: SitePost; index: number }) {
  const task = getPostTaskKey(post) as TaskKey | null
  const taskRoute = SITE_CONFIG.tasks.find((item) => item.key === task)?.route
  const href = `${taskRoute || `/${task || 'article'}`}/${post.slug}`
  const image = getImage(post)
  const summary = summaryOf(post)
  const label = task ? displayLabel(task) : 'Result'
  const strong = index % 5 === 0

  return (
    <Link
      href={href}
      className={`group block overflow-hidden rounded-3xl border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] transition duration-500 hover:-translate-y-1 hover:border-[var(--slot4-accent)]/40 ${strong ? 'md:col-span-2' : ''}`}
    >
      {image ? (
        <div className={`relative overflow-hidden ${strong ? 'aspect-[16/7]' : 'aspect-[16/10]'}`}>
          <img src={image} alt="" className="h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-[1.04]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(15,15,14,0.85))]" />
          <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/50 px-3.5 py-1.5 editable-mono text-[11px] uppercase tracking-[0.16em] text-white backdrop-blur-md">
            {label}
          </span>
        </div>
      ) : null}
      <div className="p-6 sm:p-8">
        {!image ? (
          <span className="editable-mono inline-flex items-center rounded-full border border-[var(--slot4-accent)]/40 bg-[var(--slot4-accent-soft)] px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-[var(--slot4-accent)]">
            {label}
          </span>
        ) : null}
        <h2 className="editable-display mt-5 line-clamp-3 text-2xl font-semibold leading-[1.1] tracking-[-0.03em] text-white">{post.title}</h2>
        {summary ? <p className="mt-4 line-clamp-3 text-sm leading-[1.65] text-white/60">{summary}</p> : null}
        <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--slot4-accent)]">
          Open result <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}

export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }> }) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(useMaster ? 1000 : 300, useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined)
  const posts = feed?.posts?.length ? feed.posts : useMaster ? [] : SITE_CONFIG.tasks.filter((item) => item.enabled).flatMap((item) => getMockPostsForTask(item.key))
  const results = posts.filter((post) => matches(post, normalized, category, task)).slice(0, normalized ? 80 : 36)
  const enabledTasks = SITE_CONFIG.tasks.filter((item) => item.enabled)

  return (
    <EditableSiteShell>
      <main className="min-h-screen">
        <section className="editable-accent-halo relative border-b border-[var(--editable-border)] py-20 sm:py-24">
          <div className={dc.shell.section}>
            <EditableReveal index={0}>
              <div className={dc.badge.accentPill}>
                <span className={dc.badge.dot} /> {pagesContent.search.hero.badge}
              </div>
            </EditableReveal>
            <EditableReveal index={1}>
              <h1 className="editable-display mt-8 max-w-4xl text-balance text-[42px] font-semibold leading-[1.02] tracking-[-0.04em] sm:text-6xl lg:text-[76px]">
                {pagesContent.search.hero.title}
              </h1>
            </EditableReveal>
            <EditableReveal index={2}>
              <p className="mt-8 max-w-2xl text-lg leading-[1.6] text-white/60">{pagesContent.search.hero.description}</p>
            </EditableReveal>

            <EditableReveal index={3}>
              <form action="/search" className={`${dc.surface.card} mt-12 p-5 sm:p-6`}>
                <input type="hidden" name="master" value="1" />
                <label className="flex items-center gap-3 rounded-full border border-[var(--editable-border)] bg-white/[0.03] px-5 py-3">
                  <SearchIcon className="h-4 w-4 text-[var(--slot4-accent)]" />
                  <input name="q" defaultValue={query} placeholder={pagesContent.search.hero.placeholder} className="min-w-0 flex-1 bg-transparent text-sm font-medium text-white outline-none placeholder:text-white/40" />
                </label>
                <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                  <label className="flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-white/[0.03] px-4 py-2.5">
                    <Filter className="h-3.5 w-3.5 text-[var(--slot4-accent)]" />
                    <input name="category" defaultValue={category} placeholder="Category" className="min-w-0 flex-1 bg-transparent text-sm font-medium text-white outline-none placeholder:text-white/40" />
                  </label>
                  <select name="task" defaultValue={task} className="rounded-full border border-[var(--editable-border)] bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-white outline-none">
                    <option value="" className="bg-[var(--slot4-panel-bg)]">All shelves</option>
                    {enabledTasks.map((item) => (
                      <option key={item.key} value={item.key} className="bg-[var(--slot4-panel-bg)]">
                        {displayLabel(item.key as TaskKey)}
                      </option>
                    ))}
                  </select>
                  <button className={dc.button.primary} type="submit">Search <ArrowUpRight className="h-4 w-4" /></button>
                </div>
              </form>
            </EditableReveal>
          </div>
        </section>

        <section className="py-20 sm:py-24">
          <div className={dc.shell.section}>
            <EditableReveal index={0}>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="editable-mono text-[11px] uppercase tracking-[0.16em] text-[var(--slot4-accent)]">{results.length} {results.length === 1 ? 'result' : 'results'}</p>
                  <h2 className="editable-display mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
                    {query ? `Results for “${query}”` : pagesContent.search.resultsTitle}
                  </h2>
                </div>
                <Link href="/listing" className={dc.button.secondary}>Open the directory <ArrowUpRight className="h-4 w-4" /></Link>
              </div>
            </EditableReveal>

            {results.length ? (
              <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {results.map((post, index) => (
                  <EditableReveal key={post.id || post.slug} index={index % 6}>
                    <SearchResultCard post={post} index={index} />
                  </EditableReveal>
                ))}
              </div>
            ) : (
              <div className={`${dc.surface.soft} mt-10 p-12 text-center`}>
                <p className="editable-display text-2xl font-semibold tracking-[-0.02em]">No matching entries found.</p>
                <p className="mt-3 text-sm text-white/60">Try a different keyword, shelf, or category.</p>
              </div>
            )}

            {/* Footer ad slot */}
            <div className="mt-16">
              <Ads slot="footer" size={pickRandom(getSlotSizes('footer'))} showLabel />
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
