'use client'
import SectionEditor from '@/components/admin/SectionEditor'

const J = (v: unknown) => JSON.stringify(v)

const FIELDS = [
  { key: 'onsenji_jyuzu_subtitle', label: '見出し（ヒーロー サブタイトル）', defaultValue: '世界にひとつだけの数珠を、自分の手でつくります' },
  { key: 'onsenji_jyuzu_heading_about', label: '「数珠づくりとは」見出し', defaultValue: '数珠づくりとは' },
  { key: 'onsenji_jyuzu_about_p1', label: '数珠づくりとは（段落1）', multiline: true, defaultValue: '数珠（じゅず）は、仏様を礼拝するときに手に持つ法具です。温泉寺の数珠づくり体験では、複数の珠の種類からお好みの組み合わせを選び、自分だけのオリジナル数珠をお作りいただけます。' },
  { key: 'onsenji_jyuzu_about_p2', label: '数珠づくりとは（段落2）', multiline: true, defaultValue: '完成した数珠は薬師如来の前でご祈願いただいた後にお持ち帰りいただけます。参拝・法要などさまざまな場面でお使いいただけます。' },
  { key: 'onsenji_jyuzu_heading_fees', label: '「料金・所要時間」見出し', defaultValue: '料金・所要時間' },
  { key: 'onsenji_jyuzu_fee',  label: '体験料', defaultValue: '2,000円〜（珠の素材・組み合わせにより異なります）' },
  { key: 'onsenji_jyuzu_time', label: '所要時間', defaultValue: '約60〜90分' },
  { key: 'onsenji_jyuzu_target', label: '対象', defaultValue: '小学生以上（小学生は保護者同伴）' },
  { key: 'onsenji_jyuzu_place', label: '受付場所', defaultValue: '寺務所 体験受付窓口' },
  { key: 'onsenji_jyuzu_hours', label: '受付時間', defaultValue: '拝観時間内（閉門1時間30分前まで）' },
  { key: 'onsenji_jyuzu_price_note_label', label: '料金補足の見出し', defaultValue: '料金について' },
  { key: 'onsenji_jyuzu_price_note', label: '料金についての補足', multiline: true, defaultValue: 'お選びいただく珠の素材・数・組み合わせによって料金が異なります。詳しくは受付窓口またはお問い合わせフォームよりご確認ください。' },
  { key: 'onsenji_jyuzu_heading_flow', label: '「体験の流れ」見出し', defaultValue: '体験の流れ' },
  {
    key: 'onsenji_jyuzu_flow', label: '体験の流れ', type: 'list' as const,
    listFields: [{ key: 'title', label: 'ステップ名' }, { key: 'text', label: '説明', multiline: true }],
    defaultValue: J([
      { title: '受付・デザイン選択', text: '寺務所 体験受付窓口にてお申し込み。珠の素材や色の組み合わせをお選びいただきます。' },
      { title: '珠の確認', text: '選んでいただいた珠を確認し、体験台へご案内します。' },
      { title: '数珠づくり', text: 'スタッフのご説明に沿って、珠を糸に通していきます。結び方もご指導します。' },
      { title: '完成・お持ち帰り', text: '完成した数珠はその場でお持ち帰りいただけます。専用の袋に入れてお渡しします。' },
    ]),
  },
  { key: 'onsenji_jyuzu_heading_materials', label: '「珠の素材について」見出し', defaultValue: '珠の素材について' },
  { key: 'onsenji_jyuzu_materials_note', label: '珠の素材 注意書き', defaultValue: '珠の種類は季節・入荷状況により変わります。当日の受付窓口でご確認ください。' },
  {
    key: 'onsenji_jyuzu_materials', label: '珠の素材', type: 'list' as const,
    listFields: [{ key: 'name', label: '素材名' }, { key: 'desc', label: '説明', multiline: true }],
    defaultValue: J([
      { name: '水晶', desc: '透明感があり、邪気を払う浄化の石として知られます。' },
      { name: '翡翠', desc: '緑の美しい石。長寿・健康・魔除けの功徳があるとされます。' },
      { name: '木珠', desc: '軽くて使いやすい伝統的な珠。温かみのある手触りが特徴です。' },
    ]),
  },
  { key: 'onsenji_jyuzu_cta_heading', label: 'CTA見出し', defaultValue: '数珠づくり体験のご予約・お問い合わせ' },
  { key: 'onsenji_jyuzu_cta_sub', label: '予約ボタン下の説明文', defaultValue: '材料の準備がありますので、事前のご予約をお願いします。' },
] as const

export default function AdminOnsenjJyuzu() {
  return <SectionEditor title="温泉寺 数珠づくり体験" href="/onsenji/experience/jyuzu" fields={FIELDS as never} accent="onsenji" />
}
