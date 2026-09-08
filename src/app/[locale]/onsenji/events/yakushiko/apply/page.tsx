import type { Metadata } from 'next'
import { buildAlternates } from '@/lib/seo'
import { getTranslations } from 'next-intl/server'
import HeaderOnsenji from '@/components/HeaderOnsenji'
import FooterOnsenji from '@/components/FooterOnsenji'
import YakushikoApplyForm from './YakushikoApplyForm'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'onsenjiYakushikoApply' })
  return {
    title: `${t('formTitle')}`,
    alternates: buildAlternates(locale, '/onsenji/events/yakushiko/apply'),
  }
}

export default function YakushikoApplyPage() {
  return (
    <>
      <HeaderOnsenji />
      <YakushikoApplyForm />
      <FooterOnsenji />
    </>
  )
}
