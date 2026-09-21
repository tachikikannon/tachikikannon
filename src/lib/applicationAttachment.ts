// 申請フォームの添付PDF（application-attachments バケット）の扱い。
// バケットは非公開。管理画面では createSignedUrl で発行した期限付きリンクで開く。
export const APPLICATION_ATTACHMENT_BUCKET = 'application-attachments'

// 期限付きリンクの有効時間（秒）。詳細パネルを開くたびに発行し直す。
export const ATTACHMENT_LINK_TTL_SECONDS = 60 * 60

// applications.attachment_url には、新しい申請ではバケット内のパス（例: xxxx.pdf）を保存する。
// 以前の申請には公開URL（.../object/public/application-attachments/xxxx.pdf）が保存されているため、
// どちらの形式でもパスを取り出せるようにしている。
export function attachmentPath(value: string): string {
  const m = value.match(/\/application-attachments\/([^?#]+)/)
  return m ? decodeURIComponent(m[1]) : value
}
