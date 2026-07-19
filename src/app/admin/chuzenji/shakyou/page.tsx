'use client'
import SectionEditor from '@/components/admin/SectionEditor'

const J = (v: unknown) => JSON.stringify(v)

const FIELDS = [
  { key: 'shakyou_subtitle', label: '見出し（ヒーロー サブタイトル）', defaultValue: '心を静め、お経の文字を丁寧にお写しいただきます' },
  { key: 'shakyou_heading_about', label: '「写経とは」見出し', defaultValue: '写経とは' },
  { key: 'shakyou_about_p1', label: '写経とは（段落1）', multiline: true, defaultValue: '写経とは、お経の文字を一文字一文字丁寧に書き写す修行です。文字を書くことで雑念を払い、心を清め、仏様との縁を結ぶとされています。' },
  { key: 'shakyou_about_p2', label: '写経とは（段落2）', multiline: true, defaultValue: '立木観音では、十六文字のお経（延命十句観音経・懺悔文）をお写しいただきます。短いお経のため、筆を持ったことのない方でも約15分でお写しいただけます。' },
  { key: 'shakyou_heading_contents', label: '「体験内容」見出し', defaultValue: '体験内容' },
  {
    key: 'shakyou_contents', label: '体験内容', type: 'list' as const,
    listFields: [{ key: 'icon', label: 'アイコン（絵文字）' }, { key: 'title', label: 'タイトル' }, { key: 'desc', label: '説明', multiline: true }],
    defaultValue: J([
      { icon: '📜', title: '延命十句観音経', desc: '観音様のお力を借り、長寿・安全を祈るお経。十六文字を丁寧にお写しいただきます。' },
      { icon: '✍️', title: '懺悔文', desc: '過去の罪業を懺悔し、心を清めるお経。金紙特別御朱印（大日如来）とセットです。' },
    ]),
  },
  { key: 'shakyou_heading_fees', label: '「料金・所要時間」見出し', defaultValue: '料金・所要時間' },
  { key: 'shakyou_fee',  label: '体験料', defaultValue: '1,000円（特別御朱印込み）' },
  { key: 'shakyou_time', label: '所要時間', defaultValue: '約15分' },
  { key: 'shakyou_target', label: '対象', defaultValue: 'どなたでも（筆が初めての方も歓迎）' },
  { key: 'shakyou_place',  label: '受付場所', defaultValue: '寺務所 体験受付窓口' },
  { key: 'shakyou_hours',  label: '受付時間', defaultValue: '拝観時間内（閉門1時間前まで）' },
  { key: 'shakyou_heading_goshuin', label: '「特別御朱印」見出し', defaultValue: '写経体験 特別御朱印' },
  {
    key: 'shakyou_goshuin_items', label: '特別御朱印一覧', type: 'list' as const,
    listFields: [{ key: 'title', label: 'タイトル' }, { key: 'sub', label: '説明' }, { key: 'badge', label: 'バッジ文言' }],
    defaultValue: J([
      { title: '金紙特別朱印 立木大悲殿', sub: '延命十句観音経をお写しいただいた方にお授けします。', badge: '延命十句観音経' },
      { title: '金紙特別御朱印 大日如来', sub: '懺悔文をお写しいただいた方にお授けします。', badge: '懺悔文' },
    ]),
  },
  { key: 'shakyou_goshuin_note', label: '特別御朱印 補足', defaultValue: '※特別御朱印は体験料に含まれています。別途購入はできません。' },
  { key: 'shakyou_heading_items', label: '「持ち物・服装」見出し', defaultValue: '持ち物・服装' },
  {
    key: 'shakyou_items', label: '持ち物・服装', type: 'list' as const,
    listFields: [{ key: 'text', label: '項目', multiline: true }],
    defaultValue: J([
      { text: '筆・硯・お経の手本はすべてご用意しています。手ぶらでお越しください。' },
      { text: '汚れてもよい服装でお越しいただくとより安心です。' },
      { text: '書き損じても大丈夫です。丁寧にご指導いたします。' },
    ]),
  },
  { key: 'shakyou_cta_heading', label: 'CTA見出し', defaultValue: '写経体験のご予約' },
  { key: 'shakyou_cta_sub', label: '予約ボタン下の説明文', defaultValue: '事前予約をおすすめします。当日受付も空きがあれば対応します。' },
] as const

export default function AdminChuzenjShakyou() {
  return <SectionEditor title="写経体験" href="/experience/shakyou" fields={FIELDS as never} />
}
