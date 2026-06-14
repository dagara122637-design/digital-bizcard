// ─────────────────────────────────────────────────────────────
// src/db.js
// 카드 저장 / 조회 / 업데이트
// ─────────────────────────────────────────────────────────────
import { supabase } from './supabase'

// ── 고유 slug 생성 (6자 영소문자+숫자) ───────────────────────
function generateSlug() {
  return Math.random().toString(36).slice(2, 8)
}

// ── 카드 저장 (신규) ─────────────────────────────────────────
// 반환값: { slug, error }
export async function saveCard(data, templateId) {
  const slug = generateSlug()

  const { error } = await supabase
    .from('cards')
    .insert({
      slug,
      template_id: templateId,
      data: data,           // JSON 통째로 저장
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

  if (error) return { slug: null, error }
  return { slug, error: null }
}

// ── 카드 업데이트 (기존 slug 재저장) ─────────────────────────
export async function updateCard(slug, data, templateId) {
  const { error } = await supabase
    .from('cards')
    .update({
      template_id: templateId,
      data: data,
      updated_at: new Date().toISOString(),
    })
    .eq('slug', slug)

  return { error }
}

// ── slug로 카드 조회 ─────────────────────────────────────────
export async function loadCard(slug) {
  const { data, error } = await supabase
    .from('cards')
    .select('*')
    .eq('slug', slug)
    .single()

  return { card: data, error }
}

// ── 조회수 증가 ───────────────────────────────────────────────
export async function incrementView(slug) {
  await supabase.rpc('increment_view', { card_slug: slug })
}
