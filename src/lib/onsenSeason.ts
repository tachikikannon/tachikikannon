import type { Locale } from '@/i18n/routing'

/**
 * 温泉寺「薬師の湯」の閉湯・開湯（冬季休業などのシーズン単位の休み）。
 * 管理画面「温泉設定」で登録した閉湯日・開湯日（予定）・手動の強制閉湯チェックから、
 * 今日が閉湯期間かどうかを判定する。トップページのヒーローと温泉のご案内ページで共用。
 */

// site_content のキーと既定値（公開ページの getContent に混ぜて使う）
export const ONSEN_SEASON_DEFAULTS: Record<string, string> = {
  onsenji_onsen_season_close_date: '',
  onsenji_onsen_season_open_date: '',
  onsenji_onsen_season_closed_force: 'false',
  onsenji_onsen_season_closed_label: '冬季閉湯中',
  onsenji_onsen_season_closed_label_en: '',
  onsenji_onsen_season_wait_message: '開湯するまでお待ちください。',
  onsenji_onsen_season_wait_message_en: '',
  onsenji_onsen_season_info_message: '昨年は令和8年4月11日に開湯しました。',
  onsenji_onsen_season_info_message_en: '',
}

// 英語の既定文。日本語が既定文のまま（未編集）のときだけ使う。
// 日本語だけ書き換えて英語を入れ忘れた場合に、古い英語の既定文（特に日付入りの案内）が
// 英語ページに残って食い違うのを防ぐため。その場合は日本語がそのまま表示される。
const EN_DEFAULTS: Record<string, string> = {
  onsenji_onsen_season_closed_label: 'Closed for the Winter Season',
  onsenji_onsen_season_wait_message: 'Please wait until the hot spring reopens.',
  onsenji_onsen_season_info_message: 'Last year, the hot spring opened on April 11, 2026.',
}

// 管理画面で空欄にして保存したら「非表示」にしたいキー。
// 通常の getContent は空文字を「未設定」とみなして既定文に戻してしまうため、ここに挙げたキーだけ空文字を尊重する。
export const ONSEN_SEASON_CLEARABLE_KEYS = new Set([
  'onsenji_onsen_season_wait_message',
  'onsenji_onsen_season_info_message',
])

/** "2026-12-01" / "2026/12/1" などを "YYYY-MM-DD" に正規化。読めなければ null */
export function normalizeISODate(s: string | undefined | null): string | null {
  const m = (s ?? '').trim().match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/)
  if (!m) return null
  const mm = Number(m[2]), dd = Number(m[3])
  if (mm < 1 || mm > 12 || dd < 1 || dd > 31) return null
  return `${m[1]}-${String(mm).padStart(2, '0')}-${String(dd).padStart(2, '0')}`
}

/** 日本時間での今日の日付 "YYYY-MM-DD"（Vercel のサーバーのタイムゾーンに依存しない） */
export function jstTodayISO(now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now)
  const y = parts.find(p => p.type === 'year')?.value
  const m = parts.find(p => p.type === 'month')?.value
  const d = parts.find(p => p.type === 'day')?.value
  return `${y}-${m}-${d}`
}

/** "2027-04-10" → 日本語「令和9年4月10日」／英語「April 10, 2027」 */
export function formatOnsenDate(iso: string, loc: Locale): string {
  const [y, m, d] = iso.split('-').map(Number)
  if (loc === 'en') {
    return new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(Date.UTC(y, m - 1, d)))
  }
  const reiwa = y - 2018
  return `令和${reiwa === 1 ? '元' : reiwa}年${m}月${d}日`
}

function pickSeasonText(c: Record<string, string>, key: string, loc: Locale): string {
  const ja = c[key] ?? ''
  if (loc !== 'en') return ja
  // 日本語を空欄にした（＝非表示にした）ら英語ページでも出さない
  if (!ja) return ''
  const en = c[`${key}_en`]
  if (en) return en
  if (ja === ONSEN_SEASON_DEFAULTS[key] && EN_DEFAULTS[key]) return EN_DEFAULTS[key]
  return ja
}

export type OnsenSeasonState = {
  /** 今日が閉湯期間（または手動で閉湯中にしている） */
  closed: boolean
  label: string
  waitMessage: string
  infoMessage: string
  /** 今日より後の開湯予定日。未定・過去の日付なら null */
  upcomingOpenISO: string | null
}

export function getOnsenSeasonState(c: Record<string, string>, loc: Locale, todayISO: string = jstTodayISO()): OnsenSeasonState {
  const closeISO = normalizeISODate(c['onsenji_onsen_season_close_date'])
  const openRaw = normalizeISODate(c['onsenji_onsen_season_open_date'])
  // 開湯日が閉湯日以前（＝前シーズンの開湯日が残ったまま、新しい閉湯日だけ入れた）なら「未定」とみなす
  const openISO = openRaw && (!closeISO || openRaw > closeISO) ? openRaw : null
  const forced = c['onsenji_onsen_season_closed_force'] === 'true'
  const closedByDate = !!closeISO && todayISO >= closeISO && (!openISO || todayISO < openISO)
  return {
    closed: forced || closedByDate,
    label: pickSeasonText(c, 'onsenji_onsen_season_closed_label', loc),
    waitMessage: pickSeasonText(c, 'onsenji_onsen_season_wait_message', loc),
    infoMessage: pickSeasonText(c, 'onsenji_onsen_season_info_message', loc),
    upcomingOpenISO: openISO && openISO > todayISO ? openISO : null,
  }
}
