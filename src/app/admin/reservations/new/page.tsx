'use client'
import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { useAdminProfile } from '@/lib/useAdminProfile'
import AdminSlotPicker from '@/components/admin/AdminSlotPicker'
import type { ReservationCategory, ReservationStatus, ReservationType } from '@/types'

const TYPES: { value: ReservationType; label: string }[] = [
  { value: 'prayer',  label: '護摩祈願' },
  { value: 'shakyou', label: '写経' },
  { value: 'shabutu', label: '写仏' },
  { value: 'jyuzu',   label: '数珠づくり' },
  { value: 'zazen',   label: '坐禅' },
]
const NEW_RESERVATION_DEFAULTS = {
  type: 'prayer' as ReservationType,
  date: '', time_slot: '',
  name: '', name_kana: '', email: '', phone: '',
  party_size: 1, notes: '', status: 'confirmed' as ReservationStatus,
  category_id: '' as string,
}
const STATUS_LABELS: Record<ReservationStatus, string> = {
  unconfirmed: '未確認',
  pending: '未確認',
  provisional: '仮予約',
  in_progress: '対応中',
  confirmed: '予約確定',
  completed: '完了',
  cancelled: 'キャンセル',
}
const STATUS_OPTIONS: ReservationStatus[] = ['unconfirmed', 'provisional', 'in_progress', 'confirmed', 'completed', 'cancelled']

