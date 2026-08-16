import { Suspense } from 'react'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ReserveForm from './ReserveForm'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'reserve' })
  return { title: t('title') }
}

export default function ReservePage() {
  return (
    <>
      <Header />
      <Suspense fallback={null}>
        <ReserveForm />
      </Suspense>
      <Footer />
    </>
  )
}
