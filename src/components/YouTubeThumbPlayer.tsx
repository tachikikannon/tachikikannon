'use client'
import { useState } from 'react'

type Props = {
  videoId: string
  alt: string
  className?: string
}

// サムネイル＋再生ボタンを表示し、クリックしたらYouTube動画をポップアップ再生する
export default function YouTubeThumbPlayer({ videoId, alt, className }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`${alt} を再生`}
        className={`relative group block w-full ${className ?? ''}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
          alt={alt}
          className="w-full h-full object-cover"
        />
        <span className="absolute inset-0 bg-navy/20 group-hover:bg-navy/30 transition-colors" />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="w-16 h-16 rounded-full bg-white/90 group-hover:bg-white flex items-center justify-center shadow-lg transition-colors">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-navy translate-x-0.5" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div className="relative w-full max-w-4xl aspect-video" onClick={e => e.stopPropagation()}>
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
              title={alt}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="閉じる"
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 text-gray-700 flex items-center justify-center text-xl hover:bg-white transition-colors"
          >
            ×
          </button>
        </div>
      )}
    </>
  )
}
