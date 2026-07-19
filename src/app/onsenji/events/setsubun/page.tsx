export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import HeaderOnsenji from '@/components/HeaderOnsenji'
import FooterOnsenji from '@/components/FooterOnsenji'

export const metadata: Metadata = {
  title: '節分大祭（1月下旬） | 日光山温泉寺',
  description: '毎年1月下旬開催。新年の邪気を払い福を招く節分大祭のご案内。豆まき・護摩供。日程は年によって異なります。',
}

const DEFAULT_SCHEDULE = [
  { time: '11:00', title: '節分大祭（法要）', desc: '薬師堂にて節分の法要を執り行います。ご本尊・薬師如来のご加護のもと、新年の無病息災・開運招福をお祈りいたします。' },
  { time: '11:30', title: '護摩供', desc: '護摩の炎に参拝者の願い事を記した護摩木を奉じ、薬師如来の御力で煩悩や邪気をお焚き上げいたします。' },
  { time: '終了後', title: '豆まき', desc: '「鬼は外、福は内」の声とともに豆まきを行います。参列の皆様にも豆をお配りいたします。' },
]

const DEFAULT_NOTES = [
  { text: '参列は自由です。事前のお申し込みは不要ですが、御札をご希望の方は申し込みフォームよりお申し込みください。' },
  { text: '1月の湯元は積雪・寒冷が予想されます。防寒対策を十分にしてお越しください。' },
  { text: 'お支払いは当日・現地にてお受けいたします。' },
  { text: '日程は年によって異なります。必ず事前にお電話またはウェブサイトでご確認ください。' },
]

const DEFAULTS: Record<string, string> = {
  setsubun_subtitle: '毎年1月下旬　午前11時より　※日程は年によって異なります',
  setsubun_heading_about: '行事について',
  setsubun_about: '新年の邪気を払い、福を招く節分の法要です。豆まきや護摩供を通じて、参拝者の一年の健康と幸福をお祈りします。冬季の静けさのなか、厳かな雰囲気に包まれた温泉寺ならではの行事です。',
  setsubun_info_date: '1月下旬（毎年）',
  setsubun_info_time: '午前11時〜',
  setsubun_info_join: '自由（申し込み不要）',
  setsubun_date_note: '📌 詳細な日程は年によって異なります。最新情報はお電話（0288-55-0013）またはお問い合わせフォームでご確認ください。',
  setsubun_heading_schedule: 'タイムスケジュール',
  setsubun_heading_notes: 'ご参列にあたって',
  setsubun_cta_heading: '御札のお申し込み',
  setsubun_cta_text: '護摩供にてお焚き上げする御札をご希望の方は\n申し込みフォームよりお申し込みください。\nお支払いは当日・現地にて。',
  setsubun_schedule: JSON.stringify(DEFAULT_SCHEDULE),
  setsubun_notes: JSON.stringify(DEFAULT_NOTES),
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

export default async function SetsubunPage() {
  const c = await getContent()
  const schedule = pj<typeof DEFAULT_SCHEDULE>(c.setsubun_schedule, DEFAULT_SCHEDULE)
  const notes    = pj<typeof DEFAULT_NOTES>(c.setsubun_notes, DEFAULT_NOTES)
  return (
    <>
      <HeaderOnsenji />
      <main className="pt-16">
        <div className="bg-onsenji/5 px-4 py-2 text-xs text-gray-400">
          <div className="max-w-3xl mx-auto">
            <Link href="/onsenji">ホーム</Link> &gt; <Link href="/onsenji/events">年間行事</Link> &gt; 節分大祭
          </div>
        </div>

        <section className="relative h-72 md:h-96 overflow-hidden">
          <Image src="/images/gyouji.JPEG" alt="節分大祭" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-onsenji via-onsenji/50 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 text-center px-4">
            <p className="text-[#7ec8a4] text-xs tracking-[0.3em] mb-2">January  Annual Event</p>
            <h1 className="font-serif text-3xl md:text-4xl text-white tracking-widest">温泉寺 節分大祭</h1>
            <p className="text-white/70 text-sm mt-3">{c.setsubun_subtitle}</p>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-4 py-12 space-y-14">

          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-[#7ec8a4] rounded-full" />
              <h2 className="font-serif text-2xl text-onsenji">{c.setsubun_heading_about}</h2>
            </div>
            <p className="text-sm text-gray-700 leading-loose">{c.setsubun_about}</p>
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: '開催日', value: c.setsubun_info_date },
                { label: '開始時間', value: c.setsubun_info_time },
                { label: '参列', value: c.setsubun_info_join },
              ].map(({ label, value }) => (
                <div key={label} className="bg-onsenji/5 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-400 mb-1">{label}</p>
                  <p className="text-sm font-medium text-onsenji">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700">
              {c.setsubun_date_note}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-[#7ec8a4] rounded-full" />
              <h2 className="font-serif text-2xl text-onsenji">{c.setsubun_heading_schedule}</h2>
            </div>
            <ol className="relative border-l-2 border-[#7ec8a4]/40 ml-5 space-y-8">
              {schedule.map(({ time, title, desc }, i) => (
                <li key={i} className="pl-8 relative">
                  <div className="absolute -left-[21px] top-0 w-10 h-10 rounded-full bg-onsenji flex items-center justify-center shadow-md">
                    <span className="text-[#7ec8a4] text-xs font-bold">{i + 1}</span>
                  </div>
                  <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="text-[#2d6b57] font-bold text-lg tracking-wide">{time}</span>
                      <h3 className="font-serif text-onsenji text-lg">{title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-[#7ec8a4] rounded-full" />
              <h2 className="font-serif text-2xl text-onsenji">{c.setsubun_heading_notes}</h2>
            </div>
            <div className="space-y-3">
              {notes.map(({ text }, i) => (
                <div key={i} className="flex gap-3 text-sm text-gray-700 leading-relaxed bg-onsenji/5 rounded-xl px-4 py-3">
                  <span className="text-[#7ec8a4] font-bold flex-shrink-0">・</span>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="bg-onsenji rounded-2xl p-8 text-center text-white">
            <p className="font-serif text-xl mb-2">{c.setsubun_cta_heading}</p>
            <p className="text-white/70 text-sm mb-6">
              {c.setsubun_cta_text.split('\n').map((line: string, i: number) => (
                <span key={i}>{line}<br /></span>
              ))}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/onsenji/events/setsubun/apply"
                className="inline-block px-8 py-3 bg-[#7ec8a4] text-onsenji font-medium rounded-full hover:bg-[#a0d8bc] transition-colors text-sm">
                申し込みフォームへ
              </Link>
              <Link href="/onsenji/contact"
                className="inline-block px-8 py-3 border border-white/40 text-white rounded-full hover:bg-white/10 transition-colors text-sm">
                お問い合わせ
              </Link>
            </div>
          </div>

          <div className="flex gap-4">
            <Link href="/onsenji/events/yakushiko"
              className="flex-1 text-center py-3 border border-onsenji/20 rounded-xl text-sm text-onsenji hover:bg-onsenji hover:text-white transition-colors">
              ← 8月8日 薬師講大祭
            </Link>
            <Link href="/onsenji/events"
              className="flex-1 text-center py-3 border border-onsenji/20 rounded-xl text-sm text-onsenji hover:bg-onsenji hover:text-white transition-colors">
              年間行事一覧 →
            </Link>
          </div>
        </div>
      </main>
      <FooterOnsenji />
    </>
  )
}
