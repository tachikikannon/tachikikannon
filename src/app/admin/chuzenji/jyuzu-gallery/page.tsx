'use client'
import SectionEditor from '@/components/admin/SectionEditor'

const FIELDS = [
  { key: 'jyuzu_heading_instagram', label: '「数珠作り体験ギャラリー」見出し（数珠づくり体験ページの「選べる珠」セクション内に表示）', defaultValue: '数珠作り体験ギャラリー', translatable: true },
  { key: 'jyuzu_instagram_hint', label: '「数珠作り体験ギャラリー」補足文', multiline: true, defaultValue: '「#中禅寺立木観音」「#数珠づくり体験」のハッシュタグをつけて投稿すると、こちらでご紹介させていただくことがあります。', translatable: true },
  {
    key: 'jyuzu_instagram_urls', label: 'Instagram投稿URL一覧（掲載する投稿のURLを追加・削除できます）', type: 'list' as const,
    listFields: [{ key: 'url', label: 'Instagram投稿URL（例: https://www.instagram.com/p/xxxxxxxxxxx/）' }],
    defaultValue: '[]',
  },
] as const

export default function AdminChuzenjiJyuzuGallery() {
  return <SectionEditor title="数珠作り体験ギャラリー" href="/experience/jyuzu" fields={FIELDS as never} />
}
