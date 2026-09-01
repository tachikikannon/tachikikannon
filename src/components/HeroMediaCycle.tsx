'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { useHeroRevealed } from '@/components/HeroReveal'

interface HeroMediaCycleProps {
  imageSrc: string
  imageAlt: string
  /** 1本目の動画（左→右パン） */
  videoSrc?: string
  /** 2本目の動画（1本目の後に続けて再生、左→右パン） */
  videoSrc2?: string
  /** 3本目の動画（2本目の後に続けて再生、上→下パン） */
  videoSrc3?: string
  /** 静止画を表示する時間（ミリ秒）。この時間が経つと動画に切り替わる */
  imageDurationMs?: number
  /**
   * イベント告知用の1枚（例: 夜間参拝）。指定すると最初の静止画の直後に挿入され、
   * クリックするとeventHrefに遷移する（他のフェーズはクリック不可のまま）。
   * イベント終了後はこのpropとeventHref/eventAltを渡すのをやめれば元の並びに戻る。
   */
  eventImageSrc?: string
  eventImageAlt?: string
  eventHref?: string
  /** イベント写真を表示する時間（ミリ秒） */
  eventDurationMs?: number
}

type MediaPhase = 'image' | 'event' | 'video1' | 'video2' | 'video3'

// トップページのヒーロー背景を「静止画→動画1→動画2→動画3→静止画…」と自動で切り替える。
// 各動画はあらかじめ表示したい長さぴったりに書き出してあるので、再生が終わる
// （onEnded）と次の動画に切り替わるだけでよい。videoSrc2・videoSrc3が未指定なら
// そこで打ち切って静止画に戻る（例: 3本目が無ければ2本目の後は静止画に戻る）。
export default function HeroMediaCycle({
  imageSrc, imageAlt, videoSrc, videoSrc2, videoSrc3, imageDurationMs = 5000,
  eventImageSrc, eventImageAlt, eventHref, eventDurationMs = 4000,
}: HeroMediaCycleProps) {
  const [phase, setPhase] = useState<MediaPhase>('image')
  const video1Ref = useRef<HTMLVideoElement>(null)
  const video2Ref = useRef<HTMLVideoElement>(null)
  const video3Ref = useRef<HTMLVideoElement>(null)
  // HeroRevealの白背景演出が終わって写真が実際に見えたタイミング（Context経由）。
  // これがtrueになるまでは静止画のまま待機し、演出中に裏でタイマーが進んで
  // 写真が見えた瞬間には既に動画フェーズに入っている…という食い違いを防ぐ
  const revealed = useHeroRevealed()

  useEffect(() => {
    if (!revealed || phase !== 'image') return
    const next = eventImageSrc ? 'event' : videoSrc ? 'video1' : null
    if (!next) return
    const t = setTimeout(() => setPhase(next), imageDurationMs)
    return () => clearTimeout(t)
  }, [revealed, videoSrc, eventImageSrc, phase, imageDurationMs])

  useEffect(() => {
    if (phase !== 'event') return
    const t = setTimeout(() => setPhase(videoSrc ? 'video1' : 'image'), eventDurationMs)
    return () => clearTimeout(t)
  }, [phase, videoSrc, eventDurationMs])

  const restartPan = (v: HTMLVideoElement) => {
    // スマホ用のパン演出（hero-video-pan、globals.css）を毎回の再生開始時に
    // リスタートさせる。animationをnoneにしてreflowを挟んでから元に戻す定番の方法
    v.style.animation = 'none'
    void v.offsetHeight
    v.style.animation = ''
  }

  useEffect(() => {
    if (phase !== 'video1') return
    const v = video1Ref.current
    if (v) { v.currentTime = 0; v.play().catch(() => {}); restartPan(v) }
    // 動画1の再生中（8秒）にバックグラウンドで動画2を読み込んでおく
    video2Ref.current?.load()
  }, [phase])

  useEffect(() => {
    if (phase !== 'video2') return
    const v = video2Ref.current
    if (v) { v.currentTime = 0; v.play().catch(() => {}); restartPan(v) }
    // 動画2の再生中（8秒）にバックグラウンドで動画3を読み込んでおく
    video3Ref.current?.load()
  }, [phase])

  useEffect(() => {
    if (phase !== 'video3') return
    const v = video3Ref.current
    if (v) { v.currentTime = 0; v.play().catch(() => {}); restartPan(v) }
  }, [phase])

  return (
    <>
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        className="object-cover transition-opacity duration-[1200ms] ease-out pointer-events-none"
        style={{ opacity: phase === 'image' ? 1 : 0 }}
        priority
      />
      {eventImageSrc && (
        <Link
          href={eventHref ?? '#'}
          aria-label={eventImageAlt}
          className="absolute inset-0 transition-opacity duration-[1200ms] ease-out"
          style={{ opacity: phase === 'event' ? 1 : 0, pointerEvents: phase === 'event' ? 'auto' : 'none' }}
        >
          <Image src={eventImageSrc} alt={eventImageAlt ?? ''} fill className="object-cover" />
        </Link>
      )}
      {videoSrc && (
        <video
          ref={video1Ref}
          src={videoSrc}
          muted
          playsInline
          preload="auto"
          onEnded={() => setPhase(videoSrc2 ? 'video2' : 'image')}
          className="hero-video-pan absolute inset-0 w-full h-full object-cover transition-opacity duration-[1200ms] ease-out pointer-events-none"
          style={{ opacity: phase === 'video1' ? 1 : 0 }}
        />
      )}
      {videoSrc2 && (
        <video
          ref={video2Ref}
          src={videoSrc2}
          muted
          playsInline
          preload="none"
          onEnded={() => setPhase(videoSrc3 ? 'video3' : 'image')}
          className="hero-video-pan absolute inset-0 w-full h-full object-cover transition-opacity duration-[1200ms] ease-out pointer-events-none"
          style={{ opacity: phase === 'video2' ? 1 : 0 }}
        />
      )}
      {videoSrc3 && (
        <video
          ref={video3Ref}
          src={videoSrc3}
          muted
          playsInline
          preload="none"
          onEnded={() => setPhase('image')}
          className="hero-video-fixed-crop absolute inset-0 w-full h-full object-cover transition-opacity duration-[1200ms] ease-out pointer-events-none"
          style={{ opacity: phase === 'video3' ? 1 : 0 }}
        />
      )}
    </>
  )
}
