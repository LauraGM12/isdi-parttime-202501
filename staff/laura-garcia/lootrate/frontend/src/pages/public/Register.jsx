import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
// Importamos la lógica de registro de usuarios
import registerUser from '../../logic/users/registerUser'
// Importamos errores y validadores del módulo común
import { errors, validator } from 'common'

/**
 * Componente principal de la página de registro.
 * 
 * Gestiona el formulario de registro, validación de datos,
 * verificación de contraseñas y manejo de errores específicos.
 * 
 * @returns {JSX.Element} Página de registro de usuarios
 */
function Register() {
  // Estados del formulario de registro
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Hook para navegación programática
  const navigate = useNavigate()

  /**
   * Maneja los cambios en los campos del formulario.
   * 
   * Actualiza el estado del formulario cuando el usuario
   * escribe en cualquiera de los campos de entrada.
   * 
   * @param {Event} event - Evento del input
   */
  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    })
  }

  /**
   * Maneja el envío del formulario de registro.
   * 
   * Realiza validaciones, verifica que las contraseñas coincidan,
   * llama a la función de registro y redirige al login si es exitoso.
   * 
   * @param {Event} event - Evento del formulario
   */
  const handleSubmit = async (event) => {
    event.preventDefault()
    
    try {
      // Limpiamos errores previos
      setError('')
      
      // Validación local: verificamos que las contraseñas coincidan
      if (formData.password !== formData.confirmPassword) {
        setError('Las contraseñas no coinciden')
        return
      }
      
      setIsLoading(true)
      
      // Llamamos a la función de registro con los datos del formulario
      await registerUser({
        email: formData.email,
        password: formData.password,
        'confirmation-password': formData.confirmPassword,
        username: formData.name 
      })
      
      // Si el registro es exitoso, redirigimos al login con mensaje de éxito
      navigate('/login', { 
        state: { 
          message: 'Cuenta creada exitosamente. Inicia sesión para continuar.' 
        } 
      })
      
    } catch (err) {
      console.error('Error en proceso de registro:', err)
      
      // Manejo específico de diferentes tipos de errores
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
      // Siempre restauramos el estado de carga
      setIsLoading(false)
    }
  }

   return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        
        {/* Encabezado de la página con branding */}
        <div className="text-center space-y-4">
          <Link to="/" className="inline-block">
            <h1 className="text-4xl font-bold text-gray-900 tracking-wider hover:text-purple-600 transition-colors">
              LootRate
            </h1>
          </Link>
          <div className="flex justify-center">
            <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
          </div>
          <p className="text-gray-700 text-lg">Crea tu cuenta</p>
        </div>

        {/* Formulario principal de registro */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Mensaje de error */}
            {error && (
              <div className="bg-red-100 border border-red-400 rounded-lg p-3">
                <p className="text-red-700 text-sm text-center">{error}</p>
              </div>
            )}
            
            {/* Campo de nombre de usuario */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:opacity-50"
                placeholder="Tu nombre de usuario"
              />
            </div>

            {/* Campo de email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:opacity-50"
                placeholder="tu@email.com"
              />
            </div>

            {/* Campo de contraseña */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:opacity-50"
                placeholder="••••••••"
              />
            </div>

            {/* Campo de confirmación de contraseña */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:opacity-50"
                placeholder="••••••••"
              />
            </div>

            {/* Botón de envío con estado de carga */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold py-3 px-6 rounded-xl hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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

          {/* Enlace a la página de login */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-purple-600 hover:text-purple-700 font-medium transition-colors">
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