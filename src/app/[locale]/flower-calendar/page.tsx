export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ZoomableImage from '@/components/ZoomableImage'
import FlowerGrid from '@/components/FlowerGrid'
import { getLocalizedContent } from '@/lib/site-content'
import type { Locale } from '@/i18n/routing'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'flowerCalendar' })
  return { title: t('title') }
}

const DEFAULT_ITEMS = [
  { month: '準備中', name: '花ごよみ、只今準備中です', images: '', desc: '境内で見られる季節の花の情報を、只今準備しております。今しばらくお待ちください。' },
]
const DEFAULT_ITEMS_EN = [
  { month: 'Coming Soon', name: 'Flower Calendar — Coming Soon', images: '', desc: 'We are currently preparing information about the seasonal flowers found on our grounds. Please check back soon.' },
]

const DEFAULTS: Record<string, string> = {
  flower_calendar_subtitle: '境内を彩る、四季折々の花',
  flower_calendar_subtitle_en: 'Seasonal flowers around the temple grounds',
  flower_calendar_items: JSON.stringify(DEFAULT_ITEMS),
  flower_calendar_items_en: JSON.stringify(DEFAULT_ITEMS_EN),
}

function pj<T>(s: string, fallback: T): T { try { return JSON.parse(s) } catch { return fallback } }

async function getContent() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  try {
    const keys = Object.keys(DEFAULTS).join(',')
    const res = await fetch(`${url}/rest/v1/site_content?key=in.(${keys})&select=key,value`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` }, cache: 'no-store',
    })
    if (!res.ok) return DEFAULTS
    const rows: { key: string; value: string }[] = await res.json()
    const map = { ...DEFAULTS }
    rows.forEach(r => { if (r.value) map[r.key] = r.value })
    return map
  } catch { return DEFAULTS }
}

export default async function FlowerCalendarPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const loc = locale as Locale
  const t = await getTranslations('flowerCalendar')
  const tc = await getTranslations('common')
  const content = await getContent()
  const g = (key: string) => getLocalizedContent(content, key, loc)
  type FlowerItem = { month: string; name: string; desc: string; images?: string; image?: string }
  const items = pj<FlowerItem[]>(g('flower_calendar_items'), DEFAULT_ITEMS)

  return (
    <>
      <Header />
      <main className="pt-16">
        <div className="bg-cream-alt px-4 py-2 text-xs text-gray-400">
          <div className="max-w-3xl mx-auto"><Link href="/">{tc('breadcrumbHome')}</Link> &gt; {t('title')}</div>
        </div>
        <section className="relative h-64 md:h-80">
          <ZoomableImage src="https://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586503782-hhxc9vfsibk.JPG" alt={t('title')} fill className="object-cover" />
          <div className="absolute inset-0 bg-navy/60 flex flex-col items-center justify-center text-white">
            <h1 className="font-serif text-3xl md:text-4xl tracking-widest">{t('title')}</h1>
            <p className="text-white/70 text-sm mt-2">{g('flower_calendar_subtitle')}</p>
          </div>
        </section>
        <div className="max-w-3xl mx-auto px-4 py-12 space-y-10">
          <FlowerGrid items={items} monthLabel={t('monthLabel')} />
          <div className="grid grid-cols-2 gap-4 pt-4">
            <Link href="/about" className="flex items-center justify-center gap-2 p-4 bg-white rounded-xl border shadow-sm hover:bg-navy hover:text-white transition-all text-sm font-medium text-navy">{t('quickAbout')}</Link>
            <Link href="/grounds" className="flex items-center justify-center gap-2 p-4 bg-white rounded-xl border shadow-sm hover:bg-navy hover:text-white transition-all text-sm font-medium text-navy">{t('quickGrounds')}</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
