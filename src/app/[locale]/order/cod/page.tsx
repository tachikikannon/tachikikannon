import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CodOrderForm from './CodOrderForm'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'codOrder' })
  return { title: t('title') }
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
