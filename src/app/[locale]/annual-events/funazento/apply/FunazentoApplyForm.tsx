'use client'
import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase'
import { getLocalizedContent } from '@/lib/site-content'
import type { Locale } from '@/i18n/routing'

type Status = 'idle' | 'loading' | 'error'
type Participate = 'yes' | 'no'
type AgeCategory = 'adult' | 'child'
type ShipMode = 'same' | 'separate'
type Applicant = { key: number; name: string; nameKana: string; address: string; wish1: string; wish2: string; participate: Participate; ageCategory: AgeCategory; shipMode: ShipMode }

const WISH_OPTIONS = ['心願成就', '家内安全', '身体健全', '身上安全', '商売繁盛', '開運', '厄除', '良縁成就', '安産', '病気平癒', '闘病平癒']
const CIRCLED = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩']
const MAX_APPLICANTS = CIRCLED.length
let applicantKeySeq = 0
const emptyApplicant = (): Applicant => ({ key: applicantKeySeq++, name: '', nameKana: '', address: '', wish1: '', wish2: '', participate: 'yes', ageCategory: 'adult', shipMode: 'same' })
const SHIPPING_FEE = 1000

function feeFor(participate: Participate, age: AgeCategory): number {
  if (participate === 'no') return 4000
  return age === 'adult' ? 5000 : 4000
}

function WishSelect({ value, onChange, required, placeholder }: { value: string; onChange: (v: string) => void; required?: boolean; placeholder: string }) {
  return (
    <select required={required} className="admin-input" value={value} onChange={e => onChange(e.target.value)}>
      <option value="">{placeholder}</option>
      {WISH_OPTIONS.map(w => <option key={w} value={w}>{w}</option>)}
    </select>
  )
}

