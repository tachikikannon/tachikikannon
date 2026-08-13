'use client'
import SectionEditor from '@/components/admin/SectionEditor'

const J = (v: unknown) => JSON.stringify(v)

const FIELDS = [
  { key: 'flower_calendar_subtitle', label: '見出し（サブタイトル）', defaultValue: '境内を彩る、四季折々の花', translatable: true },
  {
    key: 'flower_calendar_items', label: '花ごよみ（月ごとの花）', type: 'list' as const,
    listFields: [
      { key: 'month', label: '見頃（例：4月〜5月）' },
      { key: 'name', label: '花の名前・見出し' },
      { key: 'image', label: '画像パス（「画像管理」でアップロードしたURLを貼り付け）' },
      { key: 'desc', label: '説明', multiline: true },
    ],
    defaultValue: J([
      { month: '準備中', name: '花ごよみ、只今準備中です', image: '', desc: '境内で見られる季節の花の情報を、只今準備しております。今しばらくお待ちください。' },
    ]),
    translatable: true,
    defaultValueEn: J([
      { month: 'Coming Soon', name: 'Flower Calendar — Coming Soon', image: '', desc: 'We are currently preparing information about the seasonal flowers found on our grounds. Please check back soon.' },
    ]),
  },
] as const

export default function AdminChuzenjiFlowerCalendar() {
  return <SectionEditor title="花ごよみ" href="/flower-calendar" fields={FIELDS as never} />
}
