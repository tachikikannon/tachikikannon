export type NewsCategory = 'お知らせ' | '行事案内' | '季節のお知らせ' | '交通情報' | '授与品のお知らせ'

export interface News {
  id: string
  title: string
  excerpt: string | null
  body: string
  cover_url: string | null
  category: NewsCategory
  is_published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface Post {
  id: string
  title: string
  slug: string
  excerpt: string | null
  body: string
  cover_url: string | null
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

export type ReservationType = 'prayer' | 'shakyou' | 'shabutu' | 'jyuzu'
export type ReservationStatus = 'unconfirmed' | 'in_progress' | 'confirmed' | 'completed' | 'cancelled' | 'pending'

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
  assigned_admin_id: string | null
  updated_by: string | null
  updated_at: string
  created_at: string
}

export type ContactStatus = 'unread' | 'checking' | 'replied' | 'completed'

export interface Contact {
  id: string
  name: string
  email: string
  subject: string
  message: string
  is_read: boolean
  status: ContactStatus
  assigned_admin_id: string | null
  updated_by: string | null
  updated_at: string
  created_at: string
}

export type AdminRole = 'super_admin' | 'admin' | 'viewer'

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

export interface Media {
  id: string
  filename: string
  storage_path: string
  public_url: string
  alt: string | null
  size_bytes: number | null
  mime_type: string | null
  is_lendable: boolean
  created_at: string
}

export const APPLICATION_CATEGORIES = [
  '写真使用・貸出し許可申請',
  '境内撮影許可申請',
  '取材・取材協力依頼',
  'その他',
] as const
export type ApplicationCategory = typeof APPLICATION_CATEGORIES[number]

export interface Application {
  id: string
  category: string
  name: string
  email: string
  phone: string | null
  message: string
  photo_ref: string | null
  is_read: boolean
  created_at: string
}
