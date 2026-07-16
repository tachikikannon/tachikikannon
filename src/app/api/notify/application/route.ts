import { Resend } from 'resend'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const { category, name, email, phone, message, photo_ref } = await req.json()
    const toEmail = process.env.NOTIFY_EMAIL!

    // お寺への通知
    await resend.emails.send({
      from: 'noreply@resend.dev',
      to: toEmail,
      subject: `【申請】${category} — ${name} 様`,
      html: `
        <h2 style="color:#1a2a4a;">新しい申請が届きました</h2>
        <table style="border-collapse:collapse;width:100%;font-size:14px;">
          <tr><th style="text-align:left;padding:8px 12px;background:#f5f2ec;width:120px;">申請区分</th><td style="padding:8px 12px;border-bottom:1px solid #eee;">${category}</td></tr>
          <tr><th style="text-align:left;padding:8px 12px;background:#f5f2ec;">お名前</th><td style="padding:8px 12px;border-bottom:1px solid #eee;">${name}</td></tr>
          <tr><th style="text-align:left;padding:8px 12px;background:#f5f2ec;">メール</th><td style="padding:8px 12px;border-bottom:1px solid #eee;">${email}</td></tr>
          <tr><th style="text-align:left;padding:8px 12px;background:#f5f2ec;">電話番号</th><td style="padding:8px 12px;border-bottom:1px solid #eee;">${phone || '（未入力）'}</td></tr>
          ${photo_ref ? `<tr><th style="text-align:left;padding:8px 12px;background:#f5f2ec;">対象写真</th><td style="padding:8px 12px;border-bottom:1px solid #eee;">${photo_ref}</td></tr>` : ''}
          <tr><th style="text-align:left;padding:8px 12px;background:#f5f2ec;">内容</th><td style="padding:8px 12px;white-space:pre-wrap;">${message}</td></tr>
        </table>
        <p style="margin-top:20px;font-size:12px;color:#888;">管理画面で確認: /admin/applications</p>
      `,
    })

    // 送信者への自動返信
    await resend.emails.send({
      from: 'noreply@resend.dev',
      to: email,
      subject: '【立木観音】申請を受け付けました',
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;">
          <div style="background:#1a2a4a;padding:24px;text-align:center;">
            <h1 style="color:#c8a96e;margin:0;font-size:20px;">日光山中禅寺 立木観音</h1>
          </div>
          <div style="padding:32px 24px;">
            <p>${name} 様</p>
            <p>申請を受け付けました。内容を確認のうえ、担当者よりご連絡いたします。</p>
            <div style="background:#f5f2ec;padding:16px;border-radius:6px;font-size:13px;margin:20px 0;">
              <strong>申請区分：</strong>${category}<br><br>
              <strong>内容：</strong><br>
              <span style="white-space:pre-wrap;">${message}</span>
            </div>
            <p style="font-size:13px;color:#555;">
              TEL：0288-55-0013（受付時間：拝観時間内）
            </p>
          </div>
          <div style="background:#f5f2ec;padding:16px;text-align:center;font-size:11px;color:#999;">
            〒321-1661 栃木県日光市中宮祠2578
          </div>
        </div>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('notify/application error:', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
