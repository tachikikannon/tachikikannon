import type { Metadata } from 'next'

/**
 * 日本語版・英語版ページを紐づけるhreflang/canonicalタグを生成する。
 * これが無いと検索エンジンが言語バリエーションを認識できず、
 * 日本語で検索しても英語ページが結果に表示されることがある。
 */
export function buildAlternates(locale: string, jaPath: string): Metadata['alternates'] {
  const enPath = jaPath === '/' ? '/en' : `/en${jaPath}`
  return {
    canonical: locale === 'ja' ? jaPath : enPath,
    languages: { ja: jaPath, en: enPath },
  }
}
