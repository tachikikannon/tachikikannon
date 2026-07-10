'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'

type Field = { key: string; label: string; multiline?: boolean; defaultValue?: string }
type Section = { section: string; href: string; fields: Field[] }

const SECTIONS: Section[] = [
  {
    section: '立木観音の歴史',
    href: '/history',
    fields: [
      { key: 'history_founding_p1', label: '創建の由来（段落1）', multiline: true, defaultValue: '日光山中禅寺は、784年（延暦3年）、勝道上人によって開かれました。勝道上人は日光山を開いた高僧であり、幾多の困難を乗り越えながら男体山に登頂し、山頂で大日如来を感得したとされています。' },
      { key: 'history_founding_p2', label: '創建の由来（段落2）', multiline: true, defaultValue: '中禅寺湖のほとりに建てられた本堂には、上人が湖畔に立つ桂の立木に直接刻んだと伝わる千手観世音菩薩が祀られています。木を切り倒すことなく、立ったままの木に彫り上げたことから「立木観音」と呼ばれ、今日まで人々の信仰を集めてきました。' },
      { key: 'history_honzon', label: 'ご本尊・千手観世音菩薩', multiline: true, defaultValue: 'ご本尊の千手観世音菩薩は、高さ約6メートルに及ぶ大きな仏様です。勝道上人が湖畔の桂の立木に直接刻んだとされ、木は今も根を張ったまま祀られています。千の手で人々のあらゆる願いを救い、千の眼で衆生の苦しみを見守るとされる観音様は、縁結び・病気平癒・学業成就など様々なご利益があるとされています。' },
      { key: 'history_bando', label: '坂東三十三観音', multiline: true, defaultValue: '中禅寺立木観音は、関東・東北一円にわたる坂東三十三観音霊場の第十八番札所に数えられています。多くの巡礼者がこの地を訪れ、千手観世音菩薩に手を合わせてきました。' },
    ],
  },
  {
    section: '境内のご案内',
    href: '/grounds',
    fields: [
      { key: 'grounds_godaido_text', label: '五大堂からの眺望テキスト', multiline: true, defaultValue: '五大堂の大窓からは、中禅寺湖と男体山を一望することができます。四季折々の景色は訪れる人々を魅了し、特に紅葉の季節には多くの参拝者が訪れます。また、天井に描かれた龍の大墨絵も必見です。' },
    ],
  },
  {
    section: '参拝について（拝観料金）',
    href: '/about',
    fields: [
      { key: 'about_fee_adult', label: '大人 拝観料', defaultValue: '500円' },
      { key: 'about_fee_child', label: '子供 拝観料', defaultValue: '200円' },
      { key: 'about_hours_peak',     label: '4月〜10月 拝観時間', defaultValue: '午前8時〜午後5時' },
      { key: 'about_hours_shoulder', label: '11月・3月 拝観時間', defaultValue: '午前8時〜午後4時' },
      { key: 'about_hours_winter',   label: '12月〜2月 拝観時間', defaultValue: '午前8時30分〜午後3時30分' },
    ],
  },
  {
    section: '御祈願',
    href: '/prayer',
    fields: [
      { key: 'prayer_about', label: '御祈願についての説明文', multiline: true, defaultValue: 'お護摩はインド伝来の密教の秘法（秘密の教え）で、僧侶が護摩壇に向かい、作法にしたがって仏の智慧の火を焚き、様々な供物を焚き上げ、厄難・災難を払いその加護（成就）を願います。' },
      { key: 'prayer_hours', label: '御祈願時間', defaultValue: '9：00〜12：00' },
      { key: 'prayer_exclude_dates', label: '除外日', defaultValue: '6月18日・8月4日・8月8日' },
      { key: 'prayer_mail_text', label: '護摩札の郵送について', multiline: true, defaultValue: '万が一、参列できない場合は郵送にてお札をお送りします。着払いにて発送させて頂きますので、申込用紙に必要事項をご記入の上、現金書留にてお送りください。' },
    ],
  },
  {
    section: '御朱印',
    href: '/goshuin',
    fields: [
      { key: 'goshuin_fee_note', label: '御朱印代・受付時間の案内', multiline: true, defaultValue: '御朱印代：各500円　／　書き入れ・書き置きともに同じ金額です。\n受付時間は拝観時間に準じます（閉門30分前に終了）。' },
    ],
  },
  {
    section: '写経体験',
    href: '/experience/shakyou',
    fields: [
      { key: 'shakyou_about_p1', label: '写経とは（段落1）', multiline: true, defaultValue: '写経とは、お経の文字を一文字一文字丁寧に書き写す修行です。文字を書くことで雑念を払い、心を清め、仏様との縁を結ぶとされています。' },
      { key: 'shakyou_about_p2', label: '写経とは（段落2）', multiline: true, defaultValue: '立木観音では、十六文字のお経（延命十句観音経・懺悔文）をお写しいただきます。短いお経のため、筆を持ったことのない方でも約15分でお写しいただけます。' },
      { key: 'shakyou_fee',  label: '体験料', defaultValue: '1,000円（特別御朱印込み）' },
      { key: 'shakyou_time', label: '所要時間', defaultValue: '約15分' },
      { key: 'shakyou_cta_sub', label: '予約ボタン下の説明文', defaultValue: '事前予約をおすすめします。当日受付も空きがあれば対応します。' },
    ],
  },
  {
    section: '写仏体験',
    href: '/experience/shabutu',
    fields: [
      { key: 'shabutu_about_p1', label: '写仏とは（段落1）', multiline: true, defaultValue: '写仏とは、仏様のお姿を下絵に沿って丁寧にお描きする修行です。写経と並ぶ伝統的な仏道修行のひとつで、描きながら仏様の功徳をいただき、心を落ち着けることができます。' },
      { key: 'shabutu_about_p2', label: '写仏とは（段落2）', multiline: true, defaultValue: '立木観音の写仏体験では、立木観世音菩薩のお姿をお描きいただきます。完成した写仏は記念にお持ち帰りいただけます。絵が苦手な方でも、下絵に沿って描くためどなたでもお楽しみいただけます。' },
      { key: 'shabutu_fee',  label: '体験料', defaultValue: '1,000円（特別御朱印込み）' },
      { key: 'shabutu_time', label: '所要時間', defaultValue: '約30〜60分（個人差があります）' },
      { key: 'shabutu_cta_sub', label: '予約ボタン下の説明文', defaultValue: '事前予約をおすすめします。当日受付も空きがあれば対応します。' },
    ],
  },
  {
    section: '数珠づくり体験',
    href: '/experience/jyuzu',
    fields: [
      { key: 'jyuzu_about_p1', label: '数珠づくりとは（段落1）', multiline: true, defaultValue: '数珠（じゅず）は、仏様を礼拝するときに手に持つ法具で、煩悩の数である108つの珠が一般的です。珠には天然石・木材・水晶などさまざまな素材があり、素材によって異なる功徳があるとされています。' },
      { key: 'jyuzu_about_p2', label: '数珠づくりとは（段落2）', multiline: true, defaultValue: '立木観音の数珠づくり体験では、複数の珠の種類からお好みの組み合わせを選び、自分だけのオリジナル数珠をお作りいただけます。完成した数珠は参拝・法要などさまざまな場面でお使いいただけます。' },
      { key: 'jyuzu_fee',  label: '体験料', defaultValue: '2,000円〜（珠の素材・組み合わせにより異なります）' },
      { key: 'jyuzu_time', label: '所要時間', defaultValue: '約60〜90分' },
      { key: 'jyuzu_price_note', label: '料金についての補足', multiline: true, defaultValue: 'お選びいただく珠の素材・数・組み合わせによって料金が異なります。詳しくは受付窓口またはお問い合わせフォームよりご確認ください。' },
      { key: 'jyuzu_cta_sub', label: '予約ボタン下の説明文', defaultValue: '材料の準備がありますので、事前のご予約をお願いします。' },
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
    SECTIONS.forEach(({ fields }) => fields.forEach(f => { if (f.defaultValue) defaults[f.key] = f.defaultValue }))
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
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
              {fields.map(({ key, label, multiline, defaultValue }) => (
                <div key={key}>
                  <label className="admin-label">{label}</label>
                  {multiline ? (
                    <textarea
                      className="admin-input min-h-[100px]"
                      value={values[key] ?? ''}
                      placeholder={defaultValue}
                      onChange={e => setValues(v => ({ ...v, [key]: e.target.value }))}
                    />
                  ) : (
                    <input
                      type="text"
                      className="admin-input"
                      value={values[key] ?? ''}
                      placeholder={defaultValue}
                      onChange={e => setValues(v => ({ ...v, [key]: e.target.value }))}
                    />
                  )}
                  <div className="mt-2 flex justify-end">
                    <button
                      onClick={() => save(key)}
                      disabled={saving === key}
                      className="btn-primary text-sm px-5 py-2 disabled:opacity-50"
                    >
                      {saving === key ? '保存中...' : saved === key ? '✓ 保存しました' : '保存'}
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
