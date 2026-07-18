'use client'
import SectionEditor from '@/components/admin/SectionEditor'

const J = (v: unknown) => JSON.stringify(v)

const FIELDS = [
  { key: 'jyuzu_about_p1', label: '数珠づくりとは（段落1）', multiline: true, defaultValue: '数珠（じゅず）は、仏様を礼拝するときに手に持つ法具です。当山の数珠づくり体験では、天然石・天然木の珠からご自由に組み合わせを選び、世界にひとつだけのオリジナル数珠（ブレスレット）をお作りいただけます。' },
  { key: 'jyuzu_about_p2', label: '数珠づくりとは（段落2）', multiline: true, defaultValue: '職員が丁寧にご説明しますので、どなたでも簡単にお作りいただけます。僧侶がご祈祷したものを当日お守りとしてお持ち帰りいただけます。' },
  { key: 'jyuzu_days', label: '開催日', defaultValue: '毎日開催（法要時は中止となる場合があります）' },
  { key: 'jyuzu_hours_summer', label: '体験時間（4月〜10月）', defaultValue: '4月〜10月：9:00〜15:00' },
  { key: 'jyuzu_hours_winter', label: '体験時間（11月〜3月）', defaultValue: '11月〜3月：9:00〜14:00' },
  { key: 'jyuzu_fee',  label: '体験料', defaultValue: '2,000円〜（使用素材により異なります）' },
  { key: 'jyuzu_time', label: '所要時間', defaultValue: '約30分' },
  { key: 'jyuzu_price_note', label: '料金についての補足', multiline: true, defaultValue: 'お選びいただく珠の素材・組み合わせによって料金が異なります。詳しくは下記サンプルをご覧ください。' },
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
    key: 'jyuzu_samples', label: 'サンプル（価格例）', type: 'list' as const,
    listFields: [{ key: 'price', label: '価格' }, { key: 'desc', label: '組み合わせ' }],
    defaultValue: J([
      { price: '2,000円', desc: '天然木' },
      { price: '4,000円', desc: '天然石、天然木' },
      { price: '6,000円', desc: '天然石' },
    ]),
  },
  {
    key: 'jyuzu_materials', label: '珠の素材', type: 'list' as const,
    listFields: [{ key: 'name', label: '素材名' }, { key: 'desc', label: '説明', multiline: true }],
    defaultValue: J([
      { name: '天然木', desc: '軽くて使いやすい木の珠。温かみのある手触りが特徴です。' },
      { name: '天然石', desc: '色とりどりの天然石の珠。お好みの色でお選びいただけます。' },
    ]),
  },
  {
    key: 'jyuzu_notes', label: 'ご注意・持ち物', type: 'list' as const,
    listFields: [{ key: 'text', label: '項目', multiline: true }],
    defaultValue: J([
      { text: '数珠はすべてブレスレットタイプです。' },
      { text: '参拝料（拝観料）は別途お求めください。' },
      { text: '僧侶がご祈祷したものを当日お守りとしてお持ち帰りいただけます。僧侶が不在の場合、後日ご祈祷後郵送いたします（郵送料は当寺負担）。' },
      { text: '団体でお越しの際は事前にお電話ください。' },
    ]),
  },
  { key: 'jyuzu_cta_sub', label: '予約ボタン下の説明文', defaultValue: '毎日開催しております。団体でお越しの際は事前にお電話ください。' },
] as const

export default function AdminChuzenjJyuzu() {
  return <SectionEditor title="数珠づくり体験" href="/experience/jyuzu" fields={FIELDS as never} />
}
