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
    description: locale === 'en'
      ? 'Application form to join the Setsubun Grand Festival (late January). Please enter your party size and contact information.'
      : '節分大祭（1月下旬開催）の参加お申し込みフォームです。ご人数・ご連絡先をご入力のうえお申し込みください。',
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
