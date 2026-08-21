'use client'
import SectionEditor from '@/components/admin/SectionEditor'

const J = (v: unknown) => JSON.stringify(v)

const FIELDS = [
  { key: 'wedding_subtitle', label: '見出し（ヒーロー サブタイトル）', defaultValue: 'み仏の御前で結ばれる、二人の誓い', translatable: true },
  { key: 'wedding_heading_about', label: '「仏前式とは」見出し', defaultValue: '仏前式とは', translatable: true },
  { key: 'wedding_about_p1', label: '仏前式とは（段落1）', multiline: true, defaultValue: '仏前式とは、ご本尊の御前で結婚の誓いを立てる、仏教の伝統にもとづく挙式です。神前式が神様に、教会式が神父の立ち会いのもとに誓いを立てるのに対し、仏前式ではご本尊と、これまで二人を見守ってきたご先祖様に、夫婦となることを報告し、誓いを立てます。', translatable: true },
  { key: 'wedding_about_p2', label: '仏前式とは（段落2）', multiline: true, defaultValue: '中禅寺では、五大堂にて、僧侶の導きのもと厳かに式を執り行います。', translatable: true, defaultValueEn: 'At Chuzenji, the ceremony is solemnly conducted in the Godaido Hall, guided by a priest.' },
  { key: 'wedding_heading_flow', label: '「挙式の流れ」見出し', defaultValue: '挙式の流れ', translatable: true },
  {
    key: 'wedding_flow', label: '挙式の流れ', type: 'list' as const,
    listFields: [{ key: 'title', label: 'ステップ名' }, { key: 'text', label: '説明', multiline: true }],
    defaultValue: J([
      { title: '参進', text: '新郎新婦が五大堂内陣へと進み入ります。' },
      { title: '開式の辞', text: '開式の言葉で式が始まります。' },
      { title: '三礼', text: '五大明王様に礼拝をします。' },
      { title: '勧請', text: '僧侶による仏さまをお招きする作法を致します。' },
      { title: '敬白', text: '仏様神様に結婚の意義を報告し、ご両人を始めとし皆様が守られるようにお唱えをいたします。' },
      { title: '三帰依文', text: '生活において最も重要な２つの言葉をお授けします。' },
      { title: '念珠授与', text: '念珠を戒師様より授与致します。' },
      { title: '盃の儀', text: '三三九度の盃を交わします。' },
      { title: '聖句授与', text: '戒師より仏様の尊い教え、聖句の授与。' },
      { title: '証明授与', text: '結婚式の証明書をお渡しいたします。' },
      { title: '宣誓・献花', text: '新郎新婦に誓いの言葉を述べていただき、結婚式の締めくくりといたしまして、本尊様に花を捧げていただきます。' },
      { title: '両家親族寿杯', text: 'ご両家皆様の堅めの盃を行います。' },
      { title: '慶祝戒師法話・円成宣言', text: '戒師様からの法話と円成宣言を行い終了となります。' },
      { title: '記念撮影', text: '五大堂にてお二人の写真及びご親族皆様との集合写真を撮影いたします。' },
    ]),
    translatable: true,
    defaultValueEn: J([
      { title: 'Procession', text: 'The couple processes into the hall.' },
      { title: 'Opening Address', text: 'A priest opens the ceremony with an address.' },
      { title: 'Three Bows', text: 'Bows are made in reverence to the Five Wisdom Kings.' },
      { title: 'Invocation', text: 'The priest performs a rite inviting the Buddha\'s presence.' },
      { title: 'Declaration', text: 'The significance of the marriage is reported to the Buddhas and deities, with prayers offered for the protection of the couple and all present.' },
      { title: 'The Three Refuges', text: 'Two of the most important words for daily life are bestowed upon the couple.' },
      { title: 'Juzu Presentation', text: 'The priest presents the juzu prayer beads made together by the couple.' },
      { title: 'Cup Ceremony', text: 'The couple exchanges the ceremonial san-san-kudo cups.' },
      { title: 'Sacred Verse Presentation', text: 'The priest bestows a sacred verse from the Buddha\'s precious teachings.' },
      { title: 'Certificate Presentation', text: 'A certificate of marriage is presented.' },
      { title: 'Vows & Flower Offering', text: 'The couple recites their vows, and as the ceremony concludes, offers flowers to the principal image.' },
      { title: 'Cup of Union Between Families', text: 'Both families share a ceremonial cup, sealing their bond.' },
      { title: 'Priest\'s Blessing & Declaration of Completion', text: 'The priest offers a congratulatory talk and declares the ceremony complete.' },
      { title: 'Commemorative Photos', text: 'Photos of the couple and a group photo with family are taken in the Godaido Hall.' },
    ]),
  },
  { key: 'wedding_flow_note', label: '「挙式の流れ」補足', defaultValue: '式次第はお二人のご希望に応じて一部調整が可能です。詳しくはお申し込み時にご相談ください。', translatable: true },
  { key: 'wedding_heading_details', label: '「料金・所要時間・人数」見出し', defaultValue: '料金・所要時間・人数の目安', translatable: true },
  { key: 'wedding_fee', label: '料金', defaultValue: '15万～（念珠込み）', translatable: true, defaultValueEn: 'From ¥150,000 (includes juzu prayer beads)' },
  { key: 'wedding_time', label: '所要時間', defaultValue: '約30〜40分', translatable: true },
  { key: 'wedding_capacity', label: 'ご列席人数の目安', defaultValue: '近親者を中心に五大堂の広さに応じた人数まで', translatable: true, defaultValueEn: 'Close family, up to the capacity of the Godaido Hall' },
  { key: 'wedding_season', label: '挙式可能時期', defaultValue: '通年（行事日・繁忙期を除く。要相談）', translatable: true },
  { key: 'wedding_place', label: '会場', defaultValue: '五大堂（五大明王 御宝前）', translatable: true, defaultValueEn: 'Godaido Hall (before the Five Wisdom Kings)' },
  { key: 'wedding_heading_notes', label: '「ご注意事項」見出し', defaultValue: 'ご注意事項', translatable: true },
  {
    key: 'wedding_notes', label: 'ご注意事項', type: 'list' as const,
    listFields: [{ key: 'text', label: '項目', multiline: true }],
    defaultValue: J([
      { text: '挙式は完全予約制です。ご希望日の3ヶ月前までにお申し込みください。' },
      { text: 'ご列席は近親者を中心に、五大堂内陣の広さに応じた人数（約40名）までとさせていただきます。' },
      { text: '境内・五大堂での写真撮影は可能です（フラッシュ・三脚の使用は事前にご相談ください）。' },
      { text: '衣装・美容・会食・送迎の手配は含まれません。あくまで法要のみ。' },
      { text: '雨天・積雪時期など、季節により式次第の一部が変更となる場合があります。' },
    ]),
    translatable: true,
    defaultValueEn: J([
      { text: 'Ceremonies are by advance reservation only. Please apply at least 3 months before your preferred date.' },
      { text: 'Attendance is generally limited to close family, up to approximately 40 guests depending on the capacity of the Godaido Hall\'s inner sanctuary.' },
      { text: 'Photography in the grounds and Godaido Hall is permitted (please ask in advance about flash and tripod use).' },
      { text: 'Attire, hair & makeup, the reception, and transport are not included — this is a religious ceremony only.' },
      { text: 'Part of the ceremony may vary seasonally, for example during rain or snow.' },
    ]),
  },
  { key: 'wedding_cta_heading', label: 'CTA見出し', defaultValue: '仏前式のご相談・お申し込み', translatable: true },
  { key: 'wedding_cta_sub', label: 'CTA補足文', defaultValue: '挙式日はご希望をうかがったうえで調整いたします。まずはお気軽にご相談ください。', translatable: true },
] as const

export default function AdminChuzenjPrayerWedding() {
  return <SectionEditor title="仏前式（結婚式）" href="/prayer/wedding" fields={FIELDS as never} />
}
