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
      { name: '鐘楼', image: '/images/toiawase.jpg', desc: '境内に響く梵鐘。時を告げる鐘の音が静かな山の霊気とともに境内に広がります。' },
      { name: '延命水', image: '/images/enmeisui.png', desc: '境内に湧き出る清水。飲むと長寿・延命のご利益があると伝わり、古くから参拝者に親しまれています。' },
      { name: '石護摩壇', image: '/images/goma.png', desc: 'お護摩はインド伝来の密教の秘法（秘密の教え）で、僧侶が護摩壇に向かい、作法にしたがって仏の智慧の火を焚き、様々な供物を焚き上げ、厄難・災難を払いその加護（成就）を願います。' },
      { name: '客殿・写経体験', image: '/images/syakyou.JPG', desc: '写経とは、お経の文字を一文字一文字丁寧に書き写す修行です。文字を書くことで雑念を払い、心を清め、仏様との縁を結ぶとされています。客殿にて写経体験をお受けいただけます。' },
      { name: '御朱印所', image: '/images/hudasyo.png', desc: '御朱印・お守り・各種授与品はこちらでお受けいただけます。' },
      { name: '愛染堂', image: '/images/aizendou.png', desc: '中禅寺湖を背景に佇む愛染堂。良縁成就・縁結び・夫婦和合、愛敬開運のご利益で知られています。' },
      { name: '歌碑', image: '', desc: '境内に建つ歌碑です。' },
      { name: 'お水屋', image: '/images/omizuya.png', desc: '参拝前に手や口を清める手水舎です。' },
      { name: '大黒天堂', image: '', desc: '家内安全、商売繁盛、交通安全、開運、厄除け、安産等のご利益で知られる秘仏、波之利大黒天をお祀りしている、護摩祈願道場です。' },
      { name: '立木観音堂（本堂）', image: '/images/main2.png', desc: '勝道上人が中禅寺湖上に千手観音様をご覧になり、その姿を桂の立木に彫ったと伝えられています。観音様は、現在も地に根をはり、訪れる人々を穏やかな表情で迎えます。また、坂東三十三観音霊場の第十八番札所として多くの巡礼の方たちもご参拝になります。' },
      { name: '五大堂', image: '/images/godaido.jpg', desc: '不動明王、降三世明王、軍荼利明王、大威徳明王、金剛夜叉明王の五大明王が安置された御祈祷の道場です。天井には、堅山南風画伯が描いた大雲龍が堂々たる威容を誇ります。また、ここ五大堂からの中禅寺湖を望む景色は、見るものの心を振るわせるほどの絶景です。' },
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
