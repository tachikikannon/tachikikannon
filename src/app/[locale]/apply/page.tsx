import { Suspense } from 'react'
import type { Metadata } from 'next'
import { buildAlternates } from '@/lib/seo'
import { getTranslations } from 'next-intl/server'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ApplyForm from './ApplyForm'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'apply' })
  return {
    title: t('title'),
    description: locale === 'en'
      ? 'Applications for grounds use, group reservations, fee reductions, and other requests at Tachiki Kannon. Please submit the required information through this form.'
      : '立木観音境内の使用申請・団体予約・使用料減免など、各種お申し込みはこちらから受け付けています。必要事項をご入力のうえご提出ください。',
    alternates: buildAlternates(locale, '/apply'),
  }
}

export default function ApplyPage() {
  return (
    <>
      <Header />
      <Suspense fallback={null}>
        <ApplyForm />
      </Suspense>
      <Footer />
    </>
  )
}
