'use client'
import SectionEditor from '@/components/admin/SectionEditor'

const J = (v: unknown) => JSON.stringify(v)

const FIELDS = [
  { key: 'annual_events_subtitle', label: '見出し（ヒーロー サブタイトル）', defaultValue: '毎年恒例の法要・行事のご案内', translatable: true },
  {
    key: 'annual_events_list', label: '行事一覧（画像・リンク先は固定・3件）', type: 'list' as const,
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
      { month: '1月', date: '1月1日', time: '午前0時〜', name: '正月元旦特別護摩祈願', desc: '新しい年の始まりにあたり、皆様の一年の無病息災・家内安全・交通安全･開運招福･合格祈願･厄除けなどを祈願する特別な護摩祈祷です。御札は5,000円〜30,000円よりお選びいただけます。事前申し込み・最大5名まで同時申込可。' },
    ]),
    translatable: true,
    defaultValueEn: J([
      { month: 'June', date: 'June 18', time: 'From 10:00 AM', name: 'Kannonko, Grand Goma Fire Ritual & Jizo Nagashi', desc: 'Every June 18, a grand ceremony is held with devotees in attendance. Following the Kannonko service and the grand goma fire ritual at Hashiri Daikokuten Hall, Jizo statues are floated on Lake Chuzenji in the "Jizo Nagashi" ceremony.' },
      { month: 'August', date: 'August 4', time: 'From 10:00 AM', name: 'Funazenjyo (Boat Pilgrimage)', desc: 'A traditional event tracing the sacred sites of Priest Shodo, who opened Nikko, by boat. On Lake Chuzenji, participants retrace the ascetic path he carved out, viewed from the water. A special experience reflecting on over 1,200 years of history amid views of Mt. Nantai and Chuzenji.' },
      { month: 'January', date: 'January 1', time: 'From 12:00 AM', name: 'New Year\'s Day Special Goma Prayer', desc: 'At the start of the new year, a special goma fire prayer for good health, household safety, traffic safety, good fortune, success in exams, and protection from misfortune throughout the year. Ofuda talismans range from ¥5,000 to ¥30,000. Advance application required; up to 5 people per application.' },
    ]),
  },
] as const

export default function AdminAnnualEvents() {
  return <SectionEditor title="年間行事一覧" href="/annual-events" fields={FIELDS as never} />
}
