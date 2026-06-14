// src/components/CardPreview.jsx
import { useState, useEffect, useRef } from 'react'

function hexToRgb(h) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h)
  return r ? `${parseInt(r[1],16)},${parseInt(r[2],16)},${parseInt(r[3],16)}` : '255,255,255'
}

const QR = (text, bg, fg) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}&bgcolor=${bg.replace('#','')}&color=${fg.replace('#','')}&margin=12`

// ── 아이콘 컴포넌트 ──────────────────────────────────────────
function IcoIG(){return(<svg width="15"height="15"viewBox="0 0 24 24"fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>)}
function IcoWEB(){return(<svg width="15"height="15"viewBox="0 0 24 24"fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1 21.945A10.012 10.012 0 012.055 13H5c.252 2.792 1.174 5.36 2.727 7.518A9.984 9.984 0 0111 21.945zM5 11H2.055A10.012 10.012 0 0111 2.055V5c-2.475.388-4.553 2.77-6 6zm2.033 2H11v4.945A9.982 9.982 0 017.033 13zm0-2C8.481 7.825 9.867 6.388 11 6.055V11H7.033zM13 2.055A10.012 10.012 0 0121.945 11H19c-1.447-3.23-3.525-5.612-6-6v-2.945zm0 4c1.133.333 2.519 1.77 3.967 4.945H13V6.055zM13 13h3.967A9.982 9.982 0 0113 17.945V13zm0 8.945V19c2.475-.388 4.553-2.77 6-6h2.945A10.012 10.012 0 0113 21.945z"/></svg>)}
function IcoLI(){return(<svg width="15"height="15"viewBox="0 0 24 24"fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>)}
function IcoYT(){return(<svg width="15"height="15"viewBox="0 0 24 24"fill="currentColor"><path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>)}
function IcoKK(){return(<svg width="15"height="15"viewBox="0 0 24 24"fill="currentColor"><path d="M12 3C6.477 3 2 6.477 2 10.5c0 2.572 1.518 4.833 3.813 6.219-.167.594-.613 2.156-.701 2.49-.109.415.152.41.32.298.132-.088 2.1-1.428 2.952-2.013.5.072 1.015.11 1.54.11 5.523 0 10-3.477 10-7.604C20 6.477 17.523 3 12 3z"/></svg>)}
function IcoNV(){return(<svg width="15"height="15"viewBox="0 0 24 24"fill="currentColor"><path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z"/></svg>)}
function IcoBE(){return(<svg width="15"height="15"viewBox="0 0 24 24"fill="currentColor"><path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029H23zm-7.073-4H18c-.104-1.689-1.842-2.35-2.833-1.269-.23.248-.437.664-.514 1.269z"/></svg>)}

const SNS_META = {
  instagram: { label:'Instagram', color:'#E1306C', gradient:'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)', icon:<IcoIG/> },
  website:   { label:'Website',   color:'#4A9EFF', gradient:'linear-gradient(135deg,#4A9EFF,#0066FF)', icon:<IcoWEB/> },
  linkedin:  { label:'LinkedIn',  color:'#0A66C2', gradient:'linear-gradient(135deg,#0A66C2,#004182)', icon:<IcoLI/> },
  youtube:   { label:'YouTube',   color:'#FF0000', gradient:'linear-gradient(135deg,#FF0000,#CC0000)', icon:<IcoYT/> },
  kakao:     { label:'KakaoTalk', color:'#FAE100', gradient:'linear-gradient(135deg,#FAE100,#F6C700)', icon:<IcoKK/> },
  naver:     { label:'Naver Blog',color:'#03C75A', gradient:'linear-gradient(135deg,#03C75A,#029448)', icon:<IcoNV/> },
  behance:   { label:'Behance',   color:'#1769FF', gradient:'linear-gradient(135deg,#1769FF,#0050E0)', icon:<IcoBE/> },
}

// ── 공통 훅 ──────────────────────────────────────────────────
function useReveal(thr=0.1){
  const ref=useRef(null)
  const[v,sv]=useState(false)
  useEffect(()=>{
    const el=ref.current; if(!el) return
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting){sv(true);obs.disconnect();}},{threshold:thr})
    obs.observe(el); return()=>obs.disconnect()
  },[thr])
  return[ref,v]
}

function useCounter(target,visible,dur=1400){
  const[v,sv]=useState(0)
  useEffect(()=>{
    if(!visible) return
    let s=null
    const step=(ts)=>{
      if(!s) s=ts
      const p=Math.min((ts-s)/dur,1)
      const e=1-Math.pow(1-p,3)
      sv(Math.round(e*target))
      if(p<1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  },[visible,target,dur])
  return v
}

function Reveal({children,delay=0,style={}}){
  const[ref,v]=useReveal(0.1)
  return(
    <div ref={ref} style={{...style,
      opacity:v?1:0,
      transform:v?'translateY(0)':'translateY(24px)',
      transition:`opacity .7s ease ${delay}s,transform .7s cubic-bezier(.22,1,.36,1) ${delay}s`
    }}>{children}</div>
  )
}

function ParticleCanvas({accent,active}){
  const cr=useRef(); const ar=useRef()
  useEffect(()=>{
    if(!active) return
    const c=cr.current; if(!c) return
    const ctx=c.getContext('2d')
    c.width=c.offsetWidth; c.height=c.offsetHeight
    const rgb=hexToRgb(accent)
    const pts=Array.from({length:40},()=>({x:Math.random()*c.width,y:Math.random()*c.height,r:Math.random()*1.4+.3,dx:(Math.random()-.5)*.35,dy:(Math.random()-.5)*.35,o:Math.random()*.5+.1}))
    const draw=()=>{
      ctx.clearRect(0,0,c.width,c.height)
      pts.forEach(p=>{ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=`rgba(${rgb},${p.o})`;ctx.fill();p.x+=p.dx;p.y+=p.dy;if(p.x<0||p.x>c.width)p.dx*=-1;if(p.y<0||p.y>c.height)p.dy*=-1;})
      ar.current=requestAnimationFrame(draw)
    }
    draw()
    return()=>cancelAnimationFrame(ar.current)
  },[accent,active])
  return <canvas ref={cr} style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none'}}/>
}

// 글리치 텍스트
const GC='!<>-_\\/[]{}—=+*^?#@$%&'
function useGlitch(orig,active,intv=3200){
  const[d,sd]=useState(orig); const tr=useRef()
  useEffect(()=>{sd(orig)},[orig])
  useEffect(()=>{
    if(!active){sd(orig);return}
    const run=()=>{
      let f=0
      const id=setInterval(()=>{
        f++
        if(f>=18){clearInterval(id);sd(orig);return}
        const p=f/18
        sd(orig.split('').map((ch,i)=>{
          if(ch===' ') return ' '
          if(i<Math.floor(p*orig.length)) return ch
          return Math.random()>.45?GC[Math.floor(Math.random()*GC.length)]:ch
        }).join(''))
      },55)
    }
    run(); tr.current=setInterval(run,intv)
    return()=>clearInterval(tr.current)
  },[active,orig,intv])
  return d
}

function GlitchText({text,active,style={}}){
  const d=useGlitch(text,active,3200)
  return(
    <div style={{position:'relative',display:'inline-block'}}>
      {active&&<h1 aria-hidden style={{...style,position:'absolute',top:0,left:0,color:'transparent',textShadow:`-2px 0 rgba(255,50,50,.55)`,clipPath:'inset(30% 0 40% 0)',userSelect:'none',pointerEvents:'none',animation:'gc1 3.2s infinite'}}>{d}</h1>}
      {active&&<h1 aria-hidden style={{...style,position:'absolute',top:0,left:0,color:'transparent',textShadow:`2px 0 rgba(50,150,255,.45)`,clipPath:'inset(55% 0 10% 0)',userSelect:'none',pointerEvents:'none',animation:'gc2 3.2s infinite'}}>{d}</h1>}
      <h1 style={style}>{d}</h1>
      <style>{`@keyframes gc1{0%,90%,100%{clip-path:inset(30% 0 40% 0);transform:translate(-2px,0)}92%{clip-path:inset(10% 0 70% 0);transform:translate(2px,0)}94%{clip-path:inset(60% 0 5% 0);transform:translate(-1px,0)}}@keyframes gc2{0%,90%,100%{clip-path:inset(55% 0 10% 0);transform:translate(2px,0)}91%{clip-path:inset(75% 0 2% 0);transform:translate(-2px,0)}93%{clip-path:inset(20% 0 55% 0);transform:translate(1px,0)}}`}</style>
    </div>
  )
}

// SNS 버튼
function SnsBtn({link,t,compact=false}){
  const[hov,sH]=useState(false)
  const m=SNS_META[link.platform]||{label:link.platform,color:t.accent,gradient:`linear-gradient(135deg,${t.accent},${t.accent})`,icon:'·'}
  const domain=()=>{try{return new URL(link.url).hostname.replace('www.','')}catch{return link.url}}
  return(
    <a href={link.url} target='_blank' rel='noopener noreferrer'
      onMouseEnter={()=>sH(true)} onMouseLeave={()=>sH(false)}
      style={{display:'flex',alignItems:'center',gap:compact?8:14,padding:compact?'9px 12px':'14px 18px',
        background:hov?`rgba(${hexToRgb(m.color)},.1)`:t.surfaceAlt,
        border:`1px solid ${hov?m.color:t.border}`,textDecoration:'none',
        transition:'all .22s ease',transform:hov?'translateX(3px)':'none',
        boxShadow:hov?`0 0 16px rgba(${hexToRgb(m.color)},.2)`:'none',
        flex:compact?'0 0 auto':'1 1 auto',overflow:'hidden'}}>
      <div style={{width:compact?28:36,height:compact?28:36,borderRadius:compact?5:7,flexShrink:0,
        background:hov?m.gradient:`rgba(${hexToRgb(m.color)},.15)`,
        display:'flex',alignItems:'center',justifyContent:'center',
        color:hov?'#fff':m.color,transition:'all .22s'}}>
        {m.icon}
      </div>
      {!compact&&<>
        <div style={{overflow:'hidden',flex:1}}>
          <div style={{fontSize:12,fontWeight:700,color:t.text,fontFamily:'sans-serif',marginBottom:2}}>{m.label}</div>
          <div style={{fontSize:10,color:t.textSub,fontFamily:'sans-serif',textOverflow:'ellipsis',overflow:'hidden',whiteSpace:'nowrap'}}>{domain()}</div>
        </div>
        <div style={{fontSize:12,color:hov?m.color:t.textSub,transition:'all .22s',flexShrink:0}}>→</div>
      </>}
    </a>
  )
}

// 포트폴리오 슬라이드쇼
function PortfolioSlideshow({items,startIdx,t,onClose}){
  const[idx,setIdx]=useState(startIdx)
  const[anim,setAnim]=useState(false)
  const[dir,setDir]=useState(0)
  const touchStart=useRef(null)
  const total=items.length

  const go=(d)=>{
    if(anim) return
    setDir(d); setAnim(true)
    setTimeout(()=>{setIdx(i=>(i+d+total)%total);setAnim(false)},320)
  }

  useEffect(()=>{
    const h=(e)=>{
      if(e.key==='ArrowRight') go(1)
      if(e.key==='ArrowLeft') go(-1)
      if(e.key==='Escape') onClose()
    }
    window.addEventListener('keydown',h)
    return()=>window.removeEventListener('keydown',h)
  },[go,onClose])

  const cur=items[idx]
  return(
    <div onClick={onClose} style={{position:'fixed',inset:0,zIndex:9999,background:'rgba(0,0,0,.94)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:24,cursor:'zoom-out'}}
      onTouchStart={e=>{touchStart.current=e.touches[0].clientX}}
      onTouchEnd={e=>{if(touchStart.current===null)return;const dx=e.changedTouches[0].clientX-touchStart.current;if(Math.abs(dx)>40)go(dx<0?1:-1);touchStart.current=null}}>
      <button onClick={onClose} style={{position:'absolute',top:20,right:20,width:36,height:36,borderRadius:'50%',background:'rgba(255,255,255,.1)',border:'1px solid rgba(255,255,255,.2)',color:'#fff',fontSize:18,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',zIndex:2}}>×</button>
      <div style={{position:'absolute',top:22,left:'50%',transform:'translateX(-50%)',fontSize:10,letterSpacing:'3px',color:'rgba(255,255,255,.5)',fontFamily:'sans-serif',zIndex:2}}>{idx+1} / {total}</div>
      <div style={{position:'relative',width:'min(680px,90vw)',height:'min(460px,60vh)',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,opacity:anim?0:1,transform:anim?`translateX(${dir*-40}px)`:'translateX(0)',transition:anim?'opacity .3s ease,transform .3s ease':'none'}}>
          <img src={cur.image} alt={cur.title} style={{width:'100%',height:'100%',objectFit:'contain',display:'block'}}/>
        </div>
      </div>
      <div style={{marginTop:20,textAlign:'center'}}>
        <div style={{fontSize:9,letterSpacing:'3px',color:t.accent,textTransform:'uppercase',marginBottom:6,fontFamily:'sans-serif'}}>{cur.tag} · {cur.year}</div>
        <div style={{fontSize:15,fontWeight:700,color:'#fff',fontFamily:'sans-serif'}}>{cur.title}</div>
      </div>
      {total>1&&<>
        <button onClick={e=>{e.stopPropagation();go(-1)}} style={{position:'absolute',left:20,top:'50%',transform:'translateY(-50%)',width:44,height:44,borderRadius:'50%',background:'rgba(255,255,255,.08)',border:'1px solid rgba(255,255,255,.15)',color:'#fff',fontSize:20,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>‹</button>
        <button onClick={e=>{e.stopPropagation();go(1)}}  style={{position:'absolute',right:20,top:'50%',transform:'translateY(-50%)',width:44,height:44,borderRadius:'50%',background:'rgba(255,255,255,.08)',border:'1px solid rgba(255,255,255,.15)',color:'#fff',fontSize:20,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>›</button>
      </>}
      <div style={{display:'flex',gap:8,marginTop:20,justifyContent:'center'}}>
        {items.map((it,i)=>(
          <div key={i} onClick={e=>{e.stopPropagation();setIdx(i)}} style={{width:i===idx?28:8,height:8,borderRadius:4,cursor:'pointer',background:i===idx?t.accent:'rgba(255,255,255,.25)',transition:'all .3s ease'}}/>
        ))}
      </div>
    </div>
  )
}

// ── 섹션들 ────────────────────────────────────────────────────
function HeroSection({t,data,me}){
  const[ld,sL]=useState(false)
  useEffect(()=>{setTimeout(()=>sL(true),80)},[])
  return(
    <section style={{position:'relative',overflow:'hidden',padding:'90px 44px 70px',textAlign:'center',borderBottom:`1px solid ${t.border}`,
      background:data.heroBgImage?`linear-gradient(rgba(0,0,0,.62),rgba(0,0,0,.62)),url(${data.heroBgImage}) center/cover`:t.heroBg}}>
      {me&&me.particle&&t.id!=='white'&&<ParticleCanvas accent={t.accent} active/>}
      <div style={{position:'relative',zIndex:1}}>
        <div style={{opacity:ld?1:0,transform:ld?'scale(1)':'scale(.7)',transition:'opacity .6s ease .1s,transform .6s cubic-bezier(.34,1.56,.64,1) .1s',marginBottom:18}}>
          {data.logoImage
            ?<img src={data.logoImage} alt='logo' style={{width:72,height:72,objectFit:'contain',borderRadius:4}}/>
            :<div style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:72,height:72,border:`1px solid ${t.accent}`,fontSize:36,fontWeight:900,color:t.accent,fontFamily:'serif',background:`rgba(${t.accentRgb},.08)`}}>{data.logo}</div>
          }
        </div>
        <div style={{opacity:ld?1:0,transform:ld?'none':'translateY(16px)',transition:'opacity .6s ease .25s,transform .6s ease .25s',marginBottom:10}}>
          <GlitchText text={data.companyName} active={me&&me.glitch}
            style={{fontSize:30,fontWeight:800,letterSpacing:'10px',color:t.text,margin:0,fontFamily:'sans-serif',display:'inline-block'}}/>
        </div>
        <p style={{fontSize:12,letterSpacing:'3px',color:t.accent,textTransform:'uppercase',fontFamily:'sans-serif',opacity:ld?1:0,transition:'opacity .6s ease .4s',margin:'0 0 28px'}}>{data.tagline}</p>
        <div style={{width:ld?48:0,height:1,background:t.accent,margin:'0 auto',transition:'width .8s ease .55s'}}/>
        <div style={{display:'flex',gap:8,justifyContent:'center',flexWrap:'wrap',marginTop:28,opacity:ld?1:0,transition:'opacity .6s ease .65s'}}>
          {[...data.links].sort((a,b)=>a.order-b.order).filter(l=>l.active).map((l,i)=>(
            <SnsBtn key={l.id} link={l} t={{...t,surfaceAlt:`rgba(${t.accentRgb},.06)`,border:`rgba(${t.accentRgb},.2)`}} compact/>
          ))}
        </div>
      </div>
    </section>
  )
}

function StatsSection({t,data,me}){
  const[ref,v]=useReveal(.2)
  const c0=useCounter(data.stats[0].value,v&&me&&me.counter)
  const c1=useCounter(data.stats[1].value,v&&me&&me.counter)
  const c2=useCounter(data.stats[2].value,v&&me&&me.counter)
  const cv=[c0,c1,c2]
  return(
    <section ref={ref} style={{display:'flex',borderBottom:`1px solid ${t.border}`,background:t.surface}}>
      {data.stats.map((s,i)=>(
        <div key={i} style={{flex:1,padding:'36px 20px',textAlign:'center',borderRight:i<2?`1px solid ${t.border}`:'none',opacity:v?1:0,transform:v?'none':'translateY(20px)',transition:`opacity .6s ease ${i*.12}s,transform .6s ease ${i*.12}s`}}>
          <div style={{fontSize:36,fontWeight:800,color:t.accent,fontFamily:'sans-serif',lineHeight:1}}>{me&&me.counter?cv[i]:s.value}{s.suffix}</div>
          <div style={{fontSize:10,letterSpacing:'3px',color:t.textSub,textTransform:'uppercase',marginTop:8,fontFamily:'sans-serif'}}>{s.label}</div>
        </div>
      ))}
    </section>
  )
}

function AboutSection({t,data}){
  return(
    <section style={{padding:'54px 44px',background:t.surfaceAlt,borderBottom:`1px solid ${t.border}`}}>
      <Reveal>
        <p style={{fontSize:9,letterSpacing:'4px',color:t.accent,textTransform:'uppercase',marginBottom:18,fontFamily:'sans-serif'}}>About</p>
        <p style={{fontSize:15,lineHeight:2,color:t.text,opacity:.82,fontFamily:'sans-serif'}}>{data.description}</p>
      </Reveal>
    </section>
  )
}

function ServicesSection({t,data}){
  const[hov,sH]=useState(null)
  return(
    <section style={{padding:'54px 44px',background:t.surface,borderBottom:`1px solid ${t.border}`}}>
      <Reveal><p style={{fontSize:9,letterSpacing:'4px',color:t.accent,textTransform:'uppercase',marginBottom:24,fontFamily:'sans-serif'}}>Services</p></Reveal>
      <div style={{display:'flex',flexDirection:'column',gap:12}}>
        {data.services.map((s,i)=>(
          <Reveal key={s.id||i} delay={i*.08}>
            <div onMouseEnter={()=>sH(i)} onMouseLeave={()=>sH(null)}
              style={{padding:'22px 26px',background:hov===i?`rgba(${t.accentRgb},.06)`:t.surfaceAlt,border:`1px solid ${hov===i?t.accent:t.border}`,borderLeft:`3px solid ${t.accent}`,display:'flex',justifyContent:'space-between',alignItems:'center',transition:'all .25s ease',transform:hov===i?'translateX(4px)':'none'}}>
              <div>
                <div style={{fontSize:13,fontWeight:700,letterSpacing:'1px',color:t.text,fontFamily:'sans-serif',marginBottom:4}}>{s.title}</div>
                <div style={{fontSize:12,color:t.textSub,fontFamily:'sans-serif'}}>{s.desc}</div>
              </div>
              <div style={{width:6,height:6,borderRadius:'50%',background:t.accent,flexShrink:0,transform:hov===i?'scale(1.6)':'scale(1)',transition:'transform .25s ease'}}/>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function PortfolioSection({t,data}){
  const[hov,sH]=useState(null)
  const[slide,setSlide]=useState(null)
  const slideItems=data.portfolio.filter(p=>p.image)
  return(<>
    <section style={{padding:'54px 44px',background:t.surfaceAlt,borderBottom:`1px solid ${t.border}`}}>
      <Reveal>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24}}>
          <p style={{fontSize:9,letterSpacing:'4px',color:t.accent,textTransform:'uppercase',fontFamily:'sans-serif',margin:0}}>Portfolio</p>
          {slideItems.length>0&&(
            <button onClick={()=>setSlide(0)} style={{fontSize:9,letterSpacing:'2px',color:t.accent,background:'transparent',border:`1px solid ${t.border}`,padding:'5px 12px',cursor:'pointer',fontFamily:'sans-serif',textTransform:'uppercase'}}>▶ 슬라이드쇼</button>
          )}
        </div>
      </Reveal>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
        {data.portfolio.map((p,i)=>{
          const siIdx=slideItems.findIndex(s=>s.id===p.id)
          return(
            <Reveal key={p.id||i} delay={i*.07}>
              {p.image?(
                <div onMouseEnter={()=>sH(i)} onMouseLeave={()=>sH(null)} onClick={()=>siIdx>=0&&setSlide(siIdx)}
                  style={{position:'relative',paddingBottom:'72%',overflow:'hidden',cursor:'zoom-in',border:`1px solid ${hov===i?t.accent:t.border}`,transition:'all .25s ease',boxShadow:hov===i?`0 8px 28px rgba(${t.accentRgb},.18)`:'none'}}>
                  <img src={p.image} alt={p.title} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',transform:hov===i?'scale(1.04)':'scale(1)',transition:'transform .5s cubic-bezier(.22,1,.36,1)'}}/>
                  <div style={{position:'absolute',inset:0,background:hov===i?'rgba(0,0,0,.62)':'rgba(0,0,0,.32)',transition:'background .3s',display:'flex',flexDirection:'column',justifyContent:'flex-end',padding:'14px 12px'}}>
                    <div style={{fontSize:8,letterSpacing:'2px',color:t.accent,textTransform:'uppercase',marginBottom:5,fontFamily:'sans-serif'}}>{p.tag} · {p.year}</div>
                    <div style={{fontSize:11,fontWeight:700,color:'#fff',letterSpacing:'.5px',fontFamily:'sans-serif',lineHeight:1.4}}>{p.title}</div>
                  </div>
                  <div style={{position:'absolute',top:0,left:0,width:18,height:2,background:t.accent}}/>
                  <div style={{position:'absolute',top:0,left:0,width:2,height:18,background:t.accent}}/>
                </div>
              ):(
                <div onMouseEnter={()=>sH(i)} onMouseLeave={()=>sH(null)}
                  style={{padding:'22px 18px',background:t.surface,border:`1px solid ${hov===i?t.accent:t.border}`,transition:'all .22s ease',transform:hov===i?'translateY(-3px)':'none',boxShadow:hov===i?`0 8px 24px rgba(${t.accentRgb},.12)`:'none'}}>
                  <div style={{fontSize:8,letterSpacing:'2px',color:t.accent,textTransform:'uppercase',marginBottom:10,fontFamily:'sans-serif'}}>{p.tag} · {p.year}</div>
                  <div style={{fontSize:12,fontWeight:700,color:t.text,letterSpacing:'.5px',fontFamily:'sans-serif',lineHeight:1.4}}>{p.title}</div>
                </div>
              )}
            </Reveal>
          )
        })}
      </div>
    </section>
    {slide!==null&&slideItems.length>0&&(
      <PortfolioSlideshow items={slideItems} startIdx={slide} t={t} onClose={()=>setSlide(null)}/>
    )}
  </>)
}

function ContactSection({t,data,shareUrl}){
  const isDark=t.id!=='white'
  const al=[...data.links].sort((a,b)=>a.order-b.order).filter(l=>l.active)
  return(
    <section style={{padding:'54px 44px',background:t.surface,borderBottom:`1px solid ${t.border}`}}>
      <Reveal><p style={{fontSize:9,letterSpacing:'4px',color:t.accent,textTransform:'uppercase',marginBottom:24,fontFamily:'sans-serif'}}>Contact</p></Reveal>
      {[{label:'Email',val:data.contact.email},{label:'Phone',val:data.contact.phone},{label:'Address',val:data.contact.address}].map((item,i)=>(
        <Reveal key={i} delay={i*.08}>
          <div style={{display:'flex',gap:20,alignItems:'flex-start',padding:'16px 0',borderBottom:`1px solid ${t.border}`}}>
            <span style={{fontSize:9,letterSpacing:'2px',color:t.accent,textTransform:'uppercase',minWidth:60,paddingTop:2,fontFamily:'sans-serif'}}>{item.label}</span>
            <span style={{fontSize:13,color:t.text,opacity:.82,fontFamily:'sans-serif',lineHeight:1.6}}>{item.val}</span>
          </div>
        </Reveal>
      ))}
      {al.length>0&&(
        <Reveal delay={.2}>
          <p style={{fontSize:9,letterSpacing:'4px',color:t.accent,textTransform:'uppercase',margin:'32px 0 16px',fontFamily:'sans-serif'}}>Follow & Connect</p>
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {al.map((l,i)=><SnsBtn key={l.id||i} link={l} t={t}/>)}
          </div>
        </Reveal>
      )}
      {shareUrl&&(
        <Reveal delay={.3}>
          <div style={{marginTop:40,display:'flex',alignItems:'center',gap:28}}>
            <div style={{padding:12,background:isDark?'#fff':t.surfaceAlt,border:`1px solid ${t.border}`,flexShrink:0}}>
              <img src={QR(shareUrl,isDark?'#ffffff':t.bg,t.accent)} alt='QR' width={100} height={100}/>
            </div>
            <div>
              <p style={{fontSize:9,letterSpacing:'3px',color:t.textSub,textTransform:'uppercase',marginBottom:8,fontFamily:'sans-serif'}}>Scan to visit</p>
              <p style={{fontSize:11,color:t.accent,fontFamily:'sans-serif',wordBreak:'break-all'}}>{shareUrl}</p>
            </div>
          </div>
        </Reveal>
      )}
    </section>
  )
}

// ── 메인 export ───────────────────────────────────────────────
export default function CardPreview({t, data, shareUrl, me, readOnly=false}){
  return(
    <div style={{background:t.bg,color:t.text,fontFamily:'sans-serif'}}>
      <HeroSection t={t} data={data} me={me}/>
      <StatsSection t={t} data={data} me={me}/>
      <AboutSection t={t} data={data}/>
      <ServicesSection t={t} data={data}/>
      <PortfolioSection t={t} data={data}/>
      <ContactSection t={t} data={data} shareUrl={shareUrl}/>
    </div>
  )
}
