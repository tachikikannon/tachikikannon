export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Link from 'next/link'
import HeaderOnsenji from '@/components/HeaderOnsenji'
import FooterOnsenji from '@/components/FooterOnsenji'

export const metadata: Metadata = { title: 'よくある質問 | 日光山温泉寺' }

const DEFAULT_FAQS = [
  { q: '温泉（薬師の湯）は誰でも利用できますか？', a: 'はい、志納金（大人500円・小人300円）をお納めいただいた方はどなたでもご利用いただけます。令和8年4月11日より開湯した源泉かけ流しの温泉です。タオルをご持参ください。' },
  { q: '薬師の湯の泉質を教えてください。', a: '泉質は含硫黄‐カルシウム・ナトリウム‐硫酸塩・炭酸水素塩泉で、泉温は71.4℃です。完全かけ流しで、加水すると乳白色に変わる美しい湯です。' },
  { q: '御祈願は予約が必要ですか？', a: 'はい、御祈願は予約制となっております。事前にお電話またはお問い合わせフォームよりご連絡ください。' },
  { q: '写経体験はできますか？', a: 'はい、毎日実施しています。体験料1,000円で特別御朱印もお授けします。所要時間は約15分です。予約不要で、受付時にお申し付けください。' },
  { q: '営業時間・休業期間を教えてください。', a: '受付時間は8時00分〜16時00分、参篭時間は8時00分〜17時00分です。12月〜4月上旬は冬季休業となります。閉湯・開湯の正確な日程は公式ホームページをご確認ください。' },
  { q: '温泉寺は輪王寺と関係がありますか？', a: 'はい、日光山温泉寺は世界遺産「日光山輪王寺」の別院です。延暦7年（788年）に勝道上人によって開創され、江戸時代には輪王寺宮の直轄寺院として栄えました。' },
]

async function getContent() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  try {
    const res = await fetch(`${url}/rest/v1/site_content?key=in.(onsenji_faq_items)&select=key,value`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` }, cache: 'no-store',
    })
    if (!res.ok) return DEFAULT_FAQS
    const rows: { key: string; value: string }[] = await res.json()
    const row = rows.find(r => r.key === 'onsenji_faq_items')
    if (!row?.value) return DEFAULT_FAQS
    try { return JSON.parse(row.value) } catch { return DEFAULT_FAQS }
  } catch { return DEFAULT_FAQS }
}

export default async function OnsenjFaqPage() {
  const faqs: { q: string; a: string }[] = await getContent()

  return (
    <>
      <HeaderOnsenji />
      <main className="pt-16">
        <div className="bg-onsenji/5 px-4 py-2 text-xs text-gray-400">
          <div className="max-w-3xl mx-auto"><Link href="/onsenji">ホーム</Link> &gt; よくある質問</div>
        </div>
        <section className="bg-onsenji py-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{backgroundImage:'repeating-linear-gradient(45deg,#7ec8a4 0,#7ec8a4 1px,transparent 0,transparent 50%)',backgroundSize:'20px 20px'}} />
          <p className="text-[#7ec8a4] text-xs tracking-[0.3em] mb-3 relative">FAQ</p>
          <h1 className="font-serif text-4xl text-white tracking-widest relative">よくある質問</h1>
        </section>
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="space-y-4">
            {faqs.map(({ q, a }, i) => (
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
            <p className="font-serif text-lg mb-2">その他のご質問</p>
            <p className="text-white/70 text-sm mb-6">解決しない場合はお気軽にお問い合わせください。</p>
            <Link href="/onsenji/contact"
              className="inline-block px-8 py-3 bg-[#7ec8a4] text-onsenji font-medium rounded-full hover:bg-[#a0d8bc] transition-colors text-sm">
              お問い合わせ
            </Link>
          </div>
        </div>
      </main>
      <FooterOnsenji />
    </>
  )
}
