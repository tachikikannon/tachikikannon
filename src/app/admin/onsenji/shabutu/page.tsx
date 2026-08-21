'use client'
import SectionEditor from '@/components/admin/SectionEditor'

const J = (v: unknown) => JSON.stringify(v)

const FIELDS = [
  { key: 'onsenji_shabutu_subtitle', label: '見出し（ヒーロー サブタイトル）', defaultValue: '仏様のお姿を一筆一筆、心を込めてお描きいただきます', translatable: true },
  { key: 'onsenji_shabutu_heading_about', label: '「写仏とは」見出し', defaultValue: '写仏とは', translatable: true },
  { key: 'onsenji_shabutu_about_p1', label: '写仏とは（段落1）', multiline: true, defaultValue: '写仏とは、仏様のお姿を下絵に沿って丁寧にお描きする修行です。写経と並ぶ伝統的な仏道修行のひとつで、描きながら仏様の功徳をいただき、心を落ち着けることができます。', translatable: true },
  { key: 'onsenji_shabutu_about_p2', label: '写仏とは（段落2）', multiline: true, defaultValue: '温泉寺の写仏体験では、ご本尊・薬師如来のお姿をお描きいただきます。絵が苦手な方でも、下絵に沿って描くためどなたでもお楽しみいただけます。', translatable: true },
  { key: 'onsenji_shabutu_heading_contents', label: '「体験内容」見出し', defaultValue: '体験内容', translatable: true },
  { key: 'onsenji_shabutu_content_title', label: '体験内容 タイトル', defaultValue: '薬師如来', translatable: true },
  { key: 'onsenji_shabutu_content_desc', label: '体験内容 説明文', multiline: true, defaultValue: '下絵に沿って、ご本尊・薬師如来のお姿をお描きいただきます。完成後は特別御朱印とセットでお授けします。', translatable: true },
  { key: 'onsenji_shabutu_heading_fees', label: '「料金・所要時間」見出し', defaultValue: '料金・所要時間', translatable: true },
  { key: 'onsenji_shabutu_fee',  label: '体験料', defaultValue: '1,000円（御朱印込み）', translatable: true },
  { key: 'onsenji_shabutu_time', label: '所要時間', defaultValue: '約20〜30分（個人差があります）', translatable: true },
  { key: 'onsenji_shabutu_target', label: '対象', defaultValue: 'どなたでも（絵が苦手な方も歓迎）', translatable: true },
  { key: 'onsenji_shabutu_place', label: '受付場所', defaultValue: '玄関にて係にお申し付けください。', translatable: true },
  { key: 'onsenji_shabutu_hours', label: '受付時間', defaultValue: '拝観時間内（閉門1時間前まで）', translatable: true },
  { key: 'onsenji_shabutu_heading_flow', label: '「体験の流れ」見出し', defaultValue: '体験の流れ', translatable: true },
  {
    key: 'onsenji_shabutu_flow', label: '体験の流れ', type: 'list' as const,
    listFields: [{ key: 'title', label: 'ステップ名' }, { key: 'text', label: '説明', multiline: true }],
    defaultValue: J([
      { title: '受付', text: '寺務所体験窓口にてお申込みください。体験料を収めていただきます。' },
      { title: '用具の準備', text: '写仏用紙の入ったクリアファイルと筆をご用意しますので、お教室にそのままお持ちください。' },
      { title: '体験', text: '下絵に沿って、薬師瑠璃光如来のお姿をゆっくりお描きください。' },
      { title: '特別御朱印のお授け', text: '体験終了後、三宝（木の台）に写仏を収め、クリアファイルと筆を寺務所にお返しください。引き換えに御朱印をお授けします。' },
      { title: '描き終えた写仏について', text: '納められた写仏は、御本尊 薬師如来に奉じ8月8日に行われる【温泉寺薬師講『採灯大護摩供』】にてお焚き上げされます。' },
    ]),
    translatable: true,
    defaultValueEn: J([
      { title: 'Reception', text: 'Please apply at the Temple Office experience counter and pay the experience fee.' },
      { title: 'Preparing Materials', text: 'We will provide a clear file containing the tracing paper and a brush — please bring them with you to the drawing room.' },
      { title: 'The Experience', text: 'Following the printed outline, slowly trace the image of Yakushi Rurikou Nyorai.' },
      { title: 'Receiving the Special Goshuin', text: 'When you finish, place your tracing on the sanbo (wooden offering stand) and return the clear file and brush to the Temple Office. You will receive a goshuin stamp in exchange.' },
      { title: 'About Your Completed Tracing', text: 'Tracings you leave with us are offered to Yakushi Nyorai, the principal image, and ritually burned on August 8 at the "Onsenji Yakushi-ko Saito Grand Goma Ceremony."' },
    ]),
  },
  { key: 'onsenji_shabutu_cta_heading', label: 'CTA見出し', defaultValue: '写仏体験のご予約・お問い合わせ', translatable: true },
  { key: 'onsenji_shabutu_cta_sub', label: '予約ボタン下の説明文', defaultValue: '事前予約をおすすめします。当日受付も空きがあれば対応します。', translatable: true },
] as const

export default function AdminOnsenjShabutu() {
  return <SectionEditor title="温泉寺 写仏体験" href="/onsenji/experience/shabutu" fields={FIELDS as never} accent="onsenji" />
}
