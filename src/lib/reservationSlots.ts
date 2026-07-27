import type { ReservationType } from '@/types'

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
