export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Link from 'next/link'
import HeaderOnsenji from '@/components/HeaderOnsenji'
import FooterOnsenji from '@/components/FooterOnsenji'
import ZoomableImage from '@/components/ZoomableImage'

export const metadata: Metadata = {
  title: '薬師講大祭・採灯大護摩供（8月8日） | 日光山温泉寺',
  description: '毎年8月8日開催。湯の湖畔にて山伏による採灯大護摩供を厳修。温泉寺最大の法要のご案内。',
}

const DEFAULT_SCHEDULE = [
  { time: '11:00', title: '薬師講大祭', desc: '薬師堂にてご本尊・薬師瑠璃光如来への法要を執り行います。ご信徒・参拝者の皆様とともに薬師経をお唱えし、健康増進・病気平癒をご祈念いたします。' },
  { time: '11:30', title: '採灯大護摩供', desc: '湯の湖畔にて、山伏装束に身を包んだ僧侶たちによる採灯大護摩供を厳修いたします。護摩の炎に願い事を記した護摩木や写経を奉じ、薬師如来の御加護を祈ります。' },
  { time: '終了後', title: '写経奉納・御朱印授与', desc: '写経体験でお写しいただいた写経を御本尊に奉納いたします。特別御朱印のお授けも行います。' },
]

const DEFAULT_NOTES = [
  { text: '参列は自由です。事前のお申し込みは不要ですが、御札・願い事をご希望の方は申し込みフォームよりお申し込みください。' },
  { text: '写経体験（1,000円）は開湯期間中毎日受付しています。当日の写経奉納も可能です。' },
  { text: 'お支払いは当日・現地にてお受けいたします。' },
  { text: '詳細・変更がある場合は当サイトまたはお電話にてご確認ください。' },
]

const DEFAULTS: Record<string, string> = {
  yakushiko_subtitle: '毎年8月8日　午前11時より',
  yakushiko_heading_about: '行事について',
  yakushiko_about: '毎年8月8日、温泉寺では湯の湖畔を舞台に、山伏によって採灯大護摩供が焚かれます。写経体験でお写しいただいた写経が御本尊に奉じられ、護摩の炎で焚き上げられます。薬師如来の御加護のもと、参拝者の願いが天に届けられる、温泉寺最大の法要です。',
  yakushiko_info_date: '8月8日（毎年）',
  yakushiko_info_time: '午前11時〜',
  yakushiko_info_join: '自由（申し込み不要）',
  yakushiko_heading_schedule: 'タイムスケジュール',
  yakushiko_heading_gallery: '行事の様子',
  yakushiko_heading_notes: 'ご参列にあたって',
  yakushiko_cta_heading: '御札のお申し込み',
  yakushiko_cta_text: '大護摩供にてお焚き上げする御札をご希望の方は\n申し込みフォームよりお申し込みください。\nお支払いは当日・現地にて。',
  yakushiko_schedule: JSON.stringify(DEFAULT_SCHEDULE),
  yakushiko_notes: JSON.stringify(DEFAULT_NOTES),
}

const GALLERY_IMAGES = [
  '/images/温泉寺法楽/yakusyo-onsen1 (1).JPEG',
  '/images/温泉寺法楽/yakusyo-onsen1 (2).JPEG',
  '/images/温泉寺法楽/yakusyo-onsen1 (3).JPEG',
  '/images/温泉寺法楽/yakusyo-onsen1 (4).JPEG',
  '/images/温泉寺法楽/yakusyo-onsen1 (5).JPEG',
  '/images/温泉寺法楽/yakusyo-onsen1 (6).JPEG',
]

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

export default async function YakushikoPage() {
  const c = await getContent()
  const schedule = pj<typeof DEFAULT_SCHEDULE>(c.yakushiko_schedule, DEFAULT_SCHEDULE)
  const notes    = pj<typeof DEFAULT_NOTES>(c.yakushiko_notes, DEFAULT_NOTES)

  return (
    <>
      <HeaderOnsenji />
      <main className="pt-16">
        <div className="bg-onsenji/5 px-4 py-2 text-xs text-gray-400">
          <div className="max-w-3xl mx-auto">
            <Link href="/onsenji">ホーム</Link> &gt; <Link href="/onsenji/events">年間行事</Link> &gt; 薬師講大祭・採灯大護摩供
          </div>
        </div>

        <section className="relative h-72 md:h-96 overflow-hidden">
          <ZoomableImage src="/images/温泉寺法楽/saitougoma-onsen.JPEG" alt="薬師講大祭・採灯大護摩供" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-onsenji via-onsenji/50 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 text-center px-4">
            <p className="text-[#7ec8a4] text-xs tracking-[0.3em] mb-2">August 8th  Annual Event</p>
            <h1 className="font-serif text-3xl md:text-4xl text-white tracking-widest">薬師講大祭・採灯大護摩供</h1>
            <p className="text-white/70 text-sm mt-3">{c.yakushiko_subtitle}</p>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-4 py-12 space-y-14">

          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-[#7ec8a4] rounded-full" />
              <h2 className="font-serif text-2xl text-onsenji">{c.yakushiko_heading_about}</h2>
            </div>
            <p className="text-sm text-gray-700 leading-loose">{c.yakushiko_about}</p>
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: '開催日', value: c.yakushiko_info_date },
                { label: '開始時間', value: c.yakushiko_info_time },
                { label: '参列', value: c.yakushiko_info_join },
              ].map(({ label, value }) => (
                <div key={label} className="bg-onsenji/5 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-400 mb-1">{label}</p>
                  <p className="text-sm font-medium text-onsenji">{value}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-[#7ec8a4] rounded-full" />
              <h2 className="font-serif text-2xl text-onsenji">{c.yakushiko_heading_schedule}</h2>
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
              <h2 className="font-serif text-2xl text-onsenji">{c.yakushiko_heading_gallery}</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {GALLERY_IMAGES.map((src, i) => (
                <div key={src} className="relative h-40 md:h-52 rounded-xl overflow-hidden shadow-sm">
                  <ZoomableImage src={src} alt={`薬師講大祭・採灯大護摩供の様子 ${i + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-[#7ec8a4] rounded-full" />
              <h2 className="font-serif text-2xl text-onsenji">{c.yakushiko_heading_notes}</h2>
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
            <p className="font-serif text-xl mb-2">{c.yakushiko_cta_heading}</p>
            <p className="text-white/70 text-sm mb-6">
              {c.yakushiko_cta_text.split('\n').map((line: string, i: number) => (
                <span key={i}>{line}<br /></span>
              ))}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/onsenji/events/yakushiko/apply"
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
            <Link href="/onsenji/events"
              className="flex-1 text-center py-3 border border-onsenji/20 rounded-xl text-sm text-onsenji hover:bg-onsenji hover:text-white transition-colors">
              ← 年間行事一覧
            </Link>
            <Link href="/onsenji/events/setsubun"
              className="flex-1 text-center py-3 border border-onsenji/20 rounded-xl text-sm text-onsenji hover:bg-onsenji hover:text-white transition-colors">
              1月 節分大祭 →
            </Link>
          </div>
        </div>
      </main>
      <FooterOnsenji />
    </>
  )
}
