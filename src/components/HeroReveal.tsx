'use client'
import { useEffect, useState, type ReactNode } from 'react'

type Phase = 'idle' | 'text' | 'image'

interface HeroRevealProps {
  eyebrow: string
  heading: string
  darkColor: string
  lightColor: string
  eyebrowDarkColor?: string
  eyebrowLightColor?: string
  background: ReactNode
  children?: ReactNode
  /** section直下（中央寄せコンテンツの外）に配置する要素。absolute指定の要素など。 */
  sectionExtra?: ReactNode
  className?: string
}

// 神社本庁公式サイトの「白背景から文字が一文字ずつ浮かび上がり、
// 静止画が現れる」演出をトップページのヒーローに適用したもの。
// 最終的な見た目（フルブリード写真＋白文字＋ボタン）は従来のヒーローと同じで、
// 登場の順番だけを「白背景 → 見出し文字が浮かぶ → 写真が現れる → ボタン」に変更している。
export default function HeroReveal({
  eyebrow, heading, darkColor, lightColor,
  eyebrowDarkColor = darkColor, eyebrowLightColor = lightColor,
  background, children, sectionExtra, className,
}: HeroRevealProps) {
  const [phase, setPhase] = useState<Phase>('idle')

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase('image')
      return
    }
    const t1 = setTimeout(() => setPhase('text'), 150)
    const t2 = setTimeout(() => setPhase('image'), 950)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const textActive = phase !== 'idle'
  const imageActive = phase === 'image'
  const lines = heading.split('\n')
  let charIndex = 0

  return (
    <section className={`relative flex items-center justify-center overflow-hidden bg-white ${className ?? ''}`}>
      <div className="absolute inset-0 transition-opacity duration-[1400ms] ease-out" style={{ opacity: imageActive ? 1 : 0 }}>
        {background}
      </div>
      <div className="relative text-center px-4">
        <p
          className="text-xs tracking-[0.3em] mb-4"
          style={{
            opacity: textActive ? 1 : 0,
            color: imageActive ? eyebrowLightColor : eyebrowDarkColor,
            transition: 'opacity 700ms cubic-bezier(0,0,0.2,1), color 700ms cubic-bezier(0,0,0.2,1)',
          }}
        >
          {eyebrow}
        </p>
        <h1 className="font-serif text-4xl md:text-6xl tracking-wider leading-snug mb-6 whitespace-pre-line" style={{ perspective: '600px' }}>
          {lines.map((line, li) => (
            <span key={li} className="block">
              {Array.from(line).map((ch, ci) => {
                const idx = charIndex++
                return (
                  <span
                    key={ci}
                    className="inline-block"
                    style={{
                      opacity: textActive ? 1 : 0,
                      transform: textActive ? 'translateY(0) rotateX(0deg)' : 'translateY(22px) rotateX(-55deg)',
                      color: imageActive ? lightColor : darkColor,
                      transition: `opacity 700ms cubic-bezier(0,0,0.2,1) ${idx * 28}ms, transform 700ms cubic-bezier(0,0,0.2,1) ${idx * 28}ms, color 700ms cubic-bezier(0,0,0.2,1) 0ms`,
                    }}
                  >
                    {ch === ' ' ? ' ' : ch}
                  </span>
                )
              })}
            </span>
          ))}
        </h1>
        <div className="transition-opacity duration-700 ease-out" style={{ opacity: imageActive ? 1 : 0, transitionDelay: imageActive ? '450ms' : '0ms' }}>
          {children}
        </div>
      </div>
      {sectionExtra && (
        <div className="transition-opacity duration-700 ease-out" style={{ opacity: imageActive ? 1 : 0, transitionDelay: imageActive ? '450ms' : '0ms' }}>
          {sectionExtra}
        </div>
      )}
    </section>
  )
}
