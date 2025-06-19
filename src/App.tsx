import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ImportLeague from './pages/ImportLeague'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/import-league" element={<ImportLeague />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
