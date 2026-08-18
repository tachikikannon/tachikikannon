import type { ReservationType } from '@/types'

// 予約不可日（blocked_dates）の種別コード。
// 単体の体験種別に加えて、複数種別をまとめて指定できるグループも用意する。
export const BLOCKED_DATE_TYPES = [
  'all',
  'prayer',
  'shakyou',
  'shabutu',
  'jyuzu',
  'zazen',
  'shakyou_shabutu',
  'shakyou_shabutu_prayer',
] as const
export type BlockedDateType = typeof BLOCKED_DATE_TYPES[number]

export const BLOCKED_DATE_TYPE_LABELS: Record<BlockedDateType, string> = {
  all:                      '全種別',
  prayer:                   '護摩のみ',
  shakyou:                  '写経のみ',
  shabutu:                  '写仏のみ',
  jyuzu:                    '数珠づくりのみ',
  zazen:                    '坐禅のみ',
  shakyou_shabutu:          '写経・写仏のみ',
  shakyou_shabutu_prayer:   '写経・写仏・護摩のみ',
}

// blocked_dates.type が、ある予約種別（reservationType）を対象に含むかどうかを判定する。
export function blockedDateMatchesType(blockedType: string, reservationType: ReservationType): boolean {
  if (blockedType === 'all') return true
  if (blockedType === 'shakyou_shabutu') return reservationType === 'shakyou' || reservationType === 'shabutu'
  if (blockedType === 'shakyou_shabutu_prayer') return reservationType === 'shakyou' || reservationType === 'shabutu' || reservationType === 'prayer'
  return blockedType === reservationType
}

// "9:00" "10:30" のような時刻表記のみ分に変換できる。"午前"/"午後" などのラベル枠はnullを返す。
export function parseSlotMinutes(slot: string): number | null {
  const m = slot.match(/^(\d{1,2}):(\d{2})$/)
  if (!m) return null
  return Number(m[1]) * 60 + Number(m[2])
}

export function getSeason(month: number): 'peak' | 'shoulder' | 'winter' {
  if (month >= 4 && month <= 10) return 'peak'
  if (month === 3 || month === 11) return 'shoulder'
  return 'winter'
}

// startHour:00 から endHour:00 まで30分刻みの時刻文字列を生成する。
function halfHourSlots(startHour: number, endHour: number): string[] {
  const slots: string[] = []
  for (let h = startHour; h <= endHour; h++) {
    slots.push(`${h}:00`)
    if (h < endHour) slots.push(`${h}:30`)
  }
  return slots
}

export function getTimeSlots(type: ReservationType, month: number): string[] {
  const season = getSeason(month)
  if (type === 'prayer') {
    return ['9:00', '9:30', '10:00', '10:30', '11:00', '11:30']
  }
  if (type === 'shakyou' || type === 'shabutu') {
    return ['午前', '午後']
  }
  if (type === 'jyuzu') {
    if (season === 'peak')     return halfHourSlots(9, 15)
    if (season === 'shoulder') return halfHourSlots(9, 14)
    return halfHourSlots(9, 13)
  }
  if (type === 'zazen') {
    if (season === 'peak')     return halfHourSlots(13, 15)
    if (season === 'shoulder') return halfHourSlots(13, 14)
    return halfHourSlots(13, 13)
  }
  return []
}
