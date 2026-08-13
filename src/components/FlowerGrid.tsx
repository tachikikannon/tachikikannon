'use client'
import { useState } from 'react'
import Image from 'next/image'

type FlowerItem = { month: string; name: string; desc: string; images?: string; image?: string }

export default function FlowerGrid({ items, monthLabel }: { items: FlowerItem[]; monthLabel: string }) {
  const [selected, setSelected] = useState<number | null>(null)

  const parsed = items.map(({ month, name, desc, images, image }) => ({
    month,
    name,
    desc,
    photos: (images || image || '').split('\n').map(s => s.trim()).filter(Boolean),
  }))

  return (
    <>
      <div className="grid grid-cols-3 gap-1">
        {parsed.map((item, i) => item.photos[0] && (
          <button
            key={i}
            type="button"
            onClick={() => setSelected(i)}
            className="relative aspect-square block group overflow-hidden"
          >
            <Image src={item.photos[0]} alt={item.name} fill className="object-cover group-hover:opacity-90 transition-opacity" />
            <span className="absolute top-1.5 right-1.5 bg-black/55 text-white text-[10px] px-1.5 py-0.5 rounded leading-none whitespace-nowrap">
              {item.month}
            </span>
          </button>
        ))}
      </div>

      {selected !== null && (() => {
        const item = parsed[selected]
        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <div
              className="relative w-full max-w-sm bg-white rounded-2xl overflow-hidden shadow-lg"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative aspect-square bg-cream-alt">
                {item.photos[0] && (
                  <Image src={item.photos[0]} alt={item.name} fill className="object-cover" />
                )}
              </div>
              <div className="p-5">
                <p className="text-xs text-gold font-medium mb-1">{monthLabel}：{item.month}</p>
                <h3 className="font-serif text-navy mb-2">{item.name}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                aria-label="閉じる"
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 text-gray-700 flex items-center justify-center text-lg hover:bg-white transition-colors"
              >
                ×
              </button>
            </div>
          </div>
        )
      })()}
    </>
  )
}
