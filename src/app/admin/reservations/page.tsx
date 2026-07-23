'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useAdminProfile } from '@/lib/useAdminProfile'
import type { AdminProfile, Reservation, ReservationStatus } from '@/types'

const TYPE_LABELS: Record<string, string> = {
  prayer: '護摩祈願', shakyou: '写経', shabutu: '写仏', jyuzu: '数珠づくり'
}
const STATUS_LABELS: Record<ReservationStatus, string> = {
  unconfirmed: '未確認',
  pending: '未確認',
  in_progress: '対応中',
  confirmed: '確認済み',
  completed: '完了',
  cancelled: 'キャンセル',
}
const STATUS_COLORS: Record<ReservationStatus, string> = {
  unconfirmed: 'bg-yellow-100 text-yellow-700',
  pending: 'bg-yellow-100 text-yellow-700',
  in_progress: 'bg-blue-100 text-blue-700',
  confirmed: 'bg-green-100 text-green-700',
  completed: 'bg-gray-200 text-gray-600',
  cancelled: 'bg-gray-100 text-gray-500',
}
const FILTERS: ReservationStatus[] = ['unconfirmed', 'in_progress', 'confirmed', 'completed', 'cancelled']
const STATUS_OPTIONS: ReservationStatus[] = ['unconfirmed', 'in_progress', 'confirmed', 'completed', 'cancelled']

export default function AdminReservationsPage() {
  const supabase = createClient()
  const { canEditReservations: canEdit } = useAdminProfile()
  const [list, setList] = useState<Reservation[]>([])
  const [admins, setAdmins] = useState<AdminProfile[]>([])
  const [detail, setDetail] = useState<Reservation | null>(null)
  const [filter, setFilter] = useState<string>('all')

  async function load() {
    const query = supabase.from('reservations').select('*').order('date').order('created_at', { ascending: false })
    const { data } = await query
    setList(data ?? [])
    const { data: adminData } = await supabase.from('admin_profiles').select('*').eq('is_active', true)
    setAdmins(adminData ?? [])
  }
  useEffect(() => { load() }, [])

  async function updateStatus(id: string, status: ReservationStatus) {
    await supabase.from('reservations').update({ status }).eq('id', id)
    load()
    if (detail?.id === id) setDetail({ ...detail, status })
  }

  async function updateAssignee(id: string, assigned_admin_id: string) {
    await supabase.from('reservations').update({ assigned_admin_id: assigned_admin_id || null }).eq('id', id)
    load()
    if (detail?.id === id) setDetail({ ...detail, assigned_admin_id: assigned_admin_id || null })
  }

  const adminName = (id: string | null) => admins.find(a => a.id === id)?.name || '未割当'

  const filtered = filter === 'all' ? list : list.filter(r => r.status === filter || (filter === 'unconfirmed' && r.status === 'pending'))

  return (
    <div className="p-8">
      <h1 className="text-2xl font-serif text-navy mb-6">予約管理</h1>

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

      <div className="grid lg:grid-cols-3 gap-4">
        {/* 一覧 */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-xs text-gray-500">日付</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500">種別</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500">お名前</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500">担当者</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500">状態</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500">更新日時</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(r => (
                <tr key={r.id} onClick={() => setDetail(r)}
                  className="hover:bg-blue-50 cursor-pointer">
                  <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                    {new Date(r.date).toLocaleDateString('ja-JP')}<br/>
                    <span className="text-gray-400">{r.time_slot}</span>
                  </td>
                  <td className="px-4 py-3 text-xs">{TYPE_LABELS[r.type]}</td>
                  <td className="px-4 py-3 font-medium">{r.name}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{adminName(r.assigned_admin_id)}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${STATUS_COLORS[r.status]}`}>{STATUS_LABELS[r.status]}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                    {r.updated_at ? new Date(r.updated_at).toLocaleString('ja-JP') : '—'}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400 text-sm">予約がありません</td></tr>}
            </tbody>
          </table>
        </div>

        {/* 詳細 */}
        {detail && (
          <div className="bg-white rounded-xl shadow p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium text-navy">予約詳細</h2>
              <button onClick={() => setDetail(null)} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
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
              <p className="text-xs text-gray-500 mb-2">担当者</p>
              <select className="admin-input text-sm" value={detail.assigned_admin_id ?? ''} disabled={!canEdit}
                onChange={e => updateAssignee(detail.id, e.target.value)}>
                <option value="">未割当</option>
                {admins.map(a => <option key={a.id} value={a.id}>{a.name || a.email}</option>)}
              </select>
            </div>

            <div className="mt-5 border-t pt-4">
              <p className="text-xs text-gray-500 mb-2">ステータス変更</p>
              <div className="flex gap-2 flex-wrap">
                {STATUS_OPTIONS.map(s => (
                  <button key={s} onClick={() => updateStatus(detail.id, s)}
                    disabled={!canEdit || detail.status === s}
                    className={`text-xs px-3 py-1.5 rounded font-medium transition-colors disabled:opacity-40
                      ${STATUS_COLORS[s]}`}>
                    {STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
              {!canEdit && <p className="text-[11px] text-gray-400 mt-2">閲覧のみのアカウントです。変更は管理者にご依頼ください。</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
