// src/components/EditorPanel.jsx
import { useState } from 'react'

function hexToRgb(h) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h)
  return r ? `${parseInt(r[1],16)},${parseInt(r[2],16)},${parseInt(r[3],16)}` : '255,255,255'
}

function uid() { return Math.random().toString(36).slice(2, 8) }

function readFileB64(file) {
  return new Promise(function(res) {
    var r = new FileReader()
    r.onload = function(e) { res(e.target.result) }
    r.readAsDataURL(file)
  })
}

// ── 터치+마우스 통합 드래그 정렬 ─────────────────────────────
import { useRef, useCallback } from 'react'

function useTouchDragSort(items, onReorder) {
  const [dragIdx, setDragIdx] = useState(null)
  const [overIdx, setOverIdx] = useState(null)
  const dragState = useRef({ active:false, startIdx:null })
  const itemRefs  = useRef([])

  const getIdxFromY = useCallback((clientY) => {
    let closest=null, minDist=Infinity
    itemRefs.current.forEach((el,i) => {
      if(!el) return
      const rect = el.getBoundingClientRect()
      const mid  = rect.top + rect.height/2
      const dist = Math.abs(clientY - mid)
      if(dist < minDist) { minDist=dist; closest=i }
    })
    return closest
  }, [])

  const onPointerDown = useCallback((e,idx) => {
    if(e.target.tagName==='INPUT'||e.target.tagName==='BUTTON') return
    e.currentTarget.setPointerCapture(e.pointerId)
    dragState.current = { active:true, startIdx:idx }
    setDragIdx(idx); setOverIdx(idx)
  }, [])

  const onPointerMove = useCallback((e,idx) => {
    if(!dragState.current.active||dragState.current.startIdx!==idx) return
    const over = getIdxFromY(e.clientY)
    if(over!==null) setOverIdx(over)
  }, [getIdxFromY])

  const onPointerUp = useCallback((e,idx) => {
    if(!dragState.current.active||dragState.current.startIdx!==idx) return
    dragState.current.active = false
    const from=dragState.current.startIdx, to=overIdx??from
    if(from!==to) {
      const arr=[...items]
      const[moved]=arr.splice(from,1)
      arr.splice(to,0,moved)
      onReorder(arr.map((it,i)=>({...it,order:i})))
    }
    setDragIdx(null); setOverIdx(null)
  }, [items, onReorder, overIdx])

  const getItemProps = (idx) => ({
    ref:(el)=>{ itemRefs.current[idx]=el },
    onPointerDown:(e)=>onPointerDown(e,idx),
    onPointerMove:(e)=>onPointerMove(e,idx),
    onPointerUp:(e)=>onPointerUp(e,idx),
    onPointerCancel:()=>{ setDragIdx(null); setOverIdx(null); dragState.current.active=false },
    style:{
      touchAction:'none', userSelect:'none',
      opacity: dragIdx===idx ? 0.45 : 1,
      transform: overIdx===idx&&dragIdx!==idx ? 'translateY(-3px) scale(1.01)' : 'none',
      transition: dragIdx===idx ? 'none' : 'opacity .2s,transform .18s ease',
      cursor: dragIdx===idx ? 'grabbing' : 'grab',
    },
  })

  return { dragIdx, overIdx, getItemProps }
}

