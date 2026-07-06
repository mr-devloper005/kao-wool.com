import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/login', title: 'Sign in', description: pagesContent.auth.login.metadataDescription })
}

export default function LoginPage() {
  return (
    <EditableSiteShell>
      <main className="editable-accent-halo relative min-h-screen">
        <section className={`${dc.shell.section} grid min-h-[calc(100vh-12rem)] items-center gap-16 py-16 lg:grid-cols-[1fr_0.9fr]`}>
          <div>
            <div className={dc.badge.accentPill}><span className={dc.badge.dot} /> {pagesContent.auth.login.badge}</div>
            <h1 className="editable-display mt-8 max-w-xl text-[42px] font-semibold leading-[1.02] tracking-[-0.04em] sm:text-6xl">{pagesContent.auth.login.title}</h1>
            <p className="mt-8 max-w-lg text-lg leading-[1.6] text-white/60">{pagesContent.auth.login.description}</p>
          </div>
          <div className={`${dc.surface.card} p-8 sm:p-10`}>
            <h2 className="editable-display text-2xl font-semibold tracking-[-0.02em]">{pagesContent.auth.login.formTitle}</h2>
            <EditableLocalLoginForm />
            <p className="mt-8 text-sm text-white/60">
              New here?{' '}
              <Link href="/signup" className="font-semibold text-[var(--slot4-accent)] underline-offset-4 hover:underline">
                {pagesContent.auth.login.createCta}
              </Link>
            </p>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
