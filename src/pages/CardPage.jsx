// src/pages/CardPage.jsx — 공개 카드 뷰 + 방문자 수 표시
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { loadCard, incrementView } from '../db'
import { BASE_TEMPLATES, hexToRgb } from './EditorPage'
import CardPreview from '../components/CardPreview'

export default function CardPage() {
  const { slug } = useParams()
  const [card, setCard]         = useState(null)
  const [loading, setLoading]   = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [viewCount, setViewCount] = useState(0)

  useEffect(() => {
    async function fetch() {
      setLoading(true)
      const { card: c, error } = await loadCard(slug)
      if (error || !c) {
        setNotFound(true)
      } else {
        setCard(c)
        setViewCount((c.view_count || 0) + 1) // +1 현재 방문 포함
        incrementView(slug)
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
  // 구버전 저장 카드 호환: history/pricing/sections 없으면 빈 값으로 보완
  const cardData = {
    history: [], pricing: [], sections: { history:false, pricing:false },
    ...card.data,
  }

  return (
    <div style={{ background:t.bg, minHeight:'100vh' }}>
      {/* 상단 accent 바 */}
      <div style={{ height:2, background:t.accent }} />

      {/* 카드 본문 */}
      <CardPreview t={t} data={cardData} shareUrl={shareUrl} me={me} readOnly />

      {/* ━━ 하단 푸터 — 방문자 수 ━━ */}
      <footer style={{
        padding:'20px 44px',
        background: t.surface,
        borderTop:`1px solid ${t.border}`,
        display:'flex', alignItems:'center', justifyContent:'space-between',
        flexWrap:'wrap', gap:12,
      }}>
        {/* 방문자 수 */}
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{
            width:32, height:32, borderRadius:'50%',
            background:`rgba(${t.accentRgb},.1)`,
            border:`1px solid rgba(${t.accentRgb},.3)`,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:14,
          }}>👁</div>
          <div>
            <div style={{ fontSize:18, fontWeight:800, color:t.accent, fontFamily:'sans-serif', lineHeight:1 }}>
              {viewCount.toLocaleString()}
            </div>
            <div style={{ fontSize:9, letterSpacing:'2px', color:t.textSub, textTransform:'uppercase', fontFamily:'sans-serif', marginTop:2 }}>
              Views
            </div>
          </div>
        </div>

        {/* 공유 버튼 */}
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <button onClick={() => { navigator.clipboard.writeText(shareUrl) }}
            style={{ padding:'8px 18px', background:'transparent', border:`1px solid ${t.accent}`,
              color:t.accent, fontSize:10, letterSpacing:'2px', textTransform:'uppercase',
              cursor:'pointer', fontFamily:'sans-serif' }}>
            🔗 링크 복사
          </button>
          <a href="/" style={{ padding:'8px 18px', background:t.accent, border:'none',
            color: (card.template_id==='white'||card.template_id==='green') ? '#fff' : '#0a0a0f',
            fontSize:10, letterSpacing:'2px', textTransform:'uppercase',
            cursor:'pointer', fontFamily:'sans-serif', textDecoration:'none', display:'inline-block' }}>
            ✦ 카드 만들기
          </a>
        </div>

        {/* 브랜딩 */}
        <div style={{ fontSize:9, letterSpacing:'2px', color:t.textSub, textTransform:'uppercase', fontFamily:'sans-serif' }}>
          Digital Card Pro
        </div>
      </footer>
    </div>
  )
}

function LoadingScreen() {
  return (
    <div style={{ minHeight:'100vh', background:'#08080f', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'sans-serif' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:24, color:'#c9a84c', marginBottom:12, animation:'spin 1.2s linear infinite' }}>◆</div>
        <div style={{ fontSize:10, letterSpacing:'4px', color:'#6a6880', textTransform:'uppercase' }}>Loading...</div>
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

function NotFoundScreen() {
  return (
    <div style={{ minHeight:'100vh', background:'#08080f', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', fontFamily:'sans-serif' }}>
      <div style={{ fontSize:48, color:'#c9a84c', marginBottom:16 }}>404</div>
      <div style={{ fontSize:12, letterSpacing:'4px', color:'#6a6880', textTransform:'uppercase', marginBottom:32 }}>Card not found</div>
      <a href="/" style={{ fontSize:10, letterSpacing:'3px', color:'#c9a84c', textTransform:'uppercase', textDecoration:'none', border:'1px solid #c9a84c', padding:'10px 24px' }}>
        Create New Card
      </a>
    </div>
  )
}
