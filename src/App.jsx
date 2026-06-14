// ─────────────────────────────────────────────────────────────
// src/App.jsx
// 라우터: / → 에디터,  /card/:slug → 공개 카드 뷰
// ─────────────────────────────────────────────────────────────
import { Routes, Route } from 'react-router-dom'
import EditorPage from './pages/EditorPage'
import CardPage   from './pages/CardPage'
import NotFound   from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route path="/"            element={<EditorPage />} />
      <Route path="/card/:slug"  element={<CardPage />} />
      <Route path="*"            element={<NotFound />} />
    </Routes>
  )
}
