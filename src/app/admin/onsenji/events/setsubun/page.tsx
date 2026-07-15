'use client'
import SectionEditor from '@/components/admin/SectionEditor'

const J = (v: unknown) => JSON.stringify(v)

const FIELDS = [
  { key: 'setsubun_about', label: '行事について（説明文）', multiline: true, defaultValue: '新年の邪気を払い、福を招く節分の法要です。豆まきや護摩供を通じて、参拝者の一年の健康と幸福をお祈りします。' },
  {
    key: 'setsubun_schedule', label: 'タイムスケジュール', type: 'list' as const,
    listFields: [{ key: 'time', label: '時間' }, { key: 'title', label: '行事名' }, { key: 'desc', label: '説明', multiline: true }],
    defaultValue: J([
      { time: '11:00', title: '節分大祭（法要）', desc: '薬師堂にて節分の法要を執り行います。ご本尊・薬師如来のご加護のもと、新年の無病息災・開運招福をお祈りいたします。' },
      { time: '11:30', title: '護摩供', desc: '護摩の炎に参拝者の願い事を記した護摩木を奉じ、薬師如来の御力で煩悩や邪気をお焚き上げいたします。' },
      { time: '終了後', title: '豆まき', desc: '「鬼は外、福は内」の声とともに豆まきを行います。参列の皆様にも豆をお配りいたします。' },
    ]),
  },
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
] as const

export default function AdminSetsubun() {
  return <SectionEditor title="温泉寺 節分大祭（1月下旬）" href="/onsenji/events/setsubun" fields={FIELDS as never} accent="onsenji" />
}
