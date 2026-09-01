'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import ReservationCalendar from '@/components/ReservationCalendar'
import { createClient } from '@/lib/supabase'
import type { ReservationType } from '@/types'

const RESERVATION_TYPES: ReservationType[] = ['prayer', 'shakyou', 'shabutu', 'jyuzu', 'zazen']

export default function ReserveForm({ fees }: { fees: Record<ReservationType, string> }) {
  const supabase = createClient()
  const searchParams = useSearchParams()
  const t = useTranslations('reserve')
  const tc = useTranslations('common')
  const locale = useLocale()
  // フリガナは日本語話者向けの慣習で、外国語話者には該当しないため日本語以外では欄自体を出さない。
  const showNameKana = locale === 'ja'
  const initialType = searchParams.get('type') ?? ''

  const TYPES: { value: ReservationType; label: string; price: string }[] = [
    { value: 'prayer',   label: t('typePrayer'),  price: fees.prayer },
    { value: 'shakyou',  label: t('typeShakyou'), price: fees.shakyou },
    { value: 'shabutu',  label: t('typeShabutu'), price: fees.shabutu },
    { value: 'jyuzu',    label: t('typeJyuzu'),   price: fees.jyuzu },
    { value: 'zazen',    label: t('typeZazen'),   price: fees.zazen },
  ]

  const PURPOSES: { value: string; label: string }[] = [
    { value: 'gokigan',      label: t('purposeGokigan') },
    { value: 'anzan',        label: t('purposeAnzan') },
    { value: 'shichigosan',  label: t('purposeShichigosan') },
    { value: 'other',        label: t('purposeOther') },
  ]

  const [form, setForm] = useState({
    type: (RESERVATION_TYPES.includes(initialType as ReservationType) ? initialType : 'prayer') as ReservationType,
    date: '', time_slot: '',
    name: '', name_kana: '', email: '', phone: '',
    party_size: 1, notes: '',
  })

  useEffect(() => {
    if (RESERVATION_TYPES.includes(initialType as ReservationType)) {
      setForm(f => ({ ...f, type: initialType as ReservationType, date: '', time_slot: '' }))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialType])
  const [purpose, setPurpose] = useState('gokigan')
  const [step, setStep] = useState<'input' | 'confirm' | 'done'>('input')
  const [status, setStatus] = useState<'idle'|'loading'|'error'>('idle')
  const [showGomaNotice, setShowGomaNotice] = useState(false)

  function goToConfirm(e: React.FormEvent) {
    e.preventDefault()
    setStep('confirm')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function backToInput() {
    setStep('input')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // 護摩祈願のみ、最終送信前に受付時間の注意事項をポップアップで確認してもらう
  function handleConfirmClick() {
    if (form.type === 'prayer') {
      setShowGomaNotice(true)
      return
    }
    handleSubmit()
  }

  function acknowledgeGomaNotice() {
    setShowGomaNotice(false)
    handleSubmit()
  }

  async function handleSubmit() {
    setStatus('loading')
    // 予約番号（LINE通知等で使用）をクライアント側で採番する。
    // anonロールにはreservationsのSELECT権限が無くinsert後にDB生成IDを
    // 取得できないため、この方式でIDを先に確定させてinsert/通知の両方に使う。
    const id = crypto.randomUUID()
    // 護摩祈願の場合、御祈願の内容（御祈願／護摩祈願／安産祈願／七五三祈願／その他）を
    // 備考欄の先頭に付記して送信する。DBにpurpose専用カラムが無いための対応。
    const purposeLabel = PURPOSES.find(p => p.value === purpose)?.label
    const notes = form.type === 'prayer' && purposeLabel
      ? `【${purposeLabel}】${form.notes ? '\n' + form.notes : ''}`
      : form.notes
    // フリガナ欄を表示していない場合（日本語以外）はDBのNOT NULL制約を満たすため氏名をそのまま入れる。
    const submission = { ...form, notes, name_kana: showNameKana ? form.name_kana : form.name }
    const { data: defaultCategory } = await supabase
      .from('reservation_categories').select('id').eq('is_default', true).maybeSingle()
    const { error } = await supabase.from('reservations')
      .insert({ ...submission, id, status: 'unconfirmed', category_id: defaultCategory?.id ?? null, locale })
    if (error) { setStatus('error'); return }
    // メール・LINE通知（失敗してもフォーム送信は成功扱い）
    await fetch('/api/notify/reservation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...submission, id, locale }),
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
        <p className="text-gray-600 text-sm leading-relaxed">
          {t('doneText')}
        </p>
      </div>
    </main>
  )

  const typeLabel = TYPES.find(ty => ty.value === form.type)?.label ?? form.type
  const purposeLabel = PURPOSES.find(p => p.value === purpose)?.label ?? ''
  const confirmRows: [string, string][] = [
    [t('typeLabel'), typeLabel],
    ...(form.type === 'prayer' ? [[t('purposeLabel'), purposeLabel] as [string, string]] : []),
    [t('dateLabel'), `${form.date} ${form.time_slot}`],
    [t('partySizeLabel'), `${form.party_size}${t('partySizeUnit')}`],
    [t('nameLabel'), form.name],
    ...(showNameKana ? [[t('nameKanaLabel'), form.name_kana] as [string, string]] : []),
    [t('emailLabel'), form.email],
    [t('phoneLabel'), form.phone],
    ...(form.notes ? [[t('notesLabel'), form.notes] as [string, string]] : []),
  ]

  return (
    <main className="pt-24 pb-16 px-4">
      <div className="max-w-xl mx-auto">
        <nav className="text-xs text-gray-400 mb-6">
          <Link href="/">{tc('breadcrumbHome')}</Link> &gt; {t('title')}
        </nav>
        <h1 className="text-3xl font-serif text-navy mb-1">{t('title')}</h1>
        <p className="text-gray-500 text-sm mb-8">{t('intro')}</p>

        {step === 'input' && (
          <form onSubmit={goToConfirm} className="space-y-5">
            {/* 種別 */}
            <div>
              <label className="admin-label">{t('typeLabel')}</label>
              <div className="grid grid-cols-2 gap-2">
                {TYPES.map(type => (
                  <label key={type.value} className={`border rounded-lg p-3 cursor-pointer transition-colors
                    ${form.type === type.value ? 'border-navy bg-navy/5' : 'border-gray-200 hover:border-navy/40'}`}>
                    <input type="radio" name="type" value={type.value} className="sr-only"
                      checked={form.type === type.value}
                      onChange={() => setForm(f => ({ ...f, type: type.value, date: '', time_slot: '' }))} />
                    <p className="font-medium text-navy text-sm">{type.label}</p>
                    <p className="text-xs text-gold">{type.price}</p>
                  </label>
                ))}
              </div>
            </div>

            {/* 御祈願の内容(護摩祈願選択時のみ) */}
            {form.type === 'prayer' && (
              <div>
                <label className="admin-label">{t('purposeLabel')}</label>
                <div className="grid grid-cols-2 gap-2">
                  {PURPOSES.map(p => (
                    <label key={p.value} className={`border rounded-lg p-3 cursor-pointer transition-colors
                      ${purpose === p.value ? 'border-navy bg-navy/5' : 'border-gray-200 hover:border-navy/40'}`}>
                      <input type="radio" name="purpose" value={p.value} className="sr-only"
                        checked={purpose === p.value}
                        onChange={() => setPurpose(p.value)} />
                      <p className="font-medium text-navy text-sm">{p.label}</p>
                    </label>
                  ))}
                </div>
                {purpose === 'other' && (
                  <p className="text-xs text-gold mt-2">{t('purposeOtherNote')}</p>
                )}
              </div>
            )}

            {/* カレンダー・時間帯 */}
            <div>
              <label className="admin-label">{t('dateLabel')}</label>
              <ReservationCalendar
                reservationType={form.type}
                selectedDate={form.date}
                selectedTime={form.time_slot}
                onSelectSlot={(date, time) => setForm(f => ({ ...f, date, time_slot: time }))}
              />
            </div>

            {/* 坐禅はWeb予約自体を受け付けない（カレンダーの案内どおり電話予約のみ）ため、
                人数以降の入力欄・送信ボタンは表示しない */}
            {form.type !== 'zazen' && (
              <>
                {/* 人数 */}
                <div>
                  <label className="admin-label">{t('partySizeLabel')}</label>
                  <input type="number" min={1} max={20} required className="admin-input w-24" value={form.party_size}
                    onChange={e => setForm({...form, party_size: Number(e.target.value)})} />
                  <span className="text-sm text-gray-500 ml-2">{t('partySizeUnit')}</span>
                </div>

                {/* 氏名 */}
                <div className={showNameKana ? 'grid grid-cols-2 gap-4' : ''}>
                  <div>
                    <label className="admin-label">{t('nameLabel')}</label>
                    <input required className="admin-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                  </div>
                  {showNameKana && (
                    <div>
                      <label className="admin-label">{t('nameKanaLabel')}</label>
                      <input required className="admin-input" value={form.name_kana} onChange={e => setForm({...form, name_kana: e.target.value})} />
                    </div>
                  )}
                </div>

                <div>
                  <label className="admin-label">{t('emailLabel')}</label>
                  <input type="email" required className="admin-input" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                </div>
                <div>
                  <label className="admin-label">{t('phoneLabel')}</label>
                  <input type="tel" required className="admin-input" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                </div>
                <div>
                  <label className="admin-label">{t('notesLabel')}</label>
                  <textarea className="admin-input min-h-[80px]" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
                </div>

                <button type="submit"
                  disabled={!form.date || !form.time_slot}
                  className="btn-primary w-full text-center disabled:opacity-50">
                  {t('goToConfirm')}
                </button>
              </>
            )}
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
            {status === 'error' && <p className="text-red-600 text-sm">{t('submitError')}</p>}
            <div className="flex gap-3">
              <button type="button" onClick={backToInput} disabled={status === 'loading'}
                className="flex-1 border border-navy text-navy rounded-full py-3 text-sm hover:bg-navy/5 transition-colors disabled:opacity-50">
                {t('backButton')}
              </button>
              <button type="button" onClick={handleConfirmClick} disabled={status === 'loading'}
                className="flex-1 btn-primary text-center disabled:opacity-50">
                {status === 'loading' ? t('submitting') : t('confirmSubmit')}
              </button>
            </div>
            <p className="text-xs text-gray-400 text-center">
              {t('submitNote')}
            </p>
          </div>
        )}

        {/* 護摩祈願のみ：送信前の受付時間案内ポップアップ */}
        {showGomaNotice && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setShowGomaNotice(false)}
          >
            <div
              className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 text-center"
              onClick={e => e.stopPropagation()}
            >
              <p className="text-sm text-gray-700 leading-relaxed mb-6">
                {t('gomaNoticeText')}
              </p>
              <button
                type="button"
                onClick={acknowledgeGomaNotice}
                disabled={status === 'loading'}
                className="btn-primary text-sm px-10 py-2 disabled:opacity-50"
              >
                {status === 'loading' ? t('submitting') : t('gomaNoticeButton')}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
