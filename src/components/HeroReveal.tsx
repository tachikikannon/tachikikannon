'use client'
import { useEffect, useRef, useState, type ReactNode } from 'react'

interface HeroRevealProps {
  eyebrow: string
  heading: string
  /** 白背景フェーズの間だけ見出しの下に表示する小見出し（写真が現れると消える）。
      verticalHeadingがtrueの場合は使われない（代わりにsubheadingLogoSrcが最後の1コマとして使われる） */
  subheading?: string
  /** 白背景フェーズの間に表示する寺号の筆文字ロゴ画像。
      verticalHeadingがfalseなら見出しの下に小見出し代わりに、trueなら見出し各行のあとの最後の1コマとして表示する */
  subheadingLogoSrc?: string
  subheadingLogoAlt?: string
  /** trueの場合、見出しを「中央・縦書きで1行ずつ入れ替わり、最後にsubheadingLogoSrcが浮かぶ」
      演出で表示する（中禅寺・温泉寺の日本語ページ用）。falseの場合は従来どおり
      見出し全行を横書きで同時に浮かび上がらせる（英語ページ用。縦書きの英文は読みにくいため） */
  verticalHeading?: boolean
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
  /** 見出しグループ・下部グループを上下中央から一律に持ち上げる量(px)。指定サイトのみ調整したい場合に使う */
  liftPx?: number
  /** 下部グループ（ボタン等）だけをさらに持ち上げる量(px)。見出しは動かさず、
      ボタンだけ見出しに近づけたい場合にliftPxと併用する */
  bottomLiftPx?: number
  /** trueの場合、children全体を一括フェードするのをやめ、children側で
      "hero-pop-buttons"クラスを付けた要素の直下の子を、写真が現れたあとに
      1つずつ弾むように順番に表示する(globals.cssのCSSアニメーションで実現) */
  staggerChildren?: boolean
  className?: string
}

const EASE = 'cubic-bezier(0,0,0.2,1)'

// 横書き見出し（verticalHeading=false、英語ページ用）のタイミング
const TEXT_START_MS = 250      // idle → text（マウントからの絶対時間）
const STAGGER_MS = 90          // 1文字ごとの遅延（text開始からの相対時間）
const CHAR_DURATION_MS = 900   // 1文字のフェード＋回転にかかる時間
const SUBHEADING_GAP_MS = 400  // 最後の文字が浮かび終えてから小見出しが出るまでの間
const SUBHEADING_DURATION_MS = 700
const READ_PAUSE_MS = 3000     // 小見出し（寺名）が出そろってから写真が現れるまでの余韻

// 縦書き見出し（verticalHeading=true、日本語ページ用）のタイミング。
// 白背景 → 寺紋の透かし → 見出しの行を1行ずつ縦書きで入れ替えながら見せる →
// 最後に寺号の筆文字ロゴが浮かび、3秒の余韻を残してから写真に切り替わる。
const V_START_MS = 250
const V_CHAR_STAGGER_MS = 110
const V_LINE_HOLD_MS = 700       // 1行が出そろってから、次に切り替わるまでの間
const V_LINE_FADE_MS = 500       // 行が入れ替わるときのフェード時間
const V_LOGO_FADE_MS = 900
const V_FINAL_HOLD_MS = 3000     // ロゴが出たあと、写真に切り替わるまでの余韻

