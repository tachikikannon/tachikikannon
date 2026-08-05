import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FunazentoApplyForm from './FunazentoApplyForm'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'funazento' })
  return { title: `${t('title')} 申し込み` }
}

export default function FunazentoApplyPage() {
  return (
    <>
      <Header />
      <FunazentoApplyForm />
      <Footer />
    </>
  )
}
