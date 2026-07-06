'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, CheckCircle2, FileText, ImageIcon, Lock, PlusCircle, Send, Sparkles } from 'lucide-react'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { taskLabel as displayLabel } from '@/editable/theme/task-themes'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'

const taskIcon: Record<string, typeof FileText> = {
  article: FileText,
  listing: Sparkles,
  classified: PlusCircle,
  image: ImageIcon,
  profile: Sparkles,
  pdf: FileText,
  sbm: PlusCircle,
}

const fieldClass =
  'w-full rounded-2xl border border-[var(--editable-border)] bg-white/[0.03] px-5 py-3.5 text-sm font-medium text-white outline-none transition placeholder:text-white/35 focus:border-[var(--slot4-accent)]'

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  const enabledTasks = useMemo(() => SITE_CONFIG.tasks.filter((task) => task.enabled), [])
  const [task, setTask] = useState<TaskKey>((enabledTasks[0]?.key || 'article') as TaskKey)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const activeTaskLabel = displayLabel(task)

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task,
      title: title.trim(),
      category: category.trim() || 'uncategorized',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle('')
    setCategory('')
    setSummary('')
    setUrl('')
    setImage('')
    setBody('')
  }

  if (!session) {
    return (
      <EditableSiteShell>
        <main className="editable-accent-halo relative min-h-screen py-24 sm:py-32">
          <section className={`${dc.shell.section}`}>
            <div className={`${dc.surface.card} grid gap-10 p-8 sm:p-14 md:grid-cols-[0.9fr_1.1fr]`}>
              <div className="flex h-full min-h-64 items-center justify-center rounded-3xl bg-[var(--slot4-dark-bg)]">
                <Lock className="h-20 w-20 text-[var(--slot4-accent)]/80" />
              </div>
              <div className="self-center">
                <div className={dc.badge.accentPill}><span className={dc.badge.dot} /> {pagesContent.create.locked.badge}</div>
                <h1 className="editable-display mt-8 text-4xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-5xl">
                  {pagesContent.create.locked.title}
                </h1>
                <p className="mt-6 max-w-xl text-base leading-[1.6] text-white/60">{pagesContent.create.locked.description}</p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <Link href="/login" className={dc.button.primary}>Sign in <ArrowUpRight className="h-4 w-4" /></Link>
                  <Link href="/signup" className={dc.button.secondary}>Create account</Link>
                </div>
              </div>
            </div>
          </section>
        </main>
      </EditableSiteShell>
    )
  }

  return (
    <EditableSiteShell>
      <main className="min-h-screen py-16 sm:py-24">
        <section className={dc.shell.section}>
          <div className={`${dc.surface.card} grid gap-10 p-6 sm:p-10 lg:grid-cols-[0.85fr_1.15fr]`}>
            <aside>
              <EditableReveal index={0}>
                <div className={dc.badge.accentPill}><span className={dc.badge.dot} /> {pagesContent.create.hero.badge}</div>
              </EditableReveal>
              <EditableReveal index={1}>
                <h1 className="editable-display mt-6 text-4xl font-semibold leading-[1.05] tracking-[-0.035em] sm:text-5xl">{pagesContent.create.hero.title}</h1>
              </EditableReveal>
              <EditableReveal index={2}>
                <p className="mt-6 text-base leading-[1.65] text-white/60">{pagesContent.create.hero.description}</p>
              </EditableReveal>

              <div className="mt-10 grid gap-3 sm:grid-cols-2">
                {enabledTasks.map((item, i) => {
                  const Icon = taskIcon[item.key] || FileText
                  const active = item.key === task
                  return (
                    <EditableReveal key={item.key} index={i}>
                      <button
                        type="button"
                        onClick={() => setTask(item.key as TaskKey)}
                        className={`w-full rounded-2xl border p-5 text-left transition ${
                          active
                            ? 'border-[var(--slot4-accent)] bg-[var(--slot4-accent-soft)] text-white'
                            : 'border-[var(--editable-border)] bg-white/[0.02] text-white/70 hover:border-white/25 hover:text-white'
                        }`}
                      >
                        <Icon className={`h-5 w-5 ${active ? 'text-[var(--slot4-accent)]' : ''}`} />
                        <span className="editable-display mt-4 block text-sm font-semibold">
                          {displayLabel(item.key as TaskKey)}
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-white/50">{item.description}</span>
                      </button>
                    </EditableReveal>
                  )
                })}
              </div>
            </aside>

            <form onSubmit={submit} className="rounded-3xl border border-[var(--editable-border)] bg-white/[0.02] p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="editable-mono text-[11px] uppercase tracking-[0.16em] text-[var(--slot4-accent)]">Submitting to {activeTaskLabel}</p>
                  <h2 className="editable-display mt-2 text-2xl font-semibold tracking-[-0.02em]">{pagesContent.create.formTitle}</h2>
                </div>
                <span className="editable-mono rounded-full border border-[var(--editable-border)] bg-white/[0.03] px-4 py-1.5 text-[11px] uppercase tracking-[0.16em] text-white/80">{session.name}</span>
              </div>

              <div className="mt-8 grid gap-4">
                <input className={fieldClass} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Entry title" required />
                <div className="grid gap-4 sm:grid-cols-2">
                  <input className={fieldClass} value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" />
                  <input className={fieldClass} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Website or source URL" />
                </div>
                <input className={fieldClass} value={image} onChange={(e) => setImage(e.target.value)} placeholder="Featured image URL" />
                <textarea className={`${fieldClass} min-h-24`} value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Short summary" required />
                <textarea className={`${fieldClass} min-h-48`} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Details, description, and body" required />
              </div>

              {created ? (
                <div className="mt-6 rounded-2xl border border-[var(--slot4-accent)]/40 bg-[var(--slot4-accent-soft)] p-5">
                  <p className="editable-mono flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--slot4-accent)]">
                    <CheckCircle2 className="h-4 w-4" /> {pagesContent.create.successTitle}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white">{created.title}</p>
                </div>
              ) : null}

              <button type="submit" className={`${dc.button.primary} mt-8 w-full`}>
                <Send className="h-4 w-4" /> {pagesContent.create.submitLabel}
              </button>
            </form>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
