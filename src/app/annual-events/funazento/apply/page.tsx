import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FunazentoApplyForm from './FunazentoApplyForm'

export const metadata: Metadata = { title: '船禅頂 申し込み' }

export default function FunazentoApplyPage() {
  return (
    <>
      <Header />
      <FunazentoApplyForm />
      <Footer />
    </>
  )
}
