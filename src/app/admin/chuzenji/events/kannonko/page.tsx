'use client'
import SectionEditor from '@/components/admin/SectionEditor'

const J = (v: unknown) => JSON.stringify(v)

const FIELDS = [
  { key: 'kannonko_subtitle', label: '見出し（ヒーロー サブタイトル）', defaultValue: '毎年6月18日　午前10時より' },
  { key: 'kannonko_heading_about', label: '「行事について」見出し', defaultValue: '行事について' },
  { key: 'kannonko_about', label: '行事について（説明文）', multiline: true, defaultValue: '毎年6月18日、日光山中禅寺 立木観音では、ご信徒・一般参拝者の皆様をお迎えして年に一度の大法要を執り行います。' },
  { key: 'kannonko_info_date', label: '開催日（カード表示）', defaultValue: '6月18日（毎年）' },
  { key: 'kannonko_info_time', label: '開始時間（カード表示）', defaultValue: '午前10時〜' },
  { key: 'kannonko_info_join', label: '参列（カード表示）', defaultValue: '自由（申し込み不要）' },
  { key: 'kannonko_heading_schedule', label: '「タイムスケジュール」見出し', defaultValue: 'タイムスケジュール' },
  {
    key: 'kannonko_schedule', label: 'タイムスケジュール', type: 'list' as const,
    listFields: [{ key: 'time', label: '時間' }, { key: 'title', label: '行事名' }, { key: 'desc', label: '説明', multiline: true }],
    defaultValue: J([
      { time: '10:00', title: '観音講（法要）', desc: '18日は観音様の縁日にあたり、10時より法要が厳修されます。大慈大悲の観音様の慈悲にすがり、日光の観音浄土といわれますここ中禅寺におきまして、ご参列頂きました皆様のご先祖様のご供養を執り行います。' },
      { time: '11:15', title: '波之利大黒天 大護摩供', desc: '波之利大黒天の大護摩供を厳修いたします。家内安全・商売繁盛・交通安全・湖上安全・開運・厄除け・安産など、皆様のご祈願をお焚き上げします。' },
      { time: '午後', title: '地蔵流し', desc: '船に乗り、中禅寺湖上にて「地蔵流し」を行います。「地蔵流し」とは、お地蔵様の絵姿のある御札を１枚ずつ湖に投じて、ご先祖様の冥福を祈る、大変珍しい行事です。' },
    ]),
  },
  { key: 'kannonko_heading_gallery', label: '「行事の様子」見出し', defaultValue: '行事の様子' },
  { key: 'kannonko_heading_notes', label: '「ご参列にあたって」見出し', defaultValue: 'ご参列にあたって' },
  {
    key: 'kannonko_notes', label: 'ご参列にあたって', type: 'list' as const,
    listFields: [{ key: 'text', label: '注意事項', multiline: true }],
    defaultValue: J([
      { text: '参列は自由です。事前のお申し込みは不要ですが、お願い事の御札をご希望の方は申し込みフォームよりお申し込みください。' },
      { text: '動きやすい服装でお越しください。中禅寺湖周辺は天候が変わりやすいため、羽織るものをお持ちいただくことをお勧めします。' },
      { text: 'お支払いは当日・現地にてお受けいたします。' },
      { text: '詳細・変更がある場合は当サイトにてお知らせいたします。' },
    ]),
  },
  { key: 'kannonko_cta_heading', label: 'CTA見出し', defaultValue: '御札のお申し込み' },
  { key: 'kannonko_cta_text', label: 'CTA説明文（改行はそのまま反映されます）', multiline: true, defaultValue: '大護摩供にてお焚き上げする御札をご希望の方は\n事前に申し込みフォームよりお申し込みください。\nお支払いは当日・現地にて。' },
] as const

export default function AdminKannonko() {
  return <SectionEditor title="立木観音 観音講・大護摩供・地蔵流し（6/18）" href="/annual-events/kannonko" fields={FIELDS as never} />
}
