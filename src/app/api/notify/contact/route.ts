import { Resend } from 'resend'
import { NextResponse } from 'next/server'
import { sendLinePush } from '@/lib/line'
import { sendGmail } from '@/lib/gmail'
import { markAutoReplySent } from '@/lib/notifyStatus'

type Temple = 'chuzenji' | 'onsenji'

const TEMPLE_INFO: Record<Temple, {
  nameJa: string; nameEn: string
  tel: string
  addressJa: string; addressEn: string
  headerColor: string; accentColor: string
}> = {
  chuzenji: {
    nameJa: '日光山中禅寺 立木観音',
    nameEn: 'Chuzenji Tachikikannon, Nikkosan',
    tel: '0288-55-0013',
    addressJa: '〒321-1661 栃木県日光市中宮祠2578',
    addressEn: '2578 Chugushi, Nikko, Tochigi 321-1661, Japan',
    headerColor: '#1a2a4a',
    accentColor: '#c8a96e',
  },
  onsenji: {
    nameJa: '日光山温泉寺',
    nameEn: 'Onsenji Temple, Nikkosan',
    tel: '0288-55-0013',
    addressJa: '栃木県日光市湯元2559',
    addressEn: '2559 Yumoto, Nikko, Tochigi, Japan',
    headerColor: '#2d6a4f',
    accentColor: '#7ec8a4',
  },
}

export async function POST(req: Request) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const { id, name, email, subject, message, locale, temple } = await req.json()
    const isEnglish = locale === 'en'
    const info = TEMPLE_INFO[(temple as Temple) === 'onsenji' ? 'onsenji' : 'chuzenji']
    const toEmail = process.env.NOTIFY_EMAIL!
    const adminUrl = `${process.env.SITE_URL ?? ''}/admin/contacts`
    const receivedAt = new Date().toLocaleString('ja-JP')

    // メール通知とLINEグループ通知は並行して実行し、どちらかが失敗しても
    // 問い合わせ登録そのものは成功として扱う（LINE失敗はログのみ）。
    const [, , replyResult] = await Promise.allSettled([
      sendLinePush(
        `【新規お問い合わせ】${isEnglish ? '（英語フォーム）' : ''}\n氏名: ${name}\n件名: ${subject}\n受信日時: ${receivedAt}\n管理画面: ${adminUrl}`
      ),

      // お寺への通知（スタッフ向けのため日本語のまま）
      resend.emails.send({
      from: 'noreply@resend.dev',
      to: toEmail,
      subject: `【お問い合わせ】${subject} — ${name} 様`,
      html: `
        <h2 style="color:#1a2a4a;">新しいお問い合わせが届きました</h2>
        <table style="border-collapse:collapse;width:100%;font-size:14px;">
          <tr><th style="text-align:left;padding:8px 12px;background:#f5f2ec;width:120px;">お名前</th><td style="padding:8px 12px;border-bottom:1px solid #eee;">${name}</td></tr>
          <tr><th style="text-align:left;padding:8px 12px;background:#f5f2ec;">メール</th><td style="padding:8px 12px;border-bottom:1px solid #eee;">${email}</td></tr>
          <tr><th style="text-align:left;padding:8px 12px;background:#f5f2ec;">件名</th><td style="padding:8px 12px;border-bottom:1px solid #eee;">${subject}</td></tr>
          <tr><th style="text-align:left;padding:8px 12px;background:#f5f2ec;">内容</th><td style="padding:8px 12px;white-space:pre-wrap;">${message}</td></tr>
          ${isEnglish ? '<tr><th style="text-align:left;padding:8px 12px;background:#f5f2ec;">言語</th><td style="padding:8px 12px;">英語フォームからの問い合わせです</td></tr>' : ''}
        </table>
        <p style="margin-top:20px;font-size:12px;color:#888;">管理画面で確認: /admin/contacts</p>
      `,
      }),

      // 送信者への自動返信（Resendはドメイン未認証のため、Gmail経由で直接送信）
      // 送信元フォームの言語に合わせて日本語/英語のテンプレートを切り替える。
      sendGmail(
        email,
        isEnglish
          ? `Thank You for Your Inquiry - ${info.nameEn}`
          : `【${info.nameJa}】お問い合わせを受け付けました`,
        isEnglish
          ? `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;">
            <div style="background:${info.headerColor};padding:24px;text-align:center;">
              <h1 style="color:${info.accentColor};margin:0;font-size:20px;">${info.nameEn}</h1>
            </div>
            <div style="padding:32px 24px;">
              <p>Dear ${name},</p>
              <p>Thank you for contacting us. We have received your inquiry and will get back to you as soon as possible.</p>
              <div style="background:#f5f2ec;padding:16px;border-radius:6px;font-size:13px;margin:20px 0;">
                <strong>Subject:</strong> ${subject}<br><br>
                <strong>Message:</strong><br>
                <span style="white-space:pre-wrap;">${message}</span>
              </div>
              <p style="font-size:13px;color:#555;">
                TEL: +81-288-55-0013 (during visiting hours)
              </p>
            </div>
            <div style="background:#f5f2ec;padding:16px;text-align:center;font-size:11px;color:#999;">
              ${info.addressEn}
            </div>
          </div>
        `
          : `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;">
            <div style="background:${info.headerColor};padding:24px;text-align:center;">
              <h1 style="color:${info.accentColor};margin:0;font-size:20px;">${info.nameJa}</h1>
            </div>
            <div style="padding:32px 24px;">
              <p>${name} 様</p>
              <p>お問い合わせいただきありがとうございます。<br>内容を確認のうえ、担当者よりご連絡いたします。</p>
              <div style="background:#f5f2ec;padding:16px;border-radius:6px;font-size:13px;margin:20px 0;">
                <strong>件名：</strong>${subject}<br><br>
                <strong>内容：</strong><br>
                <span style="white-space:pre-wrap;">${message}</span>
              </div>
              <p style="font-size:13px;color:#555;">
                TEL：${info.tel}（受付時間：拝観時間内）
              </p>
            </div>
            <div style="background:#f5f2ec;padding:16px;text-align:center;font-size:11px;color:#999;">
              ${info.addressJa}
            </div>
          </div>
        `
      ),
    ])

    if (replyResult.status === 'fulfilled') await markAutoReplySent('contacts', id)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('notify/contact error:', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
