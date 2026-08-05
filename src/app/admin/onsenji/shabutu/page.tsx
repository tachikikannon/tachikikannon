'use client'
import SectionEditor from '@/components/admin/SectionEditor'

const J = (v: unknown) => JSON.stringify(v)

const FIELDS = [
  { key: 'onsenji_shabutu_subtitle', label: '見出し（ヒーロー サブタイトル）', defaultValue: '仏様のお姿を一筆一筆、心を込めてお描きいただきます', translatable: true },
  { key: 'onsenji_shabutu_heading_about', label: '「写仏とは」見出し', defaultValue: '写仏とは', translatable: true },
  { key: 'onsenji_shabutu_about_p1', label: '写仏とは（段落1）', multiline: true, defaultValue: '写仏とは、仏様のお姿を下絵に沿って丁寧にお描きする修行です。写経と並ぶ伝統的な仏道修行のひとつで、描きながら仏様の功徳をいただき、心を落ち着けることができます。', translatable: true },
  { key: 'onsenji_shabutu_about_p2', label: '写仏とは（段落2）', multiline: true, defaultValue: '温泉寺の写仏体験では、ご本尊・薬師如来のお姿をお描きいただきます。完成した写仏は記念にお持ち帰りいただけます。絵が苦手な方でも、下絵に沿って描くためどなたでもお楽しみいただけます。', translatable: true },
  { key: 'onsenji_shabutu_heading_contents', label: '「体験内容」見出し', defaultValue: '体験内容', translatable: true },
  { key: 'onsenji_shabutu_content_title', label: '体験内容 タイトル', defaultValue: '薬師如来', translatable: true },
  { key: 'onsenji_shabutu_content_desc', label: '体験内容 説明文', multiline: true, defaultValue: '下絵に沿って、ご本尊・薬師如来のお姿をお描きいただきます。完成後は特別御朱印とセットでお授けします。', translatable: true },
  { key: 'onsenji_shabutu_heading_fees', label: '「料金・所要時間」見出し', defaultValue: '料金・所要時間', translatable: true },
  { key: 'onsenji_shabutu_fee',  label: '体験料', defaultValue: '1,000円（御朱印込み）', translatable: true },
  { key: 'onsenji_shabutu_time', label: '所要時間', defaultValue: '約30〜60分（個人差があります）', translatable: true },
  { key: 'onsenji_shabutu_target', label: '対象', defaultValue: 'どなたでも（絵が苦手な方も歓迎）', translatable: true },
  { key: 'onsenji_shabutu_place', label: '受付場所', defaultValue: '寺務所 体験受付窓口', translatable: true },
  { key: 'onsenji_shabutu_hours', label: '受付時間', defaultValue: '拝観時間内（閉門1時間前まで）', translatable: true },
  { key: 'onsenji_shabutu_heading_flow', label: '「体験の流れ」見出し', defaultValue: '体験の流れ', translatable: true },
  {
    key: 'onsenji_shabutu_flow', label: '体験の流れ', type: 'list' as const,
    listFields: [{ key: 'title', label: 'ステップ名' }, { key: 'text', label: '説明', multiline: true }],
    defaultValue: J([
      { title: '受付', text: '寺務所 体験受付窓口にてお申し込みください。体験料をお納めいただきます。' },
      { title: '用具の準備', text: '下絵・筆・墨などをご用意します。すべて貸し出しですので手ぶらでお越しいただけます。' },
      { title: 'お描きいただきます', text: '下絵に沿って、薬師如来のお姿をゆっくりお描きください。係の者がご説明いたします。' },
      { title: '特別御朱印のお授け', text: '完成後、特別御朱印をお授けします。' },
      { title: 'お持ち帰り', text: '完成した写仏はお持ち帰りいただけます。大切に飾ってください。' },
    ]),
    translatable: true,
    defaultValueEn: J([
      { title: 'Reception', text: 'Please apply at the Temple Office experience reception counter and pay the experience fee.' },
      { title: 'Preparing Materials', text: 'A template, brush, ink, and other materials are provided — all on loan, so you may come empty-handed.' },
      { title: 'Tracing the Image', text: "Following the template, slowly trace the figure of Yakushi Nyorai. Our staff will guide you." },
      { title: 'Receiving the Special Goshuin', text: 'Upon completion, you will receive a special goshuin stamp.' },
      { title: 'Taking It Home', text: 'You may take your completed tracing home. Please display it with care.' },
    ]),
  },
  { key: 'onsenji_shabutu_cta_heading', label: 'CTA見出し', defaultValue: '写仏体験のご予約・お問い合わせ', translatable: true },
  { key: 'onsenji_shabutu_cta_sub', label: '予約ボタン下の説明文', defaultValue: '事前予約をおすすめします。当日受付も空きがあれば対応します。', translatable: true },
] as const

export default function AdminOnsenjShabutu() {
  return <SectionEditor title="温泉寺 写仏体験" href="/onsenji/experience/shabutu" fields={FIELDS as never} accent="onsenji" />
}
