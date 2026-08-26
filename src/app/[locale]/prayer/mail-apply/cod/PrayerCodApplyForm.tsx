'use client'
import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase'
import { calcShippingFeeByWeight, type ShippingTier } from '@/lib/shipping'

type Status = 'idle' | 'loading' | 'error'
type Fee = { price: string; size: string; weight_g: number }

const WISH_OPTIONS = ['心願成就', '家内安全', '身体健全', '身上安全', '商売繁盛', '開運', '厄除', '良縁成就', '安産', '病気平癒', '闘病平癒']

function priceToNumber(price: string): number {
  return Number(price.replace(/[^\d]/g, '')) || 0
}

function WishSelect({ value, onChange, required, placeholder }: { value: string; onChange: (v: string) => void; required?: boolean; placeholder: string }) {
  return (
    <select required={required} className="admin-input" value={value} onChange={e => onChange(e.target.value)}>
      <option value="">{placeholder}</option>
      {WISH_OPTIONS.map(w => <option key={w} value={w}>{w}</option>)}
    </select>
  )
}

export default function PrayerCodApplyForm({ fees: FEE_OPTIONS, shippingTiers }: { fees: Fee[]; shippingTiers: ShippingTier[] }) {
  const supabase = createClient()
  const t = useTranslations('prayerCodApply')
  const tPMA = useTranslations('prayerMailApply')
  const tc = useTranslations('common')
  const locale = useLocale()
  // フリガナは日本語話者向けの慣習で、外国語話者には該当しないため日本語以外では欄自体を出さない。
  const showNameKana = locale === 'ja'
  const [form, setForm] = useState({ name: '', nameKana: '', email: '', phone: '', postal: '', address: '', wish1: '', wish2: '' })
  const [fee, setFee] = useState('')
  const [notes, setNotes] = useState('')
  const [step, setStep] = useState<'input' | 'confirm' | 'done'>('input')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }))
  }

  const weightG = FEE_OPTIONS.find(f => f.price === fee)?.weight_g ?? 0
  const subtotal = fee ? priceToNumber(fee) : 0
  const shippingFee = fee ? calcShippingFeeByWeight(weightG, shippingTiers) : null
  const grandTotal = subtotal + (shippingFee ?? 0)

  function goToConfirm(e: React.FormEvent) {
    e.preventDefault()
    if (!fee) { setErrorMsg(t('feeRequiredError')); return }
    setErrorMsg('')
    setStep('confirm')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function backToInput() {
    setStep('input')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSubmit() {
    setStatus('loading')
    setErrorMsg('')

    const message = [
      `【御祈願・郵送申し込み】`,
      `お支払い方法：代金引換（代引き）`,
      showNameKana && form.nameKana ? `フリガナ：${form.nameKana}` : '',
      `電話番号：${form.phone}`,
      `郵便番号：${form.postal}`,
      `住所：${form.address}`,
      `お願い事：${[form.wish1, form.wish2].filter(Boolean).join('、')}`,
      `御札：${fee}`,
      `御祈願料：¥${subtotal.toLocaleString()}`,
      `送料：${shippingFee !== null ? `¥${shippingFee.toLocaleString()}` : '追ってご案内'}`,
      `合計：¥${grandTotal.toLocaleString()}`,
      notes ? `\n【備考】\n${notes}` : '',
    ].filter(Boolean).join('\n')

    const id = crypto.randomUUID()
    const subject = '【郵送・代金引換】御祈願のお申し込み'
    const { error } = await supabase.from('contacts').insert({
      id,
      name: form.name,
      email: form.email,
      subject,
      message,
      source: 'event_application',
    })
    if (error) { setStatus('error'); setErrorMsg(t('submitError')); return }
    await fetch('/api/notify/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, name: form.name, email: form.email, subject, message }),
    }).catch(() => {})
    setStatus('idle')
    setStep('done')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (step === 'done') return (
    <main className="min-h-screen pt-24 flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <p className="text-5xl mb-4">🙏</p>
        <h1 className="text-2xl font-serif text-navy mb-3">{t('doneTitle')}</h1>
        <p className="text-gray-600 text-sm leading-relaxed">{t('doneText')}</p>
        <Link href="/prayer"
          className="inline-block mt-8 text-sm text-navy border-b border-navy/40 hover:border-navy transition-colors">
          {t('backToPrayer')}
        </Link>
      </div>
    </main>
  )

  const confirmRows: [string, string][] = [
    [t('nameLabel'), form.name],
    ...(showNameKana ? [[t('nameKanaLabel'), form.nameKana] as [string, string]] : []),
    [t('emailLabel'), form.email],
    [t('phoneLabel'), form.phone],
    ...(form.postal ? [[t('postalLabel'), form.postal] as [string, string]] : []),
    [t('addressLabel'), form.address],
    [t('feeHeading'), fee],
    [t('wish1Label'), form.wish1],
    ...(form.wish2 ? [[t('wish2Label'), form.wish2] as [string, string]] : []),
    [t('subtotalLabel'), `¥${subtotal.toLocaleString()}`],
    [t('shippingFeeLabel'), shippingFee !== null ? `¥${shippingFee.toLocaleString()}` : t('shippingUnknownNote')],
    [t('grandTotalLabel'), `¥${grandTotal.toLocaleString()}`],
    ...(notes ? [[t('notesLabel'), notes] as [string, string]] : []),
  ]

  return (
    <main className="pt-24 pb-16 px-4">
      <div className="max-w-xl mx-auto">
        <nav className="text-xs text-gray-400 mb-6">
          <Link href="/">{tc('breadcrumbHome')}</Link> &gt; <Link href="/prayer">{tPMA('subtitle')}</Link> &gt; <Link href="/prayer/mail-apply">{tPMA('breadcrumb')}</Link> &gt; {t('breadcrumb')}
        </nav>
        <h1 className="text-3xl font-serif text-navy mb-1">{t('title')}</h1>
        <p className="text-gray-500 text-sm mb-8">{t('intro')}</p>

        {step === 'input' && (
        <form onSubmit={goToConfirm} className="space-y-5">
          <div>
            <label className="admin-label">{t('nameLabel')} <span className="text-red-500 text-xs">{t('required')}</span></label>
            <input required className="admin-input" value={form.name} onChange={set('name')} />
          </div>
          {showNameKana && (
            <div>
              <label className="admin-label">{t('nameKanaLabel')} <span className="text-red-500 text-xs">{t('required')}</span></label>
              <input required className="admin-input" pattern="[ぁ-んー\s　]+" title={t('nameKanaLabel')}
                placeholder={t('nameKanaPlaceholder')} value={form.nameKana} onChange={set('nameKana')} />
            </div>
          )}
          <div>
            <label className="admin-label">{t('emailLabel')} <span className="text-red-500 text-xs">{t('required')}</span></label>
            <input type="email" required className="admin-input" value={form.email} onChange={set('email')} />
          </div>
          <div>
            <label className="admin-label">{t('phoneLabel')} <span className="text-red-500 text-xs">{t('required')}</span></label>
            <input type="tel" required className="admin-input" value={form.phone} onChange={set('phone')} />
          </div>
          <div>
            <label className="admin-label">{t('postalLabel')} <span className="text-gray-400 text-xs">{t('optional')}</span></label>
            <input className="admin-input w-40" placeholder={t('postalPlaceholder')} value={form.postal} onChange={set('postal')} />
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
            <p className="text-sm font-medium text-navy mb-1">{t('wishHeading')}</p>
            <p className="text-xs text-gray-400 mb-4">{t('wishSub')}</p>
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

          {fee && (
            <div className="border-t border-gray-200 pt-5">
              <div className="bg-cream-alt rounded-lg p-4 text-sm space-y-1">
                <p className="text-gray-600">{t('subtotalLabel')}¥{subtotal.toLocaleString()}</p>
                <p className="text-gray-600">
                  {t('shippingFeeLabel')}
                  {shippingFee !== null ? `¥${shippingFee.toLocaleString()}` : t('shippingUnknownNote')}
                </p>
                <p className="text-gold font-medium text-base">{t('grandTotalLabel')}¥{grandTotal.toLocaleString()}</p>
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 pt-5">
            <label className="admin-label">{t('notesLabel')} <span className="text-gray-400 text-xs">{t('notesHint')}</span></label>
            <textarea className="admin-input min-h-[80px]" placeholder={t('notesPlaceholder')} value={notes} onChange={e => setNotes(e.target.value)} />
          </div>

          {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}

          <button type="submit" className="btn-primary w-full text-center">
            {t('goToConfirm')}
          </button>
        </form>
        )}

        {step === 'confirm' && (
          <div className="space-y-6">
            <h2 className="font-serif text-navy text-xl">{t('confirmHeading')}</h2>
            <p className="text-sm text-gray-500">{t('confirmNote')}</p>
            <dl className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100 text-sm">
              {confirmRows.map(([label, value]) => (
                <div key={label} className="grid grid-cols-[8rem_1fr] gap-3 px-4 py-3">
                  <dt className="text-gray-500">{label}</dt>
                  <dd className="whitespace-pre-wrap">{value}</dd>
                </div>
              ))}
            </dl>
            {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}
            <div className="flex gap-3">
              <button type="button" onClick={backToInput} disabled={status === 'loading'}
                className="flex-1 border border-navy text-navy rounded-full py-3 text-sm hover:bg-navy/5 transition-colors disabled:opacity-50">
                {t('backButton')}
              </button>
              <button type="button" onClick={handleSubmit} disabled={status === 'loading'}
                className="flex-1 btn-primary text-center disabled:opacity-50">
                {status === 'loading' ? t('submitting') : t('confirmSubmit')}
              </button>
            </div>
            <p className="text-xs text-gray-400 text-center">{t('submitNote')}</p>
          </div>
        )}

        <div className="mt-8 p-5 bg-cream-alt rounded-xl text-sm text-gray-600">
          <p className="font-medium text-navy mb-1">{t('phoneApplyTitle')}</p>
          <p>TEL：<a href="tel:0288-55-0013" className="text-navy font-medium">0288-55-0013</a></p>
          <p className="text-xs text-gray-400 mt-1">{t('phoneHours')}</p>
        </div>
      </div>
    </main>
  )
}
