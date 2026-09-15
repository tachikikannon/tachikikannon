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
    description: locale === 'en'
      ? 'Application form for the Yakushiko Grand Festival & Saito Goma Fire Ritual (August 8). Please fill in the required information.'
      : '薬師講大祭・採灯大護摩供（8月8日開催）のお申し込みフォームです。ご希望の内容をご入力のうえ送信してください。',
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
