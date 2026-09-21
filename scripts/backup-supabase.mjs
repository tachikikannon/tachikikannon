#!/usr/bin/env node
// Supabase の全テーブル・Storage（画像/PDF）・管理者アカウント一覧をローカルに保存する。
// 使い方: npm run backup  （準備は SETUP.md の「バックアップ」を参照）
// 個人情報（予約・お問い合わせ等）を含むため、出力先は必ずリポジトリの外にする。
import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

// テーブル/バケットを自動検出できなかった場合の予備（supabase/schema.sql と同じ内容）
const FALLBACK_TABLES = [
  'admin_activity_logs', 'admin_profiles', 'applications', 'blocked_dates', 'capacity_settings',
  'cod_orders', 'contacts', 'events', 'media', 'minor_events', 'news', 'posts',
  'reservation_categories', 'reservations', 'site_content', 'slot_overrides',
]
const FALLBACK_BUCKETS = ['temple-images', 'application-attachments']

const die = (msg) => { console.error(`\n✖ ${msg}\n`); process.exit(1) }

async function loadEnvFile(file) {
  let text
  try { text = await fs.readFile(path.join(root, file), 'utf8') } catch { return }
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*?)\s*$/)
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2')
  }
}
await loadEnvFile('.env.backup')
await loadEnvFile('.env.local')

function keyRole(key) {
  if (key.startsWith('sb_secret_')) return 'service_role'
  if (key.startsWith('sb_publishable_')) return 'anon'
  try { return JSON.parse(Buffer.from(key.split('.')[1], 'base64url').toString()).role } catch { return 'unknown' }
}

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
// 動作確認用（開発時のみ）: 公開データだけを対象にした部分的なバックアップ。本番のバックアップには使わないこと。
const allowAnon = process.env.SUPABASE_BACKUP_ALLOW_ANON === '1'
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || (allowAnon ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY : undefined)

if (!url) die('SUPABASE_URL（または NEXT_PUBLIC_SUPABASE_URL）が見つかりません。')
if (!key) die('SUPABASE_SERVICE_ROLE_KEY が見つかりません。SETUP.md の「バックアップ」の手順で .env.backup を作成してください。')
const role = keyRole(key)
if (role !== 'service_role' && !allowAnon) {
  // anon キーだと行レベルセキュリティで予約等が空に見え、「0件のバックアップ」が成功してしまうため必ず止める
  die(`指定されたキーは service_role ではありません（${role}）。このキーでは予約・お問い合わせ等を取得できず、空のバックアップになります。`)
}

const outRoot = path.resolve(process.env.BACKUP_DIR || path.join(root, '..', 'temple-cms-バックアップ'))
const rel = path.relative(root, outRoot)
if (!rel.startsWith('..') && !path.isAbsolute(rel)) {
  die(`出力先がこのリポジトリの中です（${outRoot}）。個人情報が公開リポジトリに載る恐れがあるため中止しました。`)
}

