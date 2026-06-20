// src/pages/AdminPage.jsx
// 관리자 대시보드 — 비밀번호 1개로 보호, 전체 카드 목록 관리
import { useState, useEffect } from 'react'
import { listCards, deleteCard } from '../db'
import { BASE_TEMPLATES } from './EditorPage'

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD
const SESSION_KEY = 'admin_unlocked' // 새로고침 전까지만 기억 (sessionStorage)

function formatDate(iso) {
  if (!iso) return '-'
  const d = new Date(iso)
  return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
}

// ── 비밀번호 게이트 ───────────────────────────────────────────
function PasswordGate({ onUnlock }) {
  const [input, setInput] = useState('')
  const [err, setErr] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (!ADMIN_PASSWORD) {
      setErr(true) // 환경변수 자체가 비어있으면 안내
      return
    }
    if (input === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, '1')
      onUnlock()
    } else {
      setErr(true)
      setInput('')
    }
  }

  return (
    <div style={{ minHeight:'100vh', background:'#08080f', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'sans-serif', padding:20 }}>
      <form onSubmit={handleSubmit} style={{ width:'min(360px,100%)', textAlign:'center' }}>
        <div style={{ fontSize:11, letterSpacing:'4px', color:'#c9a84c', textTransform:'uppercase', marginBottom:24 }}>
          ✦ ADMIN ACCESS
        </div>
        <input
          type="password"
          autoFocus
          value={input}
          onChange={(e) => { setInput(e.target.value); setErr(false) }}
          placeholder="비밀번호 입력"
          style={{
            width:'100%', padding:'14px 16px', background:'#161620',
            border:`1px solid ${err ? '#ff5050' : '#22222e'}`, color:'#f0ede6',
            fontSize:14, fontFamily:'sans-serif', outline:'none', boxSizing:'border-box',
            textAlign:'center', letterSpacing:'2px',
          }}
        />
        {err && (
          <div style={{ fontSize:11, color:'#ff5050', marginTop:10, fontFamily:'sans-serif' }}>
            {!ADMIN_PASSWORD ? '관리자 비밀번호가 설정되지 않았어요 (.env.local 확인)' : '비밀번호가 올바르지 않아요'}
          </div>
        )}
        <button type="submit" style={{
          width:'100%', marginTop:16, padding:'13px', background:'#c9a84c', border:'none',
          color:'#0a0a0f', fontSize:11, letterSpacing:'2px', textTransform:'uppercase',
          fontWeight:700, cursor:'pointer', fontFamily:'sans-serif',
        }}>
          입장
        </button>
      </form>
    </div>
  )
}

