'use client'
import SectionEditor from '@/components/admin/SectionEditor'

const J = (v: unknown) => JSON.stringify(v)

const FIELDS = [
  { key: 'yakushiko_about', label: '行事について（説明文）', multiline: true, defaultValue: '毎年8月8日、温泉寺では湯の湖畔を舞台に、山伏によって採灯大護摩供が焚かれます。' },
  {
    key: 'yakushiko_schedule', label: 'タイムスケジュール', type: 'list' as const,
    listFields: [{ key: 'time', label: '時間' }, { key: 'title', label: '行事名' }, { key: 'desc', label: '説明', multiline: true }],
    defaultValue: J([
      { time: '11:00', title: '薬師講大祭', desc: '薬師堂にてご本尊・薬師瑠璃光如来への法要を執り行います。' },
      { time: '11:30', title: '採灯大護摩供', desc: '湯の湖畔にて、山伏装束に身を包んだ僧侶たちによる採灯大護摩供を厳修いたします。' },
      { time: '終了後', title: '写経奉納・御朱印授与', desc: '写経体験でお写しいただいた写経を御本尊に奉納いたします。特別御朱印のお授けも行います。' },
    ]),
  },
  {
    key: 'yakushiko_notes', label: 'ご参列にあたって', type: 'list' as const,
    listFields: [{ key: 'text', label: '注意事項', multiline: true }],
    defaultValue: J([
      { text: '参列は自由です。事前のお申し込みは不要ですが、御札・願い事をご希望の方は申し込みフォームよりお申し込みください。' },
      { text: '写経体験（1,000円）は開湯期間中毎日受付しています。当日の写経奉納も可能です。' },
      { text: 'お支払いは当日・現地にてお受けいたします。' },
      { text: '詳細・変更がある場合は当サイトまたはお電話にてご確認ください。' },
    ]),
  },
] as const

export default function AdminYakushiko() {
  return <SectionEditor title="温泉寺 薬師講大祭・採灯大護摩供（8/8）" href="/onsenji/events/yakushiko" fields={FIELDS as never} accent="onsenji" />
}
