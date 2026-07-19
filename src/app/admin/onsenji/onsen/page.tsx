'use client'
import SectionEditor from '@/components/admin/SectionEditor'

const FIELDS = [
  { key: 'onsenji_onsen_subtitle', label: '見出し（ヒーロー サブタイトル）', defaultValue: '令和8年4月11日 開湯' },
  { key: 'onsenji_onsen_heading_about', label: '「薬師の湯について」見出し', defaultValue: '薬師の湯について' },
  { key: 'onsenji_onsen_about', label: '薬師の湯について（説明文）', multiline: true, defaultValue: '「薬師の湯」は延暦7年（788年）の開創以来、薬師瑠璃光如来のご加護のもと守り続けられてきた霊泉です。令和8年4月11日に参拝者への開放が始まりました。薬師如来の御加護と温泉の癒しを同時にいただける、温泉寺ならではの体験です。' },
  { key: 'onsenji_onsen_heading_quality', label: '「泉質・料金」見出し', defaultValue: '泉質・料金' },
  { key: 'onsenji_onsen_quality', label: '泉質', defaultValue: '含硫黄‐カルシウム・ナトリウム‐硫酸塩・炭酸水素塩泉' },
  { key: 'onsenji_onsen_temp', label: '泉温', defaultValue: '71.4℃' },
  { key: 'onsenji_onsen_flow', label: '湯の種類', defaultValue: '完全かけ流し（加水あり）' },
  { key: 'onsenji_onsen_color', label: '湯の色', defaultValue: '加水すると乳白色に変わります' },
  { key: 'onsenji_onsen_hours', label: '利用時間', multiline: true, defaultValue: '8時00分〜17時00分（受付：8時00分〜16時00分）\n※12月〜4月上旬は冬季休業' },
  { key: 'onsenji_onsen_fee_note', label: '料金', defaultValue: '志納金（大人500円・小人300円）に含まれます。別途料金はかかりません。' },
  { key: 'onsenji_onsen_heading_notes', label: '「ご利用の注意」見出し', defaultValue: 'ご利用の注意' },
  { key: 'onsenji_onsen_note', label: 'ご利用の注意（本文）', multiline: true, defaultValue: 'タオルをご持参ください。貸し出しは行っておりません。' },
] as const

export default function AdminOnsenjOnsen() {
  return <SectionEditor title="温泉寺 薬師の湯（温泉）" href="/onsenji/onsen" fields={FIELDS as never} accent="onsenji" />
}
