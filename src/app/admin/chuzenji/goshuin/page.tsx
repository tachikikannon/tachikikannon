'use client'
import SectionEditor from '@/components/admin/SectionEditor'

const J = (v: unknown) => JSON.stringify(v)

const FIELDS = [
  { key: 'goshuin_heading_regular', label: '「御朱印」見出し', defaultValue: '御朱印', translatable: true },
  { key: 'goshuin_intro', label: '御朱印セクションの説明文', multiline: true, defaultValue: '御朱印は御朱印所にてお受けいただけます。\nなお、特別朱印は写経･写仏体験後に寺務所 体験受付窓口にてお渡しいたします', translatable: true, defaultValueEn: 'Goshuin stamps can be received at the goshuin counter.\nSpecial goshuin are given at the temple office experience counter after the sutra-copying or Buddha-tracing experience.' },
  {
    key: 'goshuin_regular', label: '通常御朱印（画像は固定・4件）', type: 'list' as const,
    listFields: [{ key: 'title', label: 'タイトル' }],
    defaultValue: J([
      { title: '立木大悲殿' }, { title: 'ご詠歌' }, { title: '波之利大黒天' }, { title: '金剛閣' },
    ]),
    translatable: true,
    defaultValueEn: J([
      { title: 'Tachiki Daihiden' }, { title: 'Goeika' }, { title: 'Hashiri Daikokuten' }, { title: 'Kongokaku' },
    ]),
  },
  { key: 'goshuin_fee_note', label: '御朱印代・受付時間の案内', multiline: true, defaultValue: '御朱印代：各500円　／　書き入れ・書き置きともに同じ金額です。\n受付時間は拝観時間に準じます（閉門30分前に終了）。', translatable: true },
  { key: 'goshuin_heading_special', label: '「特別御朱印」見出し', defaultValue: '写経・写仏体験 特別御朱印', translatable: true },
  { key: 'goshuin_special_intro', label: '特別御朱印 説明文', defaultValue: '写経・写仏体験とセットでお受けいただける特別な御朱印です。', translatable: true },
  { key: 'goshuin_special_price', label: '特別御朱印 価格表示', defaultValue: '体験料込み 各1,000円', translatable: true },
  {
    key: 'goshuin_special', label: '特別御朱印一覧（画像は固定・3件）', type: 'list' as const,
    listFields: [{ key: 'label', label: '区分（写経／写仏）' }, { key: 'title', label: 'タイトル' }, { key: 'sub', label: '副題' }, { key: 'desc', label: '説明', multiline: true }],
    defaultValue: J([
      { label: '写経', title: '金紙特別朱印', sub: '立木大悲殿', desc: '十六文字写経（延命十句観音経）をお書きいただいた方にお授けします。' },
      { label: '写経', title: '金紙特別御朱印', sub: '大日如来', desc: '十六文字写経（懺悔文）をお書きいただいた方にお授けします。' },
      { label: '写仏', title: '銀紙特別朱印', sub: '立木観世音', desc: '写仏をお書きいただいた方にお授けします。' },
    ]),
    translatable: true,
    defaultValueEn: J([
      { label: 'Sutra Copying', title: 'Gold Paper Special Stamp', sub: 'Tachiki Daihiden', desc: 'Given to those who copy the 16-character Enmei Jikku Kannon Sutra.' },
      { label: 'Sutra Copying', title: 'Gold Paper Special Stamp', sub: 'Dainichi Nyorai', desc: 'Given to those who copy the 16-character Repentance Sutra.' },
      { label: 'Buddha Tracing', title: 'Silver Paper Special Stamp', sub: 'Tachiki Kanzeon', desc: 'Given to those who complete a Buddha-image tracing.' },
    ]),
  },
  { key: 'goshuin_special_place', label: '特別御朱印 受付場所', defaultValue: '受付場所：寺務所 体験受付窓口', translatable: true },
  { key: 'goshuin_special_note',  label: '特別御朱印 補足', defaultValue: '※特別御朱印の種類は今後追加される場合があります。', translatable: true },
  { key: 'goshuin_heading_notes', label: '「ご注意」見出し', defaultValue: '御朱印についてのご注意', translatable: true },
  {
    key: 'goshuin_notes', label: '御朱印についてのご注意', type: 'list' as const,
    listFields: [{ key: 'text', label: '注意事項', multiline: true }],
    defaultValue: J([
      { text: '御朱印は信仰の証です。コレクション目的でのお受け取りはご遠慮ください。' },
      { text: '閉門時刻の30分ほど前までを目安に、余裕をもってお越しください。' },
      { text: '書き入れは混雑時にお時間をいただく場合がございます。' },
      { text: '御朱印帳をお持ちでない方には書き置きもございます。' },
    ]),
    translatable: true,
    defaultValueEn: J([
      { text: 'A goshuin is a proof of faith — please do not request one solely for collecting purposes.' },
      { text: 'Please arrive with time to spare, aiming to be here by around 30 minutes before closing time.' },
      { text: 'Hand-written stamps may take extra time during busy periods.' },
      { text: 'Pre-inscribed stamps are also available for those without a goshuin book.' },
    ]),
  },
] as const

export default function AdminChuzenjGoshuin() {
  return <SectionEditor title="御朱印" href="/goshuin" fields={FIELDS as never} />
}
