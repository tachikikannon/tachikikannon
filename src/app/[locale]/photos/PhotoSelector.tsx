'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import ZoomableImage from '@/components/ZoomableImage'
import type { Media } from '@/types'

export default function PhotoSelector({ photos }: { photos: Media[] }) {
  const t = useTranslations('photos')
  const [selected, setSelected] = useState<string[]>([])

  function toggle(id: string) {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  return (
    <>
      <p className="text-xs text-gray-500 mb-4">{t('selectHint')}</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 pb-20">
        {photos.map((item, i) => {
          const isSelected = selected.includes(item.id)
          return (
            <div key={item.id}
              className={`bg-white rounded-xl shadow-sm overflow-hidden border-2 transition-colors ${isSelected ? 'border-navy' : 'border-transparent'}`}>
              <div className="relative h-36">
                <ZoomableImage src={item.public_url} alt={`貸出用写真 ${i + 1}`} fill className="object-cover" />
              </div>
              <div className="p-3">
                <p className="text-xs text-gray-600 mb-2">{t('photoLabel')} {i + 1}</p>
                <label className={`flex items-center justify-center gap-1.5 text-xs px-3 py-2 rounded-full border cursor-pointer transition-colors
                  ${isSelected ? 'bg-navy text-white border-navy' : 'bg-white text-navy border-navy hover:bg-navy/5'}`}>
                  <input type="checkbox" className="sr-only" checked={isSelected} onChange={() => toggle(item.id)} />
                  {isSelected ? t('selectedLabel') : t('selectLabel')}
                </label>
              </div>
            </div>
          )
        })}
      </div>

      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <p className="text-sm text-gray-600">{selected.length}{t('selectedCountUnit')}</p>
          {selected.length > 0 ? (
            <Link href={`/apply?category=${encodeURIComponent('写真使用・貸出し許可申請')}&photo=${encodeURIComponent(selected.join(','))}`}
              className="px-6 py-2.5 bg-navy text-white text-sm rounded-full hover:bg-navy/80 transition-colors whitespace-nowrap">
              {t('applySelectedCta')}
            </Link>
          ) : (
            <span className="px-6 py-2.5 bg-gray-200 text-gray-400 text-sm rounded-full whitespace-nowrap">
              {t('applySelectedCta')}
            </span>
          )}
        </div>
      </div>
    </>
  )
}
