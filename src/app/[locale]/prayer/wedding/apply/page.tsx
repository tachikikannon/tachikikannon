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
    description: locale === 'en'
      ? 'Application form for a Buddhist wedding ceremony. Please enter your preferred date and details for both of you.'
      : '仏前式（結婚式）のお申し込みフォームです。ご希望の日程やお二人の情報をご入力のうえ送信してください。',
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
