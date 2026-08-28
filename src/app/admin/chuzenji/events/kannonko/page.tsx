'use client'
import SectionEditor from '@/components/admin/SectionEditor'

const J = (v: unknown) => JSON.stringify(v)

const FIELDS = [
  { key: 'kannonko_subtitle', label: '見出し（ヒーロー サブタイトル）', defaultValue: '毎年6月18日　午前10時より', translatable: true },
  { key: 'kannonko_heading_about', label: '「行事について」見出し', defaultValue: '行事について', translatable: true },
  { key: 'kannonko_about', label: '行事について（説明文）', multiline: true, defaultValue: '毎年6月18日、日光山中禅寺 立木観音では、ご信徒・一般参拝者の皆様をお迎えして年に一度の大法要を執り行います。観音講・大護摩供・地蔵流しと三つの行事が続き、中禅寺湖の豊かな自然のなかで千二百余年の祈りが受け継がれます。', translatable: true, defaultValueEn: 'Every year on June 18th, Chuzenji Tachiki Kannon welcomes devotees and visitors for its once-a-year grand ceremony. Three rites follow in succession — Kannon-ko, the Grand Goma Ritual, and Jizo-nagashi — carrying on twelve hundred years of prayer amid the rich nature of Lake Chuzenji.' },
  { key: 'kannonko_info_date', label: '開催日（カード表示）', defaultValue: '6月18日（毎年）', translatable: true },
  { key: 'kannonko_info_time', label: '開始時間（カード表示）', defaultValue: '午前10時〜', translatable: true },
  { key: 'kannonko_info_join', label: '参列（カード表示）', defaultValue: '申込者のみ', translatable: true, defaultValueEn: 'Advance application required' },
  { key: 'kannonko_info_fee', label: '参加費（カード表示）', defaultValue: '3,000円（お札代込み）', translatable: true, defaultValueEn: '¥3,000 (includes ofuda talisman)' },
  { key: 'kannonko_heading_schedule', label: '「タイムスケジュール」見出し', defaultValue: 'タイムスケジュール', translatable: true },
  {
    key: 'kannonko_schedule', label: 'タイムスケジュール', type: 'list' as const,
    listFields: [{ key: 'time', label: '時間' }, { key: 'title', label: '行事名' }, { key: 'desc', label: '説明', multiline: true }],
    defaultValue: J([
      { time: '10:00', title: '観音講（法要）', desc: '18日は観音様の縁日です。大慈大悲の観音様の慈悲にすがり、日光の観音浄土といわれますここ中禅寺におきまして、ご参列頂きました皆様のご先祖様のご供養を執り行います。' },
      { time: '11:15', title: '波之利大黒天 大護摩供', desc: '波之利大黒天の大護摩供を厳修いたします。家内安全・商売繁盛・交通安全・湖上安全・開運・厄除け・安産など、皆様の願いをご祈願いたします。' },
      { time: '午後', title: '地蔵流し', desc: '遊覧船に乗り、中禅寺湖上にて「地蔵流し」を行います。「地蔵流し」とは、お地蔵様の絵姿のある御札を１枚ずつ湖に投じて、ご先祖様の冥福を祈る、大変珍しい行事です。' },
    ]),
    translatable: true,
    defaultValueEn: J([
      { time: '10:00', title: 'Kannon-ko (Ceremony)', desc: 'The 18th is Kannon\'s sacred day. Calling upon the great compassion of Kannon, we perform memorial rites for the ancestors of all who attend, here at Chuzenji, said to be Nikko\'s pure land of Kannon.' },
      { time: '11:15', title: 'Hashiri-Daikokuten Grand Goma Ritual', desc: 'A grand goma fire ritual is solemnly held for Hashiri-Daikokuten. We pray for the wishes of all who attend — household safety, business prosperity, traffic safety, safety on the lake, good fortune, protection from misfortune, and safe childbirth.' },
      { time: 'Afternoon', title: 'Jizo-nagashi (Jizo Release)', desc: 'We board a sightseeing boat and perform "Jizo-nagashi" on Lake Chuzenji. In this rare and unique ceremony, ofuda bearing the image of Jizo are cast into the lake one by one, praying for the repose of ancestors.' },
    ]),
  },
  { key: 'kannonko_heading_gallery', label: '「行事の様子」見出し', defaultValue: '行事の様子', translatable: true },
  { key: 'kannonko_heading_notes', label: '「ご参列にあたって」見出し', defaultValue: 'ご参列にあたって', translatable: true },
  {
    key: 'kannonko_notes', label: 'ご参列にあたって', type: 'list' as const,
    listFields: [{ key: 'text', label: '注意事項', multiline: true }],
    defaultValue: J([
      { text: '事前のお申し込みが必要です。ご希望の方は申し込みフォームよりお申し込みください。' },
      { text: '動きやすい服装でお越しください。中禅寺湖周辺は天候が変わりやすいため、羽織るものをお持ちいただくことをお勧めします。' },
      { text: '参加費はお一人様3,000円（お札代込み）です。お支払いは当日・現地払い、または代金引換（郵送、送料1,000円〜）からお選びいただけます。' },
      { text: '詳細・変更がある場合は当サイトにてお知らせいたします。' },
    ]),
    translatable: true,
    defaultValueEn: J([
      { text: 'Advance application is required. Please apply via the application form if you wish to attend.' },
      { text: 'Please wear comfortable, easy-to-move-in clothing. Weather around Lake Chuzenji can change quickly, so we recommend bringing something to layer on top.' },
      { text: 'The participation fee is ¥3,000 per person (includes the ofuda talisman). You may pay on the day, on site, or choose cash on delivery (shipped, from ¥1,000 shipping).' },
      { text: 'Any details or changes will be announced on this website.' },
    ]),
  },
  { key: 'kannonko_cta_heading', label: 'CTA見出し', defaultValue: '御札のお申し込み', translatable: true },
  { key: 'kannonko_cta_text', label: 'CTA説明文（改行はそのまま反映されます）', multiline: true, defaultValue: '参加費（お札代込み）はお一人様3,000円。\n事前に申し込みフォームよりお申し込みください。\nお支払いは当日・現地払い、または代金引換（郵送）からお選びいただけます。', translatable: true, defaultValueEn: 'The participation fee (including the ofuda talisman) is ¥3,000 per person.\nPlease apply in advance via the application form.\nYou may pay on the day, on site, or choose cash on delivery (shipped).' },
  { key: 'kannonko_apply_notice_ofuda', label: '申込フォーム 注意事項（⛩️ 御札・参加費）', multiline: true, defaultValue: 'お申し込みの方には御祈祷したお札をお授けします。参加費はお一人様3,000円（お札代込み）です。', translatable: true, defaultValueEn: 'Applicants will receive a blessed ofuda talisman. The participation fee is ¥3,000 per person (includes the ofuda talisman).' },
  { key: 'kannonko_apply_notice_shipping', label: '申込フォーム 注意事項（🚚 代金引換の送料）', multiline: true, defaultValue: '代金引換をご希望の場合、お札は郵送いたします。送料は送り先1件につき1,000円です。', translatable: true, defaultValueEn: 'If you choose cash on delivery, the ofuda talisman will be shipped. Shipping is ¥1,000 per destination.' },
  { key: 'kannonko_apply_notice_payment', label: '申込フォーム 注意事項（💴 お支払い方法）', multiline: true, defaultValue: 'お支払いは当日・現地でのお支払い、または代金引換（郵送）からお選びいただけます。', translatable: true, defaultValueEn: 'Payment can be made on the day, on site, or by cash on delivery (shipped).' },
  { key: 'kannonko_apply_notice_family', label: '申込フォーム 注意事項（👨‍👩‍👧‍👦 ご家族・団体）', multiline: true, defaultValue: 'ご家族・団体でお申し込みの場合は、代表者様の情報に加えて申込者①〜⑩に人数分ご記入ください。', translatable: true, defaultValueEn: "If applying as a family or group, please fill in applicants ①–⑩ in addition to the representative's information." },
] as const

export default function AdminKannonko() {
  return <SectionEditor title="立木観音 観音講・大護摩供・地蔵流し（6/18）" href="/annual-events/kannonko" fields={FIELDS as never} />
}
