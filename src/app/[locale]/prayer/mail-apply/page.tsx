import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MailApplyContent from './MailApplyContent'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'prayerMailApply' })
  return { title: t('title') }
}

export default function PrayerMailApplyPage() {
  return (
    <>
      <Header />
      <MailApplyContent />
      <Footer />
    </>
  )
}
