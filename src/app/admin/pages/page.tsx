'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { normalizeStaleList } from '@/lib/site-content'
import ListEditor, { type ListField } from '@/components/admin/ListEditor'

type TextField = { key: string; label: string; hint?: string; multiline?: boolean; defaultValue?: string; type?: 'text'; translatable?: boolean }
type ListFieldDef = { key: string; label: string; type: 'list'; listFields: ListField[]; defaultValue: string; translatable?: boolean; defaultValueEn?: string; requireItemKey?: string }
type Field = TextField | ListFieldDef
type Section = { section: string; href: string; fields: Field[] }

const J = (v: unknown) => JSON.stringify(v)

const SECTIONS: Section[] = [
  {
    section: '立木観音の歴史',
    href: '/history',
    fields: [
      { key: 'history_subtitle', label: '見出し（サブタイトル）', defaultValue: '日光山中禅寺の由緒と縁起', translatable: true },
      { key: 'history_heading_founding', label: '「創建の由来」見出し', defaultValue: '創建の由来', translatable: true },
      { key: 'history_founding_p1', label: '創建の由来（段落1）', multiline: true, defaultValue: '日光山中禅寺は、784年（延暦3年）、勝道上人によって開かれました。勝道上人は日光山を開いた高僧であり、幾多の困難を乗り越えながら男体山に登頂し、山頂で観音様を感得したとされています。', translatable: true, defaultValueEn: 'Nikkozan Chuzenji Temple was founded in 784 by the Buddhist monk Shodo Shonin, who is revered as the founder of sacred Mount Nikko. After overcoming many hardships, he successfully reached the summit of Mount Nantai, where tradition holds that he experienced a divine vision of Kannon, the Bodhisattva of Compassion.' },
      { key: 'history_founding_p2', label: '創建の由来（段落2）', multiline: true, defaultValue: '中禅寺湖のほとりに建てられた本堂には、上人が湖畔に立つ桂の立木に直接刻んだと伝わる千手観世音菩薩が祀られています。木を切り倒すことなく、立ったままの木に彫り上げたことから「立木観音」と呼ばれ、今日まで人々の信仰を集めてきました。', translatable: true },
      { key: 'history_heading_timeline', label: '「歴史の流れ」見出し', defaultValue: '歴史の流れ', translatable: true },
      {
        key: 'history_timeline', label: '歴史の流れ（年表）', type: 'list',
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
    ],
  },
  {
    section: '境内のご案内',
    href: '/grounds',
    fields: [
      { key: 'grounds_subtitle', label: '見出し（ヒーロー サブタイトル）', defaultValue: '見どころ・境内マップ', translatable: true },
      { key: 'grounds_heading_map', label: '「境内マップ・主な見どころ」見出し', defaultValue: '境内マップ・主な見どころ', translatable: true },
      { key: 'grounds_map_hint', label: '地図の操作案内文', defaultValue: '地図上のピンをクリックすると各スポットの詳細が見られます', translatable: true },
      {
        key: 'grounds_spots', label: '主な見どころ', type: 'list',
        requireItemKey: 'image',
        listFields: [{ key: 'name', label: '名称' }, { key: 'image', label: '画像パス（例: /images/chuzenji/grounds/sanmon.png）' }, { key: 'desc', label: '説明', multiline: true }],
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
        key: 'grounds_flow', label: '参拝の流れ', type: 'list',
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
    ],
  },
  {
    section: '花ごよみ',
    href: '/flower-calendar',
    fields: [
      { key: 'flower_calendar_subtitle', label: '見出し（サブタイトル）', defaultValue: '境内を彩る、四季折々の花', translatable: true },
      {
        key: 'flower_calendar_items', label: '花ごよみ（月ごとの花）', type: 'list',
        listFields: [
          { key: 'month', label: '見頃（例：4月〜5月）' },
          { key: 'name', label: '花の名前・見出し' },
          { key: 'images', label: '画像パス（「画像管理」でアップロードしたURLを貼り付け）', images: true },
          { key: 'desc', label: '説明', multiline: true },
        ],
        defaultValue: J([
          { month: '4月上旬～中旬', name: 'コテマリソウ', image: 'https://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786581770470-spjwmgylezd.JPG', desc: '境内' },
          { month: '5月上旬', name: 'シャクナゲ', image: 'https://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786582400445-16qf1g8j60d.JPG', desc: '境内' },
          { month: '5月上旬', name: 'ヤマザクラ', images: 'https://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786583110927-2p9vzi2k9no.JPG\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786585486376-r5cr7xa8un9.JPG\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786585492281-p1bhm1xjfr.JPG\n', desc: '境内' },
          { month: '5月上旬~中旬', name: 'トウゴウミツバツツジ', images: 'https://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786585678065-a1teajz0mm5.JPG\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786585682184-idgcmyi5yxr.JPG\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786585687605-5igo1fizrhj.JPG\n', desc: '境内' },
          { month: '5月中旬', name: 'アズマシャクナゲ', images: 'https://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786585941349-hxqjzinyzmp.jpg\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786585944999-m0khcaftrrc.jpg\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786585949634-n6lv9if0pyf.jpg\n', desc: '境内' },
          { month: '5月下旬', name: 'ホウノキ', images: 'https://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586081151-4zp88abg5d4.JPG', desc: '境内' },
          { month: '5月下旬', name: 'ルピナス', images: 'https://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586099707-0vxuk2uamm9.JPG', desc: '境内' },
          { month: '5月下旬', name: 'レンゲツツジ', images: 'https://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586326924-q7mkq0ky4we.JPG\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586314615-humryfc7ce.JPG\n', desc: '境内' },
          { month: '6月上旬', name: 'ヤマツツジ', images: 'https://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786587011401-8wzj7t3wfok.JPG\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786587020117-abdchotygni.JPG\n', desc: '境内' },
          { month: '7月上旬', name: 'アカショウマ', images: 'https://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586422053-rqqzlxilbg.JPG\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586418300-g3jskw1orcw.JPG\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586413810-7uji2yqzdv7.JPG\n', desc: '境内' },
          { month: '7月上旬', name: 'アヤメ', images: 'https://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586503782-hhxc9vfsibk.JPG\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586509123-54bdol4ebh7.JPG\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586512794-4pamo4r61.JPG\n', desc: '境内' },
          { month: '7月上旬', name: 'ユキノシタ', images: 'https://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586602772-femadxhmejh.JPG\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586611554-bwhok6bge94.JPG\n', desc: '境内' },
          { month: '7月中旬', name: 'クルマユリ', images: 'https://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586688960-lt3s808j2a9.jpg\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586685732-lucys0rv0bf.jpg\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586681888-0f9rxdcsbryb.jpg\n', desc: '境内' },
          { month: '9月上旬', name: 'トリカブト', images: 'https://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586775444-jrjjl3re8fa.jpg\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586781072-00vcowqeyyil.JPG\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586786785-xl3ikbr3fp.JPG\n', desc: '境内' },
          { month: '9月中旬', name: 'サラシナショウマ', images: 'https://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586883722-ypomxhg6v7p.JPG\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586902705-47o5dc3erss.JPG\n', desc: '境内' },
        ]),
        translatable: true,
        defaultValueEn: J([
          { month: 'Early to mid April', name: 'Kotemari (Reeves Spirea)', image: 'https://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786581770470-spjwmgylezd.JPG', desc: 'Temple grounds' },
          { month: 'Early May', name: 'Shakunage (Rhododendron)', image: 'https://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786582400445-16qf1g8j60d.JPG', desc: 'Temple grounds' },
          { month: 'Early May', name: 'Yamazakura (Mountain Cherry Blossom)', images: 'https://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786583110927-2p9vzi2k9no.JPG\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786585486376-r5cr7xa8un9.JPG\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786585492281-p1bhm1xjfr.JPG\n', desc: 'Temple grounds' },
          { month: 'Early to mid May', name: 'Togo Mitsuba Azalea', images: 'https://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786585678065-a1teajz0mm5.JPG\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786585682184-idgcmyi5yxr.JPG\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786585687605-5igo1fizrhj.JPG\n', desc: 'Temple grounds' },
          { month: 'Mid May', name: 'Azuma Shakunage (Rhododendron)', images: 'https://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786585941349-hxqjzinyzmp.jpg\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786585944999-m0khcaftrrc.jpg\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786585949634-n6lv9if0pyf.jpg\n', desc: 'Temple grounds' },
          { month: 'Late May', name: 'Honoki (Japanese Bigleaf Magnolia)', images: 'https://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586081151-4zp88abg5d4.JPG', desc: 'Temple grounds' },
          { month: 'Late May', name: 'Lupine', images: 'https://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586099707-0vxuk2uamm9.JPG', desc: 'Temple grounds' },
          { month: 'Late May', name: 'Renge Tsutsuji (Japanese Azalea)', images: 'https://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586326924-q7mkq0ky4we.JPG\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586314615-humryfc7ce.JPG\n', desc: 'Temple grounds' },
          { month: 'Early June', name: 'Yamatsutsuji (Torch Azalea)', images: 'https://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786587011401-8wzj7t3wfok.JPG\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786587020117-abdchotygni.JPG\n', desc: 'Temple grounds' },
          { month: 'Early July', name: 'Akashouma (False Goat\'s Beard)', images: 'https://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586422053-rqqzlxilbg.JPG\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586418300-g3jskw1orcw.JPG\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586413810-7uji2yqzdv7.JPG\n', desc: 'Temple grounds' },
          { month: 'Early July', name: 'Ayame (Iris)', images: 'https://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586503782-hhxc9vfsibk.JPG\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586509123-54bdol4ebh7.JPG\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586512794-4pamo4r61.JPG\n', desc: 'Temple grounds' },
          { month: 'Early July', name: 'Yukinoshita (Strawberry Saxifrage)', images: 'https://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586602772-femadxhmejh.JPG\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586611554-bwhok6bge94.JPG\n', desc: 'Temple grounds' },
          { month: 'Mid July', name: 'Kurumayuri (Wheel Lily)', images: 'https://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586688960-lt3s808j2a9.jpg\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586685732-lucys0rv0bf.jpg\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586681888-0f9rxdcsbryb.jpg\n', desc: 'Temple grounds' },
          { month: 'Early September', name: 'Torikabuto (Monkshood)', images: 'https://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586775444-jrjjl3re8fa.jpg\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586781072-00vcowqeyyil.JPG\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586786785-xl3ikbr3fp.JPG\n', desc: 'Temple grounds' },
          { month: 'Early September', name: 'Sarashina Shouma (Bugbane)', images: 'https://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586883722-ypomxhg6v7p.JPG\nhttps://vsemgmgjggzvpdqztlgt.supabase.co/storage/v1/object/public/temple-images/1786586902705-47o5dc3erss.JPG\n', desc: 'Temple grounds' },
        ]),
      },
    ],
  },
  {
    section: '参拝について（拝観料金）',
    href: '/about',
    fields: [
      { key: 'about_subtitle',   label: '見出し（ヒーロー・本文共通）', defaultValue: '拝観時間・拝観料', translatable: true },
      { key: 'about_hours_note', label: '「拝観時間」欄の表示文', defaultValue: '季節により異なります（下記参照）', translatable: true },
      { key: 'about_holiday',    label: '定休日', defaultValue: '年中無休', translatable: true },
      { key: 'about_fee_adult', label: '大人 拝観料', defaultValue: '500円', translatable: true },
      { key: 'about_fee_child', label: '子供 拝観料', defaultValue: '200円', translatable: true },
      { key: 'about_fee_group_adult', label: '大人 団体料金（20名様以上）', defaultValue: '450円', translatable: true },
      { key: 'about_fee_group_child', label: '子供 団体料金（20名様以上）', defaultValue: '180円', translatable: true },
      { key: 'about_parking', label: '駐車場', multiline: true, defaultValue: '無料駐車場有（予約不可）\n※満車の時はお近くに有料駐車場をご利用ください。', translatable: true },
      { key: 'about_hours_peak',     label: '4月〜10月 拝観時間', defaultValue: '午前8時〜午後5時', translatable: true },
      { key: 'about_hours_shoulder', label: '11月・3月 拝観時間', defaultValue: '午前8時〜午後4時', translatable: true },
      { key: 'about_hours_winter',   label: '12月〜2月 拝観時間', defaultValue: '午前8時30分〜午後3時30分', translatable: true },
      { key: 'about_grounds_teaser_title', label: '「境内のご案内」誘導カード見出し', defaultValue: '境内のご案内', translatable: true },
      { key: 'about_grounds_teaser_desc',  label: '「境内のご案内」誘導カード説明文', multiline: true, defaultValue: '山門・観音堂・鐘楼・札所・天堂・愛染堂・延命水など、境内各所の見どころをご紹介しています。', translatable: true, defaultValueEn: 'Discover highlights throughout the grounds, including the Sanmon Gate, Kannon Hall, bell tower, pilgrimage hall, Tendo Hall, Aizen Hall, and the Enmei-sui spring water.' },
    ],
  },
  {
    section: '御祈願',
    href: '/prayer',
    fields: [
      { key: 'prayer_subtitle', label: '見出し（ヒーロー サブタイトル）', defaultValue: '立木観音護摩祈祷', translatable: true },
      { key: 'prayer_heading_about', label: '「御祈願について」見出し', defaultValue: '御祈願について', translatable: true },
      { key: 'prayer_about', label: '御祈願についての説明文', multiline: true, defaultValue: 'お護摩はインド伝来の密教の秘法（秘密の教え）で、僧侶が護摩壇に向かい、作法にしたがって仏の智慧の火を焚き、様々な供物を焚き上げ、厄難・災難を払いその加護（成就）を願います。', translatable: true },
      { key: 'prayer_heading_hours', label: '「御祈願時間」見出し', defaultValue: '御祈願時間', translatable: true },
      { key: 'prayer_hours_row_label', label: '時間テーブルの行ラベル', defaultValue: '通年（平日・土日祝）', translatable: true },
      { key: 'prayer_hours', label: '御祈願時間', defaultValue: '9：00〜12：00', translatable: true },
      { key: 'prayer_hours_note1', label: '御祈願時間 補足1', defaultValue: '定時での御祈願はございません。', translatable: true },
      { key: 'prayer_hours_note2', label: '御祈願時間 補足2', defaultValue: '予約制となりますので、事前にお申し込みをお願い致します。', translatable: true },
      { key: 'prayer_exclude_dates', label: '除外日', defaultValue: '6月17日・6月18日・8月4日・8月8日', translatable: true, defaultValueEn: 'June 17, June 18, August 4, August 8' },
      { key: 'prayer_exclude_note', label: '除外日の補足文', multiline: true, defaultValue: '他にも行事によっては祈祷できない日もございますので、一度お問い合わせください。', translatable: true },
      { key: 'prayer_heading_fees', label: '「御祈願料」見出し', defaultValue: '御祈願料', translatable: true },
      { key: 'prayer_fees_note', label: '御祈願料 説明文', multiline: true, defaultValue: '原則、御札の料金にて受付しております。金額によって御札と木箱の大きさが変わります。', translatable: true },
      {
        key: 'prayer_fees', label: '御祈願料（テーブル）', type: 'list',
        listFields: [{ key: 'price', label: '御祈願料' }, { key: 'size', label: '御札サイズ' }],
        defaultValue: J([
          { price: '5,000円', size: '高さ28㎝ 横幅10cm' },
          { price: '10,000円', size: '高さ32㎝ 横幅11.5cm' },
          { price: '20,000円', size: '高さ38㎝ 横幅12cm' },
          { price: '30,000円', size: '高さ42.5㎝ 横幅13cm' },
        ]),
        translatable: true,
        defaultValueEn: J([
          { price: '¥5,000', size: 'H28cm × W10cm' },
          { price: '¥10,000', size: 'H32cm × W11.5cm' },
          { price: '¥20,000', size: 'H38cm × W12cm' },
          { price: '¥30,000', size: 'H42.5cm × W13cm' },
        ]),
      },
      { key: 'prayer_heading_mail', label: '「護摩札の郵送について」見出し', defaultValue: '護摩札の郵送について', translatable: true },
      { key: 'prayer_mail_text', label: '護摩札の郵送について', multiline: true, defaultValue: '万が一、参列できない場合は郵送にてお札をお送りします。ECｻｲﾄ又は着払いにて発送させて頂きます。着払いの場合、申込用紙に必要事項をご記入の上、現金書留にてお送りください。', translatable: true, defaultValueEn: 'If you are unable to attend in person, we can mail the ofuda to you. Shipping is via our online shop or cash-on-delivery. For cash-on-delivery, please fill in the required details on the application form and send payment by registered mail.' },
      { key: 'prayer_mail_note', label: '護摩札の郵送 補足', defaultValue: '※お申込み頂き御祈願後、発送させて頂きますので1〜2週間ほどお待ちください。', translatable: true },
      { key: 'prayer_heading_others', label: '「その他の御祈願」見出し', defaultValue: 'その他の御祈願', translatable: true },
      { key: 'prayer_car_title', label: '新車祈祷 タイトル', defaultValue: '新車祈願（車両安全祈願）', translatable: true },
      { key: 'prayer_car_desc', label: '新車祈祷 説明文', defaultValue: 'お車を新しくされた方、車両安全の御祈願をお申し込みの方', translatable: true },
      { key: 'prayer_car_fee', label: '新車祈祷 料金', defaultValue: '5,000円〜', translatable: true },
      { key: 'prayer_car_note', label: '新車祈祷 備考', defaultValue: '※交通安全の錫杖守りと木札が付きます。', translatable: true },
      { key: 'prayer_birth_title', label: '安産祈願 タイトル', defaultValue: '安産祈願', translatable: true },
      { key: 'prayer_birth_fee', label: '安産祈願 料金', defaultValue: '5,000円', translatable: true },
      { key: 'prayer_birth_note', label: '安産祈願 備考', defaultValue: '※腹帯の持ち込みも可能です。詳しくはお問い合わせください。', translatable: true },
      { key: 'prayer_753_title', label: '七五三祈願 タイトル', defaultValue: '七五三祈願', translatable: true },
      { key: 'prayer_753_fee', label: '七五三祈願 料金', defaultValue: '5,000円', translatable: true },
      { key: 'prayer_753_note', label: '七五三祈願 備考', defaultValue: '※三歳・五歳・七歳のお子様の健やかな成長をお祝いする御祈願です。', translatable: true },
      { key: 'prayer_cta_heading', label: 'CTA見出し', defaultValue: '御祈願のお申し込み', translatable: true },
      { key: 'prayer_cta_sub', label: 'CTA補足文', defaultValue: 'ご不明な点はお気軽にお問い合わせください。', translatable: true },
    ],
  },
  {
    section: '仏前式（結婚式）',
    href: '/prayer/wedding',
    fields: [
      { key: 'wedding_subtitle', label: '見出し（ヒーロー サブタイトル）', defaultValue: 'み仏の御前で結ばれる、二人の誓い', translatable: true },
      { key: 'wedding_heading_about', label: '「仏前式とは」見出し', defaultValue: '仏前式とは', translatable: true },
      { key: 'wedding_about_p1', label: '仏前式とは（段落1）', multiline: true, defaultValue: '仏前式とは、ご本尊の御前で結婚の誓いを立てる、仏教の伝統にもとづく挙式です。神前式が神様に、教会式が神父の立ち会いのもとに誓いを立てるのに対し、仏前式ではご本尊と、これまで二人を見守ってきたご先祖様に、夫婦となることを報告し、誓いを立てます。', translatable: true },
      { key: 'wedding_about_p2', label: '仏前式とは（段落2）', multiline: true, defaultValue: '中禅寺では、五大堂にて、僧侶の導きのもと厳かに式を執り行います。', translatable: true, defaultValueEn: 'At Chuzenji, the ceremony is solemnly conducted in the Godaido Hall, guided by a priest.' },
      { key: 'wedding_heading_flow', label: '「挙式の流れ」見出し', defaultValue: '挙式の流れ', translatable: true },
      {
        key: 'wedding_flow', label: '挙式の流れ', type: 'list',
        listFields: [{ key: 'title', label: 'ステップ名' }, { key: 'text', label: '説明', multiline: true }],
        defaultValue: J([
          { title: '参進', text: '新郎新婦が五大堂内陣へと進み入ります。' },
          { title: '開式の辞', text: '開式の言葉で式が始まります。' },
          { title: '三礼', text: '五大明王様に礼拝をします。' },
          { title: '勧請', text: '僧侶による仏さまをお招きする作法を致します。' },
          { title: '敬白', text: '仏様神様に結婚の意義を報告し、ご両人を始めとし皆様が守られるようにお唱えをいたします。' },
          { title: '三帰依文', text: '生活において最も重要な２つの言葉をお授けします。' },
          { title: '念珠授与', text: '念珠を戒師様より授与致します。' },
          { title: '盃の儀', text: '三三九度の盃を交わします。' },
          { title: '聖句授与', text: '戒師より仏様の尊い教え、聖句の授与。' },
          { title: '証明授与', text: '結婚式の証明書をお渡しいたします。' },
          { title: '宣誓・献花', text: '新郎新婦に誓いの言葉を述べていただき、結婚式の締めくくりといたしまして、本尊様に花を捧げていただきます。' },
          { title: '両家親族寿杯', text: 'ご両家皆様の堅めの盃を行います。' },
          { title: '慶祝戒師法話・円成宣言', text: '戒師様からの法話と円成宣言を行い終了となります。' },
          { title: '記念撮影', text: '五大堂にてお二人の写真及びご親族皆様との集合写真を撮影いたします。' },
        ]),
        translatable: true,
        defaultValueEn: J([
          { title: 'Procession', text: 'The couple processes into the hall.' },
          { title: 'Opening Address', text: 'A priest opens the ceremony with an address.' },
          { title: 'Three Bows', text: 'Bows are made in reverence to the Five Wisdom Kings.' },
          { title: 'Invocation', text: 'The priest performs a rite inviting the Buddha\'s presence.' },
          { title: 'Declaration', text: 'The significance of the marriage is reported to the Buddhas and deities, with prayers offered for the protection of the couple and all present.' },
          { title: 'The Three Refuges', text: 'Two of the most important words for daily life are bestowed upon the couple.' },
          { title: 'Juzu Presentation', text: 'The priest presents the juzu prayer beads made together by the couple.' },
          { title: 'Cup Ceremony', text: 'The couple exchanges the ceremonial san-san-kudo cups.' },
          { title: 'Sacred Verse Presentation', text: 'The priest bestows a sacred verse from the Buddha\'s precious teachings.' },
          { title: 'Certificate Presentation', text: 'A certificate of marriage is presented.' },
          { title: 'Vows & Flower Offering', text: 'The couple recites their vows, and as the ceremony concludes, offers flowers to the principal image.' },
          { title: 'Cup of Union Between Families', text: 'Both families share a ceremonial cup, sealing their bond.' },
          { title: 'Priest\'s Blessing & Declaration of Completion', text: 'The priest offers a congratulatory talk and declares the ceremony complete.' },
          { title: 'Commemorative Photos', text: 'Photos of the couple and a group photo with family are taken in the Godaido Hall.' },
        ]),
      },
      { key: 'wedding_flow_note', label: '「挙式の流れ」補足', defaultValue: '式次第はお二人のご希望に応じて一部調整が可能です。詳しくはお申し込み時にご相談ください。', translatable: true },
      { key: 'wedding_heading_details', label: '「料金・所要時間・人数」見出し', defaultValue: '料金・所要時間・人数の目安', translatable: true },
      { key: 'wedding_fee', label: '料金', defaultValue: '15万～（念珠込み）', translatable: true, defaultValueEn: 'From ¥150,000 (includes juzu prayer beads)' },
      { key: 'wedding_time', label: '所要時間', defaultValue: '約30〜40分', translatable: true },
      { key: 'wedding_capacity', label: 'ご列席人数の目安', defaultValue: '近親者を中心に五大堂の広さに応じた人数まで', translatable: true, defaultValueEn: 'Close family, up to the capacity of the Godaido Hall' },
      { key: 'wedding_season', label: '挙式可能時期', defaultValue: '通年（行事日・繁忙期を除く。要相談）', translatable: true },
      { key: 'wedding_place', label: '会場', defaultValue: '五大堂（五大明王 御宝前）', translatable: true, defaultValueEn: 'Godaido Hall (before the Five Wisdom Kings)' },
      { key: 'wedding_heading_notes', label: '「ご注意事項」見出し', defaultValue: 'ご注意事項', translatable: true },
      {
        key: 'wedding_notes', label: 'ご注意事項', type: 'list',
        listFields: [{ key: 'text', label: '項目', multiline: true }],
        defaultValue: J([
          { text: '挙式は完全予約制です。ご希望日の3ヶ月前までにお申し込みください。' },
          { text: 'ご列席は近親者を中心に、五大堂内陣の広さに応じた人数（約40名）までとさせていただきます。' },
          { text: '境内・五大堂での写真撮影は可能です（フラッシュ・三脚の使用は事前にご相談ください）。' },
          { text: '衣装・美容・会食・送迎の手配は含まれません。あくまで法要のみ。' },
          { text: '雨天・積雪時期など、季節により式次第の一部が変更となる場合があります。' },
        ]),
        translatable: true,
        defaultValueEn: J([
          { text: 'Ceremonies are by advance reservation only. Please apply at least 3 months before your preferred date.' },
          { text: 'Attendance is generally limited to close family, up to approximately 40 guests depending on the capacity of the Godaido Hall\'s inner sanctuary.' },
          { text: 'Photography in the grounds and Godaido Hall is permitted (please ask in advance about flash and tripod use).' },
          { text: 'Attire, hair & makeup, the reception, and transport are not included — this is a religious ceremony only.' },
          { text: 'Part of the ceremony may vary seasonally, for example during rain or snow.' },
        ]),
      },
      { key: 'wedding_cta_heading', label: 'CTA見出し', defaultValue: '仏前式のご相談・お申し込み', translatable: true },
      { key: 'wedding_cta_sub', label: 'CTA補足文', defaultValue: '挙式日はご希望をうかがったうえで調整いたします。まずはお気軽にご相談ください。', translatable: true },
    ],
  },
  {
    section: '御朱印',
    href: '/goshuin',
    fields: [
      { key: 'goshuin_heading_regular', label: '「御朱印」見出し', defaultValue: '御朱印', translatable: true },
      { key: 'goshuin_intro', label: '御朱印セクションの説明文', multiline: true, defaultValue: '御朱印は御朱印所にてお受けいただけます。\nなお、特別朱印は写経･写仏体験後に寺務所 体験受付窓口にてお渡しいたします', translatable: true, defaultValueEn: 'Goshuin stamps can be received at the goshuin counter.\nSpecial goshuin are given at the temple office experience counter after the sutra-copying or Buddha-tracing experience.' },
      {
        key: 'goshuin_regular', label: '通常御朱印（画像は固定・4件）', type: 'list',
        listFields: [{ key: 'title', label: 'タイトル' }],
        defaultValue: J([
          { title: '立木大悲殿' }, { title: 'ご詠歌' }, { title: '波之利大黒天' }, { title: '金剛閣' },
        ]),
        translatable: true,
        defaultValueEn: J([
          { title: 'Tachiki Daihiden' }, { title: 'Goeika' }, { title: 'Hashiri Daikokuten' }, { title: 'Kongokaku' },
        ]),
      },
      { key: 'goshuin_fee_note', label: '御朱印代・受付時間の案内', multiline: true, defaultValue: '御朱印代：各500円　／　書き入れ・書き置きともに同じ金額です。\n受付時間は拝観時間に準じます（閉門30分前に終了）。', translatable: true },
      { key: 'goshuin_heading_special', label: '「特別御朱印」見出し', defaultValue: '写経・写仏体験 特別御朱印', translatable: true },
      { key: 'goshuin_special_intro', label: '特別御朱印 説明文', defaultValue: '写経・写仏体験とセットでお受けいただける特別な御朱印です。', translatable: true },
      { key: 'goshuin_special_price', label: '特別御朱印 価格表示', defaultValue: '体験料込み 各1,000円', translatable: true },
      {
        key: 'goshuin_special', label: '特別御朱印一覧（画像は固定・3件）', type: 'list',
        listFields: [{ key: 'label', label: '区分（写経／写仏）' }, { key: 'title', label: 'タイトル' }, { key: 'sub', label: '副題' }, { key: 'desc', label: '説明', multiline: true }],
        defaultValue: J([
          { label: '写経', title: '金紙特別朱印', sub: '立木大悲殿', desc: '十六文字写経（延命十句観音経）をお書きいただいた方にお授けします。' },
          { label: '写経', title: '金紙特別御朱印', sub: '大日如来', desc: '十六文字写経（懺悔文）をお書きいただいた方にお授けします。' },
          { label: '写仏', title: '銀紙特別朱印', sub: '立木観世音', desc: '写仏をお書きいただいた方にお授けします。' },
        ]),
        translatable: true,
        defaultValueEn: J([
          { label: 'Sutra Copying', title: 'Gold Paper Special Stamp', sub: 'Tachiki Daihiden', desc: 'Given to those who copy the 16-character Enmei Jikku Kannon Sutra.' },
          { label: 'Sutra Copying', title: 'Gold Paper Special Stamp', sub: 'Dainichi Nyorai', desc: 'Given to those who copy the 16-character Repentance Sutra.' },
          { label: 'Buddha Tracing', title: 'Silver Paper Special Stamp', sub: 'Tachiki Kanzeon', desc: 'Given to those who complete a Buddha-image tracing.' },
        ]),
      },
      { key: 'goshuin_special_place', label: '特別御朱印 受付場所', defaultValue: '受付場所：寺務所 体験受付窓口', translatable: true },
      { key: 'goshuin_special_note',  label: '特別御朱印 補足', defaultValue: '※特別御朱印の種類は今後追加される場合があります。', translatable: true },
      { key: 'goshuin_heading_notes', label: '「ご注意」見出し', defaultValue: '御朱印についてのご注意', translatable: true },
      {
        key: 'goshuin_notes', label: '御朱印についてのご注意', type: 'list',
        listFields: [{ key: 'text', label: '注意事項', multiline: true }],
        defaultValue: J([
          { text: '御朱印は信仰の証です。コレクション目的でのお受け取りはご遠慮ください。' },
          { text: '閉門時刻の30分ほど前までを目安に、余裕をもってお越しください。' },
          { text: '書き入れは混雑時にお時間をいただく場合がございます。' },
          { text: '御朱印帳をお持ちでない方には書き置きもございます。' },
        ]),
        translatable: true,
        defaultValueEn: J([
          { text: 'A goshuin is a proof of faith — please do not request one solely for collecting purposes.' },
          { text: 'Please arrive with time to spare, aiming to be here by around 30 minutes before closing time.' },
          { text: 'Hand-written stamps may take extra time during busy periods.' },
          { text: 'Pre-inscribed stamps are also available for those without a goshuin book.' },
        ]),
      },
    ],
  },
  {
    section: '写経体験',
    href: '/experience/shakyou',
    fields: [
      { key: 'shakyou_subtitle', label: '見出し（ヒーロー サブタイトル）', defaultValue: '心を静め、お経の文字を丁寧にお写しいただきます', translatable: true },
      { key: 'shakyou_heading_about', label: '「写経とは」見出し', defaultValue: '写経とは', translatable: true },
      { key: 'shakyou_about_p1', label: '写経とは（段落1）', multiline: true, defaultValue: '写経とは、お経の文字を一文字一文字丁寧に書き写す修行です。文字を書くことで雑念を払い、心を清め、仏様との縁を結ぶとされています。', translatable: true },
      { key: 'shakyou_about_p2', label: '写経とは（段落2）', multiline: true, defaultValue: '立木観音では、十六文字のお経（延命十句観音経）または二十八文字の御経（懺悔文）をお写しいただきます。短いお経のため、約15分でお写しいただけます。', translatable: true, defaultValueEn: 'At Tachiki Kannon, you will copy either a 16-character sutra (the Enmei Jikku Kannon Gyo) or a 28-character sutra (the Sange-mon repentance verse). As these are short sutras, the experience takes about 15 minutes.' },
      { key: 'shakyou_heading_contents', label: '「体験内容」見出し', defaultValue: '体験内容', translatable: true },
      {
        key: 'shakyou_contents', label: '体験内容', type: 'list',
        listFields: [{ key: 'icon', label: 'アイコン（絵文字）' }, { key: 'title', label: 'タイトル' }, { key: 'desc', label: '説明', multiline: true }],
        defaultValue: J([
          { icon: '📜', title: '延命十句観音経', desc: '観音様念じることで、心を穏やかにし、人を思いやる生き方につながるお経。十六文字を丁寧にお写しいただきます。金紙特別御朱印（立木大悲殿）とセットです。' },
          { icon: '✍️', title: '懺悔文', desc: '過去の罪業を懺悔し、心を清めるお経。二八文字を丁寧にお写しいただきます。金紙特別御朱印（大日如来）とセットです。' },
        ]),
        translatable: true,
        defaultValueEn: J([
          { icon: '📜', title: 'Enmei Jikku Kannon Sutra', desc: 'A sutra that, through invoking Kannon, calms the heart and guides you toward a life of compassion for others. You will carefully copy its 16 characters. Paired with a gold-paper special goshuin (Tachiki Daihiden).' },
          { icon: '✍️', title: 'Sange-mon (Repentance Verse)', desc: 'A sutra to repent past wrongdoing and purify the heart. You will carefully copy its 28 characters. Paired with a gold-paper special goshuin (Dainichi Nyorai).' },
        ]),
      },
      { key: 'shakyou_heading_flow', label: '「体験の流れ」見出し', defaultValue: '体験の流れ', translatable: true },
      {
        key: 'shakyou_flow', label: '体験の流れ', type: 'list',
        listFields: [{ key: 'title', label: 'ステップ名' }, { key: 'text', label: '説明', multiline: true }],
        defaultValue: J([
          { title: '受付', text: '寺務所体験窓口にてお申し込みください。体験料をお納めいただきます。' },
          { title: '用具の準備', text: '写経用紙の入ったクリアファイルと筆をご用意しますので、お教室にそのままお持ちください。' },
          { title: '体験', text: '一文字一文字丁寧に、薄墨になっているところをお書入れください。' },
          { title: '特別朱印のお授け', text: '体験終了後、三宝（木の台）に写経を収め、クリアファイルと筆を寺務所にお返しください。引き換えに御朱印をお授けします。' },
        ]),
        translatable: true,
        defaultValueEn: J([
          { title: 'Reception', text: 'Please apply at the Temple Office experience counter and pay the experience fee.' },
          { title: 'Preparing Materials', text: 'A clear folder with a sutra sheet and a brush will be prepared — please bring them as is to the copying room.' },
          { title: 'Copying', text: 'Carefully trace over the light-gray printed characters, one by one.' },
          { title: 'Receiving the Special Goshuin', text: 'After finishing, place your sutra on the wooden offering stand and return the clear folder and brush to the Temple Office. You will receive a goshuin stamp in exchange.' },
        ]),
      },
      { key: 'shakyou_heading_fees', label: '「料金・所要時間」見出し', defaultValue: '料金・所要時間', translatable: true },
      { key: 'shakyou_fee',  label: '体験料', defaultValue: '1,000円（特別御朱印込み）', translatable: true },
      { key: 'shakyou_time', label: '所要時間', defaultValue: '約15分', translatable: true },
      { key: 'shakyou_target', label: '対象', defaultValue: '小学生以上', translatable: true, defaultValueEn: 'Elementary school age and up' },
      { key: 'shakyou_place',  label: '受付場所', defaultValue: '寺務所 体験受付窓口', translatable: true },
      { key: 'shakyou_hours',  label: '受付時間', defaultValue: '拝観時間内（閉門1時間前まで）', translatable: true },
      { key: 'shakyou_goshuin_note', label: '特別御朱印 補足（体験内容の下に表示）', defaultValue: '※特別御朱印は体験料に含まれています。別途購入はできません。', translatable: true },
      { key: 'shakyou_heading_items', label: '「持ち物・服装」見出し', defaultValue: '持ち物・服装', translatable: true },
      {
        key: 'shakyou_items', label: '持ち物・服装', type: 'list',
        listFields: [{ key: 'text', label: '項目', multiline: true }],
        defaultValue: J([
          { text: '筆・硯・お経の手本はすべてご用意しています。手ぶらでお越しください。' },
          { text: '汚れてもよい服装でお越しいただくとより安心です。' },
          { text: '書き損じても大丈夫です。丁寧にご指導いたします。' },
        ]),
        translatable: true,
        defaultValueEn: J([
          { text: 'Brushes, inkstones, and sutra templates are all provided. Please come empty-handed.' },
          { text: "It's reassuring to wear clothing you don't mind getting ink on." },
          { text: "Don't worry about making mistakes — our staff will guide you carefully." },
        ]),
      },
      { key: 'shakyou_cta_heading', label: 'CTA見出し', defaultValue: '写経体験のご予約', translatable: true },
      { key: 'shakyou_cta_sub', label: '予約ボタン下の説明文', defaultValue: '事前予約をおすすめします。当日受付も空きがあれば対応します。', translatable: true },
    ],
  },
  {
    section: '写仏体験',
    href: '/experience/shabutu',
    fields: [
      { key: 'shabutu_subtitle', label: '見出し（ヒーロー サブタイトル）', defaultValue: '仏様のお姿を一筆一筆、心を込めてお描きいただきます', translatable: true },
      { key: 'shabutu_heading_about', label: '「写仏とは」見出し', defaultValue: '写仏とは', translatable: true },
      { key: 'shabutu_about_p1', label: '写仏とは（段落1）', multiline: true, defaultValue: '写仏とは、仏様のお姿を下絵に沿って丁寧にお描きする修行です。写経と並ぶ伝統的な仏道修行のひとつで、描きながら仏様の功徳をいただき、心を落ち着けることができます。', translatable: true },
      { key: 'shabutu_about_p2', label: '写仏とは（段落2）', multiline: true, defaultValue: '立木観音の写仏体験では、立木観世音菩薩のお姿をお描きいただきます。絵が苦手な方でも、下絵に沿って描くためどなたでもお楽しみいただけます。', translatable: true, defaultValueEn: 'In Tachiki Kannon\'s shabutsu experience, you will trace the image of Tachiki Kanzeon Bodhisattva. Since you trace along a printed outline, anyone can enjoy it, even those who are not confident in their drawing.' },
      { key: 'shabutu_heading_contents', label: '「体験内容」見出し', defaultValue: '体験内容', translatable: true },
      {
        key: 'shabutu_contents', label: '体験内容', type: 'list',
        listFields: [{ key: 'title', label: 'タイトル' }, { key: 'desc', label: '説明', multiline: true }],
        defaultValue: J([
          { title: '立木観世音菩薩', desc: '下絵に沿って、立木観音のご本尊・立木観世音菩薩のお姿をお描きいただきます。完成後は銀紙特別朱印（立木観世音）とセットでお授けします。' },
        ]),
        translatable: true,
        defaultValueEn: J([
          { title: 'Tachiki Kanzeon Bodhisattva', desc: 'Following the template, you will trace the figure of the principal image, Tachiki Kanzeon Bodhisattva. A silver-paper special stamp (Tachiki Kanzeon) is given together upon completion.' },
        ]),
      },
      { key: 'shabutu_heading_fees', label: '「料金・所要時間」見出し', defaultValue: '料金・所要時間', translatable: true },
      { key: 'shabutu_fee',  label: '体験料', defaultValue: '1,000円（特別御朱印込み）', translatable: true },
      { key: 'shabutu_time', label: '所要時間', defaultValue: '約15〜20分（個人差があります）', translatable: true, defaultValueEn: 'Approx. 15–20 minutes (varies by person)' },
      { key: 'shabutu_target', label: '対象', defaultValue: 'どなたでも（絵が苦手な方も歓迎）', translatable: true },
      { key: 'shabutu_place',  label: '受付場所', defaultValue: '寺務所 体験受付窓口', translatable: true },
      { key: 'shabutu_hours',  label: '受付時間', defaultValue: '拝観時間内（閉門1時間前まで）', translatable: true },
      { key: 'shabutu_heading_flow', label: '「体験の流れ」見出し', defaultValue: '体験の流れ', translatable: true },
      {
        key: 'shabutu_flow', label: '体験の流れ', type: 'list',
        listFields: [{ key: 'title', label: 'ステップ名' }, { key: 'text', label: '説明', multiline: true }],
        defaultValue: J([
          { title: '受付', text: '寺務所 体験受付窓口にてお申し込みください。体験料をお納めいただきます。' },
          { title: '用具の準備', text: 'すべて貸し出しですので手ぶらでお越しいただけます。' },
          { title: 'お描きいただきます', text: '下絵に沿って、立木観世音菩薩のお姿をゆっくりお描きください。係の者がご説明いたします。' },
          { title: '特別御朱印のお授け', text: '完成後、銀紙特別朱印（立木観世音）をお授けします。' },
        ]),
        translatable: true,
        defaultValueEn: J([
          { title: 'Reception', text: 'Please apply at the Temple Office experience reception counter and pay the experience fee.' },
          { title: 'Preparing Materials', text: 'A template, brush, ink, and other materials are provided — all on loan, so you may come empty-handed.' },
          { title: 'Tracing the Image', text: 'Following the template, slowly trace the figure of Tachiki Kanzeon Bodhisattva. Our staff will guide you.' },
          { title: 'Receiving the Special Goshuin', text: 'Upon completion, you will receive a silver-paper special stamp (Tachiki Kanzeon).' },
        ]),
      },
      { key: 'shabutu_goshuin_note', label: '特別御朱印 補足（体験内容の下に表示）', defaultValue: '※特別御朱印は体験料に含まれています。別途購入はできません。', translatable: true },
      { key: 'shabutu_heading_items', label: '「持ち物・服装」見出し', defaultValue: '持ち物・服装', translatable: true },
      {
        key: 'shabutu_items', label: '持ち物・服装', type: 'list',
        listFields: [{ key: 'text', label: '項目', multiline: true }],
        defaultValue: J([
          { text: '手ぶらでお越しください。' },
        ]),
        translatable: true,
        defaultValueEn: J([
          { text: 'Please come empty-handed.' },
        ]),
      },
      { key: 'shabutu_cta_heading', label: 'CTA見出し', defaultValue: '写仏体験のご予約', translatable: true },
      { key: 'shabutu_cta_sub', label: '予約ボタン下の説明文', defaultValue: '事前予約をおすすめします。当日受付も空きがあれば対応します。', translatable: true },
    ],
  },
  {
    section: '坐禅体験',
    href: '/experience/zazen',
    fields: [
      { key: 'zazen_subtitle', label: '見出し（ヒーロー サブタイトル）', defaultValue: '静寂の中で心を調える、坐禅のひとときをお過ごしください', translatable: true },
      { key: 'zazen_heading_about', label: '「坐禅とは」見出し', defaultValue: '坐禅とは', translatable: true },
      { key: 'zazen_about_p1', label: '坐禅とは（段落1）', multiline: true, defaultValue: '坐禅とは、静かに座り呼吸を整えながら心を調える、伝統的な修行法です。姿勢と呼吸を整えることで、日々の雑念から離れ、静かなひとときを過ごすことができます。', translatable: true, defaultValueEn: 'Zazen is a traditional Zen practice of sitting quietly while regulating your breath and settling your mind. By steadying your posture and breathing, you can step away from daily distractions and spend a quiet moment.' },
      { key: 'zazen_about_p2', label: '坐禅とは（段落2）', multiline: true, defaultValue: '中禅寺の坐禅体験では、初めての方にも僧侶が丁寧に作法をご指導しますので、どなたでも安心してご参加いただけます。', translatable: true },
      { key: 'zazen_heading_fees', label: '「料金・所要時間」見出し', defaultValue: '料金・所要時間', translatable: true },
      { key: 'zazen_fee',  label: '体験料', defaultValue: '2,000円', translatable: true },
      { key: 'zazen_time', label: '所要時間', defaultValue: '30~40分', translatable: true, defaultValueEn: '30~40 minutes' },
      { key: 'zazen_target', label: '対象', defaultValue: '小学生以上（小学生は保護者同伴）', translatable: true },
      { key: 'zazen_place',  label: '受付場所', defaultValue: '本堂 体験受付窓口', translatable: true, defaultValueEn: 'Main Hall Experience Counter' },
      { key: 'zazen_hours_peak', label: '受付時間（4月〜10月）', defaultValue: '4月〜10月：13:00〜14:00', translatable: true, defaultValueEn: 'April–October: 1:00 PM–2:00 PM' },
      { key: 'zazen_hours_shoulder', label: '受付時間（3月・11月）', defaultValue: '3月・11月：13:00〜14:00', translatable: true, defaultValueEn: 'March & November: 1:00 PM–2:00 PM' },
      { key: 'zazen_hours_winter', label: '受付時間（12月〜2月）', defaultValue: '12月〜2月：13:00', translatable: true, defaultValueEn: 'December–February: 1:00 PM' },
      { key: 'zazen_heading_flow', label: '「体験の流れ」見出し', defaultValue: '体験の流れ', translatable: true },
      {
        key: 'zazen_flow', label: '体験の流れ', type: 'list',
        listFields: [{ key: 'title', label: 'ステップ名' }, { key: 'text', label: '説明', multiline: true }],
        defaultValue: J([
          { title: '受付', text: '本堂体験受付窓口にてお申し込みください。体験料をお納めいただきます。\n本堂、五大堂お参りの後、座禅体験となります（会場は五大堂、お座の間）' },
          { title: '作法のご説明', text: '姿勢の整え方・呼吸法など、坐禅の基本作法を僧侶が丁寧にご説明します。' },
          { title: '坐禅', text: '静寂の中、20分間坐禅を行います。' },
          { title: '終了・退堂', text: '終了の合図とともに、静かに退堂いたします。' },
        ]),
        translatable: true,
        defaultValueEn: J([
          { title: 'Reception', text: 'Please apply at the Main Hall experience reception counter and pay the experience fee.\nAfter visiting the Main Hall and Godaido Hall, the zazen session begins (held in the Oza-no-ma room of Godaido Hall).' },
          { title: 'Guidance on Form', text: 'A priest will carefully explain the basic posture and breathing method of zazen.' },
          { title: 'Zazen', text: 'Sit in silent meditation for 20 minutes.' },
          { title: 'Closing', text: 'At the closing signal, quietly leave the hall.' },
        ]),
      },
      { key: 'zazen_heading_items', label: '「ご注意・持ち物」見出し', defaultValue: 'ご注意・持ち物', translatable: true },
      {
        key: 'zazen_items', label: 'ご注意・持ち物', type: 'list',
        listFields: [{ key: 'text', label: '項目', multiline: true }],
        defaultValue: J([
          { text: '動きやすい服装でお越しください（きつい服装は避けてください）。' },
          { text: '携帯電話の電源はお切りいただくか、マナーモードにしてください。' },
          { text: '正座・あぐらでの着座が難しい方は椅子坐禅にも対応しますので、受付にご相談ください。' },
        ]),
        translatable: true,
        defaultValueEn: J([
          { text: 'Please wear comfortable, loose-fitting clothing.' },
          { text: 'Please turn off your phone or set it to silent mode.' },
          { text: 'If sitting on the floor is difficult, chair-based zazen is also available — please ask at reception.' },
        ]),
      },
      { key: 'zazen_cta_heading', label: 'CTA見出し', defaultValue: '坐禅体験のご予約', translatable: true },
      { key: 'zazen_cta_sub', label: '予約ボタン下の説明文', defaultValue: '事前予約をおすすめします。当日受付も空きがあれば対応します。', translatable: true },
    ],
  },
  {
    section: '数珠づくり体験',
    href: '/experience/jyuzu',
    fields: [
      { key: 'jyuzu_heading_about', label: '「数珠づくりとは」見出し', defaultValue: '数珠づくりとは', translatable: true },
      { key: 'jyuzu_about_p1', label: '数珠づくりとは（段落1）', multiline: true, defaultValue: '数珠（じゅず）は、仏様を礼拝するときに手に持つ法具です。当山の数珠づくり体験では、天然石・天然木の珠からご自由に組み合わせを選び、世界にひとつだけのオリジナル数珠（ブレスレット）をお作りいただけます。', translatable: true },
      { key: 'jyuzu_about_p2', label: '数珠づくりとは（段落2）', multiline: true, defaultValue: '職員が丁寧にご説明しますので、どなたでも簡単にお作りいただけます。僧侶がご祈祷したものを当日お守りとしてお持ち帰りいただけます。', translatable: true },
      { key: 'jyuzu_heading_course', label: '「コース説明」見出し', defaultValue: 'コース説明', translatable: true },
      { key: 'jyuzu_course_desc', label: 'コース説明 補足文', defaultValue: '天然石・天然木の組成は、コースごとに以下のようになります。', translatable: true },
      { key: 'jyuzu_heading_flow', label: '「体験の流れ」見出し', defaultValue: '体験の流れ', translatable: true },
      { key: 'jyuzu_heading_fees', label: '「開催日・料金」見出し', defaultValue: '開催日・料金', translatable: true },
      { key: 'jyuzu_days', label: '開催日', defaultValue: '毎日開催（法要時は中止となる場合があります）', translatable: true },
      { key: 'jyuzu_hours_summer', label: '体験時間（4月〜10月）', defaultValue: '4月〜10月：9:00〜15:00', translatable: true },
      { key: 'jyuzu_hours_winter', label: '体験時間（11月〜3月）', defaultValue: '11月〜3月：9:00〜14:00', translatable: true },
      { key: 'jyuzu_fee',  label: '体験料', defaultValue: '2,000円〜（使用素材により異なります）', translatable: true },
      { key: 'jyuzu_time', label: '所要時間', defaultValue: '30分〜1時間（個人差があります）', translatable: true },
      { key: 'jyuzu_capacity', label: '体験人数', defaultValue: '1名〜20名まで', translatable: true },
      { key: 'jyuzu_target', label: '対象', defaultValue: '小学生以上（小学生は保護者同伴）', translatable: true },
      { key: 'jyuzu_place', label: '受付場所', defaultValue: '大黒天堂窓口', translatable: true },
      { key: 'jyuzu_group_note_label', label: '団体案内の見出し', defaultValue: '団体のご案内', translatable: true },
      { key: 'jyuzu_group_note', label: '団体のご案内 補足', multiline: true, defaultValue: '数珠づくり体験、団体のご予約も承っております。20名様を超える場合は、ご相談ください。', translatable: true },
      {
        key: 'jyuzu_flow', label: '体験の流れ', type: 'list',
        listFields: [{ key: 'title', label: 'ステップ名' }, { key: 'text', label: '説明', multiline: true }],
        defaultValue: J([
          { title: '好きな珠を選ぶ', text: '天然石・天然木をご自由に組み合わせてお選びいただけます。' },
          { title: '数珠を作る', text: 'スタッフが丁寧にサポートしますので、どなたでも簡単にお作りいただけます。' },
          { title: 'ご祈願', text: '僧侶がご祈願し、お守りとして当日お持ち帰りいただけます。' },
        ]),
        translatable: true,
        defaultValueEn: J([
          { title: 'Choose Your Beads', text: 'Freely combine natural stone and wood beads to your liking.' },
          { title: 'Make Your Bracelet', text: 'Our staff will guide you carefully, so anyone can make one easily.' },
          { title: 'Blessing', text: 'A priest will bless it, and you can take it home the same day as an omamori charm.' },
        ]),
      },
      {
        key: 'jyuzu_samples', label: 'サンプル（コース）', type: 'list',
        listFields: [{ key: 'course', label: 'コース名' }, { key: 'price', label: '価格' }, { key: 'desc', label: 'キャッチコピー' }],
        defaultValue: J([
          { course: 'Aコース', price: '2,000円', desc: '天然木で作るスタンダードな数珠' },
          { course: 'Bコース', price: '4,000円', desc: '天然石と天然木の個性あふれる数珠' },
          { course: 'Cコース', price: '6,000円', desc: '天然石のみで作る特別な数珠' },
        ]),
        translatable: true,
        defaultValueEn: J([
          { course: 'Course A', price: '¥2,000', desc: 'A standard bracelet made of natural wood' },
          { course: 'Course B', price: '¥4,000', desc: 'A distinctive bracelet mixing natural stone and wood' },
          { course: 'Course C', price: '¥6,000', desc: 'A special bracelet made entirely of natural stone' },
        ]),
      },
      {
        key: 'jyuzu_materials', label: '珠の素材', type: 'list',
        listFields: [{ key: 'name', label: '素材名' }, { key: 'desc', label: '説明', multiline: true }],
        defaultValue: J([
          { name: '天然木', desc: '軽くて使いやすい木の珠。温かみのある手触りが特徴です。' },
          { name: '天然石', desc: '色とりどりの天然石の珠。お好みの色でお選びいただけます。' },
        ]),
        translatable: true,
        defaultValueEn: J([
          { name: 'Natural Wood', desc: 'Lightweight, easy-to-wear wooden beads, known for their warm texture.' },
          { name: 'Natural Stone', desc: 'Colorful natural stone beads, available in your favorite colors.' },
        ]),
      },
      { key: 'jyuzu_heading_materials', label: '「選べる珠」見出し', defaultValue: '選べる珠', translatable: true },
      { key: 'jyuzu_materials_hint', label: '選べる珠 補足（タップ案内）', defaultValue: '珠をタップすると説明が表示されます', translatable: true },
      { key: 'jyuzu_materials_note', label: '選べる珠 注意書き', defaultValue: '珠の種類は季節・入荷状況により変わります。当日の受付窓口でご確認ください。', translatable: true },
      {
        key: 'jyuzu_stones', label: '選べる珠：天然石（写真は変更できません。並び順・追加削除すると写真がずれるため注意）', type: 'list',
        listFields: [{ key: 'name', label: '石の名前' }, { key: 'desc', label: '説明', multiline: true }],
        defaultValue: J([
          { name: '水晶', desc: '浄化作用があり、邪気を払い、災難を防ぐとされる万能の石です。' },
          { name: '紅水晶', desc: '内面の美しさを輝かせるご利益があるとされています。' },
          { name: 'ラピスラズリ', desc: '知性・直観力を高め、幸運を引き寄せるとされています。' },
          { name: 'アメジスト', desc: 'マイナスエネルギーをプラスに導くご利益があるとされる紫の石です。' },
          { name: 'メノウ', desc: '健康や長寿、子宝をもたらすとされる石です。' },
          { name: 'ピンクタイガーアイ', desc: '仕事運・恋愛運・金運アップのご利益があるとされています。' },
          { name: 'ゴールドシルバータイガーアイ', desc: '視野を広げ、正しい判断と行動で成功へと導くとされています。' },
          { name: 'トラメ石', desc: '決断力・行動力を高めるとされる石です。' },
          { name: '赤トラメ石', desc: '幸運を招き、霊力を授けるとされる石です。' },
          { name: 'ライトブルータイガーアイ', desc: '冷静さや判断力を高めるとされるタイガーアイの一種です。' },
          { name: 'ミックスタイガーアイ', desc: '成功や勝利、チャンスをつかむご利益があるとされています。' },
          { name: 'パープルキャッツアイ', desc: '直感力を研ぎ澄まし、判断力を強めるとされる石です。' },
          { name: 'ピーチ', desc: '心と体のバランスを整えるとされる石です。' },
          { name: '茶金石', desc: '精神を安定させ、心の疲れを癒すとされる石です。' },
          { name: '紫金石', desc: '善い人や物、チャンスとの出会いを導くとされる石です。' },
          { name: 'ハウライト', desc: '厄除け効果があり、精神の安定・浄化、意志を強くするとされています。' },
          { name: 'エンジェライト', desc: 'ネガティブな感情を浄化し、優しさと癒しをもたらすとされています。' },
          { name: 'カーネリアン', desc: '気力アップ・体を丈夫にし、迷いを断ち切るとされる石です。' },
          { name: 'オニキス', desc: '邪気祓い・厄除け・魔除けの効果があるとされる石です。' },
          { name: 'インド翡翠', desc: '失った気力を回復させ、強いパワーで物事を成し遂げるとされています。' },
          { name: 'プラム', desc: '気品と落ち着きをもたらすとされる、深みのある色合いの石です。' },
        ]),
        translatable: true,
        defaultValueEn: J([
          { name: 'Crystal', desc: 'An all-purpose stone said to purify, ward off negative energy, and prevent misfortune.' },
          { name: 'Rose Quartz', desc: 'Said to bring out inner beauty.' },
          { name: 'Lapis Lazuli', desc: 'Said to enhance intelligence and intuition, drawing good fortune.' },
          { name: 'Amethyst', desc: 'A purple stone said to turn negative energy into positive.' },
          { name: 'Agate', desc: 'Said to bring health, longevity, and blessings of children.' },
          { name: 'Pink Tiger Eye', desc: 'Said to boost career, romance, and financial fortune.' },
          { name: 'Gold Silver Tiger Eye', desc: 'Said to broaden perspective and lead to success through sound judgment and action.' },
          { name: 'Torame Stone', desc: 'Said to strengthen decisiveness and initiative.' },
          { name: 'Red Torame Stone', desc: 'Said to invite good fortune and bestow spiritual power.' },
          { name: 'Light Blue Tiger Eye', desc: 'A type of tiger eye said to enhance calmness and judgment.' },
          { name: 'Mixed Tiger Eye', desc: 'Said to bring success, victory, and the ability to seize opportunity.' },
          { name: 'Purple Cat\'s Eye', desc: 'Said to sharpen intuition and strengthen judgment.' },
          { name: 'Peach', desc: 'Said to balance mind and body.' },
          { name: 'Bronzite', desc: 'Said to stabilize the spirit and heal mental fatigue.' },
          { name: 'Purple Sunstone', desc: 'Said to bring encounters with good people, things, and opportunities.' },
          { name: 'Howlite', desc: 'Said to ward off misfortune, stabilize and purify the spirit, and strengthen willpower.' },
          { name: 'Angelite', desc: 'Said to purify negative emotions and bring gentleness and healing.' },
          { name: 'Carnelian', desc: 'Said to boost vitality, strengthen the body, and cut through hesitation.' },
          { name: 'Onyx', desc: 'Said to ward off negative energy and misfortune.' },
          { name: 'Indian Jade', desc: 'Said to restore lost energy and accomplish tasks with strong power.' },
          { name: 'Plum', desc: 'A deeply colored stone said to bring elegance and composure.' },
        ]),
      },
      {
        key: 'jyuzu_woods', label: '選べる珠：天然木（写真は変更できません。並び順・追加削除すると写真がずれるため注意）', type: 'list',
        listFields: [{ key: 'name', label: '木の名前' }, { key: 'desc', label: '説明', multiline: true }],
        defaultValue: J([
          { name: 'けやき', desc: '古くから神木として親しまれ、成長・発展の象徴とされる木材です。' },
          { name: '黒檀', desc: '高級木材として知られ、魔除け・厄除けのご利益があるとされます。' },
          { name: '紫檀', desc: '気品ある紫色が特徴で、健康長寿のご利益があるとされています。' },
          { name: '星月菩提樹', desc: '表面の斑点が星と月に見えることからその名がつき、縁結びのご利益で知られます。' },
          { name: '梅', desc: '「梅は百花の魁」といわれ、開運・厄除けの木として親しまれています。' },
          { name: 'つげ', desc: '緻密で丈夫な木質が特徴で、印材にも使われる縁起の良い木材です。' },
          { name: '緑壇', desc: '爽やかな緑色が特徴で、癒やしと安らぎをもたらすとされています。' },
          { name: '鉄刀木', desc: '硬く丈夫な木質で知られ、魔除け・厄除けのご利益があるとされます。' },
          { name: 'シャム柿', desc: '縞模様が美しい銘木で、独特の風合いを楽しめる木材です。' },
          { name: '鉄刀木（ツヤ有）', desc: '艶やかに仕上げられた鉄刀木の珠。硬く丈夫な木質で、魔除け・厄除けのご利益があるとされます。' },
          { name: '梅（ツヤ有）', desc: '艶やかに仕上げられた梅の珠。「梅は百花の魁」といわれ、開運・厄除けの木として親しまれています。' },
          { name: 'つげ（ツヤ有）', desc: '艶やかに仕上げられたつげの珠。緻密で丈夫な木質が特徴で、印材にも使われる縁起の良い木材です。' },
          { name: '椰', desc: '椰子の実を使った、素朴な模様が魅力の木材です。' },
        ]),
        translatable: true,
        defaultValueEn: J([
          { name: 'Zelkova', desc: 'Long cherished as a sacred tree, symbolizing growth and development.' },
          { name: 'Ebony', desc: 'A prized luxury wood said to ward off evil and misfortune.' },
          { name: 'Rosewood', desc: 'Known for its elegant purple hue and blessings of health and longevity.' },
          { name: 'Bodhi Seed (Star & Moon)', desc: 'Named for surface spots resembling stars and the moon, known for blessings of good relationships.' },
          { name: 'Plum Wood', desc: 'Known as "the first of a hundred flowers," cherished as a tree of good fortune and warding off misfortune.' },
          { name: 'Boxwood', desc: 'A fine, durable wood also used for seals — an auspicious material.' },
          { name: 'Green Ebony', desc: 'Known for its refreshing green color, said to bring healing and peace.' },
          { name: 'Tagayasan', desc: 'A hard, durable wood said to ward off evil and misfortune.' },
          { name: 'Siamese Ebony', desc: 'A prized wood with beautiful striped grain and a distinctive texture.' },
          { name: 'Tagayasan (Polished)', desc: 'Polished tagayasan beads — a hard, durable wood said to ward off evil and misfortune.' },
          { name: 'Plum Wood (Polished)', desc: 'Polished plum wood beads — "the first of a hundred flowers," a tree of good fortune and warding off misfortune.' },
          { name: 'Boxwood (Polished)', desc: 'Polished boxwood beads — a fine, durable wood also used for seals, an auspicious material.' },
          { name: 'Coconut Wood', desc: 'Made from coconut shell, prized for its rustic, distinctive grain.' },
        ]),
      },
      { key: 'jyuzu_heading_notes', label: '「ご注意・持ち物」見出し', defaultValue: 'ご注意・持ち物', translatable: true },
      {
        key: 'jyuzu_notes', label: 'ご注意・持ち物', type: 'list',
        listFields: [{ key: 'text', label: '項目', multiline: true }],
        defaultValue: J([
          { text: '数珠はすべてブレスレットタイプです。' },
          { text: '参拝料（拝観料）は別途お求めください。' },
          { text: '僧侶がご祈祷したものを当日お守りとしてお持ち帰りいただけます。僧侶が不在の場合、後日ご祈祷後郵送いたします（郵送料は当寺負担）。' },
          { text: '団体でお越しの際は事前にお電話ください。' },
        ]),
        translatable: true,
        defaultValueEn: J([
          { text: 'All bracelets are wrist-worn style.' },
          { text: 'Please pay the visiting admission fee separately.' },
          { text: 'A priest blesses your bracelet, which you take home the same day as an omamori charm. If no priest is available, it will be blessed later and mailed to you (postage covered by the temple).' },
          { text: 'For group visits, please call in advance.' },
        ]),
      },
      { key: 'jyuzu_cta_heading', label: 'CTA見出し', defaultValue: '数珠づくり体験のご予約', translatable: true },
      { key: 'jyuzu_cta_sub', label: '予約ボタン下の説明文', defaultValue: '毎日開催しております。団体でお越しの際は事前にお電話ください。', translatable: true },
    ],
  },
  {
    section: '数珠作り体験ギャラリー',
    href: '/experience/jyuzu',
    fields: [
      { key: 'jyuzu_heading_instagram', label: '「数珠作り体験ギャラリー」見出し（数珠づくり体験ページの「選べる珠」セクション内に表示）', defaultValue: '数珠作り体験ギャラリー', translatable: true },
      { key: 'jyuzu_instagram_hint', label: '「数珠作り体験ギャラリー」補足文', multiline: true, defaultValue: '「#中禅寺立木観音ギャラリー」「#数珠づくり体験」のハッシュタグをつけて投稿すると、こちらでご紹介させていただくことがあります。', translatable: true, defaultValueEn: 'Posts tagged with both "#中禅寺立木観音ギャラリー" and "#数珠づくり体験" may be featured here.' },
      {
        key: 'jyuzu_instagram_urls', label: 'Instagram投稿URL一覧（掲載する投稿のURLを追加・削除できます）', type: 'list',
        listFields: [{ key: 'url', label: 'Instagram投稿URL（例: https://www.instagram.com/p/xxxxxxxxxxx/）' }],
        defaultValue: '[]',
      },
    ],
  },
  {
    section: 'トップページ',
    href: '/',
    fields: [
      { key: 'hero_en', label: '英語サブタイトル', hint: '背景の写真・動画は「トップページ編集」（/admin/top-page）からアップロードしてください。', defaultValue: 'Nikkozan Chuzenji Temple' },
      { key: 'hero_title', label: 'キャッチコピー（改行可・Enterで改行）', multiline: true, defaultValue: '中禅寺湖畔に佇む\n祈りと巡礼の寺', translatable: true },
      { key: 'top_sns_heading', label: 'SNSバナーの見出し', defaultValue: '公式SNSでも最新情報を発信中', translatable: true },
      { key: 'top_heading_news', label: '「お知らせ」見出し', defaultValue: 'お知らせ', translatable: true },
      { key: 'top_heading_about', label: '「立木観音について」見出し', defaultValue: '立木観音について', translatable: true },
      {
        key: 'top_about_cards', label: 'カード（歴史・拝観料金・境内案内・花ごよみ・年間行事の順、5件固定）', type: 'list',
        listFields: [{ key: 'label', label: 'タイトル' }, { key: 'desc', label: '説明' }],
        defaultValue: J([
          { label: '立木観音の歴史', desc: '歴史と縁起' },
          { label: '拝観料金', desc: '拝観料・各種料金' },
          { label: '境内のご案内', desc: '見どころ・境内マップ' },
          { label: '花ごよみ', desc: '四季折々の花' },
          { label: '年間行事', desc: '法要・行事のご案内' },
        ]),
        translatable: true,
        defaultValueEn: J([
          { label: 'History of Tachiki Kannon', desc: 'History & origins' },
          { label: 'Admission Fees',            desc: 'Admission & other fees' },
          { label: 'Grounds Guide',             desc: 'Highlights & temple map' },
          { label: 'Flower Calendar',           desc: 'Seasonal flowers' },
          { label: 'Annual Events',             desc: 'Services & event information' },
        ]),
      },
      { key: 'top_heading_events', label: '「近日の行事」見出し', defaultValue: '近日の行事', translatable: true },
      { key: 'top_heading_experience', label: '「体験する」セクション見出し', defaultValue: '体験する', translatable: true },
      {
        key: 'top_experience_cards', label: 'カード（1件目＝「祈る」の大きなカード＝御祈願、2〜5件目＝「体験する」の一覧＝数珠づくり・写経・写仏・坐禅の順、5件固定）', type: 'list',
        listFields: [{ key: 'label', label: 'タイトル' }, { key: 'sub', label: '価格・補足' }],
        defaultValue: J([
          { label: '御祈願', sub: '約40分/5,000円～' },
          { label: '数珠づくり体験', sub: '約30分~/2,000円〜' },
          { label: '写経体験', sub: '約15分 / 1,000円' },
          { label: '写仏体験', sub: '約15分/1,000円' },
          { label: '坐禅体験', sub: '約30分 / 2,000円' },
        ]),
        translatable: true,
        defaultValueEn: J([
          { label: 'Prayer Service',           sub: 'Approx. 40 min / From ¥5,000' },
          { label: 'Juzu Bracelet Making',     sub: 'Approx. 30 min~ / From ¥2,000' },
          { label: 'Sutra Copying',            sub: 'Approx. 15 min / ¥1,000' },
          { label: 'Buddhist Image Tracing',   sub: 'Approx. 15 min / ¥1,000' },
          { label: 'Zazen Meditation',         sub: 'Approx. 30 min / ¥2,000' },
        ]),
      },
      { key: 'top_heading_service', label: '「受ける」セクション見出し', defaultValue: '受ける', translatable: true },
      {
        key: 'top_service_cards', label: 'カード（御朱印・授与品通販の順、2件固定。授与品カードには通販サイト／代金引換の2ボタンを表示）', type: 'list',
        listFields: [{ key: 'title', label: 'タイトル' }, { key: 'text', label: '説明文', multiline: true }, { key: 'info', label: '価格・補足' }],
        defaultValue: J([
          { title: '御朱印', text: '中禅寺ならではの御朱印をお受けいただけます。書き入れのほか書き置きもございます。', info: '御朱印代：500円〜' },
          { title: '授与品・通販', text: 'お守り・お札など各種授与品をご用意しております。通販サイトのほか、代金引換でもお求めいただけます。', info: '通販サイト／代金引換からお選びいただけます' },
        ]),
        translatable: true,
        defaultValueEn: J([
          { title: 'Goshuin Stamps',    text: "Receive Chuzenji's own goshuin stamp, either hand-written or pre-inscribed.", info: 'From ¥500' },
          { title: 'Amulets & Mail Order', text: 'Omamori charms, ofuda tablets, and other items are available online or by cash-on-delivery order.', info: 'Choose online shop or cash-on-delivery' },
        ]),
      },
      { key: 'top_heading_gallery', label: '「中禅寺ギャラリー」見出し', hint: '写真・動画の中身は「ギャラリー管理」（/admin/chuzenji/gallery）から追加・編集してください。', defaultValue: '中禅寺ギャラリー', translatable: true },
      { key: 'top_heading_records', label: '「過去の実績」見出し', hint: '記事の中身は「ブログ管理」から追加・編集してください。', defaultValue: '過去の実績', translatable: true },
      { key: 'top_heading_access', label: '「アクセス」見出し', defaultValue: 'アクセス', translatable: true },
      { key: 'access_address', label: '住所', multiline: true, defaultValue: '〒321-1661\n栃木県日光市中宮祠2578', translatable: true },
      { key: 'access_car',     label: '車でのアクセス', multiline: true, defaultValue: '日光宇都宮道路 日光ICより約40分\n（いろは坂経由）', translatable: true },
      { key: 'access_bus',     label: '電車・バスでのアクセス', multiline: true, defaultValue: '東武日光駅よりバスで約50分\n「中禅寺温泉」バス停より徒歩3分', translatable: true },
    ],
  },
  {
    section: '年間行事一覧',
    href: '/annual-events',
    fields: [
      { key: 'annual_events_subtitle', label: '見出し（ヒーロー サブタイトル）', defaultValue: '毎年恒例の法要・行事のご案内', translatable: true },
      {
        key: 'annual_events_list', label: '行事一覧（画像・リンク先は固定・3件）', type: 'list',
        listFields: [
          { key: 'month', label: '月（バッジ表示）' },
          { key: 'date', label: '開催日' },
          { key: 'time', label: '開始時間' },
          { key: 'name', label: '行事名' },
          { key: 'desc', label: '説明', multiline: true },
        ],
        defaultValue: J([
          { month: '6月', date: '6月18日', time: '午前10時〜', name: '観音講・大護摩供・地蔵流し', desc: '毎年6月18日に、ご信徒の皆様にご参列いただいての大法要を執り行います。観音講・波之利大黒天堂大護摩供に続き、中禅寺湖にてお地蔵様を湖上に流す「地蔵流し」を行います。' },
          { month: '8月', date: '8月4日', time: '午前10時〜', name: '船禅頂（ふなぜんじょう）', desc: '日光開山 勝道上人の霊跡を船で巡拝する伝統行事です。中禅寺湖を舞台に、上人が切り開いた修験の道を水上から辿ります。湖上から望む男体山と中禅寺の景観とともに、千二百余年の歴史に思いを馳せる特別な体験です。' },
          { month: '1月', date: '1月1日', time: '午前0時〜', name: '正月元旦特別護摩祈願', desc: '新しい年の始まりにあたり、皆様の一年の無病息災・家内安全・交通安全･開運招福･合格祈願･厄除けなどを祈願する特別な護摩祈祷です。御札は5,000円〜30,000円よりお選びいただけます。事前申し込み・最大5名まで同時申込可。' },
        ]),
        translatable: true,
        defaultValueEn: J([
          { month: 'June', date: 'June 18', time: 'From 10:00 AM', name: 'Kannonko, Grand Goma Fire Ritual & Jizo Nagashi', desc: 'Every June 18, a grand ceremony is held with devotees in attendance. Following the Kannonko service and the grand goma fire ritual at Hashiri Daikokuten Hall, Jizo statues are floated on Lake Chuzenji in the "Jizo Nagashi" ceremony.' },
          { month: 'August', date: 'August 4', time: 'From 10:00 AM', name: 'Funazenjyo (Boat Pilgrimage)', desc: 'A traditional event tracing the sacred sites of Priest Shodo, who opened Nikko, by boat. On Lake Chuzenji, participants retrace the ascetic path he carved out, viewed from the water. A special experience reflecting on over 1,200 years of history amid views of Mt. Nantai and Chuzenji.' },
          { month: 'January', date: 'January 1', time: 'From 12:00 AM', name: 'New Year\'s Day Special Goma Prayer', desc: 'At the start of the new year, a special goma fire prayer for good health, household safety, traffic safety, good fortune, success in exams, and protection from misfortune throughout the year. Ofuda talismans range from ¥5,000 to ¥30,000. Advance application required; up to 5 people per application.' },
        ]),
      },
    ],
  },
  {
    section: '正月元旦特別護摩祈願',
    href: '/annual-events/shogatsu',
    fields: [
      { key: 'shogatsu_subtitle', label: '見出し（ヒーロー サブタイトル）', defaultValue: '毎年1月1日　午前0時より　※事前申し込み必要', translatable: true },
      { key: 'shogatsu_heading_about', label: '「行事について」見出し', defaultValue: '行事について', translatable: true },
      { key: 'shogatsu_about', label: '行事について（説明文）', multiline: true, defaultValue: '正月元旦特別護摩祈願は、新しい年の始まりにあたり、皆様の一年の無病息災・家内安全・開運招福を祈願する特別な護摩祈祷です。元日、僧侶による厳かな護摩焚きとともに、新年の平安と幸福をお祈りいたします。御札は4種類の中からお選びいただき、お申し込み時にお願い事を2つまでお選びいただけます。', translatable: true },
      { key: 'shogatsu_info_date', label: '開催日（カード表示）', defaultValue: '1月1日（毎年）', translatable: true },
      { key: 'shogatsu_info_time', label: '開始時間（カード表示）', defaultValue: '午前0時〜', translatable: true },
      { key: 'shogatsu_info_join', label: '参加（カード表示）', defaultValue: '事前申し込み必要（最大5名まで）', translatable: true },
      { key: 'shogatsu_heading_schedule', label: '「タイムスケジュール」見出し', defaultValue: 'タイムスケジュール', translatable: true },
      {
        key: 'shogatsu_schedule', label: 'タイムスケジュール', type: 'list',
        listFields: [{ key: 'time', label: '時間' }, { key: 'title', label: '行事名' }, { key: 'desc', label: '説明', multiline: true }],
        defaultValue: J([]),
        translatable: true,
        defaultValueEn: J([]),
      },
      { key: 'shogatsu_heading_fees', label: '「御札の種類」見出し', defaultValue: '御札の種類', translatable: true },
      {
        key: 'shogatsu_fees', label: '御札の種類（テーブル・申し込みフォームの選択肢とは別管理）', type: 'list',
        listFields: [{ key: 'price', label: '御祈願料' }, { key: 'size', label: '御札サイズ' }],
        defaultValue: J([
          { price: '5,000円', size: '28㎝' },
          { price: '10,000円', size: '32㎝' },
          { price: '20,000円', size: '38㎝' },
          { price: '30,000円', size: '42.5㎝' },
        ]),
        translatable: true,
        defaultValueEn: J([
          { price: '5,000円', size: '28㎝' },
          { price: '10,000円', size: '32㎝' },
          { price: '20,000円', size: '38㎝' },
          { price: '30,000円', size: '42.5㎝' },
        ]),
      },
      { key: 'shogatsu_heading_notes', label: '「ご参加にあたって」見出し', defaultValue: 'ご参加にあたって', translatable: true },
      {
        key: 'shogatsu_notes', label: 'ご参加にあたって', type: 'list',
        listFields: [{ key: 'text', label: '注意事項', multiline: true }],
        defaultValue: J([
          { text: '事前の申し込みが必要です。1回のお申し込みで最大5名様までまとめてお申し込みいただけます。' },
          { text: '御札は5,000円（28㎝）・10,000円（32㎝）・20,000円（38㎝）・30,000円（42.5㎝）よりお選びいただけます。' },
          { text: 'お申し込みは、申し込みフォーム内の代金引換（代引き）またはECサイトよりお選びいただけます。代引きの場合、送料・手数料は別途ご負担いただきます。' },
        ]),
        translatable: true,
        defaultValueEn: J([
          { text: 'Advance application is required. A single application can cover up to 5 people.' },
          { text: 'Ofuda talismans are available in 4 sizes: ¥5,000 (28cm), ¥10,000 (32cm), ¥20,000 (38cm), and ¥30,000 (42.5cm).' },
          { text: 'You may apply via cash on delivery or the online shop within the application form. For cash on delivery, shipping and handling fees are charged separately.' },
        ]),
      },
      { key: 'shogatsu_cta_heading', label: 'CTA見出し', defaultValue: '正月元旦特別護摩祈願 お申し込み', translatable: true },
      { key: 'shogatsu_cta_text', label: 'CTA説明文（改行はそのまま反映されます）', multiline: true, defaultValue: '最大5名まで同時にお申し込みいただけます。\n代金引換（代引き）・ECサイトのいずれからもお申し込みいただけます。', translatable: true },
    ],
  },
  {
    section: '観音講・大護摩供・地蔵流し',
    href: '/annual-events/kannonko',
    fields: [
      { key: 'kannonko_subtitle', label: '見出し（ヒーロー サブタイトル）', defaultValue: '毎年6月18日　午前10時より', translatable: true },
      { key: 'kannonko_heading_about', label: '「行事について」見出し', defaultValue: '行事について', translatable: true },
      { key: 'kannonko_about', label: '行事について（説明文）', multiline: true, defaultValue: '毎年6月18日、日光山中禅寺 立木観音では、ご信徒・一般参拝者の皆様をお迎えして年に一度の大法要を執り行います。観音講・大護摩供・地蔵流しと三つの行事が続き、中禅寺湖の豊かな自然のなかで千二百余年の祈りが受け継がれます。', translatable: true, defaultValueEn: 'Every year on June 18th, Chuzenji Tachiki Kannon welcomes devotees and visitors for its once-a-year grand ceremony. Three rites follow in succession — Kannon-ko, the Grand Goma Ritual, and Jizo-nagashi — carrying on twelve hundred years of prayer amid the rich nature of Lake Chuzenji.' },
      { key: 'kannonko_info_date', label: '開催日（カード表示）', defaultValue: '6月18日（毎年）', translatable: true },
      { key: 'kannonko_info_time', label: '開始時間（カード表示）', defaultValue: '午前10時〜', translatable: true },
      { key: 'kannonko_info_join', label: '参列（カード表示）', defaultValue: '申込者のみ', translatable: true, defaultValueEn: 'Advance application required' },
      { key: 'kannonko_info_fee', label: '参加費（カード表示）', defaultValue: '3,000円（お札代込み）', translatable: true, defaultValueEn: '¥3,000 (includes ofuda talisman)' },
      { key: 'kannonko_heading_schedule', label: '「タイムスケジュール」見出し', defaultValue: 'タイムスケジュール', translatable: true },
      {
        key: 'kannonko_schedule', label: 'タイムスケジュール', type: 'list',
        listFields: [{ key: 'time', label: '時間' }, { key: 'title', label: '行事名' }, { key: 'desc', label: '説明', multiline: true }],
        defaultValue: J([
          { time: '10:00', title: '観音講（法要）', desc: '18日は観音様の縁日です。大慈大悲の観音様の慈悲にすがり、日光の観音浄土といわれますここ中禅寺におきまして、ご参列頂きました皆様のご先祖様のご供養を執り行います。' },
          { time: '11:15', title: '波之利大黒天 大護摩供', desc: '波之利大黒天の大護摩供を厳修いたします。家内安全・商売繁盛・交通安全・湖上安全・開運・厄除け・安産など、皆様の願いをご祈願いたします。' },
          { time: '午後', title: '地蔵流し', desc: '遊覧船に乗り、中禅寺湖上にて「地蔵流し」を行います。「地蔵流し」とは、お地蔵様の絵姿のある御札を１枚ずつ湖に投じて、ご先祖様の冥福を祈る、大変珍しい行事です。' },
        ]),
        translatable: true,
        defaultValueEn: J([
          { time: '10:00', title: 'Kannon-ko (Ceremony)', desc: 'The 18th is Kannon\'s sacred day. Calling upon the great compassion of Kannon, we perform memorial rites for the ancestors of all who attend, here at Chuzenji, said to be Nikko\'s pure land of Kannon.' },
          { time: '11:15', title: 'Hashiri-Daikokuten Grand Goma Ritual', desc: 'A grand goma fire ritual is solemnly held for Hashiri-Daikokuten. We pray for the wishes of all who attend — household safety, business prosperity, traffic safety, safety on the lake, good fortune, protection from misfortune, and safe childbirth.' },
          { time: 'Afternoon', title: 'Jizo-nagashi (Jizo Release)', desc: 'We board a sightseeing boat and perform "Jizo-nagashi" on Lake Chuzenji. In this rare and unique ceremony, ofuda bearing the image of Jizo are cast into the lake one by one, praying for the repose of ancestors.' },
        ]),
      },
      { key: 'kannonko_heading_gallery', label: '「行事の様子」見出し', defaultValue: '行事の様子', translatable: true },
      { key: 'kannonko_heading_notes', label: '「ご参列にあたって」見出し', defaultValue: 'ご参列にあたって', translatable: true },
      {
        key: 'kannonko_notes', label: 'ご参列にあたって', type: 'list',
        listFields: [{ key: 'text', label: '注意事項', multiline: true }],
        defaultValue: J([
          { text: '事前のお申し込みが必要です。ご希望の方は申し込みフォームよりお申し込みください。' },
          { text: '動きやすい服装でお越しください。中禅寺湖周辺は天候が変わりやすいため、羽織るものをお持ちいただくことをお勧めします。' },
          { text: '参加費はお一人様3,000円（お札代込み）です。お支払いは当日・現地払い、または代金引換（郵送、送料1,000円〜）からお選びいただけます。' },
          { text: '詳細・変更がある場合は当サイトにてお知らせいたします。' },
        ]),
        translatable: true,
        defaultValueEn: J([
          { text: 'Advance application is required. Please apply via the application form if you wish to attend.' },
          { text: 'Please wear comfortable, easy-to-move-in clothing. Weather around Lake Chuzenji can change quickly, so we recommend bringing something to layer on top.' },
          { text: 'The participation fee is ¥3,000 per person (includes the ofuda talisman). You may pay on the day, on site, or choose cash on delivery (shipped, from ¥1,000 shipping).' },
          { text: 'Any details or changes will be announced on this website.' },
        ]),
      },
      { key: 'kannonko_cta_heading', label: 'CTA見出し', defaultValue: '御札のお申し込み', translatable: true },
      { key: 'kannonko_cta_text', label: 'CTA説明文（改行はそのまま反映されます）', multiline: true, defaultValue: '参加費（お札代込み）はお一人様3,000円。\n事前に申し込みフォームよりお申し込みください。\nお支払いは当日・現地払い、または代金引換（郵送）からお選びいただけます。', translatable: true, defaultValueEn: 'The participation fee (including the ofuda talisman) is ¥3,000 per person.\nPlease apply in advance via the application form.\nYou may pay on the day, on site, or choose cash on delivery (shipped).' },
      { key: 'kannonko_apply_notice_ofuda', label: '申込フォーム 注意事項（⛩️ 御札・参加費）', multiline: true, defaultValue: 'お申し込みの方には大護摩供にてお焚き上げする御札をお授けいたします。参加費はお一人様3,000円（お札代込み）です。', translatable: true, defaultValueEn: 'Applicants will receive an ofuda talisman burned in the grand goma fire ritual. The participation fee is ¥3,000 per person (includes the ofuda talisman).' },
      { key: 'kannonko_apply_notice_shipping', label: '申込フォーム 注意事項（🚚 代金引換の送料）', multiline: true, defaultValue: '代金引換をご希望の場合、お札は郵送いたします。送料は送り先1件につき1,000円です。', translatable: true, defaultValueEn: 'If you choose cash on delivery, the ofuda talisman will be shipped. Shipping is ¥1,000 per destination.' },
      { key: 'kannonko_apply_notice_payment', label: '申込フォーム 注意事項（💴 お支払い方法）', multiline: true, defaultValue: 'お支払いは当日・現地でのお支払い、または代金引換（郵送）からお選びいただけます。', translatable: true, defaultValueEn: 'Payment can be made on the day, on site, or by cash on delivery (shipped).' },
      { key: 'kannonko_apply_notice_family', label: '申込フォーム 注意事項（👨‍👩‍👧‍👦 ご家族・団体）', multiline: true, defaultValue: 'ご家族・団体でお申し込みの場合は、代表者様の情報に加えて申込者①〜⑩に人数分ご記入ください。', translatable: true, defaultValueEn: "If applying as a family or group, please fill in applicants ①–⑩ in addition to the representative's information." },
    ],
  },
  {
    section: '船禅頂',
    href: '/annual-events/funazento',
    fields: [
      { key: 'funazento_subtitle', label: '見出し（ヒーロー サブタイトル）', defaultValue: '毎年8月4日　午前10時より　※事前申し込み必要', translatable: true },
      { key: 'funazento_heading_about', label: '「行事について」見出し', defaultValue: '行事について', translatable: true },
      { key: 'funazento_about', label: '行事について（説明文）', multiline: true, defaultValue: '船禅頂（ふなぜんじょう）は、日光山を開いた勝道上人（737〜817）が中禅寺湖を舟で渡り、湖上から霊峰・男体山を遙拝したという故事に由来する伝統行事です。毎年8月4日、中禅寺湖を舞台に、上人が切り開いた修験の道を水上から辿ります。湖上から望む男体山と中禅寺の景観とともに、千二百余年の歴史に思いを馳せる特別な体験で、歌が浜を出発し、各地を巡りながら千手堂に向かい、戻ってくる特別なルートです。', translatable: true, defaultValueEn: 'Funazenjo is a traditional event rooted in the story of Priest Shodo (737–817), who opened Nikkozan and crossed Lake Chuzenji by boat to venerate the sacred Mt. Nantai from the water. Every year on August 4, participants retrace by boat the ascetic path he once carved out across Lake Chuzenji. Taking in the views of Mt. Nantai and Chuzenji from the lake, it is a special experience reflecting on over 1,200 years of history — a unique route departing from Utagahama, circling past various sites toward the Senju-do Hall, and returning.' },
      { key: 'funazento_info_date', label: '開催日（カード表示）', defaultValue: '8月4日（毎年）', translatable: true },
      { key: 'funazento_info_time', label: '開始時間（カード表示）', defaultValue: '午前10時〜', translatable: true },
      { key: 'funazento_info_join', label: '参加（カード表示）', defaultValue: '事前申し込み必要', translatable: true },
      { key: 'funazento_info_fee', label: '参加費（カード表示）', defaultValue: '5,000円（小中学生4,000円）', translatable: true, defaultValueEn: '¥5,000 (¥4,000 for students)' },
      { key: 'funazento_heading_schedule', label: '「タイムスケジュール」見出し', defaultValue: 'タイムスケジュール', translatable: true },
      {
        key: 'funazento_schedule', label: 'タイムスケジュール', type: 'list',
        listFields: [{ key: 'time', label: '時間' }, { key: 'title', label: '行事名' }, { key: 'desc', label: '説明', multiline: true }],
        defaultValue: J([
          { time: '9:00', title: '受付開始', desc: '' },
          { time: '10:00', title: '開式の儀', desc: '執行挨拶、律院住職の挨拶' },
          { time: '10:15', title: '石護摩壇不動尊祈願', desc: '' },
          { time: '10:20', title: '浜地蔵供養', desc: '' },
          { time: '10:30', title: '歌ヶ浜出発', desc: '勝道上人が弟子と共に霊場を巡拝した場所を巡り読経をあげます' },
          { time: '10:45', title: '八丁出島 寺ヶ崎 薬師堂跡法要', desc: '読誦法要' },
          { time: '11:00', title: '松﨑 日輪寺跡', desc: '読誦法要' },
          { time: '11:15', title: '上野島', desc: '勝道上人、天海大僧正墓供養' },
          { time: '11:30', title: '巡拝', desc: '上陸できないため、乗船したまま読経を行う' },
          { time: '11:50', title: '千手ヶ浜桟橋到着', desc: '下船して千手堂へ' },
          { time: '12:10', title: '千手ヶ浜 千手堂法要', desc: '' },
          { time: '12:50', title: '千手ヶ浜 不動尊法要', desc: '' },
          { time: '13:10', title: '千手ヶ浜桟橋から乗船し、立木観音へ', desc: '乗船中に昼食' },
          { time: '14:00', title: '立木観音桟橋到着　下船', desc: '' },
          { time: '14:15', title: '本堂参拝', desc: '' },
          { time: '14:30', title: '五大堂参拝し、御札を「大黒天堂」にて授与', desc: '' },
        ]),
        translatable: true,
        defaultValueEn: J([
          { time: '9:00', title: 'Reception Opens', desc: '' },
          { time: '10:00', title: 'Opening Ceremony', desc: 'Remarks by the officiant and the head priest of Ritsu-in.' },
          { time: '10:15', title: 'Fudo Myo-o Prayer at the Stone Goma Altar', desc: '' },
          { time: '10:20', title: 'Memorial Service for the Shoreline Jizo', desc: '' },
          { time: '10:30', title: 'Departure from Utagahama', desc: 'Sutras are chanted while visiting sites once visited by Priest Shodo and his disciples on their pilgrimage.' },
          { time: '10:45', title: 'Memorial Service at the Site of Yakushido Hall, Terugasaki, Hatcho Peninsula', desc: 'Sutra recitation service.' },
          { time: '11:00', title: 'Site of Nichirin-ji Temple, Matsuzaki', desc: 'Sutra recitation service.' },
          { time: '11:15', title: 'Ueno-jima Island', desc: 'Memorial service at the graves of Priest Shodo and Great Priest Tenkai.' },
          { time: '11:30', title: 'Pilgrimage', desc: 'As landing is not possible here, sutras are chanted while remaining aboard the boat.' },
          { time: '11:50', title: 'Arrival at Senjugahama Pier', desc: 'Disembark and proceed to Senju-do Hall.' },
          { time: '12:10', title: 'Memorial Service at Senju-do Hall, Senjugahama', desc: '' },
          { time: '12:50', title: 'Fudo Myo-o Memorial Service, Senjugahama', desc: '' },
          { time: '13:10', title: 'Board the Boat at Senjugahama Pier bound for Tachiki Kannon', desc: 'Lunch is served aboard the boat.' },
          { time: '14:00', title: 'Arrival at Tachiki Kannon Pier, Disembark', desc: '' },
          { time: '14:15', title: 'Visit to the Main Hall', desc: '' },
          { time: '14:30', title: 'Visit Godaido Hall; Ofuda Talismans Distributed at Daikokuten Hall', desc: '' },
        ]),
      },
      { key: 'funazento_heading_map', label: '「船禅頂ルート図」見出し', defaultValue: '船禅頂ルート図', translatable: true, defaultValueEn: 'Boat Zenjo Route Map' },
      { key: 'funazento_heading_gallery', label: '「行事の様子」見出し', defaultValue: '行事の様子', translatable: true },
      { key: 'funazento_heading_notes', label: '「ご参加にあたって」見出し', defaultValue: 'ご参加にあたって', translatable: true },
      {
        key: 'funazento_notes', label: 'ご参加にあたって', type: 'list',
        listFields: [{ key: 'text', label: '注意事項', multiline: true }],
        defaultValue: J([
          { text: '事前の申し込みが必要です。定員になり次第締め切りますので、お早めにお申し込みください。' },
          { text: '参加費は大人5,000円・小中学生4,000円です。当日ご参加されない場合も、御札代として4,000円を頂戴いたします。お支払いは当日・現地にてお受けいたします。' },
          { text: '動きやすく濡れても構わない服装でお越しください。湖上は気温が低い場合がありますので、上に羽織るものをご持参ください。' },
          { text: '天候・状況により内容が変更・中止となる場合がございます。詳細はお電話にてご確認ください。' },
        ]),
        translatable: true,
        defaultValueEn: J([
          { text: 'Advance application is required. Applications close once capacity is reached, so please apply early.' },
          { text: 'The participation fee is ¥5,000 for adults and ¥4,000 for elementary/junior high school students. Even if you do not join in person on the day, a fee of ¥4,000 applies for the ofuda talisman. Payment is accepted on the day, on site.' },
          { text: 'Please wear clothing you can move in easily and that can get wet. Temperatures on the lake can be cool, so please bring something to layer on top.' },
          { text: 'Content may change or be cancelled depending on weather and conditions. Please call for details.' },
        ]),
      },
      { key: 'funazento_cta_heading', label: 'CTA見出し', defaultValue: '船禅頂 お申し込み', translatable: true },
      { key: 'funazento_cta_text', label: 'CTA説明文（改行はそのまま反映されます）', multiline: true, defaultValue: '定員になり次第締め切ります。\n御札授与あり・お支払いは当日現地にて。', translatable: true },
      { key: 'funazento_apply_notice_ofuda', label: '申込フォーム 注意事項（⛩️ 御札）', multiline: true, defaultValue: 'お申し込みの方には御札をお授けいたします。', translatable: true, defaultValueEn: 'Applicants will receive an ofuda talisman.' },
      { key: 'funazento_apply_notice_fee', label: '申込フォーム 注意事項（💰 参加費）', multiline: true, defaultValue: '参加費は大人5,000円・小中学生4,000円です。当日ご参加されない場合も、御札代として4,000円を頂戴いたします。', translatable: true, defaultValueEn: 'The participation fee is ¥5,000 for adults and ¥4,000 for elementary/junior high school students. Even if you do not join in person on the day, a fee of ¥4,000 applies for the ofuda talisman.' },
      { key: 'funazento_apply_notice_shipping', label: '申込フォーム 注意事項（🚚 代金引換の送料）', multiline: true, defaultValue: '当日ご参加されない方のお札は代金引換（代引き）にて郵送いたします。送料は送り先1件につき1,000円です。', translatable: true, defaultValueEn: 'For those not attending in person, the ofuda talisman is shipped by cash on delivery. Shipping is ¥1,000 per destination.' },
      { key: 'funazento_apply_notice_payment', label: '申込フォーム 注意事項（💴 お支払い方法）', multiline: true, defaultValue: 'お支払いは当日・現地でのお支払いとなります。事前のお振込みは不要です。', translatable: true, defaultValueEn: 'Payment is due on the day, on site. No advance bank transfer is needed.' },
      { key: 'funazento_apply_notice_capacity', label: '申込フォーム 注意事項（👥 定員）', multiline: true, defaultValue: '定員になり次第締め切ります。お早めにお申し込みください。', translatable: true, defaultValueEn: 'Applications close once capacity is reached. Please apply early.' },
      { key: 'funazento_apply_notice_family', label: '申込フォーム 注意事項（👨‍👩‍👧‍👦 ご家族・団体）', multiline: true, defaultValue: 'ご家族・団体でお申し込みの場合は、代表者様の情報に加えて申込者①〜⑩に人数分ご記入ください。', translatable: true, defaultValueEn: "If applying as a family or group, please fill in applicants ①–⑩ in addition to the representative's information." },
    ],
  },
  {
    section: 'よくある質問',
    href: '/faq',
    fields: [
      { key: 'faq_subtitle', label: '見出し（英字サブタイトル）', defaultValue: 'FAQ' },
      {
        key: 'faq_items', label: 'FAQ一覧', type: 'list',
        listFields: [{ key: 'q', label: '質問', multiline: true }, { key: 'a', label: '回答', multiline: true }],
        defaultValue: J([
          { q: '拝観時間を教えてください。', a: '4月〜10月は8:00〜17:00、11月と3月は9:00〜16:00、12月～２月は午前8時30分〜午後3時30分です。' },
          { q: '拝観料はいくらですか？', a: '大人500円、小中学生200円です。' },
          { q: '障がい者の拝観料の免除、減免はありますか？', a: '障がい者手帳、療育手帳をお持ちであれば、ご来山の際に原本をご提示いただくことで割引になります。ご本人のみ拝観料が大人の方100円、小中学生無料でお参りいただけます。' },
          { q: '御祈願の予約は必要ですか？', a: '事前予約をお勧めしております。当日受付も可能な場合がありますが、混雑時はお断りする場合がございます。' },
          { q: '写経・写仏・数珠づくり体験の予約方法を教えてください。', a: 'ウェブサイトの「体験のご予約はこちら」よりオンラインでご予約いただけます。' },
          { q: '駐車場はありますか？', a: '１０台駐車スペースがございます(予約不可)。満車の場合は、中禅寺温泉周辺の有料駐車場をご利用ください。春・秋の観光シーズンはいろは坂が渋滞します。公共交通機関のご利用をお勧めします。' },
          { q: '御朱印はいただけますか？', a: 'はい、書き入れと書き置きをご用意しております。拝観時間内にお声がけください。' },
          { q: 'ベビーカーや車椅子での参拝はできますか？', a: '境内は段差がある箇所もございます。詳しくは事前にお問い合わせください。' },
          { q: 'お守り・授与品の通販はできますか？', a: 'はい、公式通販サイト（chuzenji.official.ec）にてお求めいただけます。' },
          { q: 'ペットは連れてはいれますか？', a: '入れます。お堂の中に入るにはキャリーバックをご持参いただき、お参りください。' },
        ]),
        translatable: true,
        defaultValueEn: J([
          { q: 'What are the visiting hours?', a: '8:00 AM–5:00 PM from April to October, 9:00 AM–4:00 PM in November and March, and 8:30 AM–3:30 PM from December to February.' },
          { q: 'What is the admission fee?', a: '¥500 for adults, ¥200 for elementary/junior high school students.' },
          { q: 'Is there a discount or fee waiver for visitors with disabilities?', a: 'If you hold a physical disability certificate or a rehabilitation (therapeutic) certificate, please present the original at the time of your visit for a discount. The discount applies to the certificate holder only: ¥100 for adults, and free admission for elementary/junior high school students.' },
          { q: 'Is a reservation required for prayer services?', a: 'Reservations are recommended. Same-day reception may be possible, but may be declined during busy periods.' },
          { q: 'How do I reserve the sutra-copying, Buddha-tracing, or juzu-making experiences?', a: 'You can reserve online via the "Reserve an Experience" link on the website.' },
          { q: 'Is parking available?', a: 'We have parking for 10 vehicles. If full, please use one of the paid parking lots around Chuzenji-Onsen. Irohazaka gets congested during the spring and autumn tourist seasons, so we recommend using public transport.' },
          { q: 'Can I receive a goshuin stamp?', a: 'Yes, both hand-written and pre-inscribed stamps are available. Please ask during visiting hours.' },
          { q: 'Can I visit with a stroller or wheelchair?', a: 'Some areas of the grounds have steps. Please contact us in advance for details.' },
          { q: 'Can I order amulets or other items online?', a: 'Yes, they are available through our official online shop (chuzenji.official.ec).' },
          { q: 'Can I bring my pet?', a: 'Yes, pets are welcome. To enter the halls, please bring a carrier bag for your pet.' },
        ]),
      },
      { key: 'faq_bottom_text', label: '末尾の案内文', defaultValue: '解決しない場合はお気軽にお問い合わせください。', translatable: true },
      { key: 'faq_cta_label', label: 'お問い合わせボタンの文言', defaultValue: 'お問い合わせはこちら', translatable: true },
    ],
  },
]

export default function PagesEditor() {
  const supabase = createClient()
  const [values, setValues] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)

  useEffect(() => {
    const defaults: Record<string, string> = {}
    SECTIONS.forEach(({ fields }) => fields.forEach(f => {
      if (f.defaultValue) defaults[f.key] = f.defaultValue
    }))
    supabase.from('site_content').select('key,value').then(({ data }) => {
      const map: Record<string, string> = { ...defaults }
      data?.forEach(row => { if (row.value) map[row.key] = row.value })
      SECTIONS.forEach(({ fields }) => fields.forEach(f => {
        if (f.type === 'list' && f.requireItemKey) {
          map[f.key] = normalizeStaleList(map[f.key] ?? f.defaultValue, f.defaultValue, f.requireItemKey)
          if (f.translatable) {
            const fallbackEn = f.defaultValueEn ?? '[]'
            map[`${f.key}_en`] = normalizeStaleList(map[`${f.key}_en`] ?? fallbackEn, fallbackEn, f.requireItemKey)
          }
        }
      }))
      setValues(map)
    })
  }, [])

  async function save(key: string) {
    setSaving(key)
    await supabase.from('site_content').upsert({ key, value: values[key] ?? '' }, { onConflict: 'key' })
    setSaving(null)
    setSaved(key)
    setTimeout(() => setSaved(null), 2000)
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-serif text-navy mb-1">固定ページ編集</h1>
      <p className="text-gray-500 text-sm mb-8">変更後は「保存」を押してください。すぐにサイトに反映されます。</p>

      <div className="space-y-10">
        {SECTIONS.map(({ section, href, fields }) => (
          <div key={section}>
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-sm font-medium text-gray-500 tracking-widest uppercase">{section}</h2>
              <a href={href} target="_blank" rel="noopener" className="text-xs text-gold hover:underline">ページを見る →</a>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
              {fields.map((field) => (
                <div key={field.key}>
                  <label className="admin-label">{field.label}</label>
                  {field.type === 'list' ? (
                    <ListEditor
                      value={values[field.key] ?? field.defaultValue}
                      fields={field.listFields}
                      onChange={val => setValues(v => ({ ...v, [field.key]: val }))}
                    />
                  ) : field.multiline ? (
                    <textarea
                      className="admin-input min-h-[100px]"
                      value={values[field.key] ?? ''}
                      placeholder={field.defaultValue}
                      onChange={e => setValues(v => ({ ...v, [field.key]: e.target.value }))}
                    />
                  ) : (
                    <input
                      type="text"
                      className="admin-input"
                      value={values[field.key] ?? ''}
                      placeholder={field.defaultValue}
                      onChange={e => setValues(v => ({ ...v, [field.key]: e.target.value }))}
                    />
                  )}
                  <div className="mt-2 flex justify-end">
                    <button
                      onClick={() => save(field.key)}
                      disabled={saving === field.key}
                      className="btn-primary text-sm px-5 py-2 disabled:opacity-50"
                    >
                      {saving === field.key ? '保存中...' : saved === field.key ? '✓ 保存しました' : '保存'}
                    </button>
                  </div>
                  {field.type === 'list' && field.translatable && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <label className="admin-label text-gray-400">英語訳（未入力の場合は日本語が表示されます）</label>
                      <ListEditor
                        value={values[`${field.key}_en`] ?? field.defaultValueEn ?? '[]'}
                        fields={field.listFields}
                        onChange={val => setValues(v => ({ ...v, [`${field.key}_en`]: val }))}
                      />
                      <div className="mt-2 flex justify-end">
                        <button
                          onClick={() => save(`${field.key}_en`)}
                          disabled={saving === `${field.key}_en`}
                          className="btn-primary text-sm px-5 py-2 disabled:opacity-50"
                        >
                          {saving === `${field.key}_en` ? '保存中...' : saved === `${field.key}_en` ? '✓ 保存しました' : '保存'}
                        </button>
                      </div>
                    </div>
                  )}
                  {'translatable' in field && field.type !== 'list' && field.translatable && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <label className="admin-label text-gray-400">英語訳（未入力の場合は日本語が表示されます）</label>
                      {field.multiline ? (
                        <textarea
                          className="admin-input min-h-[80px]"
                          value={values[`${field.key}_en`] ?? ''}
                          onChange={e => setValues(v => ({ ...v, [`${field.key}_en`]: e.target.value }))}
                        />
                      ) : (
                        <input
                          type="text"
                          className="admin-input"
                          value={values[`${field.key}_en`] ?? ''}
                          onChange={e => setValues(v => ({ ...v, [`${field.key}_en`]: e.target.value }))}
                        />
                      )}
                      <div className="mt-2 flex justify-end">
                        <button
                          onClick={() => save(`${field.key}_en`)}
                          disabled={saving === `${field.key}_en`}
                          className="btn-primary text-sm px-5 py-2 disabled:opacity-50"
                        >
                          {saving === `${field.key}_en` ? '保存中...' : saved === `${field.key}_en` ? '✓ 保存しました' : '保存'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
