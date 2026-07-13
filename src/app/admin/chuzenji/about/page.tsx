'use client'
import SectionEditor from '@/components/admin/SectionEditor'

const J = (v: unknown) => JSON.stringify(v)

const FIELDS = [
  { key: 'about_fee_adult', label: '大人 拝観料', defaultValue: '500円' },
  { key: 'about_fee_child', label: '子供 拝観料', defaultValue: '200円' },
  { key: 'about_hours_peak',     label: '4月〜10月 拝観時間', defaultValue: '午前8時〜午後5時' },
  { key: 'about_hours_shoulder', label: '11月・3月 拝観時間', defaultValue: '午前8時〜午後4時' },
  { key: 'about_hours_winter',   label: '12月〜2月 拝観時間', defaultValue: '午前8時30分〜午後3時30分' },
  {
    key: 'about_flow', label: '参拝の流れ', type: 'list' as const,
    listFields: [{ key: 'title', label: 'ステップ名' }, { key: 'text', label: '説明', multiline: true }],
    defaultValue: J([
      { title: '拝観受付', text: '入口にて拝観料をお納めください。大人500円・子供200円。受付は閉門30分前に終了いたします。' },
      { title: '山門をくぐる', text: '山門をくぐり、境内へお進みください。' },
      { title: '御朱印受付', text: '山門をくぐってすぐの御朱印所にて、御朱印やお守りをお受けいただけます。場所によって授与しているお守りが異なります。' },
      { title: '本堂参拝', text: 'ご本尊・立木観音（千手観世音菩薩）にお参りください。本堂でも一部の授与品をお受けいただけます。' },
      { title: '五大堂', text: '中禅寺湖を一望できる五大堂へ。天井に描かれた龍の墨絵も必見です。各所で取り扱いが異なりますので、ぜひ各所でご覧ください。' },
    ]),
  },
  { key: 'about_grant_text', label: '授与品についての説明', multiline: true, defaultValue: 'お守り・御朱印などの授与品は、御朱印所・五大堂・本堂の3か所でお受けいただけます。場所によって授与しているお守りが異なりますので、各所でぜひご覧ください。' },
  {
    key: 'about_notes', label: 'ご参拝の注意事項', type: 'list' as const,
    listFields: [{ key: 'text', label: '注意事項', multiline: true }],
    defaultValue: J([
      { text: '境内では静粛にお過ごしください。' },
      { text: '撮影は外観のみ可能です。本堂内は撮影禁止となっております。' },
      { text: 'ペットの同伴は境内に限り可能です。本堂・五大堂などの堂内へのお連れ込みはご遠慮ください。' },
      { text: '境内での飲食はご遠慮ください。' },
      { text: '足元が不安定な箇所があります。歩きやすい靴でお越しください。' },
      { text: '混雑時はご参拝にお時間をいただく場合があります。' },
    ]),
  },
] as const

export default function AdminChuzenjAbout() {
  return <SectionEditor title="参拝について（拝観料金）" href="/about" fields={FIELDS as never} />
}
