'use client'
import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase'
import { calcShippingFeeByWeight, type ShippingTier } from '@/lib/shipping'

type Status = 'idle' | 'loading' | 'error'
type ShipMode = 'same' | 'separate'
type Applicant = { name: string; nameKana: string; address: string; wish1: string; wish2: string; fee: string; shipMode: ShipMode }

const WISH_OPTIONS = ['心願成就', '家内安全', '身体健全', '身上安全', '商売繁盛', '開運', '厄除', '良縁成就', '安産', '病気平癒', '闘病平癒']
const CIRCLED = ['②', '③', '④', '⑤']
const emptyApplicant = (): Applicant => ({ name: '', nameKana: '', address: '', wish1: '', wish2: '', fee: '', shipMode: 'same' })

function priceToNumber(price: string): number {
  return Number(price.replace(/[^\d]/g, '')) || 0
}

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

type Fee = { price: string; size: string; weight_g: number }

function FeeSelect({ value, onChange, options, placeholder }: { value: string; onChange: (v: string) => void; options: Fee[]; placeholder: string }) {
  return (
    <select className="admin-input" value={value} onChange={e => onChange(e.target.value)}>
      <option value="">{placeholder}</option>
      {options.map(f => <option key={f.price} value={f.price}>{f.price}（{f.size}）</option>)}
    </select>
  )
}

