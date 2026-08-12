'use client'
import { useEffect, useRef, useState } from 'react'

type Slide = { src: string; alt: string; caption: string }

export default function ChuzenjiGallery({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function stop() {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = null
  }
  function start() {
    stop()
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
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
      {slides.map((s, i) => (
        <img
          key={s.src}
          src={s.src}
          alt={s.alt}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${i === index ? 'opacity-100' : 'opacity-0'}`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-navy/65 via-transparent to-transparent pointer-events-none" />
      <p className="absolute bottom-4 left-4 right-20 text-white text-sm tracking-wide">{slides[index]?.caption}</p>
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
    </div>
  )
}
