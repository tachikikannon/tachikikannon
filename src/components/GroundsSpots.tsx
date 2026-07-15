'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'

type Spot = { name: string; image: string; desc: string }

export default function GroundsSpots({ spots }: { spots: Spot[] }) {
  const [active, setActive] = useState<Spot | null>(null)

  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setActive(null) }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [active])

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {spots.map((spot, i) => (
          <button key={i} onClick={() => setActive(spot)}
            className="bg-white rounded-xl overflow-hidden shadow-sm text-left hover:shadow-md hover:-translate-y-1 transition-all cursor-zoom-in">
            {spot.image && (
              <div className="relative h-44">
                <Image src={spot.image} alt={spot.name} fill className="object-cover" />
              </div>
            )}
            <div className="p-3">
              <p className="font-serif font-medium text-navy text-sm mb-1">{spot.name}</p>
              {spot.desc && <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">{spot.desc}</p>}
            </div>
          </button>
        ))}
      </div>

      {active && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setActive(null)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl max-w-lg w-full"
            onClick={e => e.stopPropagation()}>
            {active.image && (
              <div className="relative h-64 md:h-80">
                <Image src={active.image} alt={active.name} fill className="object-cover" />
              </div>
            )}
            <div className="p-6">
              <h3 className="font-serif text-navy text-xl mb-3">{active.name}</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{active.desc}</p>
            </div>
            <button onClick={() => setActive(null)}
              className="absolute -top-4 -right-4 w-9 h-9 rounded-full bg-white shadow-lg text-gray-700 flex items-center justify-center hover:bg-gray-100 transition-colors text-xl font-light">
              ×
            </button>
          </div>
        </div>
      )}
    </>
  )
}
