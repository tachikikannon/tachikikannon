'use client'
import SectionEditor from '@/components/admin/SectionEditor'

const J = (v: unknown) => JSON.stringify(v)

const FIELDS = [
  { key: 'onsenji_faq_subtitle', label: '見出し（英字サブタイトル）', defaultValue: 'FAQ' },
  { key: 'onsenji_faq_heading', label: 'ページ見出し', defaultValue: 'よくある質問' },
  {
    key: 'onsenji_faq_items', label: 'FAQ一覧', type: 'list' as const,
    listFields: [{ key: 'q', label: '質問', multiline: true }, { key: 'a', label: '回答', multiline: true }],
    defaultValue: J([
      { q: '温泉（薬師の湯）は誰でも利用できますか？', a: 'はい、志納金（大人500円・小人300円）をお納めいただいた方はどなたでもご利用いただけます。令和8年4月11日より開湯した源泉かけ流しの温泉です。タオルをご持参ください。' },
      { q: '薬師の湯の泉質を教えてください。', a: '泉質は含硫黄‐カルシウム・ナトリウム‐硫酸塩・炭酸水素塩泉で、泉温は71.4℃です。完全かけ流しで、加水すると乳白色に変わる美しい湯です。' },
      { q: '御祈願は予約が必要ですか？', a: 'はい、御祈願は予約制となっております。事前にお電話またはお問い合わせフォームよりご連絡ください。' },
      { q: '写経体験はできますか？', a: 'はい、毎日実施しています。体験料1,000円で特別御朱印もお授けします。所要時間は約15分です。予約不要で、受付時にお申し付けください。' },
      { q: '車でのアクセスはできますか？', a: 'はい、お車でお越しいただけます。日光宇都宮道路 日光ICより約10分です。境内周辺に有料駐車場がございます。' },
      { q: '温泉寺は輪王寺と関係がありますか？', a: 'はい、日光山温泉寺は世界遺産「日光山輪王寺」の別院です。延暦7年（788年）に勝道上人によって開創され、江戸時代には輪王寺宮の直轄寺院として栄えました。' },
    ]),
  },
  { key: 'onsenji_faq_bottom_heading', label: '末尾の見出し', defaultValue: 'その他のご質問' },
  { key: 'onsenji_faq_bottom_text', label: '末尾の案内文', defaultValue: '解決しない場合はお気軽にお問い合わせください。' },
  { key: 'onsenji_faq_cta_label', label: 'お問い合わせボタンの文言', defaultValue: 'お問い合わせ' },
] as const

export default function AdminOnsenjFaq() {
  return <SectionEditor title="温泉寺 よくある質問" href="/onsenji/faq" fields={FIELDS as never} accent="onsenji" />
}
