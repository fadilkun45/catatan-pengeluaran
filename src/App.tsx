import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Dashboard } from './Pages/Dashboard/Dashboard'
import Kategori from './Pages/Kategori/Kategori'

function App() {

  return (
     <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout><Dashboard /></Layout>} />
        <Route path='/kategori' element={<Layout><Kategori /></Layout>} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
