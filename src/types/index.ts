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
export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled'

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
  created_at: string
}

export interface Contact {
  id: string
  name: string
  email: string
  subject: string
  message: string
  is_read: boolean
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
  created_at: string
}
