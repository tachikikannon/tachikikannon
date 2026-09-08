import type { Metadata } from 'next'
import { buildAlternates } from '@/lib/seo'
import { getTranslations } from 'next-intl/server'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WeddingApplyForm from './WeddingApplyForm'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'prayerWeddingApply' })
  return {
    title: t('formTitle'),
    alternates: buildAlternates(locale, '/prayer/wedding/apply'),
  }
}

export default function WeddingApplyPage() {
  return (
    <>
      <Header />
      <WeddingApplyForm />
      <Footer />
    </>
  )
}
