'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'

type Spot = { name: string; image: string; desc: string }

// 地図上の各スポット位置（画像サイズ 1053×1493 に対するパーセント、配列順が参拝図の①〜⑥に対応）
const MAP_PINS: { name: string; x: number; y: number }[] = [
  { name: '温泉寺表参道',       x: 39, y: 82 },
  { name: '鐘楼',               x: 29, y: 57 },
  { name: '薬師の湯と本殿の外観', x: 41, y: 48 },
  { name: '客殿・休憩室',       x: 30, y: 31 },
  { name: '薬師の湯',           x: 60, y: 20 },
  { name: '本殿（写経・写仏体験会場）', x: 84, y: 28 },
]

const CIRCLED = ['①','②','③','④','⑤','⑥']
const NUM_BY_NAME: Record<string, string> = Object.fromEntries(MAP_PINS.map(({ name }, i) => [name, CIRCLED[i] ?? '']))

export default function OnsenjiGroundsSpots({ spots }: { spots: Spot[] }) {
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
      {/* インタラクティブ地図 */}
      <div className="relative rounded-xl overflow-hidden shadow-sm mb-10">
        <Image src="/images/onsenji-map.png" alt="温泉寺参拝図" width={1053} height={1493} className="w-full h-auto" />
        {MAP_PINS.map(({ name, x, y }) => {
          const spot = spots.find(s => s.name === name)
          if (!spot) return null
          return (
            <button key={name}
              onClick={() => setActive(spot)}
              style={{ left: `${x}%`, top: `${y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group w-11 h-11 flex items-center justify-center cursor-pointer">
              {/* ホバー時ラベル */}
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap bg-onsenji text-white text-xs px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {NUM_BY_NAME[name]} {name}
              </span>
            </button>
          )
        })}
      </div>

      {/* カードグリッド */}
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
              <p className="font-serif font-medium text-onsenji text-sm mb-1">{NUM_BY_NAME[spot.name]} {spot.name}</p>
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
              <h3 className="font-serif text-onsenji text-xl mb-3">{NUM_BY_NAME[active.name]} {active.name}</h3>
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
