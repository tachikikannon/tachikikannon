export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import HeaderOnsenji from '@/components/HeaderOnsenji'
import FooterOnsenji from '@/components/FooterOnsenji'
import OnsenjiPhotoSelector from './OnsenjiPhotoSelector'
import type { Media } from '@/types'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'onsenjiPhotos' })
  return { title: `${t('title')}` }
}

async function getLendablePhotos(): Promise<Media[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  try {
    const res = await fetch(`${url}/rest/v1/media?is_lendable=eq.true&site=eq.onsenji&select=*&order=created_at.desc`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` }, cache: 'no-store',
    })
    if (!res.ok) return []
    return await res.json()
  } catch { return [] }
}

export default async function OnsenjiPhotosPage() {
  const photos = await getLendablePhotos()
  const t = await getTranslations('onsenjiPhotos')
  const tc = await getTranslations('common')

  return (
    <>
      <HeaderOnsenji />
      <main className="pt-16">
        <div className="bg-onsenji/5 px-4 py-2 text-xs text-gray-400">
          <div className="max-w-5xl mx-auto"><Link href="/onsenji">{tc('breadcrumbHome')}</Link> &gt; {t('title')}</div>
        </div>
        <div className="max-w-5xl mx-auto px-4 py-12">
          <h1 className="text-2xl md:text-3xl font-serif text-onsenji mb-1">{t('title')}</h1>
          <div className="w-10 h-0.5 bg-[#7ec8a4] mb-4" />
          <p className="text-sm text-gray-600 leading-relaxed mb-8">
            {t('intro')}
          </p>

          {photos.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-16">{t('empty')}</p>
          ) : (
            <OnsenjiPhotoSelector photos={photos} />
          )}
        </div>
      </main>
      <FooterOnsenji />
    </>
  )
}
