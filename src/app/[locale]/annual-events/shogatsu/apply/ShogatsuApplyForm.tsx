'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase'

type Status = 'idle' | 'loading' | 'done' | 'error'
type Applicant = { name: string; address: string; wish1: string; wish2: string }

const WISH_OPTIONS = ['心願成就', '家内安全', '身体健全', '身上安全', '商売繁盛', '開運', '厄除', '良縁成就', '安産', '病気平癒', '闘病平癒']
const CIRCLED = ['②', '③', '④', '⑤']
const emptyApplicant = (): Applicant => ({ name: '', address: '', wish1: '', wish2: '' })

const FEE_OPTIONS = [
  { price: '5,000円', size: '28㎝' },
  { price: '10,000円', size: '32㎝' },
  { price: '20,000円', size: '38㎝' },
  { price: '30,000円', size: '42.5㎝' },
]
const EC_SITE_URL = 'https://chuzenji.official.ec/'
const CASH_MAIL_FORM_URL = '/images/chuzenji/events/shogatsu/gomamousikomi.pdf'

function WishSelect({ value, onChange, required, placeholder }: { value: string; onChange: (v: string) => void; required?: boolean; placeholder: string }) {
  return (
    <select required={required} className="admin-input" value={value} onChange={e => onChange(e.target.value)}>
      <option value="">{placeholder}</option>
      {WISH_OPTIONS.map(w => <option key={w} value={w}>{w}</option>)}
    </select>
  )
}

