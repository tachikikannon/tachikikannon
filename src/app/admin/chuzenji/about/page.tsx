'use client'
import SectionEditor from '@/components/admin/SectionEditor'

const FIELDS = [
  { key: 'about_fee_adult',      label: '大人 拝観料',      defaultValue: '500円' },
  { key: 'about_fee_child',      label: '子供 拝観料',      defaultValue: '200円' },
  { key: 'about_fee_group_adult', label: '大人 団体料金（20名様以上）', defaultValue: '450円' },
  { key: 'about_fee_group_child', label: '子供 団体料金（20名様以上）', defaultValue: '180円' },
  { key: 'about_hours_peak',     label: '4月〜10月 拝観時間', defaultValue: '午前8時〜午後5時' },
  { key: 'about_hours_shoulder', label: '11月・3月 拝観時間', defaultValue: '午前8時〜午後4時' },
  { key: 'about_hours_winter',   label: '12月〜2月 拝観時間', defaultValue: '午前8時30分〜午後3時30分' },
] as const

export default function AdminChuzenjAbout() {
  return <SectionEditor title="拝観案内（拝観時間・拝観料）" href="/about" fields={FIELDS as never} />
}
