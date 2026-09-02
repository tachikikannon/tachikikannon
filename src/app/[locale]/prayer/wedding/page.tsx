export const revalidate = 60

import type { Metadata } from 'next'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import YouTubeAutoplay from '@/components/YouTubeAutoplay'
import { getLocalizedContent } from '@/lib/site-content'
import type { Locale } from '@/i18n/routing'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'prayerWedding' })
  return { title: t('title') }
}

const DEFAULT_FLOW = [
  { title: '参進', text: '新郎新婦が五大堂内陣へと進み入ります。' },
  { title: '開式の辞', text: '開式の言葉で式が始まります。' },
  { title: '三礼', text: '五大明王様に礼拝をします。' },
  { title: '勧請', text: '僧侶による仏さまをお招きする作法を致します。' },
  { title: '敬白', text: '仏様神様に結婚の意義を報告し、ご両人を始めとし皆様が守られるようにお唱えをいたします。' },
  { title: '三帰依文', text: '生活において最も重要な２つの言葉をお授けします。' },
  { title: '念珠授与', text: '念珠を戒師様より授与致します。' },
  { title: '盃の儀', text: '三三九度の盃を交わします。' },
  { title: '聖句授与', text: '戒師より仏様の尊い教え、聖句の授与。' },
  { title: '証明授与', text: '結婚式の証明書をお渡しいたします。' },
  { title: '宣誓・献花', text: '新郎新婦に誓いの言葉を述べていただき、結婚式の締めくくりといたしまして、本尊様に花を捧げていただきます。' },
  { title: '両家親族寿杯', text: 'ご両家皆様の堅めの盃を行います。' },
  { title: '慶祝戒師法話・円成宣言', text: '戒師様からの法話と円成宣言を行い終了となります。' },
  { title: '記念撮影', text: '五大堂にてお二人の写真及びご親族皆様との集合写真を撮影いたします。' },
]
const DEFAULT_FLOW_EN = [
  { title: 'Procession', text: 'The couple processes into the hall.' },
  { title: 'Opening Address', text: 'A priest opens the ceremony with an address.' },
  { title: 'Three Bows', text: 'Bows are made in reverence to the Five Wisdom Kings.' },
  { title: 'Invocation', text: 'The priest performs a rite inviting the Buddha\'s presence.' },
  { title: 'Declaration', text: 'The significance of the marriage is reported to the Buddhas and deities, with prayers offered for the protection of the couple and all present.' },
  { title: 'The Three Refuges', text: 'Two of the most important words for daily life are bestowed upon the couple.' },
  { title: 'Juzu Presentation', text: 'The priest presents the juzu prayer beads made together by the couple.' },
  { title: 'Cup Ceremony', text: 'The couple exchanges the ceremonial san-san-kudo cups.' },
  { title: 'Sacred Verse Presentation', text: 'The priest bestows a sacred verse from the Buddha\'s precious teachings.' },
  { title: 'Certificate Presentation', text: 'A certificate of marriage is presented.' },
  { title: 'Vows & Flower Offering', text: 'The couple recites their vows, and as the ceremony concludes, offers flowers to the principal image.' },
  { title: 'Cup of Union Between Families', text: 'Both families share a ceremonial cup, sealing their bond.' },
  { title: 'Priest\'s Blessing & Declaration of Completion', text: 'The priest offers a congratulatory talk and declares the ceremony complete.' },
  { title: 'Commemorative Photos', text: 'Photos of the couple and a group photo with family are taken in the Godaido Hall.' },
]
const DEFAULT_NOTES = [
  { text: '挙式は完全予約制です。ご希望日の3ヶ月前までにお申し込みください。' },
  { text: 'ご列席は近親者を中心に、五大堂内陣の広さに応じた人数（約40名）までとさせていただきます。' },
  { text: '境内・五大堂での写真撮影は可能です（フラッシュ・三脚の使用は事前にご相談ください）。' },
  { text: '衣装・美容・会食・送迎の手配は含まれません。あくまで法要のみ。' },
  { text: '雨天・積雪時期など、季節により式次第の一部が変更となる場合があります。' },
]
const DEFAULT_NOTES_EN = [
  { text: 'Ceremonies are by advance reservation only. Please apply at least 3 months before your preferred date.' },
  { text: 'Attendance is generally limited to close family, up to approximately 40 guests depending on the capacity of the Godaido Hall\'s inner sanctuary.' },
  { text: 'Photography in the grounds and Godaido Hall is permitted (please ask in advance about flash and tripod use).' },
  { text: 'Attire, hair & makeup, the reception, and transport are not included — this is a religious ceremony only.' },
  { text: 'Part of the ceremony may vary seasonally, for example during rain or snow.' },
]

