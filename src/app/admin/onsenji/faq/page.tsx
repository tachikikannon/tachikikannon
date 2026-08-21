'use client'
import SectionEditor from '@/components/admin/SectionEditor'

const J = (v: unknown) => JSON.stringify(v)

const FIELDS = [
  { key: 'onsenji_faq_subtitle', label: '見出し（英字サブタイトル）', defaultValue: 'FAQ' },
  {
    key: 'onsenji_faq_items', label: 'FAQ一覧', type: 'list' as const,
    listFields: [{ key: 'q', label: '質問', multiline: true }, { key: 'a', label: '回答', multiline: true }],
    defaultValue: J([
      { q: '温泉（薬師の湯）は誰でも利用できますか？', a: 'はい、入湯料（大人500円・小中学生300円）をお納めいただいた方はどなたでもご利用いただけます。源泉かけ流しの温泉です。タオルをご持参ください。お持ちでない方は、１枚５００円で販売もしております。' },
      { q: '薬師の湯の泉質を教えてください。', a: '泉質は含硫黄‐カルシウム・ナトリウム‐硫酸塩・炭酸水素塩泉で、泉温は71.4℃です。完全かけ流しで、加水すると乳白色に変わる美しい湯です。' },
      { q: '御祈願は予約が必要ですか？', a: 'ご祈願は行っておりませんが、毎年8月8日に薬師講大祭・採灯大護摩供が行われます。' },
      { q: '写経体験はできますか？', a: 'はい、毎日実施しています。体験料1,000円で特別御朱印もお授けします。所要時間は約15分です。予約不要で、玄関にて係にお申し付けください。' },
      { q: '車でのアクセスはできますか？', a: 'はい、お車でお越しいただけます。境内に無料駐車場がございます。' },
      { q: '温泉寺は輪王寺と関係がありますか？', a: 'はい、日光山温泉寺は世界遺産「日光山輪王寺」の別院です。延暦7年（788年）に勝道上人によって開創され、江戸時代には輪王寺宮の直轄寺院として栄えました。' },
    ]),
    translatable: true,
    defaultValueEn: J([
      { q: 'Can anyone use the hot spring (Yakushi-no-Yu)?', a: "Yes, anyone who pays the bathing fee (adults ¥500, elementary/junior high school students ¥300) may use it. It is a fully sourced, uninterrupted-flow hot spring. Please bring your own towel — if you don't have one, towels are also available for purchase for ¥500 each." },
      { q: 'What is the water quality of Yakushi-no-Yu?', a: 'The spring is sulfur–calcium–sodium–sulfate–bicarbonate with a water temperature of 71.4°C. It is fully sourced and turns a beautiful milky white when mixed with water.' },
      { q: 'Do I need a reservation for a prayer service?', a: 'We do not currently offer prayer services, but the Yakushiko Grand Festival and Saito Goma Fire Ritual are held every year on August 8.' },
      { q: 'Can I try the sutra copying experience?', a: 'Yes, it is offered daily. The fee is ¥1,000 and includes a special goshuin stamp. It takes about 15 minutes. No reservation is needed — please ask staff at the entrance.' },
      { q: 'Can I access by car?', a: 'Yes, you can come by car. Free parking is available on the grounds.' },
      { q: 'Is Onsenji connected to Rinnoji?', a: 'Yes, Nikkozan Onsenji is a branch temple of the World Heritage site Nikkozan Rinnoji. It was founded in Enryaku 7 (788 CE) by the priest Shodo, and flourished in the Edo period as a temple directly administered by Rinnoji.' },
    ]),
  },
  { key: 'onsenji_faq_bottom_heading', label: '末尾の見出し', defaultValue: 'その他のご質問', translatable: true },
  { key: 'onsenji_faq_bottom_text', label: '末尾の案内文', defaultValue: '解決しない場合はお気軽にお問い合わせください。', translatable: true },
  { key: 'onsenji_faq_cta_label', label: 'お問い合わせボタンの文言', defaultValue: 'お問い合わせ', translatable: true },
] as const

export default function AdminOnsenjFaq() {
  return <SectionEditor title="温泉寺 よくある質問" href="/onsenji/faq" fields={FIELDS as never} accent="onsenji" />
}
