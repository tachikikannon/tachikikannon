'use client'
import SectionEditor from '@/components/admin/SectionEditor'

const J = (v: unknown) => JSON.stringify(v)

const FIELDS = [
  { key: 'prayer_about', label: '御祈願についての説明文', multiline: true, defaultValue: 'お護摩はインド伝来の密教の秘法（秘密の教え）で、僧侶が護摩壇に向かい、作法にしたがって仏の智慧の火を焚き、様々な供物を焚き上げ、厄難・災難を払いその加護（成就）を願います。' },
  { key: 'prayer_hours', label: '御祈願時間', defaultValue: '9：00〜12：00' },
  { key: 'prayer_exclude_dates', label: '除外日', defaultValue: '6月18日・8月4日・8月8日' },
  { key: 'prayer_exclude_note', label: '除外日の補足文', multiline: true, defaultValue: '他にも行事によっては祈祷できない日もございますので、一度お問い合わせください。' },
  {
    key: 'prayer_fees', label: '御祈願料（テーブル）', type: 'list' as const,
    listFields: [{ key: 'price', label: '御祈願料' }, { key: 'size', label: '御札サイズ' }],
    defaultValue: J([
      { price: '5,000円', size: '28㎝' },
      { price: '10,000円', size: '32㎝' },
      { price: '20,000円', size: '38㎝' },
      { price: '30,000円', size: '42.5㎝' },
    ]),
  },
  { key: 'prayer_mail_text', label: '護摩札の郵送について', multiline: true, defaultValue: '万が一、参列できない場合は郵送にてお札をお送りします。着払いにて発送させて頂きますので、申込用紙に必要事項をご記入の上、現金書留にてお送りください。' },
  { key: 'prayer_car_desc', label: '新車祈祷 説明文', defaultValue: 'お車を新しくされた方、車両安全の御祈願をお申し込みの方' },
  { key: 'prayer_car_note', label: '新車祈祷 備考', defaultValue: '※交通安全の錫杖守りと木札が付きます。' },
  { key: 'prayer_birth_fee', label: '安産祈願 料金', defaultValue: '5,000円' },
  { key: 'prayer_birth_note', label: '安産祈願 備考', defaultValue: '※腹帯の持ち込みも可能です。詳しくはお問い合わせください。' },
] as const

export default function AdminChuzenjPrayer() {
  return <SectionEditor title="御祈願" href="/prayer" fields={FIELDS as never} />
}
