// 通信販売（代金引換）の送料自動計算のための設定。
// 商品ごとの重量(g)と、重量帯ごとの送料テーブルをsite_contentに保存する。
// どちらも「商品１つ１つの重量」「送料テーブル」を寺務所側で直接設定する運用のため、
// BASE側からの重量取得（BASE公式API・ストアページとも重量を保持していないため不可能）
// ではなく、この管理画面での手入力を正とする。

export const GOODS_WEIGHTS_KEY = 'goods_weights_chuzenji'
export const SHIPPING_TABLE_KEY = 'shipping_rate_table_chuzenji'

export type GoodsWeights = Record<string, number>

// 1件が「重量がmax_weight_g(g)以下ならprice円」を表す。テーブルは昇順に並べ、
// 最後の1件だけmax_weight_gをnullにすると「それ以上は全てこの価格」という
// 上限なしの区分にできる。
export type ShippingTier = { max_weight_g: number | null; price: number }

export function parseGoodsWeights(raw: string | null | undefined): GoodsWeights {
  if (!raw) return {}
  try {
    const obj = JSON.parse(raw)
    if (obj && typeof obj === 'object' && !Array.isArray(obj)) return obj
  } catch {}
  return {}
}

export function parseShippingTable(raw: string | null | undefined): ShippingTier[] {
  if (!raw) return []
  try {
    const arr = JSON.parse(raw)
    if (Array.isArray(arr)) {
      return arr
        .filter((t): t is ShippingTier => t && typeof t.price === 'number')
        .map(t => ({ max_weight_g: typeof t.max_weight_g === 'number' ? t.max_weight_g : null, price: t.price }))
    }
  } catch {}
  return []
}

// 昇順ソート（上限なし=nullは常に最後）
export function sortShippingTable(tiers: ShippingTier[]): ShippingTier[] {
  return [...tiers].sort((a, b) => {
    if (a.max_weight_g == null) return 1
    if (b.max_weight_g == null) return -1
    return a.max_weight_g - b.max_weight_g
  })
}

// 合計重量(g)に対応する送料を、テーブルから引く。該当区分が無ければnullを返す
// （テーブル未設定 or 総重量がどの上限も超える場合。呼び出し側で「送料は別途ご案内」等の
// フォールバック表示にする）。
export function calcShippingFee(totalWeightG: number, tiers: ShippingTier[]): number | null {
  const sorted = sortShippingTable(tiers)
  for (const tier of sorted) {
    if (tier.max_weight_g == null || totalWeightG <= tier.max_weight_g) return tier.price
  }
  return null
}
