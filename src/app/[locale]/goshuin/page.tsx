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
  const t = await getTranslations({ locale, namespace: 'goshuin' })
  return { title: t('title') }
}

const DEFAULT_NOTES = [
  { text: '御朱印は信仰の証です。コレクション目的でのお受け取りはご遠慮ください。' },
  { text: '受付時間は閉門30分前に終了いたします。余裕をもってお越しください。' },
  { text: '書き入れは混雑時にお時間をいただく場合がございます。' },
  { text: '御朱印帳をお持ちでない方には書き置きもございます。' },
]
const DEFAULT_NOTES_EN = [
  { text: 'A goshuin is a proof of faith — please do not request one solely for collecting purposes.' },
  { text: 'Reception closes 30 minutes before the temple closes. Please allow enough time.' },
  { text: 'Hand-written stamps may take extra time during busy periods.' },
  { text: 'Pre-inscribed stamps are also available for those without a goshuin book.' },
]
const DEFAULT_REGULAR = [
  { title: '立木大悲殿' }, { title: 'ご詠歌' }, { title: '波之利大黒天' }, { title: '金剛閣' },
]
const DEFAULT_REGULAR_EN = [
  { title: 'Tachiki Daihiden' }, { title: 'Goeika' }, { title: 'Hashiri Daikokuten' }, { title: 'Kongokaku' },
]
const DEFAULT_SPECIAL = [
  { label: '写経', title: '金紙特別朱印', sub: '立木大悲殿', desc: '十六文字写経（延命十句観音経）をお書きいただいた方にお授けします。' },
  { label: '写経', title: '金紙特別御朱印', sub: '大日如来', desc: '十六文字写経（懺悔文）をお書きいただいた方にお授けします。' },
  { label: '写仏', title: '銀紙特別朱印', sub: '立木観世音', desc: '写仏をお書きいただいた方にお授けします。' },
]
const DEFAULT_SPECIAL_EN = [
  { label: 'Sutra Copying', title: 'Gold Paper Special Stamp', sub: 'Tachiki Daihiden', desc: 'Given to those who copy the 16-character Enmei Jikku Kannon Sutra.' },
  { label: 'Sutra Copying', title: 'Gold Paper Special Stamp', sub: 'Dainichi Nyorai', desc: 'Given to those who copy the 16-character Repentance Sutra.' },
  { label: 'Buddha Tracing', title: 'Silver Paper Special Stamp', sub: 'Tachiki Kanzeon', desc: 'Given to those who complete a Buddha-image tracing.' },
]

