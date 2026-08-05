import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import HeaderOnsenji from '@/components/HeaderOnsenji'
import FooterOnsenji from '@/components/FooterOnsenji'
import YakushikoApplyForm from './YakushikoApplyForm'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'onsenjiYakushikoApply' })
  return { title: `${t('formTitle')} | 日光山温泉寺` }
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
