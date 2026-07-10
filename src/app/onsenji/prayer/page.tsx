export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Link from 'next/link'
import HeaderOnsenji from '@/components/HeaderOnsenji'
import FooterOnsenji from '@/components/FooterOnsenji'

export const metadata: Metadata = { title: '御祈願 | 日光山温泉寺' }

const DEFAULT_FEES = [
  { price: '5,000円', size: '28㎝' }, { price: '10,000円', size: '32㎝' },
  { price: '20,000円', size: '38㎝' }, { price: '30,000円', size: '42.5㎝' },
]

const DEFAULTS: Record<string, string> = {
  onsenji_prayer_about: '温泉寺では薬師如来への護摩祈祷を承っております。病気平癒・健康長寿・家内安全・学業成就など、各種ご祈願をお受けいただけます。護摩の炎で煩悩を焼き払い、薬師如来の御加護をいただく密教の秘法です。',
  onsenji_prayer_hours: '9：00〜12：00',
  onsenji_prayer_exclude_dates: '不定休（行事等による変更あり）',
  onsenji_prayer_exclude_note: '行事によっては祈祷できない日もございますので、事前にお問い合わせください。',
  onsenji_prayer_fees: JSON.stringify(DEFAULT_FEES),
  onsenji_prayer_mail_text: '万が一、参列できない場合は郵送にてお札をお送りします。着払いにて発送させて頂きますので、申込用紙に必要事項をご記入の上、現金書留にてお送りください。',
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

export default async function OnsenjPrayerPage() {
  const c = await getContent()
  const fees = pj<typeof DEFAULT_FEES>(c.onsenji_prayer_fees, DEFAULT_FEES)

  return (
    <>
      <HeaderOnsenji />
      <main className="pt-16">
        <div className="bg-onsenji/5 px-4 py-2 text-xs text-gray-400">
          <div className="max-w-3xl mx-auto"><Link href="/onsenji">ホーム</Link> &gt; 御祈願</div>
        </div>
        <section className="bg-onsenji py-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{backgroundImage:'repeating-linear-gradient(45deg,#7ec8a4 0,#7ec8a4 1px,transparent 0,transparent 50%)',backgroundSize:'20px 20px'}} />
          <p className="text-[#7ec8a4] text-xs tracking-[0.3em] mb-3 relative">Gokigan</p>
          <h1 className="font-serif text-4xl text-white tracking-widest relative">御祈願</h1>
          <p className="text-white/60 text-sm mt-3 relative">温泉寺 護摩祈祷</p>
        </section>
        <div className="max-w-3xl mx-auto px-4 py-12 space-y-14">
          <section>
            <h2 className="text-xl font-serif text-onsenji mb-1 pl-3 border-l-4 border-[#7ec8a4]">御祈願について</h2>
            <div className="mt-4 bg-white rounded-xl p-6 shadow-sm border-l-4 border-[#7ec8a4] leading-relaxed text-gray-700">{c.onsenji_prayer_about}</div>
          </section>
          <section>
            <h2 className="text-xl font-serif text-onsenji mb-1 pl-3 border-l-4 border-[#7ec8a4]">御祈願時間</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <tbody>
                  <tr className="border border-gray-200">
                    <th className="bg-onsenji text-white text-left px-4 py-3 font-medium whitespace-nowrap">通年（平日・土日祝）</th>
                    <td className="px-4 py-3 bg-white">{c.onsenji_prayer_hours}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-3 bg-white rounded-lg p-4 text-sm text-gray-700 border border-gray-200 space-y-1">
              <p>定時での御祈祷はございません。</p>
              <p><strong>予約制</strong>となりますので、事前にお申し込みをお願い致します。</p>
            </div>
            <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-gray-700 space-y-1">
              <p className="font-bold text-amber-700 text-xs">※除外日</p>
              <p>{c.onsenji_prayer_exclude_dates}</p>
              <p className="text-xs text-gray-500">{c.onsenji_prayer_exclude_note}</p>
            </div>
          </section>
          <section>
            <h2 className="text-xl font-serif text-onsenji mb-1 pl-3 border-l-4 border-[#7ec8a4]">御祈願料</h2>
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-onsenji text-white">
                    <th className="px-5 py-3 text-left font-medium">御祈願料</th>
                    <th className="px-5 py-3 text-left font-medium">御札サイズ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {fees.map(({ price, size }, i) => (
                    <tr key={i} className="bg-white even:bg-gray-50">
                      <td className="px-5 py-3 font-bold text-onsenji">{price}</td>
                      <td className="px-5 py-3 text-gray-700">{size}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <section>
            <h2 className="text-xl font-serif text-onsenji mb-1 pl-3 border-l-4 border-[#7ec8a4]">護摩札の郵送について</h2>
            <div className="mt-4 bg-white rounded-xl p-6 shadow-sm border-l-4 border-[#7ec8a4] text-sm text-gray-700 leading-relaxed">
              <p>{c.onsenji_prayer_mail_text}</p>
            </div>
          </section>
          <div className="bg-onsenji rounded-2xl p-8 text-center text-white">
            <p className="font-serif text-xl mb-2">御祈願のお申し込み</p>
            <p className="text-white/70 text-sm mb-6">ご不明な点はお気軽にお問い合わせください。</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/onsenji/contact" className="px-6 py-3 bg-[#7ec8a4] text-onsenji font-medium rounded-full hover:bg-[#a0d8bc] transition-colors text-sm">お問い合わせ</Link>
            </div>
          </div>
        </div>
      </main>
      <FooterOnsenji />
    </>
  )
}
