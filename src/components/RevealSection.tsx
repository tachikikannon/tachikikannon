'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

interface RevealSectionProps {
  eyebrow: string
  heading: string
  image: { src: string; alt: string; caption?: string }
  accent: 'navy' | 'onsenji'
}

const ACCENT = {
  navy:    { text: 'text-navy', divider: 'bg-gold', eyebrow: 'text-gold' },
  onsenji: { text: 'text-onsenji', divider: 'bg-[#7ec8a4]', eyebrow: 'text-[#2d6b57]' },
} as const

// 神社本庁公式サイトの「白背景から文字が一文字ずつ浮かび上がり、静止画が現れる」演出を参考にした、
// スクロールで発火するテキスト・画像リビール。GSAPは使わず、IntersectionObserver + CSS transitionのみで実装。
export default function RevealSection({ eyebrow, heading, image, accent }: RevealSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setActive(true)
      return
    }
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true)
          observer.disconnect()
        }
      },
      { threshold: 0.35 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const colors = ACCENT[accent]
  const lines = heading.split('\n')
  let charIndex = 0

  return (
    <section ref={sectionRef} className="bg-white py-20 md:py-28 overflow-hidden">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <p className={`text-xs tracking-[0.4em] mb-5 ${colors.eyebrow}`}>{eyebrow}</p>
        <h2 className={`font-serif text-2xl md:text-4xl leading-relaxed tracking-wider ${colors.text}`} style={{ perspective: '600px' }}>
          {lines.map((line, li) => (
            <span key={li} className="block">
              {Array.from(line).map((ch, i) => {
                const idx = charIndex++
                return (
                  <span
                    key={i}
                    className="inline-block transition-[opacity,transform] duration-700 ease-out"
                    style={{
                      opacity: active ? 1 : 0,
                      transform: active ? 'translateY(0) rotateX(0deg)' : 'translateY(22px) rotateX(-55deg)',
                      transitionDelay: `${idx * 32}ms`,
                    }}
                  >
                    {ch === ' ' ? ' ' : ch}
                  </span>
                )
              })}
            </span>
          ))}
        </h2>
        <div
          className={`w-12 h-0.5 mx-auto mt-8 mb-10 transition-opacity duration-700 ${colors.divider}`}
          style={{ opacity: active ? 1 : 0, transitionDelay: `${charIndex * 32 + 150}ms` }}
        />
      </div>
      <div className="max-w-4xl mx-auto px-4">
        <div
          className="relative h-64 md:h-[26rem] rounded-xl overflow-hidden shadow-sm transition-[opacity,transform] ease-out"
          style={{
            opacity: active ? 1 : 0,
            transform: active ? 'translateY(0) scale(1)' : 'translateY(24px) scale(1.04)',
            transitionDelay: `${charIndex * 32 + 250}ms`,
            transitionDuration: '1400ms',
          }}
        >
          <Image src={image.src} alt={image.alt} fill className="object-cover" />
        </div>
        {image.caption && (
          <p className="text-center text-xs text-gray-400 mt-3">{image.caption}</p>
        )}
      </div>
    </section>
  )
}
