export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MaterialSwatches from '@/components/MaterialSwatches'
import ZoomableImage from '@/components/ZoomableImage'
import InstagramEmbed from '@/components/InstagramEmbed'
import { getLocalizedContent } from '@/lib/site-content'
import type { Locale } from '@/i18n/routing'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'jyuzu' })
  return { title: t('title') }
}

const DEFAULT_FLOW = [
  { icon: '📿', title: '好きな珠を選ぶ', text: '天然石・天然木をご自由に組み合わせてお選びいただけます。', image: '/images/chuzenji/experience/jyuzu/erabu.jpg' },
  { icon: '🤲', title: '数珠を作る', text: 'スタッフが丁寧にサポートしますので、どなたでも簡単にお作りいただけます。', image: '/images/chuzenji/experience/jyuzu/tukuru.jpg' },
  { icon: '🙏', title: 'ご祈祷', text: '僧侶がご祈祷し、お守りとして当日お持ち帰りいただけます。', image: '/images/chuzenji/experience/jyuzu/kitousuru.jpg' },
]
const DEFAULT_FLOW_EN = [
  { icon: '📿', title: 'Choose Your Beads', text: 'Freely combine natural stone and wood beads to your liking.', image: '/images/chuzenji/experience/jyuzu/erabu.jpg' },
  { icon: '🤲', title: 'Make Your Bracelet', text: 'Our staff will guide you carefully, so anyone can make one easily.', image: '/images/chuzenji/experience/jyuzu/tukuru.jpg' },
  { icon: '🙏', title: 'Blessing', text: 'A priest will bless it, and you can take it home the same day as an omamori charm.', image: '/images/chuzenji/experience/jyuzu/kitousuru.jpg' },
]
const DEFAULT_MATERIALS = [
  { name: '天然木', desc: '軽くて使いやすい木の珠。温かみのある手触りが特徴です。' },
  { name: '天然石', desc: '色とりどりの天然石の珠。お好みの色でお選びいただけます。' },
]
const DEFAULT_MATERIALS_EN = [
  { name: 'Natural Wood', desc: 'Lightweight, easy-to-wear wooden beads, known for their warm texture.' },
  { name: 'Natural Stone', desc: 'Colorful natural stone beads, available in your favorite colors.' },
]
const DEFAULT_SAMPLES = [
  { course: 'Aコース', price: '2,000円', desc: '天然木で作るスタンダードな数珠' },
  { course: 'Bコース', price: '4,000円', desc: '天然石と天然木の個性あふれる数珠' },
  { course: 'Cコース', price: '6,000円', desc: '天然石のみで作る特別な数珠' },
]
const DEFAULT_SAMPLES_EN = [
  { course: 'Course A', price: '¥2,000', desc: 'A standard bracelet made of natural wood' },
  { course: 'Course B', price: '¥4,000', desc: 'A distinctive bracelet mixing natural stone and wood' },
  { course: 'Course C', price: '¥6,000', desc: 'A special bracelet made entirely of natural stone' },
]
const COURSE_IMAGES = ['/images/chuzenji/experience/jyuzu/a-nennjyu.png', '/images/chuzenji/experience/jyuzu/b-nennjyu.png', '/images/chuzenji/experience/jyuzu/c-nennjyu.png']
const DEFAULT_NOTES = [
  { text: '数珠はすべてブレスレットタイプです。' },
  { text: '参拝料（拝観料）は別途お求めください。' },
  { text: '僧侶がご祈祷したものを当日お守りとしてお持ち帰りいただけます。僧侶が不在の場合、後日ご祈祷後郵送いたします（郵送料は当寺負担）。' },
  { text: '団体でお越しの際は事前にお電話ください。' },
]
const DEFAULT_NOTES_EN = [
  { text: 'All bracelets are wrist-worn style.' },
  { text: 'Please pay the visiting admission fee separately.' },
  { text: 'A priest blesses your bracelet, which you take home the same day as an omamori charm. If no priest is available, it will be blessed later and mailed to you (postage covered by the temple).' },
  { text: 'For group visits, please call in advance.' },
]
type Swatch = { name: string; image: string; desc: string }