// 神社本庁公式サイトの「白背景から文字が一文字ずつ浮かび上がり、
// 静止画が現れる」演出をトップページのヒーローに適用したもの。
export default function HeroReveal({
  eyebrow, heading, subheading, subheadingLogoSrc, subheadingLogoAlt, verticalHeading = false, midContent, crestSrc,
  darkColor, lightColor, eyebrowDarkColor = darkColor, eyebrowLightColor = lightColor,
  background, children, liftPx = 0, bottomLiftPx = 0, staggerChildren = false, className,
}: HeroRevealProps) {
  const headingContentRef = useRef<HTMLDivElement>(null)
  const bottomGroupRef = useRef<HTMLDivElement>(null)
  const [minHeightPx, setMinHeightPx] = useState<number | null>(null)
  // 見出しエリア（寺紋・見出し）専用の最小高さ。下部グループの高さ（bottomH）を
  // 含めない＝下部コンテンツがお寺によって違う高さでも、見出しエリアの中央配置は
  // 影響を受けない（詳しくはheadingAreaWrapperの説明を参照）
  const [headingAreaMinHeightPx, setHeadingAreaMinHeightPx] = useState<number | null>(null)
  const lines = heading.split('\n').filter(line => line.trim() !== '')

  // 横書きモード用の状態・タイミング
  const [phase, setPhase] = useState<'idle' | 'text'>('idle')
  const [horizontalImageActive, setHorizontalImageActive] = useState(false)
  const charCount = Array.from(heading.replace(/\n/g, '')).length
  const lastCharDoneRelMs = (charCount - 1) * STAGGER_MS + CHAR_DURATION_MS
  const hasSubheadingContent = Boolean(subheading || subheadingLogoSrc)
  const subheadingDoneRelMs = hasSubheadingContent ? lastCharDoneRelMs + SUBHEADING_GAP_MS + SUBHEADING_DURATION_MS : lastCharDoneRelMs
  const horizontalImageAtMs = TEXT_START_MS + subheadingDoneRelMs + READ_PAUSE_MS

  // 縦書きモード用の状態・タイミング（-1:何も出ていない、0..lines.length-1:見出しの行、lines.length:ロゴ）
  const [step, setStep] = useState(-1)
  const [verticalImageActive, setVerticalImageActive] = useState(false)
  const hasLogoStep = Boolean(subheadingLogoSrc)
  // 各コマ（見出しの行・ロゴ）は、直前のコマが完全に消え終わってから
  // フェードインを始める。1コマ目だけは待つ相手がいないので待ち時間なし。
  const vLineDurations = lines.map((line, li) => {
    const cc = Array.from(line).length
    const enterWaitMs = li === 0 ? 0 : V_LINE_FADE_MS
    return enterWaitMs + (cc - 1) * V_CHAR_STAGGER_MS + CHAR_DURATION_MS + V_LINE_HOLD_MS
  })
  const vLineStartTimes: number[] = []
  let vCursor = V_START_MS
  vLineDurations.forEach(dur => { vLineStartTimes.push(vCursor); vCursor += dur })
  const vLogoStartMs = vCursor
  const vLogoEnterWaitMs = lines.length > 0 ? V_LINE_FADE_MS : 0
  const verticalImageAtMs = hasLogoStep
    ? vLogoStartMs + vLogoEnterWaitMs + V_LOGO_FADE_MS + V_FINAL_HOLD_MS
    : vLogoStartMs + V_FINAL_HOLD_MS

  useEffect(() => {
    if (verticalHeading) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase('text')
      setHorizontalImageActive(true)
      return
    }
    const t1 = setTimeout(() => setPhase('text'), TEXT_START_MS)
    const t2 = setTimeout(() => setHorizontalImageActive(true), horizontalImageAtMs)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [verticalHeading, horizontalImageAtMs])

  useEffect(() => {
    if (!verticalHeading) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStep(lines.length)
      setVerticalImageActive(true)
      return
    }
    const timers: ReturnType<typeof setTimeout>[] = []
    vLineStartTimes.forEach((t, i) => timers.push(setTimeout(() => setStep(i), t)))
    if (hasLogoStep) timers.push(setTimeout(() => setStep(lines.length), vLogoStartMs))
    timers.push(setTimeout(() => setVerticalImageActive(true), verticalImageAtMs))
    return () => { timers.forEach(clearTimeout) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verticalHeading, hasLogoStep, vLogoStartMs, verticalImageAtMs, lines.length])

  useEffect(() => {
    // 見出しグループ・下部グループは共にposition:absoluteなので、通常フローと
    // 違ってどちらもセクション自身の高さに寄与しない。そのままだとmin-h-100vh
    // が床のまま動かず、見出しを画像中央に固定しつつ下部グループ(温泉寺は
    // 入浴ステータスカード分だけ立木観音より高い)と組み合わせた合計が画面に
    // 収まらない端末で見出しの2行目と下部コンテンツが重なってしまう。
    // 実測した高さから「見出しが画像中央に来たまま重ならない」ために必要な
    // 最小の高さを計算し、min-h-100vhと比較して大きい方をセクションの高さにする。
    const headingEl = headingContentRef.current
    const bottomEl = bottomGroupRef.current
    if (!headingEl || !bottomEl) return
    const update = () => {
      const headingH = headingEl.offsetHeight
      const bottomH = bottomEl.offsetHeight
      setMinHeightPx(headingH + bottomH * 2)
      setHeadingAreaMinHeightPx(headingH)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(headingEl)
    ro.observe(bottomEl)
    return () => ro.disconnect()
  }, [])

  const textActive = verticalHeading ? step > -1 : phase !== 'idle'
  const imageActive = verticalHeading ? verticalImageActive : horizontalImageActive
  // liftPxは横書き版の見出し（＋温泉寺の入浴ステータスカード分の下部の高さ）に
  // 合わせて調整された値なので、縦書き版では使わない。代わりに、白背景フェーズの
  // 寺紋・文字が上下ど真ん中よりわずかに上に来るよう、中禅寺・温泉寺で共通の
  // 固定値を使う（お寺ごとの値を使わないことで、両サイトの見え方を必ず揃える）。
  // 下部のボタン等（bottomGroupLiftPx）はこの上寄せの影響を受けず、従来どおり
  // bottomLiftPxだけで調整される。
  const V_WHITE_PHASE_LIFT_PX = 40
  const effectiveLiftPx = verticalHeading ? V_WHITE_PHASE_LIFT_PX : liftPx
  const bottomGroupLiftPx = verticalHeading ? 0 : liftPx
  let charIndex = 0

  return (
    <section
      className={`relative flex flex-col overflow-hidden bg-white ${className ?? ''}`}
      style={minHeightPx ? { minHeight: `max(calc(var(--vh, 1svh) * 100), ${minHeightPx}px)` } : undefined}
    >
      <div className="absolute inset-0 transition-opacity duration-[1400ms] ease-out" style={{ opacity: imageActive ? 1 : 0 }}>
        {/* 白背景の上に半透明の写真をそのまま重ねると色が薄く見えてしまうため、
            写真の下に地色を敷いてから重ねる */}
        <div className="absolute inset-0" style={{ backgroundColor: darkColor }} />
        {background}
        {/* 文字を読みやすくするための薄いオーバーレイ（濃すぎない程度） */}
        <div className="absolute inset-0" style={{ backgroundColor: darkColor, opacity: 0.22 }} />
      </div>

      {/* メインコピー・サブコピーは常にセクション全体（画像）の上下中央に配置する。
          flex-1で「下のボタン等を除いた残り空間」を中央寄せする方式だと、
          下のボタン等の高さがお寺ごとに違う（温泉寺は入浴ステータスカードがある分、
          立木観音より下のブロックが高い）ため、見た目の中心がずれてしまっていた。
          absoluteでセクション全体を基準に中央配置することで…という意図だったが、
          縦書きモードではセクション自体の高さ（minHeightPx）に下部ブロックの高さが
          含まれるため、下部ブロックが高いお寺ほどセクションが伸びて、結果的に
          見出しの中央位置が下寄りになってしまっていた（画像で指摘を確認）。
          縦書きモードでは、この見出しエリアの高さをセクション全体ではなく
          見出し自身に必要な高さ（headingAreaMinHeightPx）とmin-h-100vhの
          大きい方に固定し、上端をセクション上端に揃えることで、下部ブロックの
          高さに関係なく見出しが常に画面の同じ位置に来るようにした */}
      <div
        className={`absolute inset-x-0 flex flex-col items-center justify-center text-center px-4 ${verticalHeading ? 'top-0' : 'inset-y-0'}`}
        style={verticalHeading && headingAreaMinHeightPx
          ? { height: `max(calc(var(--vh, 1svh) * 100), ${headingAreaMinHeightPx}px)` }
          : undefined}
      >
        {/* 白背景フェーズの間だけ、見出しの背後に寺紋を薄く滲ませる */}
        {crestSrc && (
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            aria-hidden="true"
            style={effectiveLiftPx ? { transform: `translateY(-${effectiveLiftPx}px)` } : undefined}
          >
            <div
              className="w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] md:w-[520px] md:h-[520px] lg:w-[600px] lg:h-[600px] transition-opacity ease-out"
              style={{
                backgroundColor: darkColor,
                // crestSrcは元の単色地(不透明)PNGから、紋の形をそのままアルファ
                // チャンネルに変換した透過PNG(*-mask.png)。輝度マスク(mask-mode:
                // luminance)はSafari等で無視されアルファ判定にフォールバックする
                // ため、透過そのものを持たせて全ブラウザで確実に効くようにした
                WebkitMaskImage: `url(${crestSrc})`,
                maskImage: `url(${crestSrc})`,
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
        {/* headingContentRefで実際に必要な高さを計測し、セクションの最小高さに反映する
            (このdiv自体はabsoluteではない普通のflex子要素なので、中身の自然な高さが取れる) */}
        <div ref={headingContentRef} style={effectiveLiftPx ? { transform: `translateY(-${effectiveLiftPx}px)` } : undefined}>
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

          {verticalHeading ? (
            // 見出しの各行を縦書きで1つずつ中央に重ねて表示し、opacityの
            // 入れ替えで切り替える。grid-area指定ですべて同じマス目に
            // 重ねることで、コンテナの高さ・幅が自動的に一番大きい行に
            // 合わせて確保される（JSでの高さ計測が不要になる）
            <div className="grid justify-items-center items-center">
              {lines.map((line, li) => {
                const active = step === li
                // 1コマ目は待たずに現れ、2コマ目以降は直前のコマが完全に消え
                // 終わる(V_LINE_FADE_MS)のを待ってから1文字ずつ浮かび上がる。
                // 消えるときは全文字が同時に(遅延なし・短い時間で)フェードアウトする。
                const enterWaitMs = li === 0 ? 0 : V_LINE_FADE_MS
                return (
                  <div
                    key={li}
                    className="font-serif"
                    style={{
                      gridArea: '1 / 1',
                      writingMode: 'vertical-rl',
                      textOrientation: 'upright',
                      // 写真フェーズの横書き見出し・行1/行2すべてで文字サイズを統一する
                      fontSize: 'clamp(32px, 17px + 3.8vw, 72px)',
                      letterSpacing: '0.08em',
                    }}
                    aria-hidden={!active}
                  >
                    {Array.from(line).map((ch, ci) => {
                      const relDelayMs = enterWaitMs + ci * V_CHAR_STAGGER_MS
                      return (
                        <span
                          key={ci}
                          className="inline-block"
                          style={{
                            opacity: active ? 1 : 0,
                            transform: active ? 'translateY(0) rotateX(0deg)' : 'translateY(22px) rotateX(-55deg)',
                            color: imageActive ? lightColor : darkColor,
                            textShadow: imageActive ? '0 2px 14px rgba(0,0,0,0.5)' : 'none',
                            transitionProperty: 'opacity, transform, color',
                            transitionDuration: active
                              ? `${CHAR_DURATION_MS}ms, ${CHAR_DURATION_MS}ms, 700ms`
                              : `${V_LINE_FADE_MS}ms, ${V_LINE_FADE_MS}ms, 700ms`,
                            transitionTimingFunction: EASE,
                            transitionDelay: active ? `${relDelayMs}ms, ${relDelayMs}ms, 0ms` : '0ms, 0ms, 0ms',
                          }}
                        >
                          {ch}
                        </span>
                      )
                    })}
                  </div>
                )
              })}
              {subheadingLogoSrc && (() => {
                const logoActive = step === lines.length && !verticalImageActive
                return (
                  <div
                    style={{
                      gridArea: '1 / 1',
                      opacity: logoActive ? 1 : 0,
                      transform: step === lines.length ? 'scale(1)' : 'scale(0.94)',
                      transitionProperty: 'opacity, transform',
                      // 直前の行が完全に消え終わってから現れる。写真へ切り替わる
                      // ときは待たずにすぐフェードアウトする
                      transitionDuration: logoActive ? `${V_LOGO_FADE_MS}ms` : '700ms',
                      transitionTimingFunction: EASE,
                      transitionDelay: logoActive ? `${vLogoEnterWaitMs}ms` : '0ms',
                    }}
                    aria-hidden={step !== lines.length}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={subheadingLogoSrc}
                      alt={subheadingLogoAlt ?? ''}
                      className="h-[52vh] sm:h-[60vh] md:h-[66vh] max-h-[680px] w-auto object-contain"
                    />
                  </div>
                )
              })()}
              {/* 写真（カラーページ）に切り替わったら、見出しを横書きで表示する。
                  縦書きの各行・ロゴはここまでで役目を終えているため、
                  写真が現れたタイミングでこれだけがフェードインする */}
              <div
                style={{
                  gridArea: '1 / 1',
                  opacity: verticalImageActive ? 1 : 0,
                  transitionProperty: 'opacity',
                  transitionDuration: '900ms',
                  transitionTimingFunction: EASE,
                  transitionDelay: verticalImageActive ? '250ms' : '0ms',
                }}
                aria-hidden={!verticalImageActive}
              >
                <h1
                  className="font-serif flex flex-col items-center gap-1 md:gap-2"
                  style={{
                    fontSize: 'clamp(32px, 17px + 3.8vw, 72px)',
                    letterSpacing: '0em',
                    color: lightColor,
                    textShadow: '0 2px 14px rgba(0,0,0,0.5)',
                  }}
                >
                  {lines.map((line, li) => (
                    <span key={li} className="block whitespace-nowrap">{line}</span>
                  ))}
                </h1>
                {/* サブキャッチコピー（温泉寺の補足文など）・children（入浴ステータスや
                    ボタン等）は見出しのすぐ下にまとめて表示する。横書きモードでは
                    従来どおり下部グループ（画像下端付近）に表示するため、
                    縦書きモードのときだけここに出す */}
                {midContent && (
                  <div className="mt-[54px]" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))' }}>
                    {midContent}
                  </div>
                )}
                {children && (
                  <div
                    className={`mt-6 ${staggerChildren ? '' : 'transition-opacity ease-out'}`}
                    data-active={imageActive}
                    style={{
                      opacity: staggerChildren ? 1 : (imageActive ? 1 : 0),
                      transitionProperty: staggerChildren ? 'filter' : 'opacity',
                      transitionDuration: '700ms',
                      transitionTimingFunction: EASE,
                      transitionDelay: imageActive ? '450ms' : '0ms',
                      filter: imageActive ? 'drop-shadow(0 2px 10px rgba(0,0,0,0.35))' : 'none',
                    }}
                  >
                    {children}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* フォントサイズはsm/md/lgのブレイクポイントごとに段階的に切り替えていたが、
                  ウィンドウ幅がブレイクポイントをまたぐ瞬間に見出しが急に小さく／大きく
                  なって不自然だったため、clamp()でビューポート幅に応じて連続的に
                  変化するようにした。32px時点はtracking 0emで安全確認済みの値と同じ */}
              <h1
                className="font-serif flex flex-col items-center gap-1 md:gap-2 mb-2 md:mb-3"
                style={{ perspective: '600px', fontSize: 'clamp(32px, 17px + 3.8vw, 72px)', letterSpacing: '0em' }}
              >
                {lines.map((line, li) => (
                  // line-heightやmarginは表示環境によって行間が揺れる問題があったため、
                  // flexのgapで行間を確保する（ブラウザ間・表示倍率で崩れにくい）
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
              {subheadingLogoSrc ? (
                <div
                  style={{
                    opacity: phase === 'text' ? 1 : 0,
                    transitionProperty: 'opacity',
                    transitionDuration: `${SUBHEADING_DURATION_MS}ms`,
                    transitionTimingFunction: EASE,
                    transitionDelay: phase === 'text' ? `${lastCharDoneRelMs + SUBHEADING_GAP_MS}ms` : '0ms',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={subheadingLogoSrc}
                    alt={subheadingLogoAlt ?? ''}
                    className="h-24 sm:h-32 md:h-36 w-auto object-contain mx-auto"
                  />
                </div>
              ) : subheading && (
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
            </>
          )}
        </div>
      </div>

      {/* 見出し類とは別に、写真下部ぎりぎりに寄せる補足文・ボタン等。
          absoluteでセクション下端に固定し、上の見出し中央配置に影響しないようにする */}
      <div
        ref={bottomGroupRef}
        className="absolute inset-x-0 bottom-0 text-center px-4 pb-8 md:pb-10"
        style={(bottomGroupLiftPx || bottomLiftPx) ? { transform: `translateY(-${bottomGroupLiftPx + bottomLiftPx}px)` } : undefined}
      >
        {/* 縦書きモードではmidContentを見出しのすぐ下（上のgridスタック内）に表示するため、
            ここでは横書きモードのときだけ表示する（二重表示を避ける） */}
        {midContent && !verticalHeading && (
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
        {/* 縦書きモードではchildren（入浴ステータス・ボタン等）も見出しのすぐ下
            （上のgridスタック内）に表示するため、ここでは横書きモードのときだけ表示する */}
        {!verticalHeading && (
          <div
            className={`${staggerChildren ? '' : 'transition-opacity ease-out'} ${midContent ? 'mt-8' : ''}`}
            data-active={imageActive}
            style={{
              opacity: staggerChildren ? 1 : (imageActive ? 1 : 0),
              transitionProperty: staggerChildren ? 'filter' : 'opacity',
              transitionDuration: '700ms',
              transitionTimingFunction: EASE,
              transitionDelay: imageActive ? '450ms' : '0ms',
              filter: imageActive ? 'drop-shadow(0 2px 10px rgba(0,0,0,0.35))' : 'none',
            }}
          >
            {children}
          </div>
        )}
      </div>

    </section>
  )
}
