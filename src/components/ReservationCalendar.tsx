'use client'
import { useState, useEffect } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase'
import type { ReservationType } from '@/types'
import { getTimeSlots, blockedDateMatchesType, getSeason, parseSlotMinutes } from '@/lib/reservationSlots'

type BlockedDate = { date: string; type: string; reason: string }
type Reservation = { date: string; time_slot: string; type: string; party_size: number; category_id: string | null }
type CapacitySetting = { max_groups: number; max_people: number; buffer_minutes: number }
type SlotOverride = { date: string; time_slot: string; is_closed: boolean; max_groups: number | null; max_people: number | null; reserved_groups: number | null; reserved_people: number | null }
type Category = { id: string; name: string }

// "午前"/"午後" ラベル枠の当日受付締切（分）。それ以外のラベルはnullを返す。
// 午前は11:45で締切。午後は拝観時間の閉門1時間前（季節により変動）で締切。
function getLabelSlotCutoffMinutes(slot: string, month: number): number | null {
  if (slot === '午前') return 11 * 60 + 45
  if (slot === '午後') {
    const season = getSeason(month)
    if (season === 'peak') return 16 * 60        // 4〜10月: 閉門17:00
    if (season === 'shoulder') return 15 * 60     // 3・11月: 閉門16:00
    return 14 * 60 + 30                           // 12〜2月: 閉門15:30
  }
  return null
}

// 「リッツ」区分の予約は別枠扱い。この区分の数珠づくり予約だけが護摩祈願を
// ふさぐ対象になり、一般の数珠づくりの定員（max_groups/max_people）には数えない。
const ISOLATED_POOL_CATEGORY_KEYWORD = 'リッツ'
const ISOLATED_POOL_CAPACITY_TYPES: ReservationType[] = ['jyuzu']

// 護摩祈願・数珠づくりはお客様側からのWeb予約は前日までとし、当日分は電話でのみ受け付ける。
// 空き状況自体は当日分も表示したいため、枠を×にはせず、選択時に電話案内を出す。
const SAME_DAY_PHONE_ONLY_TYPES: ReservationType[] = ['prayer', 'jyuzu']
const SAME_DAY_PHONE_NUMBER = '0288-55-0013'

// 坐禅は僧侶の都合で希望日時に対応できないことがあるため、Web予約自体を受け付けず、
// どの日を選んでも常に電話でのご予約案内を表示する（管理画面からの登録は対象外）。
const ALWAYS_PHONE_ONLY_TYPES: ReservationType[] = ['zazen']
const ALWAYS_PHONE_ONLY_MESSAGE = '僧侶の都合により、ご希望の日時に対応できない場合がございますので、お電話にてご予約をお願いいたします。'

