'use client'
import SectionEditor from '@/components/admin/SectionEditor'

const J = (v: unknown) => JSON.stringify(v)

const FIELDS = [
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
    key: 'jyuzu_flow', label: '体験の流れ', type: 'list' as const,
    listFields: [{ key: 'title', label: 'ステップ名' }, { key: 'text', label: '説明', multiline: true }],
    defaultValue: J([
      { title: '好きな珠を選ぶ', text: '天然石・天然木をご自由に組み合わせてお選びいただけます。' },
      { title: '数珠を作る', text: 'スタッフが丁寧にサポートしますので、どなたでも簡単にお作りいただけます。' },
      { title: 'ご祈祷', text: '僧侶がご祈祷し、お守りとして当日お持ち帰りいただけます。' },
    ]),
  },
  {
    key: 'jyuzu_samples', label: 'サンプル（コース）', type: 'list' as const,
    listFields: [{ key: 'course', label: 'コース名' }, { key: 'price', label: '価格' }, { key: 'desc', label: 'キャッチコピー' }],
    defaultValue: J([
      { course: 'Aコース', price: '2,000円', desc: '天然木で作るスタンダードな数珠' },
      { course: 'Bコース', price: '4,000円', desc: '天然石と天然木の個性あふれる数珠' },
      { course: 'Cコース', price: '6,000円', desc: '天然石のみで作る特別な数珠' },
    ]),
  },
  {
    key: 'jyuzu_materials', label: '珠の素材', type: 'list' as const,
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
    key: 'jyuzu_stones', label: '選べる珠：天然石（写真は変更できません。並び順・追加削除すると写真がずれるため注意）', type: 'list' as const,
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
    key: 'jyuzu_woods', label: '選べる珠：天然木（写真は変更できません。並び順・追加削除すると写真がずれるため注意）', type: 'list' as const,
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
    key: 'jyuzu_notes', label: 'ご注意・持ち物', type: 'list' as const,
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
] as const

export default function AdminChuzenjJyuzu() {
  return <SectionEditor title="数珠づくり体験" href="/experience/jyuzu" fields={FIELDS as never} />
}
