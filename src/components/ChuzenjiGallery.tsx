'use client'
import { useEffect, useRef, useState } from 'react'

type Slide = { src: string; alt: string; caption: string; month?: string }

function Lightbox({ slide, onClose }: { slide: Slide; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}>
      <div className="relative w-full h-full max-w-4xl max-h-[85vh]" onClick={e => e.stopPropagation()}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={slide.src} alt={slide.alt} className="w-full h-full object-contain" />
        {slide.caption && (
          <p className="absolute -bottom-8 left-0 right-0 text-center text-white/80 text-sm">{slide.caption}</p>
        )}
      </div>
      <button onClick={onClose} aria-label="閉じる"
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 text-gray-700 flex items-center justify-center text-xl hover:bg-white transition-colors">
        ×
      </button>
    </div>
  )
}

export default function ChuzenjiGallery({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0)
  const [open, setOpen] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function stop() {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = null
  }
  function start() {
    stop()
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (open) return
    timerRef.current = setInterval(() => {
      setIndex(i => (i + 1) % slides.length)
    }, 4200)
  }

  useEffect(() => {
    start()
    return stop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      className="relative h-72 md:h-[26rem] rounded-xl overflow-hidden shadow-sm"
      onMouseEnter={stop}
      onMouseLeave={start}
    >
      <button
        type="button"
        onClick={() => { stop(); setOpen(true) }}
        aria-label="写真を拡大表示"
        className="absolute inset-0 w-full h-full block group cursor-zoom-in"
      >
        {slides.map((s, i) => (
          <img
            key={s.src}
            src={s.src}
            alt={s.alt}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${i === index ? 'opacity-100' : 'opacity-0'}`}
          />
        ))}
        <span className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
      </button>
      {slides[index]?.month && (
        <div className="absolute top-3 right-3 bg-black/50 border border-white/40 rounded px-2 py-1 pointer-events-none">
          <span className="text-white text-[11px] tracking-wide">{slides[index].month}</span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-navy/65 via-transparent to-transparent pointer-events-none" />
      <p className="absolute bottom-4 left-4 right-20 text-white text-sm tracking-wide pointer-events-none">{slides[index]?.caption}</p>
      <div className="absolute bottom-4 right-4 flex gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`${i + 1}枚目を表示`}
            onClick={() => { setIndex(i); start() }}
            className={`w-1.5 h-1.5 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${i === index ? 'bg-gold' : 'bg-white/50 hover:bg-white/80'}`}
          />
        ))}
      </div>
      {open && slides[index] && (
        <Lightbox slide={slides[index]} onClose={() => { setOpen(false); start() }} />
      )}
    </div>
  )
}