const DEFAULT_STONE_SWATCHES: Swatch[] = [
  { name: '水晶', image: '/images/chuzenji/experience/jyuzu/swatches/stone-suisho.png', desc: '浄化作用があり、邪気を払い、災難を防ぐとされる万能の石です。' },
  { name: '紅水晶', image: '/images/chuzenji/experience/jyuzu/swatches/stone-benisuisho.png', desc: '内面の美しさを輝かせるご利益があるとされています。' },
  { name: 'ラピスラズリ', image: '/images/chuzenji/experience/jyuzu/swatches/stone-lapis.png', desc: '知性・直観力を高め、幸運を引き寄せるとされています。' },
  { name: 'アメジスト', image: '/images/chuzenji/experience/jyuzu/swatches/stone-amethyst.png', desc: 'マイナスエネルギーをプラスに導くご利益があるとされる紫の石です。' },
  { name: 'メノウ', image: '/images/chuzenji/experience/jyuzu/swatches/stone-menou.png', desc: '健康や長寿、子宝をもたらすとされる石です。' },
  { name: 'ピンクタイガーアイ', image: '/images/chuzenji/experience/jyuzu/swatches/stone-pinktiger.png', desc: '仕事運・恋愛運・金運アップのご利益があるとされています。' },
  { name: 'ゴールドシルバータイガーアイ', image: '/images/chuzenji/experience/jyuzu/swatches/stone-goldtiger.png', desc: '視野を広げ、正しい判断と行動で成功へと導くとされています。' },
  { name: 'トラメ石', image: '/images/chuzenji/experience/jyuzu/swatches/stone-torame.png', desc: '決断力・行動力を高めるとされる石です。' },
  { name: '赤トラメ石', image: '/images/chuzenji/experience/jyuzu/swatches/stone-akatorame.png', desc: '幸運を招き、霊力を授けるとされる石です。' },
  { name: 'ライトブルータイガーアイ', image: '/images/chuzenji/experience/jyuzu/swatches/stone-lightbluetiger.png', desc: '冷静さや判断力を高めるとされるタイガーアイの一種です。' },
  { name: 'ミックスタイガーアイ', image: '/images/chuzenji/experience/jyuzu/swatches/stone-mixtiger.png', desc: '成功や勝利、チャンスをつかむご利益があるとされています。' },
  { name: 'パープルキャッツアイ', image: '/images/chuzenji/experience/jyuzu/swatches/stone-purplecatseye.png', desc: '直感力を研ぎ澄まし、判断力を強めるとされる石です。' },
  { name: 'ピーチジェイド', image: '/images/chuzenji/experience/jyuzu/swatches/stone-peachjade.png', desc: '心と体のバランスを整えるとされる石です。' },
  { name: '茶金石', image: '/images/chuzenji/experience/jyuzu/swatches/stone-chakinseki.png', desc: '精神を安定させ、心の疲れを癒すとされる石です。' },
  { name: '紫金石', image: '/images/chuzenji/experience/jyuzu/swatches/stone-shikinseki.png', desc: '善い人や物、チャンスとの出会いを導くとされる石です。' },
  { name: 'ハウライト', image: '/images/chuzenji/experience/jyuzu/swatches/stone-howlite.png', desc: '厄除け効果があり、精神の安定・浄化、意志を強くするとされています。' },
  { name: 'エンジェライト', image: '/images/chuzenji/experience/jyuzu/swatches/stone-angelite.png', desc: 'ネガティブな感情を浄化し、優しさと癒しをもたらすとされています。' },
  { name: 'カーネリアン', image: '/images/chuzenji/experience/jyuzu/swatches/stone-carnelian.png', desc: '気力アップ・体を丈夫にし、迷いを断ち切るとされる石です。' },
  { name: 'オニキス', image: '/images/chuzenji/experience/jyuzu/swatches/stone-onyx.png', desc: '邪気祓い・厄除け・魔除けの効果があるとされる石です。' },
  { name: 'インド翡翠', image: '/images/chuzenji/experience/jyuzu/swatches/stone-indohisui.png', desc: '失った気力を回復させ、強いパワーで物事を成し遂げるとされています。' },
  { name: 'プラムジェイド', image: '/images/chuzenji/experience/jyuzu/swatches/stone-plumjade.png', desc: '気品と落ち着きをもたらすとされる、深みのある色合いの石です。' },
]
const DEFAULT_STONE_SWATCHES_EN: Swatch[] = [
  { name: 'Crystal', image: '/images/chuzenji/experience/jyuzu/swatches/stone-suisho.png', desc: 'An all-purpose stone said to purify, ward off negative energy, and prevent misfortune.' },
  { name: 'Rose Quartz', image: '/images/chuzenji/experience/jyuzu/swatches/stone-benisuisho.png', desc: 'Said to bring out inner beauty.' },
  { name: 'Lapis Lazuli', image: '/images/chuzenji/experience/jyuzu/swatches/stone-lapis.png', desc: 'Said to enhance intelligence and intuition, drawing good fortune.' },
  { name: 'Amethyst', image: '/images/chuzenji/experience/jyuzu/swatches/stone-amethyst.png', desc: 'A purple stone said to turn negative energy into positive.' },
  { name: 'Agate', image: '/images/chuzenji/experience/jyuzu/swatches/stone-menou.png', desc: 'Said to bring health, longevity, and blessings of children.' },
  { name: 'Pink Tiger Eye', image: '/images/chuzenji/experience/jyuzu/swatches/stone-pinktiger.png', desc: 'Said to boost career, romance, and financial fortune.' },
  { name: 'Gold Silver Tiger Eye', image: '/images/chuzenji/experience/jyuzu/swatches/stone-goldtiger.png', desc: 'Said to broaden perspective and lead to success through sound judgment and action.' },
  { name: 'Torame Stone', image: '/images/chuzenji/experience/jyuzu/swatches/stone-torame.png', desc: 'Said to strengthen decisiveness and initiative.' },
  { name: 'Red Torame Stone', image: '/images/chuzenji/experience/jyuzu/swatches/stone-akatorame.png', desc: 'Said to invite good fortune and bestow spiritual power.' },
  { name: 'Light Blue Tiger Eye', image: '/images/chuzenji/experience/jyuzu/swatches/stone-lightbluetiger.png', desc: 'A type of tiger eye said to enhance calmness and judgment.' },
  { name: 'Mixed Tiger Eye', image: '/images/chuzenji/experience/jyuzu/swatches/stone-mixtiger.png', desc: 'Said to bring success, victory, and the ability to seize opportunity.' },
  { name: 'Purple Cat\'s Eye', image: '/images/chuzenji/experience/jyuzu/swatches/stone-purplecatseye.png', desc: 'Said to sharpen intuition and strengthen judgment.' },
  { name: 'Peach Jade', image: '/images/chuzenji/experience/jyuzu/swatches/stone-peachjade.png', desc: 'Said to balance mind and body.' },
  { name: 'Bronzite', image: '/images/chuzenji/experience/jyuzu/swatches/stone-chakinseki.png', desc: 'Said to stabilize the spirit and heal mental fatigue.' },
  { name: 'Purple Sunstone', image: '/images/chuzenji/experience/jyuzu/swatches/stone-shikinseki.png', desc: 'Said to bring encounters with good people, things, and opportunities.' },
  { name: 'Howlite', image: '/images/chuzenji/experience/jyuzu/swatches/stone-howlite.png', desc: 'Said to ward off misfortune, stabilize and purify the spirit, and strengthen willpower.' },
  { name: 'Angelite', image: '/images/chuzenji/experience/jyuzu/swatches/stone-angelite.png', desc: 'Said to purify negative emotions and bring gentleness and healing.' },
  { name: 'Carnelian', image: '/images/chuzenji/experience/jyuzu/swatches/stone-carnelian.png', desc: 'Said to boost vitality, strengthen the body, and cut through hesitation.' },
  { name: 'Onyx', image: '/images/chuzenji/experience/jyuzu/swatches/stone-onyx.png', desc: 'Said to ward off negative energy and misfortune.' },
  { name: 'Indian Jade', image: '/images/chuzenji/experience/jyuzu/swatches/stone-indohisui.png', desc: 'Said to restore lost energy and accomplish tasks with strong power.' },
  { name: 'Plum Jade', image: '/images/chuzenji/experience/jyuzu/swatches/stone-plumjade.png', desc: 'A deeply colored stone said to bring elegance and composure.' },
]
const DEFAULT_WOOD_SWATCHES: Swatch[] = [
  { name: 'けやき', image: '/images/chuzenji/experience/jyuzu/swatches/wood-keyaki.png', desc: '古くから神木として親しまれ、成長・発展の象徴とされる木材です。' },
  { name: '黒檀', image: '/images/chuzenji/experience/jyuzu/swatches/wood-kokutan.png', desc: '高級木材として知られ、魔除け・厄除けのご利益があるとされます。' },
  { name: '紫檀', image: '/images/chuzenji/experience/jyuzu/swatches/wood-shitan.png', desc: '気品ある紫色が特徴で、健康長寿のご利益があるとされています。' },
  { name: '星月菩提樹', image: '/images/chuzenji/experience/jyuzu/swatches/wood-hoshizuki.png', desc: '表面の斑点が星と月に見えることからその名がつき、縁結びのご利益で知られます。' },
  { name: '梅', image: '/images/chuzenji/experience/jyuzu/swatches/wood-ume.png', desc: '「梅は百花の魁」といわれ、開運・厄除けの木として親しまれています。' },
  { name: 'つげ', image: '/images/chuzenji/experience/jyuzu/swatches/wood-tsuge.png', desc: '緻密で丈夫な木質が特徴で、印材にも使われる縁起の良い木材です。' },
  { name: '緑壇', image: '/images/chuzenji/experience/jyuzu/swatches/wood-ryokutan.png', desc: '爽やかな緑色が特徴で、癒やしと安らぎをもたらすとされています。' },
  { name: '鉄刀木', image: '/images/chuzenji/experience/jyuzu/swatches/wood-tagayasan.png', desc: '硬く丈夫な木質で知られ、魔除け・厄除けのご利益があるとされます。' },
  { name: 'シャム柿', image: '/images/chuzenji/experience/jyuzu/swatches/wood-shamugaki.png', desc: '縞模様が美しい銘木で、独特の風合いを楽しめる木材です。' },
  { name: '鉄刀木（ツヤ有）', image: '/images/chuzenji/experience/jyuzu/swatches/wood-tagayasan-tsuya.png', desc: '艶やかに仕上げられた鉄刀木の珠。硬く丈夫な木質で、魔除け・厄除けのご利益があるとされます。' },
  { name: '梅（ツヤ有）', image: '/images/chuzenji/experience/jyuzu/swatches/wood-ume-tsuya.png', desc: '艶やかに仕上げられた梅の珠。「梅は百花の魁」といわれ、開運・厄除けの木として親しまれています。' },
  { name: 'つげ（ツヤ有）', image: '/images/chuzenji/experience/jyuzu/swatches/wood-tsuge-tsuya.png', desc: '艶やかに仕上げられたつげの珠。緻密で丈夫な木質が特徴で、印材にも使われる縁起の良い木材です。' },
  { name: '椰', image: '/images/chuzenji/experience/jyuzu/swatches/wood-yashi.png', desc: '椰子の実を使った、素朴な模様が魅力の木材です。' },
]
const DEFAULT_WOOD_SWATCHES_EN: Swatch[] = [
  { name: 'Zelkova', image: '/images/chuzenji/experience/jyuzu/swatches/wood-keyaki.png', desc: 'Long cherished as a sacred tree, symbolizing growth and development.' },
  { name: 'Ebony', image: '/images/chuzenji/experience/jyuzu/swatches/wood-kokutan.png', desc: 'A prized luxury wood said to ward off evil and misfortune.' },
  { name: 'Rosewood', image: '/images/chuzenji/experience/jyuzu/swatches/wood-shitan.png', desc: 'Known for its elegant purple hue and blessings of health and longevity.' },
  { name: 'Bodhi Seed (Star & Moon)', image: '/images/chuzenji/experience/jyuzu/swatches/wood-hoshizuki.png', desc: 'Named for surface spots resembling stars and the moon, known for blessings of good relationships.' },
  { name: 'Plum Wood', image: '/images/chuzenji/experience/jyuzu/swatches/wood-ume.png', desc: 'Known as "the first of a hundred flowers," cherished as a tree of good fortune and warding off misfortune.' },
  { name: 'Boxwood', image: '/images/chuzenji/experience/jyuzu/swatches/wood-tsuge.png', desc: 'A fine, durable wood also used for seals — an auspicious material.' },
  { name: 'Green Ebony', image: '/images/chuzenji/experience/jyuzu/swatches/wood-ryokutan.png', desc: 'Known for its refreshing green color, said to bring healing and peace.' },
  { name: 'Tagayasan', image: '/images/chuzenji/experience/jyuzu/swatches/wood-tagayasan.png', desc: 'A hard, durable wood said to ward off evil and misfortune.' },
  { name: 'Siamese Ebony', image: '/images/chuzenji/experience/jyuzu/swatches/wood-shamugaki.png', desc: 'A prized wood with beautiful striped grain and a distinctive texture.' },
  { name: 'Tagayasan (Polished)', image: '/images/chuzenji/experience/jyuzu/swatches/wood-tagayasan-tsuya.png', desc: 'Polished tagayasan beads — a hard, durable wood said to ward off evil and misfortune.' },
  { name: 'Plum Wood (Polished)', image: '/images/chuzenji/experience/jyuzu/swatches/wood-ume-tsuya.png', desc: 'Polished plum wood beads — "the first of a hundred flowers," a tree of good fortune and warding off misfortune.' },
  { name: 'Boxwood (Polished)', image: '/images/chuzenji/experience/jyuzu/swatches/wood-tsuge-tsuya.png', desc: 'Polished boxwood beads — a fine, durable wood also used for seals, an auspicious material.' },
  { name: 'Coconut Wood', image: '/images/chuzenji/experience/jyuzu/swatches/wood-yashi.png', desc: 'Made from coconut shell, prized for its rustic, distinctive grain.' },
]

