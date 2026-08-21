'use client'
import SectionEditor from '@/components/admin/SectionEditor'

const J = (v: unknown) => JSON.stringify(v)

const FIELDS = [
  { key: 'onsenji_shakyou_subtitle', label: '見出し（ヒーロー サブタイトル）', defaultValue: '心を静め、お経の文字を丁寧にお写しいただきます', translatable: true },
  { key: 'onsenji_shakyou_heading_about', label: '「写経とは」見出し', defaultValue: '写経とは', translatable: true },
  { key: 'onsenji_shakyou_about_p1', label: '写経とは（段落1）', multiline: true, defaultValue: '写経とは、お経の文字を一文字一文字丁寧に書き写す修行です。文字を書くことで雑念を払い、心を清め、仏様との縁を結ぶとされています。', translatable: true },
  { key: 'onsenji_shakyou_about_p2', label: '写経とは（段落2）', multiline: true, defaultValue: '温泉寺では薬師如来に縁の深いお経をお写しいただきます。体験後は特別御朱印をお授けします。毎日開催していますので、参拝の際にお気軽にお申し付けください。', translatable: true },
  { key: 'onsenji_shakyou_heading_contents', label: '「体験内容」見出し', defaultValue: '体験内容', translatable: true },
  { key: 'onsenji_shakyou_content_title', label: '体験内容 タイトル', defaultValue: '薬師経', translatable: true },
  { key: 'onsenji_shakyou_content_desc', label: '体験内容 説明文', multiline: true, defaultValue: 'ご本尊・薬師如来に縁の深い薬師経をお写しいただきます。お写しいただいた方には特別御朱印をお授けします。', translatable: true },
  { key: 'onsenji_shakyou_heading_fees', label: '「料金・所要時間」見出し', defaultValue: '料金・所要時間', translatable: true },
  { key: 'onsenji_shakyou_fee',  label: '体験料', defaultValue: '1,000円（特別御朱印授与込み）', translatable: true },
  { key: 'onsenji_shakyou_time', label: '所要時間', defaultValue: '約15分', translatable: true },
  { key: 'onsenji_shakyou_target', label: '対象', defaultValue: '小学生以上', translatable: true },
  { key: 'onsenji_shakyou_place', label: '受付場所', defaultValue: '玄関にて係にお申し付けください。', translatable: true },
  { key: 'onsenji_shakyou_hours', label: '受付時間', defaultValue: '拝観時間内（閉門1時間前まで）', translatable: true },
  { key: 'onsenji_shakyou_heading_flow', label: '「体験の流れ」見出し', defaultValue: '体験の流れ', translatable: true },
  {
    key: 'onsenji_shakyou_flow', label: '体験の流れ', type: 'list' as const,
    listFields: [{ key: 'title', label: 'ステップ名' }, { key: 'text', label: '説明', multiline: true }],
    defaultValue: J([
      { title: '受付', text: '玄関にて係にお申し付けください。体験料をお納めいただきます。' },
      { title: '用具の準備', text: '手ぶらでお越しください。' },
      { title: 'お写しいただきます', text: 'お経の手本に沿って、一文字一文字丁寧にお写しください。' },
      { title: '特別御朱印のお授け', text: '完成後、特別御朱印をお授けします。' },
      { title: '書き終えた御朱印について', text: '納められた写経は、御本尊 薬師如来に奉じ8月8日に行われる【温泉寺薬師講『採灯大護摩供』】にてお焚き上げされます。' },
    ]),
    translatable: true,
    defaultValueEn: J([
      { title: 'Reception', text: 'Please ask staff at the entrance and pay the experience fee.' },
      { title: 'Preparing Materials', text: 'Please come empty-handed.' },
      { title: 'Copying the Sutra', text: 'Following the sutra template, carefully copy each character one by one.' },
      { title: 'Receiving the Special Goshuin', text: 'Upon completion, you will receive a special goshuin stamp.' },
      { title: 'About Your Completed Sutra', text: 'Sutras you copy are offered to Yakushi Nyorai, the principal image, and ritually burned on August 8 at the "Onsenji Yakushi-ko Saito Grand Goma Ceremony."' },
    ]),
  },
  { key: 'onsenji_shakyou_heading_items', label: '「持ち物・服装」見出し', defaultValue: '持ち物・服装', translatable: true },
  {
    key: 'onsenji_shakyou_items', label: '持ち物・服装', type: 'list' as const,
    listFields: [{ key: 'text', label: '項目', multiline: true }],
    defaultValue: J([
      { text: '筆・硯・お経の手本はすべてご用意しています。手ぶらでお越しください。' },
      { text: '汚れてもよい服装でお越しいただくとより安心です。' },
      { text: '書き損じても大丈夫です。丁寧にご指導いたします。' },
    ]),
    translatable: true,
    defaultValueEn: J([
      { text: 'Brushes, inkstones, and sutra templates are all provided. Please come empty-handed.' },
      { text: "It's reassuring to wear clothing you don't mind getting ink on." },
      { text: "Don't worry about making mistakes — our staff will guide you carefully." },
    ]),
  },
  { key: 'onsenji_shakyou_cta_heading', label: 'CTA見出し', defaultValue: '写経体験のご予約・お問い合わせ', translatable: true },
  { key: 'onsenji_shakyou_cta_sub', label: '予約ボタン下の説明文', defaultValue: '予約不要・毎日実施。玄関にてお申し付けください。', translatable: true },
] as const

export default function AdminOnsenjShakyou() {
  return <SectionEditor title="温泉寺 写経体験" href="/onsenji/experience/shakyou" fields={FIELDS as never} accent="onsenji" />
}