const DEFAULTS: Record<string, string> = {
  goshuin_heading_regular: '御朱印',
  goshuin_heading_regular_en: 'Goshuin Stamps',
  goshuin_intro: '御朱印は御朱印所・本堂・五大堂の各所にてお受けいただけます。\n場所によって授与しているものが異なります。',
  goshuin_intro_en: 'Goshuin stamps can be received at the Goshuin Office, Main Hall, and Godaido.\nAvailable stamps vary by location.',
  goshuin_regular: JSON.stringify(DEFAULT_REGULAR),
  goshuin_regular_en: JSON.stringify(DEFAULT_REGULAR_EN),
  goshuin_fee_note: '御朱印代：各500円　／　書き入れ・書き置きともに同じ金額です。\n受付時間は拝観時間に準じます（閉門30分前に終了）。',
  goshuin_fee_note_en: 'Fee: ¥500 each / Hand-written and pre-inscribed stamps are the same price.\nReception hours follow visiting hours (closes 30 minutes before closing).',
  goshuin_heading_special: '写経・写仏体験 特別御朱印',
  goshuin_heading_special_en: 'Special Stamps for Sutra Copying & Buddha Tracing',
  goshuin_special_intro: '写経・写仏体験とセットでお受けいただける特別な御朱印です。',
  goshuin_special_intro_en: 'A special goshuin available with the sutra-copying or Buddha-image-tracing experience.',
  goshuin_special_price: '体験料込み 各1,000円',
  goshuin_special_price_en: '¥1,000 each, including the experience fee',
  goshuin_special: JSON.stringify(DEFAULT_SPECIAL),
  goshuin_special_en: JSON.stringify(DEFAULT_SPECIAL_EN),
  goshuin_special_place: '受付場所：寺務所 体験受付窓口',
  goshuin_special_place_en: 'Reception: Temple Office Experience Counter',
  goshuin_special_note: '※特別御朱印の種類は今後追加される場合があります。',
  goshuin_special_note_en: '※ Additional special stamp designs may be added in the future.',
  goshuin_heading_notes: '御朱印についてのご注意',
  goshuin_heading_notes_en: 'Notes on Goshuin Stamps',
  goshuin_notes: JSON.stringify(DEFAULT_NOTES),
  goshuin_notes_en: JSON.stringify(DEFAULT_NOTES_EN),
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

const REGULAR_IMAGES = ['/images/chuzenji/goshuin/tachiki.syuin.png', '/images/chuzenji/goshuin/goeika.jpg', '/images/chuzenji/goshuin/daikokuten.png', '/images/chuzenji/goshuin/kongoukaku.png']
const SPECIAL_IMAGES = ['/images/chuzenji/goshuin/sakyou.tatiki.png', '/images/chuzenji/goshuin/goshuin-sangemon.png', '/images/chuzenji/goshuin/syabutu.tatiki.png']

export default async function GoshuinPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const loc = locale as Locale
  const t = await getTranslations('goshuin')
  const tc = await getTranslations('common')
  const content = await getContent()
  const g = (key: string) => getLocalizedContent(content, key, loc)
  const notes = pj<typeof DEFAULT_NOTES>(g('goshuin_notes'), DEFAULT_NOTES)
  const regular = pj<typeof DEFAULT_REGULAR>(g('goshuin_regular'), DEFAULT_REGULAR)
  const special = pj<typeof DEFAULT_SPECIAL>(g('goshuin_special'), DEFAULT_SPECIAL)
  const feeNote = g('goshuin_fee_note')

  return (
    <>
      <Header />
      <main className="pt-16">
        <div className="bg-cream-alt px-4 py-2 text-xs text-gray-400">
          <div className="max-w-4xl mx-auto"><Link href="/">{tc('breadcrumbHome')}</Link> &gt; {t('title')}</div>
        </div>

        <section className="relative h-64 md:h-80">
          <ZoomableImage src="/images/chuzenji/goshuin/syuin-hiro.jpg" alt={t('title')} fill priority className="object-cover" />
          <div className="absolute inset-0 bg-navy/60 flex flex-col items-center justify-center text-center px-4">
            <p className="text-gold text-xs tracking-[0.3em] mb-3">Goshuin</p>
            <h1 className="font-serif text-4xl text-white tracking-widest">{t('title')}</h1>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 py-12 space-y-16">
          <section>
            <h2 className="section-title">{g('goshuin_heading_regular')}</h2>
            <div className="section-divider" />
            <p className="text-center text-sm text-gray-500 mb-8 whitespace-pre-line">
              {g('goshuin_intro')}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {regular.map(({ title }, i) => {
                const src = REGULAR_IMAGES[i]
                return (
                <div key={title} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-52 bg-cream flex items-center justify-center p-2">
                    {src
                      ? <ZoomableImage src={src} alt={title} width={200} height={200} className="object-contain h-full w-full" />
                      : <span className="text-gray-300 text-xs">{t('photoPending')}</span>
                    }
                  </div>
                  <div className="p-3 text-center">
                    <p className="font-medium text-navy text-sm">{title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{t('receptionPlace')}</p>
                  </div>
                </div>
              )})}
            </div>
            <div className="bg-cream-alt rounded-lg p-4 border-l-4 border-gold text-sm text-gray-700 space-y-1 whitespace-pre-line">
              <p><strong>{feeNote.split('\n')[0]}</strong></p>
              <p>{feeNote.split('\n').slice(1).join('\n')}</p>
            </div>
          </section>

          <section className="bg-cream-alt -mx-4 px-4 py-12 md:-mx-8 md:px-8 rounded-2xl">
            <h2 className="section-title">{g('goshuin_heading_special')}</h2>
            <div className="section-divider" />
            <p className="text-center text-sm text-gray-500 mb-2">{g('goshuin_special_intro')}</p>
            <p className="text-center text-gold font-medium mb-8">{g('goshuin_special_price')}</p>
            <div className="space-y-4">
              {special.map(({ label, title, sub, desc }, i) => {
                const src = SPECIAL_IMAGES[i]
                return (
                <div key={title} className="bg-white rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-navy px-4 py-1.5 inline-block">
                    <span className="text-gold text-xs font-bold tracking-wider">{label}</span>
                  </div>
                  <div className="flex items-center gap-5 p-5">
                    <div className="w-32 h-36 flex-shrink-0 bg-cream rounded-lg flex items-center justify-center p-1">
                      {src
                        ? <ZoomableImage src={src} alt={title} width={128} height={144} className="object-contain h-full w-full" />
                        : <span className="text-gray-300 text-xs text-center">{t('photoPending')}</span>
                      }
                    </div>
                    <div>
                      <p className="font-serif font-bold text-navy">{title}
                        <span className="text-gold text-sm font-normal ml-2">{sub}</span>
                      </p>
                      <p className="text-sm text-gray-600 mt-2 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                </div>
              )})}
            </div>
            <div className="mt-6 bg-white rounded-lg p-4 border-l-4 border-gold text-sm text-gray-700 space-y-1">
              <p>{g('goshuin_special_place')}</p>
              <p>{t('applyPrefix')}<Link href="/reserve" className="text-navy underline">{t('applyLinkText')}</Link>{t('applySuffix')}</p>
              <p className="text-xs text-gray-400">{g('goshuin_special_note')}</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-serif text-navy mb-1 pl-3 border-l-4 border-gold">{g('goshuin_heading_notes')}</h2>
            <ul className="mt-4 space-y-3">
              {notes.map(({ text }, i) => (
                <li key={i} className="bg-white rounded-lg px-4 py-3 border-l-4 border-gold text-sm text-gray-700 shadow-sm">{text}</li>
              ))}
            </ul>
          </section>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon:'⛩', label: t('quickAbout'), href:'/about' },
              { icon:'🙏', label: t('quickPrayer'), href:'/prayer' },
              { icon:'📝', label: t('quickExperience'), href:'/reserve' },
              { icon:'🎁', label: t('quickGoods'), href:'https://chuzenji.official.ec/' },
            ].map(({ icon, label, href }) => (
              <Link key={href} href={href}
                className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border shadow-sm hover:bg-navy hover:text-white hover:-translate-y-1 transition-all group">
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
