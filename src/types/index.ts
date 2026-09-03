// 既定の5種のほか、管理画面からカテゴリーを自由に追加できるため文字列型にしている
// （追加分の一覧は news_categories_<site> というsite_contentキーで管理。src/lib/newsCategories.ts参照）
export type NewsCategory = string
export type NewsSite = 'chuzenji' | 'onsenji'

export interface News {
  id: string
  title: string
  title_en?: string | null
  excerpt: string | null
  excerpt_en?: string | null
  body: string
  body_en?: string | null
  cover_url: string | null
  category: NewsCategory
  site: NewsSite
  is_published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface Post {
  id: string
  title: string
  title_en?: string | null
  slug: string
  excerpt: string | null
  excerpt_en?: string | null
  body: string
  body_en?: string | null
  cover_url: string | null
  gallery_urls: string[] | null
  is_published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface Event {
  id: string
  title: string
  description: string | null
  start_date: string
  end_date: string | null
  all_day: boolean
  color: string
  created_at: string
}

export interface MinorEvent {
  id: string
  title: string
  title_en?: string | null
  slug: string
  site: NewsSite
  month_label: string
  month_label_en?: string | null
  date_label: string
  date_label_en?: string | null
  time_label: string | null
  time_label_en?: string | null
  desc_text: string
  desc_text_en?: string | null
  subtitle?: string | null
  subtitle_en?: string | null
  info_date?: string | null
  info_date_en?: string | null
  info_time?: string | null
  info_time_en?: string | null
  info_join?: string | null
  info_join_en?: string | null
  schedule?: string
  schedule_en?: string
  notes?: string
  notes_en?: string
  cover_url: string | null
  hero_url: string | null
  gallery_urls: string[]
  gallery_placement: 'above' | 'below'
  apply_url: string | null
  sort_order: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export type ReservationType = 'prayer' | 'shakyou' | 'shabutu' | 'jyuzu' | 'zazen'
export type ReservationStatus = 'unconfirmed' | 'in_progress' | 'confirmed' | 'completed' | 'cancelled' | 'pending' | 'provisional'
// 護摩祈願（type='prayer'）の内容。それ以外のtypeでは常にnull
export type GomaPurpose = 'gokigan' | 'newcar' | 'anzan' | 'shichigosan' | 'other'

export interface ReservationCategory {
  id: string
  name: string
  is_default: boolean
  sort_order: number
  created_at: string
}

export interface SlotOverride {
  id: string
  type: ReservationType
  date: string
  time_slot: string
  is_closed: boolean
  max_groups: number | null
  max_people: number | null
  reserved_groups: number | null
  reserved_people: number | null
  note: string | null
  created_at: string
}

export interface Reservation {
  id: string
  type: ReservationType
  date: string
  time_slot: string
  name: string
  name_kana: string
  email: string
  phone: string
  party_size: number
  notes: string | null
  status: ReservationStatus
  locale: string
  category_id: string | null
  goma_purpose: string | null
  assigned_admin_id: string | null
  updated_by: string | null
  confirmation_email_sent: boolean
  auto_reply_sent: boolean
  updated_at: string
  created_at: string
}

export interface CodOrderItem {
  name: string
  price: number
  quantity: number
}

export type CodOrderStatus = 'unconfirmed' | 'in_progress' | 'confirmed' | 'shipped' | 'completed' | 'cancelled'

export interface CodOrder {
  id: string
  name: string
  name_kana: string
  email: string
  phone: string
  postal_code: string
  address: string
  items: CodOrderItem[]
  total_amount: number
  shipping_fee: number
  notes: string | null
  status: CodOrderStatus
  assigned_admin_id: string | null
  updated_by: string | null
  auto_reply_sent: boolean
  updated_at: string
  created_at: string
}

export interface GoodsItem {
  id: string
  name: string
  price: number
}

export type ContactStatus = 'unread' | 'checking' | 'replied' | 'completed'
export type ContactSource = 'contact' | 'event_application'

export interface Contact {
  id: string
  name: string
  email: string
  subject: string
  message: string
  is_read: boolean
  status: ContactStatus
  source: ContactSource
  assigned_admin_id: string | null
  updated_by: string | null
  auto_reply_sent: boolean
  updated_at: string
  created_at: string
}

export type AdminRole = 'super_admin' | 'admin' | 'reservation_admin' | 'reservation_search_admin' | 'contact_admin' | 'viewer'

export interface AdminProfile {
  id: string
  email: string
  name: string | null
  role: AdminRole
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AdminActivityLog {
  id: string
  actor_id: string | null
  action: string
  target_table: string | null
  target_id: string | null
  old_value: Record<string, unknown> | null
  new_value: Record<string, unknown> | null
  created_at: string
}

export type MediaSite = 'chuzenji' | 'onsenji'

export interface Media {
  id: string
  filename: string
  storage_path: string
  public_url: string
  alt: string | null
  size_bytes: number | null
  mime_type: string | null
  is_lendable: boolean
  site: MediaSite
  created_at: string
}

export const APPLICATION_CATEGORIES = [
  '写真使用・貸出し許可申請',
  '撮影・取材申請',
  '団体予約申請',
  '減免申請',
  'その他',
] as const
export type ApplicationCategory = typeof APPLICATION_CATEGORIES[number]

export type ApplicationStatus = 'unread' | 'checking' | 'replied' | 'completed'

export interface Application {
  id: string
  category: string
  name: string
  email: string
  phone: string | null
  message: string
  photo_ref: string | null
  is_read: boolean
  status: ApplicationStatus
  assigned_admin_id: string | null
  updated_by: string | null
  auto_reply_sent: boolean
  updated_at: string
  created_at: string
  company_name: string | null
  contact_kana: string | null
  postal_code: string | null
  address: string | null
  address_detail: string | null
  mobile: string | null
  fax: string | null
  attachment_url: string | null
  attachment_filename: string | null
  media_categories: string[] | null
  media_name: string | null
  media_content: string | null
  publish_date: string | null
  interview_formats: string[] | null
  preferred_date_1: string | null
  preferred_time_1: string | null
  preferred_date_2: string | null
  preferred_time_2: string | null
  preferred_date_3: string | null
  preferred_time_3: string | null
  attendee_count: string | null
  duration_minutes: string | null
  request_notes: string | null
  visit_date: string | null
  group_name: string | null
  course_number: string | null
  adult_count: string | null
  child_count: string | null
  student_count: string | null
  school_or_company: string | null
}

export const MEDIA_CATEGORIES = [
  '一般書籍・雑誌', 'テレビ', 'ラジオ', 'WEBメディア', '新聞', '映画',
  'DVD', 'フリーペーパー', 'パンフレット', '広報誌', '教科書・教材', '官公庁', 'その他',
] as const

export const INTERVIEW_FORMATS = [
  '撮影', '手持ち写真を使用', '原稿確認', 'インタビュー', '電話取材', '写真貸し出し', '動画貸し出し',
] as const

export const TIME_SLOTS = [
  '9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
] as const
