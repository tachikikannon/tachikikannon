export const revalidate = 60

import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import HeaderOnsenji from '@/components/HeaderOnsenji'
import FooterOnsenji from '@/components/FooterOnsenji'
import { getLocalizedContent } from '@/lib/site-content'
import type { Locale } from '@/i18n/routing'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'onsenjiAbout' })
  return { title: `${t('title')}` }
}

const DEFAULT_NOTES = [
  { text: '境内では静粛にお過ごしください。' },
  { text: '撮影は外観のみ可能です。本堂内は撮影禁止となっております。' },
  { text: 'ペットの同伴は境内に限り可能です。堂内へのお連れ込みはご遠慮ください。' },
  { text: '足元が不安定な箇所があります。歩きやすい靴でお越しください。' },
]
const DEFAULT_NOTES_EN = [
  { text: 'Please remain quiet and respectful on the temple grounds.' },
  { text: 'Photography is permitted outdoors only. Photography inside the main hall is prohibited.' },
  { text: 'Pets are permitted on the grounds only; please do not bring them inside the halls.' },
  { text: 'Some areas underfoot are uneven. Please wear comfortable, sturdy footwear.' },
]

const DEFAULTS: Record<string, string> = {
  onsenji_about_subtitle: '拝観時間・参拝料のご案内',
  onsenji_about_subtitle_en: 'Visiting Hours & Admission Fee',
  onsenji_about_heading_hours: '拝観時間・参拝料',
  onsenji_about_heading_hours_en: 'Visiting Hours & Admission Fee',
  onsenji_about_hours_open:   '8時00分〜17時00分',
  onsenji_about_hours_open_en: '8:00 AM – 5:00 PM',
  onsenji_about_fee: '無料',
  onsenji_about_fee_en: 'Free',
  onsenji_about_hours_winter: '12月〜4月上旬は冬季休業。閉湯・開湯の日程は公式ホームページをご確認ください。',
  onsenji_about_hours_winter_en: 'Closed for winter from December to early April. Please check the official website for closing/opening dates.',
  onsenji_about_heading_notes: 'ご参拝の注意事項',
  onsenji_about_heading_notes_en: 'Visiting Notes',
  onsenji_about_notes: JSON.stringify(DEFAULT_NOTES),
  onsenji_about_notes_en: JSON.stringify(DEFAULT_NOTES_EN),
}

function pj<T>(s: string, fallback: T): T { try { return JSON.parse(s) } catch { return fallback } }

async function getContent() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  try {
    const keys = Object.keys(DEFAULTS).join(',')
    const res = await fetch(`${url}/rest/v1/site_content?key=in.(${keys})&select=key,value`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` }, next: { revalidate: 60 },
    })
    if (!res.ok) return DEFAULTS
    const rows: { key: string; value: string }[] = await res.json()
    const map = { ...DEFAULTS }
    rows.forEach(r => { if (r.value) map[r.key] = r.value })
    return map
  } catch { return DEFAULTS }
}

export default async function OnsenjAboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const loc = locale as Locale
  const t = await getTranslations('onsenjiAbout')
  const tc = await getTranslations('common')
  const content = await getContent()
  const g = (key: string) => getLocalizedContent(content, key, loc)
  const notes = pj<typeof DEFAULT_NOTES>(g('onsenji_about_notes'), DEFAULT_NOTES)

  return (
    <>
      <HeaderOnsenji />
      <main className="pt-16">
        <div className="bg-onsenji/5 px-4 py-2 text-xs text-gray-400">
          <div className="max-w-3xl mx-auto"><Link href="/onsenji">{tc('breadcrumbHome')}</Link> &gt; {t('title')}</div>
        </div>
        <section className="bg-onsenji py-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{backgroundImage:'repeating-linear-gradient(45deg,#7ec8a4 0,#7ec8a4 1px,transparent 0,transparent 50%)',backgroundSize:'20px 20px'}} />
          <p className="text-[#7ec8a4] text-xs tracking-[0.3em] mb-3 relative">About</p>
          <h1 className="font-serif text-4xl text-white tracking-widest relative">{t('title')}</h1>
          <p className="text-white/60 text-sm mt-3 relative">{g('onsenji_about_subtitle')}</p>
        </section>

        <div className="max-w-3xl mx-auto px-4 py-12 space-y-14">

          {/* 拝観時間・料金 */}
          <section id="hours">
            <h2 className="text-2xl font-serif text-onsenji mb-1">{g('onsenji_about_heading_hours')}</h2>
            <div className="w-10 h-0.5 bg-[#7ec8a4] mb-6" />
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <tbody>
                  {[
                    [t('tableHours'), g('onsenji_about_hours_open')],
                    [t('tableFee'),   g('onsenji_about_fee')],
                    [t('tableHoliday'), g('onsenji_about_hours_winter')],
                  ].map(([k, v]) => (
                    <tr key={k} className="border border-gray-200">
                      <th className="bg-onsenji text-white text-left px-4 py-3 w-28 text-sm font-medium whitespace-nowrap">{k}</th>
                      <td className="px-4 py-3 whitespace-pre-line bg-white leading-relaxed">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ご参拝の注意事項 */}
          <section>
            <h2 className="text-2xl font-serif text-onsenji mb-1">{g('onsenji_about_heading_notes')}</h2>
            <div className="w-10 h-0.5 bg-[#7ec8a4] mb-6" />
            <ul className="space-y-3">
              {notes.map(({ text }, i) => (
                <li key={i} className="flex gap-3 bg-white rounded-lg px-4 py-3 shadow-sm border-l-4 border-[#7ec8a4] text-sm text-gray-700 leading-relaxed">{text}</li>
              ))}
            </ul>
          </section>

          {/* 関連リンク */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { icon: '♨️', label: t('quickOnsen'), href: '/onsenji/onsen' },
              { icon: '📜', label: t('quickGoshuin'), href: '/onsenji/goshuin' },
              { icon: '❓', label: t('quickFaq'), href: '/onsenji/faq' },
            ].map(({ icon, label, href }) => (
              <Link key={href} href={href}
                className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border shadow-sm hover:bg-onsenji hover:text-white hover:-translate-y-1 transition-all group">
                <span className="text-2xl">{icon}</span>
                <span className="text-sm font-medium text-onsenji group-hover:text-white text-center">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <FooterOnsenji />
    </>
  )
}
