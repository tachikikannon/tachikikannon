'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

interface HeroMediaCycleProps {
  imageSrc: string
  imageAlt: string
  videoSrc?: string
  /** 静止画を表示する時間（ミリ秒）。この時間が経つと動画に切り替わる */
  imageDurationMs?: number
}

// トップページのヒーロー背景を「静止画→動画→静止画→動画…」と自動で切り替える。
// 動画は指定秒数の再生が終わる（onEnded）と自動で静止画に戻る。videoSrc未指定の場合は
// 従来どおり静止画のみを表示する。
export default function HeroMediaCycle({ imageSrc, imageAlt, videoSrc, imageDurationMs = 5000 }: HeroMediaCycleProps) {
  const [showVideo, setShowVideo] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!videoSrc || showVideo) return
    const t = setTimeout(() => setShowVideo(true), imageDurationMs)
    return () => clearTimeout(t)
  }, [videoSrc, showVideo, imageDurationMs])

  useEffect(() => {
    if (!showVideo) return
    const v = videoRef.current
    if (v) {
      v.currentTime = 0
      v.play().catch(() => {})
      // スマホ用の左→右パン演出（hero-video-pan、globals.css）を毎回の再生開始時に
      // リスタートさせる。animationをnoneにしてreflowを挟んでから元に戻す定番の方法
      v.style.animation = 'none'
      void v.offsetHeight
      v.style.animation = ''
    }
  }, [showVideo])

  return (
    <>
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        className="object-cover transition-opacity duration-[1200ms] ease-out"
        style={{ opacity: showVideo ? 0 : 1 }}
        priority
      />
      {videoSrc && (
        <video
          ref={videoRef}
          src={videoSrc}
          muted
          playsInline
          preload="auto"
          onEnded={() => setShowVideo(false)}
          className="hero-video-pan absolute inset-0 w-full h-full object-cover transition-opacity duration-[1200ms] ease-out"
          style={{ opacity: showVideo ? 1 : 0 }}
        />
      )}
    </>
  )
}