function ParticipateFeeBlock({
  t, participate, ageCategory, onParticipateChange, onAgeChange, fee,
}: {
  t: ReturnType<typeof useTranslations>
  participate: Participate
  ageCategory: AgeCategory
  onParticipateChange: (p: Participate) => void
  onAgeChange: (a: AgeCategory) => void
  fee: number
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-navy">{t('participateHeading')} <span className="text-red-500 text-xs">{t('required')}</span></p>
        <span className="text-gold font-bold text-sm">¥{fee.toLocaleString()}</span>
      </div>
      <div className="flex gap-2 mb-3">
        <button type="button" onClick={() => onParticipateChange('yes')}
          className={`flex-1 text-sm px-3 py-2 rounded-lg border transition-colors ${participate === 'yes' ? 'border-navy bg-navy/5 text-navy font-medium' : 'border-gray-200 text-gray-500 hover:border-navy/40'}`}>
          {t('participateYes')}
        </button>
        <button type="button" onClick={() => onParticipateChange('no')}
          className={`flex-1 text-sm px-3 py-2 rounded-lg border transition-colors ${participate === 'no' ? 'border-navy bg-navy/5 text-navy font-medium' : 'border-gray-200 text-gray-500 hover:border-navy/40'}`}>
          {t('participateNo')}
        </button>
      </div>
      {participate === 'yes' ? (
        <div>
          <label className="text-xs text-gray-500 block mb-1">{t('ageCategoryLabel')}</label>
          <div className="grid grid-cols-2 gap-2">
            {(['adult', 'child'] as const).map(age => (
              <button key={age} type="button" onClick={() => onAgeChange(age)}
                className={`text-xs px-2 py-2 rounded-lg border transition-colors ${ageCategory === age ? 'border-navy bg-navy/5 text-navy font-medium' : 'border-gray-200 text-gray-500 hover:border-navy/40'}`}>
                {age === 'adult' ? t('ageAdult') : t('ageChild')}
                <br />
                <span className="text-[11px] text-gray-400">{age === 'adult' ? t('ageAdultFee') : t('ageChildFee')}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-xs text-gray-500">{t('notParticipateFeeNote')}</p>
      )}
    </div>
  )
}

function ageLabel(t: ReturnType<typeof useTranslations>, age: AgeCategory) {
  return age === 'adult' ? t('ageAdult') : t('ageChild')
}

export default function FunazentoApplyForm({ content }: { content: Record<string, string> }) {
  const supabase = createClient()
  const t = useTranslations('funazentoApply')
  const tF = useTranslations('funazento')
  const tc = useTranslations('common')
  const tAE = useTranslations('annualEvents')
  const locale = useLocale()
  const loc = locale as Locale
  const g = (key: string) => getLocalizedContent(content, key, loc)
  // フリガナは日本語話者向けの慣習で、外国語話者には該当しないため日本語以外では欄自体を出さない。
  const showNameKana = locale === 'ja'
  const [form, setForm] = useState({
    name: '', nameKana: '', email: '', phone: '', postal: '', address: '', wish1: '', wish2: '',
    participate: 'yes' as Participate, ageCategory: 'adult' as AgeCategory,
  })
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [notes, setNotes] = useState('')
  const [step, setStep] = useState<'input' | 'confirm' | 'done'>('input')
  const [status, setStatus] = useState<Status>('idle')

  function set(field: 'name' | 'nameKana' | 'email' | 'phone' | 'postal' | 'address') {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }))
  }

  function setApplicant(key: number, field: keyof Applicant, value: string) {
    setApplicants(prev => prev.map(a => a.key === key ? { ...a, [field]: value } : a))
  }
  function addApplicant() {
    setApplicants(prev => prev.length < MAX_APPLICANTS ? [...prev, emptyApplicant()] : prev)
  }
  function removeApplicant(key: number) {
    setApplicants(prev => prev.filter(a => a.key !== key))
  }

  const repFee = feeFor(form.participate, form.ageCategory)
  const activeApplicants = applicants
    .map((a, i) => ({ ...a, circled: CIRCLED[i] }))
    .filter(a => a.name.trim())
  const feesTotal = repFee + activeApplicants.reduce((sum, a) => sum + feeFor(a.participate, a.ageCategory), 0)

  // 当日不参加の方はお札を代引きで郵送するため、送り先1件につき送料がかかる（代表者住所へまとめる、または個別発送を選択）
  const nonParticipantApplicants = activeApplicants.filter(a => a.participate === 'no')
  const sameShipApplicants = nonParticipantApplicants.filter(a => a.shipMode === 'same')
  const separateShipApplicants = nonParticipantApplicants.filter(a => a.shipMode === 'separate')
  const repNeedsShipping = form.participate === 'no'
  const mainShipmentNeeded = repNeedsShipping || sameShipApplicants.length > 0
  const shippingFeeTotal = (mainShipmentNeeded ? SHIPPING_FEE : 0) + separateShipApplicants.length * SHIPPING_FEE
  const grandTotal = feesTotal + shippingFeeTotal

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

    const repParticipateLine = form.participate === 'yes'
      ? `参加する（${ageLabel(t, form.ageCategory)}）`
      : `参加しない（代引き発送・代表者住所）`

    const applicantLines = applicants
      .map((a, i) => ({ ...a, num: CIRCLED[i] }))
      .filter(a => a.name.trim())
      .map(a => {
        const shipLabel = a.participate !== 'no' ? '' : a.shipMode === 'separate' ? '　発送：別住所に個別発送' : '　発送：代表者とまとめて発送'
        const participateLine = a.participate === 'yes' ? `参加する（${ageLabel(t, a.ageCategory)}）` : '参加しない'
        return `${a.num} ${a.name}${a.nameKana ? `　フリガナ：${a.nameKana}` : ''}（${a.address || '住所未記入'}）　当日参加：${participateLine}${shipLabel}　参加費：¥${feeFor(a.participate, a.ageCategory).toLocaleString()}　願い事：${[a.wish1, a.wish2].filter(Boolean).join('、') || '未選択'}`
      })
      .join('\n')

    const shippingLines = [
      mainShipmentNeeded ? `代表者様ご住所へまとめて発送：¥${SHIPPING_FEE.toLocaleString()}` : '',
      ...separateShipApplicants.map(a => `${a.circled} ${a.name}様へ個別発送：¥${SHIPPING_FEE.toLocaleString()}`),
    ].filter(Boolean)

    const message = [
      `【行事名】船禅頂（ふなぜんじょう）（8月4日）`,
      `【代表者】`,
      showNameKana && form.nameKana ? `フリガナ：${form.nameKana}` : '',
      `電話番号：${form.phone}`,
      `郵便番号：${form.postal}`,
      `住所：${form.address}`,
      `当日参加：${repParticipateLine}　参加費：¥${repFee.toLocaleString()}`,
      `お願い事：${[form.wish1, form.wish2].filter(Boolean).join('、')}`,
      applicantLines ? `\n【申込者一覧】\n${applicantLines}` : '',
      shippingLines.length ? `\n【送料】\n${shippingLines.join('\n')}` : '',
      `\n参加費小計：¥${feesTotal.toLocaleString()}`,
      `送料合計：¥${shippingFeeTotal.toLocaleString()}`,
      `合計金額：¥${grandTotal.toLocaleString()}`,
      notes ? `\n【備考】\n${notes}` : '',
    ].filter(Boolean).join('\n')

    const id = crypto.randomUUID()
    const { error } = await supabase.from('contacts').insert({
      id,
      name: form.name,
      email: form.email,
      subject: '【8月4日】船禅頂（ふなぜんじょう）申し込み',
      message,
      source: 'event_application',
    })
    if (error) { setStatus('error'); return }
    await fetch('/api/notify/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, name: form.name, email: form.email, subject: '【8月4日】船禅頂（ふなぜんじょう）申し込み', message }),
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
        <Link href="/annual-events/funazento"
          className="inline-block mt-8 text-sm text-navy border-b border-navy/40 hover:border-navy transition-colors">
          {t('backToEvent')}
        </Link>
      </div>
    </main>
  )

  const applicantRows: [string, string][] = activeApplicants
    .map(a => {
      const shipLine = a.participate !== 'no' ? '' : `\n${t('shipModeLabel')}：${a.shipMode === 'separate' ? t('shipModeSeparate') : t('shipModeSame')}`
      return [
        `${t('applicantLabel')}${a.circled}`,
        `${a.name}${showNameKana && a.nameKana ? `\n${t('repNameKanaLabel')}：${a.nameKana}` : ''}（${a.address || '住所未記入'}）\n${t('participateHeading')}：${a.participate === 'yes' ? ageLabel(t, a.ageCategory) : t('participateNo')}　${t('feePerPersonLabel')}：¥${feeFor(a.participate, a.ageCategory).toLocaleString()}${shipLine}\n${t('repWishHeading')}：${[a.wish1, a.wish2].filter(Boolean).join('、') || '未選択'}`,
      ] as [string, string]
    })

  const shippingRows: [string, string][] = [
    ...(mainShipmentNeeded ? [[t('mainShipmentLabel'), `¥${SHIPPING_FEE.toLocaleString()}`] as [string, string]] : []),
    ...separateShipApplicants.map(a => [t('separateShipmentLabel', { name: `${a.circled} ${a.name}` }), `¥${SHIPPING_FEE.toLocaleString()}`] as [string, string]),
  ]

  const confirmRows: [string, string][] = [
    [t('repNameLabel'), form.name],
    ...(showNameKana ? [[t('repNameKanaLabel'), form.nameKana] as [string, string]] : []),
    [t('emailLabel'), form.email],
    [t('phoneLabel'), form.phone],
    ...(form.postal ? [[t('postalLabel'), form.postal] as [string, string]] : []),
    [t('addressLabel'), form.address],
    [t('participateHeading'), `${form.participate === 'yes' ? ageLabel(t, form.ageCategory) : t('participateNo')}　¥${repFee.toLocaleString()}`],
    [t('wish1Label'), form.wish1],
    ...(form.wish2 ? [[t('wish2Label'), form.wish2] as [string, string]] : []),
    ...applicantRows,
    ...shippingRows,
    [t('subtotalLabel'), `¥${feesTotal.toLocaleString()}`],
    ...(shippingFeeTotal > 0 ? [[t('shippingTotalLabel'), `¥${shippingFeeTotal.toLocaleString()}`] as [string, string]] : []),
    [t('grandTotalLabel'), `¥${grandTotal.toLocaleString()}`],
    ...(notes ? [[t('notesLabel'), notes] as [string, string]] : []),
  ]

  return (
    <main className="pt-16 pb-16">
      {/* パンくず */}
      <div className="bg-cream-alt px-4 py-2 text-xs text-gray-400">
        <div className="max-w-xl mx-auto">
          <Link href="/">{tc('breadcrumbHome')}</Link> &gt; <Link href="/annual-events">{tAE('title')}</Link> &gt; <Link href="/annual-events/funazento">{tF('breadcrumb')}</Link> &gt; {t('breadcrumb')}
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

        {/* 注意事項 */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 space-y-2">
          <p className="font-medium text-amber-800 text-sm mb-2">{t('noticeHeading')}</p>
          <div className="flex gap-2 text-sm text-amber-700">
            <span className="flex-shrink-0">⛩️</span>
            <p>{g('funazento_apply_notice_ofuda')}</p>
          </div>
          <div className="flex gap-2 text-sm text-amber-700">
            <span className="flex-shrink-0">💰</span>
            <p>{g('funazento_apply_notice_fee')}</p>
          </div>
          <div className="flex gap-2 text-sm text-amber-700">
            <span className="flex-shrink-0">🚚</span>
            <p>{g('funazento_apply_notice_shipping')}</p>
          </div>
          <div className="flex gap-2 text-sm text-amber-700">
            <span className="flex-shrink-0">💴</span>
            <p>{g('funazento_apply_notice_payment')}</p>
          </div>
          <div className="flex gap-2 text-sm text-amber-700">
            <span className="flex-shrink-0">👥</span>
            <p>{g('funazento_apply_notice_capacity')}</p>
          </div>
          <div className="flex gap-2 text-sm text-amber-700">
            <span className="flex-shrink-0">👨‍👩‍👧‍👦</span>
            <p>{g('funazento_apply_notice_family')}</p>
          </div>
        </div>

        {/* フォーム */}
        {step === 'input' && (
        <form onSubmit={goToConfirm} className="space-y-5">
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
            <ParticipateFeeBlock
              t={t}
              participate={form.participate}
              ageCategory={form.ageCategory}
              onParticipateChange={p => setForm(f => ({ ...f, participate: p }))}
              onAgeChange={a => setForm(f => ({ ...f, ageCategory: a }))}
              fee={repFee}
            />
            {form.participate === 'no' && (
              <p className="text-xs text-gray-500 mt-2">{t('shippingRepNote')}</p>
            )}
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
                <div key={a.key} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-navy">{t('applicantLabel')}{CIRCLED[i]}</p>
                    <button type="button" onClick={() => removeApplicant(a.key)}
                      className="text-red-400 hover:text-red-600 text-xs">{t('removeApplicant')}</button>
                  </div>
                  <div className="space-y-3 mb-3">
                    <input className="admin-input" placeholder={t('applicantNamePlaceholder')} value={a.name} onChange={e => setApplicant(a.key, 'name', e.target.value)} />
                    {showNameKana && (
                      <input className="admin-input" pattern="[ぁ-んー\s　]*" title={t('applicantNameKanaPlaceholder')}
                        placeholder={t('applicantNameKanaPlaceholder')} value={a.nameKana} onChange={e => setApplicant(a.key, 'nameKana', e.target.value)} />
                    )}
                    <input className="admin-input" placeholder={t('applicantAddressPlaceholder')} value={a.address} onChange={e => setApplicant(a.key, 'address', e.target.value)} />
                  </div>
                  <div className="mb-3">
                    <ParticipateFeeBlock
                      t={t}
                      participate={a.participate}
                      ageCategory={a.ageCategory}
                      onParticipateChange={p => setApplicant(a.key, 'participate', p)}
                      onAgeChange={ag => setApplicant(a.key, 'ageCategory', ag)}
                      fee={feeFor(a.participate, a.ageCategory)}
                    />
                    {a.participate === 'no' && (
                      <div className="mt-3">
                        <label className="text-xs text-gray-500 block mb-1">{t('shipModeLabel')}</label>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => setApplicant(a.key, 'shipMode', 'same')}
                            className={`flex-1 text-xs px-3 py-2 rounded-lg border transition-colors ${a.shipMode === 'same' ? 'border-navy bg-navy/5 text-navy font-medium' : 'border-gray-200 text-gray-500 hover:border-navy/40'}`}>
                            {t('shipModeSame')}
                          </button>
                          <button type="button" onClick={() => setApplicant(a.key, 'shipMode', 'separate')}
                            className={`flex-1 text-xs px-3 py-2 rounded-lg border transition-colors ${a.shipMode === 'separate' ? 'border-navy bg-navy/5 text-navy font-medium' : 'border-gray-200 text-gray-500 hover:border-navy/40'}`}>
                            {t('shipModeSeparate')}
                          </button>
                        </div>
                        {a.shipMode === 'separate' && (
                          <p className="text-[11px] text-gray-400 mt-1">{t('shipModeSeparateHint')}</p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <WishSelect value={a.wish1} onChange={v => setApplicant(a.key, 'wish1', v)} placeholder={t('wishSelectPlaceholder')} />
                    <WishSelect value={a.wish2} onChange={v => setApplicant(a.key, 'wish2', v)} placeholder={t('wishSelectPlaceholder')} />
                  </div>
                </div>
              ))}
            </div>
            {applicants.length < MAX_APPLICANTS && (
              <button type="button" onClick={addApplicant} className="text-navy text-xs underline mt-3">{t('addApplicant')}</button>
            )}
          </div>

          <div className="border-t border-gray-200 pt-5">
            <div className="bg-cream-alt rounded-lg p-4 text-sm space-y-2">
              <p className="text-gray-600 flex justify-between">
                <span>{t('repFeeRow')}{form.name ? `　${form.name}` : ''}（{form.participate === 'yes' ? ageLabel(t, form.ageCategory) : t('participateNo')}）</span>
                <span>¥{repFee.toLocaleString()}</span>
              </p>
              {activeApplicants.map(a => (
                <p key={a.circled} className="text-gray-600 flex justify-between">
                  <span>{a.circled} {a.name}（{a.participate === 'yes' ? ageLabel(t, a.ageCategory) : t('participateNo')}）</span>
                  <span>¥{feeFor(a.participate, a.ageCategory).toLocaleString()}</span>
                </p>
              ))}
              {shippingFeeTotal > 0 && (
                <div className="border-t border-white pt-2 space-y-1">
                  {mainShipmentNeeded && (
                    <p className="text-gray-500 text-xs flex justify-between">
                      <span>{t('mainShipmentLabel')}</span>
                      <span>¥{SHIPPING_FEE.toLocaleString()}</span>
                    </p>
                  )}
                  {separateShipApplicants.map(a => (
                    <p key={a.circled} className="text-gray-500 text-xs flex justify-between">
                      <span>{t('separateShipmentLabel', { name: `${a.circled} ${a.name}` })}</span>
                      <span>¥{SHIPPING_FEE.toLocaleString()}</span>
                    </p>
                  ))}
                </div>
              )}
              <div className="border-t border-white pt-2 space-y-1">
                <p className="text-gray-600 flex justify-between text-xs">
                  <span>{t('subtotalLabel')}</span>
                  <span>¥{feesTotal.toLocaleString()}</span>
                </p>
                {shippingFeeTotal > 0 && (
                  <p className="text-gray-600 flex justify-between text-xs">
                    <span>{t('shippingTotalLabel')}</span>
                    <span>¥{shippingFeeTotal.toLocaleString()}</span>
                  </p>
                )}
                <p className="text-gold font-medium text-base flex justify-between">
                  <span>{t('grandTotalLabel')}</span>
                  <span>¥{grandTotal.toLocaleString()}</span>
                </p>
              </div>
            </div>
          </div>

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
    </main>
  )
}
