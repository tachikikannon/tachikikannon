import { Suspense } from 'react'
import type { Metadata } from 'next'
import HeaderOnsenji from '@/components/HeaderOnsenji'
import FooterOnsenji from '@/components/FooterOnsenji'
import OnsenjiApplyForm from './OnsenjiApplyForm'

export const metadata: Metadata = { title: '各種申請のお問い合わせ | 日光山温泉寺' }

export default function OnsenjiApplyPage() {
  return (
    <>
      <HeaderOnsenji />
      <Suspense fallback={null}>
        <OnsenjiApplyForm />
      </Suspense>
      <FooterOnsenji />
    </>
  )
}
