import { NextResponse } from 'next/server'
import { sendGmail } from '@/lib/gmail'

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
    const body = await req.json()
    const { name, email, type, date, time_slot, party_size, locale } = body
    const isEnglish = locale === 'en'

    const typeLabel = TYPE_LABELS[type] ?? type
    const typeLabelEn = TYPE_LABELS_EN[type] ?? type

    await sendGmail(
      email,
      isEnglish
        ? `Your Reservation is Confirmed — ${typeLabelEn}`
        : `【立木観音】ご予約が確定しました — ${typeLabel}`,
      isEnglish
        ? `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;">
          <div style="background:#1a2a4a;padding:24px;text-align:center;">
            <h1 style="color:#c8a96e;margin:0;font-size:20px;">Chuzenji Tachikikannon, Nikkosan</h1>
          </div>
          <div style="padding:32px 24px;">
            <p>Dear ${name},</p>
            <p>We are pleased to confirm your reservation below. We look forward to your visit.</p>
            <table style="border-collapse:collapse;width:100%;font-size:14px;margin:20px 0;">
              <tr><th style="text-align:left;padding:8px 12px;background:#f5f2ec;width:140px;">Type</th><td style="padding:8px 12px;border-bottom:1px solid #eee;">${typeLabelEn}</td></tr>
              <tr><th style="text-align:left;padding:8px 12px;background:#f5f2ec;">Confirmed Date &amp; Time</th><td style="padding:8px 12px;border-bottom:1px solid #eee;">${date} ${time_slot}</td></tr>
              <tr><th style="text-align:left;padding:8px 12px;background:#f5f2ec;">Party Size</th><td style="padding:8px 12px;">${party_size}</td></tr>
            </table>
            <p style="background:#fffbf0;border-left:4px solid #c8a96e;padding:12px 16px;font-size:13px;">
              If your plans change, please contact us by phone as soon as possible.
            </p>
            <p style="font-size:13px;color:#555;">
              Contact:<br>
              Chuzenji Tachikikannon, Nikkosan<br>
              TEL: +81-288-55-0013 (during visiting hours)
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
            <p>下記のご予約が確定いたしましたのでお知らせいたします。<br>当日のお越しをお待ちしております。</p>
            <table style="border-collapse:collapse;width:100%;font-size:14px;margin:20px 0;">
              <tr><th style="text-align:left;padding:8px 12px;background:#f5f2ec;width:120px;">種別</th><td style="padding:8px 12px;border-bottom:1px solid #eee;">${typeLabel}</td></tr>
              <tr><th style="text-align:left;padding:8px 12px;background:#f5f2ec;">確定日時</th><td style="padding:8px 12px;border-bottom:1px solid #eee;">${date} ${time_slot}</td></tr>
              <tr><th style="text-align:left;padding:8px 12px;background:#f5f2ec;">人数</th><td style="padding:8px 12px;">${party_size}名</td></tr>
            </table>
            <p style="background:#fffbf0;border-left:4px solid #c8a96e;padding:12px 16px;font-size:13px;">
              ご予定に変更がある場合は、お早めにお電話にてご連絡ください。
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
      `
    )

    console.log('[notify/reservation-confirmed] sent to', email)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[notify/reservation-confirmed] error:', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
