import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import KannonkoApplyForm from './KannonkoApplyForm'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'kannonko' })
  return { title: `${t('title')} 申し込み` }
}

export default function KannonkoApplyPage() {
  return (
    <>
      <Header />
      <KannonkoApplyForm />
      <Footer />
    </>
  )
}
