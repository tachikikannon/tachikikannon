export const dynamic = 'force-dynamic'

import Header from '@/components/Header'
import Footer from '@/components/Footer'

const DEFAULT_FAQS = [
  { q: '拝観時間を教えてください。', a: '4月〜11月は8:00〜17:00、12月〜3月は9:00〜16:00です。受付は閉門30分前までとなります。' },
  { q: '拝観料はいくらですか？', a: '大人500円、子供200円です。' },
  { q: '御祈願の予約は必要ですか？', a: '事前予約をお勧めしております。当日受付も可能な場合がありますが、混雑時はお断りする場合がございます。' },
  { q: '写経・写仏・数珠づくり体験の予約方法を教えてください。', a: 'ウェブサイトの「体験のご予約はこちら」よりオンラインでご予約いただけます。' },
  { q: '駐車場はありますか？', a: '中禅寺温泉周辺の有料駐車場をご利用ください。春・秋の観光シーズンはいろは坂が渋滞します。公共交通機関のご利用をお勧めします。' },
  { q: '御朱印はいただけますか？', a: 'はい、書き入れと書き置きをご用意しております。拝観時間内にお声がけください。' },
  { q: 'ベビーカーや車椅子での参拝はできますか？', a: '境内は段差がある箇所もございます。詳しくは事前にお問い合わせください。' },
  { q: 'お守り・授与品の通販はできますか？', a: 'はい、公式通販サイト（chuzenji.official.ec）にてお求めいただけます。' },
]

async function getFaqs() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  try {
    const res = await fetch(`${url}/rest/v1/site_content?key=eq.faq_items&select=value`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      cache: 'no-store',
    })
    if (!res.ok) return DEFAULT_FAQS
    const rows: { value: string }[] = await res.json()
    if (rows[0]?.value) return JSON.parse(rows[0].value)
    return DEFAULT_FAQS
  } catch {
    return DEFAULT_FAQS
  }
}

export default async function FaqPage() {
  const faqs = await getFaqs()

  return (
    <>
      <Header />
      <main className="pt-16">
        <div className="bg-navy py-16 text-center">
          <p className="text-gold text-xs tracking-widest mb-2">FAQ</p>
          <h1 className="text-white font-serif text-3xl">よくある質問</h1>
        </div>
        <section className="py-16 bg-cream-alt">
          <div className="max-w-2xl mx-auto px-4">
            <div className="space-y-4">
              {faqs.map(({ q, a }: { q: string; a: string }, i: number) => (
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
              <p className="text-sm text-gray-500 mb-4">解決しない場合はお気軽にお問い合わせください。</p>
              <a href="/contact" className="btn-primary">お問い合わせはこちら</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
