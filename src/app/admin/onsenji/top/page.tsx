'use client'
import SectionEditor from '@/components/admin/SectionEditor'

const J = (v: unknown) => JSON.stringify(v)

const FIELDS = [
  { key: 'onsenji_hero_en',    label: 'ヒーロー 英語サブタイトル', defaultValue: 'Nikkozan Onsenji Temple' },
  { key: 'onsenji_hero_title', label: 'ヒーロー メインキャッチコピー（改行可）', multiline: true, defaultValue: '千二百余年の祈りを宿す\n薬師の霊場', translatable: true },
  { key: 'onsenji_hero_sub',   label: 'ヒーロー サブコピー', multiline: true, defaultValue: '世界遺産・日光山輪王寺の別院。薬師瑠璃光如来のご加護と、大地から湧く温泉の癒しを', translatable: true },
  { key: 'onsenji_onsen_status_enabled', label: '温泉営業ステータスの表示（ヒーロー下、ボタンの下に表示）', type: 'boolean' as const, defaultValue: 'true', checkboxLabel: '表示する' },
  { key: 'onsenji_onsen_status_closed', label: '本日は行事のため入浴不可にする（オンにすると「温泉営業中」の代わりに下記の休止メッセージを表示）', type: 'boolean' as const, defaultValue: 'false', checkboxLabel: '入浴不可にする' },
  { key: 'onsenji_onsen_status_event_name', label: '休止理由の行事名（「本日　◯◯の為、ご入浴できません」の◯◯部分）', defaultValue: '法要', translatable: true },
  { key: 'onsenji_onsen_status_hours', label: '入浴可能時間（通常時に日付の下に小さく表示。季節により変動するため随時更新してください）', defaultValue: '9:00〜16:00まで入浴可', translatable: true },
  { key: 'onsenji_heading_news', label: '「お知らせ」見出し（記事自体は「お知らせ管理」で編集）', defaultValue: 'お知らせ', translatable: true },
  { key: 'onsenji_about_title', label: '「温泉寺について」見出し', defaultValue: '温泉寺について', translatable: true },
  {
    key: 'onsenji_about_cards', label: 'カード（歴史・拝観料金・境内案内・年間行事の順、4件固定）', type: 'list' as const,
    listFields: [{ key: 'label', label: 'タイトル' }, { key: 'desc', label: '説明' }],
    defaultValue: J([
      { label: '温泉寺の歴史', desc: '歴史と縁起' },
      { label: '拝観料金',     desc: '拝観料・各種料金' },
      { label: '境内のご案内', desc: '見どころ・境内マップ' },
      { label: '年間行事',     desc: '法要・行事のご案内' },
    ]),
    translatable: true,
    defaultValueEn: J([
      { label: 'History of Onsenji', desc: 'History & origins' },
      { label: 'Admission Fees',     desc: 'Admission & other fees' },
      { label: 'Grounds Guide',      desc: 'Highlights & temple map' },
      { label: 'Annual Events',      desc: 'Services & event information' },
    ]),
  },
  { key: 'onsenji_heading_goryaku', label: '「主なご利益」見出し', defaultValue: '主なご利益', translatable: true },
  {
    key: 'onsenji_goryaku_cards', label: 'ご利益カード（4件固定）', type: 'list' as const,
    listFields: [{ key: 'icon', label: 'アイコン（絵文字）' }, { key: 'title', label: 'タイトル' }, { key: 'desc', label: '説明' }],
    defaultValue: J([
      { icon: '🌿', title: '病気平癒', desc: '薬師瑠璃光如来の御力で病気の回復をお祈りします' },
      { icon: '💧', title: '健康増進', desc: '大地から湧く温泉と仏縁で心身ともに清まります' },
      { icon: '⏳', title: '延命長寿', desc: '医王如来とも呼ばれる薬師如来の御加護を' },
      { icon: '✨', title: '開運招福', desc: '千二百余年の祈りが積み重なる霊場のご加護を' },
    ]),
    translatable: true,
    defaultValueEn: J([
      { icon: '🌿', title: 'Healing from Illness', desc: 'Prayers for recovery through the power of Yakushi Nyorai' },
      { icon: '💧', title: 'Better Health',        desc: 'Purify body and mind with the hot spring and Buddhist blessings' },
      { icon: '⏳', title: 'Longevity',            desc: 'The protection of Yakushi Nyorai, the "King of Medicine Buddha"' },
      { icon: '✨', title: 'Good Fortune',         desc: 'Over 1,200 years of accumulated prayer at this sacred site' },
    ]),
  },
  { key: 'onsenji_heading_menu', label: '「温泉・体験メニュー」見出し', defaultValue: '温泉・体験メニュー', translatable: true },
  {
    key: 'onsenji_menu_cards', label: 'メニューカード（薬師の湯・写経・写仏の順、3件固定）', type: 'list' as const,
    listFields: [{ key: 'title', label: 'タイトル' }, { key: 'desc', label: '説明' }],
    defaultValue: J([
      { title: '薬師の湯', desc: '令和8年4月開湯。含硫黄泉の完全かけ流し。参拝の後、心身を清めるひとときを。' },
      { title: '写経体験', desc: '1,000円・約15分・毎日実施。特別御朱印授与。心を静めてお経をお写しいただけます。' },
      { title: '写仏体験', desc: '1,000円・約30〜60分。薬師瑠璃光如来をお描きいただき、特別御朱印をお授けします。' },
    ]),
    translatable: true,
    defaultValueEn: J([
      { title: 'Yakushi-no-Yu Hot Spring', desc: 'Opened April 2026. Fully sourced, sulfur-rich spring water. A moment to purify body and mind after worship.' },
      { title: 'Sutra Copying',            desc: '¥1,000 · approx. 15 min · daily. Includes a special goshuin stamp. Quiet your mind while copying sutras.' },
      { title: 'Buddhist Image Tracing',   desc: '¥1,000 · approx. 30–60 min. Trace the image of Yakushi Nyorai and receive a special goshuin stamp.' },
    ]),
  },
  { key: 'onsenji_heading_goshuin', label: '「御朱印」見出し', defaultValue: '御朱印', translatable: true },
  { key: 'onsenji_goshuin_desc',    label: '「御朱印」説明文', multiline: true, defaultValue: '温泉寺の御朱印は境内にてお受けいただけます。写経体験では特別御朱印をお授けします。', translatable: true },
  { key: 'onsenji_heading_access', label: '「アクセス」見出し', defaultValue: 'アクセス', translatable: true },
  { key: 'onsenji_access_address', label: 'アクセス 所在地', defaultValue: '栃木県日光市湯元2559', translatable: true },
  { key: 'onsenji_access_car',  label: 'アクセス お車での説明', multiline: true, defaultValue: '日光宇都宮道路 日光ICより約10分\n境内周辺に有料駐車場あり', translatable: true },
  { key: 'onsenji_access_bus',  label: 'アクセス バスでの説明', multiline: true, defaultValue: '東武日光駅・JR日光駅よりバスで「西参道」バス停下車、徒歩約10分\nまたは「表参道」バス停より徒歩約15分', translatable: true },
] as const

export default function AdminOnsenjTop() {
  return <SectionEditor title="温泉寺 トップページ" href="/onsenji" fields={FIELDS as never} accent="onsenji" />
}
