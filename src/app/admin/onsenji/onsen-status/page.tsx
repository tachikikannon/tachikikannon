'use client'
import SectionEditor from '@/components/admin/SectionEditor'

const J = (v: unknown) => JSON.stringify(v)

const FIELDS = [
  // 閉湯・開湯（冬季休業など）。src/app/admin/onsenji-pages/page.tsx の「温泉設定」と同じ内容にすること
  { key: 'onsenji_onsen_season_close_date', label: '【閉湯登録】閉湯日（この日から公開ページが自動で「閉湯中」の案内に切り替わります。閉湯期間中は、下の「温泉営業ステータスの表示」の設定に関係なく案内を表示します）', type: 'date' as const, clearLabel: '日付を消す' },
  { key: 'onsenji_onsen_season_open_date', label: '【開湯登録】開湯日・予定（この日から自動で通常の営業表示に戻ります。未定なら空欄で保存してください。閉湯中は「開湯予定日：令和◯年◯月◯日」または「開湯予定日：未定」と表示されます）', type: 'date' as const, clearLabel: '日付を消す（未定にする）' },
  { key: 'onsenji_onsen_season_closed_force', label: '【閉湯登録】今すぐ閉湯中にする（チェックを入れている間は、日付に関係なく閉湯中の案内を表示します。開湯したらチェックを外して保存してください）', type: 'boolean' as const, defaultValue: 'false', checkboxLabel: '閉湯中にする' },
  { key: 'onsenji_onsen_season_closed_label', label: '閉湯中の見出し文言', defaultValue: '冬季閉湯中', translatable: true },
  { key: 'onsenji_onsen_season_wait_message', label: '閉湯中のメッセージ（空欄で保存すると表示しません）', multiline: true, defaultValue: '開湯するまでお待ちください。', translatable: true, clearable: true },
  { key: 'onsenji_onsen_season_info_message', label: '開湯についての案内メッセージ（例: 昨年は令和8年4月11日に開湯しました。空欄で保存すると表示しません）', multiline: true, defaultValue: '昨年は令和8年4月11日に開湯しました。', translatable: true, clearable: true },
  { key: 'onsenji_onsen_status_enabled', label: '温泉営業ステータスの表示（トップページ ヒーロー下に表示）', type: 'boolean' as const, defaultValue: 'true', checkboxLabel: '表示する' },
  { key: 'onsenji_onsen_status_open_label', label: '営業中の表示文言', defaultValue: 'ただいま入浴いただけます', translatable: true },
  { key: 'onsenji_onsen_status_reception_closed_label', label: '受付終了間際（終了1時間前〜終了時刻）の表示文言', defaultValue: '本日の入浴の受付は終了しました', translatable: true },
  { key: 'onsenji_onsen_status_closed_time_label', label: '時間外の表示文言', defaultValue: '本日の入浴は終了しました', translatable: true },
  { key: 'onsenji_onsen_status_open_time', label: '入浴開始時刻（24時間表記 例: 09:00。季節により変動するため随時更新してください）', defaultValue: '09:00' },
  { key: 'onsenji_onsen_status_close_time', label: '入浴終了時刻（24時間表記 例: 16:00。終了1時間前になると自動で受付終了の表示文言に切り替わり、この時刻を過ぎると時間外の表示文言に切り替わります）', defaultValue: '16:00' },
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
