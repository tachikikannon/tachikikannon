'use client'
import SectionEditor from '@/components/admin/SectionEditor'

const J = (v: unknown) => JSON.stringify(v)

const FIELDS = [
  { key: 'setsubun_subtitle', label: '見出し（ヒーロー サブタイトル）', defaultValue: '毎年1月下旬　午前11時より　※日程は年によって異なります' },
  { key: 'setsubun_heading_about', label: '「行事について」見出し', defaultValue: '行事について' },
  { key: 'setsubun_about', label: '行事について（説明文）', multiline: true, defaultValue: '新年の邪気を払い、福を招く節分の法要です。豆まきや護摩供を通じて、参拝者の一年の健康と幸福をお祈りします。' },
  { key: 'setsubun_info_date', label: '開催日（カード表示）', defaultValue: '1月下旬（毎年）' },
  { key: 'setsubun_info_time', label: '開始時間（カード表示）', defaultValue: '午前11時〜' },
  { key: 'setsubun_info_join', label: '参列（カード表示）', defaultValue: '自由（申し込み不要）' },
  { key: 'setsubun_date_note', label: '日程変動の注意書き', defaultValue: '📌 詳細な日程は年によって異なります。最新情報はお電話（0288-55-0013）またはお問い合わせフォームでご確認ください。' },
  { key: 'setsubun_heading_schedule', label: '「タイムスケジュール」見出し', defaultValue: 'タイムスケジュール' },
  {
    key: 'setsubun_schedule', label: 'タイムスケジュール', type: 'list' as const,
    listFields: [{ key: 'time', label: '時間' }, { key: 'title', label: '行事名' }, { key: 'desc', label: '説明', multiline: true }],
    defaultValue: J([
      { time: '11:00', title: '節分大祭（法要）', desc: '薬師堂にて節分の法要を執り行います。ご本尊・薬師如来のご加護のもと、新年の無病息災・開運招福をお祈りいたします。' },
      { time: '11:30', title: '護摩供', desc: '護摩の炎に参拝者の願い事を記した護摩木を奉じ、薬師如来の御力で煩悩や邪気をお焚き上げいたします。' },
      { time: '終了後', title: '豆まき', desc: '「鬼は外、福は内」の声とともに豆まきを行います。参列の皆様にも豆をお配りいたします。' },
    ]),
  },
  { key: 'setsubun_heading_notes', label: '「ご参列にあたって」見出し', defaultValue: 'ご参列にあたって' },
  {
    key: 'setsubun_notes', label: 'ご参列にあたって', type: 'list' as const,
    listFields: [{ key: 'text', label: '注意事項', multiline: true }],
    defaultValue: J([
      { text: '参列は自由です。事前のお申し込みは不要ですが、御札をご希望の方は申し込みフォームよりお申し込みください。' },
      { text: '1月の湯元は積雪・寒冷が予想されます。防寒対策を十分にしてお越しください。' },
      { text: 'お支払いは当日・現地にてお受けいたします。' },
      { text: '日程は年によって異なります。必ず事前にお電話またはウェブサイトでご確認ください。' },
    ]),
  },
  { key: 'setsubun_cta_heading', label: 'CTA見出し', defaultValue: '御札のお申し込み' },
  { key: 'setsubun_cta_text', label: 'CTA説明文（改行はそのまま反映されます）', multiline: true, defaultValue: '護摩供にてお焚き上げする御札をご希望の方は\n申し込みフォームよりお申し込みください。\nお支払いは当日・現地にて。' },
] as const

export default function AdminSetsubun() {
  return <SectionEditor title="温泉寺 節分大祭（1月下旬）" href="/onsenji/events/setsubun" fields={FIELDS as never} accent="onsenji" />
}
