'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()
  const strip = globalContent.footer.ctaStrip

  return (
    <footer className="mt-24 bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      {/* CTA strip */}
      <div className="border-t border-[var(--editable-border)]">
        <div className="mx-auto flex w-full max-w-[var(--editable-container)] flex-col items-start justify-between gap-6 px-5 py-14 sm:px-8 lg:flex-row lg:items-center lg:px-12">
          <div className="max-w-2xl">
            <p className="editable-mono text-[11px] uppercase tracking-[0.2em] text-[var(--slot4-accent)]">{strip.eyebrow}</p>
            <h3 className="editable-display mt-4 text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-white sm:text-4xl lg:text-[42px]">
              {strip.title}
            </h3>
          </div>
          <Link
            href={strip.cta.href}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-7 py-4 text-sm font-semibold text-[var(--slot4-on-accent)] transition hover:brightness-110"
          >
            {strip.cta.label} <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Main columns */}
      <div className="border-t border-[var(--editable-border)]">
        <div className="mx-auto grid w-full max-w-[var(--editable-container)] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.6fr_1fr_1fr] lg:px-12">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center border border-[var(--slot4-accent)]/50 bg-black/40">
                <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-9 w-9" />
              </span>
              <span className="editable-display text-xl font-semibold tracking-[-0.02em] text-white">{SITE_CONFIG.name}</span>
            </Link>
            <p className="mt-5 max-w-md text-sm leading-7 text-[var(--slot4-muted-text)]">{globalContent.footer.description}</p>
            
          </div>

          {globalContent.footer.columns.map((column) => (
            <div key={column.title}>
              <h3 className="editable-mono text-[11px] uppercase tracking-[0.2em] text-[var(--slot4-accent)]">{column.title}</h3>
              <div className="mt-5 grid gap-3">
                {column.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-[var(--slot4-muted-text)] transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
                {column.title === 'Account' ? (
                  session ? (
                    <button
                      type="button"
                      onClick={logout}
                      className="text-left text-sm text-[var(--slot4-muted-text)] transition hover:text-white"
                    >
                      Logout
                    </button>
                  ) : (
                    <>
                      <Link href="/login" className="text-sm text-[var(--slot4-muted-text)] transition hover:text-white">Sign in</Link>
                      <Link href="/signup" className="text-sm text-[var(--slot4-muted-text)] transition hover:text-white">Get started</Link>
                    </>
                  )
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Giant wordmark */}
      <div className="overflow-hidden border-t border-[var(--editable-border)]">
        <div className="mx-auto w-full max-w-[var(--editable-container)] px-5 pt-14 sm:px-8 lg:px-12">
          <p className="editable-display whitespace-nowrap text-[18vw] font-semibold leading-[0.85] tracking-[-0.05em] text-white/[0.06]">
            {SITE_CONFIG.name}
          </p>
        </div>
        <div className="mx-auto flex w-full max-w-[var(--editable-container)] flex-wrap items-center justify-between gap-4 px-5 py-6 text-xs text-[var(--slot4-muted-text)] sm:px-8 lg:px-12">
          <span>© {year} {SITE_CONFIG.name}. {globalContent.footer.bottomNote}</span>
          <span className="editable-mono uppercase tracking-[0.16em]">{globalContent.site.tagline}</span>
        </div>
      </div>
    </footer>
  )
}
