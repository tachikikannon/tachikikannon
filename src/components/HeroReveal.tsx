'use client'
import { useEffect, useState, type ReactNode } from 'react'

type Phase = 'idle' | 'text' | 'image'

interface HeroRevealProps {
  eyebrow: string
  heading: string
  /** 白背景フェーズの間だけ見出しの下に表示する小見出し（写真が現れると消える） */
  subheading?: string
  /** 写真が現れると、見出しと一緒に表示される補足文（温泉寺のサブコピー等） */
  midContent?: ReactNode
  /** 白背景フェーズの間、見出しの背後に薄く滲ませる寺紋（単色地に白抜きのPNG。マスクで白い部分だけを抽出する） */
  crestSrc?: string
  darkColor: string
  lightColor: string
  eyebrowDarkColor?: string
  eyebrowLightColor?: string
  background: ReactNode
  /** 写真が現れたあと、見出し類の下に表示される最終コンテンツ（ボタン等） */
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

// 神社本庁公式サイトの「白背景から文字が一文字ずつ浮かび上がり、
// 静止画が現れる」演出をトップページのヒーローに適用したもの。
// 登場の順番: 白背景 → 見出し文字が浮かぶ → 寺名 →
//            写真が現れる（見出しは白文字化、寺名は消える、補足文・ボタン等が現れる）
export default function HeroReveal({
  eyebrow, heading, subheading, midContent, crestSrc, darkColor, lightColor,
  eyebrowDarkColor = darkColor, eyebrowLightColor = lightColor,
  background, children, sectionExtra, className,
}: HeroRevealProps) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [scrolled, setScrolled] = useState(false)
  const charCount = Array.from(heading.replace(/\n/g, '')).length
  // 最後の文字が「text開始」から見て、浮かび終わるまでの相対時間
  const lastCharDoneRelMs = (charCount - 1) * STAGGER_MS + CHAR_DURATION_MS
  const subheadingDoneRelMs = subheading ? lastCharDoneRelMs + SUBHEADING_GAP_MS + SUBHEADING_DURATION_MS : lastCharDoneRelMs
  const imageAtMs = TEXT_START_MS + subheadingDoneRelMs + READ_PAUSE_MS

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase('image')
      return
    }
    const t1 = setTimeout(() => setPhase('text'), TEXT_START_MS)
    const t2 = setTimeout(() => setPhase('image'), imageAtMs)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [imageAtMs])

  useEffect(() => {
    // スクロールを始めたらSCROLLヒントを消す（コンテンツが増えてヒーローが
    // ビューポートより高くなったため、絶対配置だと変な位置に出てしまう）
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const textActive = phase !== 'idle'
  const imageActive = phase === 'image'
  const lines = heading.split('\n').filter(line => line.trim() !== '')
  let charIndex = 0

  return (
    <section className={`relative flex flex-col overflow-hidden bg-white ${className ?? ''}`}>
      <div className="absolute inset-0 transition-opacity duration-[1400ms] ease-out" style={{ opacity: imageActive ? 1 : 0 }}>
        {/* 白背景の上に半透明の写真をそのまま重ねると色が薄く見えてしまうため、
            写真の下に地色を敷いてから重ねる */}
        <div className="absolute inset-0" style={{ backgroundColor: darkColor }} />
        {background}
        {/* 文字を読みやすくするための薄いオーバーレイ（濃すぎない程度） */}
        <div className="absolute inset-0" style={{ backgroundColor: darkColor, opacity: 0.22 }} />
      </div>

      {/* メインコピー・サブコピーはこの残り空間の中で常に上下中央。
          その下のボタン等は中央配置の対象に含めず、画像下部に寄せる */}
      <div className="relative flex-1 flex flex-col items-center justify-center text-center px-4 min-h-0">
        {/* 白背景フェーズの間だけ、見出しの背後に寺紋を薄く滲ませる */}
        {crestSrc && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
            <div
              className="w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] md:w-[520px] md:h-[520px] lg:w-[600px] lg:h-[600px] transition-opacity ease-out"
              style={{
                backgroundColor: darkColor,
                // crestSrcは元の単色地(不透明)PNGを黒地×白紋の二値マスク専用
                // 画像に変換したもの(*-mask.png)。元PNGのまま輝度マスクすると、
                // 地の色が完全な黒ではないため紋の輪郭がにじんで判別できなかった
                WebkitMaskImage: `url(${crestSrc})`,
                maskImage: `url(${crestSrc})`,
                WebkitMaskMode: 'luminance',
                maskMode: 'luminance',
                WebkitMaskSize: 'contain',
                maskSize: 'contain',
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
                maskPosition: 'center',
                filter: 'blur(1px)',
                opacity: imageActive ? 0 : 0.13,
                transitionDuration: '900ms',
              }}
            />
          </div>
        )}
        <p
          className="text-xs tracking-[0.3em] mb-4"
          style={{
            opacity: textActive ? 1 : 0,
            color: imageActive ? eyebrowLightColor : eyebrowDarkColor,
            textShadow: imageActive ? '0 2px 10px rgba(0,0,0,0.5)' : 'none',
            transitionProperty: 'opacity, color',
            transitionDuration: '700ms',
            transitionTimingFunction: EASE,
          }}
        >
          {eyebrow}
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-6xl lg:text-7xl tracking-wider whitespace-pre-line mb-4" style={{ perspective: '600px' }}>
          {lines.map((line, li) => (
            // line-heightだけでは行間が広がらなかったため、2行目以降は
            // marginで明示的に間隔を空ける
            <span key={li} className={`block whitespace-nowrap ${li > 0 ? 'mt-3 md:mt-5' : ''}`}>
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
                      textShadow: imageActive ? '0 2px 14px rgba(0,0,0,0.5)' : 'none',
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
      </div>

      {/* 見出し類とは別に、写真下部ぎりぎりに寄せる補足文・ボタン等 */}
      <div className="relative text-center px-4 pb-12 md:pb-16 shrink-0">
        {midContent && (
          <div
            style={{
              opacity: imageActive ? 1 : 0,
              filter: imageActive ? 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))' : 'none',
              transitionProperty: 'opacity',
              transitionDuration: '700ms',
              transitionTimingFunction: EASE,
              transitionDelay: imageActive ? '250ms' : '0ms',
            }}
          >
            {midContent}
          </div>
        )}
        <div
          className={`transition-opacity ease-out ${midContent ? 'mt-8' : ''}`}
          style={{
            opacity: imageActive ? 1 : 0,
            transitionDuration: '700ms',
            transitionDelay: imageActive ? '450ms' : '0ms',
            filter: imageActive ? 'drop-shadow(0 2px 10px rgba(0,0,0,0.35))' : 'none',
          }}
        >
          {children}
        </div>
      </div>

      {sectionExtra && (
        // fixed配置の子要素をtransform/filterのないラッパーに通すことで、
        // 本当にビューポート基準で固定されるようにする（filterがあると
        // それ自体がposition:fixedの基準になってしまうため）
        <div
          className="transition-opacity duration-700 ease-out"
          style={{
            opacity: imageActive && !scrolled ? 1 : 0,
            transitionDelay: imageActive ? '450ms' : '0ms',
          }}
        >
          {sectionExtra}
        </div>
      )}
    </section>
  )
}
