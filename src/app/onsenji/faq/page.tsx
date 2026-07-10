export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Link from 'next/link'
import HeaderOnsenji from '@/components/HeaderOnsenji'
import FooterOnsenji from '@/components/FooterOnsenji'

export const metadata: Metadata = { title: 'よくある質問 | 日光山温泉寺' }

const DEFAULT_FAQS = [
  { q: '温泉（薬師の湯）は誰でも利用できますか？', a: 'はい、拝観料をお納めいただいた方はどなたでもご利用いただけます。足湯・手湯がございます。タオルはご持参ください。' },
  { q: '入浴施設（内湯）はありますか？', a: '現在は足湯・手湯のみのご提供となっております。内湯のご利用はできませんのでご了承ください。' },
  { q: '御祈願は予約が必要ですか？', a: 'はい、御祈願は完全予約制です。事前にお電話またはお問い合わせフォームよりご予約ください。' },
  { q: '拝観所要時間はどのくらいですか？', a: '境内の拝観と薬師の湯（足湯）のご利用で、約30〜60分程度を目安にお考えください。' },
  { q: '車でのアクセスはできますか？', a: 'はい、お車でお越しいただけます。日光宇都宮道路 日光ICよりいろは坂経由で約40分です。近隣に有料駐車場がございます。' },
  { q: 'ペットを連れて参拝できますか？', a: '境内に限りペットの同伴は可能ですが、本堂などの堂内へのお連れ込みはご遠慮ください。' },
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
