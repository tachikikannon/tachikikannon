'use client'
import SectionEditor from '@/components/admin/SectionEditor'

const J = (v: unknown) => JSON.stringify(v)

const FIELDS = [
  { key: 'flower_calendar_subtitle', label: '見出し（サブタイトル）', defaultValue: '境内を彩る、四季折々の花', translatable: true },
  {
    key: 'flower_calendar_items', label: '花ごよみ（月ごとの花）', type: 'list' as const,
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
] as const

export default function AdminChuzenjiFlowerCalendar() {
  return <SectionEditor title="花ごよみ" href="/flower-calendar" fields={FIELDS as never} />
}
