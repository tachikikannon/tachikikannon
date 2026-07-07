import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = { title: 'プライバシーポリシー' }

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="pt-16">
        <div className="bg-cream-alt px-4 py-2 text-xs text-gray-400">
          <div className="max-w-3xl mx-auto"><Link href="/">ホーム</Link> &gt; プライバシーポリシー</div>
        </div>

        <section className="bg-navy py-16 text-center">
          <h1 className="font-serif text-3xl text-white tracking-widest">プライバシーポリシー</h1>
        </section>

        <div className="max-w-3xl mx-auto px-4 py-12 prose prose-sm max-w-none text-gray-700 leading-relaxed">
          <p className="text-sm text-gray-500 mb-8">日光山中禅寺 立木観音（以下「当寺」）は、ご利用者様の個人情報の保護に努めております。</p>

          <section className="mb-8">
            <h2 className="text-lg font-serif text-navy border-l-4 border-gold pl-3 mb-4">個人情報の収集について</h2>
            <p>当寺では、御祈願のご予約・各種お申し込み・お問い合わせの際に、お名前・住所・電話番号・メールアドレス等の個人情報をご提供いただく場合がございます。</p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-serif text-navy border-l-4 border-gold pl-3 mb-4">個人情報の利用目的</h2>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>御祈願・各種体験のご予約確認・ご案内のため</li>
              <li>お問い合わせへのご回答のため</li>
              <li>御守・御札等の郵送のため</li>
              <li>法令に基づく対応のため</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-serif text-navy border-l-4 border-gold pl-3 mb-4">個人情報の第三者提供</h2>
            <p>当寺は、法令に基づく場合を除き、ご本人の同意なく個人情報を第三者に提供いたしません。</p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-serif text-navy border-l-4 border-gold pl-3 mb-4">個人情報の管理</h2>
            <p>当寺は、収集した個人情報の漏えい・滅失・き損の防止に適切な安全管理措置を講じます。</p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-serif text-navy border-l-4 border-gold pl-3 mb-4">個人情報の開示・訂正・削除</h2>
            <p>ご自身の個人情報の開示・訂正・削除をご希望の場合は、下記窓口までお問い合わせください。ご本人確認のうえ、適切に対応いたします。</p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-serif text-navy border-l-4 border-gold pl-3 mb-4">Cookieについて</h2>
            <p>当サイトでは、サービス向上を目的としてCookieを使用する場合がございます。ブラウザの設定によりCookieを無効にすることも可能ですが、一部の機能がご利用いただけなくなる場合があります。</p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-serif text-navy border-l-4 border-gold pl-3 mb-4">プライバシーポリシーの変更</h2>
            <p>当寺は、必要に応じて本ポリシーを変更することがあります。変更後のポリシーは当サイトに掲載した時点で効力を生じます。</p>
          </section>

          <section className="bg-cream-alt rounded-xl p-6">
            <h2 className="text-lg font-serif text-navy mb-4">お問い合わせ窓口</h2>
            <address className="not-italic text-sm text-gray-700 space-y-1">
              <p className="font-medium">日光山輪王寺 立木観音</p>
              <p>〒321-1661 栃木県日光市中宮祠2578</p>
              <p>TEL：0288-55-0013</p>
              <p>受付時間：拝観時間内</p>
            </address>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
