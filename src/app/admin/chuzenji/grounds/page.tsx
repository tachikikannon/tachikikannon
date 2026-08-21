'use client'
import SectionEditor from '@/components/admin/SectionEditor'

const J = (v: unknown) => JSON.stringify(v)

const FIELDS = [
  { key: 'grounds_subtitle', label: '見出し（ヒーロー サブタイトル）', defaultValue: '見どころ・境内マップ', translatable: true },
  { key: 'grounds_heading_map', label: '「境内マップ・主な見どころ」見出し', defaultValue: '境内マップ・主な見どころ', translatable: true },
  { key: 'grounds_map_hint', label: '地図の操作案内文', defaultValue: '地図上のピンをクリックすると各スポットの詳細が見られます', translatable: true },
  {
    key: 'grounds_spots', label: '主な見どころ', type: 'list' as const,
    listFields: [
      { key: 'name', label: '名称' },
      { key: 'image', label: '画像パス（例: /images/chuzenji/grounds/sanmon.png）' },
      { key: 'desc', label: '説明', multiline: true },
    ],
    defaultValue: J([
      { name: '山門', image: '/images/chuzenji/grounds/sanmon.png', desc: '境内への入口。拝観受付はこちらで行います。' },
      { name: '鐘楼', image: '/images/chuzenji/grounds/toiawase.jpg', desc: '行事の始まりを知らせるための梵鐘（つりかね）を吊るす建物。現在は大晦日の「除夜の鐘」のみ撞かれます。' },
      { name: '延命水', image: '/images/chuzenji/grounds/enmeisui.png', desc: '境内に湧き出る清水。お手水などにご使用ください。' },
      { name: '石護摩壇･不動明王坐像', image: '/images/chuzenji/grounds/ishigomadan.png', desc: '正面には、本尊である不動明王坐像がまつられ、石造りの鳥居と四方の石柱で結界とし、中心の苔むした塚の下には山伏が火を焚いて行う「採燈護摩」という修行で使われた丸い「石造の護摩炉」が据えられています。' },
      { name: '客殿・写経･写仏体験', image: '/images/chuzenji/grounds/kyakuden.png', desc: '写経とは、お経の文字を一文字一文字丁寧に書き写す修行です。文字を書くことで雑念を払い、心を清め、仏様との縁を結ぶとされています。客殿にて写経や写仏体験をお受けいただけます。' },
      { name: '御朱印所', image: '/images/chuzenji/grounds/hudasyo.png', desc: '「本堂」、「大黒天堂」、「五大堂」、「ご詠歌」の御朱印を朱印帳にお書きしますその他、お守りなどもこちらでお受けいただけます。' },
      { name: '愛染堂', image: '/images/chuzenji/grounds/aizendou.png', desc: '中禅寺湖を背景に佇む愛染堂。良縁成就・縁結び・夫婦和合、愛敬開運のご利益で知られています。' },
      { name: '歌碑', image: '/images/chuzenji/grounds/kahi.png', desc: '歌手・俳優の加山雄三氏の楽曲「君といつまでも」の歌碑です。中禅寺湖畔を望むこの地で、多くの方に親しまれています。' },
      { name: 'お水屋', image: '/images/chuzenji/grounds/omizuya.png', desc: '参拝前に手や口を清める手水舎です。' },
      { name: '大黒天堂', image: '/images/chuzenji/grounds/daikokutendou.png', desc: '家内安全、商売繁盛、交通安全、開運、厄除け、安産等のご利益で知られる秘仏、波之利大黒天をお祀りしている、護摩祈願道場です。' },
      { name: '立木観音堂（本堂）', image: '/images/chuzenji/common/main2.png', desc: '勝道上人が中禅寺湖上に千手観音様をご覧になり、その姿を桂の立木に彫ったと伝えられています。観音様は、現在も地に根をはり、訪れる人々を穏やかな表情で迎えます。また、坂東三十三観音霊場の第十八番札所として多くの巡礼の方たちもご参拝になります。' },
      { name: '五大堂', image: '/images/chuzenji/common/godaido.jpg', desc: '不動明王、降三世明王、軍荼利明王、大威徳明王、金剛夜叉明王の五大明王が安置された御祈祷の道場です。天井には、堅山南風画伯が描いた大雲龍が堂々たる威容を誇ります。' },
    ]),
    translatable: true,
    defaultValueEn: J([
      { name: 'Sanmon Gate', image: '/images/chuzenji/grounds/sanmon.png', desc: 'The entrance to the grounds, where visiting reception is held.' },
      { name: 'Bell Tower', image: '/images/chuzenji/grounds/toiawase.jpg', desc: 'The building housing the temple bell (tsurigane), traditionally rung to announce the start of ceremonies. Today it is rung only once a year, for the "joya no kane" New Year\'s Eve bell-ringing.' },
      { name: 'Enmeisui Spring', image: '/images/chuzenji/grounds/enmeisui.png', desc: 'A spring of clear water on the grounds. Please use it for ritual hand-and-mouth purification (temizu).' },
      { name: 'Stone Goma Altar & Seated Fudo Myo-o', image: '/images/chuzenji/grounds/ishigomadan.png', desc: 'Enshrined at the front is the seated image of Fudo Myo-o, the principal image of the altar, set within a sacred boundary marked by a stone torii gate and four corner pillars. Beneath the moss-covered mound at its center sits a round stone goma hearth, once used by mountain ascetics (yamabushi) for the outdoor fire ritual known as "saito goma."' },
      { name: 'Guest Hall — Sutra Copying & Buddha Tracing', image: '/images/chuzenji/grounds/kyakuden.png', desc: 'Sutra copying is a practice of carefully copying the characters of a sutra, one by one, said to clear the mind and form a bond with the Buddha. Both the sutra-copying and Buddha-tracing experiences are offered at the Guest Hall.' },
      { name: 'Goshuin Office', image: '/images/chuzenji/grounds/hudasyo.png', desc: 'Goshuin stamps for the Main Hall, Daikokuten Hall, Godaido Hall, and Goeika are inscribed here in your goshuin book. Omamori charms and other items are also available.' },
      { name: 'Aizen-do', image: '/images/chuzenji/grounds/aizendou.png', desc: 'Standing against the backdrop of Lake Chuzenji, Aizen-do is known for blessings of good relationships, matchmaking, marital harmony, and charm.' },
      { name: 'Song Monument', image: '/images/chuzenji/grounds/kahi.png', desc: 'A monument for the song "Kimi to Itsumademo" by singer and actor Yuzo Kayama, cherished by many at this spot overlooking Lake Chuzenji.' },
      { name: 'Omizuya', image: '/images/chuzenji/grounds/omizuya.png', desc: 'A water pavilion for purifying hands and mouth before worship.' },
      { name: 'Daikokuten Hall', image: '/images/chuzenji/grounds/daikokutendou.png', desc: 'A prayer hall enshrining the hidden statue of Hashiri Daikokuten, known for blessings of household safety, business prosperity, traffic safety, good fortune, warding off misfortune, and safe childbirth.' },
      { name: 'Tachiki Kannon Hall (Main Hall)', image: '/images/chuzenji/common/main2.png', desc: 'It is said that Priest Shodo saw a vision of the thousand-armed Kannon over Lake Chuzenji and carved her likeness into a living katsura tree. The Kannon still stands rooted in the earth today, greeting visitors with a serene expression. It is also the 18th sacred site of the Bando 33 Kannon Pilgrimage.' },
      { name: 'Godaido Hall', image: '/images/chuzenji/common/godaido.jpg', desc: 'A prayer hall enshrining the Five Wisdom Kings: Fudo Myo-o, Gozanze Myo-o, Gundari Myo-o, Daiitoku Myo-o, and Kongoyasha Myo-o. The ceiling features a magnificent cloud dragon painted by Nampu Katayama.' },
    ]),
  },
  { key: 'grounds_heading_godaido', label: '「五大堂からの眺望」見出し', defaultValue: '五大堂からの眺望', translatable: true },
  { key: 'grounds_godaido_text', label: '五大堂からの眺望テキスト', multiline: true, defaultValue: '五大堂の大窓からは、中禅寺湖と男体山を一望することができます。四季折々の景色は訪れる人々を魅了し、特に紅葉の季節には多くの参拝者が訪れます。', translatable: true, defaultValueEn: 'From the large windows of Godaido Hall, visitors can enjoy sweeping views of Lake Chuzenji and Mount Nantai. The scenery changes beautifully with the seasons, and the autumn foliage is especially popular with visitors and worshippers.' },
  { key: 'grounds_heading_flow', label: '「参拝の流れ」見出し', defaultValue: '参拝の流れ', translatable: true },
  {
    key: 'grounds_flow', label: '参拝の流れ', type: 'list' as const,
    listFields: [{ key: 'title', label: 'ステップ名' }, { key: 'text', label: '説明', multiline: true }],
    defaultValue: J([
      { title: '拝観受付（山門）', text: '入口にて拝観料をお納めください。' },
      { title: '御朱印所', text: '山門をくぐってまっすぐ進んだ左側の建物（お札所）にて、御朱印やお守りをお受けいただけます。御朱印は先にお預けください。' },
      { title: '本堂参拝', text: 'ご本尊・立木観音（十一面千手観世音菩薩）にお参りください。' },
      { title: '五大堂', text: '中禅寺湖を一望できる五大堂へ。天井の龍の墨絵も必見です。' },
    ]),
    translatable: true,
    defaultValueEn: J([
      { title: 'Reception (Sanmon Gate)', text: 'Please pay the admission fee at the entrance.' },
      { title: 'Goshuin Office', text: 'Just past the Sanmon Gate, on the left, you\'ll find the goshuin office (o-fudasho), where you can receive goshuin stamps and omamori charms. Please leave your goshuin book here first.' },
      { title: 'Worship at the Main Hall', text: 'Please worship the principal image, Tachiki Kannon (the Eleven-Faced Thousand-Armed Kannon Bodhisattva).' },
      { title: 'Godaido Hall', text: 'Visit Godaido Hall for a panoramic view of Lake Chuzenji — don\'t miss the ink dragon painting on the ceiling.' },
    ]),
  },
] as const

export default function AdminChuzenjGrounds() {
  return <SectionEditor title="境内のご案内" href="/grounds" fields={FIELDS as never} />
}
