import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Dashboard } from './Pages/Dashboard/Dashboard'
import Kategori from './Pages/Kategori/Kategori'
import KategoriDetail from './Pages/KategoriDetail/KategoriDetail'
import LogPengeluaran from './Pages/LogPengeluaran/LogPengeluaran'
import Profile from './Pages/Profile/Profile'
import LandingPage from './Pages/LandingPage/LandingPage'

function App() {

  return (
     <BrowserRouter>
      <Routes>
      <Route path='/' element={<LandingPage />} />
        <Route path='/dashboard' element={<Layout><Dashboard /></Layout>} />
        <Route path='/kategori' element={<Layout><Kategori /></Layout>} />
        <Route path='/kategori-detail' element={<Layout><KategoriDetail /></Layout>} />
        <Route path='/log-pengeluaran' element={<Layout><LogPengeluaran /></Layout>} />
        <Route path='/profile' element={<Layout><Profile /></Layout>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
