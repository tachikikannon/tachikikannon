'use client'
import SectionEditor from '@/components/admin/SectionEditor'

const J = (v: unknown) => JSON.stringify(v)

const FIELDS = [
  {
    key: 'grounds_spots', label: '主な見どころ', type: 'list' as const,
    listFields: [{ key: 'num', label: '番号（①②…）' }, { key: 'name', label: '名称' }, { key: 'desc', label: '説明', multiline: true }],
    defaultValue: J([
      { num: '①', name: '山門', desc: '境内への入口。拝観受付はこちらで行います。' },
      { num: '②', name: '御朱印受付', desc: '御朱印・お守り・各種授与品はこちらでお受けいただけます。' },
      { num: '③', name: '本堂（立木観音）', desc: '勝道上人が桂の立木に直接刻んだと伝わる千手観世音菩薩をお祀りする本堂。根を張ったままの立木が今も残ります。' },
      { num: '④', name: '五大堂', desc: '中禅寺湖を一望できる展望堂。天井に描かれた龍の墨絵でも有名です。' },
      { num: '⑤', name: '大黒天堂', desc: '商売繁盛・縁結びのご利益で知られる大黒天をお祀りしています。' },
      { num: '⑥', name: '弁天堂', desc: '中禅寺湖を背景に佇む弁天堂。芸術・財運のご利益があるとされます。' },
    ]),
  },
  { key: 'grounds_godaido_text', label: '五大堂からの眺望テキスト', multiline: true, defaultValue: '五大堂の大窓からは、中禅寺湖と男体山を一望することができます。四季折々の景色は訪れる人々を魅了し、特に紅葉の季節には多くの参拝者が訪れます。また、天井に描かれた龍の大墨絵も必見です。' },
  {
    key: 'grounds_flow', label: '参拝の流れ', type: 'list' as const,
    listFields: [{ key: 'title', label: 'ステップ名' }, { key: 'text', label: '説明', multiline: true }],
    defaultValue: J([
      { title: '拝観受付（山門）', text: '入口にて拝観料をお納めください。受付は閉門30分前に終了いたします。' },
      { title: '御朱印受付', text: '山門をくぐってすぐの御朱印所にて、御朱印やお守りをお受けいただけます。' },
      { title: '本堂参拝', text: 'ご本尊・立木観音（千手観世音菩薩）にお参りください。' },
      { title: '五大堂', text: '中禅寺湖を一望できる五大堂へ。天井の龍の墨絵も必見です。' },
    ]),
  },
] as const

export default function AdminChuzenjGrounds() {
  return <SectionEditor title="境内のご案内" href="/grounds" fields={FIELDS as never} />
}
