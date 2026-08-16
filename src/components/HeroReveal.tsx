'use client'
import { useEffect, useState, type ReactNode } from 'react'

type Phase = 'idle' | 'text' | 'image' | 'final'

interface HeroRevealProps {
  eyebrow: string
  heading: string
  /** 白背景フェーズの間だけ見出しの下に表示する小見出し（写真が現れると消える） */
  subheading?: string
  /** 写真が現れてから、見出し類が消えるまでの間だけ表示する補足文（温泉寺のサブコピー等） */
  midContent?: ReactNode
  darkColor: string
  lightColor: string
  eyebrowDarkColor?: string
  eyebrowLightColor?: string
  background: ReactNode
  /** 見出し類が消えたあと、中央に表示される最終コンテンツ（ボタン等） */
  children?: ReactNode
  /** section直下（中央寄せコンテンツの外）に配置する要素。absolute指定の要素など。 */
  sectionExtra?: ReactNode
  className?: string
}

const EASE = 'cubic-bezier(0,0,0.2,1)'
const TEXT_START_MS = 250      // idle → text（マウントからの絶対時間）
const STAGGER_MS = 90          // 1文字ごとの遅延（text開始からの相対時間）
const CHAR_DURATION_MS = 900   // 1文字のフェード＋回転にかかる時間
const SUBHEADING_GAP_MS = 400  // 最後の文字が浮かび終えてから小見出しが出るまでの間
const SUBHEADING_DURATION_MS = 700
const READ_PAUSE_MS = 3000     // 小見出し（寺名）が出そろってから写真が現れるまでの余韻
const FINAL_PAUSE_MS = 3000    // 写真が現れてから、見出し類が消えて最終コンテンツに切り替わるまでの間

