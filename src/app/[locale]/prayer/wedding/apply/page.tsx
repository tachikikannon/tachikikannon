import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WeddingApplyForm from './WeddingApplyForm'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'prayerWeddingApply' })
  return { title: t('formTitle') }
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
