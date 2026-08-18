'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { getTimeSlots, blockedDateMatchesType, parseSlotMinutes } from '@/lib/reservationSlots'
import type { ReservationType, SlotOverride } from '@/types'

type BlockedDate = { date: string; type: string; reason: string }
type Reservation = { date: string; time_slot: string; party_size: number }
type CapacitySetting = { max_groups: number; max_people: number; buffer_minutes: number }

function toDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
function getMonday(d: Date) {
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  const mon = new Date(d)
  mon.setDate(d.getDate() + diff)
  mon.setHours(0, 0, 0, 0)
  return mon
}

const DAY_LABELS = ['日', '月', '火', '水', '木', '金', '土']

interface Props {
  reservationType: ReservationType
  selectedDate: string
  selectedTime: string
  onSelectSlot: (date: string, time: string) => void
  /** 指定すると、週カレンダーの初期表示をこの日付を含む週にする（例：スケジュール画面で
      選択していた日をそのまま予約登録に引き継ぐ場合）。未指定なら今週を表示する */
  initialDate?: string
}

export default function AdminSlotPicker({ reservationType, selectedDate, selectedTime, onSelectSlot, initialDate }: Props) {
  const supabase = createClient()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [weekStart, setWeekStart] = useState(() => {
    if (initialDate) {
      const d = new Date(initialDate + 'T00:00:00')
      if (!isNaN(d.getTime())) return getMonday(d)
    }
    return getMonday(today)
  })
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [capacity, setCapacity] = useState<CapacitySetting | null>(null)
  const [overrides, setOverrides] = useState<SlotOverride[]>([])
  const [cell, setCell] = useState<{ date: string; slot: string } | null>(null)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart)
    d.setDate(weekStart.getDate() + i)
    return d
  })

  async function load() {
    const from = toDateStr(weekDays[0])
    const to = toDateStr(weekDays[6])
    const [{ data: bd }, { data: rs }, { data: cap }, { data: ov }] = await Promise.all([
      supabase.from('blocked_dates').select('date,type,reason').gte('date', from).lte('date', to),
      supabase.from('reservations').select('date,time_slot,party_size').eq('type', reservationType).gte('date', from).lte('date', to),
      supabase.from('capacity_settings').select('max_groups,max_people,buffer_minutes').eq('type', reservationType).single(),
      supabase.from('slot_overrides').select('*').eq('type', reservationType).gte('date', from).lte('date', to),
    ])
    setBlockedDates(bd ?? [])
    setReservations(rs ?? [])
    setCapacity(cap ?? { max_groups: 5, max_people: 20, buffer_minutes: 0 })
    setOverrides((ov ?? []) as SlotOverride[])
  }
  useEffect(() => { load(); setCell(null); setNotice(null) }, [weekStart, reservationType]) // eslint-disable-line react-hooks/exhaustive-deps

  function isDateBlocked(dateStr: string) {
    return blockedDates.find(b => b.date === dateStr && blockedDateMatchesType(b.type, reservationType)) ?? null
  }
  function getOverride(dateStr: string, slot: string) {
    return overrides.find(o => o.date === dateStr && o.time_slot === slot) ?? null
  }
  function getCounts(dateStr: string, slot: string) {
    const list = reservations.filter(r => r.date === dateStr && r.time_slot === slot)
    return { groups: list.length, people: list.reduce((sum, r) => sum + (r.party_size ?? 1), 0) }
  }

  // 前後バッファ（分）: 護摩祈祷など、実際の所要時間が枠の間隔より長い体験向け。
  // 既存予約の開始時刻からバッファ分数未満しか離れていない「別の」枠は、
  // 時間が重なるため予約不可にする（公開カレンダーのisSlotFullと同じロジック）。
  function isBufferBlocked(dateStr: string, slot: string) {
    return getBufferConflictSlots(dateStr, slot).length > 0
  }

  function getBufferConflictSlots(dateStr: string, slot: string): string[] {
    const bufferMinutes = capacity?.buffer_minutes ?? 0
    const slotMinutes = parseSlotMinutes(slot)
    if (bufferMinutes <= 0 || slotMinutes == null) return []
    const conflicting = reservations.filter(r => {
      if (r.date !== dateStr || r.time_slot === slot) return false
      const rMinutes = parseSlotMinutes(r.time_slot)
      return rMinutes != null && Math.abs(rMinutes - slotMinutes) < bufferMinutes
    })
    return Array.from(new Set(conflicting.map(r => r.time_slot)))
  }

  function prevWeek() { const d = new Date(weekStart); d.setDate(d.getDate() - 7); setWeekStart(d) }
  function nextWeek() { const d = new Date(weekStart); d.setDate(d.getDate() + 7); setWeekStart(d) }
  function goThisWeek() { setWeekStart(getMonday(today)) }

  const slots = Array.from(new Set(weekDays.flatMap(d => getTimeSlots(reservationType, d.getMonth() + 1))))

  async function closeSlot(date: string, slot: string) {
    setBusy(true)
    const existing = getOverride(date, slot)
    await supabase.from('slot_overrides').upsert({
      type: reservationType, date, time_slot: slot,
      is_closed: true,
      max_groups: existing?.max_groups ?? null,
      max_people: existing?.max_people ?? null,
      reserved_groups: existing?.reserved_groups ?? null,
      reserved_people: existing?.reserved_people ?? null,
      note: existing?.note ?? null,
    }, { onConflict: 'type,date,time_slot' })
    setBusy(false)
    setNotice('この枠を受付停止にしました')
    await load()
  }

  async function reopenSlot(date: string, slot: string) {
    setBusy(true)
    const existing = getOverride(date, slot)
    const hasOtherSettings = !!existing && (
      existing.max_groups != null || existing.max_people != null ||
      existing.reserved_groups != null || existing.reserved_people != null || !!existing.note
    )
    if (hasOtherSettings) {
      await supabase.from('slot_overrides').update({ is_closed: false })
        .eq('type', reservationType).eq('date', date).eq('time_slot', slot)
    } else {
      await supabase.from('slot_overrides').delete()
        .eq('type', reservationType).eq('date', date).eq('time_slot', slot)
    }
    setBusy(false)
    setNotice('この枠の受付を再開しました')
    await load()
  }

  const cellBlocked = cell ? isDateBlocked(cell.date) : null
  const cellOverride = cell ? getOverride(cell.date, cell.slot) : null
  const cellCounts = cell ? getCounts(cell.date, cell.slot) : null
  const cellMaxGroups = cell ? (cellOverride?.max_groups ?? capacity?.max_groups) : null
  const cellFull = cell && cellCounts && cellMaxGroups != null && cellCounts.groups >= cellMaxGroups
  const cellBufferBlocked = cell && !cellFull && isBufferBlocked(cell.date, cell.slot)

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <button type="button" onClick={prevWeek} className="text-xs px-2 py-1 border border-gray-200 rounded hover:border-navy transition-colors">← 前週</button>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">{weekDays[0].getMonth() + 1}/{weekDays[0].getDate()} 〜 {weekDays[6].getMonth() + 1}/{weekDays[6].getDate()}</span>
          <button type="button" onClick={goThisWeek} className="text-[11px] px-2 py-0.5 border border-gray-200 rounded hover:border-navy transition-colors">今週</button>
        </div>
        <button type="button" onClick={nextWeek} className="text-xs px-2 py-1 border border-gray-200 rounded hover:border-navy transition-colors">次週 →</button>
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr>
              <th className="w-14 border border-gray-200 bg-gray-50 px-1 py-1.5 text-gray-500">時間</th>
              {weekDays.map(d => {
                const dateStr = toDateStr(d)
                const isToday = dateStr === toDateStr(today)
                const dow = d.getDay()
                return (
                  <th key={dateStr} className={`border border-gray-200 px-1 py-1.5 text-center ${isToday ? 'bg-gold/10' : 'bg-gray-50'}`}>
                    <div className={`text-[10px] ${dow === 0 ? 'text-red-500' : dow === 6 ? 'text-blue-500' : 'text-gray-700'}`}>{DAY_LABELS[dow]}</div>
                    <div className={`text-sm font-bold ${dow === 0 ? 'text-red-500' : dow === 6 ? 'text-blue-500' : 'text-navy'}`}>{d.getDate()}</div>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {slots.map(slot => (
              <tr key={slot}>
                <td className="border border-gray-200 bg-gray-50 px-1 py-1.5 text-center text-gray-500 whitespace-nowrap">{slot}</td>
                {weekDays.map(d => {
                  const dateStr = toDateStr(d)
                  const validSlots = getTimeSlots(reservationType, d.getMonth() + 1)
                  if (!validSlots.includes(slot)) return <td key={dateStr} className="border border-gray-200 bg-gray-50" />
                  const blocked = isDateBlocked(dateStr)
                  const override = getOverride(dateStr, slot)
                  const counts = getCounts(dateStr, slot)
                  const maxGroups = override?.max_groups ?? capacity?.max_groups
                  const full = !blocked && !override?.is_closed && maxGroups != null && counts.groups >= maxGroups
                  const bufferBlocked = !blocked && !override?.is_closed && !full && isBufferBlocked(dateStr, slot)
                  const isSelected = selectedDate === dateStr && selectedTime === slot
                  const isCell = cell?.date === dateStr && cell?.slot === slot

                  let cls = 'hover:bg-navy/5 text-gray-600'
                  let content: React.ReactNode = maxGroups != null ? `${counts.groups}/${maxGroups}` : `${counts.groups}`
                  if (blocked) { cls = 'bg-gray-100 text-gray-400'; content = '休止(日)' }
                  else if (override?.is_closed) { cls = 'bg-red-50 text-red-500 font-medium'; content = '受付停止' }
                  else if (full) { cls = 'bg-gray-100 text-gray-400'; content = reservationType === 'prayer' ? '予約' : '満枠' }
                  else if (bufferBlocked) { cls = 'bg-violet-50 text-violet-600 font-medium'; content = '×' }
                  else if (override) { cls = 'bg-amber-50 text-amber-700 font-medium' }
                  if (isSelected) cls += ' ring-2 ring-navy'
                  if (isCell) cls += ' ring-2 ring-gold'

                  return (
                    <td key={dateStr} className="border border-gray-200 p-0.5 text-center">
                      <button type="button" onClick={() => { setCell({ date: dateStr, slot }); setNotice(null) }}
                        className={`w-full h-8 rounded flex items-center justify-center transition-all ${cls}`}>
                        {content}
                      </button>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {cell && (
        <div className="mt-3 bg-cream-alt border border-gray-200 rounded-lg p-3">
          <p className="text-xs font-medium text-navy mb-2">{cell.date}（{DAY_LABELS[new Date(cell.date + 'T00:00:00').getDay()]}）{cell.slot}</p>

          {cellBlocked ? (
            <p className="text-xs text-gray-500">この日は予約不可日に設定されています（「予約不可日」ページで確認してください）。</p>
          ) : cellOverride?.is_closed ? (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-red-600">この枠は受付停止中です</span>
              <button type="button" onClick={() => reopenSlot(cell.date, cell.slot)} disabled={busy}
                className="text-xs px-3 py-1.5 rounded bg-navy text-white disabled:opacity-50">
                受付を再開する
              </button>
            </div>
          ) : cellFull ? (
            <div>
              <p className="text-xs text-gray-500 mb-1">
                {reservationType === 'prayer'
                  ? `予約済みです（${cellCounts?.groups}/${cellMaxGroups}組）。`
                  : `満枠です（${cellCounts?.groups}/${cellMaxGroups}組）。`}
                定員を変更したい場合は「空き状況の詳細設定」をご利用ください。
              </p>
              <a href="/admin/reservations/availability" target="_blank" rel="noopener" className="text-xs text-navy underline">空き状況の詳細設定を開く ↗</a>
            </div>
          ) : cellBufferBlocked ? (
            <div>
              <p className="text-xs text-gray-500 mb-1">
                前後バッファ設定により、{cell && getBufferConflictSlots(cell.date, cell.slot).join('・')}の予約と時間が重なるため予約できません。
                バッファ時間を変更したい場合は「定員設定」ページをご利用ください。
              </p>
              <a href="/admin/capacity" target="_blank" rel="noopener" className="text-xs text-navy underline">定員設定を開く ↗</a>
            </div>
          ) : (
            <div className="flex items-center gap-2 flex-wrap">
              <button type="button" onClick={() => onSelectSlot(cell.date, cell.slot)}
                className="text-xs px-3 py-1.5 rounded bg-navy text-white">
                ① この枠で予約を追加
              </button>
              <button type="button" onClick={() => closeSlot(cell.date, cell.slot)} disabled={busy}
                className="text-xs px-3 py-1.5 rounded border border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-50">
                ② 受付を停止する
              </button>
            </div>
          )}
          {notice && <p className="text-[11px] text-green-700 mt-2">✓ {notice}</p>}
        </div>
      )}

      <div className="flex flex-wrap gap-3 mt-2 px-0.5 text-[11px] text-gray-500">
        <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded-sm bg-white border border-gray-300" /> 予約可</span>
        <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded-sm bg-red-50 border border-red-200" /> 受付停止</span>
        <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded-sm bg-gray-100" /> 満枠（護摩は「予約」）／休止(日)</span>
        <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded-sm bg-violet-50 border border-violet-200" /> ×＝前後の予約と重複（バッファ）</span>
        <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded-sm bg-amber-50 border border-amber-200" /> 個別設定あり</span>
      </div>
    </div>
  )
}
