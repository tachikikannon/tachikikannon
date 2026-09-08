import { Suspense } from 'react'
import type { Metadata } from 'next'
import { buildAlternates } from '@/lib/seo'
import { getTranslations } from 'next-intl/server'
import HeaderOnsenji from '@/components/HeaderOnsenji'
import FooterOnsenji from '@/components/FooterOnsenji'
import OnsenjiApplyForm from './OnsenjiApplyForm'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'onsenjiApply' })
  return {
    title: `${t('title')}`,
    alternates: buildAlternates(locale, '/onsenji/apply'),
  }
}

export default function OnsenjiApplyPage() {
  return (
    <>
      <HeaderOnsenji />
      <Suspense fallback={null}>
        <OnsenjiApplyForm />
      </Suspense>
      <FooterOnsenji />
    </>
  )
}
