import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ReserveForm from './ReserveForm'

export const metadata: Metadata = { title: '体験・御祈願のご予約' }

export default function ReservePage() {
  return (
    <>
      <Header />
      <ReserveForm />
      <Footer />
    </>
  )
}
