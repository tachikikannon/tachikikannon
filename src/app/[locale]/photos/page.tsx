export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ZoomableImage from '@/components/ZoomableImage'
import type { Media } from '@/types'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'photos' })
  return { title: t('title') }
}

async function getLendablePhotos(): Promise<Media[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  try {
    const res = await fetch(`${url}/rest/v1/media?is_lendable=eq.true&site=eq.chuzenji&select=*&order=created_at.desc`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` }, cache: 'no-store',
    })
    if (!res.ok) return []
    return await res.json()
  } catch { return [] }
}

export default async function PhotosPage() {
  const photos = await getLendablePhotos()
  const t = await getTranslations('photos')
  const tc = await getTranslations('common')

  return (
    <>
      <Header />
      <main className="pt-16">
        <div className="bg-cream-alt px-4 py-2 text-xs text-gray-400">
          <div className="max-w-5xl mx-auto"><Link href="/">{tc('breadcrumbHome')}</Link> &gt; {t('title')}</div>
        </div>
        <div className="max-w-5xl mx-auto px-4 py-12">
          <h1 className="text-2xl md:text-3xl font-serif text-navy mb-1">{t('title')}</h1>
          <div className="w-10 h-0.5 bg-gold mb-4" />
          <p className="text-sm text-gray-600 leading-relaxed mb-8">
            {t('intro')}
          </p>

          {photos.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-16">{t('empty')}</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
              {photos.map((item, i) => (
                <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden border">
                  <div className="relative h-36">
                    <ZoomableImage src={item.public_url} alt={`貸出用写真 ${i + 1}`} fill className="object-cover" />
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-gray-600 mb-2">{t('photoLabel')} {i + 1}</p>
                    <Link href={`/apply?category=${encodeURIComponent('写真使用・貸出し許可申請')}&photo=${encodeURIComponent(item.id)}`}
                      className="block text-center text-xs px-3 py-2 bg-navy text-white rounded-full hover:bg-navy/80 transition-colors">
                      {t('applyCta')}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
