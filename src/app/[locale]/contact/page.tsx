import type { Metadata } from 'next'
import { buildAlternates } from '@/lib/seo'
import { getTranslations } from 'next-intl/server'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContactForm from './ContactForm'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contact' })
  return {
    title: t('title'),
    description: locale === 'en'
      ? 'For inquiries other than visiting, prayer, or experience reservations, please contact Nikkozan Chuzenji Tachiki Kannon using this form or by phone.'
      : '拝観・御祈願・体験のご予約以外のお問い合わせはこちらのフォームまたはお電話にて承っております。日光山中禅寺 立木観音までお気軽にご連絡ください。',
    alternates: buildAlternates(locale, '/contact'),
  }
}

export default function ContactPage() {
  return (
    <>
      <Header />
      <ContactForm />
      <Footer />
    </>
  )
}
