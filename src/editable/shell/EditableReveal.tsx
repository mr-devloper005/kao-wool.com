'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

type Props = {
  children: ReactNode
  index?: number
  delayMs?: number
  as?: 'div' | 'section' | 'article' | 'header' | 'li'
  className?: string
  style?: CSSProperties
}

/**
 * Fade+slide-up on scroll. Hidden state is applied only after mount so
 * JS-off visitors see content immediately. Per-item stagger via `index`.
 */
export function EditableReveal({
  children,
  index = 0,
  delayMs,
  as: Tag = 'div',
  className = '',
  style,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setMounted(true)
    const node = ref.current
    if (!node) return
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true)
            io.disconnect()
            break
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    )
    io.observe(node)
    return () => io.disconnect()
  }, [])

  const delay = delayMs ?? Math.min(index * 80, 640)
  const hidden = mounted && !visible

  return (
    <Tag
      ref={ref as never}
      className={`editable-reveal ${hidden ? 'is-hidden' : 'is-visible'} ${className}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}
    >
      {children}
    </Tag>
  )
}
