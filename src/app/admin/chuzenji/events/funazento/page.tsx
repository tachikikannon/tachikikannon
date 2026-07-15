'use client'
import SectionEditor from '@/components/admin/SectionEditor'

const J = (v: unknown) => JSON.stringify(v)

const FIELDS = [
  { key: 'funazento_about', label: '行事について（説明文）', multiline: true, defaultValue: '船禅頂（ふなぜんじょう）は、日光山を開いた勝道上人（737〜817）が中禅寺湖を舟で渡り、湖上から霊峰・男体山を遙拝したという故事に由来する伝統行事です。' },
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
] as const

export default function AdminFunazento() {
  return <SectionEditor title="立木観音 船禅頂（8/4）" href="/annual-events/funazento" fields={FIELDS as never} />
}
