export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import HeaderOnsenji from '@/components/HeaderOnsenji'
import FooterOnsenji from '@/components/FooterOnsenji'

export const metadata: Metadata = {
  title: '年間行事 | 日光山温泉寺',
  description: '日光山温泉寺の年間行事・法要のご案内。8月8日 薬師講大祭・採灯大護摩供、1月下旬 節分大祭。',
}

const EVENTS = [
  {
    month: '8月',
    date: '8月8日',
    name: '薬師講大祭・採灯大護摩供',
    time: '午前11時〜',
    desc: '湯の湖畔にて、山伏によって採灯大護摩供が焚かれます。体験でお写しいただいた写経が御本尊に奉じられ、護摩の炎で焚き上げられます。薬師如来の御加護のもと、参拝者の願いが天に届けられる、温泉寺最大の法要です。',
    note: '参列自由。写経体験（1,000円）は開湯期間中毎日受付しています。当日奉納も可能です。',
    image: '/images/gyouji.JPEG',
    imageAlt: '薬師講大祭・採灯大護摩供',
  },
  {
    month: '1月',
    date: '1月下旬',
    name: '温泉寺 節分大祭',
    time: '午前11時〜',
    desc: '新年の邪気を払い、福を招く節分の法要です。豆まきや護摩供を通じて、参拝者の一年の健康と幸福をお祈りします。冬季の静けさのなか、厳かな雰囲気に包まれた温泉寺ならではの行事です。',
    note: '詳細な日程は年によって異なります。最新情報はお電話またはお問い合わせフォームでご確認ください。',
    image: '/images/gyouji.JPEG',
    imageAlt: '節分大祭',
  },
]

export default async function OnsenjEventsPage() {
  return (
    <>
      <HeaderOnsenji />
      <main className="pt-16">
        <div className="bg-onsenji/5 px-4 py-2 text-xs text-gray-400">
          <div className="max-w-3xl mx-auto">
            <Link href="/onsenji">ホーム</Link> &gt; 年間行事
          </div>
        </div>

        <section className="bg-onsenji py-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{backgroundImage:'repeating-linear-gradient(45deg,#7ec8a4 0,#7ec8a4 1px,transparent 0,transparent 50%)',backgroundSize:'20px 20px'}} />
          <p className="text-[#7ec8a4] text-xs tracking-[0.3em] mb-3 relative">Annual Events</p>
          <h1 className="font-serif text-4xl text-white tracking-widest relative">年間行事</h1>
          <p className="text-white/60 text-sm mt-3 relative">温泉寺の法要・行事のご案内</p>
        </section>

        <div className="max-w-3xl mx-auto px-4 py-14 space-y-16">
          {EVENTS.map((ev) => (
            <article key={ev.date} className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-onsenji flex flex-col items-center justify-center text-white shadow-md">
                  <span className="text-[#7ec8a4] text-xs font-medium">{ev.month}</span>
                </div>
                <div>
                  <p className="text-[#2d6b57] text-xs tracking-widest mb-1">{ev.date}　{ev.time}</p>
                  <h2 className="font-serif text-2xl text-onsenji">{ev.name}</h2>
                </div>
              </div>
              <div className="w-full h-0.5 bg-[#7ec8a4]/30" />
              <div className="grid md:grid-cols-2 gap-6 items-start">
                <div className="relative h-56 md:h-64 rounded-2xl overflow-hidden shadow-md">
                  <Image src={ev.image} alt={ev.imageAlt} fill className="object-cover" />
                </div>
                <div className="space-y-4">
                  <p className="text-sm text-gray-700 leading-loose">{ev.desc}</p>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-xs text-gray-600 leading-relaxed">
                    📌 {ev.note}
                  </div>
                </div>
              </div>
            </article>
          ))}

          <div className="bg-onsenji rounded-2xl p-8 text-center text-white">
            <p className="font-serif text-xl mb-2">行事へのご参列・お問い合わせ</p>
            <p className="text-white/70 text-sm mb-6">詳細・最新日程はお気軽にお問い合わせください。</p>
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
