import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import registerUser from '../../logic/users/registerUser'
import { errors, validator } from 'common'

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    
    try {
      setError('')

      if (formData.password !== formData.confirmPassword) {
        setError('Las contraseñas no coinciden')
        return
      }
      
      setIsLoading(true)
      
      await registerUser({
        email: formData.email,
        password: formData.password,
        'confirmation-password': formData.confirmPassword,
        username: formData.name 
      })
      
      navigate('/login', { 
        state: { 
          message: 'Cuenta creada exitosamente. Inicia sesión para continuar.' 
        } 
      })
      
    } catch (err) {
      if (err instanceof errors.FormatError) {
        setError('Formato de datos incorrecto: ' + err.message)
      } else if (err instanceof errors.ContentError) {
        setError('Las contraseñas no coinciden o no cumplen los requisitos')
      } else if (err instanceof errors.DuplicityError) {
        setError('Ya existe una cuenta con este email')
      } else if (err instanceof errors.ConnectionError) {
        setError('Error de conexión. Verifica tu internet.')
      } else {
        setError('Error al crear la cuenta. Inténtalo de nuevo.')
      }
    } finally {
      setIsLoading(false)
    }
  }

   return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-4">
          <Link to="/home" className="inline-block">
            <h1 className="text-4xl font-bold text-white tracking-wider hover:text-gaming-purple transition-colors">
              LootRate
            </h1>
          </Link>
          <div className="flex justify-center">
            <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
          </div>
          <p className="text-gray-300 text-lg">Crea tu cuenta</p>
        </div>

        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-900/50 border border-red-700 rounded-lg p-3">
                <p className="text-red-300 text-sm text-center">{error}</p>
              </div>
            )}
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Nombre de Usuario
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-600 bg-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gaming-purple focus:border-transparent transition-all disabled:opacity-50"
                placeholder="Tu nombre de usuario"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-600 bg-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gaming-purple focus:border-transparent transition-all disabled:opacity-50"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-600 bg-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gaming-purple focus:border-transparent transition-all disabled:opacity-50"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirmar Contraseña
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-600 bg-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gaming-purple focus:border-transparent transition-all disabled:opacity-50"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-gaming-purple to-purple-700 text-white font-semibold py-3 px-6 rounded-xl hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-gaming-purple focus:ring-offset-2 focus:ring-offset-gray-800 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creando cuenta...
                </div>
              ) : (
                'Crear Cuenta'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-gaming-purple hover:text-purple-400 font-medium transition-colors">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register