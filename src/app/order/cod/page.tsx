import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CodOrderForm from './CodOrderForm'

export const metadata: Metadata = { title: '代金引換でのお申し込み' }

export default function CodOrderPage() {
  return (
    <>
      <Header />
      <CodOrderForm />
      <Footer />
    </>
  )
}
