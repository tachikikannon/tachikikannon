'use client'
import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ReservationCalendar from '@/components/ReservationCalendar'
import { createClient } from '@/lib/supabase'
import type { ReservationType } from '@/types'

const TYPES: { value: ReservationType; label: string; price: string }[] = [
  { value: 'prayer',   label: '護摩祈願',  price: '5,000円〜' },
  { value: 'shakyou',  label: '写経',      price: '1,000円' },
  { value: 'shabutu',  label: '写仏',      price: '1,000円' },
  { value: 'jyuzu',    label: '数珠づくり', price: '2,000円〜' },
]

const TIME_SLOTS = ['9:00','9:30','10:00','10:30','11:00','11:30']

export default function ReservePage() {
  const supabase = createClient()
  const [form, setForm] = useState({
    type: 'prayer' as ReservationType,
    date: '', time_slot: TIME_SLOTS[0],
    name: '', name_kana: '', email: '', phone: '',
    party_size: 1, notes: '',
  })
  const [status, setStatus] = useState<'idle'|'loading'|'done'|'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    const { error } = await supabase.from('reservations').insert({ ...form, status: 'pending' })
    if (error) { setStatus('error'); return }
    // メール通知（失敗してもフォーム送信は成功扱い）
    await fetch('/api/notify/reservation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    }).catch(() => {})
    setStatus('done')
  }

  if (status === 'done') return (
    <>
      <Header />
      <main className="min-h-screen pt-24 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <p className="text-5xl mb-4">🙏</p>
          <h1 className="text-2xl font-serif text-navy mb-3">ご予約を受け付けました</h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            後ほどお寺よりご連絡いたします。<br />
            確認まで数日お待ちいただく場合がございます。
          </p>
        </div>
      </main>
      <Footer />
    </>
  )

  return (
    <>
      <Header />
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-xl mx-auto">
          <nav className="text-xs text-gray-400 mb-6">
            <a href="/">ホーム</a> &gt; 予約
          </nav>
          <h1 className="text-3xl font-serif text-navy mb-1">体験・御祈願のご予約</h1>
          <p className="text-gray-500 text-sm mb-8">ご希望の種別・日時をお選びください。</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 種別 */}
            <div>
              <label className="admin-label">ご予約の種別</label>
              <div className="grid grid-cols-2 gap-2">
                {TYPES.map(t => (
                  <label key={t.value} className={`border rounded-lg p-3 cursor-pointer transition-colors
                    ${form.type === t.value ? 'border-navy bg-navy/5' : 'border-gray-200 hover:border-navy/40'}`}>
                    <input type="radio" name="type" value={t.value} className="sr-only"
                      checked={form.type === t.value} onChange={() => setForm({...form, type: t.value})} />
                    <p className="font-medium text-navy text-sm">{t.label}</p>
                    <p className="text-xs text-gold">{t.price}</p>
                  </label>
                ))}
              </div>
            </div>

            {/* カレンダー・時間帯 */}
            <div>
              <label className="admin-label">ご希望日・時間帯</label>
              <ReservationCalendar
                reservationType={form.type}
                selectedDate={form.date}
                selectedTime={form.time_slot}
                onSelectDate={date => setForm({ ...form, date, time_slot: '' })}
                onSelectTime={time => setForm({ ...form, time_slot: time })}
              />
              {form.date && form.time_slot && (
                <p className="mt-2 text-sm text-green-700 bg-green-50 rounded px-3 py-2">
                  ✓ {new Date(form.date + 'T00:00:00').toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })} {form.time_slot} を選択中
                </p>
              )}
            </div>

            {/* 人数 */}
            <div>
              <label className="admin-label">参加人数</label>
              <input type="number" min={1} max={20} required className="admin-input w-24" value={form.party_size}
                onChange={e => setForm({...form, party_size: Number(e.target.value)})} />
              <span className="text-sm text-gray-500 ml-2">名</span>
            </div>

            {/* 氏名 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="admin-label">お名前</label>
                <input required className="admin-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              <div>
                <label className="admin-label">フリガナ</label>
                <input required className="admin-input" value={form.name_kana} onChange={e => setForm({...form, name_kana: e.target.value})} />
              </div>
            </div>

            <div>
              <label className="admin-label">メールアドレス</label>
              <input type="email" required className="admin-input" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            </div>
            <div>
              <label className="admin-label">電話番号</label>
              <input type="tel" required className="admin-input" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
            </div>
            <div>
              <label className="admin-label">備考（任意）</label>
              <textarea className="admin-input min-h-[80px]" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
            </div>

            {status === 'error' && <p className="text-red-600 text-sm">送信に失敗しました。しばらく経ってから再度お試しください。</p>}

            <button type="submit"
              disabled={status === 'loading' || !form.date || !form.time_slot}
              className="btn-primary w-full text-center disabled:opacity-50">
              {status === 'loading' ? '送信中...' : '予約を申し込む'}
            </button>
            <p className="text-xs text-gray-400 text-center">
              ご予約はお寺からの確認をもって成立となります。
            </p>
          </form>
        </div>
      </main>
      <Footer />
    </>
  )
}
