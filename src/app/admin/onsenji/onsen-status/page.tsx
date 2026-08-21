'use client'
import SectionEditor from '@/components/admin/SectionEditor'

const J = (v: unknown) => JSON.stringify(v)

const FIELDS = [
  { key: 'onsenji_onsen_status_enabled', label: '温泉営業ステータスの表示（トップページ ヒーロー下に表示）', type: 'boolean' as const, defaultValue: 'true', checkboxLabel: '表示する' },
  { key: 'onsenji_onsen_status_open_label', label: '営業中の表示文言', defaultValue: 'ただいま入浴いただけます', translatable: true },
  { key: 'onsenji_onsen_status_closed_time_label', label: '時間外の表示文言', defaultValue: '本日の入浴は終了しました', translatable: true },
  { key: 'onsenji_onsen_status_open_time', label: '入浴開始時刻（24時間表記 例: 09:00。季節により変動するため随時更新してください）', defaultValue: '09:00' },
  { key: 'onsenji_onsen_status_close_time', label: '入浴終了時刻（24時間表記 例: 16:00。この時刻を過ぎると自動で時間外の表示文言に切り替わります）', defaultValue: '16:00' },
  { key: 'onsenji_onsen_status_note', label: '入浴時間の下に表示する補足文言', defaultValue: '※満員の場合は順番にご入浴いただきます', translatable: true },
  {
    key: 'onsenji_onsen_closure_events',
    label: '入浴不可の行事（事前登録。登録した日付になると自動で「本日は◯◯の為、温泉には入れません」と表示されます）',
    type: 'list' as const,
    listFields: [
      { key: 'date', label: '日付（YYYY-MM-DD形式、例: 2026-08-08）' },
      { key: 'name', label: '行事名（例: 薬師講大祭）' },
    ],
    defaultValue: J([]),
    translatable: true,
  },
] as const

export default function AdminOnsenjOnsenStatus() {
  return <SectionEditor title="温泉設定" href="/onsenji" fields={FIELDS as never} accent="onsenji" />
}
