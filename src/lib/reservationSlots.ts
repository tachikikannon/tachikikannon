import type { ReservationType } from '@/types'

// Vercelのサーバー関数はTZ=UTCで動作するため、素の new Date() のローカルgetterを
// SSR時に使うと日本時間の0〜9時台は「前日」を今日だと誤認してしまう
// （UTCではまだ日付が変わっていないため）。この関数は実行環境のタイムゾーンに関わらず
// 常に日本時間の壁時計値を返す。戻り値は必ず getUTC*/setUTC* 系のメソッドで
// 読み書きすること（getDate()等ローカル系と混在させると、今度はJST環境のブラウザで
// 二重にズレるため）。
export function nowInJST(): Date {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false,
  }).formatToParts(new Date())
  const get = (type: string) => Number(parts.find(p => p.type === type)?.value)
  // 環境によってはhour12:falseでも深夜0時が"24"表記になるため0-23に丸める
  const hour = get('hour') % 24
  return new Date(Date.UTC(get('year'), get('month') - 1, get('day'), hour, get('minute'), get('second')))
}

// nowInJST() が返すDate（UTC系メソッドで日本時間を表す）専用のフォーマッタ／週計算。
export function toDateStr(d: Date): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`
}

export function getMonday(d: Date): Date {
  const day = d.getUTCDay()
  const diff = day === 0 ? -6 : 1 - day
  const mon = new Date(d)
  mon.setUTCDate(d.getUTCDate() + diff)
  mon.setUTCHours(0, 0, 0, 0)
  return mon
}

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
    return ['13:00', '14:00']
  }
  return []
}
