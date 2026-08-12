'use client'
import SectionEditor from '@/components/admin/SectionEditor'

const J = (v: unknown) => JSON.stringify(v)

const FIELDS = [
  { key: 'wedding_subtitle', label: '見出し（ヒーロー サブタイトル）', defaultValue: 'み仏の御前で結ばれる、二人の誓い', translatable: true },
  { key: 'wedding_heading_about', label: '「仏前式とは」見出し', defaultValue: '仏前式とは', translatable: true },
  { key: 'wedding_about_p1', label: '仏前式とは（段落1）', multiline: true, defaultValue: '仏前式とは、ご本尊の御前で結婚の誓いを立てる、仏教の伝統にもとづく挙式です。神前式が神様に、教会式が神父の立ち会いのもとに誓いを立てるのに対し、仏前式ではご本尊と、これまで二人を見守ってきたご先祖様に、夫婦となることを報告し、誓いを立てます。', translatable: true },
  { key: 'wedding_about_p2', label: '仏前式とは（段落2）', multiline: true, defaultValue: '立木観音では、千手観世音菩薩を祀る本堂にて、僧侶の導きのもと厳かに式を執り行います。数珠づくり体験でも知られる念珠の授与など、当山ならではの作法も式次第に組み込んでいます。', translatable: true },
  { key: 'wedding_heading_flow', label: '「挙式の流れ」見出し', defaultValue: '挙式の流れ', translatable: true },
  {
    key: 'wedding_flow', label: '挙式の流れ', type: 'list' as const,
    listFields: [{ key: 'title', label: 'ステップ名' }, { key: 'text', label: '説明', multiline: true }],
    defaultValue: J([
      { title: '参進', text: '新郎新婦が本堂へと進み入ります。' },
      { title: '開式の辞', text: '僧侶による開式の言葉で式が始まります。' },
      { title: '三宝礼・表白', text: 'ご本尊に向かい、これより二人が夫婦になることをお伝えします。' },
      { title: '焼香・念珠授与', text: 'お香を焚き、僧侶より念珠（数珠）が新郎新婦それぞれに授けられます。' },
      { title: '誓いの言葉', text: 'ご本尊とご列席の皆様の前で、夫婦としての誓いの言葉を述べます。' },
      { title: '指輪交換', text: 'ご希望に応じて指輪の交換を行います。' },
      { title: '親族固めの杯', text: '新郎新婦とご両家が三三九度に準じた杯を交わし、両家の結びを固めます。' },
      { title: '閉式の辞', text: '僧侶の祝辞をもって式を締めくくります。' },
    ]),
    translatable: true,
    defaultValueEn: J([
      { title: 'Procession', text: 'The couple processes into the main hall.' },
      { title: 'Opening Words', text: 'A priest opens the ceremony.' },
      { title: 'Veneration & Declaration', text: 'Facing the principal image, the couple declares their union.' },
      { title: 'Incense Offering & Juzu Presentation', text: 'Incense is offered, and the priest presents a juzu prayer bracelet to each of the couple.' },
      { title: 'Exchange of Vows', text: 'The couple exchanges vows before the principal image and their guests.' },
      { title: 'Ring Exchange', text: 'Rings are exchanged, if desired.' },
      { title: 'Cup of Union', text: 'The couple and both families share a ceremonial cup, sealing the bond between the two families.' },
      { title: 'Closing Words', text: 'The priest offers closing words to conclude the ceremony.' },
    ]),
  },
  { key: 'wedding_flow_note', label: '「挙式の流れ」補足', defaultValue: '式次第はお二人のご希望に応じて一部調整が可能です。詳しくはお申し込み時にご相談ください。', translatable: true },
  { key: 'wedding_heading_details', label: '「料金・所要時間・人数」見出し', defaultValue: '料金・所要時間・人数の目安', translatable: true },
  { key: 'wedding_fee', label: '料金', defaultValue: '応相談（お問い合わせください）', translatable: true },
  { key: 'wedding_time', label: '所要時間', defaultValue: '約30〜40分', translatable: true },
  { key: 'wedding_capacity', label: 'ご列席人数の目安', defaultValue: '近親者を中心に本堂の広さに応じた人数まで', translatable: true },
  { key: 'wedding_season', label: '挙式可能時期', defaultValue: '通年（行事日・繁忙期を除く。要相談）', translatable: true },
  { key: 'wedding_place', label: '会場', defaultValue: '本堂（千手観世音菩薩 御宝前）', translatable: true },
  { key: 'wedding_heading_notes', label: '「ご注意事項」見出し', defaultValue: 'ご注意事項', translatable: true },
  {
    key: 'wedding_notes', label: 'ご注意事項', type: 'list' as const,
    listFields: [{ key: 'text', label: '項目', multiline: true }],
    defaultValue: J([
      { text: '挙式は完全予約制です。ご希望日の3ヶ月前までにお申し込みください。' },
      { text: 'ご列席は近親者を中心に、本堂の広さに応じた人数までとさせていただきます。' },
      { text: '境内・本堂での写真撮影は可能です（フラッシュ・三脚の使用は事前にご相談ください）。' },
      { text: '衣装・美容・会食・送迎の手配は含まれません。近隣の提携事業者をご紹介することも可能です。' },
      { text: '雨天・積雪時期など、季節により式次第の一部が変更となる場合があります。' },
    ]),
    translatable: true,
    defaultValueEn: J([
      { text: 'Ceremonies are by advance reservation only. Please apply at least 3 months before your preferred date.' },
      { text: 'Attendance is generally limited to close family, up to the capacity of the main hall.' },
      { text: 'Photography in the grounds and main hall is permitted (please ask in advance about flash and tripod use).' },
      { text: 'Attire, hair & makeup, the reception, and transport are not included, though we can introduce local partners.' },
      { text: 'Part of the ceremony may vary seasonally, for example during rain or snow.' },
    ]),
  },
  { key: 'wedding_cta_heading', label: 'CTA見出し', defaultValue: '仏前式のご相談・お申し込み', translatable: true },
  { key: 'wedding_cta_sub', label: 'CTA補足文', defaultValue: '挙式日はご希望をうかがったうえで調整いたします。まずはお気軽にご相談ください。', translatable: true },
] as const

export default function AdminChuzenjPrayerWedding() {
  return <SectionEditor title="仏前式（結婚式）" href="/prayer/wedding" fields={FIELDS as never} />
}
