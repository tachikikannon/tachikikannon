export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import HeaderOnsenji from '@/components/HeaderOnsenji'
import FooterOnsenji from '@/components/FooterOnsenji'
import ZoomableImage from '@/components/ZoomableImage'
import { getLocalizedContent } from '@/lib/site-content'
import type { Locale } from '@/i18n/routing'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'onsenjiGoshuin' })
  return { title: `${t('title')} | 日光山温泉寺` }
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
const DEFAULT_ITEMS = [
  { title: '薬師如来', sub: '温泉寺 本堂（通常御朱印）' },
  { title: '写経特別御朱印', sub: '写経体験をされた方に授与' },
  { title: '写仏特別御朱印', sub: '写仏体験をされた方に授与' },
]
const DEFAULT_ITEMS_EN = [
  { title: 'Yakushi Nyorai', sub: 'Onsenji Main Hall (Regular Goshuin)' },
  { title: 'Special Sutra Copying Stamp', sub: 'Given to those who complete the sutra copying experience' },
  { title: 'Special Buddha Tracing Stamp', sub: 'Given to those who complete the Buddhist image tracing experience' },
]
const ITEM_IMAGES = [
  '/images/onsenji/goshuin/onsen-yakusi-tuujyou.png',
  '/images/onsenji/experience/shakyou/onsenji-goshuin-shakyou.png',
  '/images/onsenji/experience/shabutu/onsenji-shabutu-template.png',
]

const DEFAULTS: Record<string, string> = {
  onsenji_goshuin_heading_info: '御朱印のご案内',
  onsenji_goshuin_heading_info_en: 'About Goshuin Stamps',
  onsenji_goshuin_items: JSON.stringify(DEFAULT_ITEMS),
  onsenji_goshuin_items_en: JSON.stringify(DEFAULT_ITEMS_EN),
  onsenji_goshuin_fee_note: '御朱印代：500円　／　写経体験（1,000円）をお申し込みの方には特別御朱印を授与しています。\n受付時間は拝観受付終了時刻までとなります。',
  onsenji_goshuin_fee_note_en: 'Fee: ¥500 / A special goshuin is given to those who apply for the sutra copying experience (¥1,000).\nReception hours follow the visiting reception closing time.',
  onsenji_goshuin_heading_notes: '御朱印についてのご注意',
  onsenji_goshuin_heading_notes_en: 'Notes on Goshuin Stamps',
  onsenji_goshuin_notes: JSON.stringify(DEFAULT_NOTES),
  onsenji_goshuin_notes_en: JSON.stringify(DEFAULT_NOTES_EN),
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

export default async function OnsenjGoshuinPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const loc = locale as Locale
  const t = await getTranslations('onsenjiGoshuin')
  const tc = await getTranslations('common')
  const content = await getContent()
  const g = (key: string) => getLocalizedContent(content, key, loc)
  const notes = pj<typeof DEFAULT_NOTES>(g('onsenji_goshuin_notes'), DEFAULT_NOTES)
  const items = pj<typeof DEFAULT_ITEMS>(g('onsenji_goshuin_items'), DEFAULT_ITEMS)
  const feeNote = g('onsenji_goshuin_fee_note')

  return (
    <>
      <HeaderOnsenji />
      <main className="pt-16">
        <div className="bg-onsenji/5 px-4 py-2 text-xs text-gray-400">
          <div className="max-w-4xl mx-auto"><Link href="/onsenji">{tc('breadcrumbHome')}</Link> &gt; {t('title')}</div>
        </div>
        <section className="bg-onsenji py-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{backgroundImage:'repeating-linear-gradient(45deg,#7ec8a4 0,#7ec8a4 1px,transparent 0,transparent 50%)',backgroundSize:'20px 20px'}} />
          <p className="text-[#7ec8a4] text-xs tracking-[0.3em] mb-3 relative">Goshuin</p>
          <h1 className="font-serif text-4xl text-white tracking-widest relative">{t('title')}</h1>
        </section>
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-16">
          <section>
            <h2 className="text-xl font-serif text-onsenji mb-1 pl-3 border-l-4 border-[#7ec8a4]">{g('onsenji_goshuin_heading_info')}</h2>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
              {items.map(({ title, sub }, i) => {
                const src = ITEM_IMAGES[i]
                return (
                <div key={title} className="bg-white rounded-xl overflow-hidden shadow-sm">
                  <div className="h-40 bg-onsenji/10 flex items-center justify-center p-2">
                    {src
                      ? <ZoomableImage src={src} alt={title} width={200} height={200} className="object-contain h-full w-full" />
                      : <span className="text-gray-300 text-xs">写真準備中</span>
                    }
                  </div>
                  <div className="p-3 text-center">
                    <p className="font-medium text-onsenji text-sm">{title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
                  </div>
                </div>
              )})}
            </div>
            <div className="mt-6 bg-onsenji/10 rounded-lg p-4 border-l-4 border-[#7ec8a4] text-sm text-gray-700 space-y-1 whitespace-pre-line">
              <p><strong>{feeNote.split('\n')[0]}</strong></p>
              <p>{feeNote.split('\n').slice(1).join('\n')}</p>
            </div>
          </section>
          <section>
            <h2 className="text-xl font-serif text-onsenji mb-1 pl-3 border-l-4 border-[#7ec8a4]">{g('onsenji_goshuin_heading_notes')}</h2>
            <ul className="mt-4 space-y-3">
              {notes.map(({ text }, i) => (
                <li key={i} className="bg-white rounded-lg px-4 py-3 border-l-4 border-[#7ec8a4] text-sm text-gray-700 shadow-sm">{text}</li>
              ))}
            </ul>
          </section>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { icon:'🕐', label: t('quickAbout'), href:'/onsenji/about' },
              { icon:'🗺️', label: t('quickGrounds'), href:'/onsenji/grounds' },
              { icon:'❓', label: t('quickFaq'), href:'/onsenji/faq' },
            ].map(({ icon, label, href }) => (
              <Link key={href} href={href}
                className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border shadow-sm hover:bg-onsenji hover:text-white hover:-translate-y-1 transition-all group">
                <span className="text-2xl">{icon}</span>
                <span className="text-sm font-medium text-onsenji group-hover:text-white">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <FooterOnsenji />
    </>
  )
}
