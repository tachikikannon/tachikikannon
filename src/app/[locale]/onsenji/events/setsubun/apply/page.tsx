import type { Metadata } from 'next'
import HeaderOnsenji from '@/components/HeaderOnsenji'
import FooterOnsenji from '@/components/FooterOnsenji'
import SetsubunApplyForm from './SetsubunApplyForm'

export const metadata: Metadata = { title: '節分大祭 申し込み | 日光山温泉寺' }

export default function SetsubunApplyPage() {
  return (
    <>
      <HeaderOnsenji />
      <SetsubunApplyForm />
      <FooterOnsenji />
    </>
  )
}
