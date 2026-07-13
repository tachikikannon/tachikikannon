'use client'
import SectionEditor from '@/components/admin/SectionEditor'

const J = (v: unknown) => JSON.stringify(v)

const FIELDS = [
  { key: 'onsenji_goshuin_fee_note', label: '御朱印代・受付時間の案内', multiline: true, defaultValue: '御朱印代：500円　／　写経体験（1,000円）をお申し込みの方には特別御朱印を授与しています。\n受付時間は拝観受付終了時刻までとなります。' },
  {
    key: 'onsenji_goshuin_notes', label: '御朱印についてのご注意', type: 'list' as const,
    listFields: [{ key: 'text', label: '注意事項', multiline: true }],
    defaultValue: J([
      { text: '御朱印は信仰の証です。コレクション目的でのお受け取りはご遠慮ください。' },
      { text: '受付時間は参篭受付終了時刻に終了いたします。余裕をもってお越しください。' },
      { text: '書き入れは混雑時にお時間をいただく場合がございます。' },
      { text: '御朱印帳をお持ちでない方には書き置きもございます。' },
    ]),
  },
] as const

export default function AdminOnsenjGoshuin() {
  return <SectionEditor title="温泉寺 御朱印" href="/onsenji/goshuin" fields={FIELDS as never} accent="onsenji" />
}
