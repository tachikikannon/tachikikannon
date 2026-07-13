'use client'
import SectionEditor from '@/components/admin/SectionEditor'

const J = (v: unknown) => JSON.stringify(v)

const FIELDS = [
  { key: 'shabutu_about_p1', label: '写仏とは（段落1）', multiline: true, defaultValue: '写仏とは、仏様のお姿を下絵に沿って丁寧にお描きする修行です。写経と並ぶ伝統的な仏道修行のひとつで、描きながら仏様の功徳をいただき、心を落ち着けることができます。' },
  { key: 'shabutu_about_p2', label: '写仏とは（段落2）', multiline: true, defaultValue: '立木観音の写仏体験では、立木観世音菩薩のお姿をお描きいただきます。完成した写仏は記念にお持ち帰りいただけます。絵が苦手な方でも、下絵に沿って描くためどなたでもお楽しみいただけます。' },
  { key: 'shabutu_fee',  label: '体験料', defaultValue: '1,000円（特別御朱印込み）' },
  { key: 'shabutu_time', label: '所要時間', defaultValue: '約30〜60分（個人差があります）' },
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
  {
    key: 'shabutu_items', label: '持ち物・服装', type: 'list' as const,
    listFields: [{ key: 'text', label: '項目', multiline: true }],
    defaultValue: J([
      { text: '下絵・筆・墨・硯はすべてご用意しています。手ぶらでお越しください。' },
      { text: '墨が衣服につく場合がありますので、汚れてもよい服装でお越しください。' },
      { text: '完成した作品はお持ち帰りいただけます。筒状にお渡しします。' },
    ]),
  },
  { key: 'shabutu_cta_sub', label: '予約ボタン下の説明文', defaultValue: '事前予約をおすすめします。当日受付も空きがあれば対応します。' },
] as const

export default function AdminChuzenjShabutu() {
  return <SectionEditor title="写仏体験" href="/experience/shabutu" fields={FIELDS as never} />
}
