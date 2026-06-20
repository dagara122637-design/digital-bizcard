// src/pages/EditorPage.jsx
import { useState, useRef, useEffect } from 'react'
import { saveCard, updateCard } from '../db'
import CardPreview from '../components/CardPreview'
import EditorPanel from '../components/EditorPanel'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 템플릿 토큰 — 4종 (dark / white / gold / green 추가)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const BASE_TEMPLATES = {
  dark:  { id:'dark',  name:'다크 럭셔리',    emoji:'◆', bg:'#08080f', surface:'#10101a', surfaceAlt:'#161620', accent:'#c9a84c', accentRgb:'201,168,76',  text:'#f0ede6', textSub:'#6a6880', border:'#22222e', heroBg:'linear-gradient(160deg,#08080f 0%,#16102a 55%,#08080f 100%)' },
  white: { id:'white', name:'미니멀 화이트',  emoji:'○', bg:'#f8f7f4', surface:'#ffffff', surfaceAlt:'#f0ede8', accent:'#1c1c30', accentRgb:'28,28,48',   text:'#0f0f1c', textSub:'#7a7a8a', border:'#e2e0db', heroBg:'linear-gradient(160deg,#ffffff 0%,#eceae4 100%)' },
  gold:  { id:'gold',  name:'골드 에디션',    emoji:'✦', bg:'#0b0900', surface:'#141100', surfaceAlt:'#1c1800', accent:'#d4af37', accentRgb:'212,175,55', text:'#f5f0e0', textSub:'#8a8060', border:'#2a2400', heroBg:'linear-gradient(160deg,#0b0900 0%,#1a1400 50%,#0b0900 100%)' },
  green: { id:'green', name:'프리미엄 내추럴', emoji:'✿', bg:'#050f08', surface:'#0a1a0e', surfaceAlt:'#0f2214', accent:'#b5a642', accentRgb:'181,166,66', text:'#e8f0e4', textSub:'#5a7060', border:'#1a3020', heroBg:'linear-gradient(160deg,#050f08 0%,#0d2218 50%,#050f08 100%)' },
}

export function hexToRgb(h) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h)
  return r ? `${parseInt(r[1],16)},${parseInt(r[2],16)},${parseInt(r[3],16)}` : '255,255,255'
}

function uid() { return Math.random().toString(36).slice(2, 8) }

