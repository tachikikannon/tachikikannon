'use client'
import SectionEditor from '@/components/admin/SectionEditor'

const J = (v: unknown) => JSON.stringify(v)

const FIELDS = [
  { key: 'onsenji_about_fee_adult', label: '大人 志納金', defaultValue: '500円' },
  { key: 'onsenji_about_fee_child', label: '小人 志納金', defaultValue: '300円' },
  { key: 'onsenji_about_hours_open',   label: '受付・参篭時間', defaultValue: '受付：8時00分〜16時00分　／　参篭時間：8時00分〜17時00分' },
  { key: 'onsenji_about_hours_winter', label: '冬季休業期間', defaultValue: '12月〜4月上旬は冬季休業。閉湯・開湯の日程は公式ホームページをご確認ください。' },
  {
    key: 'onsenji_about_flow', label: '参拝の流れ', type: 'list' as const,
    listFields: [{ key: 'title', label: 'ステップ名' }, { key: 'text', label: '説明', multiline: true }],
    defaultValue: J([
      { title: '拝観受付', text: '入口にて志納金をお納めください。大人500円・小人300円。受付は参篭終了1時間前に終了いたします。' },
      { title: '本堂参拝', text: 'ご本尊・薬師瑠璃光如来（医王如来）にお参りください。健康増進・延命長寿をお祈りいただけます。' },
      { title: '薬師の湯', text: '参拝後は「薬師の湯」（令和8年4月開湯）をご利用いただけます。志納金に含まれています。タオルをご持参ください。' },
      { title: '御朱印・写経体験', text: '御朱印（500円）・写経体験（1,000円・特別御朱印授与）はお気軽にお申し付けください。' },
    ]),
  },
  { key: 'onsenji_about_onsen_note', label: '薬師の湯 補足説明', multiline: true, defaultValue: '「薬師の湯」は令和8年4月11日より開湯しました。泉質は含硫黄‐カルシウム・ナトリウム‐硫酸塩・炭酸水素塩泉（泉温71.4℃）の完全かけ流し。加水すると乳白色に変わる神秘的な湯です。タオルをご持参ください。' },
  {
    key: 'onsenji_about_notes', label: 'ご参拝の注意事項', type: 'list' as const,
    listFields: [{ key: 'text', label: '注意事項', multiline: true }],
    defaultValue: J([
      { text: '境内では静粛にお過ごしください。' },
      { text: '撮影は外観のみ可能です。本堂内は撮影禁止となっております。' },
      { text: 'ペットの同伴は境内に限り可能です。堂内へのお連れ込みはご遠慮ください。' },
      { text: '薬師の湯（温泉）はご参拝の方がご利用いただけます。タオルをご持参ください。' },
      { text: '足元が不安定な箇所があります。歩きやすい靴でお越しください。' },
    ]),
  },
] as const

export default function AdminOnsenjAbout() {
  return <SectionEditor title="温泉寺 拝観案内" href="/onsenji/about" fields={FIELDS as never} accent="onsenji" />
}
