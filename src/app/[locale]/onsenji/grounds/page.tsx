export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import HeaderOnsenji from '@/components/HeaderOnsenji'
import FooterOnsenji from '@/components/FooterOnsenji'
import OnsenjiGroundsSpots from '@/components/OnsenjiGroundsSpots'
import ZoomableImage from '@/components/ZoomableImage'
import { getLocalizedContent } from '@/lib/site-content'
import type { Locale } from '@/i18n/routing'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'onsenjiGrounds' })
  return { title: `${t('title')} | 日光山温泉寺` }
}

const DEFAULT_SPOTS = [
  { name: '温泉寺表参道', image: '/images/onsenji-sandou.png', desc: '石灯籠が並ぶ緑豊かな参道。入浴者用駐車場から境内へと続きます。' },
  { name: '鐘楼', image: '/images/onsenji-syourou.png', desc: '境内に響き渡る鐘の音。早朝には特に厳かな雰囲気を味わえます。' },
  { name: '薬師の湯と本殿の外観', image: '/images/onsenji-gaikan.png', desc: '受付を兼ねた建物と、薬師の湯・本殿の外観。四季折々の景色とともに参拝者を迎えます。' },
  { name: '客殿・休憩室', image: '/images/onsenji-kyukeishitsu.png', desc: '畳敷きの落ち着いた空間で、参拝の合間にひと休みいただけます。' },
  { name: '薬師の湯', image: '/images/onsenji-yakushinoyu-yu.png', desc: '中禅寺湖から湧き出る温泉。参拝後にご利用いただけます。' },
  { name: '本殿（写経・写仏体験会場）', image: '/images/onsenji-kaijou.jpg', desc: 'ご本尊・薬師如来をお祀りする本殿。写経・写仏体験もこちらで行います。' },
]
const DEFAULT_SPOTS_EN = [
  { name: 'Onsenji Main Approach', image: '/images/onsenji-sandou.png', desc: 'A lush approach lined with stone lanterns, leading from the bathers’ parking lot to the grounds.' },
  { name: 'Bell Tower', image: '/images/onsenji-syourou.png', desc: 'The temple bell resonates across the grounds — especially solemn in the early morning.' },
  { name: 'Yakushi-no-Yu & Main Hall Exterior', image: '/images/onsenji-gaikan.png', desc: 'The reception building along with the exterior of Yakushi-no-Yu and the main hall, welcoming visitors amid the changing seasons.' },
  { name: 'Guest Hall & Lounge', image: '/images/onsenji-kyukeishitsu.png', desc: 'A calm tatami-mat space to rest between periods of worship.' },
  { name: 'Yakushi-no-Yu Hot Spring', image: '/images/onsenji-yakushinoyu-yu.png', desc: 'Hot spring water rising near Lake Chuzenji, available for use after worship.' },
  { name: 'Main Hall (Sutra Copying & Image Tracing Venue)', image: '/images/onsenji-kaijou.jpg', desc: 'The main hall enshrining Yakushi Nyorai. Sutra copying and Buddhist image tracing are also held here.' },
]
const DEFAULT_FLOW = [
  { title: '拝観受付（山門）', text: '入口にて拝観料をお納めください。受付は閉門30分前に終了いたします。' },
  { title: '本堂参拝', text: 'ご本尊・薬師如来（医王如来）にお参りください。' },
  { title: '薬師の湯', text: '参拝後は境内の温泉（薬師の湯）をご利用いただけます。足湯・手湯があります。' },
  { title: '御朱印所', text: '御朱印やお守りをお受けいただけます。' },
]
const DEFAULT_FLOW_EN = [
  { title: 'Reception (Temple Gate)', text: 'Please pay the admission fee at the entrance. Reception closes 30 minutes before the gate closes.' },
  { title: 'Worship at the Main Hall', text: 'Please worship the principal image, Yakushi Nyorai (King of Medicine Buddha).' },
  { title: 'Yakushi-no-Yu Hot Spring', text: 'After worship, you may use the hot spring on the grounds. Foot and hand baths are available.' },
  { title: 'Goshuin Stamp Office', text: 'Goshuin stamps and amulets can be received here.' },
]

