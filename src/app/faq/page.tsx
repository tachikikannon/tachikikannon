import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = { title: 'よくある質問' }

const faqs = [
  {
    cat: '拝観・アクセス',
    items: [
      { q: '駐車場はありますか？', a: '立木観音専用の駐車場はございません。中禅寺湖畔の有料駐車場をご利用ください。' },
      { q: '拝観料を教えてください。', a: '大人500円・子供200円です。' },
      { q: '拝観時間は？', a: '季節により異なります。4〜10月は8:00〜17:00、11月・3月は8:00〜16:00、12〜2月は8:30〜15:30です。閉門30分前に受付終了となります。' },
      { q: 'ペットを連れて入れますか？', a: '境内はご同伴いただけますが、本堂・五大堂などの堂内はご遠慮ください。' },
      { q: '車いすで参拝できますか？', a: '境内に段差のある箇所がございます。ご不安な場合は事前にお電話にてお問い合わせください。' },
    ],
  },
  {
    cat: '御祈願・予約',
    items: [
      { q: '御祈願（護摩祈祷）は予約が必要ですか？', a: '予約制となっております。オンライン予約フォームまたはお電話でお申し込みください。' },
      { q: '御祈願の時間帯は？', a: '9:00〜12:00の間でお受けしています。ただし、6月18日・8月4日・8月8日は除外日となります。行事によっては祈祷できない日もあるため、事前にご確認ください。' },
      { q: '御祈願料はいくらですか？', a: '5,000円（28㎝）・10,000円（32㎝）・20,000円（38㎝）・30,000円（42.5㎝）の4種類です。金額によって御札の大きさが異なります。' },
      { q: '遠方で来られませんが御祈願できますか？', a: 'お申込みいただければ、御祈祷後に着払いにて御札をご郵送いたします。現金書留にて御祈願料をお送りください。お届けまで1〜2週間ほどかかります。' },
    ],
  },
  {
    cat: '御朱印',
    items: [
      { q: '御朱印の種類は？', a: '立木大悲殿・ご詠歌・波之利大黒天・金剛閣の4種類の通常御朱印と、写経・写仏体験とセットの特別御朱印がございます。' },
      { q: '御朱印代はいくらですか？', a: '各500円です。書き入れ・書き置きとも同額です。' },
      { q: '御朱印帳を忘れた場合は？', a: '書き置きの御朱印もご用意しております。' },
    ],
  },
  {
    cat: '写経・写仏体験',
    items: [
      { q: '体験に予約は必要ですか？', a: '事前のご予約をお勧めします。当日空きがある場合は受け付けることもございますが、確実に体験いただくにはご予約ください。' },
      { q: '所要時間はどのくらいですか？', a: '写経は約15分、写仏は約30〜60分です。数珠づくりは内容によって異なります。' },
      { q: '体験料はいくらですか？', a: '写経1,000円・写仏1,000円・数珠づくり2,000円〜です。特別御朱印もご希望の場合は体験とセットでお受けいただけます。' },
    ],
  },
  {
    cat: 'その他',
    items: [
      { q: '授与品の通販はありますか？', a: 'オンラインショップにてお守り等をお求めいただけます。詳しくは公式サイトよりご確認ください。' },
      { q: '輪王寺との関係は？', a: '立木観音（中禅寺）は日光山輪王寺の別院です。詳しくは輪王寺公式サイトをご覧ください。' },
    ],
  },
]

export default function FaqPage() {
  return (
    <>
      <Header />
      <main className="pt-16">
        <div className="bg-cream-alt px-4 py-2 text-xs text-gray-400">
          <div className="max-w-3xl mx-auto"><Link href="/">ホーム</Link> &gt; よくある質問</div>
        </div>

        <section className="bg-navy py-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{backgroundImage:'repeating-linear-gradient(45deg,#c8a96e 0,#c8a96e 1px,transparent 0,transparent 50%)',backgroundSize:'20px 20px'}} />
          <p className="text-gold text-xs tracking-[0.3em] mb-3 relative">FAQ</p>
          <h1 className="font-serif text-4xl text-white tracking-widest relative">よくある質問</h1>
        </section>

        <div className="max-w-3xl mx-auto px-4 py-12 space-y-12">
          {faqs.map(({ cat, items }) => (
            <section key={cat}>
              <h2 className="text-lg font-serif text-navy pl-3 border-l-4 border-gold mb-5">{cat}</h2>
              <div className="space-y-3">
                {items.map(({ q, a }) => (
                  <details key={q} className="group bg-white rounded-xl shadow-sm overflow-hidden">
                    <summary className="flex items-start justify-between gap-3 px-5 py-4 cursor-pointer list-none select-none">
                      <span className="font-medium text-navy text-sm leading-relaxed">Q. {q}</span>
                      <span className="text-gold text-lg flex-shrink-0 transition-transform group-open:rotate-45">＋</span>
                    </summary>
                    <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                      A. {a}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          ))}

          <div className="bg-navy rounded-2xl p-8 text-center text-white">
            <p className="font-serif text-xl mb-2">解決しない場合はお気軽にご連絡ください</p>
            <p className="text-white/60 text-sm mb-6">TEL：0288-55-0013（受付時間：拝観時間内）</p>
            <Link href="/contact" className="btn-gold">お問い合わせフォームはこちら</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
