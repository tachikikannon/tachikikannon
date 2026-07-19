'use client'
import SectionEditor from '@/components/admin/SectionEditor'

const J = (v: unknown) => JSON.stringify(v)

const FIELDS = [
  { key: 'onsenji_about_subtitle', label: '見出し（ヒーロー サブタイトル）', defaultValue: '拝観時間・参拝料のご案内' },
  { key: 'onsenji_about_heading_hours', label: '「拝観時間・参拝料」見出し', defaultValue: '拝観時間・参拝料' },
  { key: 'onsenji_about_hours_open',   label: '拝観時間', defaultValue: '8時00分〜17時00分' },
  { key: 'onsenji_about_fee', label: '参拝料', defaultValue: '無料' },
  { key: 'onsenji_about_hours_winter', label: '冬季休業期間', defaultValue: '12月〜4月上旬は冬季休業。閉湯・開湯の日程は公式ホームページをご確認ください。' },
  { key: 'onsenji_about_heading_notes', label: '「ご参拝の注意事項」見出し', defaultValue: 'ご参拝の注意事項' },
  {
    key: 'onsenji_about_notes', label: 'ご参拝の注意事項', type: 'list' as const,
    listFields: [{ key: 'text', label: '注意事項', multiline: true }],
    defaultValue: J([
      { text: '境内では静粛にお過ごしください。' },
      { text: '撮影は外観のみ可能です。本堂内は撮影禁止となっております。' },
      { text: 'ペットの同伴は境内に限り可能です。堂内へのお連れ込みはご遠慮ください。' },
      { text: '足元が不安定な箇所があります。歩きやすい靴でお越しください。' },
    ]),
  },
] as const

export default function AdminOnsenjAbout() {
  return <SectionEditor title="温泉寺 拝観案内" href="/onsenji/about" fields={FIELDS as never} accent="onsenji" />
}
