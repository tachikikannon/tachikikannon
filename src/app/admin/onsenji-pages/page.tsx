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
    section: 'トップページ',
    href: '/onsenji',
    fields: [
      { key: 'onsenji_hero_en',    label: 'ヒーロー 英語サブタイトル', defaultValue: 'Nikkozan Onsenji Temple' },
      { key: 'onsenji_hero_title', label: 'ヒーロー メインキャッチコピー（改行可）', multiline: true, defaultValue: '千二百余年の祈りを宿す\n薬師の霊場' },
      { key: 'onsenji_hero_sub',   label: 'ヒーロー サブコピー', multiline: true, defaultValue: '世界遺産・日光山輪王寺の別院。薬師瑠璃光如来のご加護と、大地から湧く温泉の癒しを' },
      { key: 'onsenji_about_title', label: '「温泉寺について」見出し', defaultValue: '温泉寺について' },
      { key: 'onsenji_about_body',  label: '「温泉寺について」本文', multiline: true, defaultValue: '日光山温泉寺は、延暦7年（788年）に勝道上人によって開かれた世界遺産「日光山輪王寺」の別院です。ご本尊は薬師瑠璃光如来で、健康増進・延命長寿のご利益で知られています。江戸時代には輪王寺宮の直轄寺院として栄え、現在も多くの参拝者が訪れます。' },
      { key: 'onsenji_access_address', label: 'アクセス 所在地', defaultValue: '栃木県日光市湯元2559' },
      { key: 'onsenji_access_car',  label: 'アクセス お車での説明', multiline: true, defaultValue: '日光宇都宮道路 日光ICより約10分\n境内周辺に有料駐車場あり' },
      { key: 'onsenji_access_bus',  label: 'アクセス バスでの説明', multiline: true, defaultValue: '東武日光駅・JR日光駅よりバスで「西参道」バス停下車、徒歩約10分\nまたは「表参道」バス停より徒歩約15分' },
    ],
  },
  {
    section: '温泉寺の歴史',
    href: '/onsenji/history',
    fields: [
      { key: 'onsenji_history_p1', label: '創建の由来（段落1）', multiline: true, defaultValue: '日光山温泉寺は、延暦7年（788年）に勝道上人によって開かれた世界遺産「日光山輪王寺」の別院です。勝道上人は日光山を開いた高僧で、この地で温泉の湧き出るのを発見し、薬師瑠璃光如来をお祀りしたのが温泉寺の起こりとされています。' },
      { key: 'onsenji_history_p2', label: '創建の由来（段落2）', multiline: true, defaultValue: 'ご本尊は薬師瑠璃光如来（医王如来）で、健康増進・延命長寿のご利益で信仰を集めてきました。江戸時代には輪王寺宮の直轄寺院として栄え、昭和48年に現在地に再建された後も、多くの参拝者に親しまれています。' },
      {
        key: 'onsenji_history_timeline', label: '歴史の流れ（年表）', type: 'list',
        listFields: [{ key: 'year', label: '年代' }, { key: 'title', label: 'タイトル' }, { key: 'text', label: '説明', multiline: true }],
        defaultValue: J([
          { year: '延暦7年（788年）', title: '勝道上人による開創', text: '日光山を開いた勝道上人が、この地で温泉が湧き出ているのを発見。薬師瑠璃光如来をお祀りし、温泉寺を開創した。' },
          { year: '平安〜鎌倉時代', title: '天台宗の霊場として栄える', text: '天台宗の修験道の拠点として整備され、多くの僧侶や参拝者が訪れるようになる。' },
          { year: '江戸時代', title: '輪王寺宮の直轄寺院に', text: '輪王寺宮（法親王）の直轄寺院として保護・整備された。日光東照宮参詣とあわせた参拝が盛んとなる。' },
          { year: '昭和41年（1966年）9月', title: '台風による土砂崩れ', text: '台風で薬師堂が土砂崩れにより全壊。しかし薬師如来像は落下した大岩の上に無傷で鎮座しており、人々を驚かせた。' },
          { year: '昭和48年（1973年）', title: '現在地に温泉寺として再建', text: '現在地（日光市山内2300）に温泉寺として再建。世界遺産「日光山輪王寺」の別院として今日に至る。' },
          { year: '令和8年（2026年）4月', title: '「薬師の湯」開湯', text: '泉質：含硫黄‐カルシウム・ナトリウム‐硫酸塩・炭酸水素塩泉（71.4℃）の源泉かけ流しの湯が参拝者に開放された。' },
        ]),
      },
      { key: 'onsenji_history_honzon', label: 'ご本尊・薬師瑠璃光如来について', multiline: true, defaultValue: '薬師瑠璃光如来（やくしるりこうにょらい）は「医王如来」とも呼ばれ、あらゆる病気や苦しみを癒す仏様として信仰されています。昭和41年の台風被害の際、薬師堂が全壊したにもかかわらず、如来像は大岩の上に無傷でご鎮座されていたという言い伝えが残り、その霊験はことのほか篤いとされています。' },
      { key: 'onsenji_history_bando', label: '霊場としての温泉寺', multiline: true, defaultValue: '温泉寺は日光山輪王寺の別院として、世界遺産「日光の社寺」エリアに位置しています。東照宮・二荒山神社・輪王寺という三つの世界遺産に囲まれた境内は、四季折々の自然とともに参拝者を静かに迎えています。' },
    ],
  },
  {
    section: '境内のご案内',
    href: '/onsenji/grounds',
    fields: [
      { key: 'onsenji_grounds_subtitle', label: '見出し（ヒーロー サブタイトル）', defaultValue: '見どころ・薬師の湯・境内マップ' },
      { key: 'onsenji_grounds_heading_spots', label: '「主な見どころ」見出し', defaultValue: '主な見どころ' },
      {
        key: 'onsenji_grounds_spots', label: '主な見どころ', type: 'list',
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
        key: 'onsenji_grounds_flow', label: '参拝の流れ', type: 'list',
        listFields: [{ key: 'title', label: 'ステップ名' }, { key: 'text', label: '説明', multiline: true }],
        defaultValue: J([
          { title: '拝観受付（山門）', text: '入口にて拝観料をお納めください。受付は閉門30分前に終了いたします。' },
          { title: '本堂参拝', text: 'ご本尊・薬師如来（医王如来）にお参りください。' },
          { title: '薬師の湯', text: '参拝後は境内の温泉（薬師の湯）をご利用いただけます。足湯・手湯があります。' },
          { title: '御朱印所', text: '御朱印やお守りをお受けいただけます。' },
        ]),
      },
    ],
  },
  {
    section: '拝観案内',
    href: '/onsenji/about',
    fields: [
      { key: 'onsenji_about_subtitle', label: '見出し（ヒーロー サブタイトル）', defaultValue: '拝観時間・参拝料のご案内' },
      { key: 'onsenji_about_heading_hours', label: '「拝観時間・参拝料」見出し', defaultValue: '拝観時間・参拝料' },
      { key: 'onsenji_about_hours_open',   label: '拝観時間', defaultValue: '8時00分〜17時00分' },
      { key: 'onsenji_about_fee', label: '参拝料', defaultValue: '無料' },
      { key: 'onsenji_about_hours_winter', label: '冬季休業期間', defaultValue: '12月〜4月上旬は冬季休業。閉湯・開湯の日程は公式ホームページをご確認ください。' },
      { key: 'onsenji_about_heading_notes', label: '「ご参拝の注意事項」見出し', defaultValue: 'ご参拝の注意事項' },
      {
        key: 'onsenji_about_notes', label: 'ご参拝の注意事項', type: 'list',
        listFields: [{ key: 'text', label: '注意事項', multiline: true }],
        defaultValue: J([
          { text: '境内では静粛にお過ごしください。' },
          { text: '撮影は外観のみ可能です。本堂内は撮影禁止となっております。' },
          { text: 'ペットの同伴は境内に限り可能です。堂内へのお連れ込みはご遠慮ください。' },
          { text: '足元が不安定な箇所があります。歩きやすい靴でお越しください。' },
        ]),
      },
    ],
  },
  {
    section: '御朱印',
    href: '/onsenji/goshuin',
    fields: [
      { key: 'onsenji_goshuin_heading_info', label: '「御朱印のご案内」見出し', defaultValue: '御朱印のご案内' },
      {
        key: 'onsenji_goshuin_items', label: '御朱印一覧（写真は準備中表示・固定）', type: 'list',
        listFields: [{ key: 'title', label: 'タイトル' }, { key: 'sub', label: '副題' }],
        defaultValue: J([
          { title: '薬師如来', sub: '温泉寺 本堂' },
          { title: '特別御朱印', sub: '季節限定・行事限定' },
        ]),
      },
      { key: 'onsenji_goshuin_fee_note', label: '御朱印代・受付時間の案内', multiline: true, defaultValue: '御朱印代：500円　／　写経体験（1,000円）をお申し込みの方には特別御朱印を授与しています。\n受付時間は拝観受付終了時刻までとなります。' },
      { key: 'onsenji_goshuin_heading_notes', label: '「御朱印についてのご注意」見出し', defaultValue: '御朱印についてのご注意' },
      {
        key: 'onsenji_goshuin_notes', label: '御朱印についてのご注意', type: 'list',
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
    section: 'よくある質問',
    href: '/onsenji/faq',
    fields: [
      { key: 'onsenji_faq_subtitle', label: '見出し（英字サブタイトル）', defaultValue: 'FAQ' },
      { key: 'onsenji_faq_heading', label: 'ページ見出し', defaultValue: 'よくある質問' },
      {
        key: 'onsenji_faq_items', label: 'FAQ一覧', type: 'list',
        listFields: [{ key: 'q', label: '質問', multiline: true }, { key: 'a', label: '回答', multiline: true }],
        defaultValue: J([
          { q: '温泉（薬師の湯）は誰でも利用できますか？', a: 'はい、志納金（大人500円・小人300円）をお納めいただいた方はどなたでもご利用いただけます。令和8年4月11日より開湯した源泉かけ流しの温泉です。タオルをご持参ください。' },
          { q: '薬師の湯の泉質を教えてください。', a: '泉質は含硫黄‐カルシウム・ナトリウム‐硫酸塩・炭酸水素塩泉で、泉温は71.4℃です。完全かけ流しで、加水すると乳白色に変わる美しい湯です。' },
          { q: '御祈願は予約が必要ですか？', a: 'はい、御祈願は予約制となっております。事前にお電話またはお問い合わせフォームよりご連絡ください。' },
          { q: '写経体験はできますか？', a: 'はい、毎日実施しています。体験料1,000円で特別御朱印もお授けします。所要時間は約15分です。予約不要で、受付時にお申し付けください。' },
          { q: '車でのアクセスはできますか？', a: 'はい、お車でお越しいただけます。日光宇都宮道路 日光ICより約10分です。境内周辺に有料駐車場がございます。' },
          { q: '温泉寺は輪王寺と関係がありますか？', a: 'はい、日光山温泉寺は世界遺産「日光山輪王寺」の別院です。延暦7年（788年）に勝道上人によって開創され、江戸時代には輪王寺宮の直轄寺院として栄えました。' },
        ]),
      },
      { key: 'onsenji_faq_bottom_heading', label: '末尾の見出し', defaultValue: 'その他のご質問' },
      { key: 'onsenji_faq_bottom_text', label: '末尾の案内文', defaultValue: '解決しない場合はお気軽にお問い合わせください。' },
      { key: 'onsenji_faq_cta_label', label: 'お問い合わせボタンの文言', defaultValue: 'お問い合わせ' },
    ],
  },
  {
    section: '写経体験',
    href: '/onsenji/experience/shakyou',
    fields: [
      { key: 'onsenji_shakyou_about_p1', label: '写経とは（段落1）', multiline: true, defaultValue: '写経とは、お経の文字を一文字一文字丁寧に書き写す修行です。文字を書くことで雑念を払い、心を清め、仏様との縁を結ぶとされています。' },
      { key: 'onsenji_shakyou_about_p2', label: '写経とは（段落2）', multiline: true, defaultValue: '温泉寺では薬師如来に縁の深いお経をお写しいただきます。体験後は特別御朱印をお授けします。毎日開催していますので、参拝の際にお気軽にお申し付けください。' },
      { key: 'onsenji_shakyou_fee',  label: '体験料', defaultValue: '1,000円（特別御朱印授与込み）' },
      { key: 'onsenji_shakyou_time', label: '所要時間', defaultValue: '約15分' },
      {
        key: 'onsenji_shakyou_items', label: '持ち物・服装', type: 'list',
        listFields: [{ key: 'text', label: '項目', multiline: true }],
        defaultValue: J([
          { text: '筆・硯・お経の手本はすべてご用意しています。手ぶらでお越しください。' },
          { text: '汚れてもよい服装でお越しいただくとより安心です。' },
          { text: '書き損じても大丈夫です。丁寧にご指導いたします。' },
        ]),
      },
      { key: 'onsenji_shakyou_cta_sub', label: '予約ボタン下の説明文', defaultValue: '予約不要・毎日実施。参拝受付時にお申し付けください。' },
    ],
  },
  {
    section: '写仏体験',
    href: '/onsenji/experience/shabutu',
    fields: [
      { key: 'onsenji_shabutu_about_p1', label: '写仏とは（段落1）', multiline: true, defaultValue: '写仏とは、仏様のお姿を下絵に沿って丁寧にお描きする修行です。写経と並ぶ伝統的な仏道修行のひとつで、描きながら仏様の功徳をいただき、心を落ち着けることができます。' },
      { key: 'onsenji_shabutu_about_p2', label: '写仏とは（段落2）', multiline: true, defaultValue: '温泉寺の写仏体験では、薬師瑠璃光如来のお姿をお描きいただきます。完成した写仏は記念にお持ち帰りいただけます。絵が苦手な方でも、下絵に沿って描くためどなたでもお楽しみいただけます。' },
      { key: 'onsenji_shabutu_fee',  label: '体験料', defaultValue: '1,000円（特別御朱印込み）' },
      { key: 'onsenji_shabutu_time', label: '所要時間', defaultValue: '約30〜60分' },
      {
        key: 'onsenji_shabutu_flow', label: '体験の流れ', type: 'list',
        listFields: [{ key: 'title', label: 'ステップ名' }, { key: 'text', label: '説明', multiline: true }],
        defaultValue: J([
          { title: '受付', text: '寺務所 体験受付窓口にてお申し込みください。体験料をお納めいただきます。' },
          { title: '用具の準備', text: '下絵・筆・墨などをご用意します。すべて貸し出しですので手ぶらでお越しいただけます。' },
          { title: 'お描きいただきます', text: '下絵に沿って、薬師瑠璃光如来のお姿をゆっくりお描きください。係の者がご説明いたします。' },
          { title: '特別御朱印のお授け', text: '完成後、特別御朱印をお授けします。' },
          { title: 'お持ち帰り', text: '完成した写仏はお持ち帰りいただけます。大切に飾ってください。' },
        ]),
      },
      {
        key: 'onsenji_shabutu_items', label: '持ち物・服装', type: 'list',
        listFields: [{ key: 'text', label: '項目', multiline: true }],
        defaultValue: J([
          { text: '下絵・筆・墨・硯はすべてご用意しています。手ぶらでお越しください。' },
          { text: '墨が衣服につく場合がありますので、汚れてもよい服装でお越しください。' },
          { text: '完成した作品はお持ち帰りいただけます。' },
        ]),
      },
      { key: 'onsenji_shabutu_cta_sub', label: '予約ボタン下の説明文', defaultValue: '事前予約をおすすめします。当日受付も空きがあれば対応します。' },
    ],
  },
  {
    section: '数珠づくり体験',
    href: '/onsenji/experience/jyuzu',
    fields: [
      { key: 'onsenji_jyuzu_about_p1', label: '数珠づくりとは（段落1）', multiline: true, defaultValue: '数珠（じゅず）は、仏様を礼拝するときに手に持つ法具です。温泉寺の数珠づくり体験では、複数の珠の種類からお好みの組み合わせを選び、自分だけのオリジナル数珠をお作りいただけます。' },
      { key: 'onsenji_jyuzu_about_p2', label: '数珠づくりとは（段落2）', multiline: true, defaultValue: '完成した数珠は薬師如来の前でご祈願いただいた後にお持ち帰りいただけます。参拝・法要などさまざまな場面でお使いいただけます。' },
      { key: 'onsenji_jyuzu_fee',  label: '体験料', defaultValue: '2,000円〜（珠の素材・組み合わせにより異なります）' },
      { key: 'onsenji_jyuzu_time', label: '所要時間', defaultValue: '約60〜90分' },
      { key: 'onsenji_jyuzu_price_note', label: '料金についての補足', multiline: true, defaultValue: 'お選びいただく珠の素材・数・組み合わせによって料金が異なります。詳しくは受付窓口またはお問い合わせフォームよりご確認ください。' },
      {
        key: 'onsenji_jyuzu_flow', label: '体験の流れ', type: 'list',
        listFields: [{ key: 'title', label: 'ステップ名' }, { key: 'text', label: '説明', multiline: true }],
        defaultValue: J([
          { title: '受付・デザイン選択', text: '寺務所 体験受付窓口にてお申し込み。珠の素材や色の組み合わせをお選びいただきます。' },
          { title: '珠の確認', text: '選んでいただいた珠を確認し、体験台へご案内します。' },
          { title: '数珠づくり', text: 'スタッフのご説明に沿って、珠を糸に通していきます。結び方もご指導します。' },
          { title: '完成・お持ち帰り', text: '完成した数珠はその場でお持ち帰りいただけます。専用の袋に入れてお渡しします。' },
        ]),
      },
      {
        key: 'onsenji_jyuzu_materials', label: '珠の素材', type: 'list',
        listFields: [{ key: 'name', label: '素材名' }, { key: 'desc', label: '説明', multiline: true }],
        defaultValue: J([
          { name: '水晶', desc: '透明感があり、邪気を払う浄化の石として知られます。' },
          { name: '翡翠', desc: '緑の美しい石。長寿・健康・魔除けの功徳があるとされます。' },
          { name: '木珠', desc: '軽くて使いやすい伝統的な珠。温かみのある手触りが特徴です。' },
        ]),
      },
      { key: 'onsenji_jyuzu_cta_sub', label: '予約ボタン下の説明文', defaultValue: '材料の準備がありますので、事前のご予約をお願いします。' },
    ],
  },
]

export default function OnsenjPagesEditor() {
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
      <div className="flex items-center gap-3 mb-1">
        <span className="inline-block w-3 h-3 rounded-full bg-onsenji" />
        <h1 className="text-2xl font-serif text-onsenji">温泉寺 固定ページ編集</h1>
      </div>
      <p className="text-gray-500 text-sm mb-8">変更後は「保存」を押してください。すぐにサイトに反映されます。</p>

      <div className="space-y-10">
        {SECTIONS.map(({ section, href, fields }) => (
          <div key={section}>
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-sm font-medium text-gray-500 tracking-widest uppercase">{section}</h2>
              <a href={href} target="_blank" rel="noopener" className="text-xs text-onsenji hover:underline">ページを見る →</a>
            </div>
            <div className="bg-white rounded-xl shadow-sm border-l-4 border-onsenji p-6 space-y-6">
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
                      className="text-sm px-5 py-2 rounded-full bg-onsenji text-white hover:bg-onsenji-light transition-colors disabled:opacity-50"
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
