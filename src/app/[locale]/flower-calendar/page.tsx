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
      { month: '4月上旬～中旬', name: 'コテマリソウ', image: 'https://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786581770470-spjwmgylezd.JPG', desc: '境内' },
      { month: '5月上旬', name: 'シャクナゲ', image: 'https://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786582400445-16qf1g8j60d.JPG', desc: '境内' },
      { month: '5月上旬', name: 'ヤマザクラ', images: 'https://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786583110927-2p9vzi2k9no.JPG\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786585486376-r5cr7xa8un9.JPG\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786585492281-p1bhm1xjfr.JPG\n', desc: '境内' },
      { month: '5月上旬~中旬', name: 'トウゴウミツバツツジ', images: 'https://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786585678065-a1teajz0mm5.JPG\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786585682184-idgcmyi5yxr.JPG\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786585687605-5igo1fizrhj.JPG\n', desc: '境内' },
      { month: '5月中旬', name: 'アズマシャクナゲ', images: 'https://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786585941349-hxqjzinyzmp.jpg\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786585944999-m0khcaftrrc.jpg\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786585949634-n6lv9if0pyf.jpg\n', desc: '境内' },
      { month: '5月下旬', name: 'ホウノキ', images: 'https://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586081151-4zp88abg5d4.JPG', desc: '境内' },
      { month: '5月下旬', name: 'ルピナス', images: 'https://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586099707-0vxuk2uamm9.JPG', desc: '境内' },
      { month: '5月下旬', name: 'レンゲツツジ', images: 'https://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586326924-q7mkq0ky4we.JPG\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586314615-humryfc7ce.JPG\n', desc: '境内' },
      { month: '6月上旬', name: 'ヤマツツジ', images: 'https://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786587011401-8wzj7t3wfok.JPG\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786587020117-abdchotygni.JPG\n', desc: '境内' },
      { month: '7月上旬', name: 'アカショウマ', images: 'https://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586422053-rqqzlxilbg.JPG\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586418300-g3jskw1orcw.JPG\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586413810-7uji2yqzdv7.JPG\n', desc: '境内' },
      { month: '7月上旬', name: 'アヤメ', images: 'https://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586503782-hhxc9vfsibk.JPG\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586509123-54bdol4ebh7.JPG\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586512794-4pamo4r61.JPG\n', desc: '境内' },
      { month: '7月上旬', name: 'ユキノシタ', images: 'https://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586602772-femadxhmejh.JPG\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586611554-bwhok6bge94.JPG\n', desc: '境内' },
      { month: '7月中旬', name: 'クルマユリ', images: 'https://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586688960-lt3s808j2a9.jpg\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586685732-lucys0rv0bf.jpg\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586681888-0f9rxdcsbryb.jpg\n', desc: '境内' },
      { month: '9月上旬', name: 'トリカブト', images: 'https://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586775444-jrjjl3re8fa.jpg\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586781072-00vcowqeyyil.JPG\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586786785-xl3ikbr3fp.JPG\n', desc: '境内' },
      { month: '9月中旬', name: 'サラシナショウマ', images: 'https://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586883722-ypomxhg6v7p.JPG\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586902705-47o5dc3erss.JPG\n', desc: '境内' },
]
const DEFAULT_ITEMS_EN = [
      { month: 'Early to mid April', name: 'Kotemari (Reeves Spirea)', image: 'https://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786581770470-spjwmgylezd.JPG', desc: 'Temple grounds' },
      { month: 'Early May', name: 'Shakunage (Rhododendron)', image: 'https://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786582400445-16qf1g8j60d.JPG', desc: 'Temple grounds' },
      { month: 'Early May', name: 'Yamazakura (Mountain Cherry Blossom)', images: 'https://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786583110927-2p9vzi2k9no.JPG\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786585486376-r5cr7xa8un9.JPG\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786585492281-p1bhm1xjfr.JPG\n', desc: 'Temple grounds' },
      { month: 'Early to mid May', name: 'Togo Mitsuba Azalea', images: 'https://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786585678065-a1teajz0mm5.JPG\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786585682184-idgcmyi5yxr.JPG\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786585687605-5igo1fizrhj.JPG\n', desc: 'Temple grounds' },
      { month: 'Mid May', name: 'Azuma Shakunage (Rhododendron)', images: 'https://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786585941349-hxqjzinyzmp.jpg\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786585944999-m0khcaftrrc.jpg\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786585949634-n6lv9if0pyf.jpg\n', desc: 'Temple grounds' },
      { month: 'Late May', name: 'Honoki (Japanese Bigleaf Magnolia)', images: 'https://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586081151-4zp88abg5d4.JPG', desc: 'Temple grounds' },
      { month: 'Late May', name: 'Lupine', images: 'https://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586099707-0vxuk2uamm9.JPG', desc: 'Temple grounds' },
      { month: 'Late May', name: 'Renge Tsutsuji (Japanese Azalea)', images: 'https://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586326924-q7mkq0ky4we.JPG\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586314615-humryfc7ce.JPG\n', desc: 'Temple grounds' },
      { month: 'Early June', name: 'Yamatsutsuji (Torch Azalea)', images: 'https://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786587011401-8wzj7t3wfok.JPG\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786587020117-abdchotygni.JPG\n', desc: 'Temple grounds' },
      { month: 'Early July', name: 'Akashouma (False Goat\'s Beard)', images: 'https://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586422053-rqqzlxilbg.JPG\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586418300-g3jskw1orcw.JPG\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586413810-7uji2yqzdv7.JPG\n', desc: 'Temple grounds' },
      { month: 'Early July', name: 'Ayame (Iris)', images: 'https://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586503782-hhxc9vfsibk.JPG\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586509123-54bdol4ebh7.JPG\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586512794-4pamo4r61.JPG\n', desc: 'Temple grounds' },
      { month: 'Early July', name: 'Yukinoshita (Strawberry Saxifrage)', images: 'https://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586602772-femadxhmejh.JPG\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586611554-bwhok6bge94.JPG\n', desc: 'Temple grounds' },
      { month: 'Mid July', name: 'Kurumayuri (Wheel Lily)', images: 'https://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586688960-lt3s808j2a9.jpg\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586685732-lucys0rv0bf.jpg\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586681888-0f9rxdcsbryb.jpg\n', desc: 'Temple grounds' },
      { month: 'Early September', name: 'Torikabuto (Monkshood)', images: 'https://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586775444-jrjjl3re8fa.jpg\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586781072-00vcowqeyyil.JPG\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586786785-xl3ikbr3fp.JPG\n', desc: 'Temple grounds' },
      { month: 'Early September', name: 'Sarashina Shouma (Bugbane)', images: 'https://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586883722-ypomxhg6v7p.JPG\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586902705-47o5dc3erss.JPG\n', desc: 'Temple grounds' },
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
            {[
              { icon: '🕐', label: t('quickAbout'), href: '/about' },
              { icon: '🗺️', label: t('quickGrounds'), href: '/grounds' },
            ].map(({ icon, label, href }) => (
              <Link key={href} href={href} className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border shadow-sm hover:bg-navy hover:text-white hover:-translate-y-1 transition-all group">
                <span className="text-2xl">{icon}</span>
                <span className="text-sm font-medium text-navy group-hover:text-white">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
