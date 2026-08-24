'use client'
import SectionEditor from '@/components/admin/SectionEditor'

const J = (v: unknown) => JSON.stringify(v)

const FIELDS = [
  { key: 'shogatsu_subtitle', label: '見出し（ヒーロー サブタイトル）', defaultValue: '毎年1月1日　午前0時より　※事前申し込み必要', translatable: true },
  { key: 'shogatsu_heading_about', label: '「行事について」見出し', defaultValue: '行事について', translatable: true },
  { key: 'shogatsu_about', label: '行事について（説明文）', multiline: true, defaultValue: '正月元旦特別護摩祈願は、新しい年の始まりにあたり、皆様の一年の無病息災・家内安全・開運招福を祈願する特別な護摩祈祷です。元日、僧侶による厳かな護摩焚きとともに、新年の平安と幸福をお祈りいたします。御札は4種類の中からお選びいただき、お申し込み時にお願い事を2つまでお選びいただけます。', translatable: true },
  { key: 'shogatsu_info_date', label: '開催日（カード表示）', defaultValue: '1月1日（毎年）', translatable: true },
  { key: 'shogatsu_info_time', label: '開始時間（カード表示）', defaultValue: '午前0時〜', translatable: true },
  { key: 'shogatsu_info_join', label: '参加（カード表示）', defaultValue: '事前申し込み必要（最大5名まで）', translatable: true },
  { key: 'shogatsu_heading_schedule', label: '「タイムスケジュール」見出し', defaultValue: 'タイムスケジュール', translatable: true },
  {
    key: 'shogatsu_schedule', label: 'タイムスケジュール', type: 'list' as const,
    listFields: [{ key: 'time', label: '時間' }, { key: 'title', label: '行事名' }, { key: 'desc', label: '説明', multiline: true }],
    defaultValue: J([]),
    translatable: true,
    defaultValueEn: J([]),
  },
  { key: 'shogatsu_heading_fees', label: '「御札の種類」見出し', defaultValue: '御札の種類', translatable: true },
  {
    key: 'shogatsu_fees', label: '御札の種類（テーブル・申し込みフォームの選択肢とは別管理）', type: 'list' as const,
    listFields: [
      { key: 'price', label: '御祈願料' },
      { key: 'size', label: '御札サイズ' },
      { key: 'weight_g', label: '重量（g・代引き送料の自動計算に使用。日本語版の数値のみ有効で、英語版の欄は使用されません）' },
    ],
    defaultValue: J([
      { price: '5,000円', size: '28㎝', weight_g: '' },
      { price: '10,000円', size: '32㎝', weight_g: '' },
      { price: '20,000円', size: '38㎝', weight_g: '' },
      { price: '30,000円', size: '42.5㎝', weight_g: '' },
    ]),
    translatable: true,
    defaultValueEn: J([
      { price: '5,000円', size: '28㎝', weight_g: '' },
      { price: '10,000円', size: '32㎝', weight_g: '' },
      { price: '20,000円', size: '38㎝', weight_g: '' },
      { price: '30,000円', size: '42.5㎝', weight_g: '' },
    ]),
  },
  { key: 'shogatsu_heading_notes', label: '「ご参加にあたって」見出し', defaultValue: 'ご参加にあたって', translatable: true },
  {
    key: 'shogatsu_notes', label: 'ご参加にあたって', type: 'list' as const,
    listFields: [{ key: 'text', label: '注意事項', multiline: true }],
    defaultValue: J([
      { text: '事前の申し込みが必要です。1回のお申し込みで最大5名様までまとめてお申し込みいただけます。' },
      { text: '御札は5,000円（28㎝）・10,000円（32㎝）・20,000円（38㎝）・30,000円（42.5㎝）よりお選びいただけます。' },
      { text: 'お申し込みは、申し込みフォーム内の代金引換（代引き）またはECサイトよりお選びいただけます。代引きの場合、送料・手数料は別途ご負担いただきます。' },
    ]),
    translatable: true,
    defaultValueEn: J([
      { text: 'Advance application is required. A single application can cover up to 5 people.' },
      { text: 'Ofuda talismans are available in 4 sizes: ¥5,000 (28cm), ¥10,000 (32cm), ¥20,000 (38cm), and ¥30,000 (42.5cm).' },
      { text: 'You may apply via cash on delivery or the online shop within the application form. For cash on delivery, shipping and handling fees are charged separately.' },
    ]),
  },
  { key: 'shogatsu_cta_heading', label: 'CTA見出し', defaultValue: '正月元旦特別護摩祈願 お申し込み', translatable: true },
  { key: 'shogatsu_cta_text', label: 'CTA説明文（改行はそのまま反映されます）', multiline: true, defaultValue: '最大5名まで同時にお申し込みいただけます。\n代金引換（代引き）・ECサイトのいずれからもお申し込みいただけます。', translatable: true },
] as const

export default function AdminShogatsu() {
  return <SectionEditor title="立木観音 正月元旦特別護摩祈願（1/1）" href="/annual-events/shogatsu" fields={FIELDS as never} />
}
