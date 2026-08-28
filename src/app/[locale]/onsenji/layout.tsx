import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { default: '日光山温泉寺 【公式】｜中禅寺湖畔の温泉と祈りの霊場', template: '%s | 日光山温泉寺' },
  description: '中禅寺湖畔に佇む、日光山温泉寺の公式サイト。栃木県日光市湯元2559。薬師瑠璃光如来をお祀りする温泉と祈りの霊場。拝観・御朱印・写経体験・薬師の湯のご案内。',
  openGraph: {
    siteName: '日光山温泉寺',
    locale: 'ja_JP',
    type: 'website',
  },
}

export default function OnsenjiLayout({ children }: { children: React.ReactNode }) {
  return children
}
