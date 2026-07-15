'use client'
import SectionEditor from '@/components/admin/SectionEditor'

const J = (v: unknown) => JSON.stringify(v)

const FIELDS = [
  { key: 'onsenji_shakyou_about_p1', label: '写経とは（段落1）', multiline: true, defaultValue: '写経とは、お経の文字を一文字一文字丁寧に書き写す修行です。文字を書くことで雑念を払い、心を清め、仏様との縁を結ぶとされています。' },
  { key: 'onsenji_shakyou_about_p2', label: '写経とは（段落2）', multiline: true, defaultValue: '温泉寺では薬師如来に縁の深いお経をお写しいただきます。体験後は特別御朱印をお授けします。毎日開催していますので、参拝の際にお気軽にお申し付けください。' },
  { key: 'onsenji_shakyou_fee',  label: '体験料', defaultValue: '1,000円（特別御朱印授与込み）' },
  { key: 'onsenji_shakyou_time', label: '所要時間', defaultValue: '約15分' },
  {
    key: 'onsenji_shakyou_flow', label: '体験の流れ', type: 'list' as const,
    listFields: [{ key: 'title', label: 'ステップ名' }, { key: 'text', label: '説明', multiline: true }],
    defaultValue: J([
      { title: '受付', text: '寺務所 体験受付窓口にてお申し込みください。体験料をお納めいただきます。' },
      { title: '用具の準備', text: '筆・硯・お経の手本をご用意します。すべて貸し出しですので手ぶらでお越しください。' },
      { title: 'お写しいただきます', text: 'お経の手本に沿って、一文字一文字丁寧にお写しください。係の者がご説明いたします。' },
      { title: '特別御朱印のお授け', text: '完成後、特別御朱印をお授けします。' },
    ]),
  },
  {
    key: 'onsenji_shakyou_items', label: '持ち物・服装', type: 'list' as const,
    listFields: [{ key: 'text', label: '項目', multiline: true }],
    defaultValue: J([
      { text: '筆・硯・お経の手本はすべてご用意しています。手ぶらでお越しください。' },
      { text: '汚れてもよい服装でお越しいただくとより安心です。' },
      { text: '書き損じても大丈夫です。丁寧にご指導いたします。' },
    ]),
  },
  { key: 'onsenji_shakyou_cta_sub', label: '予約ボタン下の説明文', defaultValue: '予約不要・毎日実施。参拝受付時にお申し付けください。' },
] as const

export default function AdminOnsenjShakyou() {
  return <SectionEditor title="温泉寺 写経体験" href="/onsenji/experience/shakyou" fields={FIELDS as never} accent="onsenji" />
}
