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
