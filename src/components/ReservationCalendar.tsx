'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import type { ReservationType } from '@/types'
import { getTimeSlots, blockedDateMatchesType } from '@/lib/reservationSlots'

const DAY_LABELS = ['日','月','火','水','木','金','土']

type BlockedDate = { date: string; type: string; reason: string }
type Reservation = { date: string; time_slot: string; type: string; party_size: number; category_id: string | null }
type CapacitySetting = { max_groups: number; max_people: number; buffer_minutes: number }
type SlotOverride = { date: string; time_slot: string; is_closed: boolean; max_groups: number | null; max_people: number | null }
type Category = { id: string; name: string }

// "9:00" "10:30" のような時刻表記のみ分に変換できる。"午前"/"午後" などのラベル枠はnullを返す。
function parseSlotMinutes(slot: string): number | null {
  const m = slot.match(/^(\d{1,2}):(\d{2})$/)
  if (!m) return null
  return Number(m[1]) * 60 + Number(m[2])
}

// 同じ担当者・場所を共有していて同時に受けられない体験の組み合わせ。
// 例: 数珠づくり体験の予約が入っている時間は、護摩祈願も受け付けない。
const CROSS_BLOCKING_TYPES: Partial<Record<ReservationType, ReservationType[]>> = {
  prayer: ['jyuzu'],
}

// 「リッツ」区分の予約は別枠扱い。この区分の数珠づくり予約だけが護摩祈願を
// ふさぐ対象になり、一般の数珠づくりの定員（max_groups/max_people）には数えない。
const ISOLATED_POOL_CATEGORY_KEYWORD = 'リッツ'
const ISOLATED_POOL_CAPACITY_TYPES: ReservationType[] = ['jyuzu']

interface Props {
  reservationType: ReservationType
  selectedDate: string
  selectedTime: string
  onSelectSlot: (date: string, time: string) => void
}

function toDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

function getMonday(d: Date) {
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  const mon = new Date(d)
  mon.setDate(d.getDate() + diff)
  mon.setHours(0,0,0,0)
  return mon
}

