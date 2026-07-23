'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import ListEditor, { type ListField } from '@/components/admin/ListEditor'

type TextField = { key: string; label: string; hint?: string; multiline?: boolean; defaultValue?: string; type?: 'text' }
type ListFieldDef = { key: string; label: string; type: 'list'; listFields: ListField[]; defaultValue: string }
type Field = TextField | ListFieldDef
type Section = { section: string; href: string; fields: Field[] }

const J = (v: unknown) => JSON.stringify(v)

const SECTIONS: Section[] = [
  {
    section: '立木観音の歴史',
    href: '/history',
    fields: [
      { key: 'history_subtitle', label: '見出し（サブタイトル）', defaultValue: '日光山中禅寺の由緒と縁起' },
      { key: 'history_heading_founding', label: '「創建の由来」見出し', defaultValue: '創建の由来' },
      { key: 'history_founding_p1', label: '創建の由来（段落1）', multiline: true, defaultValue: '日光山中禅寺は、784年（延暦3年）、勝道上人によって開かれました。勝道上人は日光山を開いた高僧であり、幾多の困難を乗り越えながら男体山に登頂し、山頂で大日如来を感得したとされています。' },
      { key: 'history_founding_p2', label: '創建の由来（段落2）', multiline: true, defaultValue: '中禅寺湖のほとりに建てられた本堂には、上人が湖畔に立つ桂の立木に直接刻んだと伝わる千手観世音菩薩が祀られています。木を切り倒すことなく、立ったままの木に彫り上げたことから「立木観音」と呼ばれ、今日まで人々の信仰を集めてきました。' },
      { key: 'history_heading_timeline', label: '「歴史の流れ」見出し', defaultValue: '歴史の流れ' },
      {
        key: 'history_timeline', label: '歴史の流れ（年表）', type: 'list',
        listFields: [{ key: 'year', label: '年代' }, { key: 'title', label: 'タイトル' }, { key: 'text', label: '説明', multiline: true }],
        defaultValue: J([
          { year: '784年（延暦3年）', title: '勝道上人による開山', text: '勝道上人が中禅寺湖畔に立木観音を刻み、中禅寺を創建。日光山修験道の霊場として栄え始める。' },
          { year: '810年（弘仁元年）', title: '空海（弘法大師）参詣', text: '弘法大師が中禅寺に参詣したと伝わる。真言密教の聖地としての性格が強まる。' },
          { year: '1627年（寛永4年）', title: '天海大僧正による復興', text: '江戸幕府の庇護のもと、天海大僧正によって伽藍が整備・復興される。' },
          { year: '明治時代', title: '外国公使の避暑地として', text: '明治以降、中禅寺湖畔は各国外交官の夏の避暑地として栄え、中禅寺も国際的に知られるようになる。' },
          { year: '現在', title: '関東屈指の観音霊場', text: '関東有数の観音霊場として多くの参拝者が訪れる。坂東三十三観音霊場の第十八番札所にも数えられる。' },
        ]),
      },
      { key: 'history_heading_honzon', label: '「ご本尊」見出し', defaultValue: 'ご本尊・千手観世音菩薩' },
      { key: 'history_honzon', label: 'ご本尊・千手観世音菩薩', multiline: true, defaultValue: 'ご本尊の千手観世音菩薩は、高さ約6メートルに及ぶ大きな仏様です。勝道上人が湖畔の桂の立木に直接刻んだとされ、木は今も根を張ったまま祀られています。千の手で人々のあらゆる願いを救い、千の眼で衆生の苦しみを見守るとされる観音様は、縁結び・病気平癒・学業成就など様々なご利益があるとされています。' },
      { key: 'history_heading_bando', label: '「坂東三十三観音」見出し', defaultValue: '坂東三十三観音 第十八番札所' },
      { key: 'history_bando', label: '坂東三十三観音', multiline: true, defaultValue: '中禅寺立木観音は、関東・東北一円にわたる坂東三十三観音霊場の第十八番札所に数えられています。多くの巡礼者がこの地を訪れ、千手観世音菩薩に手を合わせてきました。' },
    ],
  },
  {
    section: '境内のご案内',
    href: '/grounds',
    fields: [
      { key: 'grounds_subtitle', label: '見出し（ヒーロー サブタイトル）', defaultValue: '見どころ・境内マップ' },
      { key: 'grounds_heading_map', label: '「境内マップ・主な見どころ」見出し', defaultValue: '境内マップ・主な見どころ' },
      { key: 'grounds_map_hint', label: '地図の操作案内文', defaultValue: '地図上のピンをクリックすると各スポットの詳細が見られます' },
      {
        key: 'grounds_spots', label: '主な見どころ', type: 'list',
        listFields: [{ key: 'name', label: '名称' }, { key: 'image', label: '画像パス（例: /images/sanmon.png）' }, { key: 'desc', label: '説明', multiline: true }],
        defaultValue: J([
          { name: '山門', image: '/images/sanmon.png', desc: '境内への入口。拝観受付はこちらで行います。' },
          { name: '鐘楼', image: '/images/toiawase.jpg', desc: '境内に響く梵鐘。時を告げる鐘の音が静かな山の霊気とともに境内に広がります。' },
          { name: '延命水', image: '/images/enmeisui.png', desc: '境内に湧き出る清水。飲むと長寿・延命のご利益があると伝わり、古くから参拝者に親しまれています。' },
          { name: '石護摩壇', image: '/images/ishigomadan.png', desc: 'お護摩はインド伝来の密教の秘法（秘密の教え）で、僧侶が護摩壇に向かい、作法にしたがって仏の智慧の火を焚き、様々な供物を焚き上げ、厄難・災難を払いその加護（成就）を願います。' },
          { name: '客殿・写経体験', image: '/images/kyakuden.png', desc: '写経とは、お経の文字を一文字一文字丁寧に書き写す修行です。文字を書くことで雑念を払い、心を清め、仏様との縁を結ぶとされています。客殿にて写経体験をお受けいただけます。' },
          { name: '御朱印所', image: '/images/hudasyo.png', desc: '御朱印・お守り・各種授与品はこちらでお受けいただけます。' },
          { name: '愛染堂', image: '/images/aizendou.png', desc: '中禅寺湖を背景に佇む愛染堂。良縁成就・縁結び・夫婦和合、愛敬開運のご利益で知られています。' },
          { name: '歌碑', image: '/images/kahi.png', desc: '歌手・俳優の加山雄三氏の楽曲「君といつまでも」の歌碑です。中禅寺湖畔を望むこの地で、多くの方に親しまれています。' },
          { name: 'お水屋', image: '/images/omizuya.png', desc: '参拝前に手や口を清める手水舎です。' },
          { name: '大黒天堂', image: '/images/daikokutendou.png', desc: '家内安全、商売繁盛、交通安全、開運、厄除け、安産等のご利益で知られる秘仏、波之利大黒天をお祀りしている、護摩祈願道場です。' },
          { name: '立木観音堂（本堂）', image: '/images/main2.png', desc: '勝道上人が中禅寺湖上に千手観音様をご覧になり、その姿を桂の立木に彫ったと伝えられています。観音様は、現在も地に根をはり、訪れる人々を穏やかな表情で迎えます。また、坂東三十三観音霊場の第十八番札所として多くの巡礼の方たちもご参拝になります。' },
          { name: '五大堂', image: '/images/godaido.jpg', desc: '不動明王、降三世明王、軍荼利明王、大威徳明王、金剛夜叉明王の五大明王が安置された御祈祷の道場です。天井には、堅山南風画伯が描いた大雲龍が堂々たる威容を誇ります。また、ここ五大堂からの中禅寺湖を望む景色は、見るものの心を振るわせるほどの絶景です。' },
        ]),
      },
      { key: 'grounds_heading_godaido', label: '「五大堂からの眺望」見出し', defaultValue: '五大堂からの眺望' },
      { key: 'grounds_godaido_text', label: '五大堂からの眺望テキスト', multiline: true, defaultValue: '五大堂の大窓からは、中禅寺湖と男体山を一望することができます。四季折々の景色は訪れる人々を魅了し、特に紅葉の季節には多くの参拝者が訪れます。また、天井に描かれた龍の大墨絵も必見です。' },
      { key: 'grounds_heading_flow', label: '「参拝の流れ」見出し', defaultValue: '参拝の流れ' },
      {
        key: 'grounds_flow', label: '参拝の流れ', type: 'list',
        listFields: [{ key: 'title', label: 'ステップ名' }, { key: 'text', label: '説明', multiline: true }],
        defaultValue: J([
          { title: '拝観受付（山門）', text: '入口にて拝観料をお納めください。受付は閉門30分前に終了いたします。' },
          { title: '御朱印受付', text: '山門をくぐってすぐの御朱印所にて、御朱印やお守りをお受けいただけます。' },
          { title: '本堂参拝', text: 'ご本尊・立木観音（千手観世音菩薩）にお参りください。' },
          { title: '五大堂', text: '中禅寺湖を一望できる五大堂へ。天井の龍の墨絵も必見です。' },
        ]),
      },
    ],
  },
  {
    section: '参拝について（拝観料金）',
    href: '/about',
    fields: [
      { key: 'about_subtitle',   label: '見出し（ヒーロー・本文共通）', defaultValue: '拝観時間・拝観料' },
      { key: 'about_hours_note', label: '「拝観時間」欄の表示文', defaultValue: '季節により異なります（下記参照）' },
      { key: 'about_holiday',    label: '定休日', defaultValue: '年中無休' },
      { key: 'about_fee_adult', label: '大人 拝観料', defaultValue: '500円' },
      { key: 'about_fee_child', label: '子供 拝観料', defaultValue: '200円' },
      { key: 'about_fee_group_adult', label: '大人 団体料金（20名様以上）', defaultValue: '450円' },
      { key: 'about_fee_group_child', label: '子供 団体料金（20名様以上）', defaultValue: '180円' },
      { key: 'about_hours_peak',     label: '4月〜10月 拝観時間', defaultValue: '午前8時〜午後5時' },
      { key: 'about_hours_shoulder', label: '11月・3月 拝観時間', defaultValue: '午前8時〜午後4時' },
      { key: 'about_hours_winter',   label: '12月〜2月 拝観時間', defaultValue: '午前8時30分〜午後3時30分' },
      { key: 'about_grounds_teaser_title', label: '「境内のご案内」誘導カード見出し', defaultValue: '境内のご案内' },
      { key: 'about_grounds_teaser_desc',  label: '「境内のご案内」誘導カード説明文', multiline: true, defaultValue: '山門・観音堂・鐘楼・札所・天道・愛染堂・延命水など、境内各所の見どころをご紹介しています。' },
    ],
  },
  {
    section: '御祈願',
    href: '/prayer',
    fields: [
      { key: 'prayer_subtitle', label: '見出し（ヒーロー サブタイトル）', defaultValue: '立木観音護摩祈祷' },
      { key: 'prayer_heading_about', label: '「御祈願について」見出し', defaultValue: '御祈願について' },
      { key: 'prayer_about', label: '御祈願についての説明文', multiline: true, defaultValue: 'お護摩はインド伝来の密教の秘法（秘密の教え）で、僧侶が護摩壇に向かい、作法にしたがって仏の智慧の火を焚き、様々な供物を焚き上げ、厄難・災難を払いその加護（成就）を願います。' },
      { key: 'prayer_heading_hours', label: '「御祈願時間」見出し', defaultValue: '御祈願時間' },
      { key: 'prayer_hours_row_label', label: '時間テーブルの行ラベル', defaultValue: '通年（平日・土日祝）' },
      { key: 'prayer_hours', label: '御祈願時間', defaultValue: '9：00〜12：00' },
      { key: 'prayer_hours_note1', label: '御祈願時間 補足1', defaultValue: '定時での御祈願はございません。' },
      { key: 'prayer_hours_note2', label: '御祈願時間 補足2', defaultValue: '予約制となりますので、事前にお申し込みをお願い致します。' },
      { key: 'prayer_exclude_dates', label: '除外日', defaultValue: '6月18日・8月4日・8月8日' },
      { key: 'prayer_exclude_note', label: '除外日の補足文', multiline: true, defaultValue: '他にも行事によっては祈祷できない日もございますので、一度お問い合わせください。' },
      { key: 'prayer_heading_fees', label: '「御祈願料」見出し', defaultValue: '御祈願料' },
      { key: 'prayer_fees_note', label: '御祈願料 説明文', multiline: true, defaultValue: '原則、御札の料金にて受付しております。金額によって御札と木箱の大きさが変わります。' },
      {
        key: 'prayer_fees', label: '御祈願料（テーブル）', type: 'list',
        listFields: [{ key: 'price', label: '御祈願料' }, { key: 'size', label: '御札サイズ' }],
        defaultValue: J([
          { price: '5,000円', size: '28㎝' },
          { price: '10,000円', size: '32㎝' },
          { price: '20,000円', size: '38㎝' },
          { price: '30,000円', size: '42.5㎝' },
        ]),
      },
      { key: 'prayer_heading_mail', label: '「護摩札の郵送について」見出し', defaultValue: '護摩札の郵送について' },
      { key: 'prayer_mail_text', label: '護摩札の郵送について', multiline: true, defaultValue: '万が一、参列できない場合は郵送にてお札をお送りします。着払いにて発送させて頂きますので、申込用紙に必要事項をご記入の上、現金書留にてお送りください。' },
      { key: 'prayer_mail_note', label: '護摩札の郵送 補足', defaultValue: '※お申込み頂き御祈願後、発送させて頂きますので1〜2週間ほどお待ちください。' },
      { key: 'prayer_heading_others', label: '「その他の御祈願」見出し', defaultValue: 'その他の御祈願' },
      { key: 'prayer_car_title', label: '新車祈祷 タイトル', defaultValue: '新車祈願（車両安全祈願）' },
      { key: 'prayer_car_desc', label: '新車祈祷 説明文', defaultValue: 'お車を新しくされた方、車両安全の御祈願をお申し込みの方' },
      { key: 'prayer_car_fee', label: '新車祈祷 料金', defaultValue: '5,000円〜' },
      { key: 'prayer_car_note', label: '新車祈祷 備考', defaultValue: '※交通安全の錫杖守りと木札が付きます。' },
      { key: 'prayer_birth_title', label: '安産祈願 タイトル', defaultValue: '安産祈願' },
      { key: 'prayer_birth_fee', label: '安産祈願 料金', defaultValue: '5,000円' },
      { key: 'prayer_birth_note', label: '安産祈願 備考', defaultValue: '※腹帯の持ち込みも可能です。詳しくはお問い合わせください。' },
      { key: 'prayer_cta_heading', label: 'CTA見出し', defaultValue: '御祈願のお申し込み' },
      { key: 'prayer_cta_sub', label: 'CTA補足文', defaultValue: 'ご不明な点はお気軽にお問い合わせください。' },
    ],
  },
  {
    section: '御朱印',
    href: '/goshuin',
    fields: [
      { key: 'goshuin_heading_regular', label: '「御朱印」見出し', defaultValue: '御朱印' },
      { key: 'goshuin_intro', label: '御朱印セクションの説明文', multiline: true, defaultValue: '御朱印は御朱印所・本堂・五大堂の各所にてお受けいただけます。\n場所によって授与しているものが異なります。' },
      {
        key: 'goshuin_regular', label: '通常御朱印（画像は固定・4件）', type: 'list',
        listFields: [{ key: 'title', label: 'タイトル' }],
        defaultValue: J([
          { title: '立木大悲殿' }, { title: 'ご詠歌' }, { title: '波之利大黒天' }, { title: '金剛閣' },
        ]),
      },
      { key: 'goshuin_fee_note', label: '御朱印代・受付時間の案内', multiline: true, defaultValue: '御朱印代：各500円　／　書き入れ・書き置きともに同じ金額です。\n受付時間は拝観時間に準じます（閉門30分前に終了）。' },
      { key: 'goshuin_heading_special', label: '「特別御朱印」見出し', defaultValue: '写経・写仏体験 特別御朱印' },
      { key: 'goshuin_special_intro', label: '特別御朱印 説明文', defaultValue: '写経・写仏体験とセットでお受けいただける特別な御朱印です。' },
      { key: 'goshuin_special_price', label: '特別御朱印 価格表示', defaultValue: '体験料込み 各1,000円' },
      {
        key: 'goshuin_special', label: '特別御朱印一覧（画像は固定・3件）', type: 'list',
        listFields: [{ key: 'label', label: '区分（写経／写仏）' }, { key: 'title', label: 'タイトル' }, { key: 'sub', label: '副題' }, { key: 'desc', label: '説明', multiline: true }],
        defaultValue: J([
          { label: '写経', title: '金紙特別朱印', sub: '立木大悲殿', desc: '十六文字写経（延命十句観音経）をお書きいただいた方にお授けします。' },
          { label: '写経', title: '金紙特別御朱印', sub: '大日如来', desc: '十六文字写経（懺悔文）をお書きいただいた方にお授けします。' },
          { label: '写仏', title: '銀紙特別朱印', sub: '立木観世音', desc: '写仏をお書きいただいた方にお授けします。' },
        ]),
      },
      { key: 'goshuin_special_place', label: '特別御朱印 受付場所', defaultValue: '受付場所：寺務所 体験受付窓口' },
      { key: 'goshuin_special_note',  label: '特別御朱印 補足', defaultValue: '※特別御朱印の種類は今後追加される場合があります。' },
      { key: 'goshuin_heading_notes', label: '「ご注意」見出し', defaultValue: '御朱印についてのご注意' },
      {
        key: 'goshuin_notes', label: '御朱印についてのご注意', type: 'list',
        listFields: [{ key: 'text', label: '注意事項', multiline: true }],
        defaultValue: J([
          { text: '御朱印は信仰の証です。コレクション目的でのお受け取りはご遠慮ください。' },
          { text: '受付時間は閉門30分前に終了いたします。余裕をもってお越しください。' },
          { text: '書き入れは混雑時にお時間をいただく場合がございます。' },
          { text: '御朱印帳をお持ちでない方には書き置きもございます。' },
        ]),
      },
    ],
  },
  {
    section: '写経体験',
    href: '/experience/shakyou',
    fields: [
      { key: 'shakyou_subtitle', label: '見出し（ヒーロー サブタイトル）', defaultValue: '心を静め、お経の文字を丁寧にお写しいただきます' },
      { key: 'shakyou_heading_about', label: '「写経とは」見出し', defaultValue: '写経とは' },
      { key: 'shakyou_about_p1', label: '写経とは（段落1）', multiline: true, defaultValue: '写経とは、お経の文字を一文字一文字丁寧に書き写す修行です。文字を書くことで雑念を払い、心を清め、仏様との縁を結ぶとされています。' },
      { key: 'shakyou_about_p2', label: '写経とは（段落2）', multiline: true, defaultValue: '立木観音では、十六文字のお経（延命十句観音経・懺悔文）をお写しいただきます。短いお経のため、筆を持ったことのない方でも約15分でお写しいただけます。' },
      { key: 'shakyou_heading_contents', label: '「体験内容」見出し', defaultValue: '体験内容' },
      {
        key: 'shakyou_contents', label: '体験内容', type: 'list',
        listFields: [{ key: 'icon', label: 'アイコン（絵文字）' }, { key: 'title', label: 'タイトル' }, { key: 'desc', label: '説明', multiline: true }],
        defaultValue: J([
          { icon: '📜', title: '延命十句観音経', desc: '観音様のお力を借り、長寿・安全を祈るお経。十六文字を丁寧にお写しいただきます。' },
          { icon: '✍️', title: '懺悔文', desc: '過去の罪業を懺悔し、心を清めるお経。金紙特別御朱印（大日如来）とセットです。' },
        ]),
      },
      { key: 'shakyou_heading_fees', label: '「料金・所要時間」見出し', defaultValue: '料金・所要時間' },
      { key: 'shakyou_fee',  label: '体験料', defaultValue: '1,000円（特別御朱印込み）' },
      { key: 'shakyou_time', label: '所要時間', defaultValue: '約15分' },
      { key: 'shakyou_target', label: '対象', defaultValue: 'どなたでも（筆が初めての方も歓迎）' },
      { key: 'shakyou_place',  label: '受付場所', defaultValue: '寺務所 体験受付窓口' },
      { key: 'shakyou_hours',  label: '受付時間', defaultValue: '拝観時間内（閉門1時間前まで）' },
      { key: 'shakyou_heading_goshuin', label: '「特別御朱印」見出し', defaultValue: '写経体験 特別御朱印' },
      {
        key: 'shakyou_goshuin_items', label: '特別御朱印一覧', type: 'list',
        listFields: [{ key: 'title', label: 'タイトル' }, { key: 'sub', label: '説明' }, { key: 'badge', label: 'バッジ文言' }],
        defaultValue: J([
          { title: '金紙特別朱印 立木大悲殿', sub: '延命十句観音経をお写しいただいた方にお授けします。', badge: '延命十句観音経' },
          { title: '金紙特別御朱印 大日如来', sub: '懺悔文をお写しいただいた方にお授けします。', badge: '懺悔文' },
        ]),
      },
      { key: 'shakyou_goshuin_note', label: '特別御朱印 補足', defaultValue: '※特別御朱印は体験料に含まれています。別途購入はできません。' },
      { key: 'shakyou_heading_items', label: '「持ち物・服装」見出し', defaultValue: '持ち物・服装' },
      {
        key: 'shakyou_items', label: '持ち物・服装', type: 'list',
        listFields: [{ key: 'text', label: '項目', multiline: true }],
        defaultValue: J([
          { text: '筆・硯・お経の手本はすべてご用意しています。手ぶらでお越しください。' },
          { text: '汚れてもよい服装でお越しいただくとより安心です。' },
          { text: '書き損じても大丈夫です。丁寧にご指導いたします。' },
        ]),
      },
      { key: 'shakyou_cta_heading', label: 'CTA見出し', defaultValue: '写経体験のご予約' },
      { key: 'shakyou_cta_sub', label: '予約ボタン下の説明文', defaultValue: '事前予約をおすすめします。当日受付も空きがあれば対応します。' },
    ],
  },
  {
    section: '写仏体験',
    href: '/experience/shabutu',
    fields: [
      { key: 'shabutu_subtitle', label: '見出し（ヒーロー サブタイトル）', defaultValue: '仏様のお姿を一筆一筆、心を込めてお描きいただきます' },
      { key: 'shabutu_heading_about', label: '「写仏とは」見出し', defaultValue: '写仏とは' },
      { key: 'shabutu_about_p1', label: '写仏とは（段落1）', multiline: true, defaultValue: '写仏とは、仏様のお姿を下絵に沿って丁寧にお描きする修行です。写経と並ぶ伝統的な仏道修行のひとつで、描きながら仏様の功徳をいただき、心を落ち着けることができます。' },
      { key: 'shabutu_about_p2', label: '写仏とは（段落2）', multiline: true, defaultValue: '立木観音の写仏体験では、立木観世音菩薩のお姿をお描きいただきます。完成した写仏は記念にお持ち帰りいただけます。絵が苦手な方でも、下絵に沿って描くためどなたでもお楽しみいただけます。' },
      { key: 'shabutu_heading_fees', label: '「料金・所要時間」見出し', defaultValue: '料金・所要時間' },
      { key: 'shabutu_fee',  label: '体験料', defaultValue: '1,000円（特別御朱印込み）' },
      { key: 'shabutu_time', label: '所要時間', defaultValue: '約30〜60分（個人差があります）' },
      { key: 'shabutu_target', label: '対象', defaultValue: 'どなたでも（絵が苦手な方も歓迎）' },
      { key: 'shabutu_place',  label: '受付場所', defaultValue: '寺務所 体験受付窓口' },
      { key: 'shabutu_hours',  label: '受付時間', defaultValue: '拝観時間内（閉門1時間前まで）' },
      { key: 'shabutu_heading_flow', label: '「体験の流れ」見出し', defaultValue: '体験の流れ' },
      {
        key: 'shabutu_flow', label: '体験の流れ', type: 'list',
        listFields: [{ key: 'title', label: 'ステップ名' }, { key: 'text', label: '説明', multiline: true }],
        defaultValue: J([
          { title: '受付', text: '寺務所 体験受付窓口にてお申し込みください。体験料をお納めいただきます。' },
          { title: '用具の準備', text: '下絵・筆・墨などをご用意します。すべて貸し出しですので手ぶらでお越しいただけます。' },
          { title: 'お描きいただきます', text: '下絵に沿って、立木観世音菩薩のお姿をゆっくりお描きください。係の者がご説明いたします。' },
          { title: '特別御朱印のお授け', text: '完成後、銀紙特別朱印（立木観世音）をお授けします。' },
          { title: 'お持ち帰り', text: '完成した写仏はお持ち帰りいただけます。大切に飾ってください。' },
        ]),
      },
      { key: 'shabutu_heading_goshuin', label: '「特別御朱印」見出し', defaultValue: '写仏体験 特別御朱印' },
      { key: 'shabutu_goshuin_badge', label: '特別御朱印 バッジ文言', defaultValue: '写仏' },
      { key: 'shabutu_goshuin_title', label: '特別御朱印 タイトル', defaultValue: '銀紙特別朱印 立木観世音' },
      { key: 'shabutu_goshuin_desc',  label: '特別御朱印 説明文', multiline: true, defaultValue: '写仏をお描きいただいた方にお授けします。体験料に含まれています。' },
      { key: 'shabutu_goshuin_note', label: '特別御朱印 補足', defaultValue: '※特別御朱印は体験料に含まれています。別途購入はできません。' },
      { key: 'shabutu_heading_items', label: '「持ち物・服装」見出し', defaultValue: '持ち物・服装' },
      {
        key: 'shabutu_items', label: '持ち物・服装', type: 'list',
        listFields: [{ key: 'text', label: '項目', multiline: true }],
        defaultValue: J([
          { text: '下絵・筆・墨・硯はすべてご用意しています。手ぶらでお越しください。' },
          { text: '墨が衣服につく場合がありますので、汚れてもよい服装でお越しください。' },
          { text: '完成した作品はお持ち帰りいただけます。筒状にお渡しします。' },
        ]),
      },
      { key: 'shabutu_cta_heading', label: 'CTA見出し', defaultValue: '写仏体験のご予約' },
      { key: 'shabutu_cta_sub', label: '予約ボタン下の説明文', defaultValue: '事前予約をおすすめします。当日受付も空きがあれば対応します。' },
    ],
  },
  {
    section: '数珠づくり体験',
    href: '/experience/jyuzu',
    fields: [
      { key: 'jyuzu_heading_about', label: '「数珠づくりとは」見出し', defaultValue: '数珠づくりとは' },
      { key: 'jyuzu_about_p1', label: '数珠づくりとは（段落1）', multiline: true, defaultValue: '数珠（じゅず）は、仏様を礼拝するときに手に持つ法具です。当山の数珠づくり体験では、天然石・天然木の珠からご自由に組み合わせを選び、世界にひとつだけのオリジナル数珠（ブレスレット）をお作りいただけます。' },
      { key: 'jyuzu_about_p2', label: '数珠づくりとは（段落2）', multiline: true, defaultValue: '職員が丁寧にご説明しますので、どなたでも簡単にお作りいただけます。僧侶がご祈祷したものを当日お守りとしてお持ち帰りいただけます。' },
      { key: 'jyuzu_heading_course', label: '「コース説明」見出し', defaultValue: 'コース説明' },
      { key: 'jyuzu_course_desc', label: 'コース説明 補足文', defaultValue: '天然石・天然木の組成は、コースごとに以下のようになります。' },
      { key: 'jyuzu_heading_flow', label: '「体験の流れ」見出し', defaultValue: '体験の流れ' },
      { key: 'jyuzu_heading_fees', label: '「開催日・料金」見出し', defaultValue: '開催日・料金' },
      { key: 'jyuzu_days', label: '開催日', defaultValue: '毎日開催（法要時は中止となる場合があります）' },
      { key: 'jyuzu_hours_summer', label: '体験時間（4月〜10月）', defaultValue: '4月〜10月：9:00〜15:00' },
      { key: 'jyuzu_hours_winter', label: '体験時間（11月〜3月）', defaultValue: '11月〜3月：9:00〜14:00' },
      { key: 'jyuzu_fee',  label: '体験料', defaultValue: '2,000円〜（使用素材により異なります）' },
      { key: 'jyuzu_time', label: '所要時間', defaultValue: '30分〜1時間（個人差があります）' },
      { key: 'jyuzu_capacity', label: '体験人数', defaultValue: '1名〜20名まで' },
      { key: 'jyuzu_target', label: '対象', defaultValue: '小学生以上（小学生は保護者同伴）' },
      { key: 'jyuzu_place', label: '受付場所', defaultValue: '大黒天堂窓口' },
      { key: 'jyuzu_price_note_label', label: '料金補足の見出し', defaultValue: '料金について' },
      { key: 'jyuzu_price_note', label: '料金についての補足', multiline: true, defaultValue: 'お選びいただく珠の素材・組み合わせによって料金が異なります。詳しくは下記コース説明をご覧ください。' },
      {
        key: 'jyuzu_flow', label: '体験の流れ', type: 'list',
        listFields: [{ key: 'title', label: 'ステップ名' }, { key: 'text', label: '説明', multiline: true }],
        defaultValue: J([
          { title: '好きな珠を選ぶ', text: '天然石・天然木をご自由に組み合わせてお選びいただけます。' },
          { title: '数珠を作る', text: 'スタッフが丁寧にサポートしますので、どなたでも簡単にお作りいただけます。' },
          { title: 'ご祈祷', text: '僧侶がご祈祷し、お守りとして当日お持ち帰りいただけます。' },
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
      },
      {
        key: 'jyuzu_materials', label: '珠の素材', type: 'list',
        listFields: [{ key: 'name', label: '素材名' }, { key: 'desc', label: '説明', multiline: true }],
        defaultValue: J([
          { name: '天然木', desc: '軽くて使いやすい木の珠。温かみのある手触りが特徴です。' },
          { name: '天然石', desc: '色とりどりの天然石の珠。お好みの色でお選びいただけます。' },
        ]),
      },
      { key: 'jyuzu_heading_materials', label: '「選べる珠」見出し', defaultValue: '選べる珠' },
      { key: 'jyuzu_materials_hint', label: '選べる珠 補足（タップ案内）', defaultValue: '珠をタップすると説明が表示されます' },
      { key: 'jyuzu_materials_note', label: '選べる珠 注意書き', defaultValue: '珠の種類は季節・入荷状況により変わります。当日の受付窓口でご確認ください。' },
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
          { name: 'ピーチジェイド', desc: '心と体のバランスを整えるとされる石です。' },
          { name: '茶金石', desc: '精神を安定させ、心の疲れを癒すとされる石です。' },
          { name: '紫金石', desc: '善い人や物、チャンスとの出会いを導くとされる石です。' },
          { name: 'ハウライト', desc: '厄除け効果があり、精神の安定・浄化、意志を強くするとされています。' },
          { name: 'エンジェライト', desc: 'ネガティブな感情を浄化し、優しさと癒しをもたらすとされています。' },
          { name: 'カーネリアン', desc: '気力アップ・体を丈夫にし、迷いを断ち切るとされる石です。' },
          { name: 'オニキス', desc: '邪気祓い・厄除け・魔除けの効果があるとされる石です。' },
          { name: 'インド翡翠', desc: '失った気力を回復させ、強いパワーで物事を成し遂げるとされています。' },
          { name: 'プラムジェイド', desc: '気品と落ち着きをもたらすとされる、深みのある色合いの石です。' },
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
      },
      { key: 'jyuzu_heading_notes', label: '「ご注意・持ち物」見出し', defaultValue: 'ご注意・持ち物' },
      {
        key: 'jyuzu_notes', label: 'ご注意・持ち物', type: 'list',
        listFields: [{ key: 'text', label: '項目', multiline: true }],
        defaultValue: J([
          { text: '数珠はすべてブレスレットタイプです。' },
          { text: '参拝料（拝観料）は別途お求めください。' },
          { text: '僧侶がご祈祷したものを当日お守りとしてお持ち帰りいただけます。僧侶が不在の場合、後日ご祈祷後郵送いたします（郵送料は当寺負担）。' },
          { text: '団体でお越しの際は事前にお電話ください。' },
        ]),
      },
      { key: 'jyuzu_cta_heading', label: 'CTA見出し', defaultValue: '数珠づくり体験のご予約' },
      { key: 'jyuzu_cta_sub', label: '予約ボタン下の説明文', defaultValue: '毎日開催しております。団体でお越しの際は事前にお電話ください。' },
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
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
