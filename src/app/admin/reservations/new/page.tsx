'use client'
import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import NewReservationForm from '@/components/admin/NewReservationForm'

function NewReservationPageContent() {
  const searchParams = useSearchParams()
  // 予約スケジュール画面で選んだ日付から遷移してきた場合、その日付を引き継ぐ
  const initialDateParam = searchParams.get('date') ?? ''

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-1 flex-wrap gap-3">
        <h1 className="text-2xl font-serif text-navy">新規予約登録</h1>
        <div className="flex items-center gap-4">
          <Link href="/admin/reservations/schedule" className="text-sm text-navy underline">予約スケジュールを見る →</Link>
          <Link href="/admin/reservations" className="text-sm text-navy underline">予約一覧を見る →</Link>
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        枠をクリックすると、予約の追加とその場での受付停止／再開が選べます。定員や確保枠などの詳細な設定は「空き状況の詳細設定」で行ってください。
        {initialDateParam && <span className="block text-navy mt-1">予約スケジュールから：{initialDateParam} の週を表示しています。</span>}
      </p>

      <NewReservationForm initialDate={initialDateParam || undefined} />
    </div>
  )
}

export default function AdminNewReservationPage() {
  return (
    <Suspense fallback={null}>
      <NewReservationPageContent />
    </Suspense>
  )
}
