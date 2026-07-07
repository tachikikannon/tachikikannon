'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import type { ReservationType } from '@/types'

const TIME_SLOTS = ['9:00','9:30','10:00','10:30','11:00','11:30']
const DAYS = ['日','月','火','水','木','金','土']

type BlockedDate = { date: string; type: string; reason: string }
type Reservation = { date: string; time_slot: string; type: string }

interface Props {
  reservationType: ReservationType
  selectedDate: string
  selectedTime: string
  onSelectDate: (date: string) => void
  onSelectTime: (time: string) => void
}

export default function ReservationCalendar({
  reservationType, selectedDate, selectedTime, onSelectDate, onSelectTime
}: Props) {
  const supabase = createClient()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])

  useEffect(() => {
    const from = `${year}-${String(month + 1).padStart(2, '0')}-01`
    const lastDay = new Date(year, month + 1, 0).getDate()
    const to = `${year}-${String(month + 1).padStart(2, '0')}-${lastDay}`

    supabase.from('blocked_dates').select('date,type,reason')
      .gte('date', from).lte('date', to)
      .then(({ data }) => setBlockedDates(data ?? []))

    supabase.from('reservations').select('date,time_slot,type')
      .gte('date', from).lte('date', to)
      .then(({ data }) => setReservations(data ?? []))
  }, [year, month])

  function isBlocked(dateStr: string): BlockedDate | null {
    return blockedDates.find(b =>
      b.date === dateStr && (b.type === 'all' || b.type === reservationType)
    ) ?? null
  }

  function getBookedSlots(dateStr: string): string[] {
    return reservations
      .filter(r => r.date === dateStr && (r.type === reservationType || r.type === 'all'))
      .map(r => r.time_slot)
  }

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
  }

  // カレンダーグリッド生成
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  const bookedSlotsForSelected = selectedDate ? getBookedSlots(selectedDate) : []

  return (
    <div>
      {/* カレンダー */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-4">
        {/* ヘッダー */}
        <div className="flex items-center justify-between px-4 py-3 bg-navy text-white">
          <button type="button" onClick={prevMonth} className="p-1 hover:bg-white/10 rounded transition-colors text-lg">‹</button>
          <span className="font-serif text-sm">{year}年{month + 1}月</span>
          <button type="button" onClick={nextMonth} className="p-1 hover:bg-white/10 rounded transition-colors text-lg">›</button>
        </div>

        {/* 曜日 */}
        <div className="grid grid-cols-7 border-b border-gray-100">
          {DAYS.map((d, i) => (
            <div key={d} className={`text-center text-xs py-2 font-medium
              ${i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-gray-500'}`}>
              {d}
            </div>
          ))}
        </div>

        {/* 日付グリッド */}
        <div className="grid grid-cols-7">
          {cells.map((day, i) => {
            if (!day) return <div key={i} className="h-10" />
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            const date = new Date(year, month, day)
            const isPast = date < today
            const blocked = isBlocked(dateStr)
            const isSelected = selectedDate === dateStr
            const isToday = date.getTime() === today.getTime()
            const dow = date.getDay()

            let cellClass = 'h-10 flex items-center justify-center text-sm relative transition-all '
            if (isPast) {
              cellClass += 'text-gray-300 cursor-not-allowed'
            } else if (blocked) {
              cellClass += 'text-red-400 cursor-not-allowed'
            } else if (isSelected) {
              cellClass += 'bg-navy text-white rounded-full cursor-pointer font-bold'
            } else {
              cellClass += `cursor-pointer hover:bg-navy/10 rounded-full font-medium
                ${dow === 0 ? 'text-red-500' : dow === 6 ? 'text-blue-500' : 'text-gray-700'}`
            }

            return (
              <div key={i} className="flex items-center justify-center py-1 px-1">
                <button
                  type="button"
                  disabled={isPast || !!blocked}
                  onClick={() => onSelectDate(dateStr)}
                  className={cellClass}
                  title={blocked ? (blocked.reason || '予約不可') : undefined}
                >
                  {day}
                  {blocked && !isPast && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-red-400 rounded-full" />
                  )}
                  {isToday && !isSelected && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-navy rounded-full" />
                  )}
                </button>
              </div>
            )
          })}
        </div>

        {/* 凡例 */}
        <div className="flex gap-4 px-4 py-2 border-t border-gray-100 text-xs text-gray-400">
          <span className="flex items-center gap-1"><span className="w-2 h-2 bg-red-400 rounded-full inline-block" />予約不可</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 bg-navy rounded-full inline-block" />今日</span>
        </div>
      </div>

      {/* 時間帯選択 */}
      {selectedDate && (
        <div>
          <p className="text-sm font-medium text-navy mb-2">
            {new Date(selectedDate + 'T00:00:00').toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', weekday: 'short' })} の時間帯
          </p>
          {isBlocked(selectedDate) ? (
            <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3">
              ⚠️ {isBlocked(selectedDate)?.reason || 'この日は予約をお受けできません'}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {TIME_SLOTS.map(slot => {
                const booked = bookedSlotsForSelected.includes(slot)
                const isSelectedSlot = selectedTime === slot
                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={booked}
                    onClick={() => onSelectTime(slot)}
                    className={`py-2.5 rounded-lg text-sm font-medium border transition-all
                      ${booked
                        ? 'bg-gray-100 text-gray-300 border-gray-100 cursor-not-allowed line-through'
                        : isSelectedSlot
                          ? 'bg-navy text-white border-navy'
                          : 'bg-white text-navy border-gray-200 hover:border-navy hover:bg-navy/5'
                      }`}
                  >
                    {slot}
                    {booked && <span className="block text-xs">×</span>}
                    {!booked && <span className="block text-xs text-green-500">○</span>}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
