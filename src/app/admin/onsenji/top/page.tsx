'use client'
import SectionEditor from '@/components/admin/SectionEditor'

const FIELDS = [
  { key: 'onsenji_hero_en',    label: 'ヒーロー 英語サブタイトル', defaultValue: 'Nikkozan Onsenji Temple' },
  { key: 'onsenji_hero_title', label: 'ヒーロー メインキャッチコピー（改行可）', multiline: true, defaultValue: '千二百余年の祈りを宿す\n薬師の霊場' },
  { key: 'onsenji_hero_sub',   label: 'ヒーロー サブコピー', multiline: true, defaultValue: '世界遺産・日光山輪王寺の別院。薬師瑠璃光如来のご加護と、大地から湧く温泉の癒しを' },
  { key: 'onsenji_about_title', label: '「温泉寺について」見出し', defaultValue: '温泉寺について' },
  { key: 'onsenji_about_body',  label: '「温泉寺について」本文', multiline: true, defaultValue: '日光山温泉寺は、延暦7年（788年）に勝道上人によって開かれた世界遺産「日光山輪王寺」の別院です。ご本尊は薬師瑠璃光如来で、健康増進・延命長寿のご利益で知られています。江戸時代には輪王寺宮の直轄寺院として栄え、現在も多くの参拝者が訪れます。' },
  { key: 'onsenji_access_address', label: 'アクセス 所在地', defaultValue: '栃木県日光市湯元2559' },
  { key: 'onsenji_access_car',  label: 'アクセス お車での説明', multiline: true, defaultValue: '日光宇都宮道路 日光ICより約10分\n境内周辺に有料駐車場あり' },
  { key: 'onsenji_access_bus',  label: 'アクセス バスでの説明', multiline: true, defaultValue: '東武日光駅・JR日光駅よりバスで「西参道」バス停下車、徒歩約10分\nまたは「表参道」バス停より徒歩約15分' },
] as const

export default function AdminOnsenjTop() {
  return <SectionEditor title="温泉寺 トップページ" href="/onsenji" fields={FIELDS as never} accent="onsenji" />
}
