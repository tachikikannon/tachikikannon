'use client'
import SectionEditor from '@/components/admin/SectionEditor'

const J = (v: unknown) => JSON.stringify(v)

const FIELDS = [
  { key: 'zazen_subtitle', label: '見出し（ヒーロー サブタイトル）', defaultValue: '静寂の中で心を調える、坐禅のひとときをお過ごしください', translatable: true },
  { key: 'zazen_heading_about', label: '「坐禅とは」見出し', defaultValue: '坐禅とは', translatable: true },
  { key: 'zazen_about_p1', label: '坐禅とは（段落1）', multiline: true, defaultValue: '坐禅とは、静かに座り呼吸を整えながら心を調える、伝統的な修行法です。姿勢と呼吸を整えることで、日々の雑念から離れ、静かなひとときを過ごすことができます。', translatable: true, defaultValueEn: 'Zazen is a traditional Zen practice of sitting quietly while regulating your breath and settling your mind. By steadying your posture and breathing, you can step away from daily distractions and spend a quiet moment.' },
  { key: 'zazen_about_p2', label: '坐禅とは（段落2）', multiline: true, defaultValue: '中禅寺の坐禅体験では、初めての方にも僧侶が丁寧に作法をご指導しますので、どなたでも安心してご参加いただけます。', translatable: true },
  { key: 'zazen_heading_fees', label: '「料金・所要時間」見出し', defaultValue: '料金・所要時間', translatable: true },
  { key: 'zazen_fee',  label: '体験料', defaultValue: '2,000円', translatable: true },
  { key: 'zazen_time', label: '所要時間', defaultValue: '30~40分', translatable: true, defaultValueEn: '30~40 minutes' },
  { key: 'zazen_target', label: '対象', defaultValue: '小学生以上（小学生は保護者同伴）', translatable: true },
  { key: 'zazen_capacity', label: '人数', defaultValue: '2〜10名', translatable: true },
  { key: 'zazen_place',  label: '受付場所', defaultValue: '本堂 体験受付窓口', translatable: true, defaultValueEn: 'Main Hall Experience Counter' },
  { key: 'zazen_hours_peak', label: '受付時間（4月〜10月）', defaultValue: '4月〜10月：13:00〜14:00', translatable: true, defaultValueEn: 'April–October: 1:00 PM–2:00 PM' },
  { key: 'zazen_hours_shoulder', label: '受付時間（3月・11月）', defaultValue: '3月・11月：13:00〜14:00', translatable: true, defaultValueEn: 'March & November: 1:00 PM–2:00 PM' },
  { key: 'zazen_hours_winter', label: '受付時間（12月〜2月）', defaultValue: '12月〜2月：13:00', translatable: true, defaultValueEn: 'December–February: 1:00 PM' },
  { key: 'zazen_heading_flow', label: '「体験の流れ」見出し', defaultValue: '体験の流れ', translatable: true },
  {
    key: 'zazen_flow', label: '体験の流れ', type: 'list' as const,
    listFields: [{ key: 'title', label: 'ステップ名' }, { key: 'text', label: '説明', multiline: true }],
    defaultValue: J([
      { title: '受付', text: '本堂体験受付窓口にてお申し込みください。体験料をお納めいただきます。\n本堂、五大堂お参りの後、座禅体験となります（会場は五大堂、お座の間）' },
      { title: '作法のご説明', text: '姿勢の整え方・呼吸法など、坐禅の基本作法を僧侶が丁寧にご説明します。' },
      { title: '坐禅', text: '静寂の中、20分間坐禅を行います。' },
      { title: '終了・退堂', text: '終了の合図とともに、静かに退堂いたします。' },
    ]),
    translatable: true,
    defaultValueEn: J([
      { title: 'Reception', text: 'Please apply at the Main Hall experience reception counter and pay the experience fee.\nAfter visiting the Main Hall and Godaido Hall, the zazen session begins (held in the Oza-no-ma room of Godaido Hall).' },
      { title: 'Guidance on Form', text: 'A priest will carefully explain the basic posture and breathing method of zazen.' },
      { title: 'Zazen', text: 'Sit in silent meditation for 20 minutes.' },
      { title: 'Closing', text: 'At the closing signal, quietly leave the hall.' },
    ]),
  },
  { key: 'zazen_heading_items', label: '「ご注意・持ち物」見出し', defaultValue: 'ご注意・持ち物', translatable: true },
  {
    key: 'zazen_items', label: 'ご注意・持ち物', type: 'list' as const,
    listFields: [{ key: 'text', label: '項目', multiline: true }],
    defaultValue: J([
      { text: '動きやすい服装でお越しください（きつい服装は避けてください）。' },
      { text: '携帯電話の電源はお切りいただくか、マナーモードにしてください。' },
      { text: '正座・あぐらでの着座が難しい方は椅子坐禅にも対応しますので、受付にご相談ください。' },
    ]),
    translatable: true,
    defaultValueEn: J([
      { text: 'Please wear comfortable, loose-fitting clothing.' },
      { text: 'Please turn off your phone or set it to silent mode.' },
      { text: 'If sitting on the floor is difficult, chair-based zazen is also available — please ask at reception.' },
    ]),
  },
  { key: 'zazen_heading_gallery', label: '「体験の様子」写真ギャラリーの見出し', defaultValue: '坐禅体験の様子', translatable: true },
  { key: 'zazen_cta_heading', label: 'CTA見出し', defaultValue: '坐禅体験のご予約', translatable: true },
  { key: 'zazen_cta_sub', label: '予約ボタン下の説明文', defaultValue: '事前予約をおすすめします。当日受付も空きがあれば対応します。', translatable: true },
] as const

export default function AdminChuzenjZazen() {
  return <SectionEditor title="坐禅体験" href="/experience/zazen" fields={FIELDS as never} />
}
