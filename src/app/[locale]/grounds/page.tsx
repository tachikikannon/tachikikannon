export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import GroundsSpots from '@/components/GroundsSpots'
import ZoomableImage from '@/components/ZoomableImage'
import { getLocalizedContent } from '@/lib/site-content'
import type { Locale } from '@/i18n/routing'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'grounds' })
  return { title: t('title') }
}

const DEFAULT_SPOTS = [
  { name: '山門', image: '/images/chuzenji/grounds/sanmon.png', desc: '境内への入口。拝観受付はこちらで行います。' },
  { name: '鐘楼', image: '/images/chuzenji/grounds/toiawase.jpg', desc: '境内に響く梵鐘。時を告げる鐘の音が静かな山の霊気とともに境内に広がります。' },
  { name: '延命水', image: '/images/chuzenji/grounds/enmeisui.png', desc: '境内に湧き出る清水。飲むと長寿・延命のご利益があると伝わり、古くから参拝者に親しまれています。' },
  { name: '石護摩壇', image: '/images/chuzenji/grounds/ishigomadan.png', desc: 'お護摩はインド伝来の密教の秘法（秘密の教え）で、僧侶が護摩壇に向かい、作法にしたがって仏の智慧の火を焚き、様々な供物を焚き上げ、厄難・災難を払いその加護（成就）を願います。' },
  { name: '客殿・写経体験', image: '/images/chuzenji/grounds/kyakuden.png', desc: '写経とは、お経の文字を一文字一文字丁寧に書き写す修行です。文字を書くことで雑念を払い、心を清め、仏様との縁を結ぶとされています。客殿にて写経体験をお受けいただけます。' },
  { name: '御朱印所', image: '/images/chuzenji/grounds/hudasyo.png', desc: '御朱印・お守り・各種授与品はこちらでお受けいただけます。' },
  { name: '愛染堂', image: '/images/chuzenji/grounds/aizendou.png', desc: '中禅寺湖を背景に佇む愛染堂。良縁成就・縁結び・夫婦和合、愛敬開運のご利益で知られています。' },
  { name: '歌碑', image: '/images/chuzenji/grounds/kahi.png', desc: '歌手・俳優の加山雄三氏の楽曲「君といつまでも」の歌碑です。中禅寺湖畔を望むこの地で、多くの方に親しまれています。' },
  { name: 'お水屋', image: '/images/chuzenji/grounds/omizuya.png', desc: '参拝前に手や口を清める手水舎です。' },
  { name: '大黒天堂', image: '/images/chuzenji/grounds/daikokutendou.png', desc: '家内安全、商売繁盛、交通安全、開運、厄除け、安産等のご利益で知られる秘仏、波之利大黒天をお祀りしている、護摩祈願道場です。' },
  { name: '立木観音堂（本堂）', image: '/images/chuzenji/common/main2.png', desc: '勝道上人が中禅寺湖上に千手観音様をご覧になり、その姿を桂の立木に彫ったと伝えられています。観音様は、現在も地に根をはり、訪れる人々を穏やかな表情で迎えます。また、坂東三十三観音霊場の第十八番札所として多くの巡礼の方たちもご参拝になります。' },
  { name: '五大堂', image: '/images/chuzenji/common/godaido.jpg', desc: '不動明王、降三世明王、軍荼利明王、大威徳明王、金剛夜叉明王の五大明王が安置された御祈祷の道場です。天井には、堅山南風画伯が描いた大雲龍が堂々たる威容を誇ります。また、ここ五大堂からの中禅寺湖を望む景色は、見るものの心を振るわせるほどの絶景です。' },
]
const DEFAULT_SPOTS_EN = [
  { name: 'Sanmon Gate', image: '/images/chuzenji/grounds/sanmon.png', desc: 'The entrance to the grounds, where visiting reception is held.' },
  { name: 'Bell Tower', image: '/images/chuzenji/grounds/toiawase.jpg', desc: 'The temple bell resonates across the grounds, its sound marking the hours amid the quiet spirit of the mountains.' },
  { name: 'Enmeisui Spring', image: '/images/chuzenji/grounds/enmeisui.png', desc: 'A spring of clear water on the grounds, said to bring longevity to those who drink it — cherished by visitors since ancient times.' },
  { name: 'Stone Goma Altar', image: '/images/chuzenji/grounds/ishigomadan.png', desc: 'The goma fire ritual is an esoteric Buddhist rite from India, in which a priest ignites the flame of Buddhist wisdom at the altar and offers various items, praying to ward off misfortune and grant blessings.' },
  { name: 'Guest Hall & Sutra Copying', image: '/images/chuzenji/grounds/kyakuden.png', desc: 'Sutra copying is a practice of carefully copying the characters of a sutra, one by one, said to clear the mind and form a bond with the Buddha. The sutra-copying experience is offered at the Guest Hall.' },
  { name: 'Goshuin Office', image: '/images/chuzenji/grounds/hudasyo.png', desc: 'Goshuin stamps, omamori charms, and other items can be received here.' },
  { name: 'Aizen-do', image: '/images/chuzenji/grounds/aizendou.png', desc: 'Standing against the backdrop of Lake Chuzenji, Aizen-do is known for blessings of good relationships, matchmaking, marital harmony, and charm.' },
  { name: 'Song Monument', image: '/images/chuzenji/grounds/kahi.png', desc: 'A monument for the song "Kimi to Itsumademo" by singer and actor Yuzo Kayama, cherished by many at this spot overlooking Lake Chuzenji.' },
  { name: 'Omizuya', image: '/images/chuzenji/grounds/omizuya.png', desc: 'A water pavilion for purifying hands and mouth before worship.' },
  { name: 'Daikokuten Hall', image: '/images/chuzenji/grounds/daikokutendou.png', desc: 'A prayer hall enshrining the hidden statue of Hashiri Daikokuten, known for blessings of household safety, business prosperity, traffic safety, good fortune, warding off misfortune, and safe childbirth.' },
  { name: 'Tachiki Kannon Hall (Main Hall)', image: '/images/chuzenji/common/main2.png', desc: 'It is said that Priest Shodo saw a vision of the thousand-armed Kannon over Lake Chuzenji and carved her likeness into a living katsura tree. The Kannon still stands rooted in the earth today, greeting visitors with a serene expression. It is also the 18th sacred site of the Bando 33 Kannon Pilgrimage.' },
  { name: 'Godaido Hall', image: '/images/chuzenji/common/godaido.jpg', desc: 'A prayer hall enshrining the Five Wisdom Kings: Fudo Myo-o, Gozanze Myo-o, Gundari Myo-o, Daiitoku Myo-o, and Kongoyasha Myo-o. The ceiling features a magnificent cloud dragon painted by Nampu Katayama. The view of Lake Chuzenji from Godaido is a breathtaking sight.' },
]
const DEFAULT_FLOW = [
  { title: '拝観受付（山門）', text: '入口にて拝観料をお納めください。受付は閉門30分前に終了いたします。' },
  { title: '御朱印受付', text: '山門をくぐってすぐの御朱印所にて、御朱印やお守りをお受けいただけます。' },
  { title: '本堂参拝', text: 'ご本尊・立木観音（千手観世音菩薩）にお参りください。' },
  { title: '五大堂', text: '中禅寺湖を一望できる五大堂へ。天井の龍の墨絵も必見です。' },
]
const DEFAULT_FLOW_EN = [
  { title: 'Reception (Sanmon Gate)', text: 'Please pay the admission fee at the entrance. Reception closes 30 minutes before the gate closes.' },
  { title: 'Goshuin Reception', text: 'Just past the Sanmon Gate, receive goshuin stamps and omamori charms at the Goshuin Office.' },
  { title: 'Worship at the Main Hall', text: 'Please worship the principal image, Tachiki Kannon (the thousand-armed Kannon Bodhisattva).' },
  { title: 'Godaido Hall', text: 'Visit Godaido Hall for a panoramic view of Lake Chuzenji — don\'t miss the ink dragon painting on the ceiling.' },
]

