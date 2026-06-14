export default function NotFound() {
  return (
    <div style={{ minHeight:'100vh', background:'#08080f', display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center', fontFamily:'sans-serif' }}>
      <div style={{ fontSize:48, color:'#c9a84c', marginBottom:16 }}>404</div>
      <div style={{ fontSize:12, letterSpacing:'4px', color:'#6a6880', textTransform:'uppercase' }}>
        Card not found
      </div>
      <a href="/" style={{ marginTop:32, fontSize:10, letterSpacing:'3px', color:'#c9a84c',
        textTransform:'uppercase', textDecoration:'none', border:'1px solid #c9a84c',
        padding:'10px 24px' }}>
        Create New Card
      </a>
    </div>
  )
}
