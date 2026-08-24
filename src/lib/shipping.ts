// 通信販売（代金引換）の送料自動計算のための設定。
// 商品ごとの重量(g)・送料無料フラグと、重量帯ごとの送料テーブルをsite_contentに保存する。
// どちらも「商品１つ１つの重量」「送料テーブル」を寺務所側で直接設定する運用のため、
// BASE側からの重量取得（BASE公式API・ストアページとも重量を保持していないため不可能）
// ではなく、この管理画面での手入力を正とする。

export const GOODS_WEIGHTS_KEY = 'goods_weights_chuzenji'
export const SHIPPING_TABLE_KEY = 'shipping_rate_table_chuzenji'

// 御札（護摩札）は正月護摩・通常の御祈願郵送のどちらも同じ4種類・同じ金額
// （5,000円=小/10,000円=中/20,000円=大/30,000円=特大）で、実体はBASE商品の
// 「御札 小/中/大/特大」と同一。重量は新規に管理項目を作らず、この4商品に対して
// 「商品重量設定」（/admin/mail-order/weights）で登録済みの重量をそのまま流用する。
// 御祈願料（price）は商品価格と完全に一致し、変わることがまず無いためこれをキーにする。
// BASE側でこの4商品が削除・作り直しされてIDが変わった場合はここも更新が必要。
export const OFUDA_GOODS_ID_BY_PRICE: Record<string, string> = {
  '5,000円': '46991730',  // 御札 小（28cm）
  '10,000円': '81452564', // 御札 中（32cm）
  '20,000円': '46991593', // 御札 大（38cm）
  '30,000円': '46940868', // 御札 特大（42.5cm）
}

export type GoodsShippingInfo = { weight_g: number; free_shipping: boolean }
export type GoodsWeights = Record<string, GoodsShippingInfo>

// 1件が「重量がmax_weight_g(g)以下ならprice円」を表す。テーブルは昇順に並べ、
// 最後の1件だけmax_weight_gをnullにすると「それ以上は全てこの価格」という
// 上限なしの区分にできる。
export type ShippingTier = { max_weight_g: number | null; price: number }

export function parseGoodsWeights(raw: string | null | undefined): GoodsWeights {
  if (!raw) return {}
  try {
    const obj = JSON.parse(raw)
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return {}
    const out: GoodsWeights = {}
    for (const [id, v] of Object.entries(obj as Record<string, unknown>)) {
      // 送料無料フラグを追加する前の旧形式（id→重量の数値）が残っている場合の移行
      if (typeof v === 'number') { out[id] = { weight_g: v, free_shipping: false }; continue }
      if (v && typeof v === 'object' && typeof (v as GoodsShippingInfo).weight_g === 'number') {
        out[id] = { weight_g: (v as GoodsShippingInfo).weight_g, free_shipping: !!(v as GoodsShippingInfo).free_shipping }
      }
    }
    return out
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
export function calcShippingFeeByWeight(totalWeightG: number, tiers: ShippingTier[]): number | null {
  const sorted = sortShippingTable(tiers)
  for (const tier of sorted) {
    if (tier.max_weight_g == null || totalWeightG <= tier.max_weight_g) return tier.price
  }
  return null
}

// 注文内容（商品ID・数量）から送料を計算する。送料無料の商品は重量の合計から除外し、
// 有料の商品が1つも無ければ（＝送料無料の商品だけの注文なら）送料は無条件で0円にする。
export function calcOrderShippingFee(
  cart: { goodsId: string; quantity: number }[],
  weights: GoodsWeights,
  tiers: ShippingTier[],
): number | null {
  let chargeableWeightG = 0
  let hasChargeableItem = false
  for (const line of cart) {
    const info = weights[line.goodsId]
    if (!info || info.free_shipping) continue
    hasChargeableItem = true
    chargeableWeightG += info.weight_g * line.quantity
  }
  if (!hasChargeableItem) return 0
  return calcShippingFeeByWeight(chargeableWeightG, tiers)
}
