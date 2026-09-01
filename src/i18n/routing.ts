import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['ja', 'en'],
  defaultLocale: 'ja',
  localePrefix: 'as-needed',
  // ブラウザのAccept-Language（訪問者の言語設定）による自動判定・自動リダイレクトを無効化。
  // これが有効だとブラウザが英語設定の訪問者は「/」に来ても英語版へ強制リダイレクトされてしまう
  // （next-intlのデフォルト挙動）。本サイトは日本のお寺の公式サイトのため、「/」は常に日本語を
  // 表示し、英語は右上の言語切替から明示的に選んだ場合のみ表示する
  localeDetection: false,
})

export type Locale = (typeof routing.locales)[number]