// SNS 아이콘
function IcoIG(){return(<svg width="14"height="14"viewBox="0 0 24 24"fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>)}
function IcoWEB(){return(<svg width="14"height="14"viewBox="0 0 24 24"fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1 21.945A10.012 10.012 0 012.055 13H5c.252 2.792 1.174 5.36 2.727 7.518A9.984 9.984 0 0111 21.945zM5 11H2.055A10.012 10.012 0 0111 2.055V5c-2.475.388-4.553 2.77-6 6zm2.033 2H11v4.945A9.982 9.982 0 017.033 13zm0-2C8.481 7.825 9.867 6.388 11 6.055V11H7.033zM13 2.055A10.012 10.012 0 0121.945 11H19c-1.447-3.23-3.525-5.612-6-6v-2.945zm0 4c1.133.333 2.519 1.77 3.967 4.945H13V6.055zM13 13h3.967A9.982 9.982 0 0113 17.945V13zm0 8.945V19c2.475-.388 4.553-2.77 6-6h2.945A10.012 10.012 0 0113 21.945z"/></svg>)}
function IcoLI(){return(<svg width="14"height="14"viewBox="0 0 24 24"fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>)}
function IcoYT(){return(<svg width="14"height="14"viewBox="0 0 24 24"fill="currentColor"><path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>)}
function IcoKK(){return(<svg width="14"height="14"viewBox="0 0 24 24"fill="currentColor"><path d="M12 3C6.477 3 2 6.477 2 10.5c0 2.572 1.518 4.833 3.813 6.219-.167.594-.613 2.156-.701 2.49-.109.415.152.41.32.298.132-.088 2.1-1.428 2.952-2.013.5.072 1.015.11 1.54.11 5.523 0 10-3.477 10-7.604C20 6.477 17.523 3 12 3z"/></svg>)}
function IcoNV(){return(<svg width="14"height="14"viewBox="0 0 24 24"fill="currentColor"><path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z"/></svg>)}
function IcoBE(){return(<svg width="14"height="14"viewBox="0 0 24 24"fill="currentColor"><path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029H23zm-7.073-4H18c-.104-1.689-1.842-2.35-2.833-1.269-.23.248-.437.664-.514 1.269z"/></svg>)}

const SNS_META = {
  instagram:{ label:'Instagram', color:'#E1306C', gradient:'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)', icon:<IcoIG/> },
  website:  { label:'Website',   color:'#4A9EFF', gradient:'linear-gradient(135deg,#4A9EFF,#0066FF)', icon:<IcoWEB/> },
  linkedin: { label:'LinkedIn',  color:'#0A66C2', gradient:'linear-gradient(135deg,#0A66C2,#004182)', icon:<IcoLI/> },
  youtube:  { label:'YouTube',   color:'#FF0000', gradient:'linear-gradient(135deg,#FF0000,#CC0000)', icon:<IcoYT/> },
  kakao:    { label:'KakaoTalk', color:'#FAE100', gradient:'linear-gradient(135deg,#FAE100,#F6C700)', icon:<IcoKK/> },
  naver:    { label:'Naver Blog',color:'#03C75A', gradient:'linear-gradient(135deg,#03C75A,#029448)', icon:<IcoNV/> },
  behance:  { label:'Behance',   color:'#1769FF', gradient:'linear-gradient(135deg,#1769FF,#0050E0)', icon:<IcoBE/> },
}

// ── 색상 패널 ────────────────────────────────────────────────
function ColorPanel({t,co,setCo}){
  const row=(label,key,val)=>(
    <div key={key} style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
      <span style={{fontSize:10,letterSpacing:'2px',color:t.textSub,textTransform:'uppercase',fontFamily:'sans-serif'}}>{label}</span>
      <div style={{display:'flex',alignItems:'center',gap:8}}>
        <span style={{fontSize:10,color:t.textSub,fontFamily:'monospace'}}>{val}</span>
        <input type='color' value={val} onChange={e=>setCo(p=>({...p,[key]:e.target.value}))}
          style={{width:32,height:26,border:`1px solid ${t.border}`,padding:2,background:'transparent',cursor:'pointer'}}/>
      </div>
    </div>
  )
  return(
    <div style={{padding:'20px 0'}}>
      <p style={{fontSize:9,letterSpacing:'4px',color:t.accent,textTransform:'uppercase',marginBottom:18,fontFamily:'sans-serif'}}>🎨 Color Tokens</p>
      {row('Accent','accent',co.accent||t.accent)}
      {row('Background','bg',co.bg||t.bg)}
      {row('Text','text',co.text||t.text)}
      {row('Surface','surface',co.surface||t.surface)}
      <button onClick={()=>setCo({})} style={{marginTop:8,padding:'7px 16px',border:`1px solid ${t.border}`,background:'transparent',color:t.textSub,fontSize:10,letterSpacing:'2px',cursor:'pointer',fontFamily:'sans-serif'}}>↺ Reset</button>
    </div>
  )
}

// ── 이미지 업로드 패널 ───────────────────────────────────────
function ImageUploadPanel({t,data,setData}){
  function handleBrandImg(e,k){
    var file=e.target.files[0]; if(!file) return
    readFileB64(file).then(function(b64){ setData(function(p){ return{...p,[k]:b64} }) })
  }
  const Box=({label,k,cur})=>(
    <div style={{marginBottom:18}}>
      <p style={{fontSize:9,letterSpacing:'3px',color:t.accent,textTransform:'uppercase',marginBottom:10,fontFamily:'sans-serif'}}>{label}</p>
      <label style={{display:'flex',alignItems:'center',justifyContent:'center',height:cur?80:64,border:`1px dashed ${t.border}`,cursor:'pointer',overflow:'hidden',background:cur?'transparent':t.surfaceAlt}}>
        {cur?<img src={cur} alt={label} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
          :<span style={{fontSize:10,color:t.textSub,letterSpacing:'2px',fontFamily:'sans-serif'}}>+ 업로드</span>}
        <input type='file' accept='image/*' style={{display:'none'}} onChange={e=>handleBrandImg(e,k)}/>
      </label>
      {cur&&<button onClick={()=>setData(p=>({...p,[k]:null}))} style={{marginTop:6,fontSize:10,color:t.textSub,background:'none',border:'none',cursor:'pointer',letterSpacing:'1px',fontFamily:'sans-serif'}}>× 제거</button>}
    </div>
  )
  return(
    <div style={{padding:'20px 0'}}>
      <p style={{fontSize:9,letterSpacing:'4px',color:t.accent,textTransform:'uppercase',marginBottom:18,fontFamily:'sans-serif'}}>📷 Brand Images</p>
      <Box label='Logo Image' k='logoImage' cur={data.logoImage}/>
      <Box label='Hero Background' k='heroBgImage' cur={data.heroBgImage}/>
    </div>
  )
}

// ── 링크 드래그 패널 ─────────────────────────────────────────
function LinksPanel({t,data,setData}){
  const sorted=[...data.links].sort((a,b)=>a.order-b.order)
  const{getItemProps,overIdx,dragIdx}=useTouchDragSort(sorted,(reordered)=>{
    setData({...data,links:reordered})
  })
  const inp={flex:1,padding:'7px 10px',background:t.bg,border:`1px solid ${t.border}`,color:t.text,fontSize:11,fontFamily:'sans-serif',outline:'none',minWidth:0}
  const toggle=(platform)=>setData({...data,links:data.links.map(l=>l.platform===platform?{...l,active:!l.active}:l)})
const updateUrl=(platform,url)=>setData({...data,links:data.links.map(l=>l.platform===platform?{...l,url}:l)})

  return(
    <div style={{padding:'20px 0'}}>
      <p style={{fontSize:9,letterSpacing:'4px',color:t.accent,textTransform:'uppercase',marginBottom:6,fontFamily:'sans-serif'}}>🔗 Links & SNS</p>
      <p style={{fontSize:10,color:t.textSub,fontFamily:'sans-serif',marginBottom:18,lineHeight:1.7}}>☰ 드래그로 순서 변경<br/>토글로 표시 여부 설정</p>
      <div style={{display:'flex',flexDirection:'column',gap:8}}>
        {sorted.map((link,i)=>{
          const m=SNS_META[link.platform]||{label:link.platform,color:t.accent,gradient:`linear-gradient(135deg,${t.accent},${t.accent})`,icon:'·'}
          const isOver=overIdx===i&&dragIdx!==i
          const iProps=getItemProps(i)
          return(
            <div key={link.platform} {...iProps} style={{...iProps.style,padding:'11px 13px',
              background:link.active?`rgba(${hexToRgb(m.color)},.06)`:t.surfaceAlt,
              border:`1px solid ${isOver?t.accent:link.active?m.color:t.border}`,
              borderLeft:isOver?`3px solid ${t.accent}`:`1px solid ${link.active?m.color:t.border}`}}>
              <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:link.active?9:0}}>
                <div style={{color:t.textSub,fontSize:16,flexShrink:0,lineHeight:1,cursor:'grab'}}>⋮⋮</div>
                <div style={{width:26,height:26,borderRadius:5,background:link.active?m.gradient:`rgba(${hexToRgb(m.color)},.15)`,display:'flex',alignItems:'center',justifyContent:'center',color:link.active?'#fff':m.color,flexShrink:0,transition:'all .2s'}}>
                  <div style={{width:14,height:14,display:'flex',alignItems:'center',justifyContent:'center'}}>{m.icon}</div>
                </div>
                <span style={{flex:1,fontSize:11,fontWeight:700,color:link.active?t.text:t.textSub,fontFamily:'sans-serif',letterSpacing:'.5px'}}>{m.label}</span>
                <div onClick={e=>{e.stopPropagation();toggle(link.platform)}}
                  style={{width:36,height:20,borderRadius:10,cursor:'pointer',flexShrink:0,background:link.active?m.color:t.border,position:'relative',transition:'background .2s'}}>
                  <div style={{position:'absolute',top:2,width:16,height:16,borderRadius:'50%',background:'#fff',left:link.active?18:2,transition:'left .2s'}}/>
                </div>
              </div>
              {link.active&&<input style={inp} placeholder='https://...' value={link.url} onChange={e=>updateUrl(link.platform,e.target.value)}/>}
              {isOver&&<div style={{height:2,background:t.accent,marginTop:6,borderRadius:1}}/>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── 포트폴리오 패널 ──────────────────────────────────────────
function PortfolioPanel({t,data,setData}){
  const update=(id,fields)=>setData({...data,portfolio:data.portfolio.map(p=>p.id===id?{...p,...fields}:p)})
  const remove=(id)=>setData({...data,portfolio:data.portfolio.filter(p=>p.id!==id)})
  const addItem=()=>setData({...data,portfolio:[...data.portfolio,{id:'p'+uid(),title:'NEW PROJECT',year:new Date().getFullYear().toString(),tag:'Identity',image:null}]})

  function handleImgChange(e,id){
    var file=e.target.files[0]; if(!file) return
    readFileB64(file).then(function(b64){ update(id,{image:b64}) })
  }

  const inp={width:'100%',padding:'8px 10px',background:t.surfaceAlt,border:`1px solid ${t.border}`,color:t.text,fontSize:11,fontFamily:'sans-serif',outline:'none',boxSizing:'border-box',marginBottom:8}

  return(
    <div style={{padding:'20px 0'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:6}}>
        <p style={{fontSize:9,letterSpacing:'4px',color:t.accent,textTransform:'uppercase',fontFamily:'sans-serif',margin:0}}>🖼 Portfolio Items</p>
        <button onClick={addItem} style={{fontSize:9,letterSpacing:'2px',padding:'5px 12px',background:t.accent,border:'none',color:t.id==='white'?'#fff':'#0a0a0f',cursor:'pointer',fontFamily:'sans-serif',textTransform:'uppercase',fontWeight:700}}>+ 추가</button>
      </div>
      <p style={{fontSize:10,color:t.textSub,fontFamily:'sans-serif',marginBottom:18,lineHeight:1.7}}>각 항목에 썸네일을 업로드하거나<br/>텍스트만 입력하세요.</p>
      <div style={{display:'flex',flexDirection:'column',gap:14}}>
        {data.portfolio.map((p)=>(
          <div key={p.id} style={{padding:'14px',border:`1px solid ${t.border}`,background:t.surfaceAlt,position:'relative'}}>
            <button onClick={()=>remove(p.id)} style={{position:'absolute',top:10,right:10,width:22,height:22,borderRadius:'50%',background:'rgba(255,80,80,.15)',border:'1px solid rgba(255,80,80,.3)',color:'#ff5050',fontSize:13,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',lineHeight:1}}>×</button>
            <label style={{display:'block',cursor:'pointer',marginBottom:10}}>
              {p.image?(
                <div style={{position:'relative'}}>
                  <img src={p.image} alt={p.title} style={{width:'100%',height:90,objectFit:'cover',display:'block'}}/>
                  <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,.4)',display:'flex',alignItems:'center',justifyContent:'center',opacity:0,transition:'opacity .2s'}}
                    onMouseEnter={e=>e.currentTarget.style.opacity=1} onMouseLeave={e=>e.currentTarget.style.opacity=0}>
                    <span style={{color:'#fff',fontSize:11,fontFamily:'sans-serif',letterSpacing:'2px'}}>변경</span>
                  </div>
                </div>
              ):(
                <div style={{height:64,background:t.bg,border:`1px dashed ${t.border}`,display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <span style={{fontSize:10,color:t.textSub,letterSpacing:'2px',fontFamily:'sans-serif'}}>+ 이미지 업로드</span>
                </div>
              )}
              <input type='file' accept='image/*' style={{display:'none'}} onChange={e=>handleImgChange(e,p.id)}/>
            </label>
            <input style={inp} placeholder='Project Title' value={p.title} onChange={e=>update(p.id,{title:e.target.value})}/>
            <div style={{display:'flex',gap:8}}>
              <input style={{...inp,flex:1,marginBottom:0}} placeholder='Year' value={p.year} onChange={e=>update(p.id,{year:e.target.value})}/>
              <input style={{...inp,flex:1,marginBottom:0}} placeholder='Tag' value={p.tag} onChange={e=>update(p.id,{tag:e.target.value})}/>
            </div>
            {p.image&&<button onClick={()=>update(p.id,{image:null})} style={{marginTop:8,fontSize:9,color:t.textSub,background:'none',border:'none',cursor:'pointer',letterSpacing:'1px',fontFamily:'sans-serif'}}>× 이미지 제거</button>}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── 서비스 편집 ──────────────────────────────────────────────
function ServicesEditor({t,data,setData,inp,lbl}){
  const add=()=>setData({...data,services:[...data.services,{id:'s'+uid(),title:'New Service',desc:'서비스 설명',items:[]}]})
  const remove=(id)=>setData({...data,services:data.services.filter(s=>s.id!==id)})
  const update=(id,fields)=>setData({...data,services:data.services.map(s=>s.id===id?{...s,...fields}:s)})
  return(<>
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:18,marginBottom:6}}>
      <p style={{...lbl,margin:0}}>✦ Services</p>
      <button onClick={add} style={{fontSize:9,letterSpacing:'2px',padding:'4px 10px',background:t.accent,border:'none',color:t.id==='white'?'#fff':'#0a0a0f',cursor:'pointer',fontFamily:'sans-serif',textTransform:'uppercase',fontWeight:700}}>+ 추가</button>
    </div>
    {data.services.map((s)=>(
      <div key={s.id} style={{padding:'12px',border:`1px solid ${t.border}`,marginBottom:10,background:t.surfaceAlt,position:'relative'}}>
        <button onClick={()=>remove(s.id)} style={{position:'absolute',top:8,right:8,width:20,height:20,borderRadius:'50%',background:'rgba(255,80,80,.15)',border:'1px solid rgba(255,80,80,.3)',color:'#ff5050',fontSize:12,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>×</button>
        <input style={inp} placeholder='Title' value={s.title} onChange={e=>update(s.id,{title:e.target.value})}/>
        <input style={{...inp,marginBottom:0}} placeholder='Description' value={s.desc} onChange={e=>update(s.id,{desc:e.target.value})}/>

        {/* ── 상세 리스트 (바텀시트에 뜨는 항목들) ── */}
        <div style={{marginTop:12,paddingTop:12,borderTop:`1px dashed ${t.border}`}}>
          <p style={{fontSize:9,letterSpacing:'1px',color:t.textSub,fontFamily:'sans-serif',marginBottom:8,textTransform:'uppercase'}}>상세 리스트</p>
          {(s.items||[]).map((it,ii)=>(
            <div key={ii} style={{display:'flex',gap:6,marginBottom:6,alignItems:'center'}}>
              <input style={{...inp,marginBottom:0,flex:1}} placeholder={`항목 ${ii+1}`} value={it}
                onChange={e=>{
                  const next=[...(s.items||[])]; next[ii]=e.target.value;
                  update(s.id,{items:next})
                }}/>
              <button onClick={()=>{
                const next=(s.items||[]).filter((_,k)=>k!==ii);
                update(s.id,{items:next})
              }} style={{width:24,height:24,flexShrink:0,borderRadius:'4px',background:'rgba(255,80,80,.15)',border:'1px solid rgba(255,80,80,.3)',color:'#ff5050',fontSize:12,cursor:'pointer'}}>×</button>
            </div>
          ))}
          <button onClick={()=>update(s.id,{items:[...(s.items||[]),'']})}
            style={{fontSize:9,letterSpacing:'1px',padding:'5px 12px',background:'transparent',border:`1px solid ${t.border}`,color:t.text,cursor:'pointer',fontFamily:'sans-serif',marginTop:2}}>+ 항목 추가</button>
        </div>
      </div>
    ))}
  </>)
}

// ── 연혁(History) 편집 패널 ───────────────────────────────────
function HistoryPanel({t,data,setData}){
  const add=()=>setData({...data,history:[{id:'h'+uid(),year:String(new Date().getFullYear()),desc:'새로운 연혁을 입력하세요'},...data.history]})
  const remove=(id)=>setData({...data,history:data.history.filter(h=>h.id!==id)})
  const update=(id,fields)=>setData({...data,history:data.history.map(h=>h.id===id?{...h,...fields}:h)})
  const inp={width:'100%',padding:'9px 12px',background:t.surfaceAlt,border:`1px solid ${t.border}`,color:t.text,fontSize:12,fontFamily:'sans-serif',outline:'none',boxSizing:'border-box',marginBottom:8}
  return(
    <div style={{padding:'4px 0'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:6}}>
        <p style={{fontSize:9,letterSpacing:'4px',color:t.accent,textTransform:'uppercase',fontFamily:'sans-serif',margin:0}}>🕰 History</p>
        <button onClick={add} style={{fontSize:9,letterSpacing:'2px',padding:'4px 10px',background:t.accent,border:'none',color:t.id==='white'?'#fff':'#0a0a0f',cursor:'pointer',fontFamily:'sans-serif',textTransform:'uppercase',fontWeight:700}}>+ 추가</button>
      </div>
      <p style={{fontSize:10,color:t.textSub,fontFamily:'sans-serif',marginBottom:14,lineHeight:1.6}}>연도(4자리)와 한 줄 설명을 입력하세요.<br/>최신순으로 정렬해서 보여줍니다.</p>
      {data.history.length===0&&(
        <div style={{padding:'20px 14px',border:`1px dashed ${t.border}`,textAlign:'center',fontSize:11,color:t.textSub,fontFamily:'sans-serif'}}>
          항목이 없습니다. + 추가를 눌러 연혁을 입력하세요.
        </div>
      )}
      {data.history.map((h)=>(
        <div key={h.id} style={{padding:'12px',border:`1px solid ${t.border}`,marginBottom:10,background:t.surfaceAlt,position:'relative'}}>
          <button onClick={()=>remove(h.id)} style={{position:'absolute',top:8,right:8,width:20,height:20,borderRadius:'50%',background:'rgba(255,80,80,.15)',border:'1px solid rgba(255,80,80,.3)',color:'#ff5050',fontSize:12,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>×</button>
          <input style={{...inp,width:90,display:'inline-block',marginRight:8}} placeholder='연도' maxLength={4} value={h.year} onChange={e=>update(h.id,{year:e.target.value})}/>
          <input style={{...inp,marginBottom:0}} placeholder='설명' value={h.desc} onChange={e=>update(h.id,{desc:e.target.value})}/>
        </div>
      ))}
    </div>
  )
}

// ── 서비스 단가표(Pricing) 편집 패널 ──────────────────────────
function PricingPanel({t,data,setData}){
  const add=()=>setData({...data,pricing:[...data.pricing,{id:'pr'+uid(),name:'New Plan',price:'0',period:'/월',features:['기능 1'],highlighted:false}]})
  const remove=(id)=>setData({...data,pricing:data.pricing.filter(p=>p.id!==id)})
  const update=(id,fields)=>setData({...data,pricing:data.pricing.map(p=>p.id===id?{...p,...fields}:p)})
  const setHighlight=(id)=>setData({...data,pricing:data.pricing.map(p=>({...p,highlighted:p.id===id?!p.highlighted:false}))})
  const addFeature=(id)=>setData({...data,pricing:data.pricing.map(p=>p.id===id?{...p,features:[...p.features,'새 기능']}:p)})
  const updateFeature=(id,fi,val)=>setData({...data,pricing:data.pricing.map(p=>p.id===id?{...p,features:p.features.map((f,i)=>i===fi?val:f)}:p)})
  const removeFeature=(id,fi)=>setData({...data,pricing:data.pricing.map(p=>p.id===id?{...p,features:p.features.filter((_,i)=>i!==fi)}:p)})
  const inp={width:'100%',padding:'9px 12px',background:t.surfaceAlt,border:`1px solid ${t.border}`,color:t.text,fontSize:12,fontFamily:'sans-serif',outline:'none',boxSizing:'border-box',marginBottom:8}
  const inpSm={...inp,marginBottom:0,fontSize:11,padding:'7px 10px'}
  return(
    <div style={{padding:'4px 0'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:6}}>
        <p style={{fontSize:9,letterSpacing:'4px',color:t.accent,textTransform:'uppercase',fontFamily:'sans-serif',margin:0}}>💳 Pricing</p>
        <button onClick={add} disabled={data.pricing.length>=4}
          style={{fontSize:9,letterSpacing:'2px',padding:'4px 10px',background:data.pricing.length>=4?t.border:t.accent,border:'none',color:data.pricing.length>=4?t.textSub:(t.id==='white'?'#fff':'#0a0a0f'),cursor:data.pricing.length>=4?'not-allowed':'pointer',fontFamily:'sans-serif',textTransform:'uppercase',fontWeight:700}}>+ 추가</button>
      </div>
      <p style={{fontSize:10,color:t.textSub,fontFamily:'sans-serif',marginBottom:14,lineHeight:1.6}}>플랜은 최대 4개까지 추가할 수 있어요.<br/>'추천' 토글을 켜면 카드가 강조됩니다.</p>
      {data.pricing.map((p)=>(
        <div key={p.id} style={{padding:'14px',border:`1px solid ${p.highlighted?t.accent:t.border}`,marginBottom:12,background:t.surfaceAlt,position:'relative'}}>
          <button onClick={()=>remove(p.id)} style={{position:'absolute',top:10,right:10,width:20,height:20,borderRadius:'50%',background:'rgba(255,80,80,.15)',border:'1px solid rgba(255,80,80,.3)',color:'#ff5050',fontSize:12,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>×</button>

          <input style={inp} placeholder='플랜 이름' value={p.name} onChange={e=>update(p.id,{name:e.target.value})}/>
          <div style={{display:'flex',gap:8,marginBottom:8}}>
            <input style={{...inpSm,flex:1}} placeholder='가격 (예: 150, 문의)' value={p.price} onChange={e=>update(p.id,{price:e.target.value})}/>
            <input style={{...inpSm,flex:1}} placeholder='단위 (예: /월)' value={p.period} onChange={e=>update(p.id,{period:e.target.value})}/>
          </div>

          {/* 기능 목록 */}
          <div style={{marginBottom:8}}>
            <span style={{fontSize:9,letterSpacing:'1px',color:t.textSub,textTransform:'uppercase',fontFamily:'sans-serif'}}>기능 목록</span>
            {p.features.map((f,fi)=>(
              <div key={fi} style={{display:'flex',gap:6,marginTop:6}}>
                <input style={{...inpSm,flex:1}} value={f} onChange={e=>updateFeature(p.id,fi,e.target.value)}/>
                <button onClick={()=>removeFeature(p.id,fi)} style={{width:28,flexShrink:0,background:'transparent',border:`1px solid ${t.border}`,color:t.textSub,cursor:'pointer',fontSize:12}}>×</button>
              </div>
            ))}
            <button onClick={()=>addFeature(p.id)} style={{marginTop:6,fontSize:9,letterSpacing:'1px',padding:'5px 10px',background:'transparent',border:`1px solid ${t.border}`,color:t.textSub,cursor:'pointer',fontFamily:'sans-serif',textTransform:'uppercase'}}>+ 기능 추가</button>
          </div>

          {/* 추천 토글 */}
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',paddingTop:8,borderTop:`1px solid ${t.border}`}}>
            <span style={{fontSize:10,color:t.text,fontFamily:'sans-serif'}}>이 플랜을 추천으로 강조</span>
            <div onClick={()=>setHighlight(p.id)}
              style={{width:38,height:22,borderRadius:11,cursor:'pointer',flexShrink:0,background:p.highlighted?t.accent:t.border,position:'relative',transition:'background .2s'}}>
              <div style={{position:'absolute',top:2,width:18,height:18,borderRadius:'50%',background:'#fff',left:p.highlighted?18:2,transition:'left .2s'}}/>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── 섹션 표시 토글 패널 ────────────────────────────────────────
function SectionsPanel({t,data,setData}){
  const sections={history:false,pricing:false,heroLinks:true,...(data.sections||{})}
  const toggle=(key)=>setData({...data,sections:{...sections,[key]:!sections[key]}})
  const SI=[
    {key:'heroLinks',label:'히어로 SNS 버튼',desc:'회사명 아래 SNS 아이콘 4개 표시 (하단 Contact 섹션엔 영향 없음)'},
    {key:'history',label:'연혁 (History)',desc:'회사 연혁을 타임라인으로 표시'},
    {key:'pricing',label:'서비스 단가표 (Pricing)',desc:'플랜별 가격 비교표 표시'},
  ]
  return(
    <div style={{padding:'4px 0'}}>
      <p style={{fontSize:9,letterSpacing:'4px',color:t.accent,textTransform:'uppercase',marginBottom:8,fontFamily:'sans-serif'}}>📑 표시할 섹션</p>
      <p style={{fontSize:10,color:t.textSub,fontFamily:'sans-serif',marginBottom:16,lineHeight:1.6}}>켜둔 섹션만 카드 공개 화면에 노출됩니다.<br/>내용은 꺼져 있어도 저장되어 있어요.</p>
      {SI.map(item=>(
        <div key={item.key} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'14px 0',borderBottom:`1px solid ${t.border}`}}>
          <div>
            <div style={{fontSize:12,color:t.text,fontFamily:'sans-serif',marginBottom:3}}>{item.label}</div>
            <div style={{fontSize:10,color:t.textSub,fontFamily:'sans-serif'}}>{item.desc}</div>
          </div>
          <div onClick={()=>toggle(item.key)}
            style={{width:42,height:24,borderRadius:12,cursor:'pointer',flexShrink:0,background:sections[item.key]?t.accent:t.border,position:'relative',transition:'background .2s'}}>
            <div style={{position:'absolute',top:3,width:18,height:18,borderRadius:'50%',background:'#fff',left:sections[item.key]?21:3,transition:'left .2s'}}/>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── 모션 설정 패널 ───────────────────────────────────────────
function MotionPanel({t,me,setMe}){
  const MI=[
    {key:'particle',label:'파티클 배경',desc:'히어로 유동 파티클'},
    {key:'glitch',label:'글리치 텍스트',desc:'회사명 chromatic 글리치'},
    {key:'transition',label:'슬라이드 전환',desc:'템플릿 방향 슬라이드'},
    {key:'scroll',label:'스크롤 Reveal',desc:'섹션 진입 페이드업'},
    {key:'counter',label:'카운터 애니메이션',desc:'실적 숫자 카운트업'},
    {key:'hover',label:'호버 인터랙션',desc:'카드 슬라이드·글로우'},
    {key:'load',label:'로드 시퀀스',desc:'히어로 오케스트라 등장'},
  ]
  return(
    <div style={{padding:'4px 0'}}>
      <p style={{fontSize:9,letterSpacing:'4px',color:t.accent,textTransform:'uppercase',marginBottom:18,fontFamily:'sans-serif'}}>✦ Motion Settings</p>
      {MI.map(item=>(
        <div key={item.key} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'14px 0',borderBottom:`1px solid ${t.border}`}}>
          <div>
            <div style={{fontSize:12,color:t.text,fontFamily:'sans-serif',marginBottom:3}}>{item.label}</div>
            <div style={{fontSize:10,color:t.textSub,fontFamily:'sans-serif'}}>{item.desc}</div>
          </div>
          <div onClick={()=>setMe(p=>({...p,[item.key]:!p[item.key]}))}
            style={{width:42,height:24,borderRadius:12,cursor:'pointer',flexShrink:0,background:me[item.key]?t.accent:t.border,position:'relative',transition:'background .2s'}}>
            <div style={{position:'absolute',top:3,width:18,height:18,borderRadius:'50%',background:'#fff',left:me[item.key]?21:3,transition:'left .2s'}}/>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── 메인 에디터 패널 export ──────────────────────────────────
export default function EditorPanel({t,data,setData,co,setCo,me,setMe}){
  const[et,sEt]=useState('content')

  const inp={width:'100%',padding:'9px 12px',background:t.surfaceAlt,border:`1px solid ${t.border}`,color:t.text,fontSize:12,fontFamily:'sans-serif',outline:'none',boxSizing:'border-box',marginBottom:10}
  const lbl={fontSize:9,letterSpacing:'3px',color:t.accent,textTransform:'uppercase',display:'block',marginBottom:5,fontFamily:'sans-serif'}

  const TABS=[
    {k:'content',  l:'✏ 내용'},
    {k:'sections', l:'📑 섹션'},
    {k:'history',  l:'🕰 연혁'},
    {k:'pricing',  l:'💳 단가표'},
    {k:'portfolio',l:'🖼 포트폴리오'},
    {k:'links',    l:'🔗 링크'},
    {k:'color',    l:'🎨 색상'},
    {k:'image',    l:'📷 이미지'},
    {k:'motion',   l:'✦ 모션'},
  ]

  return(
    <div style={{display:'flex',flexDirection:'column',height:'100%',background:t.surface}}>
      {/* 탭 헤더 */}
      <div style={{display:'flex',borderBottom:`1px solid ${t.border}`,flexShrink:0,overflowX:'auto'}}>
        {TABS.map(tab=>(
          <button key={tab.k} onClick={()=>sEt(tab.k)}
            style={{flexShrink:0,padding:'10px 9px',background:et===tab.k?t.surfaceAlt:'transparent',border:'none',
              borderBottom:et===tab.k?`2px solid ${t.accent}`:'2px solid transparent',
              color:et===tab.k?t.accent:t.textSub,fontSize:9,letterSpacing:'1px',
              textTransform:'uppercase',cursor:'pointer',fontFamily:'sans-serif',whiteSpace:'nowrap'}}>
            {tab.l}
          </button>
        ))}
      </div>

      {/* 탭 내용 */}
      <div style={{flex:1,overflowY:'auto',padding:'20px'}}>

        {et==='content'&&(<>
          <label style={lbl}>Company Name</label>
          <input style={inp} value={data.companyName} onChange={e=>setData({...data,companyName:e.target.value})}/>
          <label style={lbl}>Tagline</label>
          <input style={inp} value={data.tagline} onChange={e=>setData({...data,tagline:e.target.value})}/>
          <label style={lbl}>Logo Letter</label>
          <input style={inp} value={data.logo} maxLength={2} onChange={e=>setData({...data,logo:e.target.value})}/>
          <label style={lbl}>Description</label>
          <textarea style={{...inp,minHeight:80,resize:'vertical'}} value={data.description} onChange={e=>setData({...data,description:e.target.value})}/>
          <p style={{...lbl,marginTop:18}}>✦ Contact</p>
          {['email','phone','address'].map(k=>(
            <div key={k}>
              <label style={lbl}>{k}</label>
              <input style={inp} value={data.contact[k]} onChange={e=>setData({...data,contact:{...data.contact,[k]:e.target.value}})}/>
            </div>
          ))}
          <p style={{...lbl,marginTop:18}}>✦ Stats</p>
          {data.stats.map((s,i)=>(
            <div key={i} style={{display:'flex',gap:8,marginBottom:8}}>
              <input style={{...inp,flex:2,marginBottom:0}} placeholder='Label' value={s.label} onChange={e=>{const a=[...data.stats];a[i]={...a[i],label:e.target.value};setData({...data,stats:a})}}/>
              <input style={{...inp,flex:1,marginBottom:0}} type='number' value={s.value} onChange={e=>{const a=[...data.stats];a[i]={...a[i],value:Number(e.target.value)};setData({...data,stats:a})}}/>
              <input style={{...inp,flex:1,marginBottom:0}} placeholder='+' value={s.suffix} onChange={e=>{const a=[...data.stats];a[i]={...a[i],suffix:e.target.value};setData({...data,stats:a})}}/>
            </div>
          ))}
          <ServicesEditor t={t} data={data} setData={setData} inp={inp} lbl={lbl}/>
        </>)}

        {et==='sections'&&<SectionsPanel t={t} data={data} setData={setData}/>}
        {et==='history'&&<HistoryPanel t={t} data={data} setData={setData}/>}
        {et==='pricing'&&<PricingPanel t={t} data={data} setData={setData}/>}
        {et==='portfolio'&&<PortfolioPanel t={t} data={data} setData={setData}/>}
        {et==='links'&&<LinksPanel t={t} data={data} setData={setData}/>}
        {et==='color'&&<ColorPanel t={t} co={co} setCo={setCo}/>}
        {et==='image'&&<ImageUploadPanel t={t} data={data} setData={setData}/>}
        {et==='motion'&&<MotionPanel t={t} me={me} setMe={setMe}/>}
      </div>
    </div>
  )
}
