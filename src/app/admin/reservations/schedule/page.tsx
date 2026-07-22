'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import type { Reservation, ReservationStatus } from '@/types'

const TYPE_LABELS: Record<string, string> = {
  prayer: '護摩祈願', shakyou: '写経', shabutu: '写仏', jyuzu: '数珠づくり'
}
const STATUS_LABELS: Record<ReservationStatus, string> = {
  unconfirmed: '未確認', pending: '未確認', in_progress: '対応中', confirmed: '確認済み', completed: '完了', cancelled: 'キャンセル'
}

function todayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

function timeSlotValue(slot: string) {
  if (slot === '午前') return -2
  if (slot === '午後') return -1
  const m = slot.match(/^(\d+):(\d+)/)
  return m ? Number(m[1]) * 60 + Number(m[2]) : 999
}

export default function AdminReservationSchedulePage() {
  const supabase = createClient()
  const [date, setDate] = useState(todayStr())
  const [list, setList] = useState<Reservation[]>([])
  const [showCancelled, setShowCancelled] = useState(false)

  useEffect(() => {
    supabase.from('reservations').select('*').eq('date', date)
      .then(({ data }) => setList(data ?? []))
  }, [date])

  const filtered = list
    .filter(r => showCancelled || r.status !== 'cancelled')
    .sort((a, b) => timeSlotValue(a.time_slot) - timeSlotValue(b.time_slot))

  const dateLabel = new Date(date + 'T00:00:00').toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' })

  return (
    <div className="p-8 print:p-0">
      <div className="print:hidden flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-serif text-navy">予約スケジュール</h1>
        <div className="flex items-center gap-3">
          <input type="date" value={date} onChange={e => setDate(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm" />
          <label className="flex items-center gap-1.5 text-xs text-gray-600">
            <input type="checkbox" checked={showCancelled} onChange={e => setShowCancelled(e.target.checked)} />
            キャンセル分も表示
          </label>
          <button onClick={() => window.print()} className="btn-primary text-sm px-4 py-2">
            🖨 印刷
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow print:shadow-none print:rounded-none overflow-hidden">
        <div className="p-5 print:p-2 border-b">
          <h2 className="text-xl font-serif text-navy">{dateLabel}　予約スケジュール</h2>
          <p className="text-xs text-gray-400 mt-1">合計 {filtered.length} 件</p>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 print:bg-white">
            <tr>
              <th className="text-left px-4 py-3 text-xs text-gray-500 border-b">時間</th>
              <th className="text-left px-4 py-3 text-xs text-gray-500 border-b">種別</th>
              <th className="text-left px-4 py-3 text-xs text-gray-500 border-b">お名前（フリガナ）</th>
              <th className="text-left px-4 py-3 text-xs text-gray-500 border-b">人数</th>
              <th className="text-left px-4 py-3 text-xs text-gray-500 border-b">電話番号</th>
              <th className="text-left px-4 py-3 text-xs text-gray-500 border-b">備考</th>
              <th className="text-left px-4 py-3 text-xs text-gray-500 border-b print:hidden">状態</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(r => (
              <tr key={r.id}>
                <td className="px-4 py-3 whitespace-nowrap font-medium text-navy">{r.time_slot}</td>
                <td className="px-4 py-3 whitespace-nowrap">{TYPE_LABELS[r.type]}</td>
                <td className="px-4 py-3">{r.name}（{r.name_kana}）</td>
                <td className="px-4 py-3">{r.party_size}名</td>
                <td className="px-4 py-3 whitespace-nowrap">{r.phone}</td>
                <td className="px-4 py-3 text-xs text-gray-500">{r.notes || ''}</td>
                <td className="px-4 py-3 print:hidden">
                  <span className="badge bg-gray-100 text-gray-600">{STATUS_LABELS[r.status]}</span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-gray-400 text-sm">この日の予約はありません</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
