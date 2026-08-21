'use client'
import SectionEditor from '@/components/admin/SectionEditor'

const J = (v: unknown) => JSON.stringify(v)

const FIELDS = [
  { key: 'history_subtitle', label: '見出し（サブタイトル）', defaultValue: '日光山中禅寺の由緒と縁起', translatable: true },
  { key: 'history_heading_founding', label: '「創建の由来」見出し', defaultValue: '創建の由来', translatable: true },
  { key: 'history_founding_p1', label: '創建の由来（段落1）', multiline: true, defaultValue: '日光山中禅寺は、784年（延暦3年）、勝道上人によって開かれました。勝道上人は日光山を開いた高僧であり、幾多の困難を乗り越えながら男体山に登頂し、山頂で観音様を感得したとされています。', translatable: true, defaultValueEn: 'Nikkozan Chuzenji Temple was founded in 784 by the Buddhist monk Shodo Shonin, who is revered as the founder of sacred Mount Nikko. After overcoming many hardships, he successfully reached the summit of Mount Nantai, where tradition holds that he experienced a divine vision of Kannon, the Bodhisattva of Compassion.' },
  { key: 'history_founding_p2', label: '創建の由来（段落2）', multiline: true, defaultValue: '中禅寺湖のほとりに建てられた本堂には、上人が湖畔に立つ桂の立木に直接刻んだと伝わる千手観世音菩薩が祀られています。木を切り倒すことなく、立ったままの木に彫り上げたことから「立木観音」と呼ばれ、今日まで人々の信仰を集めてきました。', translatable: true },
  { key: 'history_heading_timeline', label: '「歴史の流れ」見出し', defaultValue: '歴史の流れ', translatable: true },
  {
    key: 'history_timeline', label: '歴史の流れ（年表）', type: 'list' as const,
    listFields: [{ key: 'year', label: '年代' }, { key: 'title', label: 'タイトル' }, { key: 'text', label: '説明', multiline: true }],
    defaultValue: J([
      { year: '784年（延暦3年）', title: '勝道上人による開山', text: '勝道上人が中禅寺湖畔に立木観音を刻み、中禅寺を創建。日光山修験道の霊場として栄え始める。' },
      { year: '848年（嘉祥元年）', title: '円仁（慈覚大師）参詣', text: '慈覚大師が中禅寺に登り薬師寺を創健したと伝わる。天台宗としての性格が強まる。' },
      { year: '1627年（寛永4年）', title: '天海大僧正による復興', text: '江戸幕府の庇護のもと、天海大僧正によって伽藍が整備・復興される。' },
      { year: '明治時代', title: '外国公使の避暑地として', text: '明治以降、中禅寺湖畔は各国外交官の夏の避暑地として栄え、中禅寺も国際的に知られるようになる。' },
      { year: '現在', title: '関東屈指の観音霊場', text: '関東有数の観音霊場として多くの参拝者が訪れる。坂東三十三観音霊場の第十八番札所にも数えられる。' },
    ]),
    translatable: true,
    defaultValueEn: J([
      { year: '784 CE (Enryaku 3)', title: 'Founded by Priest Shodo', text: 'Priest Shodo carved the Tachiki Kannon on the shore of Lake Chuzenji, founding the temple. It began to flourish as a sacred site of Nikko mountain asceticism.' },
      { year: '848 CE (Kasho 1)', title: 'Visit by Ennin (Jikaku Daishi)', text: 'Jikaku Daishi is said to have climbed to Chuzenji and founded Yakushi-ji Temple there, strengthening its character as a site of the Tendai sect.' },
      { year: '1627 (Kan\'ei 4)', title: 'Restoration by Tenkai', text: 'Under the protection of the Edo shogunate, the temple complex was maintained and restored by the great priest Tenkai.' },
      { year: 'Meiji Era', title: 'A Summer Retreat for Foreign Envoys', text: 'From the Meiji era onward, the shore of Lake Chuzenji flourished as a summer retreat for diplomats from various countries, and Chuzenji became known internationally.' },
      { year: 'Today', title: 'A Leading Kannon Pilgrimage Site in Kanto', text: 'Chuzenji draws many visitors as one of the leading Kannon pilgrimage sites in the Kanto region, and is counted as the 18th sacred site of the Bando 33 Kannon Pilgrimage.' },
    ]),
  },
  { key: 'history_heading_honzon', label: '「ご本尊」見出し', defaultValue: 'ご本尊・千手観世音菩薩', translatable: true },
  { key: 'history_honzon', label: 'ご本尊・千手観世音菩薩', multiline: true, defaultValue: 'ご本尊の千手観世音菩薩は、高さ約6メートルに及ぶ大きな仏様です。勝道上人が湖畔の桂の立木に直接刻んだとされ、木は今も根を張ったまま祀られています。千の手で人々のあらゆる願いを救い、千の眼で衆生の苦しみを見守るとされる観音様は、諸願成就のご利益があるとされています。', translatable: true, defaultValueEn: 'The principal image of the temple is Senju Kannon, the Thousand-Armed Bodhisattva of Compassion, an imposing statue approximately six meters tall. According to tradition, Shodo Shonin carved the image directly into a living katsura tree on the shores of Lake Chuzenji, and the tree remains rooted in the ground to this day.\n\nWith a thousand hands to offer aid and a thousand eyes to watch over the suffering of all beings, Senju Kannon is believed to respond to many different prayers and wishes.' },
  { key: 'history_heading_bando', label: '「坂東三十三観音」見出し', defaultValue: '坂東三十三観音 第十八番札所', translatable: true },
  { key: 'history_bando', label: '坂東三十三観音', multiline: true, defaultValue: '中禅寺立木観音は、関東・東北一円にわたる坂東三十三観音霊場の第十八番札所に数えられています。多くの巡礼者がこの地を訪れ、千手観世音菩薩に手を合わせてきました。', translatable: true },
] as const

export default function AdminChuzenjHistory() {
  return <SectionEditor title="立木観音の歴史" href="/history" fields={FIELDS as never} />
}