const now = new Date()
const pad = (n) => String(n).padStart(2, '0')
const stamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}`
const dataDir = path.join(outRoot, 'data', stamp)
await fs.mkdir(dataDir, { recursive: true })

const sb = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
const errors = []
const manifest = { startedAt: now.toISOString(), keyRole: role, tables: {}, auth: null, storage: {} }

// ---- テーブル ----
let tables = FALLBACK_TABLES
const pks = {}
try {
  const res = await fetch(`${url}/rest/v1/`, { headers: { apikey: key, Authorization: `Bearer ${key}` } })
  const defs = (await res.json()).definitions
  if (defs && Object.keys(defs).length) {
    tables = Object.keys(defs)
    for (const [t, d] of Object.entries(defs)) {
      const pk = Object.entries(d.properties ?? {}).find(([, p]) => String(p.description ?? '').includes('<pk'))
      if (pk) pks[t] = pk[0]
    }
  } else console.warn('！ テーブル一覧を自動取得できなかったため、予備の一覧を使います。')
} catch { console.warn('！ テーブル一覧を自動取得できなかったため、予備の一覧を使います。') }

async function dumpTable(name) {
  const rows = []
  const size = 1000
  let total = null
  for (let from = 0; ; from += size) {
    let q = sb.from(name).select('*', { count: 'exact' }).range(from, from + size - 1)
    if (pks[name]) q = q.order(pks[name], { ascending: true })
    const { data, error, count } = await q
    if (error) throw new Error(error.message)
    total ??= count
    rows.push(...data)
    if (data.length < size) break
  }
  if (total !== null && rows.length !== total) throw new Error(`件数が一致しません（取得 ${rows.length} / 実際 ${total}）`)
  return rows
}

console.log(`\n■ テーブル（${tables.length}件）`)
for (const t of tables) {
  try {
    const rows = await dumpTable(t)
    await fs.writeFile(path.join(dataDir, `${t}.json`), JSON.stringify(rows, null, 2))
    manifest.tables[t] = rows.length
    console.log(`  ✔ ${t.padEnd(26)} ${String(rows.length).padStart(6)} 件`)
  } catch (e) {
    errors.push(`テーブル ${t}: ${e.message}`)
    console.log(`  ✖ ${t.padEnd(26)} 失敗: ${e.message}`)
  }
}

// ---- 管理者アカウント（パスワードは含まれない。復旧時はパスワード再設定が必要） ----
if (role === 'service_role') {
  try {
    const users = []
    for (let page = 1; ; page++) {
      const { data, error } = await sb.auth.admin.listUsers({ page, perPage: 1000 })
      if (error) throw new Error(error.message)
      users.push(...data.users.map((u) => ({
        id: u.id, email: u.email, created_at: u.created_at, last_sign_in_at: u.last_sign_in_at,
        user_metadata: u.user_metadata, app_metadata: u.app_metadata,
      })))
      if (data.users.length < 1000) break
    }
    await fs.writeFile(path.join(dataDir, '_auth_users.json'), JSON.stringify(users, null, 2))
    manifest.auth = users.length
    console.log(`\n■ 管理者アカウント  ✔ ${users.length} 件`)
  } catch (e) {
    errors.push(`管理者アカウント: ${e.message}`)
    console.log(`\n■ 管理者アカウント  ✖ 失敗: ${e.message}`)
  }
}

// ---- Storage（差分保存: 既に同じサイズのファイルがあればスキップ。削除済みの画像も残る） ----
const safe = (seg) => seg.replace(/[<>:"|?*\x00-\x1f]/g, '_')

async function listAll(bucket, prefix = '') {
  const files = []
  for (let offset = 0; ; offset += 1000) {
    const { data, error } = await sb.storage.from(bucket).list(prefix, { limit: 1000, offset, sortBy: { column: 'name', order: 'asc' } })
    if (error) throw new Error(error.message)
    for (const item of data) {
      const p = prefix ? `${prefix}/${item.name}` : item.name
      if (item.id === null) files.push(...(await listAll(bucket, p)))
      else files.push({ path: p, size: item.metadata?.size })
    }
    if (data.length < 1000) break
  }
  return files
}

let buckets = FALLBACK_BUCKETS
{
  const { data } = await sb.storage.listBuckets()
  if (data?.length) buckets = data.map((b) => b.name)
}

console.log(`\n■ Storage（${buckets.length}バケット）`)
for (const bucket of buckets) {
  try {
    const files = await listAll(bucket)
    let downloaded = 0, skipped = 0, bytes = 0
    for (const f of files) {
      const dest = path.join(outRoot, 'storage', safe(bucket), ...f.path.split('/').map(safe))
      const st = await fs.stat(dest).catch(() => null)
      if (st && f.size != null && st.size === f.size) { skipped++; continue }
      const { data, error } = await sb.storage.from(bucket).download(f.path)
      if (error) { errors.push(`Storage ${bucket}/${f.path}: ${error.message}`); continue }
      const buf = Buffer.from(await data.arrayBuffer())
      await fs.mkdir(path.dirname(dest), { recursive: true })
      await fs.writeFile(dest, buf)
      downloaded++; bytes += buf.length
    }
    manifest.storage[bucket] = { files: files.length, downloaded, skipped }
    console.log(`  ✔ ${bucket.padEnd(26)} ${String(files.length).padStart(6)} 件（新規 ${downloaded} / 保存済み ${skipped} / ${(bytes / 1048576).toFixed(1)}MB）`)
  } catch (e) {
    errors.push(`Storage ${bucket}: ${e.message}`)
    console.log(`  ✖ ${bucket.padEnd(26)} 失敗: ${e.message}`)
  }
}

manifest.finishedAt = new Date().toISOString()
manifest.errors = errors
await fs.writeFile(path.join(dataDir, '_manifest.json'), JSON.stringify(manifest, null, 2))

console.log(`\n保存先: ${outRoot}`)
if (errors.length) {
  console.log(`\n✖ ${errors.length} 件の失敗があります。上の ✖ を確認してください。\n`)
  process.exit(1)
}
console.log('\n✔ バックアップが完了しました。\n')
