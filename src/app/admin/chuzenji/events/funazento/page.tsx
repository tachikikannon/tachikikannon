'use client'
import SectionEditor from '@/components/admin/SectionEditor'

const J = (v: unknown) => JSON.stringify(v)

const FIELDS = [
  { key: 'funazento_subtitle', label: '見出し（ヒーロー サブタイトル）', defaultValue: '毎年8月4日　午前10時より　※事前申し込み必要' },
  { key: 'funazento_heading_about', label: '「行事について」見出し', defaultValue: '行事について' },
  { key: 'funazento_about', label: '行事について（説明文）', multiline: true, defaultValue: '船禅頂（ふなぜんじょう）は、日光山を開いた勝道上人（737〜817）が中禅寺湖を舟で渡り、湖上から霊峰・男体山を遙拝したという故事に由来する伝統行事です。' },
  { key: 'funazento_info_date', label: '開催日（カード表示）', defaultValue: '8月4日（毎年）' },
  { key: 'funazento_info_time', label: '開始時間（カード表示）', defaultValue: '午前10時〜' },
  { key: 'funazento_info_join', label: '参加（カード表示）', defaultValue: '事前申し込み必要' },
  { key: 'funazento_heading_gallery', label: '「行事の様子」見出し', defaultValue: '行事の様子' },
  { key: 'funazento_heading_notes', label: '「ご参加にあたって」見出し', defaultValue: 'ご参加にあたって' },
  {
    key: 'funazento_notes', label: 'ご参加にあたって', type: 'list' as const,
    listFields: [{ key: 'text', label: '注意事項', multiline: true }],
    defaultValue: J([
      { text: '事前の申し込みが必要です。定員になり次第締め切りますので、お早めにお申し込みください。' },
      { text: '御札をお授けいたします。お支払いは当日・現地にてお受けいたします。' },
      { text: '動きやすく濡れても構わない服装でお越しください。湖上は気温が低い場合がありますので、上に羽織るものをご持参ください。' },
      { text: '天候・状況により内容が変更・中止となる場合がございます。詳細はお電話にてご確認ください。' },
    ]),
  },
  { key: 'funazento_cta_heading', label: 'CTA見出し', defaultValue: '船禅頂 お申し込み' },
  { key: 'funazento_cta_text', label: 'CTA説明文（改行はそのまま反映されます）', multiline: true, defaultValue: '定員になり次第締め切ります。\n御札授与あり・お支払いは当日現地にて。' },
] as const

export default function AdminFunazento() {
  return <SectionEditor title="立木観音 船禅頂（8/4）" href="/annual-events/funazento" fields={FIELDS as never} />
}
