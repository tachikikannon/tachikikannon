export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ZoomableImage from '@/components/ZoomableImage'
import { getLocalizedContent } from '@/lib/site-content'
import type { Locale } from '@/i18n/routing'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'history' })
  return { title: t('title') }
}

const DEFAULT_TIMELINE = [
  { year: '784年（延暦3年）', title: '勝道上人による開山', text: '勝道上人が中禅寺湖畔に立木観音を刻み、中禅寺を創建。日光山修験道の霊場として栄え始める。' },
  { year: '810年（弘仁元年）', title: '空海（弘法大師）参詣', text: '弘法大師が中禅寺に参詣したと伝わる。真言密教の聖地としての性格が強まる。' },
  { year: '1627年（寛永4年）', title: '天海大僧正による復興', text: '江戸幕府の庇護のもと、天海大僧正によって伽藍が整備・復興される。' },
  { year: '明治時代', title: '外国公使の避暑地として', text: '明治以降、中禅寺湖畔は各国外交官の夏の避暑地として栄え、中禅寺も国際的に知られるようになる。' },
  { year: '現在', title: '関東屈指の観音霊場', text: '関東有数の観音霊場として多くの参拝者が訪れる。坂東三十三観音霊場の第十八番札所にも数えられる。' },
]
const DEFAULT_TIMELINE_EN = [
  { year: '784 CE (Enryaku 3)', title: 'Founded by Priest Shodo', text: 'Priest Shodo carved the Tachiki Kannon on the shore of Lake Chuzenji, founding the temple. It began to flourish as a sacred site of Nikko mountain asceticism.' },
  { year: '810 CE (Konin 1)', title: 'Visit by Kukai (Kobo Daishi)', text: 'Kobo Daishi is said to have visited Chuzenji, strengthening its character as a sacred site of Shingon esoteric Buddhism.' },
  { year: '1627 (Kan\'ei 4)', title: 'Restoration by Tenkai', text: 'Under the protection of the Edo shogunate, the temple complex was maintained and restored by the great priest Tenkai.' },
  { year: 'Meiji Era', title: 'A Summer Retreat for Foreign Envoys', text: 'From the Meiji era onward, the shore of Lake Chuzenji flourished as a summer retreat for diplomats from various countries, and Chuzenji became known internationally.' },
  { year: 'Today', title: 'A Leading Kannon Pilgrimage Site in Kanto', text: 'Chuzenji draws many visitors as one of the leading Kannon pilgrimage sites in the Kanto region, and is counted as the 18th sacred site of the Bando 33 Kannon Pilgrimage.' },
]

