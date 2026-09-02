export const revalidate = 60

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
  const t = await getTranslations({ locale, namespace: 'onsenjiOnsen' })
  return {
    title: `${t('title')}`,
    description: '令和8年4月開湯。含硫黄泉の完全かけ流し。日光山温泉寺の薬師の湯をご案内します。',
  }
}

const DEFAULTS: Record<string, string> = {
  onsenji_onsen_subtitle: '令和8年4月11日 開湯',
  onsenji_onsen_subtitle_en: 'Opened April 11, 2026',
  onsenji_onsen_heading_about: '薬師の湯について',
  onsenji_onsen_heading_about_en: 'About Yakushi-no-Yu',
  onsenji_onsen_heading_quality: '泉質・料金',
  onsenji_onsen_heading_quality_en: 'Water Quality & Fee',
  onsenji_onsen_heading_notes: 'ご利用の注意',
  onsenji_onsen_heading_notes_en: 'Notes on Use',
  onsenji_onsen_about:     '「薬師の湯」は延暦7年（788年）の開創以来、薬師瑠璃光如来のご加護のもと守り続けられてきた霊泉です。本年度は4月11日に参拝者への開放が始まりました。薬師如来の御加護と温泉の癒しを同時にいただける、温泉寺ならではの体験です。',
  onsenji_onsen_about_en: '"Yakushi-no-Yu" is a sacred spring that has been protected under the blessing of Yakushi Rurikou Nyorai since the temple\'s founding in 788. This year, it opened to worshippers on April 11. Receiving both the blessing of Yakushi Nyorai and the healing of the hot spring at once is an experience unique to Onsenji.',
  onsenji_onsen_quality:   '含硫黄‐カルシウム・ナトリウム‐硫酸塩・炭酸水素塩泉',
  onsenji_onsen_quality_en: 'Sulfur–calcium–sodium–sulfate–bicarbonate spring',
  onsenji_onsen_temp:      '71.4℃',
  onsenji_onsen_temp_en: '71.4°C',
  onsenji_onsen_flow:      '完全かけ流し（加水あり）',
  onsenji_onsen_flow_en: 'Fully sourced (mixed with water)',
  onsenji_onsen_color:     '加水すると乳白色に変わります',
  onsenji_onsen_color_en: 'Turns milky white when mixed with water',
  onsenji_onsen_hours:     '8時00分〜17時00分（受付：8時00分〜16時00分）\n※12月〜4月上旬は冬季休業',
  onsenji_onsen_hours_en: '8:00 AM – 5:00 PM (reception: 8:00 AM – 4:00 PM)\n*Closed for winter from December to early April',
  onsenji_onsen_fee_note:  '入湯料　大人500円・小中学生300円',
  onsenji_onsen_fee_note_en: 'Bathing fee: adults ¥500, elementary/junior high school students ¥300',
  onsenji_onsen_note:      'タオルをご持参ください。貸し出しは行っておりません。',
  onsenji_onsen_note_en: 'Please bring your own towel. Towel rental is not available.',
}

async function getContent(): Promise<Record<string, string>> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return DEFAULTS
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
  } catch {
    return DEFAULTS
  }
}

export default async function OnsenjOnsenPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const loc = locale as Locale
  const t = await getTranslations('onsenjiOnsen')
  const tc = await getTranslations('common')
  const content = await getContent()
  const g = (key: string) => getLocalizedContent(content, key, loc)

  return (
    <>
      <HeaderOnsenji />
      <main className="pt-16">
        {/* パンくず */}
        <div className="bg-onsenji/5 px-4 py-2 text-xs text-gray-400">
          <div className="max-w-3xl mx-auto">
            <Link href="/onsenji">{tc('breadcrumbHome')}</Link> &gt; {t('breadcrumb')}
          </div>
        </div>

        {/* ページヒーロー */}
        <section className="relative h-72 md:h-96 overflow-hidden">
          <ZoomableImage
            src="/images/onsenji/common/onsen.png"
            alt={t('title')}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-onsenji/50 to-onsenji/80" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
            <p className="text-[#7ec8a4] text-xs tracking-[0.3em] mb-3">Yakushi-no-Yu</p>
            <h1 className="font-serif text-4xl tracking-widest mb-2">{t('title')}</h1>
            <p className="text-white/70 text-sm">{g('onsenji_onsen_subtitle')}</p>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-4 py-14 space-y-14">

          {/* 概要 */}
          <section>
            <h2 className="text-2xl font-serif text-onsenji mb-1">{g('onsenji_onsen_heading_about')}</h2>
            <div className="w-10 h-0.5 bg-[#7ec8a4] mb-6" />
            <p className="text-gray-700 text-sm leading-loose">{g('onsenji_onsen_about')}</p>
          </section>

          {/* 写真2枚 */}
          <section className="grid md:grid-cols-2 gap-4">
            <div className="relative h-56 rounded-2xl overflow-hidden shadow-md">
              <ZoomableImage src="/images/onsenji/common/onsen.png" alt={t('title')} fill className="object-cover" />
            </div>
            <div className="relative h-56 rounded-2xl overflow-hidden shadow-md">
              <ZoomableImage src="/images/onsenji/onsen/kyuukeisitu.png" alt="休憩室" fill className="object-cover" />
            </div>
          </section>

          {/* 泉質・料金 */}
          <section>
            <h2 className="text-2xl font-serif text-onsenji mb-1">{g('onsenji_onsen_heading_quality')}</h2>
            <div className="w-10 h-0.5 bg-[#7ec8a4] mb-6" />
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <tbody>
                  {[
                    [t('tableQuality'), g('onsenji_onsen_quality')],
                    [t('tableTemp'),    g('onsenji_onsen_temp')],
                    [t('tableFlow'),    g('onsenji_onsen_flow')],
                    [t('tableColor'),   g('onsenji_onsen_color')],
                    [t('tableHours'),   g('onsenji_onsen_hours')],
                    [t('tableFee'),     g('onsenji_onsen_fee_note')],
                  ].map(([k, v]) => (
                    <tr key={k} className="border border-gray-200">
                      <th className="bg-onsenji text-white text-left px-4 py-3 w-28 text-sm font-medium whitespace-nowrap">{k}</th>
                      <td className="px-4 py-3 bg-white leading-relaxed whitespace-pre-line">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ご注意 */}
          <section>
            <h2 className="text-2xl font-serif text-onsenji mb-1">{g('onsenji_onsen_heading_notes')}</h2>
            <div className="w-10 h-0.5 bg-[#7ec8a4] mb-6" />
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-gray-700 leading-relaxed">
              <p>♨️ {g('onsenji_onsen_note')}</p>
            </div>
          </section>

          {/* 関連リンク */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: '🕐', label: t('quickAbout'), href: '/onsenji/about' },
              { icon: '❓', label: t('quickFaq'), href: '/onsenji/faq' },
            ].map(({ icon, label, href }) => (
              <Link key={href} href={href} className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border shadow-sm hover:bg-onsenji hover:text-white hover:-translate-y-1 transition-all group">
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
