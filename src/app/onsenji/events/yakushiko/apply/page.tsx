import type { Metadata } from 'next'
import HeaderOnsenji from '@/components/HeaderOnsenji'
import FooterOnsenji from '@/components/FooterOnsenji'
import YakushikoApplyForm from './YakushikoApplyForm'

export const metadata: Metadata = { title: '薬師講大祭・採灯大護摩供 申し込み | 日光山温泉寺' }

export default function YakushikoApplyPage() {
  return (
    <>
      <HeaderOnsenji />
      <YakushikoApplyForm />
      <FooterOnsenji />
    </>
  )
}
