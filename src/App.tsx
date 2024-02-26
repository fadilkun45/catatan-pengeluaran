import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Dashboard } from './Pages/Dashboard'

function App() {

  return (
     <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout><Dashboard /></Layout>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
