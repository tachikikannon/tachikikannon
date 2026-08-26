'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

const EC_SITE_URL = 'https://chuzenji.official.ec/'
const CASH_MAIL_FORM_URL = '/images/chuzenji/events/shogatsu/' + encodeURIComponent('護摩申込書.pdf')

type Fee = { price: string; size: string }

export default function MailApplyContent({ fees }: { fees: Fee[] }) {
  const t = useTranslations('prayerMailApply')
  const tc = useTranslations('common')
  const [showEcConfirm, setShowEcConfirm] = useState(false)
  const [showCashMail, setShowCashMail] = useState(false)

  return (
    <main className="pt-16 pb-16">
      {/* パンくず */}
      <div className="bg-cream-alt px-4 py-2 text-xs text-gray-400">
        <div className="max-w-xl mx-auto">
          <Link href="/">{tc('breadcrumbHome')}</Link> &gt; <Link href="/prayer">{t('subtitle')}</Link> &gt; {t('breadcrumb')}
        </div>
      </div>

      {/* ヘッダー */}
      <section className="bg-navy py-14 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{backgroundImage:'repeating-linear-gradient(45deg,#c8a96e 0,#c8a96e 1px,transparent 0,transparent 50%)',backgroundSize:'20px 20px'}} />
        <p className="text-gold text-xs tracking-[0.3em] mb-2 relative">Mail Application</p>
        <h1 className="font-serif text-2xl md:text-3xl text-white tracking-widest relative">{t('title')}</h1>
        <p className="text-white/60 text-sm mt-2 relative">{t('subtitle')}</p>
      </section>

      <div className="max-w-xl mx-auto px-4 py-10">
        <p className="text-sm text-gray-600 leading-relaxed mb-8">{t('intro')}</p>

        {/* お申し込み方法の選択 */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-8">
          <p className="font-medium text-navy text-sm mb-4">{t('chooseMethod')}</p>
          <div className="grid sm:grid-cols-3 gap-4">
            <button type="button" onClick={() => setShowEcConfirm(true)}
              className="flex flex-col gap-2 rounded-xl border border-navy/20 p-4 hover:bg-navy/5 hover:border-navy transition-colors text-left">
              <span className="text-2xl">🛒</span>
              <span className="font-medium text-navy text-sm">{t('ecTitle')}</span>
              <span className="text-xs text-gray-500 leading-relaxed">{t('ecDesc')}</span>
            </button>
            <Link href="/prayer/mail-apply/cod"
              className="flex flex-col gap-2 rounded-xl border border-navy/20 p-4 hover:bg-navy/5 hover:border-navy transition-colors">
              <span className="text-2xl">📦</span>
              <span className="font-medium text-navy text-sm">{t('codTitle')}</span>
              <span className="text-xs text-gray-500 leading-relaxed">{t('codDesc')}</span>
            </Link>
            <button type="button" onClick={() => setShowCashMail(true)}
              className="flex flex-col gap-2 rounded-xl border border-navy/20 p-4 hover:bg-navy/5 hover:border-navy transition-colors text-left">
              <span className="text-2xl">✉️</span>
              <span className="font-medium text-navy text-sm">{t('cashTitle')}</span>
              <span className="text-xs text-gray-500 leading-relaxed">{t('cashDesc')}</span>
            </button>
          </div>
        </div>

        {/* 御祈願料 */}
        <div className="mb-8">
          <h2 className="text-lg font-serif text-navy mb-3 pl-3 border-l-4 border-gold">{t('feesHeading')}</h2>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-navy text-white">
                <th className="px-5 py-3 text-left font-medium">{t('tableFeeHeader')}</th>
                <th className="px-5 py-3 text-left font-medium">{t('tableSizeHeader')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {fees.map(({ price, size }, i) => (
                <tr key={i} className="bg-white even:bg-gray-50">
                  <td className="px-5 py-3 font-bold text-navy">{price}</td>
                  <td className="px-5 py-3 text-gray-700">{size}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-5 bg-cream-alt rounded-xl text-sm text-gray-600">
          <p className="font-medium text-navy mb-1">{t('phoneNote')}</p>
          <p>TEL：<a href="tel:0288-55-0013" className="text-navy font-medium">0288-55-0013</a></p>
          <p className="text-xs text-gray-400 mt-1">{t('phoneHours')}</p>
        </div>

        <Link href="/prayer"
          className="inline-block mt-8 text-sm text-navy border-b border-navy/40 hover:border-navy transition-colors">
          {t('backToPrayer')}
        </Link>
      </div>

      {/* ECサイト確認モーダル */}
      {showEcConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setShowEcConfirm(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6"
            onClick={e => e.stopPropagation()}>
            <p className="font-medium text-navy text-sm mb-2">{t('ecModalTitle')}</p>
            <p className="text-sm text-gray-700 leading-relaxed mb-6">{t('ecModalText')}</p>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowEcConfirm(false)}
                className="flex-1 py-2.5 border border-gray-300 rounded-full text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                {t('ecModalCancel')}
              </button>
              <a href={EC_SITE_URL} target="_blank" rel="noopener"
                onClick={() => setShowEcConfirm(false)}
                className="flex-1 py-2.5 bg-navy text-white rounded-full text-sm text-center hover:bg-navy/80 transition-colors">
                {t('ecModalConfirm')}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 現金書留モーダル */}
      {showCashMail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setShowCashMail(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            onClick={e => e.stopPropagation()}>
            <p className="font-medium text-navy text-sm mb-4">{t('cashModalTitle')}</p>
            <ol className="space-y-3 mb-6">
              {[t('cashStep1'), t('cashStep2'), t('cashStep3'), t('cashStep4')].map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-gray-700 leading-relaxed">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-navy text-white text-xs flex items-center justify-center font-bold">{i + 1}</span>
                  <p>{step}</p>
                </li>
              ))}
            </ol>
            <a href={CASH_MAIL_FORM_URL} target="_blank" rel="noopener"
              className="block w-full text-center py-2.5 bg-gold text-navy font-medium rounded-full text-sm hover:opacity-90 transition-colors mb-4">
              {t('cashDownload')}
            </a>
            <div className="bg-cream-alt rounded-lg p-3 text-xs text-gray-600 mb-4">
              <p className="font-medium text-navy mb-1">{t('cashAddressLabel')}</p>
              <p>{t('cashAddress')}</p>
            </div>
            <button type="button" onClick={() => setShowCashMail(false)}
              className="w-full py-2.5 border border-gray-300 rounded-full text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              {t('cashModalClose')}
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
