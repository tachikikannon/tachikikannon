import type { NewsSite } from '@/types'

export type NewsCategoryDef = { name: string; color: string }

// カテゴリーバッジの色見本。管理画面のカテゴリー追加・編集でここから選ぶ。
export const CATEGORY_COLOR_SWATCHES: { key: string; label: string; className: string }[] = [
  { key: 'gray',   label: 'グレー',   className: 'bg-gray-100 text-gray-600' },
  { key: 'red',    label: '赤',       className: 'bg-red-100 text-red-700' },
  { key: 'orange', label: 'オレンジ', className: 'bg-orange-100 text-orange-700' },
  { key: 'amber',  label: '琥珀',     className: 'bg-amber-100 text-amber-700' },
  { key: 'yellow', label: '黄',       className: 'bg-yellow-100 text-yellow-700' },
  { key: 'lime',   label: 'ライム',   className: 'bg-lime-100 text-lime-700' },
  { key: 'green',  label: '緑',       className: 'bg-green-100 text-green-700' },
  { key: 'teal',   label: 'ティール', className: 'bg-teal-100 text-teal-700' },
  { key: 'cyan',   label: 'シアン',   className: 'bg-cyan-100 text-cyan-700' },
  { key: 'blue',   label: '青',       className: 'bg-blue-100 text-blue-700' },
  { key: 'indigo', label: '藍',       className: 'bg-indigo-100 text-indigo-700' },
  { key: 'purple', label: '紫',       className: 'bg-purple-100 text-purple-700' },
  { key: 'pink',   label: 'ピンク',   className: 'bg-pink-100 text-pink-700' },
]

const DEFAULT_COLOR = CATEGORY_COLOR_SWATCHES[0].className

// お知らせカテゴリーの初期セット。管理画面から自由に追加・削除・色変更できるようになった後も、
// 未設定（新規サイトや移行前のデータ）の場合のフォールバックとして使う。
export const DEFAULT_NEWS_CATEGORIES: NewsCategoryDef[] = [
  { name: 'お知らせ',         color: 'bg-blue-100 text-blue-700' },
  { name: '行事案内',         color: 'bg-amber-100 text-amber-700' },
  { name: '季節のお知らせ',   color: 'bg-teal-100 text-teal-700' },
  { name: '交通情報',         color: 'bg-red-100 text-red-700' },
  { name: '授与品のお知らせ', color: 'bg-purple-100 text-purple-700' },
]

export function newsCategoriesKey(site: NewsSite): string {
  return `news_categories_${site}`
}

export function parseNewsCategories(raw: string | null | undefined): NewsCategoryDef[] {
  if (raw) {
    try {
      const arr = JSON.parse(raw)
      if (Array.isArray(arr) && arr.length > 0) {
        // 色分け機能を追加する前の旧形式（文字列配列）が残っている場合の移行
        if (arr.every((v): v is string => typeof v === 'string')) {
          return arr.map(name => ({ name, color: DEFAULT_COLOR }))
        }
        if (arr.every(v => v && typeof v === 'object' && typeof v.name === 'string')) {
          return (arr as Partial<NewsCategoryDef>[]).map(v => ({ name: v.name!, color: v.color || DEFAULT_COLOR }))
        }
      }
    } catch {}
  }
  return DEFAULT_NEWS_CATEGORIES
}

export function categoryColor(categories: NewsCategoryDef[], name: string): string {
  return categories.find(c => c.name === name)?.color ?? DEFAULT_COLOR
}

// 新規カテゴリーのデフォルト色として、まだ使われていない色を提案する
// （追加のたびに毎回グレーになってしまうのを避けるため）。
export function suggestUnusedColor(categories: NewsCategoryDef[]): string {
  const used = new Set(categories.map(c => c.color))
  return CATEGORY_COLOR_SWATCHES.find(sw => !used.has(sw.className))?.className ?? DEFAULT_COLOR
}
