import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: '年間行事 | 日光山中禅寺 立木観音',
  description: '日光山中禅寺 立木観音の年間行事。6月18日 大法要・大護摩供・地蔵流し、8月4日 船禅頂（ふなぜんじょう）。',
}

const EVENTS = [
  {
    month: '6月',
    date: '6月18日',
    time: '午前10時〜',
    name: '大法要・大護摩供・地蔵流し',
    desc: '毎年6月18日に、ご信徒の皆様にご参列いただいての大法要を執り行います。五大堂での大法要・波之利大黒天堂大護摩供に続き、中禅寺湖にてお地蔵様を湖上に流す「地蔵流し」を行います。',
    note: '参列自由。詳細は寺務所までお問い合わせください。',
    image: '/images/gyouji.JPEG',
    imageAlt: '大法要・地蔵流し',
  },
  {
    month: '8月',
    date: '8月4日',
    time: '午前10時〜',
    name: '船禅頂（ふなぜんじょう）',
    desc: '日光開山 勝道上人の霊跡を船で巡拝する伝統行事です。中禅寺湖を舞台に、上人が切り開いた修験の道を水上から辿ります。湖上から望む男体山と中禅寺の景観とともに、千二百余年の歴史に思いを馳せる特別な体験です。',
    note: '事前申し込みが必要です。定員になり次第締め切ります。申込書は寺務所またはお問い合わせフォームよりお取り寄せください。',
    image: '/images/mizuumi.jpg',
    imageAlt: '中禅寺湖・船禅頂',
  },
]

export default function AnnualEventsPage() {
  return (
    <>
      <Header />
      <main className="pt-16">
        <div className="bg-cream-alt px-4 py-2 text-xs text-gray-400">
          <div className="max-w-3xl mx-auto">
            <Link href="/">ホーム</Link> &gt; <Link href="/events">行事カレンダー</Link> &gt; 年間行事
          </div>
        </div>

        <section className="bg-navy py-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{backgroundImage:'repeating-linear-gradient(45deg,#c8a96e 0,#c8a96e 1px,transparent 0,transparent 50%)',backgroundSize:'20px 20px'}} />
          <p className="text-gold text-xs tracking-[0.3em] mb-3 relative">Annual Events</p>
          <h1 className="font-serif text-4xl text-white tracking-widest relative">年間行事</h1>
          <p className="text-white/60 text-sm mt-3 relative">毎年恒例の法要・行事のご案内</p>
        </section>

        <div className="max-w-3xl mx-auto px-4 py-14 space-y-16">
          {EVENTS.map((ev) => (
            <article key={ev.date} className="space-y-6">
              {/* 日付・行事名 */}
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-navy flex flex-col items-center justify-center text-white shadow-md">
                  <span className="text-gold text-xs font-medium tracking-wide">{ev.month}</span>
                </div>
                <div>
                  <p className="text-gold/80 text-xs tracking-widest mb-1">{ev.date}　{ev.time}</p>
                  <h2 className="font-serif text-2xl text-navy">{ev.name}</h2>
                </div>
              </div>
              <div className="w-full h-0.5 bg-gold/30" />

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

          {/* 申し込み・問い合わせ */}
          <div className="bg-navy rounded-2xl p-8 text-center text-white">
            <p className="font-serif text-xl mb-2">行事へのご参列・お申し込み</p>
            <p className="text-white/70 text-sm mb-6">
              船禅頂（8月4日）は事前申し込みが必要です。<br />
              御札授与あり・お支払いは当日現地にて。
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/annual-events/apply"
                className="inline-block px-8 py-3 bg-gold text-navy font-medium rounded-full hover:bg-gold-light transition-colors text-sm">
                申し込みフォームへ
              </Link>
              <Link href="/contact"
                className="inline-block px-8 py-3 border border-white/40 text-white rounded-full hover:bg-white/10 transition-colors text-sm">
                お問い合わせ
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
