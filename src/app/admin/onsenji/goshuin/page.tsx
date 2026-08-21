'use client'
import SectionEditor from '@/components/admin/SectionEditor'

const J = (v: unknown) => JSON.stringify(v)

const FIELDS = [
  { key: 'onsenji_goshuin_heading_info', label: '「御朱印のご案内」見出し', defaultValue: '御朱印のご案内', translatable: true },
  {
    key: 'onsenji_goshuin_items', label: '御朱印一覧（画像は固定・3件）', type: 'list' as const,
    listFields: [{ key: 'title', label: 'タイトル' }, { key: 'sub', label: '副題' }],
    defaultValue: J([
      { title: '薬師如来', sub: '温泉寺 本堂（通常御朱印）' },
      { title: '写経特別御朱印', sub: '写経体験をされた方に授与' },
      { title: '写仏特別御朱印', sub: '写仏体験をされた方に授与' },
    ]),
    translatable: true,
    defaultValueEn: J([
      { title: 'Yakushi Nyorai', sub: 'Onsenji Main Hall (Regular Goshuin)' },
      { title: 'Special Sutra Copying Stamp', sub: 'Given to those who complete the sutra copying experience' },
      { title: 'Special Buddha Tracing Stamp', sub: 'Given to those who complete the Buddhist image tracing experience' },
    ]),
  },
  { key: 'onsenji_goshuin_fee_note', label: '御朱印代・受付時間の案内', multiline: true, defaultValue: '御朱印代：500円　／　写経体験（1,000円）をお申し込みの方には特別御朱印を授与しています。\n受付時間は拝観受付終了時刻までとなります。', translatable: true },
  { key: 'onsenji_goshuin_heading_notes', label: '「御朱印についてのご注意」見出し', defaultValue: '御朱印についてのご注意', translatable: true },
  {
    key: 'onsenji_goshuin_notes', label: '御朱印についてのご注意', type: 'list' as const,
    listFields: [{ key: 'text', label: '注意事項', multiline: true }],
    defaultValue: J([
      { text: '御朱印は信仰の証です。コレクション目的でのお受け取りはご遠慮ください。' },
      { text: '受付時間は閉門30分前に終了いたします。余裕をもってお越しください。' },
      { text: '書き置きでのお渡しです。お書入れご希望の方は中禅寺立木観音までお願いします。' },
      { text: '御朱印帳に書き入れの場合は中禅寺立木観音にてお願い致します。' },
    ]),
    translatable: true,
    defaultValueEn: J([
      { text: 'A goshuin is a proof of faith — please do not request one solely for collecting purposes.' },
      { text: 'Reception closes 30 minutes before the temple closes. Please allow enough time.' },
      { text: 'Goshuin here are given pre-inscribed only. If you would like yours hand-written in your book, please visit Chuzenji Tachiki Kannon.' },
      { text: 'To have your goshuin book hand-inscribed, please visit Chuzenji Tachiki Kannon.' },
    ]),
  },
] as const

export default function AdminOnsenjGoshuin() {
  return <SectionEditor title="温泉寺 御朱印" href="/onsenji/goshuin" fields={FIELDS as never} accent="onsenji" />
}