const DEFAULTS: Record<string, string> = {
  grounds_subtitle: '見どころ・境内マップ',
  grounds_subtitle_en: 'Highlights & Temple Map',
  grounds_heading_map: '境内マップ・主な見どころ',
  grounds_heading_map_en: 'Temple Map & Highlights',
  grounds_map_hint: '地図上のピンをクリックすると各スポットの詳細が見られます',
  grounds_map_hint_en: 'Click a pin on the map to see details for each spot',
  grounds_heading_godaido: '五大堂からの眺望',
  grounds_heading_godaido_en: 'The View from Godaido Hall',
  grounds_heading_flow: '参拝の流れ',
  grounds_heading_flow_en: 'Visiting Flow',
  grounds_spots: JSON.stringify(DEFAULT_SPOTS),
  grounds_spots_en: JSON.stringify(DEFAULT_SPOTS_EN),
  grounds_godaido_text: '五大堂の大窓からは、中禅寺湖と男体山を一望することができます。四季折々の景色は訪れる人々を魅了し、特に紅葉の季節には多くの参拝者が訪れます。また、天井に描かれた龍の大墨絵も必見です。',
  grounds_godaido_text_en: 'From Godaido Hall\'s large windows, you can take in a sweeping view of Lake Chuzenji and Mt. Nantai. The scenery changes with the seasons and captivates visitors, especially during the autumn foliage season. The large ink dragon painted on the ceiling is also not to be missed.',
  grounds_flow: JSON.stringify(DEFAULT_FLOW),
  grounds_flow_en: JSON.stringify(DEFAULT_FLOW_EN),
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

export default async function GroundsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const loc = locale as Locale
  const t = await getTranslations('grounds')
  const tc = await getTranslations('common')
  const content = await getContent()
  const g = (key: string) => getLocalizedContent(content, key, loc)
  const rawSpots = pj<{ name?: string; image?: string; desc?: string; num?: string }[]>(g('grounds_spots'), DEFAULT_SPOTS)
  // 旧フォーマット（imageなし）の場合はDEFAULT_SPOTSを使用
  const spots = rawSpots.some(s => s.image) ? rawSpots as typeof DEFAULT_SPOTS : DEFAULT_SPOTS
  const flow  = pj<typeof DEFAULT_FLOW>(g('grounds_flow'), DEFAULT_FLOW)

  return (
    <>
      <Header />
      <main className="pt-16">
        <div className="bg-cream-alt px-4 py-2 text-xs text-gray-400">
          <div className="max-w-3xl mx-auto"><Link href="/">{tc('breadcrumbHome')}</Link> &gt; {t('title')}</div>
        </div>
        <section className="relative h-64 md:h-80">
          <ZoomableImage src="/images/chuzenji/common/godaido.jpg" alt={t('title')} fill className="object-cover" />
          <div className="absolute inset-0 bg-navy/50 flex flex-col items-center justify-center text-white">
            <h1 className="font-serif text-3xl md:text-4xl tracking-widest">{t('title')}</h1>
            <p className="text-white/70 text-sm mt-2">{g('grounds_subtitle')}</p>
          </div>
        </section>
        <div className="max-w-3xl mx-auto px-4 py-12 space-y-14">
          <section>
            <h2 className="text-2xl font-serif text-navy mb-1">{g('grounds_heading_map')}</h2>
            <div className="w-10 h-0.5 bg-gold mb-2" />
            <p className="text-xs text-gray-400 mb-6">{g('grounds_map_hint')}</p>
            <GroundsSpots spots={spots} />
          </section>
          <section>
            <h2 className="text-2xl font-serif text-navy mb-1">{g('grounds_heading_godaido')}</h2>
            <div className="w-10 h-0.5 bg-gold mb-6" />
            <div className="relative h-56 rounded-xl overflow-hidden mb-4">
              <ZoomableImage src="/images/chuzenji/common/haikan.png" alt="五大堂からの眺め" fill className="object-cover" />
            </div>
            <p className="text-sm text-gray-700 leading-loose">{g('grounds_godaido_text')}</p>
          </section>
          <section>
            <h2 className="text-2xl font-serif text-navy mb-1">{g('grounds_heading_flow')}</h2>
            <div className="w-10 h-0.5 bg-gold mb-6" />
            <ol className="relative border-l-2 border-gold ml-4 space-y-6">
              {flow.map(({ title, text }, i) => (
                <li key={i} className="pl-6 relative">
                  <div className="absolute -left-[19px] top-0 w-9 h-9 rounded-full bg-navy text-white flex items-center justify-center text-sm font-serif font-bold">{i + 1}</div>
                  <h3 className="font-medium text-navy mb-1">{title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
                </li>
              ))}
            </ol>
          </section>
          <div className="grid grid-cols-2 gap-4 pt-4">
            {[
              { icon: '🕐', label: t('aboutHours'), href: '/about' },
              { icon: '📖', label: t('history'), href: '/history' },
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
