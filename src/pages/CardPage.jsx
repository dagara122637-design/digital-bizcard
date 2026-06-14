// ─────────────────────────────────────────────────────────────
// src/pages/CardPage.jsx
// 공개 카드 뷰 — /card/:slug 로 접근
// Supabase에서 slug로 데이터 로드 → 읽기전용 렌더링
// ─────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { loadCard, incrementView } from '../db'
import { BASE_TEMPLATES, hexToRgb } from './EditorPage'
import CardPreview from '../components/CardPreview'

export default function CardPage() {
  const { slug } = useParams()
  const [card, setCard]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function fetch() {
      setLoading(true)
      const { card: c, error } = await loadCard(slug)
      if (error || !c) {
        setNotFound(true)
      } else {
        setCard(c)
        incrementView(slug) // 조회수 비동기 증가
      }
      setLoading(false)
    }
    fetch()
  }, [slug])

  if (loading) return <LoadingScreen />
  if (notFound) return <NotFoundScreen />

  const baseT = BASE_TEMPLATES[card.template_id] || BASE_TEMPLATES.dark
  const t = { ...baseT, accentRgb: hexToRgb(baseT.accent) }
  const shareUrl = `${window.location.origin}/card/${slug}`
  const me = { particle:true, glitch:true, scroll:true, counter:true, hover:true, load:true }

  return (
    <div style={{ background:t.bg, minHeight:'100vh' }}>
      {/* 상단 얇은 accent 바 */}
      <div style={{ height:2, background:t.accent }} />
      <CardPreview t={t} data={card.data} shareUrl={shareUrl} me={me} readOnly />
    </div>
  )
}

function LoadingScreen() {
  return (
    <div style={{ minHeight:'100vh', background:'#08080f', display:'flex',
      alignItems:'center', justifyContent:'center', fontFamily:'sans-serif' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:24, color:'#c9a84c', marginBottom:12,
          animation:'spin 1.2s linear infinite' }}>◆</div>
        <div style={{ fontSize:10, letterSpacing:'4px', color:'#6a6880', textTransform:'uppercase' }}>
          Loading...
        </div>
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

function NotFoundScreen() {
  return (
    <div style={{ minHeight:'100vh', background:'#08080f', display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center', fontFamily:'sans-serif' }}>
      <div style={{ fontSize:48, color:'#c9a84c', marginBottom:16 }}>404</div>
      <div style={{ fontSize:12, letterSpacing:'4px', color:'#6a6880', textTransform:'uppercase', marginBottom:32 }}>
        Card not found
      </div>
      <a href="/" style={{ fontSize:10, letterSpacing:'3px', color:'#c9a84c',
        textTransform:'uppercase', textDecoration:'none',
        border:'1px solid #c9a84c', padding:'10px 24px' }}>
        Create New Card
      </a>
    </div>
  )
}