export default function ShogatsuApplyForm() {
  const supabase = createClient()
  const t = useTranslations('shogatsuApply')
  const tS = useTranslations('shogatsu')
  const tc = useTranslations('common')
  const tAE = useTranslations('annualEvents')
  const [form, setForm] = useState({ name: '', email: '', phone: '', postal: '', address: '', wish1: '', wish2: '' })
  const [fee, setFee] = useState('')
  const [applicants, setApplicants] = useState<Applicant[]>(Array.from({ length: 4 }, emptyApplicant))
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [showEcConfirm, setShowEcConfirm] = useState(false)
  const [showCashMail, setShowCashMail] = useState(false)

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }))
  }

  function setApplicant(i: number, field: keyof Applicant, value: string) {
    setApplicants(prev => prev.map((a, idx) => idx === i ? { ...a, [field]: value } : a))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')

    const applicantLines = applicants
      .map((a, i) => ({ ...a, num: CIRCLED[i] }))
      .filter(a => a.name.trim())
      .map(a => `${a.num} ${a.name}（${a.address || '住所未記入'}）　願い事：${[a.wish1, a.wish2].filter(Boolean).join('、') || '未選択'}`)
      .join('\n')

    const message = [
      `【行事名】正月元旦特別護摩祈願（1月1日）`,
      `【代表者①】`,
      `電話番号：${form.phone}`,
      `郵便番号：${form.postal}`,
      `住所：${form.address}`,
      `お願い事：${[form.wish1, form.wish2].filter(Boolean).join('、')}`,
      `御札：${fee}`,
      `お支払い方法：代金引換（代引き）`,
      applicantLines ? `\n【申込者一覧】\n${applicantLines}` : '',
      notes ? `\n【備考】\n${notes}` : '',
    ].filter(Boolean).join('\n')

    const id = crypto.randomUUID()
    const { error } = await supabase.from('contacts').insert({
      id,
      name: form.name,
      email: form.email,
      subject: '【1月1日】正月元旦特別護摩祈願 申し込み',
      message,
      source: 'event_application',
    })
    if (error) { setStatus('error'); return }
    await fetch('/api/notify/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, name: form.name, email: form.email, subject: '【1月1日】正月元旦特別護摩祈願 申し込み', message }),
    }).catch(() => {})
    setStatus('done')
  }

  if (status === 'done') return (
    <main className="min-h-screen pt-24 flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <p className="text-5xl mb-4">🙏</p>
        <h1 className="text-2xl font-serif text-navy mb-3">{t('doneTitle')}</h1>
        <p className="text-gray-600 text-sm leading-relaxed mb-2">
          {t('doneText1')}
        </p>
        <p className="text-gray-600 text-sm leading-relaxed">
          {t('doneText2')}
        </p>
        <Link href="/annual-events/shogatsu"
          className="inline-block mt-8 text-sm text-navy border-b border-navy/40 hover:border-navy transition-colors">
          {t('backToEvent')}
        </Link>
      </div>
    </main>
  )

  return (
    <main className="pt-16 pb-16">
      {/* パンくず */}
      <div className="bg-cream-alt px-4 py-2 text-xs text-gray-400">
        <div className="max-w-xl mx-auto">
          <Link href="/">{tc('breadcrumbHome')}</Link> &gt; <Link href="/annual-events">{tAE('title')}</Link> &gt; <Link href="/annual-events/shogatsu">{tS('breadcrumb')}</Link> &gt; {t('breadcrumb')}
        </div>
      </div>

      {/* ヘッダー */}
      <section className="bg-navy py-14 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{backgroundImage:'repeating-linear-gradient(45deg,#c8a96e 0,#c8a96e 1px,transparent 0,transparent 50%)',backgroundSize:'20px 20px'}} />
        <p className="text-gold text-xs tracking-[0.3em] mb-2 relative">Application Form</p>
        <h1 className="font-serif text-2xl md:text-3xl text-white tracking-widest relative">{t('formTitle')}</h1>
        <p className="text-white/60 text-sm mt-2 relative">{t('eventName')}</p>
      </section>

      <div className="max-w-xl mx-auto px-4 py-10">
        {/* イベント情報 */}
        <div className="bg-navy/5 border border-navy/10 rounded-xl p-4 mb-6 flex gap-4 items-center">
          <div className="w-14 h-14 rounded-xl bg-navy flex flex-col items-center justify-center flex-shrink-0">
            <span className="text-gold text-xs">{t('cardMonth')}</span>
            <span className="text-white font-bold text-lg leading-none">{t('cardDay')}</span>
          </div>
          <div>
            <p className="font-serif text-navy font-medium">{t('cardTitle')}</p>
            <p className="text-xs text-gray-500 mt-0.5">{t('cardTime')}</p>
          </div>
        </div>

        {/* お申し込み方法の選択 */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
          <p className="font-medium text-navy text-sm mb-4">{t('methodHeading')}</p>
          <div className="grid sm:grid-cols-3 gap-4">
            <a href="#apply-form"
              className="flex flex-col gap-2 rounded-xl border border-navy/20 p-4 hover:bg-navy/5 hover:border-navy transition-colors">
              <span className="text-2xl">📦</span>
              <span className="font-medium text-navy text-sm">{t('methodCodTitle')}</span>
              <span className="text-xs text-gray-500 leading-relaxed">{t('methodCodText')}</span>
            </a>
            <button type="button" onClick={() => setShowEcConfirm(true)}
              className="flex flex-col gap-2 rounded-xl border border-navy/20 p-4 hover:bg-navy/5 hover:border-navy transition-colors text-left">
              <span className="text-2xl">🛒</span>
              <span className="font-medium text-navy text-sm">{t('methodEcTitle')}</span>
              <span className="text-xs text-gray-500 leading-relaxed">{t('methodEcText')}</span>
            </button>
            <button type="button" onClick={() => setShowCashMail(true)}
              className="flex flex-col gap-2 rounded-xl border border-navy/20 p-4 hover:bg-navy/5 hover:border-navy transition-colors text-left">
              <span className="text-2xl">✉️</span>
              <span className="font-medium text-navy text-sm">{t('methodCashTitle')}</span>
              <span className="text-xs text-gray-500 leading-relaxed">{t('methodCashText')}</span>
            </button>
          </div>
        </div>

        {/* 注意事項 */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 space-y-2">
          <p className="font-medium text-amber-800 text-sm mb-2">{t('noticeHeading')}</p>
          <div className="flex gap-2 text-sm text-amber-700">
            <span className="flex-shrink-0">⛩️</span>
            <p>{t.rich('noticeFee', { b: chunks => <strong>{chunks}</strong> })}</p>
          </div>
          <div className="flex gap-2 text-sm text-amber-700">
            <span className="flex-shrink-0">💴</span>
            <p>{t.rich('noticePayment', { b: chunks => <strong>{chunks}</strong> })}</p>
          </div>
          <div className="flex gap-2 text-sm text-amber-700">
            <span className="flex-shrink-0">👥</span>
            <p>{t.rich('noticeCapacity', { b: chunks => <strong>{chunks}</strong> })}</p>
          </div>
        </div>

        {/* フォーム */}
        <form id="apply-form" onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="admin-label">{t('repNameLabel')} <span className="text-red-500 text-xs">{t('required')}</span></label>
            <input required className="admin-input" placeholder={t('repNamePlaceholder')} value={form.name} onChange={set('name')} />
          </div>
          <div>
            <label className="admin-label">{t('emailLabel')} <span className="text-red-500 text-xs">{t('required')}</span></label>
            <input type="email" required className="admin-input" placeholder={t('emailPlaceholder')} value={form.email} onChange={set('email')} />
          </div>
          <div>
            <label className="admin-label">{t('phoneLabel')} <span className="text-red-500 text-xs">{t('required')}</span></label>
            <input type="tel" required className="admin-input" placeholder={t('phonePlaceholder')} value={form.phone} onChange={set('phone')} />
          </div>
          <div>
            <label className="admin-label">{t('postalLabel')} <span className="text-gray-400 text-xs">{t('optional')}</span></label>
            <input className="admin-input" placeholder={t('postalPlaceholder')} value={form.postal} onChange={set('postal')} />
          </div>
          <div>
            <label className="admin-label">{t('addressLabel')} <span className="text-red-500 text-xs">{t('required')}</span></label>
            <input required className="admin-input" placeholder={t('addressPlaceholder')} value={form.address} onChange={set('address')} />
          </div>

          <div className="border-t border-gray-200 pt-5">
            <p className="text-sm font-medium text-navy mb-3">{t('feeHeading')} <span className="text-red-500 text-xs">{t('required')}</span></p>
            <div className="grid grid-cols-2 gap-3">
              {FEE_OPTIONS.map(({ price, size }) => (
                <label key={price}
                  className={`flex flex-col items-center justify-center gap-1 rounded-xl border p-3 cursor-pointer transition-colors ${fee === price ? 'border-navy bg-navy/5' : 'border-gray-200 hover:border-navy/40'}`}>
                  <input type="radio" name="fee" required className="sr-only" value={price}
                    checked={fee === price} onChange={() => setFee(price)} />
                  <span className="font-bold text-navy text-sm">{price}</span>
                  <span className="text-xs text-gray-500">{size}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-5">
            <p className="text-sm font-medium text-navy mb-1">{t('repWishHeading')}</p>
            <p className="text-xs text-gray-400 mb-4">{t('repWishSub')}</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="admin-label">{t('wish1Label')} <span className="text-red-500 text-xs">{t('required')}</span></label>
                <WishSelect value={form.wish1} onChange={v => setForm(f => ({ ...f, wish1: v }))} required placeholder={t('wishSelectPlaceholder')} />
              </div>
              <div>
                <label className="admin-label">{t('wish2Label')} <span className="text-gray-400 text-xs">{t('optional')}</span></label>
                <WishSelect value={form.wish2} onChange={v => setForm(f => ({ ...f, wish2: v }))} placeholder={t('wishSelectPlaceholder')} />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-5">
            <p className="text-sm font-medium text-navy mb-1">{t('applicantsHeading')}</p>
            <p className="text-xs text-gray-400 mb-4">{t('applicantsSub')}</p>
            <div className="space-y-4">
              {applicants.map((a, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-navy mb-3">{t('applicantLabel')}{CIRCLED[i]}</p>
                  <div className="grid sm:grid-cols-2 gap-3 mb-3">
                    <input className="admin-input" placeholder={t('applicantNamePlaceholder')} value={a.name} onChange={e => setApplicant(i, 'name', e.target.value)} />
                    <input className="admin-input" placeholder={t('applicantAddressPlaceholder')} value={a.address} onChange={e => setApplicant(i, 'address', e.target.value)} />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <WishSelect value={a.wish1} onChange={v => setApplicant(i, 'wish1', v)} placeholder={t('wishSelectPlaceholder')} />
                    <WishSelect value={a.wish2} onChange={v => setApplicant(i, 'wish2', v)} placeholder={t('wishSelectPlaceholder')} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-5">
            <label className="admin-label">{t('notesLabel')} <span className="text-gray-400 text-xs">{t('notesHint')}</span></label>
            <textarea className="admin-input min-h-[80px]" placeholder={t('notesPlaceholder')} value={notes} onChange={e => setNotes(e.target.value)} />
          </div>

          {status === 'error' && (
            <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              {t('submitError')}
            </p>
          )}

          <button type="submit" disabled={status === 'loading'}
            className="btn-primary w-full text-center disabled:opacity-50 py-3">
            {status === 'loading' ? t('submitting') : t('submit')}
          </button>
          <p className="text-xs text-gray-400 text-center">{t('afterSubmitNote')}</p>
        </form>

        <div className="mt-8 p-5 bg-cream-alt rounded-xl text-sm text-gray-600">
          <p className="font-medium text-navy mb-1">{t('phoneApplyTitle')}</p>
          <p>TEL：<a href="tel:0288-55-0013" className="text-navy font-medium">0288-55-0013</a></p>
          <p className="text-xs text-gray-400 mt-1">{t('phoneHours')}</p>
        </div>
      </div>

      {/* ECサイト確認モーダル */}
      {showEcConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setShowEcConfirm(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6"
            onClick={e => e.stopPropagation()}>
            <p className="font-medium text-navy text-sm mb-2">{t('ecModalTitle')}</p>
            <p className="text-sm text-gray-700 leading-relaxed mb-6">
              {t.rich('ecModalText', { b: chunks => <strong>{chunks}</strong> })}
            </p>
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
              <li className="flex gap-3 text-sm text-gray-700 leading-relaxed">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-navy text-white text-xs flex items-center justify-center font-bold">1</span>
                <p>{t('cashStep1')}</p>
              </li>
              <li className="flex gap-3 text-sm text-gray-700 leading-relaxed">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-navy text-white text-xs flex items-center justify-center font-bold">2</span>
                <p>{t('cashStep2')}</p>
              </li>
              <li className="flex gap-3 text-sm text-gray-700 leading-relaxed">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-navy text-white text-xs flex items-center justify-center font-bold">3</span>
                <p>{t('cashStep3')}</p>
              </li>
            </ol>
            <a href={CASH_MAIL_FORM_URL} target="_blank" rel="noopener"
              className="block w-full text-center py-2.5 bg-gold text-navy font-medium rounded-full text-sm hover:opacity-90 transition-colors mb-4">
              {t('cashDownload')}
            </a>
            <div className="bg-cream-alt rounded-lg p-3 text-xs text-gray-600 mb-4">
              <p className="font-medium text-navy mb-1">{t('cashAddressLabel')}</p>
              <p>〒321-1661 栃木県日光市中宮祠2578　日光山中禅寺 立木観音</p>
            </div>
            <button type="button" onClick={() => setShowCashMail(false)}
              className="w-full py-2.5 border border-gray-300 rounded-full text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              {t('cashClose')}
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
