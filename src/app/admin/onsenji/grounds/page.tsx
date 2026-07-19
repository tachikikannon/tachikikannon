'use client'
import SectionEditor from '@/components/admin/SectionEditor'

const J = (v: unknown) => JSON.stringify(v)

const FIELDS = [
  { key: 'onsenji_grounds_subtitle', label: '見出し（ヒーロー サブタイトル）', defaultValue: '見どころ・薬師の湯・境内マップ' },
  { key: 'onsenji_grounds_heading_spots', label: '「主な見どころ」見出し', defaultValue: '主な見どころ' },
  {
    key: 'onsenji_grounds_spots', label: '主な見どころ', type: 'list' as const,
    listFields: [{ key: 'num', label: '番号（①②…）' }, { key: 'name', label: '名称' }, { key: 'desc', label: '説明', multiline: true }],
    defaultValue: J([
      { num: '①', name: '山門', desc: '境内への入口。拝観受付はこちらで行います。' },
      { num: '②', name: '本堂（薬師堂）', desc: 'ご本尊・薬師如来をお祀りする本堂。病気平癒・健康長寿の御加護をお授けいただけます。' },
      { num: '③', name: '薬師の湯', desc: '中禅寺湖から湧き出る温泉。参拝後にご利用いただける足湯・手湯があります。' },
      { num: '④', name: '御朱印所', desc: '御朱印・お守りをお受けいただけます。' },
      { num: '⑤', name: '鐘楼', desc: '境内に響き渡る鐘の音。早朝には特に厳かな雰囲気を味わえます。' },
      { num: '⑥', name: '湖畔展望台', desc: '中禅寺湖と男体山を一望できる展望スポット。四季折々の絶景が広がります。' },
    ]),
  },
  { key: 'onsenji_grounds_heading_onsen', label: '「薬師の湯」見出し', defaultValue: '薬師の湯（温泉）' },
  { key: 'onsenji_grounds_onsen_text', label: '薬師の湯 説明文', multiline: true, defaultValue: '境内には令和8年4月11日に開湯した「薬師の湯」があります。泉質は含硫黄‐カルシウム・ナトリウム‐硫酸塩・炭酸水素塩泉（泉温71.4℃）の完全かけ流し。加水すると乳白色に変わる神秘的な湯は、参拝者に開放されています。薬師如来の御加護とともに心身を清めていただけます。' },
  { key: 'onsenji_grounds_heading_flow', label: '「参拝の流れ」見出し', defaultValue: '参拝の流れ' },
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
