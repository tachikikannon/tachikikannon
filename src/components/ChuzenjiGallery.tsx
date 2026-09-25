'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

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
        <Image src={slide.src} alt={slide.alt} fill sizes="(min-width: 896px) 896px, 100vw" className="object-contain" />
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
  // 一度表示した(または次に表示する)スライドだけ<img>を出す。全スライドを最初から
  // 描画すると、opacity-0でも全写真がページ表示時にダウンロードされてしまい、
  // Supabase Storageの転送量(Cached Egress)を大きく消費していた。
  const [seen, setSeen] = useState<Set<number>>(() => new Set([0, 1]))
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

  // 次のスライドを先読みしておき、フェード切替時に空白が出ないようにする
  useEffect(() => {
    const next = (index + 1) % slides.length
    setSeen(prev => (prev.has(index) && prev.has(next)) ? prev : new Set(prev).add(index).add(next))
  }, [index, slides.length])

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
        {slides.map((s, i) => seen.has(i) && (
          <Image
            key={s.src}
            src={s.src}
            alt={s.alt}
            fill
            sizes="(min-width: 1024px) 512px, (min-width: 768px) 50vw, 100vw"
            className={`object-cover transition-opacity duration-1000 ease-in-out ${i === index ? 'opacity-100' : 'opacity-0'}`}
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
