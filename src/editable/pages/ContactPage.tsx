'use client'

import { Building2, FileText, Image as ImageIcon, Mail, MapPin, Sparkles, Bookmark, Phone } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { getProductKind } from '@/design/factory/get-product-kind'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

function getLanes(kind: ReturnType<typeof getProductKind>) {
  if (kind === 'directory') {
    return [
      { icon: Building2, title: 'Suggest an entry', body: 'Nominate a nearby place for the directory. We verify hours, location, and contact before it goes live.' },
      { icon: Phone, title: 'Partnership support', body: 'Talk to us about bulk onboarding, verification programs, or neighbourhood partnerships.' },
      { icon: MapPin, title: 'Coverage requests', body: 'Need a new neighbourhood or category on the shelf? Tell us and we will shape the directory around it.' },
    ]
  }
  if (kind === 'editorial') {
    return [
      { icon: FileText, title: 'Editorial submissions', body: 'Pitch long reads, field notes, and briefings that pair with directory entries or the reference library.' },
      { icon: Mail, title: 'Reference proposals', body: 'Suggest a downloadable primer, guide, or checklist for the reference library.' },
      { icon: Sparkles, title: 'Contributor support', body: 'Questions on voice, formatting, or the review workflow — happy to help.' },
    ]
  }
  if (kind === 'visual') {
    return [
      { icon: ImageIcon, title: 'Photo submissions', body: 'Share visual sets of local places worth capturing.' },
      { icon: Sparkles, title: 'Licensing and use', body: 'Ask about usage rights, commercial requests, or visual features.' },
      { icon: Mail, title: 'Media kits', body: 'Request a contributor deck or feature placement.' },
    ]
  }
  return [
    { icon: Bookmark, title: 'Reference proposals', body: 'Nominate a primer, briefing, or downloadable checklist for the library.' },
    { icon: Mail, title: 'Curator support', body: 'Help organising shelves or grouping references? Ask us here.' },
    { icon: Sparkles, title: 'Contributor lanes', body: 'Contributor guidelines, review workflow, and everything in between.' },
  ]
}

export default function ContactPage() {
  const { recipe } = getFactoryState()
  const productKind = getProductKind(recipe)
  const lanes = getLanes(productKind)

  return (
    <EditableSiteShell>
      <main className="min-h-screen">
        <section className="editable-accent-halo relative border-b border-[var(--editable-border)] py-24 sm:py-28">
          <div className={dc.shell.section}>
            <EditableReveal index={0}>
              <div className={dc.badge.accentPill}>
                <span className={dc.badge.dot} /> {pagesContent.contact.eyebrow}
              </div>
            </EditableReveal>
            <EditableReveal index={1}>
              <h1 className="editable-display mt-8 max-w-4xl text-balance text-[42px] font-semibold leading-[1.02] tracking-[-0.04em] sm:text-6xl lg:text-[68px]">
                {pagesContent.contact.title}
              </h1>
            </EditableReveal>
            <EditableReveal index={2}>
              <p className="mt-8 max-w-2xl text-lg leading-[1.6] text-white/60">{pagesContent.contact.description}</p>
            </EditableReveal>
          </div>
        </section>

        <section className="py-24 sm:py-28">
          <div className={dc.shell.section}>
            <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
              <div className="space-y-5">
                {lanes.map((lane, i) => (
                  <EditableReveal key={lane.title} index={i}>
                    <div className={`${dc.surface.soft} p-7`}>
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
                        <lane.icon className="h-4 w-4" />
                      </span>
                      <h2 className="editable-display mt-5 text-xl font-semibold tracking-[-0.02em] text-white">{lane.title}</h2>
                      <p className="mt-3 text-sm leading-[1.65] text-white/60">{lane.body}</p>
                    </div>
                  </EditableReveal>
                ))}
              </div>

              <EditableReveal index={1}>
                <div className={`${dc.surface.card} p-8 sm:p-10`}>
                  <p className="editable-mono text-[11px] uppercase tracking-[0.16em] text-[var(--slot4-accent)]">Send a message</p>
                  <h2 className="editable-display mt-4 text-3xl font-semibold tracking-[-0.03em]">{pagesContent.contact.formTitle}</h2>
                  <EditableContactLeadForm />
                </div>
              </EditableReveal>
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
