import type { Metadata } from 'next'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import NoMediaSave from '@/components/NoMediaSave'

const SITE_META = {
  ja: {
    title: { default: '日光山中禅寺 立木観音 【公式】', template: '%s | 日光山中禅寺 立木観音' },
    description: '中禅寺湖畔に佇む、祈りと巡礼の寺。栃木県日光市中宮祠2578。拝観・御祈願・御朱印・写経体験のご案内。',
    siteName: '日光山中禅寺 立木観音',
    ogLocale: 'ja_JP',
  },
  en: {
    title: { default: 'Nikkozan Chuzenji Tachiki Kannon (Official Site)', template: '%s | Nikkozan Chuzenji Tachiki Kannon' },
    description: 'A temple of prayer and pilgrimage on the shore of Lake Chuzenji, Nikko. 2578 Chugushi, Nikko, Tochigi 321-1661, Japan. Visiting hours, prayer services, goshuin stamps, and sutra-copying experiences.',
    siteName: 'Nikkozan Chuzenji Tachiki Kannon',
    ogLocale: 'en_US',
  },
} as const

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const m = locale === 'en' ? SITE_META.en : SITE_META.ja
  return {
    metadataBase: new URL('https://tachikikannon.vercel.app'),
    title: m.title,
    description: m.description,
    openGraph: {
      siteName: m.siteName,
      locale: m.ogLocale,
      type: 'website',
    },
  }
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
      <NoMediaSave />
      {children}
    </NextIntlClientProvider>
  )
}
