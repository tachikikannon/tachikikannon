import { Resend } from 'resend'
import { NextResponse } from 'next/server'
import { sendLinePush } from '@/lib/line'
import { sendGmail } from '@/lib/gmail'
import { markAutoReplySent } from '@/lib/notifyStatus'

export async function POST(req: Request) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const body = await req.json()
    const {
      id, category, name, email, phone, message, photo_ref,
      company_name, contact_kana, postal_code, address, address_detail, mobile, fax,
      attachment_url, attachment_filename,
      media_categories, media_name, media_content, publish_date, interview_formats,
      preferred_date_1, preferred_time_1, preferred_date_2, preferred_time_2,
      preferred_date_3, preferred_time_3, attendee_count, duration_minutes, request_notes,
      visit_date, group_name, course_number, adult_count, child_count, student_count, school_or_company,
    } = body
    const toEmail = process.env.NOTIFY_EMAIL!
    const adminUrl = `${process.env.SITE_URL ?? ''}/admin/applications`
    const receivedAt = new Date().toLocaleString('ja-JP')

    const extraRows: [string, string][] = [
      company_name && ['会社名・団体名', company_name],
      contact_kana && ['フリガナ', contact_kana],
      postal_code && ['郵便番号', postal_code],
      (address || address_detail) && ['ご住所', [address, address_detail].filter(Boolean).join(' ')],
      mobile && ['携帯電話', mobile],
      fax && ['FAX番号', fax],
      attachment_url && ['添付ファイル', `<a href="${attachment_url}">${attachment_filename || 'ファイルを開く'}</a>`],
      media_categories?.length && ['メディアカテゴリ', media_categories.join('、')],
      media_name && ['メディア名・番組名', media_name],
      media_content && ['掲載・企画内容', media_content],
      publish_date && ['発行・オンエア予定日', publish_date],
      interview_formats?.length && ['取材形式', interview_formats.join('、')],
      preferred_date_1 && ['希望日時（第一）', `${preferred_date_1} ${preferred_time_1 ?? ''}`],
      preferred_date_2 && ['希望日時（第二）', `${preferred_date_2} ${preferred_time_2 ?? ''}`],
      preferred_date_3 && ['希望日時（第三）', `${preferred_date_3} ${preferred_time_3 ?? ''}`],
      attendee_count && ['当日取材人数', `${attendee_count}名様`],
      duration_minutes && ['予定所要時間', `${duration_minutes}分`],
      request_notes && ['ご要望・ご質問', request_notes],
      visit_date && ['参拝日', visit_date],
      school_or_company && ['学校名・会社名・個人', school_or_company],
      group_name && ['団体名', group_name],
      course_number && ['コース番号', course_number],
      adult_count && ['大人人数', `${adult_count}名`],
      child_count && ['子供人数', `${child_count}名`],
      student_count && ['小中学生人数', `${student_count}名`],
    ].filter(Boolean) as [string, string][]
    const extraRowsHtml = extraRows.map(([label, value]) =>
      `<tr><th style="text-align:left;padding:8px 12px;background:#f5f2ec;">${label}</th><td style="padding:8px 12px;border-bottom:1px solid #eee;white-space:pre-wrap;">${value}</td></tr>`
    ).join('')

    // LINEグループ通知・お寺への通知メール・送信者への自動返信は並行して実行し、
    // どれかが失敗しても申請登録そのものは成功として扱う（失敗はログのみ）。
    const [, , replyResult] = await Promise.allSettled([
      sendLinePush(
        `【新規申請】\n申請区分: ${category}\n氏名: ${name}\n受信日時: ${receivedAt}${attachment_url ? '\n添付ファイルあり' : ''}\n管理画面: ${adminUrl}`
      ),

      // お寺への通知
      resend.emails.send({
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
            ${extraRowsHtml}
            <tr><th style="text-align:left;padding:8px 12px;background:#f5f2ec;">内容</th><td style="padding:8px 12px;white-space:pre-wrap;">${message}</td></tr>
          </table>
          <p style="margin-top:20px;font-size:12px;color:#888;">管理画面で確認: ${adminUrl}</p>
        `,
      }),

      // 送信者への自動返信（Resendはドメイン未認証のため、Gmail経由で直接送信）
      sendGmail(
        email,
        '【立木観音】申請を受け付けました',
        `
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
        `
      ),
    ])

    if (replyResult.status === 'fulfilled') await markAutoReplySent('applications', id)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('notify/application error:', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
