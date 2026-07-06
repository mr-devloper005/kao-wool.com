import Link from 'next/link'
import { ArrowUpRight, SearchX } from 'lucide-react'
import { cn } from '@/lib/utils'

type EmptyStateProps = {
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  className?: string
}

export function EmptyState({
  title = 'Nothing on the shelf yet',
  description = 'Fresh entries land here automatically as soon as they clear review.',
  actionLabel = 'Back home',
  actionHref = '/',
  className,
}: EmptyStateProps) {
  return (
    <section className={cn(
      'rounded-3xl border border-[var(--editable-border)] bg-white/[0.02] p-10 text-center',
      className
    )}>
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[var(--slot4-accent)]/40 bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
        <SearchX className="h-6 w-6" />
      </div>
      <h2 className="editable-display mt-6 text-2xl font-semibold tracking-[-0.02em] text-white">{title}</h2>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-[1.65] text-white/60">{description}</p>
      <Link
        href={actionHref}
        className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.02] px-5 py-3 text-sm font-semibold text-white transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]"
      >
        {actionLabel}
        <ArrowUpRight className="h-4 w-4" />
      </Link>
    </section>
  )
}

export function TaskEmptyState({ taskLabel = 'entries', className }: { taskLabel?: string; className?: string }) {
  return (
    <EmptyState
      className={className}
      title={`No ${taskLabel} available yet`}
      description={`Published ${taskLabel} will appear here automatically. The page stays ready even when the shelf is empty.`}
      actionLabel="Explore the site"
      actionHref="/"
    />
  )
}

export function ContactSuccessState({ className }: { className?: string }) {
  return (
    <EmptyState
      className={className}
      title="Message received"
      description="Thanks for reaching out — your request has been routed through the contact workflow."
      actionLabel="Return home"
      actionHref="/"
    />
  )
}