// 神社本庁公式サイトの「白背景から文字が一文字ずつ浮かび上がり、
// 静止画が現れる」演出をトップページのヒーローに適用したもの。
// 登場の順番: 白背景 → 見出し文字が浮かぶ → 寺名 → 写真が現れる（見出しは白文字化） →
//            （余韻）→ 見出し類が消え、ボタン等の最終コンテンツが中央に表示される
export default function HeroReveal({
  eyebrow, heading, subheading, midContent, darkColor, lightColor,
  eyebrowDarkColor = darkColor, eyebrowLightColor = lightColor,
  background, children, sectionExtra, className,
}: HeroRevealProps) {
  const [phase, setPhase] = useState<Phase>('idle')
  const charCount = Array.from(heading.replace(/\n/g, '')).length
  // 最後の文字が「text開始」から見て、浮かび終わるまでの相対時間
  const lastCharDoneRelMs = (charCount - 1) * STAGGER_MS + CHAR_DURATION_MS
  const subheadingDoneRelMs = subheading ? lastCharDoneRelMs + SUBHEADING_GAP_MS + SUBHEADING_DURATION_MS : lastCharDoneRelMs
  const imageAtMs = TEXT_START_MS + subheadingDoneRelMs + READ_PAUSE_MS
  const finalAtMs = imageAtMs + FINAL_PAUSE_MS

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase('final')
      return
    }
    const t1 = setTimeout(() => setPhase('text'), TEXT_START_MS)
    const t2 = setTimeout(() => setPhase('image'), imageAtMs)
    const t3 = setTimeout(() => setPhase('final'), finalAtMs)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [imageAtMs, finalAtMs])

  const textActive = phase !== 'idle'
  const photoVisible = phase === 'image' || phase === 'final'
  const imageActive = phase === 'image' // 見出し類が白文字化している区間（写真は出ているが、まだ消えていない）
  const finalVisible = phase === 'final'
  const lines = heading.split('\n').filter(line => line.trim() !== '')
  let charIndex = 0

  return (
    <section className={`relative flex items-center justify-center overflow-hidden bg-white ${className ?? ''}`}>
      <div className="absolute inset-0 transition-opacity duration-[1400ms] ease-out" style={{ opacity: photoVisible ? 1 : 0 }}>
        {/* 白背景の上に半透明の写真をそのまま重ねると色が薄く見えてしまうため、
            写真の下に地色を敷いてから重ねる */}
        <div className="absolute inset-0" style={{ backgroundColor: darkColor }} />
        {background}
        {/* 文字を読みやすくするための薄いオーバーレイ（濃すぎない程度） */}
        <div className="absolute inset-0" style={{ backgroundColor: darkColor, opacity: 0.22 }} />
      </div>

      <div className="relative text-center px-4">
        {!finalVisible && (
          <div className="transition-opacity ease-out" style={{ opacity: 1, transitionDuration: '700ms' }}>
            <p
              className="text-xs tracking-[0.3em] mb-4"
              style={{
                opacity: textActive ? 1 : 0,
                color: imageActive ? eyebrowLightColor : eyebrowDarkColor,
                textShadow: photoVisible ? '0 2px 10px rgba(0,0,0,0.5)' : 'none',
                transitionProperty: 'opacity, color',
                transitionDuration: '700ms',
                transitionTimingFunction: EASE,
              }}
            >
              {eyebrow}
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-6xl lg:text-7xl tracking-wider leading-[1.8] md:leading-[2.4] mb-4 whitespace-pre-line" style={{ perspective: '600px' }}>
              {lines.map((line, li) => (
                <span key={li} className="block whitespace-nowrap">
                  {Array.from(line).map((ch, ci) => {
                    // text開始（textActiveがtrueになった瞬間）からの相対遅延
                    const relDelayMs = charIndex++ * STAGGER_MS
                    return (
                      <span
                        key={ci}
                        className="inline-block"
                        style={{
                          opacity: textActive ? 1 : 0,
                          transform: textActive ? 'translateY(0) rotateX(0deg)' : 'translateY(22px) rotateX(-55deg)',
                          color: imageActive ? lightColor : darkColor,
                          textShadow: photoVisible ? '0 2px 14px rgba(0,0,0,0.5)' : 'none',
                          transitionProperty: 'opacity, transform, color',
                          transitionDuration: `${CHAR_DURATION_MS}ms, ${CHAR_DURATION_MS}ms, 700ms`,
                          transitionTimingFunction: EASE,
                          transitionDelay: `${relDelayMs}ms, ${relDelayMs}ms, 0ms`,
                        }}
                      >
                        {ch === ' ' ? ' ' : ch}
                      </span>
                    )
                  })}
                </span>
              ))}
            </h1>
            {subheading && (
              <p
                className="font-serif text-lg md:text-3xl tracking-[0.2em] mb-2"
                style={{
                  opacity: phase === 'text' ? 1 : 0,
                  color: darkColor,
                  transitionProperty: 'opacity',
                  transitionDuration: `${SUBHEADING_DURATION_MS}ms`,
                  transitionTimingFunction: EASE,
                  // 出現時: 最後の文字が浮かび終えてから。消える時: image化した瞬間に即フェードアウト。
                  transitionDelay: phase === 'text' ? `${lastCharDoneRelMs + SUBHEADING_GAP_MS}ms` : '0ms',
                }}
              >
                {subheading}
              </p>
            )}
            {midContent && (
              <div
                style={{
                  opacity: imageActive ? 1 : 0,
                  filter: photoVisible ? 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))' : 'none',
                  transitionProperty: 'opacity',
                  transitionDuration: '700ms',
                  transitionTimingFunction: EASE,
                  transitionDelay: imageActive ? '250ms' : '0ms',
                }}
              >
                {midContent}
              </div>
            )}
          </div>
        )}

        {finalVisible && (
          <div
            className="transition-opacity ease-out"
            style={{
              opacity: 1,
              transitionDuration: '700ms',
              filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.35))',
            }}
          >
            {children}
          </div>
        )}
      </div>

      {sectionExtra && (
        <div
          className="transition-opacity duration-700 ease-out"
          style={{
            opacity: photoVisible ? 1 : 0,
            transitionDelay: photoVisible ? '450ms' : '0ms',
            filter: photoVisible ? 'drop-shadow(0 1px 6px rgba(0,0,0,0.4))' : 'none',
          }}
        >
          {sectionExtra}
        </div>
      )}
    </section>
  )
}
