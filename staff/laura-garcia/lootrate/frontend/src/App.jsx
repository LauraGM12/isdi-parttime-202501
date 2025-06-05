import { Routes, Route } from 'react-router-dom'
import Onboarding from './pages/public/Onboarding'
import Login from './pages/public/Login'
import Register from './pages/public/Register'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Onboarding />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  )
}

export default App