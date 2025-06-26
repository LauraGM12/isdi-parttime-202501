import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const NotFound = () => {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
            <div className="text-center">
                <div className="mb-8">
                    <h1 className="text-9xl font-bold text-white mb-4">404</h1>
                    <div className="text-6xl mb-4">🎮</div>
                    <h2 className="text-3xl font-bold text-white mb-4">
                        ¡Oops! Página no encontrada
                    </h2>
                    <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
                        La página que buscas no existe o ha sido movida. 
                        Puede que el juego que intentas ver no esté disponible.
                    </p>
                </div>
                
                <div className="space-y-4">
                    <button 
                        onClick={() => navigate(-1)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors mr-4"
                    >
                        ← Volver atrás
                    </button>
                    
                    <Link 
                        to="/home" 
                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-block"
                    >
                        🏠 Ir al inicio
                    </Link>
                </div>
                
            </div>
        </div>
    )
}

export default NotFound