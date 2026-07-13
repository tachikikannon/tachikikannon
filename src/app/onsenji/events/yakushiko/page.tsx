import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import HeaderOnsenji from '@/components/HeaderOnsenji'
import FooterOnsenji from '@/components/FooterOnsenji'

export const metadata: Metadata = {
  title: '薬師講大祭・採灯大護摩供（8月8日） | 日光山温泉寺',
  description: '毎年8月8日開催。湯の湖畔にて山伏による採灯大護摩供を厳修。温泉寺最大の法要のご案内。',
}

const SCHEDULE = [
  { time: '11:00', title: '薬師講大祭', desc: '薬師堂にてご本尊・薬師瑠璃光如来への法要を執り行います。ご信徒・参拝者の皆様とともに薬師経をお唱えし、健康増進・病気平癒をご祈念いたします。' },
  { time: '11:30', title: '採灯大護摩供', desc: '湯の湖畔にて、山伏装束に身を包んだ僧侶たちによる採灯大護摩供を厳修いたします。護摩の炎に願い事を記した護摩木や写経を奉じ、薬師如来の御加護を祈ります。' },
  { time: '終了後', title: '写経奉納・御朱印授与', desc: '写経体験でお写しいただいた写経を御本尊に奉納いたします。特別御朱印のお授けも行います。' },
]

export default function YakushikoPage() {
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
          <Image src="/images/gyouji.JPEG" alt="薬師講大祭・採灯大護摩供" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-onsenji via-onsenji/50 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 text-center px-4">
            <p className="text-[#7ec8a4] text-xs tracking-[0.3em] mb-2">August 8th  Annual Event</p>
            <h1 className="font-serif text-3xl md:text-4xl text-white tracking-widest">薬師講大祭・採灯大護摩供</h1>
            <p className="text-white/70 text-sm mt-3">毎年8月8日　午前11時より</p>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-4 py-12 space-y-14">

          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-[#7ec8a4] rounded-full" />
              <h2 className="font-serif text-2xl text-onsenji">行事について</h2>
            </div>
            <p className="text-sm text-gray-700 leading-loose">
              毎年8月8日、温泉寺では湯の湖畔を舞台に、山伏によって採灯大護摩供が焚かれます。写経体験でお写しいただいた写経が御本尊に奉じられ、護摩の炎で焚き上げられます。薬師如来の御加護のもと、参拝者の願いが天に届けられる、温泉寺最大の法要です。
            </p>
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: '開催日', value: '8月8日（毎年）' },
                { label: '開始時間', value: '午前11時〜' },
                { label: '参列', value: '自由（申し込み不要）' },
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
              <h2 className="font-serif text-2xl text-onsenji">タイムスケジュール</h2>
            </div>
            <ol className="relative border-l-2 border-[#7ec8a4]/40 ml-5 space-y-8">
              {SCHEDULE.map(({ time, title, desc }, i) => (
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
              <h2 className="font-serif text-2xl text-onsenji">行事の様子</h2>
            </div>
            <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-md">
              <Image src="/images/gyouji.JPEG" alt="採灯大護摩供" fill className="object-cover" />
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-[#7ec8a4] rounded-full" />
              <h2 className="font-serif text-2xl text-onsenji">ご参列にあたって</h2>
            </div>
            <div className="space-y-3">
              {[
                '参列は自由です。事前のお申し込みは不要ですが、御札・願い事をご希望の方は申し込みフォームよりお申し込みください。',
                '写経体験（1,000円）は開湯期間中毎日受付しています。当日の写経奉納も可能です。',
                'お支払いは当日・現地にてお受けいたします。',
                '詳細・変更がある場合は当サイトまたはお電話にてご確認ください。',
              ].map((text, i) => (
                <div key={i} className="flex gap-3 text-sm text-gray-700 leading-relaxed bg-onsenji/5 rounded-xl px-4 py-3">
                  <span className="text-[#7ec8a4] font-bold flex-shrink-0">・</span>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="bg-onsenji rounded-2xl p-8 text-center text-white">
            <p className="font-serif text-xl mb-2">御札のお申し込み</p>
            <p className="text-white/70 text-sm mb-6">
              大護摩供にてお焚き上げする御札をご希望の方は<br className="hidden sm:block" />
              申し込みフォームよりお申し込みください。<br />
              お支払いは当日・現地にて。
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
