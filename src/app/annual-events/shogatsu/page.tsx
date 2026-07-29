export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ZoomableImage from '@/components/ZoomableImage'

export const metadata: Metadata = {
  title: '正月元旦特別護摩祈願（1月1日） | 日光山中禅寺 立木観音',
  description: '毎年1月1日開催。新しい年の始まりに一年の無病息災・家内安全・開運招福を祈願する特別護摩祈祷。事前申し込み必要、最大5名まで同時申込可。',
}

const DEFAULT_NOTES = [
  { text: '事前の申し込みが必要です。1回のお申し込みで最大5名様までまとめてお申し込みいただけます。' },
  { text: '御札は5,000円（28㎝）・10,000円（32㎝）・20,000円（38㎝）・30,000円（42.5㎝）よりお選びいただけます。' },
  { text: 'お支払い方法はECサイト・代金引換（代引き）よりお選びいただけます。' },
  { text: '天候・状況により内容が変更・中止となる場合がございます。詳細はお電話にてご確認ください。' },
]

const DEFAULT_FEES = [
  { price: '5,000円', size: '28㎝' },
  { price: '10,000円', size: '32㎝' },
  { price: '20,000円', size: '38㎝' },
  { price: '30,000円', size: '42.5㎝' },
]

const DEFAULTS: Record<string, string> = {
  shogatsu_subtitle: '毎年1月1日　午前0時より　※事前申し込み必要',
  shogatsu_heading_about: '行事について',
  shogatsu_about: '正月元旦特別護摩祈願は、新しい年の始まりにあたり、皆様の一年の無病息災・家内安全・開運招福を祈願する特別な護摩祈祷です。元日、僧侶による厳かな護摩焚きとともに、新年の平安と幸福をお祈りいたします。御札は4種類の中からお選びいただき、お申し込み時にお願い事を2つまでお選びいただけます。',
  shogatsu_info_date: '1月1日（毎年）',
  shogatsu_info_time: '午前0時〜',
  shogatsu_info_join: '事前申し込み必要（最大5名まで）',
  shogatsu_heading_fees: '御札の種類',
  shogatsu_heading_notes: 'ご参加にあたって',
  shogatsu_cta_heading: '正月元旦特別護摩祈願 お申し込み',
  shogatsu_cta_text: '最大5名まで同時にお申し込みいただけます。\nお支払いはECサイト・代引きからお選びいただけます。',
  shogatsu_notes: JSON.stringify(DEFAULT_NOTES),
  shogatsu_fees: JSON.stringify(DEFAULT_FEES),
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

export default async function ShogatsuPage() {
  const c = await getContent()
  const notes = pj<typeof DEFAULT_NOTES>(c.shogatsu_notes, DEFAULT_NOTES)
  const fees  = pj<typeof DEFAULT_FEES>(c.shogatsu_fees, DEFAULT_FEES)

  return (
    <>
      <Header />
      <main className="pt-16">
        <div className="bg-cream-alt px-4 py-2 text-xs text-gray-400">
          <div className="max-w-3xl mx-auto">
            <Link href="/">ホーム</Link> &gt; <Link href="/annual-events">年間行事</Link> &gt; 正月元旦特別護摩祈願
          </div>
        </div>

        <section className="relative h-72 md:h-96 overflow-hidden">
          <ZoomableImage src="/images/goma.png" alt="正月元旦特別護摩祈願" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 text-center px-4">
            <p className="text-gold text-xs tracking-[0.3em] mb-2">January 1st  Annual Event</p>
            <h1 className="font-serif text-3xl md:text-4xl text-white tracking-widest">正月元旦特別護摩祈願</h1>
            <p className="text-white/70 text-sm mt-3">{c.shogatsu_subtitle}</p>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-4 py-12 space-y-14">

          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gold rounded-full" />
              <h2 className="font-serif text-2xl text-navy">{c.shogatsu_heading_about}</h2>
            </div>
            <p className="text-sm text-gray-700 leading-loose">{c.shogatsu_about}</p>
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: '開催日', value: c.shogatsu_info_date },
                { label: '開始時間', value: c.shogatsu_info_time },
                { label: '参加', value: c.shogatsu_info_join },
              ].map(({ label, value }) => (
                <div key={label} className="bg-cream-alt rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-400 mb-1">{label}</p>
                  <p className="text-sm font-medium text-navy">{value}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gold rounded-full" />
              <h2 className="font-serif text-2xl text-navy">{c.shogatsu_heading_fees}</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-navy text-white">
                    <th className="px-5 py-3 text-left font-medium">御祈願料</th>
                    <th className="px-5 py-3 text-left font-medium">御札サイズ</th>
                  </tr>
                </thead>
                <tbody>
                  {fees.map(({ price, size }) => (
                    <tr key={price} className="border border-gray-200">
                      <td className="px-5 py-3 font-bold text-navy bg-cream-alt">{price}</td>
                      <td className="px-5 py-3">{size}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gold rounded-full" />
              <h2 className="font-serif text-2xl text-navy">{c.shogatsu_heading_notes}</h2>
            </div>
            <div className="space-y-3">
              {notes.map(({ text }, i) => (
                <div key={i} className="flex gap-3 text-sm text-gray-700 leading-relaxed bg-cream-alt rounded-xl px-4 py-3">
                  <span className="text-gold font-bold flex-shrink-0">・</span>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="bg-navy rounded-2xl p-8 text-center text-white">
            <p className="font-serif text-xl mb-2">{c.shogatsu_cta_heading}</p>
            <p className="text-white/70 text-sm mb-6">
              {c.shogatsu_cta_text.split('\n').map((line: string, i: number) => (
                <span key={i}>{line}<br /></span>
              ))}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/annual-events/shogatsu/apply"
                className="inline-block px-8 py-3 bg-gold text-navy font-medium rounded-full hover:opacity-90 transition-colors text-sm">
                申し込みフォームへ
              </Link>
              <Link href="/contact"
                className="inline-block px-8 py-3 border border-white/40 text-white rounded-full hover:bg-white/10 transition-colors text-sm">
                お問い合わせ
              </Link>
            </div>
          </div>

          <div className="flex gap-4">
            <Link href="/annual-events"
              className="flex-1 text-center py-3 border border-navy/20 rounded-xl text-sm text-navy hover:bg-navy hover:text-white transition-colors">
              年間行事一覧 →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
