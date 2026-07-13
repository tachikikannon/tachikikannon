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
    time: '午前11時〜',
    name: '薬師講大祭・採灯大護摩供',
    desc: '湯の湖畔にて、山伏によって採灯大護摩供が焚かれます。写経が御本尊に奉じられ、護摩の炎で焚き上げられる、温泉寺最大の法要です。',
    image: '/images/gyouji.JPEG',
    imageAlt: '薬師講大祭・採灯大護摩供',
    href: '/onsenji/events/yakushiko',
    apply: '/onsenji/events/yakushiko/apply',
  },
  {
    month: '1月',
    date: '1月下旬',
    time: '午前11時〜',
    name: '温泉寺 節分大祭',
    desc: '新年の邪気を払い、福を招く節分の法要です。豆まきや護摩供を通じて、参拝者の一年の健康と幸福をお祈りします。',
    image: '/images/gyouji.JPEG',
    imageAlt: '節分大祭',
    href: '/onsenji/events/setsubun',
    apply: '/onsenji/events/setsubun/apply',
  },
]

export default function OnsenjEventsPage() {
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

        <div className="max-w-3xl mx-auto px-4 py-14 space-y-10">
          {EVENTS.map((ev) => (
            <article key={ev.date} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
              <div className="relative h-56 md:h-72">
                <Image src={ev.image} alt={ev.imageAlt} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-onsenji/80 via-onsenji/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <p className="text-[#7ec8a4] text-xs tracking-widest mb-1">{ev.date}　{ev.time}</p>
                  <h2 className="font-serif text-2xl text-white">{ev.name}</h2>
                </div>
                <div className="absolute top-4 left-4 w-14 h-14 rounded-xl bg-onsenji/80 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-[#7ec8a4] text-sm font-medium">{ev.month}</span>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-sm text-gray-700 leading-loose">{ev.desc}</p>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Link href={ev.href}
                    className="flex-1 text-center px-6 py-2.5 bg-onsenji text-white text-sm font-medium rounded-full hover:bg-onsenji/80 transition-colors">
                    詳細を見る
                  </Link>
                  <Link href={ev.apply}
                    className="flex-1 text-center px-6 py-2.5 bg-[#7ec8a4] text-onsenji text-sm font-medium rounded-full hover:bg-[#a0d8bc] transition-colors">
                    申し込みフォーム
                  </Link>
                </div>
              </div>
            </article>
          ))}

          <div className="bg-onsenji/5 border border-onsenji/10 rounded-2xl p-6 text-center text-sm text-gray-600">
            ご不明な点はお電話（<a href="tel:0288-55-0013" className="text-onsenji font-medium">0288-55-0013</a>）またはお問い合わせフォームにてお気軽にお問い合わせください。
          </div>
        </div>
      </main>
      <FooterOnsenji />
    </>
  )
}