const DEFAULTS: Record<string, string> = {
  history_subtitle: '日光山中禅寺の由緒と縁起',
  history_subtitle_en: 'The History and Origins of Nikkozan Chuzenji',
  history_heading_founding: '創建の由来',
  history_heading_founding_en: 'Origins of the Founding',
  history_heading_timeline: '歴史の流れ',
  history_heading_timeline_en: 'Timeline',
  history_heading_honzon: 'ご本尊・千手観世音菩薩',
  history_heading_honzon_en: 'About the Principal Image, the Thousand-Armed Kannon',
  history_heading_bando: '坂東三十三観音 第十八番札所',
  history_heading_bando_en: 'The 18th Site of the Bando 33 Kannon Pilgrimage',
  history_founding_p1: '日光山中禅寺は、784年（延暦3年）、勝道上人によって開かれました。勝道上人は日光山を開いた高僧であり、幾多の困難を乗り越えながら男体山に登頂し、山頂で大日如来を感得したとされています。',
  history_founding_p1_en: 'Nikkozan Chuzenji was founded in 784 CE (Enryaku 3) by the priest Shodo. Shodo, the high priest who opened Mt. Nikko, is said to have overcome many hardships to reach the summit of Mt. Nantai, where he attained a vision of Dainichi Nyorai.',
  history_founding_p2: '中禅寺湖のほとりに建てられた本堂には、上人が湖畔に立つ桂の立木に直接刻んだと伝わる千手観世音菩薩が祀られています。木を切り倒すことなく、立ったままの木に彫り上げたことから「立木観音」と呼ばれ、今日まで人々の信仰を集めてきました。',
  history_founding_p2_en: 'The main hall, built on the shore of Lake Chuzenji, enshrines the thousand-armed Kannon Bodhisattva, said to have been carved directly by Shodo into a katsura tree standing at the lakeshore. Because the tree was carved while still standing, without being felled, it came to be called "Tachiki Kannon" (Standing-Tree Kannon), and has drawn devotion ever since.',
  history_timeline: JSON.stringify(DEFAULT_TIMELINE),
  history_timeline_en: JSON.stringify(DEFAULT_TIMELINE_EN),
  history_honzon: 'ご本尊の千手観世音菩薩は、高さ約6メートルに及ぶ大きな仏様です。勝道上人が湖畔の桂の立木に直接刻んだとされ、木は今も根を張ったまま祀られています。千の手で人々のあらゆる願いを救い、千の眼で衆生の苦しみを見守るとされる観音様は、縁結び・病気平癒・学業成就など様々なご利益があるとされています。',
  history_honzon_en: 'The principal image, the thousand-armed Kannon Bodhisattva, stands roughly 6 meters tall. It is said to have been carved directly by Priest Shodo into a katsura tree at the lakeshore, and the tree remains rooted in the earth to this day. Kannon, who is said to save every wish with her thousand hands and watch over all suffering with her thousand eyes, is believed to grant blessings including matchmaking, recovery from illness, and success in studies.',
  history_bando: '中禅寺立木観音は、関東・東北一円にわたる坂東三十三観音霊場の第十八番札所に数えられています。多くの巡礼者がこの地を訪れ、千手観世音菩薩に手を合わせてきました。',
  history_bando_en: 'Chuzenji Tachiki Kannon is counted as the 18th sacred site of the Bando 33 Kannon Pilgrimage, spanning the Kanto and Tohoku regions. Many pilgrims have visited this place to pray before the thousand-armed Kannon Bodhisattva.',
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

export default async function HistoryPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const loc = locale as Locale
  const t = await getTranslations('history')
  const tc = await getTranslations('common')
  const content = await getContent()
  const g = (key: string) => getLocalizedContent(content, key, loc)
  const timeline = pj<typeof DEFAULT_TIMELINE>(g('history_timeline'), DEFAULT_TIMELINE)

  return (
    <>
      <Header />
      <main className="pt-16">
        <div className="bg-cream-alt px-4 py-2 text-xs text-gray-400">
          <div className="max-w-3xl mx-auto"><Link href="/">{tc('breadcrumbHome')}</Link> &gt; {t('title')}</div>
        </div>
        <section className="relative h-64 md:h-80">
          <ZoomableImage src="/images/dragon.jpg" alt={t('title')} fill className="object-cover" />
          <div className="absolute inset-0 bg-navy/60 flex flex-col items-center justify-center text-white">
            <h1 className="font-serif text-3xl md:text-4xl tracking-widest">{t('title')}</h1>
            <p className="text-white/70 text-sm mt-2">{g('history_subtitle')}</p>
          </div>
        </section>
        <div className="max-w-3xl mx-auto px-4 py-12 space-y-14">
          <section>
            <h2 className="text-2xl font-serif text-navy mb-1">{g('history_heading_founding')}</h2>
            <div className="w-10 h-0.5 bg-gold mb-6" />
            <div className="prose prose-sm max-w-none text-gray-700 leading-loose space-y-4">
              <p>{g('history_founding_p1')}</p>
              <p>{g('history_founding_p2')}</p>
            </div>
          </section>
          <section>
            <h2 className="text-2xl font-serif text-navy mb-1">{g('history_heading_timeline')}</h2>
            <div className="w-10 h-0.5 bg-gold mb-6" />
            <ol className="relative border-l-2 border-gold ml-4 space-y-8">
              {timeline.map(({ year, title, text }, i) => (
                <li key={i} className="pl-6 relative">
                  <div className="absolute -left-[19px] top-0 w-9 h-9 rounded-full bg-navy text-white flex items-center justify-center text-xs font-bold">{i + 1}</div>
                  <p className="text-xs text-gold font-medium mb-0.5">{year}</p>
                  <h3 className="font-medium text-navy mb-1">{title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
                </li>
              ))}
            </ol>
          </section>
          <section>
            <h2 className="text-2xl font-serif text-navy mb-1">{g('history_heading_honzon')}</h2>
            <div className="w-10 h-0.5 bg-gold mb-6" />
            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-gold">
              <p className="text-sm text-gray-700 leading-loose">{g('history_honzon')}</p>
            </div>
          </section>
          <section>
            <h2 className="text-2xl font-serif text-navy mb-1">{g('history_heading_bando')}</h2>
            <div className="w-10 h-0.5 bg-gold mb-6" />
            <p className="text-sm text-gray-700 leading-loose">{g('history_bando')}</p>
          </section>
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
