export const revalidate = 60

import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getLocalizedContent } from '@/lib/site-content'
import type { Locale } from '@/i18n/routing'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'faq' })
  return { title: t('title') }
}

const DEFAULT_FAQS = [
  { q: '拝観時間を教えてください。', a: '4月〜10月は8:00〜17:00、11月と3月は9:00〜16:00、12月～２月は午前8時30分〜午後3時30分です。' },
  { q: '拝観料はいくらですか？', a: '大人500円、小中学生200円です。' },
  { q: '障がい者の拝観料の免除、減免はありますか？', a: '障がい者手帳、療育手帳をお持ちであれば、ご来山の際に原本をご提示いただくことで割引になります。ご本人のみ拝観料が大人の方100円、小中学生無料でお参りいただけます。' },
  { q: '御祈願の予約は必要ですか？', a: '事前予約をお勧めしております。当日受付も可能な場合がありますが、混雑時はお断りする場合がございます。' },
  { q: '写経・写仏・数珠づくり体験の予約方法を教えてください。', a: 'ウェブサイトの「体験のご予約はこちら」よりオンラインでご予約いただけます。' },
  { q: '駐車場はありますか？', a: '１０台駐車スペースがございます(予約不可)。満車の場合は、中禅寺温泉周辺の有料駐車場をご利用ください。春・秋の観光シーズンはいろは坂が渋滞します。公共交通機関のご利用をお勧めします。' },
  { q: '御朱印はいただけますか？', a: 'はい、書き入れと書き置きをご用意しております。拝観時間内にお声がけください。' },
  { q: 'ベビーカーや車椅子での参拝はできますか？', a: '境内は段差がある箇所もございます。詳しくは事前にお問い合わせください。' },
  { q: 'お守り・授与品の通販はできますか？', a: 'はい、公式通販サイト（chuzenji.official.ec）にてお求めいただけます。' },
  { q: 'ペットは連れてはいれますか？', a: '入れます。お堂の中に入るにはキャリーバックをご持参いただき、お参りください。' },
]
const DEFAULT_FAQS_EN = [
  { q: 'What are the visiting hours?', a: '8:00 AM–5:00 PM from April to October, 9:00 AM–4:00 PM in November and March, and 8:30 AM–3:30 PM from December to February.' },
  { q: 'What is the admission fee?', a: '¥500 for adults, ¥200 for elementary/junior high school students.' },
  { q: 'Is there a discount or fee waiver for visitors with disabilities?', a: 'If you hold a physical disability certificate or a rehabilitation (therapeutic) certificate, please present the original at the time of your visit for a discount. The discount applies to the certificate holder only: ¥100 for adults, and free admission for elementary/junior high school students.' },
  { q: 'Is a reservation required for prayer services?', a: 'Reservations are recommended. Same-day reception may be possible, but may be declined during busy periods.' },
  { q: 'How do I reserve the sutra-copying, Buddha-tracing, or juzu-making experiences?', a: 'You can reserve online via the "Reserve an Experience" link on the website.' },
  { q: 'Is parking available?', a: 'We have parking for 10 vehicles. If full, please use one of the paid parking lots around Chuzenji-Onsen. Irohazaka gets congested during the spring and autumn tourist seasons, so we recommend using public transport.' },
  { q: 'Can I receive a goshuin stamp?', a: 'Yes, both hand-written and pre-inscribed stamps are available. Please ask during visiting hours.' },
  { q: 'Can I visit with a stroller or wheelchair?', a: 'Some areas of the grounds have steps. Please contact us in advance for details.' },
  { q: 'Can I order amulets or other items online?', a: 'Yes, they are available through our official online shop (chuzenji.official.ec).' },
  { q: 'Can I bring my pet?', a: 'Yes, pets are welcome. To enter the halls, please bring a carrier bag for your pet.' },
]

const DEFAULTS: Record<string, string> = {
  faq_subtitle: 'FAQ',
  faq_bottom_text: '解決しない場合はお気軽にお問い合わせください。',
  faq_bottom_text_en: "If your question isn't answered here, please feel free to contact us.",
  faq_cta_label: 'お問い合わせはこちら',
  faq_cta_label_en: 'Contact Us',
}

async function getContent() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const keys = [...Object.keys(DEFAULTS), 'faq_items', 'faq_items_en'].join(',')
  try {
    const res = await fetch(`${url}/rest/v1/site_content?key=in.(${keys})&select=key,value`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      next: { revalidate: 60 },
    })
    if (!res.ok) return { c: DEFAULTS, faqs: DEFAULT_FAQS, faqsEn: DEFAULT_FAQS_EN }
    const rows: { key: string; value: string }[] = await res.json()
    const c = { ...DEFAULTS }
    let faqs = DEFAULT_FAQS
    let faqsEn = DEFAULT_FAQS_EN
    rows.forEach(r => {
      if (!r.value) return
      if (r.key === 'faq_items') { try { faqs = JSON.parse(r.value) } catch {} }
      else if (r.key === 'faq_items_en') { try { faqsEn = JSON.parse(r.value) } catch {} }
      else c[r.key] = r.value
    })
    return { c, faqs, faqsEn }
  } catch {
    return { c: DEFAULTS, faqs: DEFAULT_FAQS, faqsEn: DEFAULT_FAQS_EN }
  }
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const loc = locale as Locale
  const t = await getTranslations('faq')
  const { c, faqs, faqsEn } = await getContent()
  const g = (key: string) => getLocalizedContent(c, key, loc)
  const items = loc === 'en' ? faqsEn : faqs

  return (
    <>
      <Header />
      <main className="pt-16">
        <div className="bg-navy py-16 text-center">
          <p className="text-gold text-xs tracking-widest mb-2">{c.faq_subtitle}</p>
          <h1 className="text-white font-serif text-3xl">{t('title')}</h1>
        </div>
        <section className="py-16 bg-cream-alt">
          <div className="max-w-2xl mx-auto px-4">
            <div className="space-y-4">
              {items.map(({ q, a }: { q: string; a: string }, i: number) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-6">
                  <p className="font-medium text-navy mb-2 flex gap-2">
                    <span className="text-gold font-serif">Q.</span>{q}
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed flex gap-2">
                    <span className="text-navy font-serif font-medium">A.</span>{a}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <p className="text-sm text-gray-500 mb-4">{g('faq_bottom_text')}</p>
              <Link href="/contact" className="btn-primary">{g('faq_cta_label')}</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
