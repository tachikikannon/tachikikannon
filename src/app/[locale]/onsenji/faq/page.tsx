export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import HeaderOnsenji from '@/components/HeaderOnsenji'
import FooterOnsenji from '@/components/FooterOnsenji'
import { getLocalizedContent } from '@/lib/site-content'
import type { Locale } from '@/i18n/routing'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'onsenjiFaq' })
  return { title: `${t('title')}` }
}

const DEFAULT_FAQS = [
  { q: '温泉（薬師の湯）は誰でも利用できますか？', a: 'はい、入湯料（大人500円・小中学生300円）をお納めいただいた方はどなたでもご利用いただけます。源泉かけ流しの温泉です。タオルをご持参ください。お持ちでない方は、１枚５００円で販売もしております。' },
  { q: '薬師の湯の泉質を教えてください。', a: '泉質は含硫黄‐カルシウム・ナトリウム‐硫酸塩・炭酸水素塩泉で、泉温は71.4℃です。完全かけ流しで、加水すると乳白色に変わる美しい湯です。' },
  { q: '御祈願は予約が必要ですか？', a: 'ご祈願は行っておりませんが、毎年8月8日に薬師講大祭・採灯大護摩供が行われます。' },
  { q: '写経体験はできますか？', a: 'はい、毎日実施しています。体験料1,000円で特別御朱印もお授けします。所要時間は約15分です。予約不要で、玄関にて係にお申し付けください。' },
  { q: '車でのアクセスはできますか？', a: 'はい、お車でお越しいただけます。境内に無料駐車場がございます。' },
  { q: '温泉寺は輪王寺と関係がありますか？', a: 'はい、日光山温泉寺は世界遺産「日光山輪王寺」の別院です。延暦7年（788年）に勝道上人によって開創され、江戸時代には輪王寺宮の直轄寺院として栄えました。' },
]
const DEFAULT_FAQS_EN = [
  { q: 'Can anyone use the hot spring (Yakushi-no-Yu)?', a: "Yes, anyone who pays the bathing fee (adults ¥500, elementary/junior high school students ¥300) may use it. It is a fully sourced, uninterrupted-flow hot spring. Please bring your own towel — if you don't have one, towels are also available for purchase for ¥500 each." },
  { q: 'What is the water quality of Yakushi-no-Yu?', a: 'The spring is sulfur–calcium–sodium–sulfate–bicarbonate with a water temperature of 71.4°C. It is fully sourced and turns a beautiful milky white when mixed with water.' },
  { q: 'Do I need a reservation for a prayer service?', a: 'We do not currently offer prayer services, but the Yakushiko Grand Festival and Saito Goma Fire Ritual are held every year on August 8.' },
  { q: 'Can I try the sutra copying experience?', a: 'Yes, it is offered daily. The fee is ¥1,000 and includes a special goshuin stamp. It takes about 15 minutes. No reservation is needed — please ask staff at the entrance.' },
  { q: 'Can I access by car?', a: 'Yes, you can come by car. Free parking is available on the grounds.' },
  { q: 'Is Onsenji connected to Rinnoji?', a: 'Yes, Nikkozan Onsenji is a branch temple of the World Heritage site Nikkozan Rinnoji. It was founded in Enryaku 7 (788 CE) by the priest Shodo, and flourished in the Edo period as a temple directly administered by Rinnoji.' },
]

const DEFAULTS: Record<string, string> = {
  onsenji_faq_subtitle: 'FAQ',
  onsenji_faq_bottom_heading: 'その他のご質問',
  onsenji_faq_bottom_heading_en: 'Other Questions',
  onsenji_faq_bottom_text: '解決しない場合はお気軽にお問い合わせください。',
  onsenji_faq_bottom_text_en: "If your question isn't answered here, please feel free to contact us.",
  onsenji_faq_cta_label: 'お問い合わせ',
  onsenji_faq_cta_label_en: 'Contact Us',
}

async function getContent() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const keys = [...Object.keys(DEFAULTS), 'onsenji_faq_items', 'onsenji_faq_items_en'].join(',')
  try {
    const res = await fetch(`${url}/rest/v1/site_content?key=in.(${keys})&select=key,value`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` }, cache: 'no-store',
    })
    if (!res.ok) return { c: DEFAULTS, faqs: DEFAULT_FAQS, faqsEn: DEFAULT_FAQS_EN }
    const rows: { key: string; value: string }[] = await res.json()
    const c = { ...DEFAULTS }
    let faqs = DEFAULT_FAQS
    let faqsEn = DEFAULT_FAQS_EN
    rows.forEach(r => {
      if (!r.value) return
      if (r.key === 'onsenji_faq_items') { try { faqs = JSON.parse(r.value) } catch {} }
      else if (r.key === 'onsenji_faq_items_en') { try { faqsEn = JSON.parse(r.value) } catch {} }
      else c[r.key] = r.value
    })
    return { c, faqs, faqsEn }
  } catch { return { c: DEFAULTS, faqs: DEFAULT_FAQS, faqsEn: DEFAULT_FAQS_EN } }
}

export default async function OnsenjFaqPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const loc = locale as Locale
  const t = await getTranslations('onsenjiFaq')
  const tc = await getTranslations('common')
  const { c, faqs, faqsEn } = await getContent()
  const g = (key: string) => getLocalizedContent(c, key, loc)
  const items = loc === 'en' ? faqsEn : faqs

  return (
    <>
      <HeaderOnsenji />
      <main className="pt-16">
        <div className="bg-onsenji/5 px-4 py-2 text-xs text-gray-400">
          <div className="max-w-3xl mx-auto"><Link href="/onsenji">{tc('breadcrumbHome')}</Link> &gt; {t('title')}</div>
        </div>
        <section className="bg-onsenji py-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{backgroundImage:'repeating-linear-gradient(45deg,#7ec8a4 0,#7ec8a4 1px,transparent 0,transparent 50%)',backgroundSize:'20px 20px'}} />
          <p className="text-[#7ec8a4] text-xs tracking-[0.3em] mb-3 relative">{c.onsenji_faq_subtitle}</p>
          <h1 className="font-serif text-4xl text-white tracking-widest relative">{t('title')}</h1>
        </section>
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="space-y-4">
            {items.map(({ q, a }: { q: string; a: string }, i: number) => (
              <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="flex gap-4 p-5 items-start">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#7ec8a4] text-white font-bold text-sm flex items-center justify-center">Q</span>
                  <p className="font-medium text-onsenji text-sm leading-relaxed">{q}</p>
                </div>
                <div className="flex gap-4 px-5 pb-5 items-start border-t border-onsenji/10">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-onsenji text-white font-bold text-sm flex items-center justify-center mt-0">A</span>
                  <p className="text-sm text-gray-600 leading-relaxed mt-1">{a}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 bg-onsenji rounded-2xl p-8 text-center text-white">
            <p className="font-serif text-lg mb-2">{g('onsenji_faq_bottom_heading')}</p>
            <p className="text-white/70 text-sm mb-6">{g('onsenji_faq_bottom_text')}</p>
            <Link href="/onsenji/contact"
              className="inline-block px-8 py-3 bg-[#7ec8a4] text-onsenji font-medium rounded-full hover:bg-[#a0d8bc] transition-colors text-sm">
              {g('onsenji_faq_cta_label')}
            </Link>
          </div>
        </div>
      </main>
      <FooterOnsenji />
    </>
  )
}