export const DEFAULT_DATA = {
  companyName: 'AETHER STUDIO',
  tagline: 'Where Vision Meets Precision',
  logo: 'Æ',
  description: '브랜드의 본질을 시각 언어로 번역합니다. 전략적 사고와 감각적 실행이 만나는 곳에서, 고객의 이야기를 세상과 연결합니다.',
  stats: [
    { label:'Projects', value:240, suffix:'+' },
    { label:'Clients',  value:85,  suffix:'+' },
    { label:'Awards',   value:12,  suffix:'' },
  ],
  services: [
    { id:'s1', title:'Brand Strategy',  desc:'브랜드 아이덴티티 및 전략 수립' },
    { id:'s2', title:'Digital Design',  desc:'UI/UX 디자인 및 디지털 경험' },
    { id:'s3', title:'Content Creation',desc:'영상·사진·카피 크리에이티브' },
  ],
  portfolio: [
    { id:'p1', title:'LUXE REBRAND',    year:'2024', tag:'Identity', image:null },
    { id:'p2', title:'FINTECH APP',     year:'2024', tag:'Digital',  image:null },
    { id:'p3', title:'CAMPAIGN VISUAL', year:'2023', tag:'Content',  image:null },
    { id:'p4', title:'HOTEL BRANDING',  year:'2023', tag:'Identity', image:null },
  ],
  contact: { email:'hello@aetherstudio.kr', phone:'02-1234-5678', address:'서울 강남구 테헤란로 123, 15F' },
  links: [
    { id:'l1', platform:'website',   url:'https://aetherstudio.kr',            active:true,  order:0 },
    { id:'l2', platform:'instagram', url:'https://instagram.com/aetherstudio',  active:true,  order:1 },
    { id:'l3', platform:'linkedin',  url:'https://linkedin.com/company/aether', active:true,  order:2 },
    { id:'l4', platform:'behance',   url:'https://behance.net/aetherstudio',    active:true,  order:3 },
    { id:'l5', platform:'youtube',   url:'https://youtube.com/@aetherstudio',   active:false, order:4 },
    { id:'l6', platform:'kakao',     url:'https://open.kakao.com/o/example',    active:false, order:5 },
    { id:'l7', platform:'naver',     url:'https://blog.naver.com/aetherstudio', active:false, order:6 },
  ],
  // ── 연혁 (History) ───────────────────────────────────────────
  history: [
    { id:'h1', year:'2024', desc:'시리즈 B 투자 유치, 해외 지사 설립' },
    { id:'h2', year:'2022', desc:'누적 클라이언트 50개사 돌파' },
    { id:'h3', year:'2020', desc:'아에테르 스튜디오 설립' },
  ],
  // ── 서비스 단가표 (Pricing) ───────────────────────────────────
  pricing: [
    { id:'pr1', name:'Basic',    price:'150',  period:'/월', features:['브랜드 가이드 기본형','월 1회 미팅','이메일 지원'], highlighted:false },
    { id:'pr2', name:'Standard', price:'350',  period:'/월', features:['브랜드 가이드 풀세트','월 2회 미팅','우선 지원','콘텐츠 3건/월'], highlighted:true },
    { id:'pr3', name:'Premium',  price:'문의', period:'',   features:['전담 매니저 배정','무제한 미팅','24시간 지원','콘텐츠 무제한'], highlighted:false },
  ],
  // ── 섹션 표시 토글 ────────────────────────────────────────────
  sections: { history:false, pricing:false, heroLinks:true },
  heroBgImage: null,
  logoImage: null,
}

// 슬라이드 전환 훅
const TMPL_ORDER = ['dark','white','gold','green']
function useSlideTransition(tmplKey, enabled) {
  const [active, setActive] = useState(tmplKey)
  const [phase, setPhase]   = useState('idle')
  const [dir, setDir]       = useState(1)
  const prev = useRef(tmplKey)
  useEffect(() => {
    if (tmplKey === active) return
    const oi = TMPL_ORDER.indexOf(prev.current)
    const ni = TMPL_ORDER.indexOf(tmplKey)
    setDir(ni > oi ? 1 : -1)
    prev.current = tmplKey
    setPhase('out')
    const t = setTimeout(() => { setActive(tmplKey); setPhase('in'); setTimeout(() => setPhase('idle'), 400) }, 320)
    return () => clearTimeout(t)
  }, [tmplKey])
  const ws = enabled ? {
    overflow:'hidden',
    ...(phase==='out' ? {opacity:0,transform:`translateX(${dir*-32}px)`,transition:'opacity .32s ease,transform .32s ease'}
      : phase==='in'  ? {opacity:0,transform:`translateX(${dir*32}px)`,transition:'none'}
      :                 {opacity:1,transform:'translateX(0)',transition:'opacity .38s ease,transform .38s cubic-bezier(.22,1,.36,1)'}),
  } : {}
  return [active, ws]
}

