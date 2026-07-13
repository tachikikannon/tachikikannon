'use client'
import SectionEditor from '@/components/admin/SectionEditor'

const J = (v: unknown) => JSON.stringify(v)

const FIELDS = [
  { key: 'onsenji_prayer_about', label: '御祈願についての説明文', multiline: true, defaultValue: '温泉寺では薬師如来への護摩祈祷を承っております。病気平癒・健康長寿・家内安全・学業成就など、各種ご祈願をお受けいただけます。護摩の炎で煩悩を焼き払い、薬師如来の御加護をいただく密教の秘法です。' },
  { key: 'onsenji_prayer_hours', label: '御祈願時間', defaultValue: '9：00〜12：00' },
  { key: 'onsenji_prayer_exclude_dates', label: '除外日', defaultValue: '不定休（行事等による変更あり）' },
  { key: 'onsenji_prayer_exclude_note', label: '除外日の補足文', multiline: true, defaultValue: '行事によっては祈祷できない日もございますので、事前にお問い合わせください。' },
  {
    key: 'onsenji_prayer_fees', label: '御祈願料（テーブル）', type: 'list' as const,
    listFields: [{ key: 'price', label: '御祈願料' }, { key: 'size', label: '御札サイズ' }],
    defaultValue: J([
      { price: '5,000円', size: '28㎝' },
      { price: '10,000円', size: '32㎝' },
      { price: '20,000円', size: '38㎝' },
      { price: '30,000円', size: '42.5㎝' },
    ]),
  },
  { key: 'onsenji_prayer_mail_text', label: '護摩札の郵送について', multiline: true, defaultValue: '万が一、参列できない場合は郵送にてお札をお送りします。着払いにて発送させて頂きますので、申込用紙に必要事項をご記入の上、現金書留にてお送りください。' },
] as const

export default function AdminOnsenjPrayer() {
  return <SectionEditor title="温泉寺 御祈願" href="/onsenji/prayer" fields={FIELDS as never} accent="onsenji" />
}