const DEFAULTS: Record<string, string> = {
  jyuzu_heading_about: '数珠づくりとは',
  jyuzu_heading_about_en: 'About Juzu Making',
  jyuzu_about_p1: '数珠（じゅず）は、仏様を礼拝するときに手に持つ法具です。当山の数珠づくり体験では、天然石・天然木の珠からご自由に組み合わせを選び、世界にひとつだけのオリジナル数珠（ブレスレット）をお作りいただけます。',
  jyuzu_about_p1_en: 'A juzu is a Buddhist prayer implement held in hand while worshipping. In this temple\'s juzu-making experience, you freely choose a combination from natural stone and wood beads to create your own one-of-a-kind bracelet.',
  jyuzu_about_p2: '職員が丁寧にご説明しますので、どなたでも簡単にお作りいただけます。僧侶がご祈祷したものを当日お守りとしてお持ち帰りいただけます。',
  jyuzu_about_p2_en: 'Our staff will explain carefully, so anyone can make one easily. A priest blesses your bracelet, which you take home the same day as an omamori charm.',
  jyuzu_heading_course: 'コース説明',
  jyuzu_heading_course_en: 'Course Details',
  jyuzu_course_desc: '天然石・天然木の組成は、コースごとに以下のようになります。',
  jyuzu_course_desc_en: 'The composition of natural stone and wood for each course is as follows.',
  jyuzu_heading_flow: '体験の流れ',
  jyuzu_heading_flow_en: 'Experience Flow',
  jyuzu_heading_fees: '開催日・料金',
  jyuzu_heading_fees_en: 'Days & Fees',
  jyuzu_days: '毎日開催（法要時は中止となる場合があります）',
  jyuzu_days_en: 'Held daily (may be suspended during ceremonies)',
  jyuzu_hours_summer: '4月〜10月：9:00〜15:00',
  jyuzu_hours_summer_en: 'April–October: 9:00 AM–3:00 PM',
  jyuzu_hours_winter: '11月〜3月：9:00〜14:00',
  jyuzu_hours_winter_en: 'November–March: 9:00 AM–2:00 PM',
  jyuzu_fee:  '2,000円〜（使用素材により異なります）',
  jyuzu_fee_en: 'From ¥2,000 (varies by material used)',
  jyuzu_time: '30分〜1時間（個人差があります）',
  jyuzu_time_en: '30 min–1 hour (varies by individual)',
  jyuzu_capacity: '1名〜20名まで',
  jyuzu_capacity_en: '1 to 20 people',
  jyuzu_target: '小学生以上（小学生は保護者同伴）',
  jyuzu_target_en: 'Elementary school age and up (children must be accompanied by a guardian)',
  jyuzu_place: '大黒天堂窓口',
  jyuzu_place_en: 'Daikokuten Hall Counter',
  jyuzu_price_note_label: '料金について',
  jyuzu_price_note_label_en: 'About Pricing',
  jyuzu_price_note: 'お選びいただく珠の素材・組み合わせによって料金が異なります。詳しくは下記コース説明をご覧ください。',
  jyuzu_price_note_en: 'The fee varies depending on the bead material and combination you choose. Please see the course details below.',
  jyuzu_group_note_label: '団体のご案内',
  jyuzu_group_note_label_en: 'For Groups',
  jyuzu_group_note: '数珠づくり体験、団体のご予約も承っております。20名様を超える場合は、ご相談ください。',
  jyuzu_group_note_en: 'Group reservations for the juzu-making experience are also welcome. For groups over 20 people, please contact us.',
  jyuzu_heading_materials: '選べる珠',
  jyuzu_heading_materials_en: 'Choose Your Beads',
  jyuzu_materials_hint: '珠をタップすると説明が表示されます',
  jyuzu_materials_hint_en: 'Tap a bead to see its description',
  jyuzu_materials_note: '珠の種類は季節・入荷状況により変わります。当日の受付窓口でご確認ください。',
  jyuzu_materials_note_en: 'Available bead types vary by season and stock. Please check at the reception counter on the day.',
  jyuzu_heading_notes: 'ご注意・持ち物',
  jyuzu_heading_notes_en: 'Notes & What to Bring',
  jyuzu_cta_heading: '数珠づくり体験のご予約',
  jyuzu_cta_heading_en: 'Reservations for the Juzu Making Experience',
  jyuzu_cta_sub: '毎日開催しております。団体でお越しの際は事前にお電話ください。',
  jyuzu_cta_sub_en: 'Held daily. For group visits, please call in advance.',
  jyuzu_heading_instagram: 'みなさんの投稿',
  jyuzu_heading_instagram_en: 'Visitor Posts',
  jyuzu_instagram_hint: '「#中禅寺立木観音」「#数珠づくり体験」のハッシュタグをつけて投稿すると、こちらでご紹介させていただくことがあります。',
  jyuzu_instagram_hint_en: 'Posts tagged with both "#中禅寺立木観音" and "#数珠づくり体験" may be featured here.',
  jyuzu_instagram_urls: '[]',
  jyuzu_flow: JSON.stringify(DEFAULT_FLOW),
  jyuzu_flow_en: JSON.stringify(DEFAULT_FLOW_EN),
  jyuzu_samples: JSON.stringify(DEFAULT_SAMPLES),
  jyuzu_samples_en: JSON.stringify(DEFAULT_SAMPLES_EN),
  jyuzu_materials: JSON.stringify(DEFAULT_MATERIALS),
  jyuzu_materials_en: JSON.stringify(DEFAULT_MATERIALS_EN),
  jyuzu_notes: JSON.stringify(DEFAULT_NOTES),
  jyuzu_notes_en: JSON.stringify(DEFAULT_NOTES_EN),
  jyuzu_stones: JSON.stringify(DEFAULT_STONE_SWATCHES.map(({ name, desc }) => ({ name, desc }))),
  jyuzu_stones_en: JSON.stringify(DEFAULT_STONE_SWATCHES_EN.map(({ name, desc }) => ({ name, desc }))),
  jyuzu_woods: JSON.stringify(DEFAULT_WOOD_SWATCHES.map(({ name, desc }) => ({ name, desc }))),
  jyuzu_woods_en: JSON.stringify(DEFAULT_WOOD_SWATCHES_EN.map(({ name, desc }) => ({ name, desc }))),
}

