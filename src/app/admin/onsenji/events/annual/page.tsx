'use client'
import SectionEditor from '@/components/admin/SectionEditor'

const J = (v: unknown) => JSON.stringify(v)

const FIELDS = [
  { key: 'onsenji_events_subtitle', label: '見出し（ヒーロー サブタイトル）', defaultValue: '温泉寺の法要・行事のご案内' },
  {
    key: 'onsenji_events_list', label: '行事一覧（画像・リンク先は固定・2件）', type: 'list' as const,
    listFields: [
      { key: 'month', label: '月（バッジ表示）' },
      { key: 'date', label: '開催日' },
      { key: 'time', label: '開始時間' },
      { key: 'name', label: '行事名' },
      { key: 'desc', label: '説明', multiline: true },
    ],
    defaultValue: J([
      { month: '8月', date: '8月8日', time: '午前11時〜', name: '薬師講大祭・採灯大護摩供', desc: '湯の湖畔にて、山伏によって採灯大護摩供が焚かれます。写経が御本尊に奉じられ、護摩の炎で焚き上げられる、温泉寺最大の法要です。' },
      { month: '1月', date: '1月下旬', time: '午前11時〜', name: '温泉寺 節分大祭', desc: '新年の邪気を払い、福を招く節分の法要です。豆まきや護摩供を通じて、参拝者の一年の健康と幸福をお祈りします。' },
    ]),
  },
] as const

export default function AdminOnsenjAnnualEvents() {
  return <SectionEditor title="温泉寺 年間行事一覧" href="/onsenji/events" fields={FIELDS as never} accent="onsenji" />
}
