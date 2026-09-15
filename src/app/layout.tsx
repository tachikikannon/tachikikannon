import './globals.css'
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { GoogleAnalytics } from '@next/third-parties/google'
import { getLocale } from 'next-intl/server'

export const metadata: Metadata = {
  verification: {
    google: '0uh3KRHGdHQwY6jbl6u0WCVjolaPNqS6OfSjK3z0PfQ',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()
  return (
    <html lang={locale}>
      <body>
        {children}
        <Analytics />
      </body>
      <GoogleAnalytics gaId="G-EHX94SHFLS" />
    </html>
  )
}
