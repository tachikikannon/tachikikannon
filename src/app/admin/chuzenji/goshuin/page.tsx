'use client'
import SectionEditor from '@/components/admin/SectionEditor'

const J = (v: unknown) => JSON.stringify(v)

const FIELDS = [
  { key: 'goshuin_fee_note', label: '御朱印代・受付時間の案内', multiline: true, defaultValue: '御朱印代：各500円　／　書き入れ・書き置きともに同じ金額です。\n受付時間は拝観時間に準じます（閉門30分前に終了）。' },
  {
    key: 'goshuin_notes', label: '御朱印についてのご注意', type: 'list' as const,
    listFields: [{ key: 'text', label: '注意事項', multiline: true }],
    defaultValue: J([
      { text: '御朱印は信仰の証です。コレクション目的でのお受け取りはご遠慮ください。' },
      { text: '受付時間は閉門30分前に終了いたします。余裕をもってお越しください。' },
      { text: '書き入れは混雑時にお時間をいただく場合がございます。' },
      { text: '御朱印帳をお持ちでない方には書き置きもございます。' },
    ]),
  },
] as const

export default function AdminChuzenjGoshuin() {
  return <SectionEditor title="御朱印" href="/goshuin" fields={FIELDS as never} />
}
