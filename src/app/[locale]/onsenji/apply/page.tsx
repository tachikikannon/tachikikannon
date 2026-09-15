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
    description: locale === 'en'
      ? 'Applications for grounds use, group reservations, and other requests at Nikkozan Onsenji Temple. Please submit the required information through this form.'
      : '日光山温泉寺境内の使用申請・団体予約など、各種お申し込みはこちらから受け付けています。必要事項をご入力のうえご提出ください。',
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