interface Props {
  reservationType: ReservationType
  selectedDate: string
  selectedTime: string
  onSelectSlot: (date: string, time: string) => void
  // 管理画面からの登録では、当日の受付締切を過ぎていても枠を選べるようにする。
  isAdmin?: boolean
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
  reservationType, selectedDate, selectedTime, onSelectSlot, isAdmin = false
}: Props) {
  const supabase = createClient()
  const t = useTranslations('reservationCalendar')
  const locale = useLocale()
  const dateLocale = locale === 'en' ? 'en-US' : 'ja-JP'
  const DAY_LABELS = t.raw('days') as string[]
  const now = new Date()
  // サーバー描画時とクライアントのhydration時とで現在時刻がズレることがあり、
  // それによって「本日締切済み判定」の結果が食い違うとReactのhydrationエラーになる。
  // マウント前（サーバー描画・hydration直後の初回描画）は常に「未締切」として扱い、
  // マウント後のクライアント再描画で実際の現在時刻を反映する。
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  const nowMinutes = mounted ? now.getHours() * 60 + now.getMinutes() : -1
  const today = new Date(now)
  today.setHours(0,0,0,0)

  const [weekStart, setWeekStart] = useState(() => {
    // 今日が含まれる週の月曜日
    return getMonday(today)
  })
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [capacity, setCapacity] = useState<CapacitySetting | null>(null)
  const [overrides, setOverrides] = useState<SlotOverride[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [showSameDayNotice, setShowSameDayNotice] = useState(false)
  const [showAlwaysPhoneNotice, setShowAlwaysPhoneNotice] = useState(false)

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

  useEffect(() => { setShowSameDayNotice(false); setShowAlwaysPhoneNotice(false) }, [reservationType])

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

    supabase.from('slot_overrides').select('date,time_slot,is_closed,max_groups,max_people,reserved_groups,reserved_people')
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
    const maxGroupsRaw = override?.max_groups ?? capacity?.max_groups
    const maxPeopleRaw = override?.max_people ?? capacity?.max_people
    const maxGroups = maxGroupsRaw != null ? Math.max(0, maxGroupsRaw - (override?.reserved_groups ?? 0)) : maxGroupsRaw
    const maxPeople = maxPeopleRaw != null ? Math.max(0, maxPeopleRaw - (override?.reserved_people ?? 0)) : maxPeopleRaw
    // 「リッツ」区分の予約は別枠のため、この種別の通常の定員・バッファ判定（一般のお客様向け）
    // からは完全に除外する。定員カウントだけでなく、この後の同種別バッファ判定でも使うため
    // ここで除外済みの一覧を作っておく。
    const isIsolated = (r: Reservation) =>
      ISOLATED_POOL_CAPACITY_TYPES.includes(reservationType) && isolatedPoolCategoryId != null && r.category_id === isolatedPoolCategoryId
    const generalReservations = reservations.filter(r => !isIsolated(r))
    const slotReservations = generalReservations.filter(r => r.date === dateStr && r.time_slot === slot)
    const groupCount = slotReservations.length
    const peopleCount = slotReservations.reduce((sum, r) => sum + (r.party_size ?? 1), 0)
    const overCapacity = (maxGroups != null && groupCount >= maxGroups) || (maxPeople != null && peopleCount >= maxPeople)
    if (overCapacity) return true

    // 前後バッファ（分）: 実際の所要時間が枠の間隔より長い体験（護摩祈祷・数珠づくりなど）向け。
    // 既存予約の開始時刻からバッファ分数未満しか離れていない「別の」枠は、時間が重なるため
    // 予約不可にする。同じ枠（距離0）は定員チェック（上のoverCapacity）に任せる。ここも対象に
    // 含めてしまうと、数珠づくりのように複数組を同じ枠で受け付ける体験で、定員に余裕があっても
    // 1組でも予約が入った時点でその枠自体が予約不可になってしまう。
    const bufferMinutes = capacity?.buffer_minutes ?? 0
    const slotMinutes = parseSlotMinutes(slot)
    if (bufferMinutes > 0 && slotMinutes != null) {
      const overlapping = generalReservations.some(r => {
        if (r.date !== dateStr || r.time_slot === slot) return false
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
    <div className="overflow-x-auto" style={{ overflowY: 'visible' }}>
      {/* 週ナビゲーション */}
      <div className="flex items-center justify-between mb-3">
        <button type="button" onClick={prevWeek} disabled={!canGoPrev}
          className="text-sm px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-30 hover:border-navy transition-colors">
          {t('prevWeek')}
        </button>
        <span className="text-sm text-gray-500">
          {weekDays[0].getMonth()+1}/{weekDays[0].getDate()} 〜 {weekDays[6].getMonth()+1}/{weekDays[6].getDate()}
        </span>
        <button type="button" onClick={nextWeek}
          className="text-sm px-3 py-1.5 border border-gray-200 rounded-lg hover:border-navy transition-colors">
          {t('nextWeek')}
        </button>
      </div>

      {/* テーブル */}
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="w-14 border border-gray-200 bg-gray-50 px-2 py-2 text-xs text-gray-500">{t('timeHeader')}</th>
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
                  {isToday && <div className="text-[10px] text-gold font-medium">{t('today')}</div>}
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
                const isToday = dateStr === toDateStr(today)
                const slotMinutes = parseSlotMinutes(slot)
                const labelCutoffMinutes = getLabelSlotCutoffMinutes(slot, d.getMonth() + 1)
                // 今日の枠は、開始時刻（または"午前"/"午後"の受付締切）を過ぎていたら予約不可にする。
                // 管理画面からの登録は締切後も可能とする。
                const slotTimePassed = !isAdmin && isToday && (
                  (slotMinutes != null && slotMinutes <= nowMinutes) ||
                  (labelCutoffMinutes != null && labelCutoffMinutes <= nowMinutes)
                )
                const blocked = isDateBlocked(dateStr)
                const override = getOverride(dateStr, slot)
                const full = isSlotFull(dateStr, slot)
                const isSelected = selectedDate === dateStr && selectedTime === slot
                const validSlots = getTimeSlots(reservationType, d.getMonth() + 1)
                const unavailable = isPast || slotTimePassed || !!blocked || !!override?.is_closed || full || !validSlots.includes(slot)
                const sameDayPhoneOnly = !isAdmin && isToday && SAME_DAY_PHONE_ONLY_TYPES.includes(reservationType)
                const alwaysPhoneOnly = !isAdmin && ALWAYS_PHONE_ONLY_TYPES.includes(reservationType)

                return (
                  <td key={dateStr} className="border border-gray-200 p-1 text-center">
                    {unavailable ? (
                      <div className="flex items-center justify-center h-9 text-gray-300">
                        <span className="text-lg font-bold">×</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => alwaysPhoneOnly ? setShowAlwaysPhoneNotice(true) : sameDayPhoneOnly ? setShowSameDayNotice(true) : onSelectSlot(dateStr, slot)}
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

      {/* 坐禅：どの枠を選んでも常に表示する電話案内 */}
      {showAlwaysPhoneNotice && (
        <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800">
          <p>
            {ALWAYS_PHONE_ONLY_MESSAGE}<br />
            電話番号 {SAME_DAY_PHONE_NUMBER}
          </p>
        </div>
      )}

      {/* 当日枠クリック時の電話案内 */}
      {showSameDayNotice && (
        <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800 flex items-start justify-between gap-3">
          <p>
            当日予約は、中禅寺立木観音に直接お問い合わせください。<br />
            電話番号 {SAME_DAY_PHONE_NUMBER}
          </p>
          <button type="button" onClick={() => setShowSameDayNotice(false)} className="text-amber-500 hover:text-amber-700 shrink-0">✕</button>
        </div>
      )}

      {/* 凡例 */}
      <div className="flex gap-5 mt-3 text-xs text-gray-500">
        <span className="flex items-center gap-1.5"><span className="text-teal text-base leading-none">○</span> {t('legendAvailable')}</span>
        <span className="flex items-center gap-1.5"><span className="text-gray-300 text-base leading-none font-bold">×</span> {t('legendUnavailable')}</span>
        <span className="flex items-center gap-1.5"><span className="bg-navy text-white text-xs px-1 rounded">✓</span> {t('legendSelected')}</span>
      </div>

      {/* 選択中の表示 */}
      {selectedDate && selectedTime && (
        <div className="mt-3 bg-navy/5 border border-navy/20 rounded-lg px-4 py-3 text-sm text-navy">
          ✓ {new Date(selectedDate + 'T00:00:00').toLocaleDateString(dateLocale, { month: 'long', day: 'numeric', weekday: 'short' })} {selectedTime}{t('selectedPrefix')}
        </div>
      )}
    </div>
  )
}
