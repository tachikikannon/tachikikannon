'use client'
import SectionEditor from '@/components/admin/SectionEditor'

const J = (v: unknown) => JSON.stringify(v)

const FIELDS = [
  { key: 'jyuzu_about_p1', label: '数珠づくりとは（段落1）', multiline: true, defaultValue: '数珠（じゅず）は、仏様を礼拝するときに手に持つ法具で、煩悩の数である108つの珠が一般的です。珠には天然石・木材・水晶などさまざまな素材があり、素材によって異なる功徳があるとされています。' },
  { key: 'jyuzu_about_p2', label: '数珠づくりとは（段落2）', multiline: true, defaultValue: '立木観音の数珠づくり体験では、複数の珠の種類からお好みの組み合わせを選び、自分だけのオリジナル数珠をお作りいただけます。完成した数珠は参拝・法要などさまざまな場面でお使いいただけます。' },
  { key: 'jyuzu_fee',  label: '体験料', defaultValue: '2,000円〜（珠の素材・組み合わせにより異なります）' },
  { key: 'jyuzu_time', label: '所要時間', defaultValue: '約60〜90分' },
  { key: 'jyuzu_price_note', label: '料金についての補足', multiline: true, defaultValue: 'お選びいただく珠の素材・数・組み合わせによって料金が異なります。詳しくは受付窓口またはお問い合わせフォームよりご確認ください。' },
  {
    key: 'jyuzu_flow', label: '体験の流れ', type: 'list' as const,
    listFields: [{ key: 'title', label: 'ステップ名' }, { key: 'text', label: '説明', multiline: true }],
    defaultValue: J([
      { title: '受付・デザイン選択', text: '寺務所 体験受付窓口にてお申し込み。珠の素材や色の組み合わせをお選びいただきます。' },
      { title: '珠の確認', text: '選んでいただいた珠を確認し、体験台へご案内します。' },
      { title: '数珠づくり', text: 'スタッフのご説明に沿って、珠を糸に通していきます。結び方もご指導します。' },
      { title: '完成・お持ち帰り', text: '完成した数珠はその場でお持ち帰りいただけます。専用の袋に入れてお渡しします。' },
    ]),
  },
  {
    key: 'jyuzu_materials', label: '珠の素材', type: 'list' as const,
    listFields: [{ key: 'name', label: '素材名' }, { key: 'desc', label: '説明', multiline: true }],
    defaultValue: J([
      { name: '水晶', desc: '透明感があり、邪気を払う浄化の石として知られます。' },
      { name: '翡翠', desc: '緑の美しい石。長寿・健康・魔除けの功徳があるとされます。' },
      { name: '木珠', desc: '軽くて使いやすい伝統的な珠。温かみのある手触りが特徴です。' },
    ]),
  },
  {
    key: 'jyuzu_notes', label: 'ご注意・持ち物', type: 'list' as const,
    listFields: [{ key: 'text', label: '項目', multiline: true }],
    defaultValue: J([
      { text: '事前予約をお願いします。当日受付は材料が揃っている場合のみ対応します。' },
      { text: '小学生のお子様は保護者の方のご同伴が必要です。' },
      { text: '道具はすべてご用意します。手ぶらでお越しください。' },
      { text: '完成品は専用袋に入れてお持ち帰りいただけます。' },
    ]),
  },
  { key: 'jyuzu_cta_sub', label: '予約ボタン下の説明文', defaultValue: '材料の準備がありますので、事前のご予約をお願いします。' },
] as const

export default function AdminChuzenjJyuzu() {
  return <SectionEditor title="数珠づくり体験" href="/experience/jyuzu" fields={FIELDS as never} />
}
