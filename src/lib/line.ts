import 'server-only'

// LINE Messaging APIへテキストメッセージをpushする。
// 失敗しても例外は投げない（呼び出し元の予約/問い合わせ登録処理を止めないため）。
export async function sendLinePush(text: string): Promise<void> {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN
  const groupId = process.env.LINE_RESERVATION_GROUP_ID
  if (!token || !groupId) {
    console.error('[LINE] LINE_CHANNEL_ACCESS_TOKEN または LINE_RESERVATION_GROUP_ID が未設定のため通知をスキップしました')
    return
  }

  try {
    const res = await fetch('https://api.line.me/v2/bot/message/push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        to: groupId,
        messages: [{ type: 'text', text }],
      }),
    })
    if (!res.ok) {
      console.error('[LINE] push failed:', res.status, await res.text())
    }
  } catch (err) {
    console.error('[LINE] push error:', err)
  }
}