export default function ReservationCalendar({
  reservationType, selectedDate, selectedTime, onSelectSlot
}: Props) {
  const supabase = createClient()
  const today = new Date()
  today.setHours(0,0,0,0)

  const [weekStart, setWeekStart] = useState(() => {
    // 今日が含まれる週の月曜日
    return getMonday(today)
  })
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [crossReservations, setCrossReservations] = useState<Reservation[]>([])
  const [crossBuffers, setCrossBuffers] = useState<Partial<Record<ReservationType, number>>>({})
  const [capacity, setCapacity] = useState<CapacitySetting | null>(null)
  const [overrides, setOverrides] = useState<SlotOverride[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  // 今週の7日間
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart)
    d.setDate(weekStart.getDate() + i)
    return d
  })

  useEffect(() => {
    // capacity_settings はダッシュボード管理のテーブルでRLSがリポジトリ管理外のため、
    // 未ログインでも確実に取得できるSECURITY DEFINER関数経由で取得する。
    supabase.rpc('public_capacity_setting', { res_type: reservationType })
      .then(({ data }) => setCapacity(data?.[0] ?? null))
  }, [reservationType])

  useEffect(() => {
    supabase.from('reservation_categories').select('id,name')
      .then(({ data }) => setCategories(data ?? []))
  }, [])

  const isolatedPoolCategoryId = categories.find(c => c.name.includes(ISOLATED_POOL_CATEGORY_KEYWORD))?.id ?? null

  useEffect(() => {
    const from = toDateStr(weekDays[0])
    const to = toDateStr(weekDays[6])

    supabase.from('blocked_dates').select('date,type,reason')
      .gte('date', from).lte('date', to)
      .then(({ data }) => setBlockedDates(data ?? []))

    // reservations には個人情報が含まれるため未ログインでは直接SELECTできない。
    // 日付・時間帯・種別・人数だけを返すSECURITY DEFINER関数経由で空き状況を取得する。
    supabase.rpc('public_reservation_slots', { from_date: from, to_date: to, res_types: [reservationType] })
      .then(({ data }) => setReservations(data ?? []))

    const crossTypes = CROSS_BLOCKING_TYPES[reservationType] ?? []
    if (crossTypes.length > 0) {
      supabase.rpc('public_reservation_slots', { from_date: from, to_date: to, res_types: crossTypes })
        .then(({ data }) => setCrossReservations(data ?? []))
      // 相手側の体験（数珠づくり等）自身の「前後バッファ」設定を、こちら側の
      // 予約不可判定にもそのまま利用する（数珠づくりの所要時間ぶん、前後の
      // 護摩の枠も塞がる）。
      Promise.all(crossTypes.map(t =>
        supabase.rpc('public_capacity_setting', { res_type: t }).then(({ data }) => [t, data?.[0]?.buffer_minutes ?? 0] as const)
      )).then(entries => setCrossBuffers(Object.fromEntries(entries)))
    } else {
      setCrossReservations([])
      setCrossBuffers({})
    }

    supabase.from('slot_overrides').select('date,time_slot,is_closed,max_groups,max_people')
      .gte('date', from).lte('date', to)
      .eq('type', reservationType)
      .then(({ data }) => setOverrides(data ?? []))
  }, [weekStart, reservationType])

  function isDateBlocked(dateStr: string) {
    return blockedDates.find(b => b.date === dateStr && blockedDateMatchesType(b.type, reservationType)) ?? null
  }

  function getOverride(dateStr: string, slot: string) {
    return overrides.find(o => o.date === dateStr && o.time_slot === slot) ?? null
  }

  function isSlotFull(dateStr: string, slot: string) {
    const override = getOverride(dateStr, slot)
    const maxGroups = override?.max_groups ?? capacity?.max_groups
    const maxPeople = override?.max_people ?? capacity?.max_people
    // 「リッツ」区分の予約は別枠のため、この種別の通常定員（一般のお客様向け）には数えない。
    const slotReservations = reservations.filter(r => r.date === dateStr && r.time_slot === slot &&
      !(ISOLATED_POOL_CAPACITY_TYPES.includes(reservationType) && isolatedPoolCategoryId != null && r.category_id === isolatedPoolCategoryId))
    const groupCount = slotReservations.length
    const peopleCount = slotReservations.reduce((sum, r) => sum + (r.party_size ?? 1), 0)
    const overCapacity = (maxGroups != null && groupCount >= maxGroups) || (maxPeople != null && peopleCount >= maxPeople)
    if (overCapacity) return true

    // 同じ担当者・場所を共有する体験（例: 護摩祈願と数珠づくり）は、
    // 一方が予約されている時間帯はもう一方も予約不可にする。ただし対象は「リッツ」区分の
    // 予約のみ。一般の数珠づくりは護摩祈願をふさがない。相手側に前後バッファが設定されて
    // いる場合は、その分数未満しか離れていない前後の枠も合わせて塞ぐ。
    const slotMinutesForCross = parseSlotMinutes(slot)
    const crossBlocked = isolatedPoolCategoryId != null && crossReservations.some(r => {
      if (r.date !== dateStr) return false
      if (r.category_id !== isolatedPoolCategoryId) return false
      if (r.time_slot === slot) return true
      const buffer = crossBuffers[r.type as ReservationType] ?? 0
      if (buffer <= 0 || slotMinutesForCross == null) return false
      const rMinutes = parseSlotMinutes(r.time_slot)
      return rMinutes != null && Math.abs(rMinutes - slotMinutesForCross) < buffer
    })
    if (crossBlocked) return true

    // 前後バッファ（分）: 実際の所要時間が枠の間隔より長い体験（護摩祈祷など）向け。
    // 既存予約の開始時刻からバッファ分数未満しか離れていない枠は、時間が重なるため予約不可にする。
    // 同じ枠（距離0）もバッファが設定されていれば含まれるため、1枠1組運用にもそのまま使える。
    const bufferMinutes = capacity?.buffer_minutes ?? 0
    const slotMinutes = parseSlotMinutes(slot)
    if (bufferMinutes > 0 && slotMinutes != null) {
      const overlapping = reservations.some(r => {
        if (r.date !== dateStr) return false
        const rMinutes = parseSlotMinutes(r.time_slot)
        return rMinutes != null && Math.abs(rMinutes - slotMinutes) < bufferMinutes
      })
      if (overlapping) return true
    }

    return false
  }

  function prevWeek() {
    const d = new Date(weekStart)
    d.setDate(d.getDate() - 7)
    setWeekStart(d)
  }

  function nextWeek() {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + 7)
    setWeekStart(d)
  }

  const canGoPrev = weekStart > today

  return (
    <div className="overflow-x-auto">
      {/* 週ナビゲーション */}
      <div className="flex items-center justify-between mb-3">
        <button type="button" onClick={prevWeek} disabled={!canGoPrev}
          className="text-sm px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-30 hover:border-navy transition-colors">
          ← 前の1週間
        </button>
        <span className="text-sm text-gray-500">
          {weekDays[0].getMonth()+1}/{weekDays[0].getDate()} 〜 {weekDays[6].getMonth()+1}/{weekDays[6].getDate()}
        </span>
        <button type="button" onClick={nextWeek}
          className="text-sm px-3 py-1.5 border border-gray-200 rounded-lg hover:border-navy transition-colors">
          次の1週間 →
        </button>
      </div>

      {/* テーブル */}
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="w-14 border border-gray-200 bg-gray-50 px-2 py-2 text-xs text-gray-500">時間</th>
            {weekDays.map(d => {
              const dateStr = toDateStr(d)
              const isPast = d < today
              const isToday = toDateStr(d) === toDateStr(today)
              const dow = d.getDay()
              return (
                <th key={dateStr}
                  className={`border border-gray-200 px-1 py-2 text-center
                    ${isToday ? 'bg-gold/10' : 'bg-gray-50'}
                    ${isPast ? 'opacity-40' : ''}`}>
                  <div className={`text-xs font-medium
                    ${dow === 0 ? 'text-red-500' : dow === 6 ? 'text-blue-500' : 'text-gray-700'}`}>
                    {DAY_LABELS[dow]}
                  </div>
                  <div className={`text-base font-bold
                    ${dow === 0 ? 'text-red-500' : dow === 6 ? 'text-blue-500' : 'text-navy'}`}>
                    {d.getDate()}
                  </div>
                  {isToday && <div className="text-[10px] text-gold font-medium">今日</div>}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {/* 週内の全日付のスロットを合わせて行を決定 */}
          {Array.from(new Set(weekDays.flatMap(d => getTimeSlots(reservationType, d.getMonth() + 1)))).map(slot => (
            <tr key={slot}>
              <td className="border border-gray-200 bg-gray-50 px-2 py-2 text-xs text-gray-500 text-center whitespace-nowrap">
                {slot}
              </td>
              {weekDays.map(d => {
                const dateStr = toDateStr(d)
                const isPast = d < today
                const blocked = isDateBlocked(dateStr)
                const override = getOverride(dateStr, slot)
                const full = isSlotFull(dateStr, slot)
                const isSelected = selectedDate === dateStr && selectedTime === slot
                const validSlots = getTimeSlots(reservationType, d.getMonth() + 1)
                const unavailable = isPast || !!blocked || !!override?.is_closed || full || !validSlots.includes(slot)

                return (
                  <td key={dateStr} className="border border-gray-200 p-1 text-center">
                    {unavailable ? (
                      <div className="flex items-center justify-center h-9 text-gray-300">
                        <span className="text-lg font-bold">×</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onSelectSlot(dateStr, slot)}
                        className={`w-full h-9 rounded-lg flex items-center justify-center transition-all
                          ${isSelected
                            ? 'bg-navy text-white'
                            : 'hover:bg-navy/10 text-teal'
                          }`}
                      >
                        {isSelected
                          ? <span className="text-sm font-bold">✓</span>
                          : <span className="text-lg">○</span>
                        }
                      </button>
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* 凡例 */}
      <div className="flex gap-5 mt-3 text-xs text-gray-500">
        <span className="flex items-center gap-1.5"><span className="text-teal text-base leading-none">○</span> 予約できます</span>
        <span className="flex items-center gap-1.5"><span className="text-gray-300 text-base leading-none font-bold">×</span> 予約できません</span>
        <span className="flex items-center gap-1.5"><span className="bg-navy text-white text-xs px-1 rounded">✓</span> 選択中</span>
      </div>

      {/* 選択中の表示 */}
      {selectedDate && selectedTime && (
        <div className="mt-3 bg-navy/5 border border-navy/20 rounded-lg px-4 py-3 text-sm text-navy">
          ✓ {new Date(selectedDate + 'T00:00:00').toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', weekday: 'short' })} {selectedTime} を選択しています
        </div>
      )}
    </div>
  )
}
