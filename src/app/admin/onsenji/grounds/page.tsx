'use client'
import SectionEditor from '@/components/admin/SectionEditor'

const J = (v: unknown) => JSON.stringify(v)

const FIELDS = [
  { key: 'onsenji_grounds_subtitle', label: '見出し（ヒーロー サブタイトル）', defaultValue: '見どころ・薬師の湯・境内マップ', translatable: true },
  { key: 'onsenji_grounds_heading_map', label: '「境内マップ・主な見どころ」見出し', defaultValue: '境内マップ・主な見どころ', translatable: true },
  { key: 'onsenji_grounds_map_hint', label: '地図の操作案内文', defaultValue: '地図上のピンをクリックすると各スポットの詳細が見られます', translatable: true },
  {
    key: 'onsenji_grounds_spots', label: '主な見どころ', type: 'list' as const,
    listFields: [
      { key: 'name', label: '名称' },
      { key: 'image', label: '画像パス（例: /images/onsenji-sandou.png）' },
      { key: 'desc', label: '説明', multiline: true },
    ],
    defaultValue: J([
      { name: '温泉寺表参道', image: '/images/onsenji-sandou.png', desc: '石灯籠が並ぶ緑豊かな参道。入浴者用駐車場から境内へと続きます。' },
      { name: '鐘楼', image: '/images/onsenji-syourou.png', desc: '境内に響き渡る鐘の音。早朝には特に厳かな雰囲気を味わえます。' },
      { name: '薬師の湯と本殿の外観', image: '/images/onsenji-gaikan.png', desc: '受付を兼ねた建物と、薬師の湯・本殿の外観。四季折々の景色とともに参拝者を迎えます。' },
      { name: '客殿・休憩室', image: '/images/onsenji-kyukeishitsu.png', desc: '畳敷きの落ち着いた空間で、参拝の合間にひと休みいただけます。' },
      { name: '薬師の湯', image: '/images/onsenji-yakushinoyu-yu.png', desc: '中禅寺湖から湧き出る温泉。参拝後にご利用いただけます。' },
      { name: '本殿（写経・写仏体験会場）', image: '/images/onsenji-kaijou.jpg', desc: 'ご本尊・薬師如来をお祀りする本殿。写経・写仏体験もこちらで行います。' },
    ]),
  },
  { key: 'onsenji_grounds_heading_onsen', label: '「薬師の湯」見出し', defaultValue: '薬師の湯（温泉）', translatable: true },
  { key: 'onsenji_grounds_onsen_text', label: '薬師の湯 説明文', multiline: true, defaultValue: '境内には令和8年4月11日に開湯した「薬師の湯」があります。泉質は含硫黄‐カルシウム・ナトリウム‐硫酸塩・炭酸水素塩泉（泉温71.4℃）の完全かけ流し。加水すると乳白色に変わる神秘的な湯は、参拝者に開放されています。薬師如来の御加護とともに心身を清めていただけます。', translatable: true },
  { key: 'onsenji_grounds_heading_flow', label: '「参拝の流れ」見出し', defaultValue: '参拝の流れ', translatable: true },
  {
    key: 'onsenji_grounds_flow', label: '参拝の流れ', type: 'list' as const,
    listFields: [{ key: 'title', label: 'ステップ名' }, { key: 'text', label: '説明', multiline: true }],
    defaultValue: J([
      { title: '拝観受付（山門）', text: '入口にて拝観料をお納めください。受付は閉門30分前に終了いたします。' },
      { title: '本堂参拝', text: 'ご本尊・薬師如来（医王如来）にお参りください。' },
      { title: '薬師の湯', text: '参拝後は境内の温泉（薬師の湯）をご利用いただけます。足湯・手湯があります。' },
      { title: '御朱印所', text: '御朱印やお守りをお受けいただけます。' },
    ]),
  },
] as const

export default function AdminOnsenjGrounds() {
  return <SectionEditor title="温泉寺 境内のご案内" href="/onsenji/grounds" fields={FIELDS as never} accent="onsenji" />
}
