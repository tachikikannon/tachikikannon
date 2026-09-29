'use client'
import Image, { type ImageProps } from 'next/image'
import { useState } from 'react'

// next/image の代わりに使う。Vercelの画像変換が失敗した場合（無料枠の上限到達で
// 402が返る等）に、変換なしの元画像へ自動で切り替えて「画像が表示されない」状態を防ぐ。
export default function SafeImage(props: ImageProps) {
  const [fallback, setFallback] = useState(false)
  return (
    <Image
      {...props}
      unoptimized={fallback || props.unoptimized}
      onError={e => {
        if (!fallback && !props.unoptimized) setFallback(true)
        props.onError?.(e)
      }}
    />
  )
}
