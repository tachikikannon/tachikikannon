export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import HeaderOnsenji from '@/components/HeaderOnsenji'
import FooterOnsenji from '@/components/FooterOnsenji'

export const metadata: Metadata = {
  title: '年間行事 | 日光山温泉寺',
  description: '日光山温泉寺の年間行事・法要のご案内。6月18日 大法要・地蔵流し、8月4日 船禅頂。',
}

const DEFAULT_EVENTS = [
  {
    date: '6月18日',
    name: '大法要・大護摩供・地蔵流し',
    time: '午前10時〜',
    desc: 'ご信徒の皆様にご参列いただいての大法要を執り行います。大護摩供のほか、中禅寺湖にてお地蔵様を流す「地蔵流し」を行います。地域の方々とともに先祖の霊を弔い、無病息災をお祈りする、温泉寺の夏の大切な法要です。',
    note: '参列自由。詳細は寺務所までお問い合わせください。',
    image: '/images/gyouji.JPEG',
    imageAlt: '大法要・地蔵流し',
  },
  {
    date: '8月4日',
    name: '船禅頂（ふなぜんじょう）',
    time: '午前10時〜',
    desc: '日光開山 勝道上人の霊跡を船で巡拝する伝統行事です。中禅寺湖を舞台に、上人が切り開いた修験の道を水上から辿ります。湖上から望む男体山と中禅寺の景観とともに、千二百余年の歴史に思いを馳せる特別な体験です。',
    note: '事前申し込みが必要です。定員になり次第締め切ります。詳しくはお問い合わせください。',
    image: '/images/gyouji.JPEG',
    imageAlt: '船禅頂',
  },
]

export default async function OnsenjEventsPage() {
  return (
    <>
      <HeaderOnsenji />
      <main className="pt-16">
        {/* パンくず */}
        <div className="bg-onsenji/5 px-4 py-2 text-xs text-gray-400">
          <div className="max-w-3xl mx-auto">
            <Link href="/onsenji">ホーム</Link> &gt; 年間行事
          </div>
        </div>

        {/* ページヒーロー */}
        <section className="bg-onsenji py-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{backgroundImage:'repeating-linear-gradient(45deg,#7ec8a4 0,#7ec8a4 1px,transparent 0,transparent 50%)',backgroundSize:'20px 20px'}} />
          <p className="text-[#7ec8a4] text-xs tracking-[0.3em] mb-3 relative">Annual Events</p>
          <h1 className="font-serif text-4xl text-white tracking-widest relative">年間行事</h1>
          <p className="text-white/60 text-sm mt-3 relative">温泉寺の法要・行事のご案内</p>
        </section>

        <div className="max-w-3xl mx-auto px-4 py-14 space-y-16">
          {DEFAULT_EVENTS.map((ev) => (
            <article key={ev.date} className="space-y-6">
              {/* 日付・行事名ヘッダー */}
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-onsenji flex flex-col items-center justify-center text-white shadow-md">
                  <span className="text-[#7ec8a4] text-xs tracking-wider">{ev.date.replace('月', '月\n')}</span>
                </div>
                <div>
                  <p className="text-[#2d6b57] text-xs tracking-widest mb-1">{ev.date} {ev.time}</p>
                  <h2 className="font-serif text-2xl text-onsenji">{ev.name}</h2>
                </div>
              </div>
              <div className="w-full h-0.5 bg-[#7ec8a4]/30" />

              {/* 写真＋説明 */}
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

          {/* お問い合わせ */}
          <div className="bg-onsenji rounded-2xl p-8 text-center text-white">
            <p className="font-serif text-xl mb-2">行事へのご参列・お申し込み</p>
            <p className="text-white/70 text-sm mb-6">ご不明な点はお気軽にお問い合わせください。</p>
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
