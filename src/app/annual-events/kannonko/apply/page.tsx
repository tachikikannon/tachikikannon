import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import KannonkoApplyForm from './KannonkoApplyForm'

export const metadata: Metadata = { title: '観音講・大護摩供・地蔵流し 申し込み' }

export default function KannonkoApplyPage() {
  return (
    <>
      <Header />
      <KannonkoApplyForm />
      <Footer />
    </>
  )
}
