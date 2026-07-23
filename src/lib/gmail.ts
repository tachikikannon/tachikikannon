import 'server-only'
import nodemailer from 'nodemailer'

// Resendのドメイン未認証制限を受けず、tachikikannon5513@gmail.com から
// 直接お客様宛てメールを送るための経路（Googleアプリパスワード認証）。
export async function sendGmail(to: string, subject: string, html: string) {
  const user = process.env.GMAIL_USER
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, '')
  if (!user || !pass) {
    console.error('[gmail] GMAIL_USER または GMAIL_APP_PASSWORD が未設定のため送信をスキップしました')
    return
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  })

  await transporter.sendMail({
    from: `"日光山中禅寺 立木観音" <${user}>`,
    to,
    subject,
    html,
  })
}
