'use client'
import { useState } from 'react'
import Image from 'next/image'

type Swatch = { name: string; image: string; desc: string }

export default function MaterialSwatches({ title, swatches }: { title: string; swatches: Swatch[] }) {
  const [active, setActive] = useState<Swatch | null>(null)

  return (
    <div className="mb-4">
      <p className="text-sm font-medium text-navy mb-3">{title}</p>
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
        {swatches.map(s => (
          <button key={s.name} onClick={() => setActive(active?.name === s.name ? null : s)}
            className="text-center group">
            <div className={`relative w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full overflow-hidden shadow-sm border-2 transition-colors
              ${active?.name === s.name ? 'border-gold' : 'border-white'} ring-1 ring-gray-200 group-hover:ring-gold`}>
              <Image src={s.image} alt={s.name} fill className="object-cover" />
            </div>
            <p className="text-[10px] text-gray-500 mt-1 leading-tight">{s.name}</p>
          </button>
        ))}
      </div>
      {active && (
        <div className="mt-4 bg-white rounded-xl p-4 shadow-sm flex gap-4 items-start">
          <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-gold">
            <Image src={active.image} alt={active.name} fill className="object-cover" />
          </div>
          <div>
            <p className="font-serif text-navy font-medium mb-1">{active.name}</p>
            <p className="text-xs text-gray-600 leading-relaxed">{active.desc}</p>
          </div>
        </div>
      )}
    </div>
  )
}
