'use client'
import SectionEditor from '@/components/admin/SectionEditor'

const J = (v: unknown) => JSON.stringify(v)

const FIELDS = [
  { key: 'annual_events_subtitle', label: '見出し（ヒーロー サブタイトル）', defaultValue: '毎年恒例の法要・行事のご案内' },
  {
    key: 'annual_events_list', label: '行事一覧（画像・リンク先は固定・2件）', type: 'list' as const,
    listFields: [
      { key: 'month', label: '月（バッジ表示）' },
      { key: 'date', label: '開催日' },
      { key: 'time', label: '開始時間' },
      { key: 'name', label: '行事名' },
      { key: 'desc', label: '説明', multiline: true },
    ],
    defaultValue: J([
      { month: '6月', date: '6月18日', time: '午前10時〜', name: '観音講・大護摩供・地蔵流し', desc: '毎年6月18日に、ご信徒の皆様にご参列いただいての大法要を執り行います。観音講・波之利大黒天堂大護摩供に続き、中禅寺湖にてお地蔵様を湖上に流す「地蔵流し」を行います。' },
      { month: '8月', date: '8月4日', time: '午前10時〜', name: '船禅頂（ふなぜんじょう）', desc: '日光開山 勝道上人の霊跡を船で巡拝する伝統行事です。中禅寺湖を舞台に、上人が切り開いた修験の道を水上から辿ります。湖上から望む男体山と中禅寺の景観とともに、千二百余年の歴史に思いを馳せる特別な体験です。' },
    ]),
  },
] as const

export default function AdminAnnualEvents() {
  return <SectionEditor title="年間行事一覧" href="/annual-events" fields={FIELDS as never} />
}
