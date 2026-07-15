'use client'
import SectionEditor from '@/components/admin/SectionEditor'

const J = (v: unknown) => JSON.stringify(v)

const FIELDS = [
  { key: 'kannonko_about', label: '行事について（説明文）', multiline: true, defaultValue: '毎年6月18日、日光山中禅寺 立木観音では、ご信徒・一般参拝者の皆様をお迎えして年に一度の大法要を執り行います。' },
  {
    key: 'kannonko_schedule', label: 'タイムスケジュール', type: 'list' as const,
    listFields: [{ key: 'time', label: '時間' }, { key: 'title', label: '行事名' }, { key: 'desc', label: '説明', multiline: true }],
    defaultValue: J([
      { time: '10:00', title: '観音講', desc: '五大堂にて、ご信徒の皆様とともに観音経をお唱えし、立木観音様へのご供養を執り行います。' },
      { time: '11:15', title: '大護摩供', desc: '波之利大黒天堂にて採灯大護摩供を厳修いたします。護摩の炎にてご参列の皆様の願い事をお焚き上げします。' },
      { time: '13:00', title: '地蔵流し', desc: '中禅寺湖の湖上にてお地蔵様をお流しする伝統行事です。水面に浮かぶお地蔵様が、湖の彼方へとご縁をお運びします。' },
    ]),
  },
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
] as const

export default function AdminKannonko() {
  return <SectionEditor title="立木観音 観音講・大護摩供・地蔵流し（6/18）" href="/annual-events/kannonko" fields={FIELDS as never} />
}