export default function ShogatsuApplyForm({ fees: FEE_OPTIONS, shippingTiers }: { fees: Fee[]; shippingTiers: ShippingTier[] }) {
  const supabase = createClient()
  const t = useTranslations('shogatsuApply')
  const tS = useTranslations('shogatsu')
  const tc = useTranslations('common')
  const tAE = useTranslations('annualEvents')
  const locale = useLocale()
  // フリガナは日本語話者向けの慣習で、外国語話者には該当しないため日本語以外では欄自体を出さない。
  const showNameKana = locale === 'ja'
  const [form, setForm] = useState({ name: '', nameKana: '', email: '', phone: '', postal: '', address: '', wish1: '', wish2: '' })
  const [fee, setFee] = useState('')
  const [applicants, setApplicants] = useState<Applicant[]>(Array.from({ length: 4 }, emptyApplicant))
  const [notes, setNotes] = useState('')
  const [step, setStep] = useState<'input' | 'confirm' | 'done'>('input')
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
  function setApplicantShipMode(i: number, mode: ShipMode) {
    setApplicants(prev => prev.map((a, idx) => idx === i ? { ...a, shipMode: mode } : a))
  }

  function weightOf(price: string): number {
    return FEE_OPTIONS.find(f => f.price === price)?.weight_g ?? 0
  }
  function countBy(prices: string[]) {
    return FEE_OPTIONS
      .map(f => ({ price: f.price, count: prices.filter(p => p === f.price).length }))
      .filter(x => x.count > 0)
  }

  const activeApplicants = applicants
    .map((a, i) => ({ ...a, circled: CIRCLED[i] }))
    .filter(a => a.name.trim() && a.fee)
  const sameAddressApplicants = activeApplicants.filter(a => a.shipMode === 'same')
  const separateApplicants = activeApplicants.filter(a => a.shipMode === 'separate')

  // まとめて発送分（代表者＋「代表者と同じ住所」を選んだ申込者）：重量を合算して1件分の送料
  const mainFees = [...(fee ? [fee] : []), ...sameAddressApplicants.map(a => a.fee)]
  const mainWeightG = mainFees.reduce((sum, p) => sum + weightOf(p), 0)
  const mainShippingFee = mainFees.length > 0 ? calcShippingFeeByWeight(mainWeightG, shippingTiers) : null

  // 個別発送分（「別の住所に送る」を選んだ申込者）：1人＝1件として、それぞれ別に送料計算
  const separateShipments = separateApplicants.map(a => ({
    applicant: a,
    shippingFee: calcShippingFeeByWeight(weightOf(a.fee), shippingTiers),
  }))

  const selectedFees = activeApplicants.map(a => a.fee).concat(fee ? [fee] : [])
  const subtotal = selectedFees.reduce((sum, p) => sum + priceToNumber(p), 0)
  const shippingFeeTotal = (mainShippingFee ?? 0) + separateShipments.reduce((sum, s) => sum + (s.shippingFee ?? 0), 0)
  const hasUnknownShippingFee = (mainFees.length > 0 && mainShippingFee === null) || separateShipments.some(s => s.shippingFee === null)
  const grandTotal = subtotal + shippingFeeTotal

  function goToConfirm(e: React.FormEvent) {
    e.preventDefault()
    setStep('confirm')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function backToInput() {
    setStep('input')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSubmit() {
    setStatus('loading')

    const applicantLines = applicants
      .map((a, i) => ({ ...a, num: CIRCLED[i] }))
      .filter(a => a.name.trim())
      .map(a => {
        const shipLabel = !a.fee ? '' : a.shipMode === 'separate' ? '　発送：別住所に個別発送' : '　発送：代表者とまとめて発送'
        const kanaLabel = a.nameKana ? `　フリガナ：${a.nameKana}` : ''
        return `${a.num} ${a.name}${kanaLabel}（${a.address || '住所未記入'}）　御札：${a.fee || '未選択'}${shipLabel}　願い事：${[a.wish1, a.wish2].filter(Boolean).join('、') || '未選択'}`
      })
      .join('\n')

    const mainLines = mainFees.length > 0
      ? [
          `【まとめて発送（代表者住所）】`,
          ...countBy(mainFees).map(({ price, count }) => `${price} × ${count}点`),
          `送料：${mainShippingFee !== null ? `¥${mainShippingFee.toLocaleString()}` : '追ってご案内'}`,
        ]
      : []
    const separateLines = separateShipments.flatMap(({ applicant: a, shippingFee: sf }) => [
      `【${a.circled} ${a.name}様へ個別発送（${a.address || '住所未記入'}）】`,
      `${a.fee} × 1点`,
      `送料：${sf !== null ? `¥${sf.toLocaleString()}` : '追ってご案内'}`,
    ])

    const message = [
      `【行事名】正月元旦特別護摩祈願（1月1日）`,
      `【代表者①】`,
      showNameKana && form.nameKana ? `フリガナ：${form.nameKana}` : '',
      `電話番号：${form.phone}`,
      `郵便番号：${form.postal}`,
      `住所：${form.address}`,
      `お願い事：${[form.wish1, form.wish2].filter(Boolean).join('、')}`,
      `御札：${fee}`,
      `お支払い方法：代金引換（代引き）`,
      applicantLines ? `\n【申込者一覧】\n${applicantLines}` : '',
      mainLines.length ? `\n${mainLines.join('\n')}` : '',
      separateLines.length ? `\n${separateLines.join('\n')}` : '',
      `\n御札代金小計：¥${subtotal.toLocaleString()}`,
      `送料合計：¥${shippingFeeTotal.toLocaleString()}${hasUnknownShippingFee ? '（一部追ってご案内）' : ''}`,
      `合計：¥${grandTotal.toLocaleString()}`,
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
    setStatus('idle')
    setStep('done')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (step === 'done') return (
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

  const applicantRows: [string, string][] = applicants
    .map((a, i) => ({ ...a, num: CIRCLED[i] }))
    .filter(a => a.name.trim())
    .map(a => {
      const shipLabel = !a.fee ? '' : a.shipMode === 'separate' ? `（${t('shipModeSeparate')}）` : `（${t('shipModeSame')}）`
      const kanaLine = showNameKana && a.nameKana ? `\n${t('repNameKanaLabel')}：${a.nameKana}` : ''
      return [
        `${t('applicantLabel')}${a.num}`,
        `${a.name}${kanaLine}（${a.address || '住所未記入'}）\n${t('applicantFeeLabel')}：${a.fee || '未選択'}${shipLabel}\n${t('repWishHeading')}：${[a.wish1, a.wish2].filter(Boolean).join('、') || '未選択'}`,
      ] as [string, string]
    })

  const confirmRows: [string, string][] = [
    [t('repNameLabel'), form.name],
    ...(showNameKana ? [[t('repNameKanaLabel'), form.nameKana] as [string, string]] : []),
    [t('emailLabel'), form.email],
    [t('phoneLabel'), form.phone],
    ...(form.postal ? [[t('postalLabel'), form.postal] as [string, string]] : []),
    [t('addressLabel'), form.address],
    [t('feeHeading'), fee],
    [t('wish1Label'), form.wish1],
    ...(form.wish2 ? [[t('wish2Label'), form.wish2] as [string, string]] : []),
    ...applicantRows,
    [t('subtotalLabel'), `¥${subtotal.toLocaleString()}`],
    [t('shippingTotalLabel'), `¥${shippingFeeTotal.toLocaleString()}${hasUnknownShippingFee ? t('shippingUnknownSuffix') : ''}`],
    [t('grandTotalLabel'), `¥${grandTotal.toLocaleString()}`],
    ...(notes ? [[t('notesLabel'), notes] as [string, string]] : []),
  ]

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
            <button type="button" onClick={() => setShowEcConfirm(true)}
              className="flex flex-col gap-2 rounded-xl border border-navy/20 p-4 hover:bg-navy/5 hover:border-navy transition-colors text-left">
              <span className="text-2xl">🛒</span>
              <span className="font-medium text-navy text-sm">{t('methodEcTitle')}</span>
              <span className="text-xs text-gray-500 leading-relaxed">{t('methodEcText')}</span>
            </button>
            <a href="#apply-form"
              className="flex flex-col gap-2 rounded-xl border border-navy/20 p-4 hover:bg-navy/5 hover:border-navy transition-colors">
              <span className="text-2xl">📦</span>
              <span className="font-medium text-navy text-sm">{t('methodCodTitle')}</span>
              <span className="text-xs text-gray-500 leading-relaxed">{t('methodCodText')}</span>
            </a>
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
        {step === 'input' && (
        <form id="apply-form" onSubmit={goToConfirm} className="space-y-5">
          <div>
            <label className="admin-label">{t('repNameLabel')} <span className="text-red-500 text-xs">{t('required')}</span></label>
            <input required className="admin-input" placeholder={t('repNamePlaceholder')} value={form.name} onChange={set('name')} />
          </div>
          {showNameKana && (
            <div>
              <label className="admin-label">{t('repNameKanaLabel')} <span className="text-red-500 text-xs">{t('required')}</span></label>
              <input required className="admin-input" pattern="[ぁ-んー\s　]+" title={t('repNameKanaLabel')}
                placeholder={t('repNameKanaPlaceholder')} value={form.nameKana} onChange={set('nameKana')} />
            </div>
          )}
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
            <p className="text-xs text-gray-400 mb-1">{t('applicantsSub')}</p>
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4">{t('applicantsAddressNote')}</p>
            <div className="space-y-4">
              {applicants.map((a, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-navy mb-3">{t('applicantLabel')}{CIRCLED[i]}</p>
                  <div className="space-y-3 mb-3">
                    <input className="admin-input" placeholder={t('applicantNamePlaceholder')} value={a.name} onChange={e => setApplicant(i, 'name', e.target.value)} />
                    {showNameKana && (
                      <input className="admin-input" pattern="[ぁ-んー\s　]*" title={t('applicantNameKanaPlaceholder')}
                        placeholder={t('applicantNameKanaPlaceholder')} value={a.nameKana} onChange={e => setApplicant(i, 'nameKana', e.target.value)} />
                    )}
                    <input className="admin-input" placeholder={t('applicantAddressPlaceholder')} value={a.address} onChange={e => setApplicant(i, 'address', e.target.value)} />
                  </div>
                  <div className="mb-3">
                    <label className="text-xs text-gray-500 block mb-0.5">{t('applicantFeeLabel')}</label>
                    <FeeSelect value={a.fee} onChange={v => setApplicant(i, 'fee', v)} options={FEE_OPTIONS} placeholder={t('applicantFeePlaceholder')} />
                  </div>
                  <div className="mb-3">
                    <label className="text-xs text-gray-500 block mb-1">{t('shipModeLabel')}</label>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setApplicantShipMode(i, 'same')}
                        className={`flex-1 text-xs px-3 py-2 rounded-lg border transition-colors ${a.shipMode === 'same' ? 'border-navy bg-navy/5 text-navy font-medium' : 'border-gray-200 text-gray-500 hover:border-navy/40'}`}>
                        {t('shipModeSame')}
                      </button>
                      <button type="button" onClick={() => setApplicantShipMode(i, 'separate')}
                        className={`flex-1 text-xs px-3 py-2 rounded-lg border transition-colors ${a.shipMode === 'separate' ? 'border-navy bg-navy/5 text-navy font-medium' : 'border-gray-200 text-gray-500 hover:border-navy/40'}`}>
                        {t('shipModeSeparate')}
                      </button>
                    </div>
                    {a.shipMode === 'separate' && (
                      <p className="text-[11px] text-gray-400 mt-1">{t('shipModeSeparateHint')}</p>
                    )}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <WishSelect value={a.wish1} onChange={v => setApplicant(i, 'wish1', v)} placeholder={t('wishSelectPlaceholder')} />
                    <WishSelect value={a.wish2} onChange={v => setApplicant(i, 'wish2', v)} placeholder={t('wishSelectPlaceholder')} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedFees.length > 0 && (
            <div className="border-t border-gray-200 pt-5">
              <div className="bg-cream-alt rounded-lg p-4 text-sm space-y-3">
                {mainFees.length > 0 && (
                  <div>
                    <p className="text-xs text-navy font-medium mb-1">{t('mainShipmentLabel')}</p>
                    {countBy(mainFees).map(({ price, count }) => (
                      <p key={price} className="text-gray-500 text-xs">{price} × {count}{t('feeCountUnit')}</p>
                    ))}
                    <p className="text-gray-500 text-xs">
                      {t('shippingFeeLabel')}
                      {mainShippingFee !== null ? `¥${mainShippingFee.toLocaleString()}` : t('shippingUnknownNote')}
                    </p>
                  </div>
                )}
                {separateShipments.map(({ applicant: a, shippingFee: sf }) => (
                  <div key={a.circled} className="border-t border-white pt-2">
                    <p className="text-xs text-navy font-medium mb-1">
                      {t('separateShipmentLabel', { name: `${a.circled} ${a.name}` })}
                    </p>
                    <p className="text-gray-500 text-xs">{a.fee} × 1{t('feeCountUnit')}</p>
                    <p className="text-gray-500 text-xs">
                      {t('shippingFeeLabel')}
                      {sf !== null ? `¥${sf.toLocaleString()}` : t('shippingUnknownNote')}
                    </p>
                  </div>
                ))}
                <div className="border-t border-white pt-2 space-y-1">
                  <p className="text-gray-600">{t('subtotalLabel')}¥{subtotal.toLocaleString()}</p>
                  <p className="text-gray-600">{t('shippingTotalLabel')}¥{shippingFeeTotal.toLocaleString()}{hasUnknownShippingFee && t('shippingUnknownSuffix')}</p>
                  <p className="text-gold font-medium text-base">{t('grandTotalLabel')}¥{grandTotal.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 pt-5">
            <label className="admin-label">{t('notesLabel')} <span className="text-gray-400 text-xs">{t('notesHint')}</span></label>
            <textarea className="admin-input min-h-[80px]" placeholder={t('notesPlaceholder')} value={notes} onChange={e => setNotes(e.target.value)} />
          </div>

          <button type="submit" className="btn-primary w-full text-center py-3">
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
            {status === 'error' && (
              <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                {t('submitError')}
              </p>
            )}
            <div className="flex gap-3">
              <button type="button" onClick={backToInput} disabled={status === 'loading'}
                className="flex-1 border border-navy text-navy rounded-full py-3 text-sm hover:bg-navy/5 transition-colors disabled:opacity-50">
                {t('backButton')}
              </button>
              <button type="button" onClick={handleSubmit} disabled={status === 'loading'}
                className="flex-1 btn-primary text-center disabled:opacity-50 py-3">
                {status === 'loading' ? t('submitting') : t('confirmSubmit')}
              </button>
            </div>
            <p className="text-xs text-gray-400 text-center">{t('afterSubmitNote')}</p>
          </div>
        )}

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
