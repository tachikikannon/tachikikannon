'use client'
import SectionEditor from '@/components/admin/SectionEditor'

const J = (v: unknown) => JSON.stringify(v)

const FIELDS = [
  {
    key: 'grounds_spots', label: '主な見どころ', type: 'list' as const,
    listFields: [
      { key: 'name', label: '名称' },
      { key: 'image', label: '画像パス（例: /images/sanmon.png）' },
      { key: 'desc', label: '説明', multiline: true },
    ],
    defaultValue: J([
      { name: '山門', image: '/images/sanmon.png', desc: '境内への入口。拝観受付はこちらで行います。' },
      { name: '観音堂（本堂）', image: '/images/main2.png', desc: '勝道上人が桂の立木に直接刻んだと伝わる千手観世音菩薩をお祀りする本堂。根を張ったままの立木が今も残ります。' },
      { name: '鐘楼', image: '/images/toiawase.jpg', desc: '境内に響く梵鐘。時を告げる鐘の音が静かな山の霊気とともに境内に広がります。' },
      { name: '札所', image: '/images/hudasyo.png', desc: '御朱印・お守り・各種授与品はこちらでお受けいただけます。坂東三十三観音霊場の第十八番札所です。' },
      { name: '天道', image: '/images/tendou.png', desc: '天へと続く石段と境内の小道。四季の草木に囲まれた参道の趣を感じながらお進みください。' },
      { name: '愛染堂', image: '/images/aizendou.png', desc: '愛染明王をお祀りする堂。縁結び・恋愛成就・家庭円満のご利益で知られます。' },
      { name: '延命水', image: '/images/enmeisui.png', desc: '境内に湧き出る清水。飲むと長寿・延命のご利益があると伝わり、古くから参拝者に親しまれています。' },
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
