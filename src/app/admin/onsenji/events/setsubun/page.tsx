'use client'
import SectionEditor from '@/components/admin/SectionEditor'

const J = (v: unknown) => JSON.stringify(v)

const FIELDS = [
  { key: 'setsubun_subtitle', label: '見出し（ヒーロー サブタイトル）', defaultValue: '毎年1月下旬　午前11時より　※日程は年によって異なります', translatable: true },
  { key: 'setsubun_heading_about', label: '「行事について」見出し', defaultValue: '行事について', translatable: true },
  { key: 'setsubun_about', label: '行事について（説明文）', multiline: true, defaultValue: '新年の邪気を払い、福を招く節分の法要です。豆まきや護摩供を通じて、参拝者の一年の健康と幸福をお祈りします。冬季の静けさのなか、厳かな雰囲気に包まれた温泉寺ならではの行事です。', translatable: true, defaultValueEn: 'A Setsubun ceremony to drive away misfortune and welcome good luck for the new year. Bean-throwing and a goma fire ritual pray for the health and happiness of visitors for the year ahead. A uniquely Onsenji event, held in the quiet, solemn atmosphere of winter.' },
  { key: 'setsubun_info_date', label: '開催日（カード表示）', defaultValue: '1月下旬（毎年）', translatable: true },
  { key: 'setsubun_info_time', label: '開始時間（カード表示）', defaultValue: '午前11時〜', translatable: true },
  { key: 'setsubun_info_join', label: '参列（カード表示）', defaultValue: '自由（申し込み不要）', translatable: true },
  { key: 'setsubun_date_note', label: '日程変動の注意書き', defaultValue: '📌 詳細な日程は年によって異なります。最新情報はお電話（0288-55-0013）またはお問い合わせフォームでご確認ください。', translatable: true },
  { key: 'setsubun_heading_schedule', label: '「タイムスケジュール」見出し', defaultValue: 'タイムスケジュール', translatable: true },
  {
    key: 'setsubun_schedule', label: 'タイムスケジュール', type: 'list' as const,
    listFields: [{ key: 'time', label: '時間' }, { key: 'title', label: '行事名' }, { key: 'desc', label: '説明', multiline: true }],
    defaultValue: J([
      { time: '11:00', title: '節分大祭（法要）', desc: '薬師堂にて節分の法要を執り行います。ご本尊・薬師如来のご加護のもと、新年の無病息災・開運招福をお祈りいたします。' },
      { time: '11:30', title: '豆まき', desc: '「鬼は外、福は内」の声とともに豆まきを行います。特別年男年女の皆様にも豆をお配りいたします。' },
      { time: '豆まき終了後', title: '縁起がらまき', desc: '薬師堂から特別年男年女の皆様が参拝者の皆様に、縁起がらをまきます。\n' },
    ]),
    translatable: true,
    defaultValueEn: J([
      { time: '11:00', title: 'Setsubun Grand Ceremony', desc: 'A Setsubun ceremony is held at the Yakushi Hall. Under the protection of Yakushi Nyorai, we pray for good health and good fortune in the new year.' },
      { time: '11:30', title: 'Bean Throwing', desc: 'Beans are thrown with the call "Oni wa soto, fuku wa uchi" ("Demons out, fortune in"). Our special toshiotoko and toshionna (those born in this year\'s zodiac sign) also hand out beans.' },
      { time: 'After the Bean Throwing', title: 'Lucky Charm Scattering', desc: 'From the Yakushi Hall, our special toshiotoko and toshionna scatter lucky paper charms (engigara) to all visitors.' },
    ]),
  },
  { key: 'setsubun_heading_gallery', label: '「行事の様子」見出し（画像は固定・3件）', defaultValue: '行事の様子', translatable: true },
  { key: 'setsubun_heading_notes', label: '「ご参列にあたって」見出し', defaultValue: 'ご参列にあたって', translatable: true },
  {
    key: 'setsubun_notes', label: 'ご参列にあたって', type: 'list' as const,
    listFields: [{ key: 'text', label: '注意事項', multiline: true }],
    defaultValue: J([
      { text: '参列は自由です。事前のお申し込みは不要ですが、御札をご希望の方は申し込みフォームよりお申し込みください。' },
      { text: '1月の湯元は積雪・寒冷が予想されます。防寒対策を十分にしてお越しください。' },
      { text: 'お支払いは当日・現地にてお受けいたします。' },
      { text: '日程は年によって異なります。必ず事前にお電話またはウェブサイトでご確認ください。' },
    ]),
    translatable: true,
    defaultValueEn: J([
      { text: 'Attendance is open to all — no advance registration required. If you would like an ofuda talisman, please apply via the application form.' },
      { text: 'Snow and cold weather are expected at Yumoto in January. Please dress warmly.' },
      { text: 'Payment is accepted on the day, on site.' },
      { text: 'The schedule varies by year. Please always confirm in advance by phone or on our website.' },
    ]),
  },
  { key: 'setsubun_cta_heading', label: 'CTA見出し', defaultValue: '御札のお申し込み', translatable: true },
  { key: 'setsubun_cta_text', label: 'CTA説明文（改行はそのまま反映されます）', multiline: true, defaultValue: '御札をご希望の方は申し込みフォームよりお申し込みください。\nお支払いは当日・現地にて。\n特別年男年女をご希望される方はお電話（0288-55-0013）にてご確認ください。', translatable: true },
] as const

export default function AdminSetsubun() {
  return <SectionEditor title="温泉寺 節分大祭（1月下旬）" href="/onsenji/events/setsubun" fields={FIELDS as never} accent="onsenji" />
}
