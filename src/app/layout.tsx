import './globals.css'
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { GoogleAnalytics } from '@next/third-parties/google'

export const metadata: Metadata = {
  verification: {
    google: '0uh3KRHGdHQwY6jbl6u0WCVjolaPNqS6OfSjK3z0PfQ',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        {children}
        <Analytics />
      </body>
      <GoogleAnalytics gaId="G-EHX94SHFLS" />
    </html>
  )
}
