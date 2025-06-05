import { Link } from 'react-router-dom'

function Onboarding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      {/* Contenedor principal */}
      <div className="max-w-md w-full space-y-8 text-center">
        
        {/* Logo/Título */}
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-white tracking-wider">
            LootRate
          </h1>
          <div className="flex justify-center">
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
          </div>
        </div>

        {/* Descripción */}
        <div className="space-y-4">
          <p className="text-xl text-gray-300 font-medium">
            Descubre y valora
          </p>
          <p className="text-lg text-gray-400 leading-relaxed">
            La plataforma para explorar, valorar y compartir tus experiencias gaming
          </p>
        </div>

        {/* Botones de acción */}
        <div className="space-y-4 pt-8">
          <Link 
            to="/login"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 block"
          >
            Iniciar Sesión
          </Link>
          
          <Link 
            to="/register"
            className="w-full bg-transparent border-2 border-blue-500 hover:bg-blue-500 text-blue-400 hover:text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 block"
          >
            Crear Cuenta
          </Link>
        </div>

        {/* Elementos decorativos */}
        <div className="pt-8 space-y-2">
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Onboarding