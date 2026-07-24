'use client'
import SectionEditor from '@/components/admin/SectionEditor'

const J = (v: unknown) => JSON.stringify(v)

const FIELDS = [
  { key: 'shabutu_subtitle', label: '見出し（ヒーロー サブタイトル）', defaultValue: '仏様のお姿を一筆一筆、心を込めてお描きいただきます' },
  { key: 'shabutu_heading_about', label: '「写仏とは」見出し', defaultValue: '写仏とは' },
  { key: 'shabutu_about_p1', label: '写仏とは（段落1）', multiline: true, defaultValue: '写仏とは、仏様のお姿を下絵に沿って丁寧にお描きする修行です。写経と並ぶ伝統的な仏道修行のひとつで、描きながら仏様の功徳をいただき、心を落ち着けることができます。' },
  { key: 'shabutu_about_p2', label: '写仏とは（段落2）', multiline: true, defaultValue: '立木観音の写仏体験では、立木観世音菩薩のお姿をお描きいただきます。完成した写仏は記念にお持ち帰りいただけます。絵が苦手な方でも、下絵に沿って描くためどなたでもお楽しみいただけます。' },
  { key: 'shabutu_heading_contents', label: '「体験内容」見出し', defaultValue: '体験内容' },
  {
    key: 'shabutu_contents', label: '体験内容', type: 'list' as const,
    listFields: [{ key: 'title', label: 'タイトル' }, { key: 'desc', label: '説明', multiline: true }],
    defaultValue: J([
      { title: '立木観世音菩薩', desc: '下絵に沿って、立木観音のご本尊・立木観世音菩薩のお姿をお描きいただきます。完成後は銀紙特別朱印（立木観世音）とセットでお授けします。' },
    ]),
  },
  { key: 'shabutu_heading_fees', label: '「料金・所要時間」見出し', defaultValue: '料金・所要時間' },
  { key: 'shabutu_fee',  label: '体験料', defaultValue: '1,000円（特別御朱印込み）' },
  { key: 'shabutu_time', label: '所要時間', defaultValue: '約30〜60分（個人差があります）' },
  { key: 'shabutu_target', label: '対象', defaultValue: 'どなたでも（絵が苦手な方も歓迎）' },
  { key: 'shabutu_place',  label: '受付場所', defaultValue: '寺務所 体験受付窓口' },
  { key: 'shabutu_hours',  label: '受付時間', defaultValue: '拝観時間内（閉門1時間前まで）' },
  { key: 'shabutu_heading_flow', label: '「体験の流れ」見出し', defaultValue: '体験の流れ' },
  {
    key: 'shabutu_flow', label: '体験の流れ', type: 'list' as const,
    listFields: [{ key: 'title', label: 'ステップ名' }, { key: 'text', label: '説明', multiline: true }],
    defaultValue: J([
      { title: '受付', text: '寺務所 体験受付窓口にてお申し込みください。体験料をお納めいただきます。' },
      { title: '用具の準備', text: '下絵・筆・墨などをご用意します。すべて貸し出しですので手ぶらでお越しいただけます。' },
      { title: 'お描きいただきます', text: '下絵に沿って、立木観世音菩薩のお姿をゆっくりお描きください。係の者がご説明いたします。' },
      { title: '特別御朱印のお授け', text: '完成後、銀紙特別朱印（立木観世音）をお授けします。' },
      { title: 'お持ち帰り', text: '完成した写仏はお持ち帰りいただけます。大切に飾ってください。' },
    ]),
  },
  { key: 'shabutu_goshuin_note', label: '特別御朱印 補足（体験内容の下に表示）', defaultValue: '※特別御朱印は体験料に含まれています。別途購入はできません。' },
  { key: 'shabutu_heading_items', label: '「持ち物・服装」見出し', defaultValue: '持ち物・服装' },
  {
    key: 'shabutu_items', label: '持ち物・服装', type: 'list' as const,
    listFields: [{ key: 'text', label: '項目', multiline: true }],
    defaultValue: J([
      { text: '下絵・筆・墨・硯はすべてご用意しています。手ぶらでお越しください。' },
      { text: '墨が衣服につく場合がありますので、汚れてもよい服装でお越しください。' },
      { text: '完成した作品はお持ち帰りいただけます。筒状にお渡しします。' },
    ]),
  },
  { key: 'shabutu_cta_heading', label: 'CTA見出し', defaultValue: '写仏体験のご予約' },
  { key: 'shabutu_cta_sub', label: '予約ボタン下の説明文', defaultValue: '事前予約をおすすめします。当日受付も空きがあれば対応します。' },
] as const

export default function AdminChuzenjShabutu() {
  return <SectionEditor title="写仏体験" href="/experience/shabutu" fields={FIELDS as never} />
}
