// ─────────────────────────────────────────────────────────────
// src/App.jsx
// 라우터: / → 에디터,  /card/:slug → 공개 카드 뷰,  /admin → 관리자 대시보드
// ─────────────────────────────────────────────────────────────
import { Routes, Route } from 'react-router-dom'
import EditorPage from './pages/EditorPage'
import CardPage   from './pages/CardPage'
import AdminPage  from './pages/AdminPage'
import NotFound   from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route path="/"            element={<EditorPage />} />
      <Route path="/card/:slug"  element={<CardPage />} />
      <Route path="/admin"       element={<AdminPage />} />
      <Route path="*"            element={<NotFound />} />
    </Routes>
  )
}
