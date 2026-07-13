'use client'
import SectionEditor from '@/components/admin/SectionEditor'

const J = (v: unknown) => JSON.stringify(v)

const FIELDS = [
  { key: 'onsenji_history_p1', label: '創建の由来（段落1）', multiline: true, defaultValue: '日光山温泉寺は、延暦7年（788年）に勝道上人によって開かれた世界遺産「日光山輪王寺」の別院です。勝道上人は日光山を開いた高僧で、この地で温泉の湧き出るのを発見し、薬師瑠璃光如来をお祀りしたのが温泉寺の起こりとされています。' },
  { key: 'onsenji_history_p2', label: '創建の由来（段落2）', multiline: true, defaultValue: 'ご本尊は薬師瑠璃光如来（医王如来）で、健康増進・延命長寿のご利益で信仰を集めてきました。江戸時代には輪王寺宮の直轄寺院として栄え、昭和48年に現在地に再建された後も、多くの参拝者に親しまれています。' },
  {
    key: 'onsenji_history_timeline', label: '歴史の流れ（年表）', type: 'list' as const,
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
] as const

export default function AdminOnsenjHistory() {
  return <SectionEditor title="温泉寺の歴史" href="/onsenji/history" fields={FIELDS as never} accent="onsenji" />
}