const DEFAULTS: Record<string, string> = {
  wedding_subtitle: 'み仏の御前で結ばれる、二人の誓い',
  wedding_subtitle_en: 'A vow exchanged before the Buddha',
  wedding_heading_about: '仏前式とは',
  wedding_heading_about_en: 'What is a Buddhist Wedding Ceremony?',
  wedding_about_p1: '仏前式とは、ご本尊の御前で結婚の誓いを立てる、仏教の伝統にもとづく挙式です。神前式が神様に、教会式が神父の立ち会いのもとに誓いを立てるのに対し、仏前式ではご本尊と、これまで二人を見守ってきたご先祖様に、夫婦となることを報告し、誓いを立てます。',
  wedding_about_p1_en: 'A Buddhist wedding ceremony (butsuzen-shiki) is held before the temple\'s principal Buddhist image, rooted in Buddhist tradition. Where a Shinto ceremony is witnessed by the kami and a church wedding by a priest, a Buddhist ceremony is a report and vow made before the principal image and the ancestors who have long watched over the couple.',
  wedding_about_p2: '中禅寺では、五大堂にて、僧侶の導きのもと厳かに式を執り行います。',
  wedding_about_p2_en: 'At Chuzenji, the ceremony is solemnly conducted in the Godaido Hall, guided by a priest.',
  wedding_heading_flow: '挙式の流れ',
  wedding_heading_flow_en: 'Order of the Ceremony',
  wedding_flow_note: '式次第はお二人のご希望に応じて一部調整が可能です。詳しくはお申し込み時にご相談ください。',
  wedding_flow_note_en: 'The order of service can be adjusted to your wishes in part — please discuss details when you apply.',
  wedding_heading_details: '料金・所要時間・人数の目安',
  wedding_heading_details_en: 'Fee, Duration & Attendance (Guideline)',
  wedding_fee: '15万～（念珠込み）',
  wedding_fee_en: 'From ¥150,000 (includes juzu prayer beads)',
  wedding_time: '約30〜40分',
  wedding_time_en: 'Approx. 30–40 minutes',
  wedding_capacity: '近親者を中心に五大堂の広さに応じた人数まで',
  wedding_capacity_en: 'Close family, up to the capacity of the Godaido Hall',
  wedding_season: '通年（行事日・繁忙期を除く。要相談）',
  wedding_season_en: 'Year-round, excluding major event days and peak season (subject to consultation)',
  wedding_place: '五大堂（五大明王 御宝前）',
  wedding_place_en: 'Godaido Hall (before the Five Wisdom Kings)',
  wedding_heading_notes: 'ご注意事項',
  wedding_heading_notes_en: 'Notes',
  wedding_cta_heading: '仏前式のご相談・お申し込み',
  wedding_cta_heading_en: 'Consultation & Application for a Buddhist Wedding Ceremony',
  wedding_cta_sub: '挙式日はご希望をうかがったうえで調整いたします。まずはお気軽にご相談ください。',
  wedding_cta_sub_en: 'The ceremony date is arranged based on your preference. Please feel free to consult with us first.',
  wedding_flow: JSON.stringify(DEFAULT_FLOW),
  wedding_flow_en: JSON.stringify(DEFAULT_FLOW_EN),
  wedding_notes: JSON.stringify(DEFAULT_NOTES),
  wedding_notes_en: JSON.stringify(DEFAULT_NOTES_EN),
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

export default async function WeddingPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const loc = locale as Locale
  const t = await getTranslations('prayerWedding')
  const tPrayer = await getTranslations('prayer')
  const tc = await getTranslations('common')
  const content = await getContent()
  const g = (key: string) => getLocalizedContent(content, key, loc)
  const flow = pj<typeof DEFAULT_FLOW>(g('wedding_flow'), DEFAULT_FLOW)
  const notes = pj<typeof DEFAULT_NOTES>(g('wedding_notes'), DEFAULT_NOTES)

  return (
    <>
      <Header />
      <main className="pt-16">
        <div className="bg-cream-alt px-4 py-2 text-xs text-gray-400">
          <div className="max-w-3xl mx-auto">
            <Link href="/">{tc('breadcrumbHome')}</Link> &gt; <Link href="/prayer">{tPrayer('title')}</Link> &gt; {t('title')}
          </div>
        </div>

        <section className="relative h-64 md:h-96">
          <Image src="/images/chuzenji/wedding/kekkonnsiki03.png" alt={t('title')} fill priority className="object-cover" />
          <div className="absolute inset-0 bg-navy/55 flex flex-col items-center justify-center text-center px-4">
            <p className="text-gold text-xs tracking-[0.3em] mb-3">Butsuzen-shiki</p>
            <h1 className="font-serif text-3xl md:text-4xl text-white tracking-widest">{t('title')}</h1>
            <p className="text-white/70 text-sm mt-3">{g('wedding_subtitle')}</p>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-4 pt-12">
          <section>
            <h2 className="text-xl font-serif text-navy mb-1 pl-3 border-l-4 border-gold">{g('wedding_heading_about')}</h2>
            <div className="mt-4 bg-white rounded-xl p-6 shadow-sm border-l-4 border-gold text-sm text-gray-700 leading-relaxed space-y-3">
              <p>{g('wedding_about_p1')}</p>
              <p>{g('wedding_about_p2')}</p>
            </div>
          </section>
        </div>

        <section className="relative aspect-video mt-14">
          <YouTubeAutoplay videoId="pUFUncoIL08" alt={t('title')} />
        </section>
        <p className="max-w-3xl mx-auto px-4 text-right text-[11px] text-gray-400 mb-14">提供 J&apos;S ACUL様</p>

        <div className="max-w-3xl mx-auto px-4">
          <section>
            <h2 className="text-xl font-serif text-navy mb-1 pl-3 border-l-4 border-gold">{g('wedding_heading_details')}</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <tbody>
                  {[
                    [t('tableFee'), g('wedding_fee')],
                    [t('tableTime'), g('wedding_time')],
                    [t('tableCapacity'), g('wedding_capacity')],
                    [t('tableSeason'), g('wedding_season')],
                    [t('tablePlace'), g('wedding_place')],
                  ].map(([k, v]) => (
                    <tr key={k} className="border border-gray-200">
                      <th className="bg-navy text-white text-left px-4 py-3 w-36 text-sm font-medium whitespace-nowrap align-top">{k}</th>
                      <td className="px-4 py-3 bg-white">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div className="max-w-3xl mx-auto px-4 pb-12 space-y-14">
          <section>
            <h2 className="text-xl font-serif text-navy mb-1 pl-3 border-l-4 border-gold">{g('wedding_heading_flow')}</h2>
            <ol className="relative border-l-2 border-gold ml-4 mt-6 space-y-6">
              {flow.map(({ title, text }, i) => (
                <li key={i} className="pl-6 relative">
                  <div className="absolute -left-[19px] top-0 w-9 h-9 rounded-full bg-navy text-white flex items-center justify-center text-sm font-bold">{i + 1}</div>
                  <h3 className="font-medium text-navy mb-1">{title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
                </li>
              ))}
            </ol>
            <p className="text-xs text-gray-400 mt-4">{g('wedding_flow_note')}</p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-navy mb-1 pl-3 border-l-4 border-gold">{g('wedding_heading_notes')}</h2>
            <ul className="space-y-2 mt-4">
              {notes.map(({ text }, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-700 bg-white rounded-lg px-4 py-3 shadow-sm border-l-4 border-gold">{text}</li>
              ))}
            </ul>
          </section>

          <div className="bg-navy rounded-2xl p-8 text-center text-white">
            <p className="font-serif text-xl mb-2">{g('wedding_cta_heading')}</p>
            <p className="text-white/70 text-sm mb-6">{g('wedding_cta_sub')}</p>
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 justify-center">
              <Link href="/prayer/wedding/apply" className="btn-gold whitespace-nowrap">{t('applyCta')}</Link>
              <Link href="/contact" className="btn-outline whitespace-nowrap">{t('contactCta')}</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