const DEFAULTS: Record<string, string> = {
  onsenji_grounds_subtitle: '見どころ・薬師の湯・境内マップ',
  onsenji_grounds_subtitle_en: 'Highlights, Yakushi-no-Yu, and the Temple Map',
  onsenji_grounds_heading_map: '境内マップ・主な見どころ',
  onsenji_grounds_heading_map_en: 'Temple Map & Highlights',
  onsenji_grounds_map_hint: '地図上のピンをクリックすると各スポットの詳細が見られます',
  onsenji_grounds_map_hint_en: 'Click a pin on the map to see details for each spot',
  onsenji_grounds_spots: JSON.stringify(DEFAULT_SPOTS),
  onsenji_grounds_spots_en: JSON.stringify(DEFAULT_SPOTS_EN),
  onsenji_grounds_heading_onsen: '薬師の湯（温泉）',
  onsenji_grounds_heading_onsen_en: 'Yakushi-no-Yu (Hot Spring)',
  onsenji_grounds_onsen_text: '境内には令和8年4月11日に開湯した「薬師の湯」があります。泉質は含硫黄‐カルシウム・ナトリウム‐硫酸塩・炭酸水素塩泉（泉温71.4℃）の完全かけ流し。加水すると乳白色に変わる神秘的な湯は、参拝者に開放されています。薬師如来の御加護とともに心身を清めていただけます。',
  onsenji_grounds_onsen_text_en: 'The grounds are home to "Yakushi-no-Yu," which opened on April 11, 2026. Its fully sourced spring water is sulfur–calcium–sodium–sulfate–bicarbonate (71.4°C), turning a mystical milky white when mixed with water, and is open to all visitors. Purify body and mind under the protection of Yakushi Nyorai.',
  onsenji_grounds_heading_flow: '参拝の流れ',
  onsenji_grounds_heading_flow_en: 'Visiting Flow',
  onsenji_grounds_flow: JSON.stringify(DEFAULT_FLOW),
  onsenji_grounds_flow_en: JSON.stringify(DEFAULT_FLOW_EN),
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

export default async function OnsenjGroundsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const loc = locale as Locale
  const t = await getTranslations('onsenjiGrounds')
  const tc = await getTranslations('common')
  const content = await getContent()
  const g = (key: string) => getLocalizedContent(content, key, loc)

  const rawSpots = pj<{ name?: string; image?: string; desc?: string }[]>(g('onsenji_grounds_spots'), DEFAULT_SPOTS)
  // 旧フォーマット（imageなし）の場合はDEFAULT_SPOTSを使用
  const spots = rawSpots.some(s => s.image) ? rawSpots as typeof DEFAULT_SPOTS : DEFAULT_SPOTS
  const flow  = pj<typeof DEFAULT_FLOW>(g('onsenji_grounds_flow'), DEFAULT_FLOW)

  return (
    <>
      <HeaderOnsenji />
      <main className="pt-16">
        <div className="bg-onsenji/5 px-4 py-2 text-xs text-gray-400">
          <div className="max-w-3xl mx-auto">
            <Link href="/onsenji">{tc('breadcrumbHome')}</Link> &gt; {t('title')}
          </div>
        </div>
        <section className="relative h-64 md:h-80">
          <ZoomableImage src="/images/onsenji-gaikan.png" alt={t('title')} fill className="object-cover" />
          <div className="absolute inset-0 bg-onsenji/60 flex flex-col items-center justify-center text-white">
            <h1 className="font-serif text-3xl md:text-4xl tracking-widest">{t('title')}</h1>
            <p className="text-white/70 text-sm mt-2">{g('onsenji_grounds_subtitle')}</p>
          </div>
        </section>
        <div className="max-w-3xl mx-auto px-4 py-12 space-y-14">
          <section>
            <h2 className="text-2xl font-serif text-onsenji mb-1">{g('onsenji_grounds_heading_map')}</h2>
            <div className="w-10 h-0.5 bg-[#7ec8a4] mb-2" />
            <p className="text-xs text-gray-400 mb-6">{g('onsenji_grounds_map_hint')}</p>
            <OnsenjiGroundsSpots spots={spots} />
          </section>
          <section>
            <h2 className="text-2xl font-serif text-onsenji mb-1">{g('onsenji_grounds_heading_onsen')}</h2>
            <div className="w-10 h-0.5 bg-[#7ec8a4] mb-6" />
            <div className="bg-onsenji/10 rounded-2xl p-6 border-l-4 border-[#7ec8a4]">
              <p className="text-sm text-gray-700 leading-loose">{g('onsenji_grounds_onsen_text')}</p>
            </div>
          </section>
          <section>
            <h2 className="text-2xl font-serif text-onsenji mb-1">{g('onsenji_grounds_heading_flow')}</h2>
            <div className="w-10 h-0.5 bg-[#7ec8a4] mb-6" />
            <ol className="relative border-l-2 border-[#7ec8a4] ml-4 space-y-6">
              {flow.map(({ title, text }, i) => (
                <li key={i} className="pl-6 relative">
                  <div className="absolute -left-[19px] top-0 w-9 h-9 rounded-full bg-onsenji text-white flex items-center justify-center text-sm font-serif font-bold">{i + 1}</div>
                  <h3 className="font-medium text-onsenji mb-1">{title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
                </li>
              ))}
            </ol>
          </section>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <Link href="/onsenji/about" className="flex items-center justify-center p-4 bg-white rounded-xl border shadow-sm hover:bg-onsenji hover:text-white transition-all text-sm font-medium text-onsenji">{t('aboutHours')}</Link>
            <Link href="/onsenji/history" className="flex items-center justify-center p-4 bg-white rounded-xl border shadow-sm hover:bg-onsenji hover:text-white transition-all text-sm font-medium text-onsenji">{t('history')}</Link>
          </div>
        </div>
      </main>
      <FooterOnsenji />
    </>
  )
}
