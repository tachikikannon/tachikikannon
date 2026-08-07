'use client'
import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import ReservationCalendar from '@/components/ReservationCalendar'
import { createClient } from '@/lib/supabase'
import type { ReservationType } from '@/types'

export default function ReserveForm() {
  const supabase = createClient()
  const t = useTranslations('reserve')
  const tc = useTranslations('common')
  const locale = useLocale()
  // フリガナは日本語話者向けの慣習で、外国語話者には該当しないため日本語以外では欄自体を出さない。
  const showNameKana = locale === 'ja'

  const TYPES: { value: ReservationType; label: string; price: string }[] = [
    { value: 'prayer',   label: t('typePrayer'),  price: '5,000円〜' },
    { value: 'shakyou',  label: t('typeShakyou'),      price: '1,000円' },
    { value: 'shabutu',  label: t('typeShabutu'),      price: '1,000円' },
    { value: 'jyuzu',    label: t('typeJyuzu'), price: '2,000円〜' },
  ]

  const PURPOSES: { value: string; label: string }[] = [
    { value: 'gokigan',      label: t('purposeGokigan') },
    { value: 'anzan',        label: t('purposeAnzan') },
    { value: 'shichigosan',  label: t('purposeShichigosan') },
    { value: 'other',        label: t('purposeOther') },
  ]

  const [form, setForm] = useState({
    type: 'prayer' as ReservationType,
    date: '', time_slot: '',
    name: '', name_kana: '', email: '', phone: '',
    party_size: 1, notes: '',
  })
  const [purpose, setPurpose] = useState('gokigan')
  const [status, setStatus] = useState<'idle'|'loading'|'done'|'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
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
      .insert({ ...submission, id, status: 'unconfirmed', category_id: defaultCategory?.id ?? null })
    if (error) { setStatus('error'); return }
    // メール・LINE通知（失敗してもフォーム送信は成功扱い）
    await fetch('/api/notify/reservation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...submission, id, locale }),
    }).catch(() => {})
    setStatus('done')
  }

  if (status === 'done') return (
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

  return (
    <main className="pt-24 pb-16 px-4">
      <div className="max-w-xl mx-auto">
        <nav className="text-xs text-gray-400 mb-6">
          <Link href="/">{tc('breadcrumbHome')}</Link> &gt; {t('title')}
        </nav>
        <h1 className="text-3xl font-serif text-navy mb-1">{t('title')}</h1>
        <p className="text-gray-500 text-sm mb-8">{t('intro')}</p>

        <form onSubmit={handleSubmit} className="space-y-5">
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

          {status === 'error' && <p className="text-red-600 text-sm">{t('submitError')}</p>}

          <button type="submit"
            disabled={status === 'loading' || !form.date || !form.time_slot}
            className="btn-primary w-full text-center disabled:opacity-50">
            {status === 'loading' ? t('submitting') : t('submit')}
          </button>
          <p className="text-xs text-gray-400 text-center">
            {t('submitNote')}
          </p>
        </form>
      </div>
    </main>
  )
}
