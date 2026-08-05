import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ShogatsuApplyForm from './ShogatsuApplyForm'

export const metadata: Metadata = { title: '正月元旦特別護摩祈願 申し込み' }

export default function ShogatsuApplyPage() {
  return (
    <>
      <Header />
      <ShogatsuApplyForm />
      <Footer />
    </>
  )
}