function pj<T>(s: string, fallback: T): T { try { return JSON.parse(s) } catch { return fallback } }

async function getContent() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  try {
    const keys = Object.keys(DEFAULTS).join(',')
    const res = await fetch(`${url}/rest/v1/site_content?key=in.(${keys})&select=key,value`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` }, cache: 'no-store',
    })
    if (!res.ok) return DEFAULTS
    const rows: { key: string; value: string }[] = await res.json()
    const map = { ...DEFAULTS }
    rows.forEach(r => { if (r.value) map[r.key] = r.value })
    return map
  } catch { return DEFAULTS }
}

export default async function JyuzuPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const loc = locale as Locale
  const t = await getTranslations('jyuzu')
  const tc = await getTranslations('common')
  const content = await getContent()
  const g = (key: string) => getLocalizedContent(content, key, loc)
  const flowRaw   = pj<{ title: string; text: string }[]>(g('jyuzu_flow'), DEFAULT_FLOW)
  const flowDefault = loc === 'en' ? DEFAULT_FLOW_EN : DEFAULT_FLOW
  const flow      = flowRaw.map((f, i) => ({ ...flowDefault[i], ...f }))
  const samples   = pj<typeof DEFAULT_SAMPLES>(g('jyuzu_samples'), DEFAULT_SAMPLES)
  const materials = pj<typeof DEFAULT_MATERIALS>(g('jyuzu_materials'), DEFAULT_MATERIALS)
  const notes     = pj<typeof DEFAULT_NOTES>(g('jyuzu_notes'), DEFAULT_NOTES)
  const stonesDefault = loc === 'en' ? DEFAULT_STONE_SWATCHES_EN : DEFAULT_STONE_SWATCHES
  const woodsDefault  = loc === 'en' ? DEFAULT_WOOD_SWATCHES_EN : DEFAULT_WOOD_SWATCHES
  const stonesRaw = pj<{ name: string; desc: string }[]>(g('jyuzu_stones'), stonesDefault)
  const woodsRaw  = pj<{ name: string; desc: string }[]>(g('jyuzu_woods'), woodsDefault)
  const stones = stonesRaw.map((s, i) => ({ image: stonesDefault[i]?.image ?? stonesDefault[0].image, ...s }))
  const woods  = woodsRaw.map((s, i) => ({ image: woodsDefault[i]?.image ?? woodsDefault[0].image, ...s }))
  const instagramUrls = pj<{ url: string }[]>(g('jyuzu_instagram_urls'), [])
    .map(({ url }) => url?.trim())
    .filter((url): url is string => !!url)

  return (
    <>
      <Header />
      <main className="pt-16">
        <div className="bg-cream-alt px-4 py-2 text-xs text-gray-400">
          <div className="max-w-4xl mx-auto">
            <Link href="/">{tc('breadcrumbHome')}</Link> &gt; <Link href="/reserve">{t('breadcrumbReserve')}</Link> &gt; {t('title')}
          </div>
        </div>

        {/* ヒーロー */}
        <section className="relative h-80 md:h-[28rem]">
          <ZoomableImage src="/images/chuzenji/experience/jyuzu/jyuzu-hero.jpg" alt={t('title')} fill priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/50 to-navy/20 flex flex-col justify-center px-6 md:px-16">
            <p className="text-gold text-xs tracking-[0.3em] mb-3">Juzu Making</p>
            <h1 className="font-serif text-3xl md:text-5xl text-white tracking-widest mb-3">{t('title')}</h1>
            <p className="text-white/80 text-sm md:text-base mb-6">{t('heroSub')}</p>
            <div>
              <Link href="/reserve?type=jyuzu" className="btn-gold">{t('heroCta')}</Link>
            </div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 py-14 space-y-16">
          {/* 数珠づくりとは */}
          <section className="grid md:grid-cols-2 gap-6 items-center">
            <div className="relative h-56 md:h-72 rounded-2xl overflow-hidden shadow-sm">
              <Image src="/images/chuzenji/experience/jyuzu/jyuzu-hero.jpg" alt="数珠づくりとは" fill className="object-cover" />
            </div>
            <div>
              <h2 className="text-xl font-serif text-navy pl-3 border-l-4 border-gold mb-4">{g('jyuzu_heading_about')}</h2>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">{g('jyuzu_about_p1')}</p>
              <p className="text-sm text-gray-700 leading-relaxed">{g('jyuzu_about_p2')}</p>
            </div>
          </section>

          {/* コース説明（組成図） */}
          <section id="course">
            <h2 className="text-xl font-serif text-navy pl-3 border-l-4 border-gold mb-4">{g('jyuzu_heading_course')}</h2>
            <p className="text-sm text-gray-600 mb-5">{g('jyuzu_course_desc')}</p>
            <div className="grid grid-cols-3 gap-3">
              {samples.map(({ course, price, desc }, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm text-center border-t-4 border-gold">
                  <div className="relative aspect-square bg-cream-alt">
                    <Image src={COURSE_IMAGES[i] ?? '/images/chuzenji/experience/jyuzu/jyuzu.png'} alt={desc} fill className="object-contain p-2" />
                  </div>
                  <div className="p-3">
                    <p className="text-[10px] text-gold font-medium tracking-wide">{course}</p>
                    <p className="font-serif text-navy font-bold">{price}</p>
                    <p className="text-xs text-gray-500 mt-1">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 体験の流れ */}
          <section>
            <h2 className="text-xl font-serif text-navy text-center mb-1">{g('jyuzu_heading_flow')}</h2>
            <div className="w-10 h-0.5 bg-gold mx-auto mb-8" />
            <div className="grid md:grid-cols-3 gap-6 md:gap-4">
              {flow.map(({ icon, title, text, image }, i) => (
                <div key={i} className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-9 h-9 rounded-full bg-navy text-gold flex items-center justify-center text-sm font-serif font-bold flex-shrink-0">{i + 1}</span>
                    <span className="text-xl">{icon}</span>
                    <h3 className="font-medium text-navy">{title}</h3>
                    {i < flow.length - 1 && (
                      <span className="hidden md:block ml-auto text-gold text-xl">→</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">{text}</p>
                  {image && (
                    <div className="relative h-40 rounded-xl overflow-hidden shadow-sm">
                      <ZoomableImage src={image} alt={title} fill className="object-cover" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* 開催日・料金 */}
          <section>
            <h2 className="text-xl font-serif text-navy pl-3 border-l-4 border-gold mb-4">{g('jyuzu_heading_fees')}</h2>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <tbody>
                  {[
                    [t('tableDays'), g('jyuzu_days')],
                    [t('tableTime'), `${g('jyuzu_hours_summer')}　${g('jyuzu_hours_winter')}`],
                    [t('tableDuration'), g('jyuzu_time')],
                    [t('tableCapacity'), g('jyuzu_capacity')],
                    [t('tableFee'), g('jyuzu_fee')],
                    [t('tableTarget'), g('jyuzu_target')],
                    [t('tablePlace'), g('jyuzu_place')],
                  ].map(([k, v]) => (
                    <tr key={k} className="border border-gray-200">
                      <th className="bg-navy text-white text-left px-4 py-3 w-32 text-sm font-medium whitespace-nowrap">{k}</th>
                      <td className="px-4 py-3 bg-white whitespace-pre-line">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-gray-700 mb-4">
              <p className="font-bold text-amber-700 text-xs mb-1">{g('jyuzu_price_note_label')}</p>
              <p>{g('jyuzu_price_note')}</p>
            </div>
            <div className="bg-cream-alt border border-gray-200 rounded-lg p-4 text-sm text-gray-700">
              <p className="font-bold text-navy text-xs mb-1">{g('jyuzu_group_note_label')}</p>
              <p>{g('jyuzu_group_note')}</p>
            </div>
          </section>

          {/* 選べる珠 */}
          <section id="materials" className="bg-cream-alt -mx-4 px-4 py-10 md:-mx-8 md:px-8 rounded-2xl">
            <h2 className="text-xl font-serif text-navy text-center mb-1">{g('jyuzu_heading_materials')}</h2>
            <div className="w-10 h-0.5 bg-gold mx-auto mb-2" />
            <p className="text-xs text-gray-400 text-center mb-8">{g('jyuzu_materials_hint')}</p>

            <MaterialSwatches title={t('naturalStone')} swatches={stones} />
            <MaterialSwatches title={t('naturalWood')} swatches={woods} />

            <p className="text-sm text-gray-600 mb-5 mt-8 text-center">{g('jyuzu_materials_note')}</p>
            <div className="grid grid-cols-2 gap-4">
              {materials.map(({ name, desc }, i) => (
                <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="font-medium text-navy mb-1">{name}</p>
                  <p className="text-xs text-gray-600 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-serif text-navy pl-3 border-l-4 border-gold mb-4">{g('jyuzu_heading_notes')}</h2>
            <ul className="space-y-2">
              {notes.map(({ text }, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-700 bg-white rounded-lg px-4 py-3 shadow-sm border-l-4 border-gold">{text}</li>
              ))}
            </ul>
          </section>

          {/* みなさんの投稿（Instagram） */}
          {instagramUrls.length > 0 && (
            <section>
              <h2 className="text-xl font-serif text-navy text-center mb-1">{g('jyuzu_heading_instagram')}</h2>
              <div className="w-10 h-0.5 bg-gold mx-auto mb-2" />
              <p className="text-xs text-gray-400 text-center mb-8">{g('jyuzu_instagram_hint')}</p>
              <InstagramEmbed urls={instagramUrls} />
            </section>
          )}

          <div className="bg-navy rounded-2xl p-8 text-center text-white">
            <p className="font-serif text-xl mb-2">{g('jyuzu_cta_heading')}</p>
            <p className="text-white/60 text-sm mb-6">{g('jyuzu_cta_sub')}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/reserve?type=jyuzu" className="btn-gold">{t('reserveCta')}</Link>
              <Link href="/contact" className="btn-outline">{t('contactCta')}</Link>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Link href="/experience/shakyou" className="flex flex-col items-center gap-2 p-5 bg-white rounded-xl border shadow-sm hover:bg-navy hover:text-white hover:-translate-y-1 transition-all group text-center">
              <span className="text-2xl">📜</span>
              <span className="text-sm font-medium text-navy group-hover:text-white">{t('quickShakyou')}</span>
            </Link>
            <Link href="/experience/shabutu" className="flex flex-col items-center gap-2 p-5 bg-white rounded-xl border shadow-sm hover:bg-navy hover:text-white hover:-translate-y-1 transition-all group text-center">
              <span className="text-2xl">🖌️</span>
              <span className="text-sm font-medium text-navy group-hover:text-white">{t('quickShabutu')}</span>
            </Link>
            <Link href="/experience/zazen" className="flex flex-col items-center gap-2 p-5 bg-white rounded-xl border shadow-sm hover:bg-navy hover:text-white hover:-translate-y-1 transition-all group text-center">
              <span className="text-2xl">🧘</span>
              <span className="text-sm font-medium text-navy group-hover:text-white">{t('quickZazen')}</span>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
