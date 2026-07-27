'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useAdminProfile } from '@/lib/useAdminProfile'
import ReservationCalendar from '@/components/ReservationCalendar'
import type { AdminProfile, Reservation, ReservationCategory, ReservationStatus, ReservationType } from '@/types'

const TYPE_LABELS: Record<string, string> = {
  prayer: '護摩祈願', shakyou: '写経', shabutu: '写仏', jyuzu: '数珠づくり'
}
const TYPES: { value: ReservationType; label: string }[] = [
  { value: 'prayer',  label: '護摩祈願' },
  { value: 'shakyou', label: '写経' },
  { value: 'shabutu', label: '写仏' },
  { value: 'jyuzu',   label: '数珠づくり' },
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
const STATUS_COLORS: Record<ReservationStatus, string> = {
  unconfirmed: 'bg-yellow-100 text-yellow-700',
  pending: 'bg-yellow-100 text-yellow-700',
  provisional: 'bg-purple-100 text-purple-700',
  in_progress: 'bg-blue-100 text-blue-700',
  confirmed: 'bg-green-100 text-green-700',
  completed: 'bg-gray-200 text-gray-600',
  cancelled: 'bg-gray-100 text-gray-500',
}
const FILTERS: ReservationStatus[] = ['unconfirmed', 'provisional', 'in_progress', 'confirmed', 'completed', 'cancelled']
const STATUS_OPTIONS: ReservationStatus[] = ['unconfirmed', 'provisional', 'in_progress', 'confirmed', 'completed', 'cancelled']

export default function AdminReservationsPage() {
  const supabase = createClient()
  const { profile, canEditReservations: canEdit } = useAdminProfile()
  const [list, setList] = useState<Reservation[]>([])
  const [admins, setAdmins] = useState<AdminProfile[]>([])
  const [categories, setCategories] = useState<ReservationCategory[]>([])
  const [detail, setDetail] = useState<Reservation | null>(null)
  const [filter, setFilter] = useState<string>('all')
  const [mailNotice, setMailNotice] = useState<string | null>(null)
  const [pendingStatus, setPendingStatus] = useState<ReservationStatus | null>(null)
  const [creating, setCreating] = useState(false)
  const [newRes, setNewRes] = useState(NEW_RESERVATION_DEFAULTS)
  const [createError, setCreateError] = useState<string | null>(null)
  const [createSaving, setCreateSaving] = useState(false)

  async function load() {
    const query = supabase.from('reservations').select('*').order('date').order('created_at', { ascending: false })
    const { data } = await query
    setList(data ?? [])
    const { data: adminData } = await supabase.from('admin_profiles').select('*').eq('is_active', true)
    setAdmins(adminData ?? [])
    const { data: categoryData } = await supabase.from('reservation_categories').select('*').order('sort_order')
    setCategories(categoryData ?? [])
  }
  useEffect(() => { load() }, [])

  function openDetail(r: Reservation | null) {
    setDetail(r)
    setPendingStatus(null)
    setMailNotice(null)
    setCreating(false)
  }

  function openCreate() {
    setDetail(null)
    setCreateError(null)
    // 職員が直接追加する予約は「一般予約（予約サイト）」以外の区分をデフォルトにする
    const defaultCategory = categories.find(c => !c.is_default) ?? categories[0]
    setNewRes({ ...NEW_RESERVATION_DEFAULTS, category_id: defaultCategory?.id ?? '' })
    setCreating(true)
  }

  async function submitCreate() {
    if (!newRes.date || !newRes.time_slot || !newRes.name || !newRes.name_kana || !newRes.email || !newRes.phone) {
      setCreateError('日時・お名前・フリガナ・メール・電話番号は必須です。')
      return
    }
    setCreateSaving(true)
    setCreateError(null)
    const { error } = await supabase.from('reservations')
      .insert({ ...newRes, category_id: newRes.category_id || null, id: crypto.randomUUID() })
    setCreateSaving(false)
    if (error) { setCreateError('登録に失敗しました：' + error.message); return }
    setCreating(false)
    load()
  }

  async function updateStatus(id: string, status: ReservationStatus) {
    const target = list.find(r => r.id === id)
    await supabase.from('reservations').update({ status }).eq('id', id)
    load()
    if (detail?.id === id) setDetail(d => d ? { ...d, status } : d)

    if (status === 'confirmed' && target) {
      setMailNotice('確定メールを送信中…')
      fetch('/api/notify/reservation-confirmed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: target.name, email: target.email, type: target.type,
          date: target.date, time_slot: target.time_slot, party_size: target.party_size,
        }),
      })
        .then(res => res.json())
        .then(async data => {
          setMailNotice(data.ok ? '確定メールを送信しました' : '確定メールの送信に失敗しました')
          if (data.ok) {
            await supabase.from('reservations').update({ confirmation_email_sent: true }).eq('id', id)
            load()
            if (detail?.id === id) setDetail(d => d ? { ...d, confirmation_email_sent: true } : d)
          }
        })
        .catch(err => { console.error('confirm mail failed:', err); setMailNotice('確定メールの送信に失敗しました') })
    }
  }

  async function updateAssignee(id: string, assigned_admin_id: string) {
    await supabase.from('reservations').update({ assigned_admin_id: assigned_admin_id || null }).eq('id', id)
    load()
    if (detail?.id === id) setDetail(d => d ? { ...d, assigned_admin_id: assigned_admin_id || null } : d)
  }

  async function updateCategory(id: string, category_id: string) {
    await supabase.from('reservations').update({ category_id: category_id || null }).eq('id', id)
    load()
    if (detail?.id === id) setDetail(d => d ? { ...d, category_id: category_id || null } : d)
  }

  async function remove(id: string) {
    if (!confirm('この予約を削除しますか？削除すると元に戻せません。')) return
    await supabase.from('reservations').delete().eq('id', id)
    setDetail(null)
    load()
  }

  const adminName = (id: string | null) => admins.find(a => a.id === id)?.name || '未割当'
  const categoryName = (id: string | null) => categories.find(c => c.id === id)?.name || '区分なし'

  const filtered = filter === 'all' ? list : list.filter(r => r.status === filter || (filter === 'unconfirmed' && r.status === 'pending'))

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-serif text-navy">予約管理</h1>
        {canEdit && (
          <button onClick={openCreate} className="btn-primary text-sm px-4 py-2">＋ 新規予約を追加</button>
        )}
      </div>

      {/* フィルター */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <button onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded text-xs font-medium transition-colors
            ${filter === 'all' ? 'bg-navy text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'}`}>
          すべて<span className="ml-1">({list.length})</span>
        </button>
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors
              ${filter === f ? 'bg-navy text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'}`}>
            {STATUS_LABELS[f]}
            <span className="ml-1">({list.filter(r => r.status === f || (f === 'unconfirmed' && r.status === 'pending')).length})</span>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4 items-start">
        {/* 一覧 */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow overflow-y-auto lg:max-h-[calc(100vh-14rem)]">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="text-left px-4 py-3 text-xs text-gray-500">日付</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500">種別</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500">区分</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500">お名前</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500">担当者</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500">状態</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500">確定メール</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500">更新日時</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(r => (
                <tr key={r.id} onClick={() => openDetail(r)}
                  className="hover:bg-blue-50 cursor-pointer">
                  <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                    {new Date(r.date).toLocaleDateString('ja-JP')}<br/>
                    <span className="text-gray-400">{r.time_slot}</span>
                  </td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap">{TYPE_LABELS[r.type]}</td>
                  <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{categoryName(r.category_id)}</td>
                  <td className="px-4 py-3 font-medium whitespace-nowrap">{r.name}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{adminName(r.assigned_admin_id)}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${STATUS_COLORS[r.status]}`}>{STATUS_LABELS[r.status]}</span>
                  </td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap">
                    {r.confirmation_email_sent
                      ? <span className="text-green-700">✉️ 送信済み</span>
                      : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                    {r.updated_at ? new Date(r.updated_at).toLocaleString('ja-JP') : '—'}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400 text-sm">予約がありません</td></tr>}
            </tbody>
          </table>
        </div>

        {/* 新規予約フォーム */}
        {creating && (
          <div className="bg-white rounded-xl shadow p-5 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium text-navy">新規予約を追加</h2>
              <button onClick={() => setCreating(false)} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
            </div>

            <div className="mb-4">
              <label className="admin-label">種別</label>
              <div className="grid grid-cols-2 gap-2">
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
              <ReservationCalendar
                reservationType={newRes.type}
                selectedDate={newRes.date}
                selectedTime={newRes.time_slot}
                onSelectSlot={(date, time_slot) => setNewRes(f => ({ ...f, date, time_slot }))}
              />
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

            {createError && <p className="text-red-600 text-sm mb-3">{createError}</p>}

            <button onClick={submitCreate} disabled={createSaving} className="btn-primary w-full text-center disabled:opacity-50">
              {createSaving ? '登録中...' : 'この内容で予約を追加'}
            </button>
          </div>
        )}

        {/* 詳細 */}
        {detail && (
          <div className="bg-white rounded-xl shadow p-5 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium text-navy">予約詳細</h2>
              <div className="flex items-center gap-3">
                {canEdit && <button onClick={() => remove(detail.id)} className="text-red-500 text-xs hover:underline">削除</button>}
                <button onClick={() => openDetail(null)} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
              </div>
            </div>
            <dl className="space-y-3 text-sm">
              {[
                ['種別', TYPE_LABELS[detail.type]],
                ['日付', new Date(detail.date).toLocaleDateString('ja-JP')],
                ['時間', detail.time_slot],
                ['お名前', detail.name],
                ['フリガナ', detail.name_kana],
                ['電話番号', detail.phone],
                ['メール', detail.email],
                ['人数', `${detail.party_size}名`],
                ['備考', detail.notes || '—'],
                ['更新日時', detail.updated_at ? new Date(detail.updated_at).toLocaleString('ja-JP') : '—'],
              ].map(([k,v]) => (
                <div key={k} className="grid grid-cols-[6rem_1fr] gap-2">
                  <dt className="text-gray-500 text-xs pt-0.5">{k}</dt>
                  <dd className="break-all">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-5 border-t pt-4">
              <p className="text-xs text-gray-500 mb-2">区分</p>
              {canEdit ? (
                <select className="admin-input" value={detail.category_id ?? ''}
                  onChange={e => updateCategory(detail.id, e.target.value)}>
                  <option value="">区分なし</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              ) : (
                <span className="text-sm">{categoryName(detail.category_id)}</span>
              )}
            </div>

            <div className="mt-5 border-t pt-4">
              <p className="text-xs text-gray-500 mb-2">担当者</p>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm">{adminName(detail.assigned_admin_id)}</span>
                {canEdit && profile && detail.assigned_admin_id !== profile.id && (
                  <button onClick={() => updateAssignee(detail.id, profile.id)} className="text-xs text-navy underline">
                    自分を担当にする
                  </button>
                )}
                {canEdit && detail.assigned_admin_id && (
                  <button onClick={() => updateAssignee(detail.id, '')} className="text-xs text-gray-400 underline">
                    担当を外す
                  </button>
                )}
              </div>
            </div>

            <div className="mt-5 border-t pt-4">
              <p className="text-xs text-gray-500 mb-2">ステータス変更</p>
              <div className="flex gap-2 flex-wrap">
                {STATUS_OPTIONS.map(s => (
                  <button key={s} onClick={() => setPendingStatus(s)}
                    disabled={!canEdit || detail.status === s}
                    className={`text-xs px-3 py-1.5 rounded font-medium transition-colors disabled:opacity-40
                      ${STATUS_COLORS[s]} ${pendingStatus === s ? 'ring-2 ring-offset-1 ring-navy' : ''}`}>
                    {STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
              {pendingStatus && pendingStatus !== detail.status && (
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-gray-500">「{STATUS_LABELS[pendingStatus]}」に変更しますか？</span>
                  <button onClick={() => { updateStatus(detail.id, pendingStatus); setPendingStatus(null) }}
                    className="btn-primary text-xs px-3 py-1.5">確定する</button>
                  <button onClick={() => setPendingStatus(null)} className="text-xs text-gray-400 underline">キャンセル</button>
                </div>
              )}
              {!canEdit && <p className="text-[11px] text-gray-400 mt-2">閲覧のみのアカウントです。変更は管理者にご依頼ください。</p>}
              {mailNotice && <p className="text-[11px] text-gray-500 mt-2">✉️ {mailNotice}</p>}
            </div>

            <div className="mt-5 border-t pt-4">
              <p className="text-xs text-gray-500 mb-2">確定メール</p>
              {detail.confirmation_email_sent
                ? <p className="text-sm text-green-700">✉️ お客様に送信済みです</p>
                : <p className="text-sm text-gray-400">未送信（「予約確定」にすると自動送信されます）</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
