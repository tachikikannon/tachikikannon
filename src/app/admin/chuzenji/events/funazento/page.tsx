'use client'
import SectionEditor from '@/components/admin/SectionEditor'

const J = (v: unknown) => JSON.stringify(v)

const FIELDS = [
  { key: 'funazento_subtitle', label: '見出し（ヒーロー サブタイトル）', defaultValue: '毎年8月4日　午前10時より　※事前申し込み必要', translatable: true },
  { key: 'funazento_heading_about', label: '「行事について」見出し', defaultValue: '行事について', translatable: true },
  { key: 'funazento_about', label: '行事について（説明文）', multiline: true, defaultValue: '船禅頂（ふなぜんじょう）は、日光山を開いた勝道上人（737〜817）が中禅寺湖を舟で渡り、湖上から霊峰・男体山を遙拝したという故事に由来する伝統行事です。毎年8月4日、中禅寺湖を舞台に、上人が切り開いた修験の道を水上から辿ります。湖上から望む男体山と中禅寺の景観とともに、千二百余年の歴史に思いを馳せる特別な体験で、歌が浜を出発し、各地を巡りながら千手堂に向かい、戻ってくる特別なルートです。', translatable: true, defaultValueEn: 'Funazenjo is a traditional event rooted in the story of Priest Shodo (737–817), who opened Nikkozan and crossed Lake Chuzenji by boat to venerate the sacred Mt. Nantai from the water. Every year on August 4, participants retrace by boat the ascetic path he once carved out across Lake Chuzenji. Taking in the views of Mt. Nantai and Chuzenji from the lake, it is a special experience reflecting on over 1,200 years of history — a unique route departing from Utagahama, circling past various sites toward the Senju-do Hall, and returning.' },
  { key: 'funazento_info_date', label: '開催日（カード表示）', defaultValue: '8月4日（毎年）', translatable: true },
  { key: 'funazento_info_time', label: '開始時間（カード表示）', defaultValue: '午前10時〜', translatable: true },
  { key: 'funazento_info_join', label: '参加（カード表示）', defaultValue: '事前申し込み必要', translatable: true },
  { key: 'funazento_info_fee', label: '参加費（カード表示）', defaultValue: '5,000円（小中学生4,000円・未就学児無料）', translatable: true, defaultValueEn: '¥5,000 (¥4,000 for students; free for preschoolers)' },
  { key: 'funazento_heading_schedule', label: '「タイムスケジュール」見出し', defaultValue: 'タイムスケジュール', translatable: true },
  {
    key: 'funazento_schedule', label: 'タイムスケジュール', type: 'list' as const,
    listFields: [{ key: 'time', label: '時間' }, { key: 'title', label: '行事名' }, { key: 'desc', label: '説明', multiline: true }],
    defaultValue: J([
      { time: '9:00', title: '受付開始', desc: '' },
      { time: '10:00', title: '開式の儀', desc: '執行挨拶、律院住職の挨拶' },
      { time: '10:15', title: '石護摩壇不動尊祈願', desc: '' },
      { time: '10:20', title: '浜地蔵供養', desc: '' },
      { time: '10:30', title: '歌ヶ浜出発', desc: '勝道上人が弟子と共に霊場を巡拝した場所を巡り読経をあげます' },
      { time: '10:45', title: '八丁出島 寺ヶ崎 薬師堂跡法要', desc: '読誦法要' },
      { time: '11:00', title: '松﨑 日輪寺跡', desc: '読誦法要' },
      { time: '11:15', title: '上野島', desc: '勝道上人、天海大僧正墓供養' },
      { time: '11:30', title: '巡拝', desc: '上陸できないため、乗船したまま読経を行う' },
      { time: '11:50', title: '千手ヶ浜桟橋到着', desc: '下船して千手堂へ' },
      { time: '12:10', title: '千手ヶ浜 千手堂法要', desc: '' },
      { time: '12:50', title: '千手ヶ浜 不動尊法要', desc: '' },
      { time: '13:10', title: '千手ヶ浜桟橋から乗船し、立木観音へ', desc: '乗船中に昼食' },
      { time: '14:00', title: '立木観音桟橋到着　下船', desc: '' },
      { time: '14:15', title: '本堂参拝', desc: '' },
      { time: '14:30', title: '五大堂参拝し、御札を「大黒天堂」にて授与', desc: '' },
    ]),
    translatable: true,
    defaultValueEn: J([
      { time: '9:00', title: 'Reception Opens', desc: '' },
      { time: '10:00', title: 'Opening Ceremony', desc: 'Remarks by the officiant and the head priest of Ritsu-in.' },
      { time: '10:15', title: 'Fudo Myo-o Prayer at the Stone Goma Altar', desc: '' },
      { time: '10:20', title: 'Memorial Service for the Shoreline Jizo', desc: '' },
      { time: '10:30', title: 'Departure from Utagahama', desc: 'Sutras are chanted while visiting sites once visited by Priest Shodo and his disciples on their pilgrimage.' },
      { time: '10:45', title: 'Memorial Service at the Site of Yakushido Hall, Terugasaki, Hatcho Peninsula', desc: 'Sutra recitation service.' },
      { time: '11:00', title: 'Site of Nichirin-ji Temple, Matsuzaki', desc: 'Sutra recitation service.' },
      { time: '11:15', title: 'Ueno-jima Island', desc: 'Memorial service at the graves of Priest Shodo and Great Priest Tenkai.' },
      { time: '11:30', title: 'Pilgrimage', desc: 'As landing is not possible here, sutras are chanted while remaining aboard the boat.' },
      { time: '11:50', title: 'Arrival at Senjugahama Pier', desc: 'Disembark and proceed to Senju-do Hall.' },
      { time: '12:10', title: 'Memorial Service at Senju-do Hall, Senjugahama', desc: '' },
      { time: '12:50', title: 'Fudo Myo-o Memorial Service, Senjugahama', desc: '' },
      { time: '13:10', title: 'Board the Boat at Senjugahama Pier bound for Tachiki Kannon', desc: 'Lunch is served aboard the boat.' },
      { time: '14:00', title: 'Arrival at Tachiki Kannon Pier, Disembark', desc: '' },
      { time: '14:15', title: 'Visit to the Main Hall', desc: '' },
      { time: '14:30', title: 'Visit Godaido Hall; Ofuda Talismans Distributed at Daikokuten Hall', desc: '' },
    ]),
  },
  { key: 'funazento_heading_map', label: '「船禅頂ルート図」見出し', defaultValue: '船禅頂ルート図', translatable: true, defaultValueEn: 'Boat Zenjo Route Map' },
  { key: 'funazento_heading_gallery', label: '「行事の様子」見出し', defaultValue: '行事の様子', translatable: true },
  { key: 'funazento_heading_notes', label: '「ご参加にあたって」見出し', defaultValue: 'ご参加にあたって', translatable: true },
  {
    key: 'funazento_notes', label: 'ご参加にあたって', type: 'list' as const,
    listFields: [{ key: 'text', label: '注意事項', multiline: true }],
    defaultValue: J([
      { text: '事前の申し込みが必要です。定員になり次第締め切りますので、お早めにお申し込みください。' },
      { text: '参加費は大人5,000円・小中学生4,000円（未就学児は無料）です。当日ご参加されない場合も、御札代として4,000円を頂戴いたします。お支払いは当日・現地にてお受けいたします。' },
      { text: '動きやすく濡れても構わない服装でお越しください。湖上は気温が低い場合がありますので、上に羽織るものをご持参ください。' },
      { text: '天候・状況により内容が変更・中止となる場合がございます。詳細はお電話にてご確認ください。' },
    ]),
    translatable: true,
    defaultValueEn: J([
      { text: 'Advance application is required. Applications close once capacity is reached, so please apply early.' },
      { text: 'The participation fee is ¥5,000 for adults and ¥4,000 for elementary/junior high school students (preschool-age children are free). Even if you do not join in person on the day, a fee of ¥4,000 applies for the ofuda talisman. Payment is accepted on the day, on site.' },
      { text: 'Please wear clothing you can move in easily and that can get wet. Temperatures on the lake can be cool, so please bring something to layer on top.' },
      { text: 'Content may change or be cancelled depending on weather and conditions. Please call for details.' },
    ]),
  },
  { key: 'funazento_cta_heading', label: 'CTA見出し', defaultValue: '船禅頂 お申し込み', translatable: true },
  { key: 'funazento_cta_text', label: 'CTA説明文（改行はそのまま反映されます）', multiline: true, defaultValue: '定員になり次第締め切ります。\n御札授与あり・お支払いは当日現地にて。', translatable: true },
  { key: 'funazento_apply_notice_ofuda', label: '申込フォーム 注意事項（⛩️ 御札）', multiline: true, defaultValue: 'お申し込みの方には御札をお授けいたします。', translatable: true, defaultValueEn: 'Applicants will receive an ofuda talisman.' },
  { key: 'funazento_apply_notice_fee', label: '申込フォーム 注意事項（💰 参加費）', multiline: true, defaultValue: '参加費は大人5,000円・小中学生4,000円（未就学児は無料）です。当日ご参加されない場合も、御札代として4,000円を頂戴いたします。', translatable: true, defaultValueEn: 'The participation fee is ¥5,000 for adults and ¥4,000 for elementary/junior high school students (preschool-age children are free). Even if you do not join in person on the day, a fee of ¥4,000 applies for the ofuda talisman.' },
  { key: 'funazento_apply_notice_shipping', label: '申込フォーム 注意事項（🚚 代金引換の送料）', multiline: true, defaultValue: '当日ご参加されない方のお札は代金引換（代引き）にて郵送いたします。送料は送り先1件につき1,000円です。', translatable: true, defaultValueEn: 'For those not attending in person, the ofuda talisman is shipped by cash on delivery. Shipping is ¥1,000 per destination.' },
  { key: 'funazento_apply_notice_payment', label: '申込フォーム 注意事項（💴 お支払い方法）', multiline: true, defaultValue: 'お支払いは当日・現地でのお支払いとなります。事前のお振込みは不要です。', translatable: true, defaultValueEn: 'Payment is due on the day, on site. No advance bank transfer is needed.' },
  { key: 'funazento_apply_notice_capacity', label: '申込フォーム 注意事項（👥 定員）', multiline: true, defaultValue: '定員になり次第締め切ります。お早めにお申し込みください。', translatable: true, defaultValueEn: 'Applications close once capacity is reached. Please apply early.' },
  { key: 'funazento_apply_notice_family', label: '申込フォーム 注意事項（👨‍👩‍👧‍👦 ご家族・団体）', multiline: true, defaultValue: 'ご家族・団体でお申し込みの場合は、代表者様の情報に加えて申込者①〜⑩に人数分ご記入ください。', translatable: true, defaultValueEn: "If applying as a family or group, please fill in applicants ①–⑩ in addition to the representative's information." },
] as const

export default function AdminFunazento() {
  return <SectionEditor title="立木観音 船禅頂（8/4）" href="/annual-events/funazento" fields={FIELDS as never} />
}
