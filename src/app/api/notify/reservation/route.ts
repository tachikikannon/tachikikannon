import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

const TYPE_LABELS: Record<string, string> = {
  prayer:  '護摩祈願',
  shakyou: '写経',
  shabutu: '写仏',
  jyuzu:   '数珠づくり',
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, name_kana, email, phone, type, date, time_slot, party_size, notes } = body

    const typeLabel = TYPE_LABELS[type] ?? type
    const toEmail = process.env.NOTIFY_EMAIL!

    // お寺への通知メール
    await resend.emails.send({
      from: 'noreply@resend.dev',
      to: toEmail,
      subject: `【予約通知】${typeLabel} — ${name} 様`,
      html: `
        <h2 style="color:#1a2a4a;">新しい予約が届きました</h2>
        <table style="border-collapse:collapse;width:100%;font-size:14px;">
          <tr><th style="text-align:left;padding:8px 12px;background:#f5f2ec;width:120px;">種別</th><td style="padding:8px 12px;border-bottom:1px solid #eee;">${typeLabel}</td></tr>
          <tr><th style="text-align:left;padding:8px 12px;background:#f5f2ec;">希望日時</th><td style="padding:8px 12px;border-bottom:1px solid #eee;">${date} ${time_slot}</td></tr>
          <tr><th style="text-align:left;padding:8px 12px;background:#f5f2ec;">人数</th><td style="padding:8px 12px;border-bottom:1px solid #eee;">${party_size}名</td></tr>
          <tr><th style="text-align:left;padding:8px 12px;background:#f5f2ec;">お名前</th><td style="padding:8px 12px;border-bottom:1px solid #eee;">${name}（${name_kana}）</td></tr>
          <tr><th style="text-align:left;padding:8px 12px;background:#f5f2ec;">メール</th><td style="padding:8px 12px;border-bottom:1px solid #eee;">${email}</td></tr>
          <tr><th style="text-align:left;padding:8px 12px;background:#f5f2ec;">電話番号</th><td style="padding:8px 12px;border-bottom:1px solid #eee;">${phone}</td></tr>
          <tr><th style="text-align:left;padding:8px 12px;background:#f5f2ec;">備考</th><td style="padding:8px 12px;">${notes || 'なし'}</td></tr>
        </table>
        <p style="margin-top:20px;font-size:12px;color:#888;">管理画面で確認: /admin/reservations</p>
      `,
    })

    // 申込者への自動返信メール
    await resend.emails.send({
      from: 'noreply@resend.dev',
      to: email,
      subject: `【立木観音】ご予約を受け付けました — ${typeLabel}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;">
          <div style="background:#1a2a4a;padding:24px;text-align:center;">
            <h1 style="color:#c8a96e;margin:0;font-size:20px;">日光山中禅寺 立木観音</h1>
          </div>
          <div style="padding:32px 24px;">
            <p>${name} 様</p>
            <p>この度はご予約いただきありがとうございます。<br>以下の内容でご予約を受け付けました。</p>
            <table style="border-collapse:collapse;width:100%;font-size:14px;margin:20px 0;">
              <tr><th style="text-align:left;padding:8px 12px;background:#f5f2ec;width:120px;">種別</th><td style="padding:8px 12px;border-bottom:1px solid #eee;">${typeLabel}</td></tr>
              <tr><th style="text-align:left;padding:8px 12px;background:#f5f2ec;">希望日時</th><td style="padding:8px 12px;border-bottom:1px solid #eee;">${date} ${time_slot}</td></tr>
              <tr><th style="text-align:left;padding:8px 12px;background:#f5f2ec;">人数</th><td style="padding:8px 12px;">${party_size}名</td></tr>
            </table>
            <p style="background:#fffbf0;border-left:4px solid #c8a96e;padding:12px 16px;font-size:13px;">
              ご予約はお寺からの確認をもって成立となります。<br>
              確認のご連絡まで数日お待ちいただく場合がございます。
            </p>
            <p style="font-size:13px;color:#555;">
              お問い合わせ：<br>
              日光山中禅寺 立木観音<br>
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
    console.error('notify/reservation error:', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
