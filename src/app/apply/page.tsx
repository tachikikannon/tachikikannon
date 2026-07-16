import { Suspense } from 'react'
import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ApplyForm from './ApplyForm'

export const metadata: Metadata = { title: '各種申請のお問い合わせ' }

export default function ApplyPage() {
  return (
    <>
      <Header />
      <Suspense fallback={null}>
        <ApplyForm />
      </Suspense>
      <Footer />
    </>
  )
}
