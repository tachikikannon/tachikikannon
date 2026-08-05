'use client'
import SectionEditor from '@/components/admin/SectionEditor'

const J = (v: unknown) => JSON.stringify(v)

const FIELDS = [
  { key: 'yakushiko_subtitle', label: '見出し（ヒーロー サブタイトル）', defaultValue: '毎年8月8日　午前11時より', translatable: true },
  { key: 'yakushiko_heading_about', label: '「行事について」見出し', defaultValue: '行事について', translatable: true },
  { key: 'yakushiko_about', label: '行事について（説明文）', multiline: true, defaultValue: '毎年8月8日、温泉寺では湯の湖畔を舞台に、山伏によって採灯大護摩供が焚かれます。', translatable: true },
  { key: 'yakushiko_info_date', label: '開催日（カード表示）', defaultValue: '8月8日（毎年）', translatable: true },
  { key: 'yakushiko_info_time', label: '開始時間（カード表示）', defaultValue: '午前11時〜', translatable: true },
  { key: 'yakushiko_info_join', label: '参列（カード表示）', defaultValue: '自由（申し込み不要）', translatable: true },
  { key: 'yakushiko_heading_schedule', label: '「タイムスケジュール」見出し', defaultValue: 'タイムスケジュール', translatable: true },
  {
    key: 'yakushiko_schedule', label: 'タイムスケジュール', type: 'list' as const,
    listFields: [{ key: 'time', label: '時間' }, { key: 'title', label: '行事名' }, { key: 'desc', label: '説明', multiline: true }],
    defaultValue: J([
      { time: '11:00', title: '薬師講大祭', desc: '薬師堂にてご本尊・薬師瑠璃光如来への法要を執り行います。' },
      { time: '11:30', title: '採灯大護摩供', desc: '湯の湖畔にて、山伏装束に身を包んだ僧侶たちによる採灯大護摩供を厳修いたします。' },
      { time: '終了後', title: '写経奉納・御朱印授与', desc: '写経体験でお写しいただいた写経を御本尊に奉納いたします。特別御朱印のお授けも行います。' },
    ]),
    translatable: true,
    defaultValueEn: J([
      { time: '11:00', title: 'Yakushiko Grand Ceremony', desc: 'A ceremony to the principal image, Yakushi Ruriko Nyorai, is held at the Yakushi Hall. Together with devotees and visitors, we chant the Yakushi Sutra and pray for improved health and recovery from illness.' },
      { time: '11:30', title: 'Saito Goma Fire Ritual', desc: 'On the shore of Lake Yunoko, monks dressed as mountain ascetics (yamabushi) solemnly perform the Saito Goma fire ritual. Wooden goma sticks inscribed with wishes and copied sutras are offered to the flames, praying for the protection of Yakushi Nyorai.' },
      { time: 'After the Ceremony', title: 'Sutra Offering & Goshuin Distribution', desc: 'Sutras copied during the sutra-copying experience are offered to the principal image. A special goshuin stamp is also given.' },
    ]),
  },
  { key: 'yakushiko_heading_gallery', label: '「行事の様子」見出し', defaultValue: '行事の様子', translatable: true },
  { key: 'yakushiko_heading_notes', label: '「ご参列にあたって」見出し', defaultValue: 'ご参列にあたって', translatable: true },
  {
    key: 'yakushiko_notes', label: 'ご参列にあたって', type: 'list' as const,
    listFields: [{ key: 'text', label: '注意事項', multiline: true }],
    defaultValue: J([
      { text: '参列は自由です。事前のお申し込みは不要ですが、御札・願い事をご希望の方は申し込みフォームよりお申し込みください。' },
      { text: '写経体験（1,000円）は開湯期間中毎日受付しています。当日の写経奉納も可能です。' },
      { text: 'お支払いは当日・現地にてお受けいたします。' },
      { text: '詳細・変更がある場合は当サイトまたはお電話にてご確認ください。' },
    ]),
    translatable: true,
    defaultValueEn: J([
      { text: 'Attendance is open to all — no advance registration required. If you would like an ofuda talisman or wish offering, please apply via the application form.' },
      { text: 'The sutra-copying experience (¥1,000) is accepted daily during the open season. Same-day sutra offering is also possible.' },
      { text: 'Payment is accepted on the day, on site.' },
      { text: 'Please check our website or call us for any details or changes.' },
    ]),
  },
  { key: 'yakushiko_cta_heading', label: 'CTA見出し', defaultValue: '御札のお申し込み', translatable: true },
  { key: 'yakushiko_cta_text', label: 'CTA説明文（改行はそのまま反映されます）', multiline: true, defaultValue: '大護摩供にてお焚き上げする御札をご希望の方は\n申し込みフォームよりお申し込みください。\nお支払いは当日・現地にて。', translatable: true },
] as const

export default function AdminYakushiko() {
  return <SectionEditor title="温泉寺 薬師講大祭・採灯大護摩供（8/8）" href="/onsenji/events/yakushiko" fields={FIELDS as never} accent="onsenji" />
}
