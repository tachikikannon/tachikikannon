import type { Metadata } from 'next'
import { buildAlternates } from '@/lib/seo'
import { getTranslations } from 'next-intl/server'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CodOrderForm from './CodOrderForm'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'codOrder' })
  return {
    title: t('title'),
    description: locale === 'en'
      ? 'Order omamori charms, ofuda tablets, and other items by cash-on-delivery. Please submit the required information through this form.'
      : 'お守り・お札などの授与品を代金引換にてお申し込みいただけるページです。必要事項をご入力のうえ送信してください。',
    alternates: buildAlternates(locale, '/order/cod'),
  }
}

export default function CodOrderPage() {
  return (
    <>
      <Header />
      <CodOrderForm />
      <Footer />
    </>
  )
}
