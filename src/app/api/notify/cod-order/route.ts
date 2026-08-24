import { Resend } from 'resend'
import { NextResponse } from 'next/server'
import { sendLinePush } from '@/lib/line'
import { sendGmail } from '@/lib/gmail'
import { markAutoReplySent } from '@/lib/notifyStatus'
import type { CodOrderItem } from '@/types'

function itemsRows(items: CodOrderItem[]) {
  return items.map(it =>
    `<tr><td style="padding:6px 12px;border-bottom:1px solid #eee;">${it.name}</td><td style="padding:6px 12px;border-bottom:1px solid #eee;text-align:right;">${it.quantity}点</td><td style="padding:6px 12px;border-bottom:1px solid #eee;text-align:right;">${it.price ? `¥${(it.price * it.quantity).toLocaleString()}` : '—'}</td></tr>`
  ).join('')
}
function itemsText(items: CodOrderItem[]) {
  return items.map(it => `・${it.name} × ${it.quantity}${it.price ? `（¥${(it.price * it.quantity).toLocaleString()}）` : ''}`).join('\n')
}

export async function POST(req: Request) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const body = await req.json()
    const { id, name, name_kana, email, phone, postal_code, address, items, total_amount, shipping_fee, notes } = body
    const subtotal = (total_amount ?? 0) - (shipping_fee ?? 0)

    const toEmail = process.env.NOTIFY_EMAIL!
    const adminUrl = `${process.env.SITE_URL ?? ''}/admin/cod-orders`

    const [, , replyResult] = await Promise.allSettled([
      sendLinePush(
        `【代金引換 新規申込】\n申込番号: ${id ?? '(不明)'}\n氏名: ${name}\n${itemsText(items)}\n商品代金: ¥${subtotal.toLocaleString()}\n送料: ¥${(shipping_fee ?? 0).toLocaleString()}\n合計: ¥${(total_amount ?? 0).toLocaleString()}\n管理画面: ${adminUrl}`
      ),

      resend.emails.send({
        from: 'noreply@resend.dev',
        to: toEmail,
        subject: `【代金引換申込】${name} 様`,
        html: `
          <h2 style="color:#1a2a4a;">代金引換の新しい申込が届きました</h2>
          <table style="border-collapse:collapse;width:100%;font-size:14px;margin-bottom:16px;">
            <tr><th style="text-align:left;padding:6px 12px;background:#f5f2ec;">商品</th><th style="text-align:right;padding:6px 12px;background:#f5f2ec;">数量</th><th style="text-align:right;padding:6px 12px;background:#f5f2ec;">小計</th></tr>
            ${itemsRows(items)}
          </table>
          <table style="border-collapse:collapse;width:100%;font-size:14px;">
            <tr><th style="text-align:left;padding:8px 12px;background:#f5f2ec;width:120px;">商品代金小計</th><td style="padding:8px 12px;border-bottom:1px solid #eee;">¥${subtotal.toLocaleString()}</td></tr>
            <tr><th style="text-align:left;padding:8px 12px;background:#f5f2ec;">送料</th><td style="padding:8px 12px;border-bottom:1px solid #eee;">¥${(shipping_fee ?? 0).toLocaleString()}</td></tr>
            <tr><th style="text-align:left;padding:8px 12px;background:#f5f2ec;">合計</th><td style="padding:8px 12px;border-bottom:1px solid #eee;font-weight:bold;">¥${(total_amount ?? 0).toLocaleString()}</td></tr>
            <tr><th style="text-align:left;padding:8px 12px;background:#f5f2ec;">お名前</th><td style="padding:8px 12px;border-bottom:1px solid #eee;">${name}（${name_kana}）</td></tr>
            <tr><th style="text-align:left;padding:8px 12px;background:#f5f2ec;">メール</th><td style="padding:8px 12px;border-bottom:1px solid #eee;">${email}</td></tr>
            <tr><th style="text-align:left;padding:8px 12px;background:#f5f2ec;">電話番号</th><td style="padding:8px 12px;border-bottom:1px solid #eee;">${phone}</td></tr>
            <tr><th style="text-align:left;padding:8px 12px;background:#f5f2ec;">お届け先</th><td style="padding:8px 12px;border-bottom:1px solid #eee;">〒${postal_code} ${address}</td></tr>
            <tr><th style="text-align:left;padding:8px 12px;background:#f5f2ec;">備考</th><td style="padding:8px 12px;">${notes || 'なし'}</td></tr>
          </table>
          <p style="margin-top:20px;font-size:12px;color:#888;">管理画面で確認: /admin/cod-orders</p>
        `,
      }),

      sendGmail(
        email,
        '【立木観音】代金引換のお申し込みを受け付けました',
        `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;">
            <div style="background:#1a2a4a;padding:24px;text-align:center;">
              <h1 style="color:#c8a96e;margin:0;font-size:20px;">日光山中禅寺 立木観音</h1>
            </div>
            <div style="padding:32px 24px;">
              <p>${name} 様</p>
              <p>代金引換でのお申し込みを受け付けました。内容を確認のうえ発送いたします。</p>
              <table style="border-collapse:collapse;width:100%;font-size:13px;margin:16px 0;">
                <tr><th style="text-align:left;padding:6px 12px;background:#f5f2ec;">商品</th><th style="text-align:right;padding:6px 12px;background:#f5f2ec;">数量</th><th style="text-align:right;padding:6px 12px;background:#f5f2ec;">小計</th></tr>
                ${itemsRows(items)}
              </table>
              <p style="font-size:13px;">商品代金小計：¥${subtotal.toLocaleString()}<br>送料：¥${(shipping_fee ?? 0).toLocaleString()}<br>合計：¥${(total_amount ?? 0).toLocaleString()}<br>商品お届け時に配達員へお支払いください。</p>
              <p style="font-size:13px;color:#555;margin-top:20px;">
                お問い合わせ　TEL：0288-55-0013（受付時間：拝観時間内）
              </p>
            </div>
            <div style="background:#f5f2ec;padding:16px;text-align:center;font-size:11px;color:#999;">
              〒321-1661 栃木県日光市中宮祠2578
            </div>
          </div>
        `
      ),
    ])

    if (replyResult.status === 'fulfilled') await markAutoReplySent('cod_orders', id)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('notify/cod-order error:', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
