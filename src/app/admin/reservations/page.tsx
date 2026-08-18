'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { useAdminProfile } from '@/lib/useAdminProfile'
import { getTimeSlots } from '@/lib/reservationSlots'
import type { AdminProfile, Reservation, ReservationCategory, ReservationStatus } from '@/types'

type EditForm = {
  date: string; time_slot: string; name: string; name_kana: string
  email: string; phone: string; party_size: number; notes: string
}

const TYPE_LABELS: Record<string, string> = {
  prayer: '護摩祈願', shakyou: '写経', shabutu: '写仏', jyuzu: '数珠づくり', zazen: '坐禅'
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
  const router = useRouter()
  const { profile, canEditReservations: canEdit } = useAdminProfile()
  const [list, setList] = useState<Reservation[]>([])
  const [admins, setAdmins] = useState<AdminProfile[]>([])
  const [categories, setCategories] = useState<ReservationCategory[]>([])
  const [detail, setDetail] = useState<Reservation | null>(null)
  const [filter, setFilter] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [mailNotice, setMailNotice] = useState<string | null>(null)
  const [pendingStatus, setPendingStatus] = useState<ReservationStatus | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<EditForm | null>(null)
  const [saving, setSaving] = useState(false)

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
    setIsEditing(false)
    setEditForm(null)
  }

  function startEdit() {
    if (!detail) return
    setEditForm({
      date: detail.date, time_slot: detail.time_slot, name: detail.name, name_kana: detail.name_kana,
      email: detail.email, phone: detail.phone, party_size: detail.party_size, notes: detail.notes ?? '',
    })
    setIsEditing(true)
  }

  function cancelEdit() {
    setIsEditing(false)
    setEditForm(null)
  }

  async function saveEdit() {
    if (!detail || !editForm) return
    setSaving(true)
    const { error } = await supabase.from('reservations').update({
      date: editForm.date,
      time_slot: editForm.time_slot,
      name: editForm.name,
      name_kana: editForm.name_kana,
      email: editForm.email,
      phone: editForm.phone,
      party_size: editForm.party_size,
      notes: editForm.notes || null,
    }).eq('id', detail.id)
    setSaving(false)
    if (error) { alert('保存に失敗しました：' + error.message); return }
    setIsEditing(false)
    setDetail(d => d ? { ...d, ...editForm, notes: editForm.notes || null } : d)
    setEditForm(null)
    load()
  }

  async function updateStatus(id: string, status: ReservationStatus) {
    const target = list.find(r => r.id === id)
    await supabase.from('reservations').update({ status }).eq('id', id)
    load()
    if (detail?.id === id) setDetail(d => d ? { ...d, status } : d)
    router.refresh()

    if (status === 'confirmed' && target) {
      setMailNotice('確定メールを送信中…')
      fetch('/api/notify/reservation-confirmed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: target.name, email: target.email, type: target.type,
          date: target.date, time_slot: target.time_slot, party_size: target.party_size,
          locale: target.locale,
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
    const { data, error } = await supabase.from('reservations').delete().eq('id', id).select('id')
    if (error) { alert('削除に失敗しました：' + error.message); return }
    if (!data || data.length === 0) { alert('削除できませんでした（権限がない可能性があります）。管理者にご確認ください。'); return }
    setDetail(null)
    load()
  }

  const adminName = (id: string | null) => admins.find(a => a.id === id)?.name || '未割当'
  const categoryName = (id: string | null) => categories.find(c => c.id === id)?.name || '区分なし'

  const byStatus = filter === 'all' ? list : list.filter(r => r.status === filter || (filter === 'unconfirmed' && r.status === 'pending'))
  const searchQuery = search.trim().toLowerCase()
  const filtered = searchQuery === '' ? byStatus : byStatus.filter(r =>
    [r.name, r.name_kana, r.phone, r.email].some(v => v?.toLowerCase().includes(searchQuery))
  )

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-serif text-navy">予約管理</h1>
        {canEdit && (
          <Link href="/admin/reservations/new" className="btn-primary text-sm px-4 py-2">＋ 新規予約登録へ</Link>
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

      {/* 検索 */}
      <div className="mb-4 relative max-w-xs">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="お名前・フリガナ・電話番号・メールで検索"
          className="admin-input w-full pr-8 text-sm"
        />
        {search && (
          <button onClick={() => setSearch('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm">
            ✕
          </button>
        )}
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
                <th className="text-left px-4 py-3 text-xs text-gray-500">自動返信</th>
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
                    {r.auto_reply_sent
                      ? <span className="text-green-700">✉️ 送信済み</span>
                      : <span className="text-gray-300">—</span>}
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
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="px-4 py-8 text-center text-gray-400 text-sm">
                  {searchQuery ? '検索条件に一致する予約がありません' : '予約がありません'}
                </td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 詳細 */}
        {detail && (
          <div className="bg-white rounded-xl shadow p-5 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium text-navy">予約詳細</h2>
              <div className="flex items-center gap-3">
                {canEdit && !isEditing && <button onClick={startEdit} className="text-navy text-xs hover:underline">編集</button>}
                {canEdit && !isEditing && <button onClick={() => remove(detail.id)} className="text-red-500 text-xs hover:underline">削除</button>}
                <button onClick={() => openDetail(null)} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
              </div>
            </div>
            <dl className="space-y-3 text-sm">
              <div className="grid grid-cols-[6rem_1fr] gap-2">
                <dt className="text-gray-500 text-xs pt-0.5">種別</dt>
                <dd className="break-all">{TYPE_LABELS[detail.type]}</dd>
              </div>

              {isEditing && editForm ? (
                <>
                  <div className="grid grid-cols-[6rem_1fr] gap-2 items-center">
                    <dt className="text-gray-500 text-xs">日付</dt>
                    <dd>
                      <input type="date" className="admin-input w-full"
                        value={editForm.date}
                        onChange={e => setEditForm(f => f && { ...f, date: e.target.value })} />
                    </dd>
                  </div>
                  <div className="grid grid-cols-[6rem_1fr] gap-2 items-center">
                    <dt className="text-gray-500 text-xs">時間</dt>
                    <dd>
                      <select className="admin-input w-full"
                        value={editForm.time_slot}
                        onChange={e => setEditForm(f => f && { ...f, time_slot: e.target.value })}>
                        {(() => {
                          const month = new Date(editForm.date + 'T00:00:00').getMonth() + 1
                          const opts = getTimeSlots(detail.type, month)
                          return (opts.includes(editForm.time_slot) ? opts : [editForm.time_slot, ...opts])
                            .map(s => <option key={s} value={s}>{s}</option>)
                        })()}
                      </select>
                    </dd>
                  </div>
                  <div className="grid grid-cols-[6rem_1fr] gap-2 items-center">
                    <dt className="text-gray-500 text-xs">お名前</dt>
                    <dd>
                      <input className="admin-input w-full"
                        value={editForm.name}
                        onChange={e => setEditForm(f => f && { ...f, name: e.target.value })} />
                    </dd>
                  </div>
                  <div className="grid grid-cols-[6rem_1fr] gap-2 items-center">
                    <dt className="text-gray-500 text-xs">フリガナ</dt>
                    <dd>
                      <input className="admin-input w-full"
                        value={editForm.name_kana}
                        onChange={e => setEditForm(f => f && { ...f, name_kana: e.target.value })} />
                    </dd>
                  </div>
                  <div className="grid grid-cols-[6rem_1fr] gap-2 items-center">
                    <dt className="text-gray-500 text-xs">電話番号</dt>
                    <dd>
                      <input type="tel" className="admin-input w-full"
                        value={editForm.phone}
                        onChange={e => setEditForm(f => f && { ...f, phone: e.target.value })} />
                    </dd>
                  </div>
                  <div className="grid grid-cols-[6rem_1fr] gap-2 items-center">
                    <dt className="text-gray-500 text-xs">メール</dt>
                    <dd>
                      <input type="email" className="admin-input w-full"
                        value={editForm.email}
                        onChange={e => setEditForm(f => f && { ...f, email: e.target.value })} />
                    </dd>
                  </div>
                  <div className="grid grid-cols-[6rem_1fr] gap-2 items-center">
                    <dt className="text-gray-500 text-xs">人数</dt>
                    <dd>
                      <input type="number" min={1} className="admin-input w-24"
                        value={editForm.party_size}
                        onChange={e => setEditForm(f => f && { ...f, party_size: Number(e.target.value) })} />
                      <span className="text-xs text-gray-500 ml-1">名</span>
                    </dd>
                  </div>
                  <div className="grid grid-cols-[6rem_1fr] gap-2">
                    <dt className="text-gray-500 text-xs pt-0.5">備考</dt>
                    <dd>
                      <textarea className="admin-input w-full" rows={2}
                        value={editForm.notes}
                        onChange={e => setEditForm(f => f && { ...f, notes: e.target.value })} />
                    </dd>
                  </div>
                  <div className="flex items-center gap-3 pt-1">
                    <button onClick={saveEdit} disabled={saving} className="btn-primary text-xs px-4 py-1.5 disabled:opacity-50">
                      {saving ? '保存中...' : '保存する'}
                    </button>
                    <button onClick={cancelEdit} disabled={saving} className="text-xs text-gray-400 underline disabled:opacity-50">
                      キャンセル
                    </button>
                  </div>
                </>
              ) : (
                [
                  ['日付', new Date(detail.date).toLocaleDateString('ja-JP')],
                  ['時間', detail.time_slot],
                  ['お名前', detail.name],
                  ['フリガナ', detail.name_kana],
                  ['電話番号', detail.phone],
                  ['メール', detail.email],
                  ['人数', `${detail.party_size}名`],
                  ['備考', detail.notes || '—'],
                ].map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[6rem_1fr] gap-2">
                    <dt className="text-gray-500 text-xs pt-0.5">{k}</dt>
                    <dd className="break-all">{v}</dd>
                  </div>
                ))
              )}

              <div className="grid grid-cols-[6rem_1fr] gap-2">
                <dt className="text-gray-500 text-xs pt-0.5">更新日時</dt>
                <dd className="break-all">{detail.updated_at ? new Date(detail.updated_at).toLocaleString('ja-JP') : '—'}</dd>
              </div>
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
              <p className="text-xs text-gray-500 mb-2">自動返信メール（受付時）</p>
              {detail.auto_reply_sent
                ? <p className="text-sm text-green-700">✉️ 送信済み</p>
                : <p className="text-sm text-gray-400">✉️ 未送信</p>}
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
