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
