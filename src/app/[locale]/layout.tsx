import type { Metadata } from 'next'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'

export const metadata: Metadata = {
  title: { default: '日光山中禅寺 立木観音 【公式】', template: '%s | 日光山中禅寺 立木観音' },
  description: '中禅寺湖畔に佇む、祈りと巡礼の寺。栃木県日光市中宮祠2578。拝観・御祈願・御朱印・写経体験のご案内。',
  openGraph: {
    siteName: '日光山中禅寺 立木観音',
    locale: 'ja_JP',
    type: 'website',
  },
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)

  return (
    <NextIntlClientProvider>
      {children}
    </NextIntlClientProvider>
  )
}
