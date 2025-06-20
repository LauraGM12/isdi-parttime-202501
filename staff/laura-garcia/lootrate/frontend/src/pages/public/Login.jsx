// Importamos React y hooks
import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
// Importamos la lógica de login
import loginUser from '../../logic/users/loginUser'
// Importamos errores de common
import { errors } from 'common'

function Login() {
  // Estados del formulario
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  
  // Hooks para navegación y ubicación
  const navigate = useNavigate()
  const location = useLocation()

  // useEffect para manejar el mensaje de éxito
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message)
      // Limpiar el mensaje después de 5 segundos
      setTimeout(() => setSuccessMessage(''), 5000)
    }
  }, [location.state])

  // Función para manejar el envío del formulario
  const handleSubmit = async (event) => {
    event.preventDefault()
    
    try {
      // Limpiamos errores previos
      setError('')
      setIsLoading(true)
      
      // Llamamos a la función de login
      const result = await loginUser({ email, password })
      
      // Si el login es exitoso, guardamos el token y redirigimos
      if (result.token) {
        // Guardamos el token en localStorage
        localStorage.setItem('token', result.token)
        // Redirigimos al home
        navigate('/home')
      }
    } catch (err) {
      console.error('Error en login:', err)
      // Mostramos el error al usuario
      if (err instanceof errors.ValidationError) {
        setError('Por favor verifica tus datos')
      } else if (err instanceof errors.AuthError) {
        setError('Email o contraseña incorrectos')
      } else {
        setError('Error al iniciar sesión. Inténtalo de nuevo.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <Link to="/" className="inline-block">
            <h1 className="text-4xl font-bold text-white tracking-wider hover:text-gaming-purple transition-colors">
              LootRate
            </h1>
          </Link>
          <div className="flex justify-center">
            <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
          </div>
          <p className="text-gray-300 text-lg">Inicia sesión en tu cuenta</p>
        </div>

        {/* Mensaje de éxito */}
        {successMessage && (
          <div className="bg-green-900/50 border border-green-700 rounded-lg p-3">
            <p className="text-green-300 text-sm text-center">{successMessage}</p>
          </div>
        )}

        {/* Formulario */}
        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Mensaje de error */}
            {error && (
              <div className="bg-red-900/50 border border-red-700 rounded-lg p-3">
                <p className="text-red-300 text-sm text-center">{error}</p>
              </div>
            )}
            
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-600 bg-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gaming-purple focus:border-transparent transition-all disabled:opacity-50"
                placeholder="tu@email.com"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-600 bg-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gaming-purple focus:border-transparent transition-all disabled:opacity-50"
                placeholder="••••••••"
              />
            </div>

            {/* Botón Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-gaming-purple to-purple-700 text-white font-semibold py-3 px-6 rounded-xl hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-gaming-purple focus:ring-offset-2 focus:ring-offset-gray-800 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Iniciando sesión...
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          {/* Link a registro */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="text-gaming-purple hover:text-purple-400 font-medium transition-colors">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login