import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Onboarding from './pages/public/Onboarding'
import Login from './pages/public/Login'
import Register from './pages/public/Register'
import NotFound from './pages/public/NotFound'
import Home from './pages/private/Home'
import Profile from './pages/private/Profile'
import EditProfile from './pages/private/EditProfile'
import Settings from './pages/private/Settings'
import Reviews from './pages/private/Reviews'
import Library from './pages/private/Library'
import GameDetail from './pages/private/GameDetail'
import ExploreGames from './pages/private/ExploreGames'
import PrivateRoute from './components/PrivateRoute'

function App() {
  return (
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/explore" element={<PrivateRoute><ExploreGames /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/profile/edit" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
        <Route path="/reviews" element={<PrivateRoute><Reviews /></PrivateRoute>} />
        <Route path="/library" element={<PrivateRoute><Library /></PrivateRoute>} />
        <Route path="/game/:gameId" element={<PrivateRoute><GameDetail /></PrivateRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
  )
}

export default App