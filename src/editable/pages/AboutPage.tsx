import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

export default function AboutPage() {
  return (
    <EditableSiteShell>
      <main className="min-h-screen">
        <section className="editable-accent-halo relative border-b border-[var(--editable-border)] py-24 sm:py-32">
          <div className={dc.shell.section}>
            <EditableReveal index={0}>
              <div className={dc.badge.accentPill}>
                <span className={dc.badge.dot} /> {pagesContent.about.badge}
              </div>
            </EditableReveal>
            <EditableReveal index={1}>
              <h1 className="editable-display mt-8 max-w-4xl text-balance text-5xl font-semibold leading-[1.02] tracking-[-0.04em] sm:text-6xl lg:text-[76px]">
                {pagesContent.about.title}
              </h1>
            </EditableReveal>
            <EditableReveal index={2}>
              <p className="mt-8 max-w-3xl text-lg leading-[1.6] text-white/60 sm:text-xl">{pagesContent.about.description}</p>
            </EditableReveal>
          </div>
        </section>

        <section className="py-24 sm:py-32">
          <div className={dc.shell.section}>
            <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
              <EditableReveal index={0}>
                <article className={`${dc.surface.card} p-8 sm:p-12`}>
                  <p className="editable-mono text-[11px] uppercase tracking-[0.16em] text-[var(--slot4-accent)]">[ Notebook ]</p>
                  <h2 className="editable-display mt-5 text-3xl font-semibold leading-[1.1] tracking-[-0.03em] sm:text-4xl">
                    Why {SITE_CONFIG.name} exists
                  </h2>
                  <div className="mt-8 space-y-6 text-base leading-[1.7] text-white/70">
                    {pagesContent.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  </div>
                </article>
              </EditableReveal>
              <aside className="space-y-5">
                {pagesContent.about.values.map((value, i) => (
                  <EditableReveal key={value.title} index={i}>
                    <div className={`${dc.surface.soft} p-7`}>
                      <p className="editable-mono text-[11px] uppercase tracking-[0.16em] text-[var(--slot4-accent)]">
                        {String(i + 1).padStart(2, '0')} / Principle
                      </p>
                      <h3 className="editable-display mt-4 text-xl font-semibold tracking-[-0.02em] text-white">{value.title}</h3>
                      <p className="mt-3 text-sm leading-[1.65] text-white/60">{value.description}</p>
                    </div>
                  </EditableReveal>
                ))}
              </aside>
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
