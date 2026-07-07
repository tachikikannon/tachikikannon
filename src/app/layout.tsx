import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: { default: '日光山中禅寺 立木観音 【公式】', template: '%s | 日光山中禅寺 立木観音' },
  description: '中禅寺湖畔に佇む、祈りと巡礼の寺。栃木県日光市中宮祠2578。拝観・御祈願・御朱印・写経体験のご案内。',
  openGraph: {
    siteName: '日光山中禅寺 立木観音',
    locale: 'ja_JP',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
