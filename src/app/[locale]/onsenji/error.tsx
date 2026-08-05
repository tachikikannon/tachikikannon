'use client'

export default function OnsenjError({
  error,
}: {
  error: Error & { digest?: string }
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <div className="bg-white rounded-2xl shadow p-8 max-w-lg w-full">
        <h2 className="text-red-600 font-bold mb-4">温泉寺サイトでエラーが発生しました</h2>
        <p className="text-sm text-gray-600 mb-2"><strong>メッセージ:</strong> {error.message}</p>
        {error.digest && (
          <p className="text-sm text-gray-600 mb-2"><strong>Digest:</strong> {error.digest}</p>
        )}
        <pre className="bg-gray-100 rounded p-3 text-xs overflow-auto mt-4">
          {error.stack}
        </pre>
      </div>
    </div>
  )
}
