import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = { title: '数珠づくり体験' }

export default function JyuzuPage() {
  return (
    <>
      <Header />
      <main className="pt-16">
        <div className="bg-cream-alt px-4 py-2 text-xs text-gray-400">
          <div className="max-w-3xl mx-auto">
            <Link href="/">ホーム</Link> &gt; <Link href="/reserve">体験予約</Link> &gt; 数珠づくり体験
          </div>
        </div>

        {/* ヒーロー */}
        <section className="bg-navy py-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{backgroundImage:'repeating-linear-gradient(45deg,#c8a96e 0,#c8a96e 1px,transparent 0,transparent 50%)',backgroundSize:'20px 20px'}} />
          <p className="text-gold text-xs tracking-[0.3em] mb-3 relative">Juzu Making</p>
          <h1 className="font-serif text-4xl text-white tracking-widest relative">数珠づくり体験</h1>
          <p className="text-white/60 text-sm mt-3 relative">世界にひとつだけの数珠を、自分の手でつくります</p>
        </section>

        <div className="max-w-3xl mx-auto px-4 py-12 space-y-12">

          {/* 概要 */}
          <section>
            <h2 className="text-xl font-serif text-navy pl-3 border-l-4 border-gold mb-4">数珠づくりとは</h2>
            <div className="bg-white rounded-xl p-6 shadow-sm text-sm text-gray-700 leading-relaxed">
              <p>数珠（じゅず）は、仏様を礼拝するときに手に持つ法具で、煩悩の数である108つの珠が一般的です。珠には天然石・木材・水晶などさまざまな素材があり、素材によって異なる功徳があるとされています。</p>
              <p className="mt-3">立木観音の数珠づくり体験では、複数の珠の種類からお好みの組み合わせを選び、自分だけのオリジナル数珠をお作りいただけます。完成した数珠は参拝・法要などさまざまな場面でお使いいただけます。</p>
            </div>
          </section>

          {/* 料金・時間 */}
          <section>
            <h2 className="text-xl font-serif text-navy pl-3 border-l-4 border-gold mb-4">料金・所要時間</h2>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <tbody>
                  {[
                    ['体験料', '2,000円〜（珠の素材・組み合わせにより異なります）'],
                    ['所要時間', '約60〜90分'],
                    ['対象', '小学生以上（小学生は保護者同伴）'],
                    ['受付場所', '寺務所 体験受付窓口'],
                    ['受付時間', '拝観時間内（閉門1時間30分前まで）'],
                  ].map(([k, v]) => (
                    <tr key={k} className="border border-gray-200">
                      <th className="bg-navy text-white text-left px-4 py-3 w-32 text-sm font-medium whitespace-nowrap">{k}</th>
                      <td className="px-4 py-3 bg-white">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-gray-700">
              <p className="font-bold text-amber-700 text-xs mb-1">料金について</p>
              <p>お選びいただく珠の素材・数・組み合わせによって料金が異なります。詳しくは受付窓口またはお問い合わせフォームよりご確認ください。</p>
            </div>
          </section>

          {/* 体験の流れ */}
          <section>
            <h2 className="text-xl font-serif text-navy pl-3 border-l-4 border-gold mb-4">体験の流れ</h2>
            <ol className="relative border-l-2 border-gold ml-4 space-y-6">
              {[
                { title: '受付・デザイン選択', text: '寺務所 体験受付窓口にてお申し込み。珠の素材や色の組み合わせをお選びいただきます。' },
                { title: '珠の確認', text: '選んでいただいた珠を確認し、体験台へご案内します。' },
                { title: '数珠づくり', text: 'スタッフのご説明に沿って、珠を糸に通していきます。結び方もご指導します。' },
                { title: '完成・お持ち帰り', text: '完成した数珠はその場でお持ち帰りいただけます。専用の袋に入れてお渡しします。' },
              ].map(({ title, text }, i) => (
                <li key={i} className="pl-6 relative">
                  <div className="absolute -left-[19px] top-0 w-9 h-9 rounded-full bg-navy text-white flex items-center justify-center text-sm font-bold">{i + 1}</div>
                  <h3 className="font-medium text-navy mb-1">{title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* 珠の素材例 */}
          <section className="bg-cream-alt -mx-4 px-4 py-10 md:-mx-8 md:px-8 rounded-2xl">
            <h2 className="text-xl font-serif text-navy pl-3 border-l-4 border-gold mb-4">珠の素材について</h2>
            <p className="text-sm text-gray-600 mb-5">珠の種類は季節・入荷状況により変わります。当日の受付窓口でご確認ください。</p>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { name: '水晶', desc: '透明感があり、邪気を払う浄化の石として知られます。' },
                { name: '翡翠', desc: '緑の美しい石。長寿・健康・魔除けの功徳があるとされます。' },
                { name: '木珠', desc: '軽くて使いやすい伝統的な珠。温かみのある手触りが特徴です。' },
              ].map(({ name, desc }) => (
                <div key={name} className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="font-medium text-navy mb-1">{name}</p>
                  <p className="text-xs text-gray-600 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 注意事項 */}
          <section>
            <h2 className="text-xl font-serif text-navy pl-3 border-l-4 border-gold mb-4">ご注意・持ち物</h2>
            <ul className="space-y-2">
              {[
                '事前予約をお願いします。当日受付は材料が揃っている場合のみ対応します。',
                '小学生のお子様は保護者の方のご同伴が必要です。',
                '道具はすべてご用意します。手ぶらでお越しください。',
                '完成品は専用袋に入れてお持ち帰りいただけます。',
              ].map(item => (
                <li key={item} className="flex gap-2 text-sm text-gray-700 bg-white rounded-lg px-4 py-3 shadow-sm border-l-4 border-gold">{item}</li>
              ))}
            </ul>
          </section>

          {/* CTA */}
          <div className="bg-navy rounded-2xl p-8 text-center text-white">
            <p className="font-serif text-xl mb-2">数珠づくり体験のご予約</p>
            <p className="text-white/60 text-sm mb-6">材料の準備がありますので、事前のご予約をお願いします。</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/reserve" className="btn-gold">オンライン予約はこちら</Link>
              <Link href="/contact" className="btn-outline">お問い合わせ</Link>
            </div>
          </div>

          {/* 関連 */}
          <div className="grid grid-cols-2 gap-3">
            <Link href="/experience/shakyou" className="flex flex-col items-center gap-2 p-5 bg-white rounded-xl border shadow-sm hover:bg-navy hover:text-white hover:-translate-y-1 transition-all group text-center">
              <span className="text-2xl">📜</span>
              <span className="text-sm font-medium text-navy group-hover:text-white">写経体験</span>
            </Link>
            <Link href="/experience/shabutu" className="flex flex-col items-center gap-2 p-5 bg-white rounded-xl border shadow-sm hover:bg-navy hover:text-white hover:-translate-y-1 transition-all group text-center">
              <span className="text-2xl">🖌️</span>
              <span className="text-sm font-medium text-navy group-hover:text-white">写仏体験</span>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