// ── 메인 대시보드 ────────────────────────────────────────────
function Dashboard() {
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState(null)
  const [search, setSearch] = useState('')
  const [confirmSlug, setConfirmSlug] = useState(null) // 삭제 확인 대기 중인 slug

  async function fetchCards() {
    setLoading(true)
    const { cards: list, error } = await listCards()
    if (error) setErr(error.message)
    else setCards(list)
    setLoading(false)
  }

  useEffect(() => { fetchCards() }, [])

  async function handleDelete(slug) {
    const { error } = await deleteCard(slug)
    if (!error) {
      setCards((prev) => prev.filter((c) => c.slug !== slug))
    }
    setConfirmSlug(null)
  }

  const filtered = cards.filter((c) => {
  const name = c.companyName ?? c.data?.companyName ?? ''
  return name.toLowerCase().includes(search.toLowerCase())
)

  return (
    <div style={{ minHeight:'100vh', background:'#08080f', color:'#f0ede6', fontFamily:'sans-serif' }}>
      {/* 헤더 */}
      <div style={{ padding:'20px 24px', borderBottom:'1px solid #22222e', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div>
          <div style={{ fontSize:11, letterSpacing:'4px', color:'#c9a84c', textTransform:'uppercase' }}>✦ ADMIN DASHBOARD</div>
          <div style={{ fontSize:10, color:'#6a6880', marginTop:4 }}>총 {cards.length}개 카드</div>
        </div>
        <a href="/" style={{
          padding:'9px 18px', background:'#c9a84c', border:'none', color:'#0a0a0f',
          fontSize:10, letterSpacing:'2px', textTransform:'uppercase', fontWeight:700,
          textDecoration:'none', cursor:'pointer',
        }}>
          + 새 카드 만들기
        </a>
      </div>

      {/* 검색 */}
      <div style={{ padding:'16px 24px 0' }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="회사이름으로 검색..."
          style={{
            width:'100%', maxWidth:320, padding:'9px 12px', background:'#161620',
            border:'1px solid #22222e', color:'#f0ede6', fontSize:12,
            fontFamily:'sans-serif', outline:'none', boxSizing:'border-box',
          }}
        />
      </div>

      {/* 목록 */}
      <div style={{ padding:24 }}>
        {loading && (
          <div style={{ fontSize:11, color:'#6a6880', letterSpacing:'2px', textTransform:'uppercase' }}>불러오는 중...</div>
        )}
        {err && (
          <div style={{ fontSize:12, color:'#ff5050' }}>목록을 불러오지 못했어요: {err}</div>
        )}
        {!loading && !err && filtered.length === 0 && (
          <div style={{ fontSize:12, color:'#6a6880', textAlign:'center', padding:'40px 0' }}>
            {cards.length === 0 ? '아직 만든 카드가 없어요.' : '검색 결과가 없어요.'}
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {filtered.map((c) => {
              const tmpl = BASE_TEMPLATES[c.templateId] || BASE_TEMPLATES.dark
              const shareUrl = `${window.location.origin}/card/${c.slug}`
              return (
                <div key={c.slug} style={{
                  padding:'16px 18px', background:'#10101a', border:'1px solid #22222e',
                  display:'flex', alignItems:'center', gap:16, flexWrap:'wrap',
                }}>
                  {/* 템플릿 색상 표시 */}
                  <div style={{ width:36, height:36, borderRadius:6, flexShrink:0,
                    background: tmpl.accent, display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:14, color:(tmpl.id==='white'||tmpl.id==='green') ? '#fff' : '#0a0a0f' }}>
                    {tmpl.emoji}
                  </div>

                  {/* 회사이름 + 메타 정보 */}
                  <div style={{ flex:1, minWidth:160 }}>
                    <div style={{ fontSize:14, fontWeight:700 }}>{c.companyName}</div>
                    <div style={{ fontSize:10, color:'#6a6880', marginTop:3 }}>
                      {tmpl.name} · 조회 {c.viewCount.toLocaleString()} · 수정 {formatDate(c.updatedAt)}
                    </div>
                  </div>

                  {/* 액션 버튼들 */}
                  <div style={{ display:'flex', gap:8, flexShrink:0 }}>
                    <a href={`/?edit=${c.slug}`} style={{
                      padding:'7px 14px', background:'transparent', border:'1px solid #c9a84c',
                      color:'#c9a84c', fontSize:10, letterSpacing:'1px', textTransform:'uppercase',
                      textDecoration:'none', cursor:'pointer',
                    }}>
                      편집
                    </a>
                    <a href={shareUrl} target="_blank" rel="noopener noreferrer" style={{
                      padding:'7px 14px', background:'transparent', border:'1px solid #22222e',
                      color:'#6a6880', fontSize:10, letterSpacing:'1px', textTransform:'uppercase',
                      textDecoration:'none', cursor:'pointer',
                    }}>
                      보기
                    </a>
                    {confirmSlug === c.slug ? (
                      <div style={{ display:'flex', gap:6 }}>
                        <button onClick={() => handleDelete(c.slug)} style={{
                          padding:'7px 12px', background:'#ff5050', border:'none', color:'#fff',
                          fontSize:10, letterSpacing:'1px', textTransform:'uppercase', cursor:'pointer',
                        }}>
                          확인
                        </button>
                        <button onClick={() => setConfirmSlug(null)} style={{
                          padding:'7px 12px', background:'transparent', border:'1px solid #22222e',
                          color:'#6a6880', fontSize:10, letterSpacing:'1px', textTransform:'uppercase', cursor:'pointer',
                        }}>
                          취소
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setConfirmSlug(c.slug)} style={{
                        padding:'7px 14px', background:'transparent', border:'1px solid #22222e',
                        color:'#ff5050', fontSize:10, letterSpacing:'1px', textTransform:'uppercase', cursor:'pointer',
                      }}>
                        삭제
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

// ── 메인 export ──────────────────────────────────────────────
export default function AdminPage() {
  const [unlocked, setUnlocked] = useState(
    typeof window !== 'undefined' && sessionStorage.getItem(SESSION_KEY) === '1'
  )

  if (!unlocked) return <PasswordGate onUnlock={() => setUnlocked(true)} />
  return <Dashboard />
}
