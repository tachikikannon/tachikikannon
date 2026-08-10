import { Resend } from 'resend'
import { NextResponse } from 'next/server'
import { sendLinePush } from '@/lib/line'
import { sendGmail } from '@/lib/gmail'
import { markAutoReplySent } from '@/lib/notifyStatus'

const TYPE_LABELS: Record<string, string> = {
  prayer:  '護摩祈願',
  shakyou: '写経',
  shabutu: '写仏',
  jyuzu:   '数珠づくり',
  zazen:   '坐禅',
}

const TYPE_LABELS_EN: Record<string, string> = {
  prayer:  'Prayer Service',
  shakyou: 'Sutra Copying',
  shabutu: 'Buddhist Image Tracing',
  jyuzu:   'Juzu Bracelet Making',
  zazen:   'Zazen Meditation',
}

export async function POST(req: Request) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const body = await req.json()
    const { id, name, name_kana, email, phone, type, date, time_slot, party_size, notes, locale } = body
    const isEnglish = locale === 'en'

    const typeLabel = TYPE_LABELS[type] ?? type
    const typeLabelEn = TYPE_LABELS_EN[type] ?? type
    const toEmail = process.env.NOTIFY_EMAIL!
    const adminUrl = `${process.env.SITE_URL ?? ''}/admin/reservations`

    // メール通知とLINEグループ通知は並行して実行し、どちらかが失敗しても
    // 予約登録そのものは成功として扱う（LINE失敗はログのみ）。
    const [, , replyResult] = await Promise.allSettled([
      sendLinePush(
        `【新規予約】${isEnglish ? '（英語フォーム）' : ''}\n予約番号: ${id ?? '(不明)'}\n氏名: ${name}\n予約日時: ${date} ${time_slot}\n人数: ${party_size}名\n体験内容: ${typeLabel}\n管理画面: ${adminUrl}`
      ),

      // お寺への通知メール（スタッフ向けのため日本語のまま）
      resend.emails.send({
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
          ${isEnglish ? '<tr><th style="text-align:left;padding:8px 12px;background:#f5f2ec;">言語</th><td style="padding:8px 12px;">英語フォームからの予約です</td></tr>' : ''}
        </table>
        <p style="margin-top:20px;font-size:12px;color:#888;">管理画面で確認: /admin/reservations</p>
      `,
    }),

    // 申込者への自動返信メール（Resendはドメイン未認証のため、Gmail経由で直接送信）
    // 送信元フォームの言語に合わせて日本語/英語のテンプレートを切り替える。
    sendGmail(
      email,
      isEnglish
        ? `Your Reservation Has Been Received — ${typeLabelEn}`
        : `【立木観音】ご予約を受け付けました — ${typeLabel}`,
      isEnglish
        ? `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;">
          <div style="background:#1a2a4a;padding:24px;text-align:center;">
            <h1 style="color:#c8a96e;margin:0;font-size:20px;">Chuzenji Tachikikannon, Nikkosan</h1>
          </div>
          <div style="padding:32px 24px;">
            <p>Dear ${name},</p>
            <p>Thank you very much for your reservation request for the <strong>${typeLabelEn}</strong> experience at Nikkozan Chuzenji, Tachikikannon.</p>
            <div style="background:#fffbf0;border:1px solid #c8a96e;border-radius:6px;padding:14px 16px;margin:18px 0;text-align:center;">
              <p style="margin:0;font-size:12px;letter-spacing:0.05em;color:#8a6d1a;">CURRENT STATUS</p>
              <p style="margin:4px 0 0;font-size:18px;font-weight:bold;color:#1a2a4a;">Provisional (Not Yet Confirmed)</p>
            </div>
            <table style="border-collapse:collapse;width:100%;font-size:14px;margin:20px 0;">
              <tr><th style="text-align:left;padding:8px 12px;background:#f5f2ec;width:140px;">Type</th><td style="padding:8px 12px;border-bottom:1px solid #eee;">${typeLabelEn}</td></tr>
              <tr><th style="text-align:left;padding:8px 12px;background:#f5f2ec;">Date &amp; Time</th><td style="padding:8px 12px;border-bottom:1px solid #eee;">${date} ${time_slot}</td></tr>
              <tr><th style="text-align:left;padding:8px 12px;background:#f5f2ec;">Party Size</th><td style="padding:8px 12px;">${party_size}</td></tr>
            </table>
            <ul style="font-size:13px;color:#333;padding-left:20px;margin:0 0 20px;">
              <li style="margin-bottom:6px;">Once confirmed, we will send a separate "Reservation Confirmed" email.</li>
              <li>No word after a few days? Please contact us below.</li>
            </ul>
            <p style="font-size:13px;color:#555;">
              Chuzenji Tachikikannon Temple Office<br>
              TEL: +81-288-55-0013
            </p>
          </div>
          <div style="background:#f5f2ec;padding:16px;text-align:center;font-size:11px;color:#999;">
            2578 Chugushi, Nikko, Tochigi 321-1661, Japan
          </div>
        </div>
      `
        : `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;">
          <div style="background:#1a2a4a;padding:24px;text-align:center;">
            <h1 style="color:#c8a96e;margin:0;font-size:20px;">日光山中禅寺 立木観音</h1>
          </div>
          <div style="padding:32px 24px;">
            <p>${name} 様</p>
            <p>この度は、日光山中禅寺立木観音【${typeLabel}】にお申し込みいただき、誠にありがとうございます。</p>
            <div style="background:#fffbf0;border:1px solid #c8a96e;border-radius:6px;padding:14px 16px;margin:18px 0;text-align:center;">
              <p style="margin:0;font-size:12px;letter-spacing:0.05em;color:#8a6d1a;">現在のステータス</p>
              <p style="margin:4px 0 0;font-size:18px;font-weight:bold;color:#1a2a4a;">仮予約（まだ確定ではありません）</p>
            </div>
            <table style="border-collapse:collapse;width:100%;font-size:14px;margin:20px 0;">
              <tr><th style="text-align:left;padding:8px 12px;background:#f5f2ec;width:120px;">種別</th><td style="padding:8px 12px;border-bottom:1px solid #eee;">${typeLabel}</td></tr>
              <tr><th style="text-align:left;padding:8px 12px;background:#f5f2ec;">希望日時</th><td style="padding:8px 12px;border-bottom:1px solid #eee;">${date} ${time_slot}</td></tr>
              <tr><th style="text-align:left;padding:8px 12px;background:#f5f2ec;">人数</th><td style="padding:8px 12px;">${party_size}名</td></tr>
            </table>
            <ul style="font-size:13px;color:#333;padding-left:20px;margin:0 0 20px;">
              <li style="margin-bottom:6px;">予約が確定次第、改めて「予約確定メール」をお送りします。</li>
              <li>数日経っても連絡がない場合は、下記までお問い合わせください。</li>
            </ul>
            <p style="font-size:13px;color:#555;">
              中禅寺立木観音寺務所<br>
              TEL 0288-55-0013
            </p>
          </div>
          <div style="background:#f5f2ec;padding:16px;text-align:center;font-size:11px;color:#999;">
            〒321-1661 栃木県日光市中宮祠2578
          </div>
        </div>
      `
    ),
    ])

    if (replyResult.status === 'fulfilled') await markAutoReplySent('reservations', id)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('notify/reservation error:', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
