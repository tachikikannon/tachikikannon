import type { NewsSite } from '@/types'

// お知らせカテゴリーの初期セット。管理画面から自由に追加・削除できるようになった後も、
// 未設定（新規サイトや移行前のデータ）の場合のフォールバックとして使う。
export const DEFAULT_NEWS_CATEGORIES = ['お知らせ', '行事案内', '季節のお知らせ', '交通情報', '授与品のお知らせ']

export function newsCategoriesKey(site: NewsSite): string {
  return `news_categories_${site}`
}

export function parseNewsCategories(raw: string | null | undefined): string[] {
  if (raw) {
    try {
      const arr = JSON.parse(raw)
      if (Array.isArray(arr) && arr.length > 0 && arr.every(v => typeof v === 'string')) return arr
    } catch {}
  }
  return DEFAULT_NEWS_CATEGORIES
}
