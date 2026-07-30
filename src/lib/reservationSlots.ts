import type { ReservationType } from '@/types'

// 予約不可日（blocked_dates）の種別コード。
// 単体の体験種別に加えて、複数種別をまとめて指定できるグループも用意する。
export const BLOCKED_DATE_TYPES = [
  'all',
  'prayer',
  'shakyou',
  'shabutu',
  'jyuzu',
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

export function getSeason(month: number): 'peak' | 'shoulder' | 'winter' {
  if (month >= 4 && month <= 10) return 'peak'
  if (month === 3 || month === 11) return 'shoulder'
  return 'winter'
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
    if (season === 'peak')     return ['9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00']
    if (season === 'shoulder') return ['9:00', '10:00', '11:00', '12:00', '13:00', '14:00']
    return ['9:00', '10:00', '11:00', '12:00', '13:00']
  }
  return []
}
