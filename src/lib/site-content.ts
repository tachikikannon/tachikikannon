import type { Locale } from '@/i18n/routing'

/**
 * site_content の key/value マップから、ロケールに応じた値を取得する。
 * 英語ロケールでは `${key}_en` を優先し、未翻訳なら日本語値にフォールバックする。
 */
export function getLocalizedContent(
  content: Record<string, string>,
  key: string,
  locale: Locale
): string {
  if (locale === 'en') {
    const enValue = content[`${key}_en`]
    if (enValue) return enValue
  }
  return content[key]
}

/**
 * DB行の日本語値（ja）と、対応する `${column}_en` 値（en）を渡すと、
 * ロケールに応じて英語優先で返す（英語が未入力/NULLなら日本語にフォールバック）。
 * news/posts/minor_events のように、site_content ではなく直接テーブルから
 * 取得した行を表示する画面で使う。
 */
export function pickLocalized(
  locale: Locale,
  ja: string,
  en?: string | null
): string {
  if (locale === 'en' && en) return en
  return ja
}

/**
 * リスト型フィールドのDB値が、指定キーを持つ項目を1件も含まない「古い形式」なら
 * fallback（通常はdefaultValue）を返す。項目追加前の古いデータが残っているケースの救済用。
 */
export function normalizeStaleList(raw: string, fallback: string, requireKey: string): string {
  try {
    const arr = JSON.parse(raw)
    if (Array.isArray(arr) && arr.some((item: Record<string, unknown>) => item && item[requireKey])) {
      return raw
    }
  } catch {}
  return fallback
}

/**
 * 件数固定のリストが、既定件数より少ない状態でDBに保存されている場合
 * （後からコード側に項目を追加した直後など）、不足分をdefaultValueの該当インデックスで補う。
 * 公開ページ側の同種のパディング処理と管理画面の表示件数を一致させるためのもの。
 */
export function padListToDefault(raw: string, defaultValue: string): string {
  try {
    const arr = JSON.parse(raw)
    const defaults = JSON.parse(defaultValue)
    if (Array.isArray(arr) && Array.isArray(defaults) && arr.length < defaults.length) {
      return JSON.stringify(defaults.map((d: unknown, i: number) => arr[i] ?? d))
    }
  } catch {}
  return raw
}
