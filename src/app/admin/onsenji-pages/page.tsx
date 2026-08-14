'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import ListEditor, { type ListField } from '@/components/admin/ListEditor'

type TextField = { key: string; label: string; hint?: string; multiline?: boolean; defaultValue?: string; type?: 'text'; translatable?: boolean }
type ListFieldDef = { key: string; label: string; type: 'list'; listFields: ListField[]; defaultValue: string; translatable?: boolean; defaultValueEn?: string }
type BooleanField = { key: string; label: string; type: 'boolean'; defaultValue?: string; checkboxLabel?: string }
type Field = TextField | ListFieldDef | BooleanField
type Section = { section: string; href: string; fields: Field[] }

const J = (v: unknown) => JSON.stringify(v)

const SECTIONS: Section[] = [
  {
    section: 'トップページ',
    href: '/onsenji',
    fields: [
      { key: 'onsenji_hero_en',    label: 'ヒーロー 英語サブタイトル', defaultValue: 'Nikkozan Onsenji Temple' },
      { key: 'onsenji_hero_title', label: 'ヒーロー メインキャッチコピー（改行可）', multiline: true, defaultValue: '千二百余年の祈りを宿す\n薬師の霊場', translatable: true },
      { key: 'onsenji_hero_sub',   label: 'ヒーロー サブコピー', multiline: true, defaultValue: '世界遺産・日光山輪王寺の別院。薬師瑠璃光如来のご加護と、大地から湧く温泉の癒しを', translatable: true },
      { key: 'onsenji_heading_news', label: '「お知らせ」見出し（記事自体は管理画面の「お知らせ管理」で編集）', defaultValue: 'お知らせ', translatable: true },
      { key: 'onsenji_about_title', label: '「温泉寺について」見出し', defaultValue: '温泉寺について', translatable: true },
      {
        key: 'onsenji_about_cards', label: 'カード（歴史・拝観料金・境内案内・年間行事の順、4件固定）', type: 'list',
        listFields: [{ key: 'label', label: 'タイトル' }, { key: 'desc', label: '説明' }],
        defaultValue: J([
          { label: '温泉寺の歴史', desc: '歴史と縁起' },
          { label: '拝観料金',     desc: '拝観料・各種料金' },
          { label: '境内のご案内', desc: '見どころ・境内マップ' },
          { label: '年間行事',     desc: '法要・行事のご案内' },
        ]),
        translatable: true,
        defaultValueEn: J([
          { label: 'History of Onsenji', desc: 'History & origins' },
          { label: 'Admission Fees',     desc: 'Admission & other fees' },
          { label: 'Grounds Guide',      desc: 'Highlights & temple map' },
          { label: 'Annual Events',      desc: 'Services & event information' },
        ]),
      },
      { key: 'onsenji_heading_goryaku', label: '「主なご利益」見出し', defaultValue: '主なご利益', translatable: true },
      {
        key: 'onsenji_goryaku_cards', label: 'ご利益カード（4件固定）', type: 'list',
        listFields: [{ key: 'icon', label: 'アイコン（絵文字）' }, { key: 'title', label: 'タイトル' }, { key: 'desc', label: '説明' }],
        defaultValue: J([
          { icon: '🌿', title: '病気平癒', desc: '薬師瑠璃光如来の御力で病気の回復をお祈りします' },
          { icon: '💧', title: '健康増進', desc: '大地から湧く温泉と仏縁で心身ともに清まります' },
          { icon: '⏳', title: '延命長寿', desc: '医王如来とも呼ばれる薬師如来の御加護を' },
          { icon: '✨', title: '開運招福', desc: '千二百余年の祈りが積み重なる霊場のご加護を' },
        ]),
        translatable: true,
        defaultValueEn: J([
          { icon: '🌿', title: 'Healing from Illness', desc: 'Prayers for recovery through the power of Yakushi Nyorai' },
          { icon: '💧', title: 'Better Health',        desc: 'Purify body and mind with the hot spring and Buddhist blessings' },
          { icon: '⏳', title: 'Longevity',            desc: 'The protection of Yakushi Nyorai, the "King of Medicine Buddha"' },
          { icon: '✨', title: 'Good Fortune',         desc: 'Over 1,200 years of accumulated prayer at this sacred site' },
        ]),
      },
      { key: 'onsenji_heading_menu', label: '「温泉・体験メニュー」見出し', defaultValue: '温泉・体験メニュー', translatable: true },
      {
        key: 'onsenji_menu_cards', label: 'メニューカード（薬師の湯・写経・写仏の順、3件固定）', type: 'list',
        listFields: [{ key: 'title', label: 'タイトル' }, { key: 'desc', label: '説明' }],
        defaultValue: J([
          { title: '薬師の湯', desc: '令和8年4月開湯。含硫黄泉の完全かけ流し。参拝の後、心身を清めるひとときを。' },
          { title: '写経体験', desc: '1,000円・約15分・毎日実施。特別御朱印授与。心を静めてお経をお写しいただけます。' },
          { title: '写仏体験', desc: '1,000円・約30〜60分。薬師瑠璃光如来をお描きいただき、特別御朱印をお授けします。' },
        ]),
        translatable: true,
        defaultValueEn: J([
          { title: 'Yakushi-no-Yu Hot Spring', desc: 'Opened April 2026. Fully sourced, sulfur-rich spring water. A moment to purify body and mind after worship.' },
          { title: 'Sutra Copying',            desc: '¥1,000 · approx. 15 min · daily. Includes a special goshuin stamp. Quiet your mind while copying sutras.' },
          { title: 'Buddhist Image Tracing',   desc: '¥1,000 · approx. 30–60 min. Trace the image of Yakushi Nyorai and receive a special goshuin stamp.' },
        ]),
      },
      { key: 'onsenji_heading_goshuin', label: '「御朱印」見出し', defaultValue: '御朱印', translatable: true },
      { key: 'onsenji_goshuin_desc',    label: '「御朱印」説明文', multiline: true, defaultValue: '温泉寺の御朱印は境内にてお受けいただけます。写経体験では特別御朱印をお授けします。', translatable: true },
      { key: 'onsenji_heading_access', label: '「アクセス」見出し', defaultValue: 'アクセス', translatable: true },
      { key: 'onsenji_access_address', label: 'アクセス 所在地', defaultValue: '栃木県日光市湯元2559', translatable: true },
      { key: 'onsenji_access_car',  label: 'アクセス お車での説明', multiline: true, defaultValue: '日光宇都宮道路 日光ICより約10分\n境内周辺に有料駐車場あり', translatable: true },
      { key: 'onsenji_access_bus',  label: 'アクセス バスでの説明', multiline: true, defaultValue: '東武日光駅・JR日光駅よりバスで「西参道」バス停下車、徒歩約10分\nまたは「表参道」バス停より徒歩約15分', translatable: true },
    ],
  },
  {
    section: '温泉寺の歴史',
    href: '/onsenji/history',
    fields: [
      { key: 'onsenji_history_subtitle', label: '見出し（サブタイトル）', defaultValue: '日光山温泉寺の由緒と縁起', translatable: true },
      { key: 'onsenji_history_heading_founding', label: '「創建の由来」見出し', defaultValue: '創建の由来', translatable: true },
      { key: 'onsenji_history_p1', label: '創建の由来（段落1）', multiline: true, defaultValue: '日光山温泉寺は、延暦7年（788年）に勝道上人によって開かれた世界遺産「日光山輪王寺」の別院です。勝道上人は日光山を開いた高僧で、この地で温泉の湧き出るのを発見し、薬師瑠璃光如来をお祀りしたのが温泉寺の起こりとされています。', translatable: true },
      { key: 'onsenji_history_p2', label: '創建の由来（段落2）', multiline: true, defaultValue: 'ご本尊は薬師瑠璃光如来（医王如来）で、健康増進・延命長寿のご利益で信仰を集めてきました。江戸時代には輪王寺宮の直轄寺院として栄え、昭和48年に現在地に再建された後も、多くの参拝者に親しまれています。', translatable: true },
      { key: 'onsenji_history_heading_timeline', label: '「歴史の流れ」見出し', defaultValue: '歴史の流れ', translatable: true },
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
        translatable: true,
        defaultValueEn: J([
          { year: 'Enryaku 7 (788 CE)', title: 'Founded by Priest Shodo', text: 'Priest Shodo, who opened Mt. Nikko, discovered hot spring water rising from this ground. He enshrined Yakushi Nyorai here, founding Onsenji.' },
          { year: 'Heian to Kamakura Periods', title: 'Flourished as a Tendai Sacred Site', text: 'Developed as a base for Tendai mountain ascetic practice, drawing many monks and pilgrims.' },
          { year: 'Edo Period', title: 'Became a Directly Administered Temple of Rinnoji', text: 'Protected and maintained as a temple directly administered by the Rinnoji-no-miya princely abbot. Worship flourished alongside pilgrimages to Nikko Toshogu.' },
          { year: 'September, Showa 41 (1966)', title: 'Landslide from a Typhoon', text: 'A typhoon caused a landslide that completely destroyed the Yakushi Hall. Remarkably, the statue of Yakushi Nyorai was found unharmed atop a fallen boulder, astonishing those who witnessed it.' },
          { year: 'Showa 48 (1973)', title: 'Rebuilt at the Current Site as Onsenji', text: 'Rebuilt at its present location (2300 Yamauchi, Nikko) as Onsenji, continuing today as a branch temple of the World Heritage site Nikkozan Rinnoji.' },
          { year: 'April, Reiwa 8 (2026)', title: 'Opening of "Yakushi-no-Yu"', text: 'Sulfur–calcium–sodium–sulfate–bicarbonate spring water (71.4°C), drawn directly from the source, was opened to visitors.' },
        ]),
      },
      { key: 'onsenji_history_heading_honzon', label: '「ご本尊」見出し', defaultValue: 'ご本尊・薬師如来について', translatable: true },
      { key: 'onsenji_history_honzon', label: 'ご本尊・薬師瑠璃光如来について', multiline: true, defaultValue: '薬師瑠璃光如来（やくしるりこうにょらい）は「医王如来」とも呼ばれ、あらゆる病気や苦しみを癒す仏様として信仰されています。昭和41年の台風被害の際、薬師堂が全壊したにもかかわらず、如来像は大岩の上に無傷でご鎮座されていたという言い伝えが残り、その霊験はことのほか篤いとされています。', translatable: true },
      { key: 'onsenji_history_heading_bando', label: '「霊場としての温泉寺」見出し', defaultValue: '霊場としての温泉寺', translatable: true },
      { key: 'onsenji_history_bando', label: '霊場としての温泉寺', multiline: true, defaultValue: '温泉寺は日光山輪王寺の別院として、世界遺産「日光の社寺」エリアに位置しています。東照宮・二荒山神社・輪王寺という三つの世界遺産に囲まれた境内は、四季折々の自然とともに参拝者を静かに迎えています。', translatable: true },
    ],
  },
  {
    section: '境内のご案内',
    href: '/onsenji/grounds',
    fields: [
      { key: 'onsenji_grounds_subtitle', label: '見出し（ヒーロー サブタイトル）', defaultValue: '見どころ・薬師の湯・境内マップ', translatable: true },
      { key: 'onsenji_grounds_heading_map', label: '「境内マップ・主な見どころ」見出し', defaultValue: '境内マップ・主な見どころ', translatable: true },
      { key: 'onsenji_grounds_map_hint', label: '地図の操作案内文', defaultValue: '地図上のピンをクリックすると各スポットの詳細が見られます', translatable: true },
      {
        key: 'onsenji_grounds_spots', label: '主な見どころ', type: 'list',
        listFields: [
          { key: 'name', label: '名称' },
          { key: 'image', label: '画像パス（例: /images/onsenji/grounds/onsenji-sandou.png）' },
          { key: 'desc', label: '説明', multiline: true },
        ],
        defaultValue: J([
          { name: '温泉寺表参道', image: '/images/onsenji/grounds/onsenji-sandou.png', desc: '石灯籠が並ぶ緑豊かな参道。入浴者用駐車場から境内へと続きます。' },
          { name: '鐘楼', image: '/images/onsenji/grounds/onsenji-syourou.png', desc: '境内に響き渡る鐘の音。早朝には特に厳かな雰囲気を味わえます。' },
          { name: '薬師の湯と本殿の外観', image: '/images/onsenji/common/onsenji-gaikan.png', desc: '受付を兼ねた建物と、薬師の湯・本殿の外観。四季折々の景色とともに参拝者を迎えます。' },
          { name: '客殿・休憩室', image: '/images/onsenji/grounds/onsenji-kyukeishitsu.png', desc: '畳敷きの落ち着いた空間で、参拝の合間にひと休みいただけます。' },
          { name: '薬師の湯', image: '/images/onsenji/grounds/onsenji-yakushinoyu-yu.png', desc: '中禅寺湖から湧き出る温泉。参拝後にご利用いただけます。' },
          { name: '本殿（写経・写仏体験会場）', image: '/images/onsenji/grounds/onsenji-kaijou.jpg', desc: 'ご本尊・薬師如来をお祀りする本殿。写経・写仏体験もこちらで行います。' },
        ]),
        translatable: true,
        defaultValueEn: J([
          { name: 'Onsenji Main Approach', image: '/images/onsenji/grounds/onsenji-sandou.png', desc: 'A lush approach lined with stone lanterns, leading from the bathers’ parking lot to the grounds.' },
          { name: 'Bell Tower', image: '/images/onsenji/grounds/onsenji-syourou.png', desc: 'The temple bell resonates across the grounds — especially solemn in the early morning.' },
          { name: 'Yakushi-no-Yu & Main Hall Exterior', image: '/images/onsenji/common/onsenji-gaikan.png', desc: 'The reception building along with the exterior of Yakushi-no-Yu and the main hall, welcoming visitors amid the changing seasons.' },
          { name: 'Guest Hall & Lounge', image: '/images/onsenji/grounds/onsenji-kyukeishitsu.png', desc: 'A calm tatami-mat space to rest between periods of worship.' },
          { name: 'Yakushi-no-Yu Hot Spring', image: '/images/onsenji/grounds/onsenji-yakushinoyu-yu.png', desc: 'Hot spring water rising near Lake Chuzenji, available for use after worship.' },
          { name: 'Main Hall (Sutra Copying & Image Tracing Venue)', image: '/images/onsenji/grounds/onsenji-kaijou.jpg', desc: 'The main hall enshrining Yakushi Nyorai. Sutra copying and Buddhist image tracing are also held here.' },
        ]),
      },
      { key: 'onsenji_grounds_heading_onsen', label: '「薬師の湯」見出し', defaultValue: '薬師の湯（温泉）', translatable: true },
      { key: 'onsenji_grounds_onsen_text', label: '薬師の湯 説明文', multiline: true, defaultValue: '境内には令和8年4月11日に開湯した「薬師の湯」があります。泉質は含硫黄‐カルシウム・ナトリウム‐硫酸塩・炭酸水素塩泉（泉温71.4℃）の完全かけ流し。加水すると乳白色に変わる神秘的な湯は、参拝者に開放されています。薬師如来の御加護とともに心身を清めていただけます。', translatable: true },
      { key: 'onsenji_grounds_heading_flow', label: '「参拝の流れ」見出し', defaultValue: '参拝の流れ', translatable: true },
      {
        key: 'onsenji_grounds_flow', label: '参拝の流れ', type: 'list',
        listFields: [{ key: 'title', label: 'ステップ名' }, { key: 'text', label: '説明', multiline: true }],
        defaultValue: J([
          { title: '拝観受付（山門）', text: '入口にて拝観料をお納めください。受付は閉門30分前に終了いたします。' },
          { title: '本堂参拝', text: 'ご本尊・薬師如来（医王如来）にお参りください。' },
          { title: '薬師の湯', text: '参拝後は境内の温泉（薬師の湯）をご利用いただけます。足湯・手湯があります。' },
          { title: '御朱印所', text: '御朱印やお守りをお受けいただけます。' },
        ]),
        translatable: true,
        defaultValueEn: J([
          { title: 'Reception (Temple Gate)', text: 'Please pay the admission fee at the entrance. Reception closes 30 minutes before the gate closes.' },
          { title: 'Worship at the Main Hall', text: 'Please worship the principal image, Yakushi Nyorai (King of Medicine Buddha).' },
          { title: 'Yakushi-no-Yu Hot Spring', text: 'After worship, you may use the hot spring on the grounds. Foot and hand baths are available.' },
          { title: 'Goshuin Stamp Office', text: 'Goshuin stamps and amulets can be received here.' },
        ]),
      },
    ],
  },
  {
    section: '拝観案内',
    href: '/onsenji/about',
    fields: [
      { key: 'onsenji_about_subtitle', label: '見出し（ヒーロー サブタイトル）', defaultValue: '拝観時間・参拝料のご案内', translatable: true },
      { key: 'onsenji_about_heading_hours', label: '「拝観時間・参拝料」見出し', defaultValue: '拝観時間・参拝料', translatable: true },
      { key: 'onsenji_about_hours_open',   label: '拝観時間', defaultValue: '8時00分〜17時00分', translatable: true },
      { key: 'onsenji_about_fee', label: '参拝料', defaultValue: '無料', translatable: true },
      { key: 'onsenji_about_hours_winter', label: '冬季休業期間', defaultValue: '12月〜4月上旬は冬季休業。閉湯・開湯の日程は公式ホームページをご確認ください。', translatable: true },
      { key: 'onsenji_about_heading_notes', label: '「ご参拝の注意事項」見出し', defaultValue: 'ご参拝の注意事項', translatable: true },
      {
        key: 'onsenji_about_notes', label: 'ご参拝の注意事項', type: 'list',
        listFields: [{ key: 'text', label: '注意事項', multiline: true }],
        defaultValue: J([
          { text: '境内では静粛にお過ごしください。' },
          { text: '撮影は外観のみ可能です。本堂内は撮影禁止となっております。' },
          { text: 'ペットの同伴は境内に限り可能です。堂内へのお連れ込みはご遠慮ください。' },
          { text: '足元が不安定な箇所があります。歩きやすい靴でお越しください。' },
        ]),
        translatable: true,
        defaultValueEn: J([
          { text: 'Please remain quiet and respectful on the temple grounds.' },
          { text: 'Photography is permitted outdoors only. Photography inside the main hall is prohibited.' },
          { text: 'Pets are permitted on the grounds only; please do not bring them inside the halls.' },
          { text: 'Some areas underfoot are uneven. Please wear comfortable, sturdy footwear.' },
        ]),
      },
    ],
  },
  {
    section: '温泉のご案内',
    href: '/onsenji/onsen',
    fields: [
      { key: 'onsenji_onsen_subtitle', label: '見出し（ヒーロー サブタイトル）', defaultValue: '令和8年4月11日 開湯', translatable: true },
      { key: 'onsenji_onsen_heading_about', label: '「薬師の湯について」見出し', defaultValue: '薬師の湯について', translatable: true },
      { key: 'onsenji_onsen_about', label: '薬師の湯について（説明文）', multiline: true, defaultValue: '「薬師の湯」は延暦7年（788年）の開創以来、薬師瑠璃光如来のご加護のもと守り続けられてきた霊泉です。令和8年4月11日に参拝者への開放が始まりました。薬師如来の御加護と温泉の癒しを同時にいただける、温泉寺ならではの体験です。', translatable: true },
      { key: 'onsenji_onsen_heading_quality', label: '「泉質・料金」見出し', defaultValue: '泉質・料金', translatable: true },
      { key: 'onsenji_onsen_quality', label: '泉質', defaultValue: '含硫黄‐カルシウム・ナトリウム‐硫酸塩・炭酸水素塩泉', translatable: true },
      { key: 'onsenji_onsen_temp', label: '泉温', defaultValue: '71.4℃', translatable: true },
      { key: 'onsenji_onsen_flow', label: '湯の種類', defaultValue: '完全かけ流し（加水あり）', translatable: true },
      { key: 'onsenji_onsen_color', label: '湯の色', defaultValue: '加水すると乳白色に変わります', translatable: true },
      { key: 'onsenji_onsen_hours', label: '利用時間', multiline: true, defaultValue: '8時00分〜17時00分（受付：8時00分〜16時00分）\n※12月〜4月上旬は冬季休業', translatable: true },
      { key: 'onsenji_onsen_fee_note', label: '料金', defaultValue: '志納金（大人500円・小中学生300円）に含まれます。別途料金はかかりません。', translatable: true },
      { key: 'onsenji_onsen_heading_notes', label: '「ご利用の注意」見出し', defaultValue: 'ご利用の注意', translatable: true },
      { key: 'onsenji_onsen_note', label: 'ご利用の注意（本文）', multiline: true, defaultValue: 'タオルをご持参ください。貸し出しは行っておりません。', translatable: true },
    ],
  },
  {
    section: '温泉設定',
    href: '/onsenji',
    fields: [
      { key: 'onsenji_onsen_status_enabled', label: '温泉営業ステータスの表示（トップページ ヒーロー下に表示）', type: 'boolean', defaultValue: 'true', checkboxLabel: '表示する' },
      { key: 'onsenji_onsen_status_open_time', label: '入浴開始時刻（24時間表記 例: 09:00。季節により変動するため随時更新してください）', defaultValue: '09:00' },
      { key: 'onsenji_onsen_status_close_time', label: '入浴終了時刻（24時間表記 例: 16:00。この時刻を過ぎると自動で「温泉は入れません」表示に切り替わります）', defaultValue: '16:00' },
      {
        key: 'onsenji_onsen_closure_events',
        label: '入浴不可の行事（事前登録。登録した日付になると自動で「本日は◯◯の為、温泉には入れません」と表示されます）',
        type: 'list',
        listFields: [
          { key: 'date', label: '日付（YYYY-MM-DD形式、例: 2026-08-08）' },
          { key: 'name', label: '行事名（例: 薬師講大祭）' },
        ],
        defaultValue: J([]),
      },
    ],
  },
  {
    section: '御朱印',
    href: '/onsenji/goshuin',
    fields: [
      { key: 'onsenji_goshuin_heading_info', label: '「御朱印のご案内」見出し', defaultValue: '御朱印のご案内', translatable: true },
      {
        key: 'onsenji_goshuin_items', label: '御朱印一覧（画像は固定・3件）', type: 'list',
        listFields: [{ key: 'title', label: 'タイトル' }, { key: 'sub', label: '副題' }],
        defaultValue: J([
          { title: '薬師如来', sub: '温泉寺 本堂（通常御朱印）' },
          { title: '写経特別御朱印', sub: '写経体験をされた方に授与' },
          { title: '写仏特別御朱印', sub: '写仏体験をされた方に授与' },
        ]),
        translatable: true,
        defaultValueEn: J([
          { title: 'Yakushi Nyorai', sub: 'Onsenji Main Hall (Regular Goshuin)' },
          { title: 'Special Sutra Copying Stamp', sub: 'Given to those who complete the sutra copying experience' },
          { title: 'Special Buddha Tracing Stamp', sub: 'Given to those who complete the Buddhist image tracing experience' },
        ]),
      },
      { key: 'onsenji_goshuin_fee_note', label: '御朱印代・受付時間の案内', multiline: true, defaultValue: '御朱印代：500円　／　写経体験（1,000円）をお申し込みの方には特別御朱印を授与しています。\n受付時間は拝観受付終了時刻までとなります。', translatable: true },
      { key: 'onsenji_goshuin_heading_notes', label: '「御朱印についてのご注意」見出し', defaultValue: '御朱印についてのご注意', translatable: true },
      {
        key: 'onsenji_goshuin_notes', label: '御朱印についてのご注意', type: 'list',
        listFields: [{ key: 'text', label: '注意事項', multiline: true }],
        defaultValue: J([
          { text: '御朱印は信仰の証です。コレクション目的でのお受け取りはご遠慮ください。' },
          { text: '受付時間は閉門30分前に終了いたします。余裕をもってお越しください。' },
          { text: '書き入れは混雑時にお時間をいただく場合がございます。' },
          { text: '御朱印帳をお持ちでない方には書き置きもございます。' },
        ]),
        translatable: true,
        defaultValueEn: J([
          { text: 'A goshuin is a proof of faith — please do not request one solely for collecting purposes.' },
          { text: 'Reception closes 30 minutes before the temple closes. Please allow enough time.' },
          { text: 'Hand-written stamps may take extra time during busy periods.' },
          { text: 'Pre-inscribed stamps are also available for those without a goshuin book.' },
        ]),
      },
    ],
  },
  {
    section: 'よくある質問',
    href: '/onsenji/faq',
    fields: [
      { key: 'onsenji_faq_subtitle', label: '見出し（英字サブタイトル）', defaultValue: 'FAQ' },
      {
        key: 'onsenji_faq_items', label: 'FAQ一覧', type: 'list',
        listFields: [{ key: 'q', label: '質問', multiline: true }, { key: 'a', label: '回答', multiline: true }],
        defaultValue: J([
          { q: '温泉（薬師の湯）は誰でも利用できますか？', a: 'はい、志納金（大人500円・小中学生300円）をお納めいただいた方はどなたでもご利用いただけます。令和8年4月11日より開湯した源泉かけ流しの温泉です。タオルをご持参ください。' },
          { q: '薬師の湯の泉質を教えてください。', a: '泉質は含硫黄‐カルシウム・ナトリウム‐硫酸塩・炭酸水素塩泉で、泉温は71.4℃です。完全かけ流しで、加水すると乳白色に変わる美しい湯です。' },
          { q: '御祈願は予約が必要ですか？', a: 'はい、御祈願は予約制となっております。事前にお電話またはお問い合わせフォームよりご連絡ください。' },
          { q: '写経体験はできますか？', a: 'はい、毎日実施しています。体験料1,000円で特別御朱印もお授けします。所要時間は約15分です。予約不要で、受付時にお申し付けください。' },
          { q: '車でのアクセスはできますか？', a: 'はい、お車でお越しいただけます。日光宇都宮道路 日光ICより約10分です。境内周辺に有料駐車場がございます。' },
          { q: '温泉寺は輪王寺と関係がありますか？', a: 'はい、日光山温泉寺は世界遺産「日光山輪王寺」の別院です。延暦7年（788年）に勝道上人によって開創され、江戸時代には輪王寺宮の直轄寺院として栄えました。' },
        ]),
        translatable: true,
        defaultValueEn: J([
          { q: 'Can anyone use the hot spring (Yakushi-no-Yu)?', a: 'Yes, anyone who pays the visiting donation (adults ¥500, elementary/junior high school students ¥300) may use it. This fully sourced hot spring opened on April 11, 2026. Please bring your own towel.' },
          { q: 'What is the water quality of Yakushi-no-Yu?', a: 'The spring is sulfur–calcium–sodium–sulfate–bicarbonate with a water temperature of 71.4°C. It is fully sourced and turns a beautiful milky white when mixed with water.' },
          { q: 'Do I need a reservation for a prayer service?', a: 'Yes, prayer services require a reservation. Please contact us in advance by phone or through the inquiry form.' },
          { q: 'Can I try the sutra copying experience?', a: 'Yes, it is offered daily. The fee is ¥1,000 and includes a special goshuin stamp. It takes about 15 minutes. No reservation is needed — just ask at reception.' },
          { q: 'Can I access by car?', a: 'Yes, you can come by car. It is about 10 minutes from the Nikko IC on the Nikko-Utsunomiya Road. There are paid parking lots near the grounds.' },
          { q: 'Is Onsenji connected to Rinnoji?', a: 'Yes, Nikkozan Onsenji is a branch temple of the World Heritage site Nikkozan Rinnoji. It was founded in Enryaku 7 (788 CE) by the priest Shodo, and flourished in the Edo period as a temple directly administered by Rinnoji.' },
        ]),
      },
      { key: 'onsenji_faq_bottom_heading', label: '末尾の見出し', defaultValue: 'その他のご質問', translatable: true },
      { key: 'onsenji_faq_bottom_text', label: '末尾の案内文', defaultValue: '解決しない場合はお気軽にお問い合わせください。', translatable: true },
      { key: 'onsenji_faq_cta_label', label: 'お問い合わせボタンの文言', defaultValue: 'お問い合わせ', translatable: true },
    ],
  },
  {
    section: '写経体験',
    href: '/onsenji/experience/shakyou',
    fields: [
      { key: 'onsenji_shakyou_subtitle', label: '見出し（ヒーロー サブタイトル）', defaultValue: '心を静め、お経の文字を丁寧にお写しいただきます', translatable: true },
      { key: 'onsenji_shakyou_heading_about', label: '「写経とは」見出し', defaultValue: '写経とは', translatable: true },
      { key: 'onsenji_shakyou_about_p1', label: '写経とは（段落1）', multiline: true, defaultValue: '写経とは、お経の文字を一文字一文字丁寧に書き写す修行です。文字を書くことで雑念を払い、心を清め、仏様との縁を結ぶとされています。', translatable: true },
      { key: 'onsenji_shakyou_about_p2', label: '写経とは（段落2）', multiline: true, defaultValue: '温泉寺では薬師如来に縁の深いお経をお写しいただきます。体験後は特別御朱印をお授けします。毎日開催していますので、参拝の際にお気軽にお申し付けください。', translatable: true },
      { key: 'onsenji_shakyou_heading_contents', label: '「体験内容」見出し', defaultValue: '体験内容', translatable: true },
      { key: 'onsenji_shakyou_content_title', label: '体験内容 タイトル', defaultValue: '薬師経', translatable: true },
      { key: 'onsenji_shakyou_content_desc', label: '体験内容 説明文', multiline: true, defaultValue: 'ご本尊・薬師如来に縁の深い薬師経をお写しいただきます。お写しいただいた方には特別御朱印をお授けします。', translatable: true },
      { key: 'onsenji_shakyou_heading_fees', label: '「料金・所要時間」見出し', defaultValue: '料金・所要時間', translatable: true },
      { key: 'onsenji_shakyou_fee',  label: '体験料', defaultValue: '1,000円（特別御朱印授与込み）', translatable: true },
      { key: 'onsenji_shakyou_time', label: '所要時間', defaultValue: '約15分', translatable: true },
      { key: 'onsenji_shakyou_target', label: '対象', defaultValue: 'どなたでも（筆が初めての方も歓迎）', translatable: true },
      { key: 'onsenji_shakyou_place', label: '受付場所', defaultValue: '寺務所 体験受付窓口', translatable: true },
      { key: 'onsenji_shakyou_hours', label: '受付時間', defaultValue: '拝観時間内（閉門1時間前まで）', translatable: true },
      { key: 'onsenji_shakyou_heading_flow', label: '「体験の流れ」見出し', defaultValue: '体験の流れ', translatable: true },
      {
        key: 'onsenji_shakyou_flow', label: '体験の流れ', type: 'list',
        listFields: [{ key: 'title', label: 'ステップ名' }, { key: 'text', label: '説明', multiline: true }],
        defaultValue: J([
          { title: '受付', text: '寺務所 体験受付窓口にてお申し込みください。体験料をお納めいただきます。' },
          { title: '用具の準備', text: '筆・硯・お経の手本をご用意します。すべて貸し出しですので手ぶらでお越しください。' },
          { title: 'お写しいただきます', text: 'お経の手本に沿って、一文字一文字丁寧にお写しください。係の者がご説明いたします。' },
          { title: '特別御朱印のお授け', text: '完成後、特別御朱印をお授けします。' },
        ]),
        translatable: true,
        defaultValueEn: J([
          { title: 'Reception', text: 'Please apply at the Temple Office experience reception counter and pay the experience fee.' },
          { title: 'Preparing Materials', text: 'Brush, inkstone, and a sutra template are provided — all on loan, so please come empty-handed.' },
          { title: 'Copying the Sutra', text: 'Following the template, carefully copy each character one by one. Our staff will guide you.' },
          { title: 'Receiving the Special Goshuin', text: 'Upon completion, you will receive a special goshuin stamp.' },
        ]),
      },
      { key: 'onsenji_shakyou_heading_items', label: '「持ち物・服装」見出し', defaultValue: '持ち物・服装', translatable: true },
      {
        key: 'onsenji_shakyou_items', label: '持ち物・服装', type: 'list',
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
      { key: 'onsenji_shakyou_cta_heading', label: 'CTA見出し', defaultValue: '写経体験のご予約・お問い合わせ', translatable: true },
      { key: 'onsenji_shakyou_cta_sub', label: '予約ボタン下の説明文', defaultValue: '予約不要・毎日実施。参拝受付時にお申し付けください。', translatable: true },
    ],
  },
  {
    section: '写仏体験',
    href: '/onsenji/experience/shabutu',
    fields: [
      { key: 'onsenji_shabutu_subtitle', label: '見出し（ヒーロー サブタイトル）', defaultValue: '仏様のお姿を一筆一筆、心を込めてお描きいただきます', translatable: true },
      { key: 'onsenji_shabutu_heading_about', label: '「写仏とは」見出し', defaultValue: '写仏とは', translatable: true },
      { key: 'onsenji_shabutu_about_p1', label: '写仏とは（段落1）', multiline: true, defaultValue: '写仏とは、仏様のお姿を下絵に沿って丁寧にお描きする修行です。写経と並ぶ伝統的な仏道修行のひとつで、描きながら仏様の功徳をいただき、心を落ち着けることができます。', translatable: true },
      { key: 'onsenji_shabutu_about_p2', label: '写仏とは（段落2）', multiline: true, defaultValue: '温泉寺の写仏体験では、ご本尊・薬師如来のお姿をお描きいただきます。完成した写仏は記念にお持ち帰りいただけます。絵が苦手な方でも、下絵に沿って描くためどなたでもお楽しみいただけます。', translatable: true },
      { key: 'onsenji_shabutu_heading_contents', label: '「体験内容」見出し', defaultValue: '体験内容', translatable: true },
      { key: 'onsenji_shabutu_content_title', label: '体験内容 タイトル', defaultValue: '薬師如来', translatable: true },
      { key: 'onsenji_shabutu_content_desc', label: '体験内容 説明文', multiline: true, defaultValue: '下絵に沿って、ご本尊・薬師如来のお姿をお描きいただきます。完成後は特別御朱印とセットでお授けします。', translatable: true },
      { key: 'onsenji_shabutu_heading_fees', label: '「料金・所要時間」見出し', defaultValue: '料金・所要時間', translatable: true },
      { key: 'onsenji_shabutu_fee',  label: '体験料', defaultValue: '1,000円（御朱印込み）', translatable: true },
      { key: 'onsenji_shabutu_time', label: '所要時間', defaultValue: '約30〜60分（個人差があります）', translatable: true },
      { key: 'onsenji_shabutu_target', label: '対象', defaultValue: 'どなたでも（絵が苦手な方も歓迎）', translatable: true },
      { key: 'onsenji_shabutu_place', label: '受付場所', defaultValue: '寺務所 体験受付窓口', translatable: true },
      { key: 'onsenji_shabutu_hours', label: '受付時間', defaultValue: '拝観時間内（閉門1時間前まで）', translatable: true },
      { key: 'onsenji_shabutu_heading_flow', label: '「体験の流れ」見出し', defaultValue: '体験の流れ', translatable: true },
      {
        key: 'onsenji_shabutu_flow', label: '体験の流れ', type: 'list',
        listFields: [{ key: 'title', label: 'ステップ名' }, { key: 'text', label: '説明', multiline: true }],
        defaultValue: J([
          { title: '受付', text: '寺務所 体験受付窓口にてお申し込みください。体験料をお納めいただきます。' },
          { title: '用具の準備', text: '下絵・筆・墨などをご用意します。すべて貸し出しですので手ぶらでお越しいただけます。' },
          { title: 'お描きいただきます', text: '下絵に沿って、薬師如来のお姿をゆっくりお描きください。係の者がご説明いたします。' },
          { title: '特別御朱印のお授け', text: '完成後、特別御朱印をお授けします。' },
          { title: 'お持ち帰り', text: '完成した写仏はお持ち帰りいただけます。大切に飾ってください。' },
        ]),
        translatable: true,
        defaultValueEn: J([
          { title: 'Reception', text: 'Please apply at the Temple Office experience reception counter and pay the experience fee.' },
          { title: 'Preparing Materials', text: 'A template, brush, ink, and other materials are provided — all on loan, so you may come empty-handed.' },
          { title: 'Tracing the Image', text: "Following the template, slowly trace the figure of Yakushi Nyorai. Our staff will guide you." },
          { title: 'Receiving the Special Goshuin', text: 'Upon completion, you will receive a special goshuin stamp.' },
          { title: 'Taking It Home', text: 'You may take your completed tracing home. Please display it with care.' },
        ]),
      },
      { key: 'onsenji_shabutu_cta_heading', label: 'CTA見出し', defaultValue: '写仏体験のご予約・お問い合わせ', translatable: true },
      { key: 'onsenji_shabutu_cta_sub', label: '予約ボタン下の説明文', defaultValue: '事前予約をおすすめします。当日受付も空きがあれば対応します。', translatable: true },
    ],
  },
  {
    section: '数珠づくり体験',
    href: '/onsenji/experience/jyuzu',
    fields: [
      { key: 'onsenji_jyuzu_subtitle', label: '見出し（ヒーロー サブタイトル）', defaultValue: '世界にひとつだけの数珠を、自分の手でつくります', translatable: true },
      { key: 'onsenji_jyuzu_heading_about', label: '「数珠づくりとは」見出し', defaultValue: '数珠づくりとは', translatable: true },
      { key: 'onsenji_jyuzu_about_p1', label: '数珠づくりとは（段落1）', multiline: true, defaultValue: '数珠（じゅず）は、仏様を礼拝するときに手に持つ法具です。温泉寺の数珠づくり体験では、複数の珠の種類からお好みの組み合わせを選び、自分だけのオリジナル数珠をお作りいただけます。', translatable: true },
      { key: 'onsenji_jyuzu_about_p2', label: '数珠づくりとは（段落2）', multiline: true, defaultValue: '完成した数珠は薬師如来の前でご祈願いただいた後にお持ち帰りいただけます。参拝・法要などさまざまな場面でお使いいただけます。', translatable: true },
      { key: 'onsenji_jyuzu_heading_fees', label: '「料金・所要時間」見出し', defaultValue: '料金・所要時間', translatable: true },
      { key: 'onsenji_jyuzu_fee',  label: '体験料', defaultValue: '2,000円〜（珠の素材・組み合わせにより異なります）', translatable: true },
      { key: 'onsenji_jyuzu_time', label: '所要時間', defaultValue: '約60〜90分', translatable: true },
      { key: 'onsenji_jyuzu_target', label: '対象', defaultValue: '小学生以上（小学生は保護者同伴）', translatable: true },
      { key: 'onsenji_jyuzu_place', label: '受付場所', defaultValue: '寺務所 体験受付窓口', translatable: true },
      { key: 'onsenji_jyuzu_hours', label: '受付時間', defaultValue: '拝観時間内（閉門1時間30分前まで）', translatable: true },
      { key: 'onsenji_jyuzu_price_note_label', label: '料金補足の見出し', defaultValue: '料金について', translatable: true },
      { key: 'onsenji_jyuzu_price_note', label: '料金についての補足', multiline: true, defaultValue: 'お選びいただく珠の素材・数・組み合わせによって料金が異なります。詳しくは受付窓口またはお問い合わせフォームよりご確認ください。', translatable: true },
      { key: 'onsenji_jyuzu_heading_flow', label: '「体験の流れ」見出し', defaultValue: '体験の流れ', translatable: true },
      {
        key: 'onsenji_jyuzu_flow', label: '体験の流れ', type: 'list',
        listFields: [{ key: 'title', label: 'ステップ名' }, { key: 'text', label: '説明', multiline: true }],
        defaultValue: J([
          { title: '受付・デザイン選択', text: '寺務所 体験受付窓口にてお申し込み。珠の素材や色の組み合わせをお選びいただきます。' },
          { title: '珠の確認', text: '選んでいただいた珠を確認し、体験台へご案内します。' },
          { title: '数珠づくり', text: 'スタッフのご説明に沿って、珠を糸に通していきます。結び方もご指導します。' },
          { title: '完成・お持ち帰り', text: '完成した数珠はその場でお持ち帰りいただけます。専用の袋に入れてお渡しします。' },
        ]),
        translatable: true,
        defaultValueEn: J([
          { title: 'Reception & Design Selection', text: 'Please apply at the Temple Office experience reception counter. Choose your preferred bead material and color combination.' },
          { title: 'Confirming the Beads', text: 'We will confirm your chosen beads and guide you to the workstation.' },
          { title: 'Making the Bracelet', text: 'Following staff instructions, string the beads onto the cord. We will also guide you through the knotting.' },
          { title: 'Completion & Take-Home', text: 'Take your finished bracelet home right away, presented in a dedicated pouch.' },
        ]),
      },
      { key: 'onsenji_jyuzu_heading_materials', label: '「珠の素材について」見出し', defaultValue: '珠の素材について', translatable: true },
      { key: 'onsenji_jyuzu_materials_note', label: '珠の素材 注意書き', defaultValue: '珠の種類は季節・入荷状況により変わります。当日の受付窓口でご確認ください。', translatable: true },
      {
        key: 'onsenji_jyuzu_materials', label: '珠の素材', type: 'list',
        listFields: [{ key: 'name', label: '素材名' }, { key: 'desc', label: '説明', multiline: true }],
        defaultValue: J([
          { name: '水晶', desc: '透明感があり、邪気を払う浄化の石として知られます。' },
          { name: '翡翠', desc: '緑の美しい石。長寿・健康・魔除けの功徳があるとされます。' },
          { name: '木珠', desc: '軽くて使いやすい伝統的な珠。温かみのある手触りが特徴です。' },
        ]),
        translatable: true,
        defaultValueEn: J([
          { name: 'Crystal', desc: 'Known as a clarifying stone that wards off negative energy, with a translucent beauty.' },
          { name: 'Jade', desc: 'A beautiful green stone believed to bring longevity, health, and protection from misfortune.' },
          { name: 'Wooden Beads', desc: 'A lightweight, easy-to-wear traditional bead, known for its warm texture.' },
        ]),
      },
      { key: 'onsenji_jyuzu_cta_heading', label: 'CTA見出し', defaultValue: '数珠づくり体験のご予約・お問い合わせ', translatable: true },
      { key: 'onsenji_jyuzu_cta_sub', label: '予約ボタン下の説明文', defaultValue: '材料の準備がありますので、事前のご予約をお願いします。', translatable: true },
    ],
  },
  {
    section: '年間行事一覧',
    href: '/onsenji/events',
    fields: [
      { key: 'onsenji_events_subtitle', label: '見出し（ヒーロー サブタイトル）', defaultValue: '温泉寺の法要・行事のご案内', translatable: true },
      {
        key: 'onsenji_events_list', label: '行事一覧（画像・リンク先は固定・2件）', type: 'list',
        listFields: [
          { key: 'month', label: '月（バッジ表示）' },
          { key: 'date', label: '開催日' },
          { key: 'time', label: '開始時間' },
          { key: 'name', label: '行事名' },
          { key: 'desc', label: '説明', multiline: true },
        ],
        defaultValue: J([
          { month: '8月', date: '8月8日', time: '午前11時〜', name: '薬師講大祭・採灯大護摩供', desc: '湯の湖畔にて、山伏によって採灯大護摩供が焚かれます。写経が御本尊に奉じられ、護摩の炎で焚き上げられる、温泉寺最大の法要です。' },
          { month: '1月', date: '1月下旬', time: '午前11時〜', name: '温泉寺 節分大祭', desc: '新年の邪気を払い、福を招く節分の法要です。豆まきや護摩供を通じて、参拝者の一年の健康と幸福をお祈りします。' },
        ]),
        translatable: true,
        defaultValueEn: J([
          { month: 'August', date: 'August 8', time: 'From 11:00 AM', name: 'Yakushiko Grand Festival & Saito Goma Fire Ritual', desc: 'On the shore of Lake Yunoko, mountain ascetics (yamabushi) perform the Saito Goma fire ritual. Copied sutras are offered to the principal image and burned in the goma flames — the largest ceremony of the year at Onsenji.' },
          { month: 'January', date: 'Late January', time: 'From 11:00 AM', name: 'Onsenji Setsubun Grand Festival', desc: 'A Setsubun ceremony to drive away misfortune and welcome good luck for the new year. Bean-throwing and a goma fire ritual pray for the health and happiness of all visitors in the year ahead.' },
        ]),
      },
    ],
  },
  {
    section: '節分大祭（1月下旬）',
    href: '/onsenji/events/setsubun',
    fields: [
      { key: 'setsubun_subtitle', label: '見出し（ヒーロー サブタイトル）', defaultValue: '毎年1月下旬　午前11時より　※日程は年によって異なります', translatable: true },
      { key: 'setsubun_heading_about', label: '「行事について」見出し', defaultValue: '行事について', translatable: true },
      { key: 'setsubun_about', label: '行事について（説明文）', multiline: true, defaultValue: '新年の邪気を払い、福を招く節分の法要です。豆まきや護摩供を通じて、参拝者の一年の健康と幸福をお祈りします。', translatable: true },
      { key: 'setsubun_info_date', label: '開催日（カード表示）', defaultValue: '1月下旬（毎年）', translatable: true },
      { key: 'setsubun_info_time', label: '開始時間（カード表示）', defaultValue: '午前11時〜', translatable: true },
      { key: 'setsubun_info_join', label: '参列（カード表示）', defaultValue: '自由（申し込み不要）', translatable: true },
      { key: 'setsubun_date_note', label: '日程変動の注意書き', defaultValue: '📌 詳細な日程は年によって異なります。最新情報はお電話（0288-55-0013）またはお問い合わせフォームでご確認ください。', translatable: true },
      { key: 'setsubun_heading_schedule', label: '「タイムスケジュール」見出し', defaultValue: 'タイムスケジュール', translatable: true },
      {
        key: 'setsubun_schedule', label: 'タイムスケジュール', type: 'list',
        listFields: [{ key: 'time', label: '時間' }, { key: 'title', label: '行事名' }, { key: 'desc', label: '説明', multiline: true }],
        defaultValue: J([
          { time: '11:00', title: '節分大祭（法要）', desc: '薬師堂にて節分の法要を執り行います。ご本尊・薬師如来のご加護のもと、新年の無病息災・開運招福をお祈りいたします。' },
          { time: '11:30', title: '護摩供', desc: '護摩の炎に参拝者の願い事を記した護摩木を奉じ、薬師如来の御力で煩悩や邪気をお焚き上げいたします。' },
          { time: '終了後', title: '豆まき', desc: '「鬼は外、福は内」の声とともに豆まきを行います。参列の皆様にも豆をお配りいたします。' },
        ]),
        translatable: true,
        defaultValueEn: J([
          { time: '11:00', title: 'Setsubun Grand Ceremony', desc: 'A Setsubun ceremony is held at the Yakushi Hall. Under the protection of Yakushi Nyorai, we pray for good health and good fortune in the new year.' },
          { time: '11:30', title: 'Goma Fire Ritual', desc: 'Wooden goma sticks inscribed with visitors\' wishes are offered to the flames, burning away worldly desires and misfortune through the power of Yakushi Nyorai.' },
          { time: 'After the Ceremony', title: 'Bean Throwing', desc: 'Beans are thrown with the call "Oni wa soto, fuku wa uchi" ("Demons out, fortune in"). Beans are also distributed to all attendees.' },
        ]),
      },
      { key: 'setsubun_heading_gallery', label: '「行事の様子」見出し（画像は固定・3件）', defaultValue: '行事の様子', translatable: true },
      { key: 'setsubun_heading_notes', label: '「ご参列にあたって」見出し', defaultValue: 'ご参列にあたって', translatable: true },
      {
        key: 'setsubun_notes', label: 'ご参列にあたって', type: 'list',
        listFields: [{ key: 'text', label: '注意事項', multiline: true }],
        defaultValue: J([
          { text: '参列は自由です。事前のお申し込みは不要ですが、御札をご希望の方は申し込みフォームよりお申し込みください。' },
          { text: '1月の湯元は積雪・寒冷が予想されます。防寒対策を十分にしてお越しください。' },
          { text: 'お支払いは当日・現地にてお受けいたします。' },
          { text: '日程は年によって異なります。必ず事前にお電話またはウェブサイトでご確認ください。' },
        ]),
        translatable: true,
        defaultValueEn: J([
          { text: 'Attendance is open to all — no advance registration required. If you would like an ofuda talisman, please apply via the application form.' },
          { text: 'Snow and cold weather are expected at Yumoto in January. Please dress warmly.' },
          { text: 'Payment is accepted on the day, on site.' },
          { text: 'The schedule varies by year. Please always confirm in advance by phone or on our website.' },
        ]),
      },
      { key: 'setsubun_cta_heading', label: 'CTA見出し', defaultValue: '御札のお申し込み', translatable: true },
      { key: 'setsubun_cta_text', label: 'CTA説明文（改行はそのまま反映されます）', multiline: true, defaultValue: '護摩供にてお焚き上げする御札をご希望の方は\n申し込みフォームよりお申し込みください。\nお支払いは当日・現地にて。', translatable: true },
    ],
  },
  {
    section: '薬師講大祭・採灯大護摩供（8/8）',
    href: '/onsenji/events/yakushiko',
    fields: [
      { key: 'yakushiko_subtitle', label: '見出し（ヒーロー サブタイトル）', defaultValue: '毎年8月8日　午前11時より', translatable: true },
      { key: 'yakushiko_heading_about', label: '「行事について」見出し', defaultValue: '行事について', translatable: true },
      { key: 'yakushiko_about', label: '行事について（説明文）', multiline: true, defaultValue: '毎年8月8日、温泉寺では湯の湖畔を舞台に、山伏によって採灯大護摩供が焚かれます。', translatable: true },
      { key: 'yakushiko_info_date', label: '開催日（カード表示）', defaultValue: '8月8日（毎年）', translatable: true },
      { key: 'yakushiko_info_time', label: '開始時間（カード表示）', defaultValue: '午前11時〜', translatable: true },
      { key: 'yakushiko_info_join', label: '参列（カード表示）', defaultValue: '自由（申し込み不要）', translatable: true },
      { key: 'yakushiko_heading_schedule', label: '「タイムスケジュール」見出し', defaultValue: 'タイムスケジュール', translatable: true },
      {
        key: 'yakushiko_schedule', label: 'タイムスケジュール', type: 'list',
        listFields: [{ key: 'time', label: '時間' }, { key: 'title', label: '行事名' }, { key: 'desc', label: '説明', multiline: true }],
        defaultValue: J([
          { time: '11:00', title: '薬師講大祭', desc: '薬師堂にてご本尊・薬師瑠璃光如来への法要を執り行います。' },
          { time: '11:30', title: '採灯大護摩供', desc: '湯の湖畔にて、山伏装束に身を包んだ僧侶たちによる採灯大護摩供を厳修いたします。' },
          { time: '終了後', title: '写経奉納・御朱印授与', desc: '写経体験でお写しいただいた写経を御本尊に奉納いたします。特別御朱印のお授けも行います。' },
        ]),
        translatable: true,
        defaultValueEn: J([
          { time: '11:00', title: 'Yakushiko Grand Ceremony', desc: 'A ceremony to the principal image, Yakushi Ruriko Nyorai, is held at the Yakushi Hall. Together with devotees and visitors, we chant the Yakushi Sutra and pray for improved health and recovery from illness.' },
          { time: '11:30', title: 'Saito Goma Fire Ritual', desc: 'On the shore of Lake Yunoko, monks dressed as mountain ascetics (yamabushi) solemnly perform the Saito Goma fire ritual. Wooden goma sticks inscribed with wishes and copied sutras are offered to the flames, praying for the protection of Yakushi Nyorai.' },
          { time: 'After the Ceremony', title: 'Sutra Offering & Goshuin Distribution', desc: 'Sutras copied during the sutra-copying experience are offered to the principal image. A special goshuin stamp is also given.' },
        ]),
      },
      { key: 'yakushiko_heading_gallery', label: '「行事の様子」見出し', defaultValue: '行事の様子', translatable: true },
      { key: 'yakushiko_heading_notes', label: '「ご参列にあたって」見出し', defaultValue: 'ご参列にあたって', translatable: true },
      {
        key: 'yakushiko_notes', label: 'ご参列にあたって', type: 'list',
        listFields: [{ key: 'text', label: '注意事項', multiline: true }],
        defaultValue: J([
          { text: '参列は自由です。事前のお申し込みは不要ですが、御札・願い事をご希望の方は申し込みフォームよりお申し込みください。' },
          { text: '写経体験（1,000円）は開湯期間中毎日受付しています。当日の写経奉納も可能です。' },
          { text: 'お支払いは当日・現地にてお受けいたします。' },
          { text: '詳細・変更がある場合は当サイトまたはお電話にてご確認ください。' },
        ]),
        translatable: true,
        defaultValueEn: J([
          { text: 'Attendance is open to all — no advance registration required. If you would like an ofuda talisman or wish offering, please apply via the application form.' },
          { text: 'The sutra-copying experience (¥1,000) is accepted daily during the open season. Same-day sutra offering is also possible.' },
          { text: 'Payment is accepted on the day, on site.' },
          { text: 'Please check our website or call us for any details or changes.' },
        ]),
      },
      { key: 'yakushiko_cta_heading', label: 'CTA見出し', defaultValue: '御札のお申し込み', translatable: true },
      { key: 'yakushiko_cta_text', label: 'CTA説明文（改行はそのまま反映されます）', multiline: true, defaultValue: '大護摩供にてお焚き上げする御札をご希望の方は\n申し込みフォームよりお申し込みください。\nお支払いは当日・現地にて。', translatable: true },
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
                  {field.type === 'boolean' ? (
                    <label className="inline-flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4"
                        checked={(values[field.key] ?? field.defaultValue ?? 'false') === 'true'}
                        onChange={e => setValues(v => ({ ...v, [field.key]: e.target.checked ? 'true' : 'false' }))}
                      />
                      {field.checkboxLabel ?? '有効にする'}
                    </label>
                  ) : field.type === 'list' ? (
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
                          className="text-sm px-5 py-2 rounded-full bg-onsenji text-white hover:bg-onsenji-light transition-colors disabled:opacity-50"
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
                          className="text-sm px-5 py-2 rounded-full bg-onsenji text-white hover:bg-onsenji-light transition-colors disabled:opacity-50"
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
