export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Link from 'next/link'
import HeaderOnsenji from '@/components/HeaderOnsenji'
import FooterOnsenji from '@/components/FooterOnsenji'

export const metadata: Metadata = { title: 'お問い合わせ | 日光山温泉寺' }

export default function OnsenjContactPage() {
  return (
    <>
      <HeaderOnsenji />
      <main className="pt-16">
        <div className="bg-onsenji/5 px-4 py-2 text-xs text-gray-400">
          <div className="max-w-3xl mx-auto"><Link href="/onsenji">ホーム</Link> &gt; お問い合わせ</div>
        </div>
        <section className="bg-onsenji py-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{backgroundImage:'repeating-linear-gradient(45deg,#7ec8a4 0,#7ec8a4 1px,transparent 0,transparent 50%)',backgroundSize:'20px 20px'}} />
          <p className="text-[#7ec8a4] text-xs tracking-[0.3em] mb-3 relative">Contact</p>
          <h1 className="font-serif text-4xl text-white tracking-widest relative">お問い合わせ</h1>
        </section>
        <div className="max-w-2xl mx-auto px-4 py-12">
          <p className="text-center text-gray-600 text-sm mb-10 leading-relaxed">
            ご参拝・御祈願・各種体験についてのご質問は、下記よりお気軽にお問い合わせください。
          </p>
          <div className="bg-white rounded-2xl shadow-sm p-8 space-y-6">
            <div className="grid gap-4">
              <div>
                <label className="block text-sm text-onsenji font-medium mb-1">お名前 <span className="text-red-400 text-xs">必須</span></label>
                <input type="text" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#7ec8a4]" placeholder="山田 太郎" />
              </div>
              <div>
                <label className="block text-sm text-onsenji font-medium mb-1">メールアドレス <span className="text-red-400 text-xs">必須</span></label>
                <input type="email" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#7ec8a4]" placeholder="example@email.com" />
              </div>
              <div>
                <label className="block text-sm text-onsenji font-medium mb-1">お問い合わせ内容 <span className="text-red-400 text-xs">必須</span></label>
                <textarea rows={6} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#7ec8a4] resize-none" placeholder="ご質問・ご要望をご記入ください。" />
              </div>
            </div>
            <button className="w-full py-3 bg-onsenji text-white rounded-full font-medium hover:bg-onsenji-light transition-colors text-sm">
              送信する
            </button>
          </div>
          <p className="text-xs text-gray-400 text-center mt-6">
            お電話でのお問い合わせ：<strong className="text-gray-600">0288-55-0013</strong>（受付時間：拝観時間内）
          </p>
        </div>
      </main>
      <FooterOnsenji />
    </>
  )
}
