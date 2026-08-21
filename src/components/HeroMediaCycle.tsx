'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

interface HeroMediaCycleProps {
  imageSrc: string
  imageAlt: string
  videoSrc?: string
  /** 1本目の動画の後に続けて再生する2本目の動画（任意） */
  videoSrc2?: string
  /** 静止画を表示する時間（ミリ秒）。この時間が経つと動画に切り替わる */
  imageDurationMs?: number
  /** 2本目の動画を再生する時間（ミリ秒）。この時間が経つと自動で静止画に戻る */
  video2DurationMs?: number
}

type MediaPhase = 'image' | 'video1' | 'video2'

// トップページのヒーロー背景を「静止画→動画→（2本目の動画）→静止画…」と自動で切り替える。
// 1本目の動画は再生が終わる（onEnded）と2本目（あれば）に、なければ静止画に戻る。
// 2本目の動画は指定秒数が経つと自動で静止画に戻る。videoSrc未指定の場合は
// 従来どおり静止画のみを表示する。
export default function HeroMediaCycle({
  imageSrc, imageAlt, videoSrc, videoSrc2, imageDurationMs = 5000, video2DurationMs = 5000,
}: HeroMediaCycleProps) {
  const [phase, setPhase] = useState<MediaPhase>('image')
  const video1Ref = useRef<HTMLVideoElement>(null)
  const video2Ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!videoSrc || phase !== 'image') return
    const t = setTimeout(() => setPhase('video1'), imageDurationMs)
    return () => clearTimeout(t)
  }, [videoSrc, phase, imageDurationMs])

  useEffect(() => {
    if (phase !== 'video2' || !videoSrc2) return
    const t = setTimeout(() => setPhase('image'), video2DurationMs)
    return () => clearTimeout(t)
  }, [phase, videoSrc2, video2DurationMs])

  const restartPan = (v: HTMLVideoElement) => {
    // スマホ用のパン演出（hero-video-pan / hero-video-pan-vertical、globals.css）を毎回の再生開始時に
    // リスタートさせる。animationをnoneにしてreflowを挟んでから元に戻す定番の方法
    v.style.animation = 'none'
    void v.offsetHeight
    v.style.animation = ''
  }

  useEffect(() => {
    if (phase !== 'video1') return
    const v = video1Ref.current
    if (v) {
      v.currentTime = 0
      v.play().catch(() => {})
      restartPan(v)
    }
  }, [phase])

  useEffect(() => {
    if (phase !== 'video2') return
    const v = video2Ref.current
    if (v) {
      v.currentTime = 0
      v.play().catch(() => {})
      restartPan(v)
    }
    // 5秒経つとphaseは'image'に切り替わるが、動画自体（20秒超の場合もある）は
    // 止めないと裏で再生され続けてしまうので、このphaseを抜けるときに一時停止する
    return () => { v?.pause() }
  }, [phase])

  return (
    <>
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        className="object-cover transition-opacity duration-[1200ms] ease-out"
        style={{ opacity: phase === 'image' ? 1 : 0 }}
        priority
      />
      {videoSrc && (
        <video
          ref={video1Ref}
          src={videoSrc}
          muted
          playsInline
          preload="auto"
          onEnded={() => setPhase(videoSrc2 ? 'video2' : 'image')}
          className="hero-video-pan absolute inset-0 w-full h-full object-cover transition-opacity duration-[1200ms] ease-out"
          style={{ opacity: phase === 'video1' ? 1 : 0 }}
        />
      )}
      {videoSrc2 && (
        <video
          ref={video2Ref}
          src={videoSrc2}
          muted
          playsInline
          preload="auto"
          className="hero-video-pan-vertical absolute inset-0 w-full h-full object-cover transition-opacity duration-[1200ms] ease-out"
          style={{ opacity: phase === 'video2' ? 1 : 0 }}
        />
      )}
    </>
  )
}
