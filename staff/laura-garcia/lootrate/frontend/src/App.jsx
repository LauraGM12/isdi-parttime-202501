import React from 'react'
import { Routes, Route } from 'react-router-dom'
// Importamos páginas públicas
import Onboarding from './pages/public/Onboarding'
import Login from './pages/public/Login'
import Register from './pages/public/Register'
import NotFound from './pages/public/NotFound'
// Importamos páginas privadas
import Home from './pages/private/Home'
import Profile from './pages/private/Profile'
import EditProfile from './pages/private/EditProfile'
import Settings from './pages/private/Settings'
import Reviews from './pages/private/Reviews'
import Library from './pages/private/Library'
import GameDetail from './pages/private/GameDetail'
// Importamos el componente PrivateRoute
import PrivateRoute from './components/PrivateRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Onboarding />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/user/:username" element={<Profile />} />
      <Route path="/profile/edit" element={<EditProfile />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/reviews" element={<Reviews />} />
      <Route path="/library" element={
        <PrivateRoute>
          <Library />
        </PrivateRoute>
      } />
      <Route path="/game/:id" element={
        <PrivateRoute>
          <GameDetail />
        </PrivateRoute>
      } />
      {/* Ruta catch-all para páginas no encontradas - DEBE IR AL FINAL */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App