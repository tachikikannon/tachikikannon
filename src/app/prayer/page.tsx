export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = { title: '御祈願' }

const DEFAULT_FEES = [
  { price: '5,000円', size: '28㎝' }, { price: '10,000円', size: '32㎝' },
  { price: '20,000円', size: '38㎝' }, { price: '30,000円', size: '42.5㎝' },
]

const DEFAULTS: Record<string, string> = {
  prayer_about: 'お護摩はインド伝来の密教の秘法（秘密の教え）で、僧侶が護摩壇に向かい、作法にしたがって仏の智慧の火を焚き、様々な供物を焚き上げ、厄難・災難を払いその加護（成就）を願います。',
  prayer_hours: '9：00〜12：00',
  prayer_exclude_dates: '6月18日・8月4日・8月8日',
  prayer_exclude_note: '他にも行事によっては祈祷できない日もございますので、一度お問い合わせください。',
  prayer_fees: JSON.stringify(DEFAULT_FEES),
  prayer_mail_text: '万が一、参列できない場合は郵送にてお札をお送りします。着払いにて発送させて頂きますので、申込用紙に必要事項をご記入の上、現金書留にてお送りください。',
  prayer_car_desc: 'お車を新しくされた方、車両安全の御祈願をお申し込みの方',
  prayer_car_note: '※交通安全の錫杖守りと木札が付きます。',
  prayer_birth_fee: '5,000円',
  prayer_birth_note: '※腹帯の持ち込みも可能です。詳しくはお問い合わせください。',
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

export default async function PrayerPage() {
  const c = await getContent()
  const fees = pj<typeof DEFAULT_FEES>(c.prayer_fees, DEFAULT_FEES)

  return (
    <>
      <Header />
      <main className="pt-16">
        <div className="bg-cream-alt px-4 py-2 text-xs text-gray-400">
          <div className="max-w-3xl mx-auto"><Link href="/">ホーム</Link> &gt; 御祈願</div>
        </div>
        <section className="relative h-72 md:h-96 overflow-hidden">
          <Image src="/images/goma.png" alt="御護摩" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 text-center px-4">
            <p className="text-gold text-xs tracking-[0.3em] mb-3">Gokigan</p>
            <h1 className="font-serif text-4xl text-white tracking-widest">御祈願</h1>
            <p className="text-white/60 text-sm mt-3">立木観音護摩祈祷</p>
          </div>
        </section>
        <div className="max-w-3xl mx-auto px-4 py-12 space-y-14">
          <section>
            <h2 className="text-xl font-serif text-navy mb-1 pl-3 border-l-4 border-gold">御祈願について</h2>
            <div className="mt-4 bg-white rounded-xl p-6 shadow-sm border-l-4 border-gold leading-relaxed text-gray-700">{c.prayer_about}</div>
          </section>
          <section>
            <h2 className="text-xl font-serif text-navy mb-1 pl-3 border-l-4 border-gold">御祈願時間</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <tbody>
                  <tr className="border border-gray-200">
                    <th className="bg-navy text-white text-left px-4 py-3 font-medium whitespace-nowrap">通年（平日・土日祝）</th>
                    <td className="px-4 py-3 bg-white">{c.prayer_hours}</td>
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
              <p>{c.prayer_exclude_dates}</p>
              <p className="text-xs text-gray-500">{c.prayer_exclude_note}</p>
            </div>
          </section>
          <section>
            <h2 className="text-xl font-serif text-navy mb-1 pl-3 border-l-4 border-gold">御祈願料</h2>
            <p className="text-sm text-gray-600 mt-3 mb-4">原則、御札の料金にて受付しております。金額によって御札と木箱の大きさが変わります。</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-navy text-white">
                    <th className="px-5 py-3 text-left font-medium">御祈願料</th>
                    <th className="px-5 py-3 text-left font-medium">御札サイズ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {fees.map(({ price, size }, i) => (
                    <tr key={i} className="bg-white even:bg-gray-50">
                      <td className="px-5 py-3 font-bold text-navy">{price}</td>
                      <td className="px-5 py-3 text-gray-700">{size}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <section>
            <h2 className="text-xl font-serif text-navy mb-1 pl-3 border-l-4 border-gold">護摩札の郵送について</h2>
            <div className="mt-4 bg-white rounded-xl p-6 shadow-sm border-l-4 border-gold text-sm text-gray-700 leading-relaxed space-y-2">
              <p>{c.prayer_mail_text}</p>
              <p className="text-xs text-gray-500">※お申込み頂き御祈祷後、発送させて頂きますので1〜2週間ほどお待ちください。</p>
            </div>
          </section>
          <section>
            <h2 className="text-xl font-serif text-navy mb-1 pl-3 border-l-4 border-gold">その他の御祈願</h2>
            <div className="mt-4 space-y-4">
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <h3 className="font-medium text-navy pl-3 border-l-3 border-gold mb-2">新車祈祷（車両安全祈願）</h3>
                <p className="text-xs text-gray-500 mb-3">{c.prayer_car_desc}</p>
                <table className="w-full text-sm border-collapse mb-2">
                  <tbody>
                    {[['1台', '5,000円'], ['', '10,000円']].map(([k, v], i) => (
                      <tr key={i} className="border border-gray-100">
                        <td className="px-4 py-2 text-gray-500 bg-gray-50 w-32">{k}</td>
                        <td className="px-4 py-2 font-bold text-navy">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-xs text-gray-400">{c.prayer_car_note}</p>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <h3 className="font-medium text-navy pl-3 border-l-3 border-gold mb-2">安産祈願</h3>
                <table className="w-full text-sm border-collapse mb-2">
                  <tbody>
                    <tr className="border border-gray-100">
                      <td className="px-4 py-2 text-gray-500 bg-gray-50 w-32">お1人につき</td>
                      <td className="px-4 py-2 font-bold text-navy">{c.prayer_birth_fee}</td>
                    </tr>
                  </tbody>
                </table>
                <p className="text-xs text-gray-400">{c.prayer_birth_note}</p>
              </div>
            </div>
          </section>
          <div className="bg-navy rounded-2xl p-8 text-center text-white">
            <p className="font-serif text-xl mb-2">御祈願のお申し込み</p>
            <p className="text-white/70 text-sm mb-6">ご不明な点はお気軽にお問い合わせください。</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/reserve" className="btn-gold">オンライン予約はこちら</Link>
              <Link href="/contact" className="btn-outline">お問い合わせ</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