function NewReservationForm() {
  const supabase = createClient()
  const { canEditReservations: canEdit } = useAdminProfile()
  const searchParams = useSearchParams()
  // 予約スケジュール画面で選んだ日付から遷移してきた場合、その日付を引き継ぐ
  const initialDateParam = searchParams.get('date') ?? ''
  const [categories, setCategories] = useState<ReservationCategory[]>([])
  const [newRes, setNewRes] = useState({ ...NEW_RESERVATION_DEFAULTS, date: initialDateParam })
  const [createError, setCreateError] = useState<string | null>(null)
  const [createSaving, setCreateSaving] = useState(false)
  const [ritsWarning, setRitsWarning] = useState<string | null>(null)
  const [justAdded, setJustAdded] = useState<{ date: string; time_slot: string; name: string } | null>(null)

  async function load() {
    const { data: categoryData } = await supabase.from('reservation_categories').select('*').order('sort_order')
    setCategories(categoryData ?? [])
    // 職員が直接追加する予約は「一般予約（予約サイト）」以外の区分をデフォルトにする
    const defaultCategory = (categoryData ?? []).find(c => !c.is_default) ?? categoryData?.[0]
    setNewRes(f => ({ ...f, category_id: defaultCategory?.id ?? '' }))
  }
  useEffect(() => { load() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // リッツの予約を入力しようとしている時、その同時刻にリッツ以外の数珠づくり・
  // 護摩祈願が両方とも既に入っている場合は、リッツ用の枠が確保できないため
  // 入力時に忠告文を出す（送信自体は止めない）。
  useEffect(() => {
    const ritsCategoryId = categories.find(c => c.name.includes('リッツ'))?.id
    if (!ritsCategoryId || newRes.category_id !== ritsCategoryId || !newRes.date || !newRes.time_slot) {
      setRitsWarning(null)
      return
    }
    supabase.from('reservations').select('type,category_id')
      .eq('date', newRes.date).eq('time_slot', newRes.time_slot)
      .in('type', ['jyuzu', 'prayer'])
      .then(({ data }) => {
        const others = (data ?? []).filter(r => r.category_id !== ritsCategoryId)
        const hasJyuzu = others.some(r => r.type === 'jyuzu')
        const hasPrayer = others.some(r => r.type === 'prayer')
        setRitsWarning(hasJyuzu && hasPrayer
          ? 'リッツ予約不可（この時間帯はリッツ以外の数珠づくり・護摩祈願が両方とも入っているため、リッツの枠を確保できません）'
          : null)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newRes.category_id, newRes.date, newRes.time_slot, categories])

  async function submitCreate() {
    if (!newRes.date || !newRes.time_slot) {
      setCreateError('日時を選択してください。')
      return
    }
    setCreateSaving(true)
    setCreateError(null)
    const { error } = await supabase.from('reservations')
      .insert({ ...newRes, category_id: newRes.category_id || null, id: crypto.randomUUID() })
    setCreateSaving(false)
    if (error) { setCreateError('登録に失敗しました：' + error.message); return }
    setJustAdded({ date: newRes.date, time_slot: newRes.time_slot, name: newRes.name })
    // 種別・区分は続けやすいよう保持し、日時とお客様情報だけリセットして次の登録に備える
    setNewRes(f => ({ ...NEW_RESERVATION_DEFAULTS, type: f.type, category_id: f.category_id }))
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-1 flex-wrap gap-3">
        <h1 className="text-2xl font-serif text-navy">新規予約登録</h1>
        <div className="flex items-center gap-4">
          <Link href="/admin/reservations/schedule" className="text-sm text-navy underline">予約スケジュールを見る →</Link>
          <Link href="/admin/reservations" className="text-sm text-navy underline">予約一覧を見る →</Link>
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        枠をクリックすると、予約の追加とその場での受付停止／再開が選べます。定員や確保枠などの詳細な設定は「空き状況の詳細設定」で行ってください。
        {initialDateParam && <span className="block text-navy mt-1">予約スケジュールから：{initialDateParam} の週を表示しています。</span>}
      </p>

      {!canEdit && (
        <p className="text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          閲覧のみのアカウントです。予約の登録は管理者にご依頼ください。
        </p>
      )}

      <div className="bg-white rounded-xl shadow p-5">
        <div className="mb-4">
          <label className="admin-label">種別</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {TYPES.map(t => (
              <label key={t.value} className={`border rounded-lg p-2.5 cursor-pointer text-sm transition-colors
                ${newRes.type === t.value ? 'border-navy bg-navy/5 font-medium' : 'border-gray-200 hover:border-navy/40'}`}>
                <input type="radio" name="new-type" value={t.value} className="sr-only"
                  checked={newRes.type === t.value}
                  onChange={() => setNewRes(f => ({ ...f, type: t.value, date: '', time_slot: '' }))} />
                {t.label}
              </label>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="admin-label">区分</label>
          <select className="admin-input" value={newRes.category_id}
            onChange={e => setNewRes(f => ({ ...f, category_id: e.target.value }))}>
            <option value="">区分なし</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div className="mb-4">
          <label className="admin-label">日時</label>
          <AdminSlotPicker
            reservationType={newRes.type}
            selectedDate={newRes.date}
            selectedTime={newRes.time_slot}
            onSelectSlot={(date, time_slot) => setNewRes(f => ({ ...f, date, time_slot }))}
            initialDate={initialDateParam || undefined}
          />
          {newRes.date && newRes.time_slot && (
            <p className="text-xs text-navy bg-navy/5 rounded px-2 py-1.5 mt-2">
              選択中：{newRes.date} {newRes.time_slot}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="admin-label">参加人数</label>
          <input type="number" min={1} className="admin-input w-24"
            value={newRes.party_size}
            onChange={e => setNewRes(f => ({ ...f, party_size: Number(e.target.value) }))} />
          <span className="text-sm text-gray-500 ml-2">名</span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="admin-label">お名前</label>
            <input className="admin-input" value={newRes.name}
              onChange={e => setNewRes(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div>
            <label className="admin-label">フリガナ</label>
            <input className="admin-input" value={newRes.name_kana}
              onChange={e => setNewRes(f => ({ ...f, name_kana: e.target.value }))} />
          </div>
        </div>
        <div className="mb-4">
          <label className="admin-label">メールアドレス</label>
          <input type="email" className="admin-input" value={newRes.email}
            onChange={e => setNewRes(f => ({ ...f, email: e.target.value }))} />
        </div>
        <div className="mb-4">
          <label className="admin-label">電話番号</label>
          <input type="tel" className="admin-input" value={newRes.phone}
            onChange={e => setNewRes(f => ({ ...f, phone: e.target.value }))} />
        </div>
        <div className="mb-4">
          <label className="admin-label">備考（任意）</label>
          <textarea className="admin-input min-h-[70px]" value={newRes.notes}
            onChange={e => setNewRes(f => ({ ...f, notes: e.target.value }))} />
        </div>
        <div className="mb-5">
          <label className="admin-label">状態</label>
          <select className="admin-input" value={newRes.status}
            onChange={e => setNewRes(f => ({ ...f, status: e.target.value as ReservationStatus }))}>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
          </select>
          <p className="text-[11px] text-gray-400 mt-1">電話等で直接受けた予約は「予約確定」のままで問題ありません。</p>
        </div>

        {ritsWarning && (
          <p className="text-amber-700 bg-amber-50 border border-amber-200 rounded-lg text-sm p-3 mb-3">
            ⚠️ {ritsWarning}
          </p>
        )}

        {createError && <p className="text-red-600 text-sm mb-3">{createError}</p>}

        {justAdded && (
          <p className="text-green-700 bg-green-50 border border-green-200 rounded-lg text-sm p-3 mb-3">
            ✓ {justAdded.date} {justAdded.time_slot} に{justAdded.name ? `「${justAdded.name}」様の` : ''}予約を登録しました。続けて別の予約を登録できます。
          </p>
        )}

        <button onClick={submitCreate} disabled={createSaving || !canEdit} className="btn-primary w-full text-center disabled:opacity-50">
          {createSaving ? '登録中...' : 'この内容で予約を追加'}
        </button>
      </div>
    </div>
  )
}

export default function AdminNewReservationPage() {
  return (
    <Suspense fallback={null}>
      <NewReservationForm />
    </Suspense>
  )
}
