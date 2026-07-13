import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: '船禅頂（8月4日） | 日光山中禅寺 立木観音',
  description: '毎年8月4日開催。日光開山 勝道上人の霊跡を船で巡拝する伝統行事「船禅頂（ふなぜんじょう）」のご案内。事前申し込み必要。',
}

export default function FunazentoPage() {
  return (
    <>
      <Header />
      <main className="pt-16">
        {/* パンくず */}
        <div className="bg-cream-alt px-4 py-2 text-xs text-gray-400">
          <div className="max-w-3xl mx-auto">
            <Link href="/">ホーム</Link> &gt; <Link href="/annual-events">年間行事</Link> &gt; 船禅頂
          </div>
        </div>

        {/* ヒーロー */}
        <section className="relative h-72 md:h-96 overflow-hidden">
          <Image src="/images/mizuumi.jpg" alt="船禅頂・中禅寺湖" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 text-center px-4">
            <p className="text-gold text-xs tracking-[0.3em] mb-2">August 4th  Annual Event</p>
            <h1 className="font-serif text-3xl md:text-4xl text-white tracking-widest">船禅頂</h1>
            <p className="text-white/80 text-base mt-1 font-serif">ふなぜんじょう</p>
            <p className="text-white/70 text-sm mt-3">毎年8月4日　午前10時より　※事前申し込み必要</p>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-4 py-12 space-y-14">

          {/* 概要 */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gold rounded-full" />
              <h2 className="font-serif text-2xl text-navy">行事について</h2>
            </div>
            <p className="text-sm text-gray-700 leading-loose">
              船禅頂（ふなぜんじょう）は、日光山を開いた勝道上人（737〜817）が中禅寺湖を舟で渡り、湖上から霊峰・男体山を遙拝したという故事に由来する伝統行事です。毎年8月4日、中禅寺湖を舞台に、上人が切り開いた修験の道を水上から辿ります。湖上から望む男体山と中禅寺の景観とともに、千二百余年の歴史に思いを馳せる特別な体験です。
            </p>
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: '開催日', value: '8月4日（毎年）' },
                { label: '開始時間', value: '午前10時〜' },
                { label: '参加', value: '事前申し込み必要' },
              ].map(({ label, value }) => (
                <div key={label} className="bg-cream-alt rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-400 mb-1">{label}</p>
                  <p className="text-sm font-medium text-navy">{value}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 写真 */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gold rounded-full" />
              <h2 className="font-serif text-2xl text-navy">行事の様子</h2>
            </div>
            <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-md">
              <Image src="/images/mizuumi.jpg" alt="中禅寺湖・船禅頂" fill className="object-cover" />
            </div>
          </section>

          {/* ご参加にあたって */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gold rounded-full" />
              <h2 className="font-serif text-2xl text-navy">ご参加にあたって</h2>
            </div>
            <div className="space-y-3">
              {[
                '事前の申し込みが必要です。定員になり次第締め切りますので、お早めにお申し込みください。',
                '御札をお授けいたします。お支払いは当日・現地にてお受けいたします。',
                '動きやすく濡れても構わない服装でお越しください。湖上は気温が低い場合がありますので、上に羽織るものをご持参ください。',
                '天候・状況により内容が変更・中止となる場合がございます。詳細はお電話にてご確認ください。',
              ].map((text, i) => (
                <div key={i} className="flex gap-3 text-sm text-gray-700 leading-relaxed bg-cream-alt rounded-xl px-4 py-3">
                  <span className="text-gold font-bold flex-shrink-0">・</span>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTAバナー */}
          <div className="bg-navy rounded-2xl p-8 text-center text-white">
            <p className="font-serif text-xl mb-2">船禅頂 お申し込み</p>
            <p className="text-white/70 text-sm mb-6">
              定員になり次第締め切ります。<br />
              御札授与あり・お支払いは当日現地にて。
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/annual-events/funazento/apply"
                className="inline-block px-8 py-3 bg-gold text-navy font-medium rounded-full hover:opacity-90 transition-colors text-sm">
                申し込みフォームへ
              </Link>
              <Link href="/contact"
                className="inline-block px-8 py-3 border border-white/40 text-white rounded-full hover:bg-white/10 transition-colors text-sm">
                お問い合わせ
              </Link>
            </div>
          </div>

          {/* 他の行事 */}
          <div className="flex gap-4">
            <Link href="/annual-events/kannonko"
              className="flex-1 text-center py-3 border border-navy/20 rounded-xl text-sm text-navy hover:bg-navy hover:text-white transition-colors">
              ← 6月18日 観音講
            </Link>
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
