import type { Metadata } from 'next'
import { buildAlternates } from '@/lib/seo'
import { getTranslations } from 'next-intl/server'
import HeaderOnsenji from '@/components/HeaderOnsenji'
import FooterOnsenji from '@/components/FooterOnsenji'
import SetsubunApplyForm from './SetsubunApplyForm'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'onsenjiSetsubunApply' })
  return {
    title: `${t('formTitle')}`,
    alternates: buildAlternates(locale, '/onsenji/events/setsubun/apply'),
  }
}

export default function SetsubunApplyPage() {
  return (
    <>
      <HeaderOnsenji />
      <SetsubunApplyForm />
      <FooterOnsenji />
    </>
  )
}
