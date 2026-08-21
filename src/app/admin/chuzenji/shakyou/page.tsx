'use client'
import SectionEditor from '@/components/admin/SectionEditor'

const J = (v: unknown) => JSON.stringify(v)

const FIELDS = [
  { key: 'shakyou_subtitle', label: '見出し（ヒーロー サブタイトル）', defaultValue: '心を静め、お経の文字を丁寧にお写しいただきます', translatable: true },
  { key: 'shakyou_heading_about', label: '「写経とは」見出し', defaultValue: '写経とは', translatable: true },
  { key: 'shakyou_about_p1', label: '写経とは（段落1）', multiline: true, defaultValue: '写経とは、お経の文字を一文字一文字丁寧に書き写す修行です。文字を書くことで雑念を払い、心を清め、仏様との縁を結ぶとされています。', translatable: true },
  { key: 'shakyou_about_p2', label: '写経とは（段落2）', multiline: true, defaultValue: '立木観音では、十六文字のお経（延命十句観音経）または二十八文字の御経（懺悔文）をお写しいただきます。短いお経のため、約15分でお写しいただけます。', translatable: true, defaultValueEn: 'At Tachiki Kannon, you will copy either a 16-character sutra (the Enmei Jikku Kannon Gyo) or a 28-character sutra (the Sange-mon repentance verse). As these are short sutras, the experience takes about 15 minutes.' },
  { key: 'shakyou_heading_contents', label: '「体験内容」見出し', defaultValue: '体験内容', translatable: true },
  {
    key: 'shakyou_contents', label: '体験内容', type: 'list' as const,
    listFields: [{ key: 'icon', label: 'アイコン（絵文字）' }, { key: 'title', label: 'タイトル' }, { key: 'desc', label: '説明', multiline: true }],
    defaultValue: J([
      { icon: '📜', title: '延命十句観音経', desc: '観音様念じることで、心を穏やかにし、人を思いやる生き方につながるお経。十六文字を丁寧にお写しいただきます。金紙特別御朱印（立木大悲殿）とセットです。' },
      { icon: '✍️', title: '懺悔文', desc: '過去の罪業を懺悔し、心を清めるお経。二八文字を丁寧にお写しいただきます。金紙特別御朱印（大日如来）とセットです。' },
    ]),
    translatable: true,
    defaultValueEn: J([
      { icon: '📜', title: 'Enmei Jikku Kannon Sutra', desc: 'A sutra that, through invoking Kannon, calms the heart and guides you toward a life of compassion for others. You will carefully copy its 16 characters. Paired with a gold-paper special goshuin (Tachiki Daihiden).' },
      { icon: '✍️', title: 'Sange-mon (Repentance Verse)', desc: 'A sutra to repent past wrongdoing and purify the heart. You will carefully copy its 28 characters. Paired with a gold-paper special goshuin (Dainichi Nyorai).' },
    ]),
  },
  { key: 'shakyou_heading_flow', label: '「体験の流れ」見出し', defaultValue: '体験の流れ', translatable: true },
  {
    key: 'shakyou_flow', label: '体験の流れ', type: 'list' as const,
    listFields: [{ key: 'title', label: 'ステップ名' }, { key: 'text', label: '説明', multiline: true }],
    defaultValue: J([
      { title: '受付', text: '寺務所体験窓口にてお申し込みください。体験料をお納めいただきます。' },
      { title: '用具の準備', text: '写経用紙の入ったクリアファイルと筆をご用意しますので、お教室にそのままお持ちください。' },
      { title: '体験', text: '一文字一文字丁寧に、薄墨になっているところをお書入れください。' },
      { title: '特別朱印のお授け', text: '体験終了後、三宝（木の台）に写経を収め、クリアファイルと筆を寺務所にお返しください。引き換えに御朱印をお授けします。' },
    ]),
    translatable: true,
    defaultValueEn: J([
      { title: 'Reception', text: 'Please apply at the Temple Office experience counter and pay the experience fee.' },
      { title: 'Preparing Materials', text: 'A clear folder with a sutra sheet and a brush will be prepared — please bring them as is to the copying room.' },
      { title: 'Copying', text: 'Carefully trace over the light-gray printed characters, one by one.' },
      { title: 'Receiving the Special Goshuin', text: 'After finishing, place your sutra on the wooden offering stand and return the clear folder and brush to the Temple Office. You will receive a goshuin stamp in exchange.' },
    ]),
  },
  { key: 'shakyou_heading_fees', label: '「料金・所要時間」見出し', defaultValue: '料金・所要時間', translatable: true },
  { key: 'shakyou_fee',  label: '体験料', defaultValue: '1,000円（特別御朱印込み）', translatable: true },
  { key: 'shakyou_time', label: '所要時間', defaultValue: '約15分', translatable: true },
  { key: 'shakyou_target', label: '対象', defaultValue: '小学生以上', translatable: true, defaultValueEn: 'Elementary school age and up' },
  { key: 'shakyou_place',  label: '受付場所', defaultValue: '寺務所 体験受付窓口', translatable: true },
  { key: 'shakyou_hours',  label: '受付時間', defaultValue: '拝観時間内（閉門1時間前まで）', translatable: true },
  { key: 'shakyou_goshuin_note', label: '特別御朱印 補足（体験内容の下に表示）', defaultValue: '※特別御朱印は体験料に含まれています。別途購入はできません。', translatable: true },
  { key: 'shakyou_heading_items', label: '「持ち物・服装」見出し', defaultValue: '持ち物・服装', translatable: true },
  {
    key: 'shakyou_items', label: '持ち物・服装', type: 'list' as const,
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
  { key: 'shakyou_cta_heading', label: 'CTA見出し', defaultValue: '写経体験のご予約', translatable: true },
  { key: 'shakyou_cta_sub', label: '予約ボタン下の説明文', defaultValue: '事前予約をおすすめします。当日受付も空きがあれば対応します。', translatable: true },
] as const

export default function AdminChuzenjShakyou() {
  return <SectionEditor title="写経体験" href="/experience/shakyou" fields={FIELDS as never} />
}
