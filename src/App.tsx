import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Dashboard } from './Pages/Dashboard/Dashboard'
import Kategori from './Pages/Kategori/Kategori'
import KategoriDetail from './Pages/KategoriDetail/KategoriDetail'

function App() {

  return (
     <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout><Dashboard /></Layout>} />
        <Route path='/kategori' element={<Layout><Kategori /></Layout>} />
        <Route path='/kategori-detail' element={<Layout><KategoriDetail /></Layout>} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
