import { Suspense } from 'react'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ApplyForm from './ApplyForm'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'apply' })
  return { title: t('title') }
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
