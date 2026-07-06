'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Search, X, ArrowUpRight, LogIn, UserPlus, PlusCircle, LogOut } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

/*
  Grabin-style pill navbar: transparent-on-dark blur, brand mark on the left,
  About/Contact centre, search icon + auth pills on the right. NO task-page
  links here (footer keeps the discovery links instead).
*/

const staticLinks = [
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl">
      <div className="bg-[var(--editable-nav-bg)] border-b border-[var(--editable-border)]">
        <nav className="mx-auto flex min-h-[72px] w-full max-w-[var(--editable-container)] items-center gap-4 px-5 sm:px-8 lg:px-12">
          <Link href="/" className="group flex shrink-0 items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center border border-[var(--slot4-accent)]/40 bg-black/40 transition group-hover:border-[var(--slot4-accent)]">
              <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-9 w-9" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="editable-display text-lg font-semibold tracking-[-0.02em] text-white">{SITE_CONFIG.name}</span>
              <span className="editable-mono mt-1 hidden text-[10px] uppercase tracking-[0.16em] text-[var(--slot4-muted-text)] sm:block">{globalContent.nav.tagline}</span>
            </span>
          </Link>

          <div className="ml-8 hidden items-center gap-1 lg:flex">
            {staticLinks.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    active
                      ? 'bg-white/10 text-white'
                      : 'text-white/70 hover:bg-white/[0.06] hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/search"
              aria-label="Search"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/[0.03] text-white/80 transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]"
            >
              <Search className="h-4 w-4" />
            </Link>
            {session ? (
              <>
                <Link
                  href="/create"
                  className="hidden items-center gap-2 rounded-full border border-white/25 bg-white/[0.02] px-4 py-2 text-sm font-semibold text-white transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)] sm:inline-flex"
                >
                  <PlusCircle className="h-3.5 w-3.5" /> Submit
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="hidden items-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-4 py-2 text-sm font-semibold text-[var(--slot4-on-accent)] transition hover:brightness-110 sm:inline-flex"
                >
                  <LogOut className="h-3.5 w-3.5" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden items-center gap-2 rounded-full border border-white/20 bg-white/[0.02] px-4 py-2 text-sm font-semibold text-white transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)] sm:inline-flex"
                >
                  <LogIn className="h-3.5 w-3.5" /> Sign in
                </Link>
                <Link
                  href="/signup"
                  className="hidden items-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-4 py-2 text-sm font-semibold text-[var(--slot4-on-accent)] transition hover:brightness-110 sm:inline-flex"
                >
                  <UserPlus className="h-3.5 w-3.5" /> Get started <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </>
            )}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/[0.03] text-white lg:hidden"
              aria-label="Toggle menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </div>

      {open ? (
        <div className="border-b border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] px-5 py-5 lg:hidden">
          <div className="grid gap-1">
            {staticLinks.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    active ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/[0.06] hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
            <Link
              href="/search"
              onClick={() => setOpen(false)}
              className="rounded-2xl px-4 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/[0.06] hover:text-white"
            >
              Search
            </Link>
            {session ? (
              <>
                <Link
                  href="/create"
                  onClick={() => setOpen(false)}
                  className="rounded-2xl px-4 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/[0.06] hover:text-white"
                >
                  Submit
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout()
                    setOpen(false)
                  }}
                  className="rounded-2xl bg-[var(--slot4-accent-fill)] px-4 py-3 text-left text-sm font-semibold text-[var(--slot4-on-accent)]"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-2xl px-4 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/[0.06] hover:text-white"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className="rounded-2xl bg-[var(--slot4-accent-fill)] px-4 py-3 text-sm font-semibold text-[var(--slot4-on-accent)]"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  )
}
