'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import type { Reservation, ReservationStatus } from '@/types'

const TYPE_LABELS: Record<string, string> = {
  prayer: '護摩祈願', shakyou: '写経', shabutu: '写仏', jyuzu: '数珠づくり'
}
const STATUS_LABELS: Record<ReservationStatus, string> = {
  pending: '未確認', confirmed: '確認済み', cancelled: 'キャンセル'
}
const STATUS_COLORS: Record<ReservationStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-gray-100 text-gray-500',
}

export default function AdminReservationsPage() {
  const supabase = createClient()
  const [list, setList] = useState<Reservation[]>([])
  const [detail, setDetail] = useState<Reservation | null>(null)
  const [filter, setFilter] = useState<string>('all')

  async function load() {
    const query = supabase.from('reservations').select('*').order('date').order('created_at', { ascending: false })
    const { data } = await query
    setList(data ?? [])
  }
  useEffect(() => { load() }, [])

  async function updateStatus(id: string, status: ReservationStatus) {
    await supabase.from('reservations').update({ status }).eq('id', id)
    load()
    if (detail?.id === id) setDetail({ ...detail, status })
  }

  const filtered = filter === 'all' ? list : list.filter(r => r.status === filter)

  return (
    <div className="p-8">
      <h1 className="text-2xl font-serif text-navy mb-6">予約管理</h1>

      {/* フィルター */}
      <div className="flex gap-2 mb-4">
        {['all','pending','confirmed','cancelled'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors
              ${filter === f ? 'bg-navy text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'}`}>
            {f === 'all' ? 'すべて' : STATUS_LABELS[f as ReservationStatus]}
            <span className="ml-1">({f === 'all' ? list.length : list.filter(r=>r.status===f).length})</span>
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
                <th className="text-left px-4 py-3 text-xs text-gray-500">状態</th>
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
                  <td className="px-4 py-3">
                    <span className={`badge ${STATUS_COLORS[r.status]}`}>{STATUS_LABELS[r.status]}</span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400 text-sm">予約がありません</td></tr>}
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
              ].map(([k,v]) => (
                <div key={k} className="grid grid-cols-[6rem_1fr] gap-2">
                  <dt className="text-gray-500 text-xs pt-0.5">{k}</dt>
                  <dd className="break-all">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-5 border-t pt-4">
              <p className="text-xs text-gray-500 mb-2">ステータス変更</p>
              <div className="flex gap-2 flex-wrap">
                {(['confirmed','cancelled','pending'] as ReservationStatus[]).map(s => (
                  <button key={s} onClick={() => updateStatus(detail.id, s)}
                    disabled={detail.status === s}
                    className={`text-xs px-3 py-1.5 rounded font-medium transition-colors disabled:opacity-40
                      ${s==='confirmed' ? 'bg-green-100 text-green-700 hover:bg-green-200'
                       : s==='cancelled' ? 'bg-red-100 text-red-700 hover:bg-red-200'
                       : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'}`}>
                    {STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