// 데스크탑 여부 감지 훅 — 1024px 이상이면 편집+미리보기 동시 표시
function useIsDesktop(breakpoint = 1024) {
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= breakpoint : true
  )
  useEffect(() => {
    function onResize() { setIsDesktop(window.innerWidth >= breakpoint) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [breakpoint])
  return isDesktop
}

export default function EditorPage() {
  const [tmplKey, setTmplKey] = useState('dark')
  const [co, setCo]           = useState({})
  const [data, setData]       = useState(DEFAULT_DATA)
  const [tab, setTab]         = useState('editor')
  const [me, setMe]           = useState({ particle:true,glitch:true,transition:true,scroll:true,counter:true,hover:true,load:true })
  const [slug, setSlug]       = useState(null)
  const [saving, setSaving]   = useState(false)
  const [saveMsg, setSaveMsg] = useState(null)
  const [copied, setCopied]   = useState(false)
  const [mobileTab, setMobileTab] = useState('editor') // 모바일 전용

  const [activeTmpl, slideStyle] = useSlideTransition(tmplKey, me.transition)
  const isDesktop = useIsDesktop(1024)
  const baseT = BASE_TEMPLATES[activeTmpl]
  const t = { ...baseT, ...co, accentRgb: co.accent ? hexToRgb(co.accent) : baseT.accentRgb }
  const shareUrl = slug ? `${window.location.origin}/card/${slug}` : null

  async function handleSave() {
    setSaving(true); setSaveMsg(null)
    const payload = { ...data, motion: me } // 모션 설정도 카드 데이터에 함께 저장
    try {
      if (slug) {
        const { error } = await updateCard(slug, payload, tmplKey)
        if (error) throw error
        setSaveMsg({ type:'ok', text:'업데이트 완료!' })
      } else {
        const { slug: newSlug, error } = await saveCard(payload, tmplKey)
        if (error) throw error
        setSlug(newSlug)
        setSaveMsg({ type:'ok', text:'저장 완료! 링크가 발급됐어요.' })
      }
    } catch (err) {
      setSaveMsg({ type:'err', text:`저장 실패: ${err.message}` })
    } finally {
      setSaving(false)
      setTimeout(() => setSaveMsg(null), 4000)
    }
  }

  function copyLink() {
    if (!shareUrl) return
    navigator.clipboard.writeText(shareUrl).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }

  function handleTmpl(key) { setTmplKey(key); setCo({}) }

  const QR_URL = shareUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}&bgcolor=${t.bg.replace('#','')}&color=${t.accent.replace('#','')}&margin=12`
    : null

  return (
    <div style={{ background:t.bg, minHeight:'100vh', color:t.text, fontFamily:'sans-serif', display:'flex', flexDirection:'column' }}>

      {/* ━━ 네비 (모바일 반응형) ━━ */}
      <div style={{ background:t.surface, borderBottom:`1px solid ${t.border}`, padding:'10px 16px',
        display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0, gap:8, flexWrap:'wrap' }}>

        <span style={{ fontSize:10, letterSpacing:'3px', color:t.accent, textTransform:'uppercase', fontWeight:700, whiteSpace:'nowrap' }}>
          ✦ DIGITAL CARD
        </span>

        {/* 템플릿 선택 — 모바일에서 스크롤 */}
        <div style={{ display:'flex', gap:4, overflowX:'auto', WebkitOverflowScrolling:'touch', flexShrink:1, maxWidth:'calc(100% - 180px)' }}>
          {Object.values(BASE_TEMPLATES).map(tmpl => (
            <button key={tmpl.id} onClick={() => handleTmpl(tmpl.id)}
              style={{ padding:'5px 10px', flexShrink:0,
                border:`1px solid ${tmplKey===tmpl.id ? t.accent : t.border}`,
                background: tmplKey===tmpl.id ? t.accent : 'transparent',
                color: tmplKey===tmpl.id ? (tmpl.id==='white'?'#fff':'#0a0a0f') : t.textSub,
                fontSize:9, letterSpacing:'1px', textTransform:'uppercase', cursor:'pointer', whiteSpace:'nowrap' }}>
              {tmpl.emoji} {tmpl.name}
            </button>
          ))}
        </div>

        {/* 저장 + 공유 */}
        <div style={{ display:'flex', gap:6, alignItems:'center', flexShrink:0 }}>
          {shareUrl && (
            <button onClick={copyLink}
              style={{ padding:'7px 12px', background:'transparent', border:`1px solid ${t.accent}`,
                color:t.accent, fontSize:9, letterSpacing:'2px', textTransform:'uppercase', cursor:'pointer', whiteSpace:'nowrap' }}>
              {copied ? '✓' : '🔗'}
            </button>
          )}
          <button onClick={handleSave} disabled={saving}
            style={{ padding:'7px 14px', background:t.accent, border:'none',
              color: tmplKey==='white'||tmplKey==='green'?'#fff':'#0a0a0f',
              fontSize:9, letterSpacing:'2px', textTransform:'uppercase',
              cursor:saving?'not-allowed':'pointer', fontWeight:700, whiteSpace:'nowrap', opacity:saving?0.7:1 }}>
            {saving ? '저장중...' : slug ? '✦ 업데이트' : '✦ 저장 & 발급'}
          </button>
        </div>
      </div>

      {/* 저장 메시지 */}
      {saveMsg && (
        <div style={{ padding:'8px 16px', fontSize:11, letterSpacing:'1px',
          background: saveMsg.type==='ok' ? `rgba(${t.accentRgb},.12)` : 'rgba(255,80,80,.1)',
          borderBottom:`1px solid ${saveMsg.type==='ok' ? t.accent : '#ff5050'}`,
          color: saveMsg.type==='ok' ? t.accent : '#ff5050', display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
          <span>{saveMsg.text}</span>
          {saveMsg.type==='ok' && shareUrl && (
            <a href={shareUrl} target="_blank" rel="noopener noreferrer"
              style={{ fontSize:10, color:t.accent, opacity:.7, wordBreak:'break-all' }}>{shareUrl}</a>
          )}
        </div>
      )}

      {/* ━━ 뷰 탭 — 모바일/태블릿 전용. 데스크탑(1024px+)에서는 편집+미리보기 항상 동시 표시 ━━ */}
      {!isDesktop && (
        <div style={{ display:'flex', borderBottom:`1px solid ${t.border}`, background:t.surface, flexShrink:0 }}>
          {[{k:'editor',l:'✏ 편집'},{k:'preview',l:'👁 미리보기'}].map(v => (
            <button key={v.k} onClick={() => setTab(v.k)}
              style={{ flex:1, padding:'11px 8px',
                background: tab===v.k ? t.surfaceAlt : 'transparent', border:'none',
                borderBottom: tab===v.k ? `2px solid ${t.accent}` : '2px solid transparent',
                color: tab===v.k ? t.accent : t.textSub,
                fontSize:10, letterSpacing:'2px', textTransform:'uppercase', cursor:'pointer' }}>
              {v.l}
            </button>
          ))}
        </div>
      )}

      {/* ━━ 바디 ━━ */}
      <div style={{ display:'flex', flex:1, overflow:'hidden', minHeight:0 }}>

        {/* 편집 패널 — 데스크탑에서 560px로 확장, 항상 표시 */}
        <div style={{ width: isDesktop ? '560px' : '100%', flexShrink:0, overflowY:'auto',
          display: (isDesktop || tab==='editor') ? 'flex' : 'none', flexDirection:'column',
          borderRight:`1px solid ${t.border}` }}>
          <EditorPanel t={t} data={data} setData={setData} co={co} setCo={setCo} me={me} setMe={setMe} />
        </div>

        {/* 미리보기 — 데스크탑에서 나머지 폭 전부 차지, 항상 표시 */}
        <div style={{ flex:1, overflowY:'auto', display: (isDesktop || tab==='preview') ? 'flex' : 'none', flexDirection:'column', minWidth:0 }}>
          {/* URL 바 */}
          <div style={{ background:t.surfaceAlt, borderBottom:`1px solid ${t.border}`,
            padding:'8px 14px', display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
            {shareUrl ? (
              <>
                <a href={shareUrl} target="_blank" rel="noopener noreferrer"
                  style={{ flex:1, fontSize:10, color:t.accent, textDecoration:'none',
                    overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', fontFamily:'monospace' }}>
                  🔗 {shareUrl}
                </a>
                {QR_URL && <img src={QR_URL} alt="QR" width={28} height={28} style={{ border:`1px solid ${t.border}`, flexShrink:0 }}/>}
              </>
            ) : (
              <span style={{ flex:1, fontSize:10, color:t.textSub, fontFamily:'monospace' }}>
                저장 후 고유 링크가 발급됩니다
              </span>
            )}
          </div>

          {/* 카드 프리뷰 */}
          <div style={{ flex:1, overflowY:'auto', ...slideStyle }}>
            <CardPreview t={t} data={data} shareUrl={shareUrl} me={me} />
          </div>
        </div>
      </div>
    </div>
  )
}
