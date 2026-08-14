'use client'
import SectionEditor from '@/components/admin/SectionEditor'

const J = (v: unknown) => JSON.stringify(v)

const FIELDS = [
  { key: 'onsenji_onsen_status_enabled', label: '温泉営業ステータスの表示（トップページ ヒーロー下に表示）', type: 'boolean' as const, defaultValue: 'true', checkboxLabel: '表示する' },
  { key: 'onsenji_onsen_status_open_time', label: '入浴開始時刻（24時間表記 例: 09:00。季節により変動するため随時更新してください）', defaultValue: '09:00' },
  { key: 'onsenji_onsen_status_close_time', label: '入浴終了時刻（24時間表記 例: 16:00。この時刻を過ぎると自動で「温泉は入れません」表示に切り替わります）', defaultValue: '16:00' },
  {
    key: 'onsenji_onsen_closure_events',
    label: '入浴不可の行事（事前登録。登録した日付になると自動で「本日は◯◯の為、温泉には入れません」と表示されます）',
    type: 'list' as const,
    listFields: [
      { key: 'date', label: '日付（YYYY-MM-DD形式、例: 2026-08-08）' },
      { key: 'name', label: '行事名（例: 薬師講大祭）' },
    ],
    defaultValue: J([]),
  },
] as const

export default function AdminOnsenjOnsenStatus() {
  return <SectionEditor title="温泉設定" href="/onsenji" fields={FIELDS as never} accent="onsenji" />
}
