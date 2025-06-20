/**
 * @fileoverview Página de bienvenida y landing de LootRate
 * @description Componente de presentación inicial para nuevos usuarios
 * @author LootRate Team
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import getToken from '../../helpers/getToken'

/**
 * Componente de página de bienvenida
 * 
 * @description Página inicial que presenta la aplicación LootRate a nuevos usuarios,
 * con información sobre la plataforma y acceso directo a registro e inicio de sesión.
 * 
 * @component
 * @example
 * // Uso en el router como página principal
 * <Route path="/" element={<Onboarding />} />
 * 
 * @returns {JSX.Element} Página de bienvenida con presentación de la marca
 * 
 * @features
 * - Presentación visual atractiva de la marca LootRate
 * - Descripción clara del propósito de la plataforma
 * - Botones de acceso directo a login y registro
 * - Diseño responsive con animaciones sutiles
 * - Elementos decorativos para mejorar la experiencia visual
 * - Redirección automática para usuarios autenticados
 * - Estadísticas de la plataforma en tiempo real
 * 
 * @design
 * - Gradientes modernos y colores de marca
 * - Animaciones CSS para elementos interactivos
 * - Tipografía jerárquica clara
 * - Espaciado consistente y responsive
 */
const Onboarding = () => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)
    const [stats, setStats] = useState({
        users: '10K+',
        games: '50K+',
        reviews: '100K+'
    })

    /**
     * Efecto para verificar autenticación y cargar datos iniciales
     */
    useEffect(() => {
        // Verificar si el usuario ya está autenticado
        const token = getToken()
        if (token) {
            navigate('/home', { replace: true })
            return
        }

        // Simular carga de estadísticas
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 1000)

        return () => clearTimeout(timer)
    }, [navigate])

    /**
     * Maneja la navegación a registro con tracking
     */
    const handleRegisterClick = () => {
        // Aquí se podría añadir tracking de analytics
        navigate('/register')
    }

    /**
     * Maneja la navegación a login con tracking
     */
    const handleLoginClick = () => {
        // Aquí se podría añadir tracking de analytics
        navigate('/login')
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-300">Cargando LootRate...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="max-w-lg w-full space-y-8 text-center">
                
                {/* Sección de branding y logo */}
                <div className="space-y-6 animate-fade-in">
                    {/* Logo principal */}
                    <div className="relative">
                        <h1 className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 tracking-wide animate-pulse">
                            LootRate
                        </h1>
                        
                        {/* Efecto de brillo */}
                        <div className="absolute inset-0 text-6xl md:text-7xl font-bold text-white opacity-20 animate-ping">
                            LootRate
                        </div>
                    </div>
                    
                    {/* Logo de la aplicación */}
                    <div className="flex justify-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
                            <span className="text-3xl" role="img" aria-label="Controlador de videojuegos">
                                🎮
                            </span>
                        </div>
                    </div>
                    
                    {/* Elemento decorativo */}
                    <div className="flex justify-center">
                        <div className="w-24 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 rounded-full shadow-lg"></div>
                    </div>
                </div>

                {/* Sección de descripción del producto */}
                <div className="space-y-6 py-4">
                    <div className="space-y-3">
                        <h2 className="text-3xl md:text-4xl text-gray-200 font-bold">
                            Descubre y valora
                        </h2>
                        <p className="text-xl text-gray-300 font-medium">
                            tus juegos favoritos
                        </p>
                    </div>
                    
                    <p className="text-lg text-gray-400 leading-relaxed max-w-md mx-auto">
                        La mejor plataforma para explorar, valorar y compartir 
                        tus experiencias gaming con una comunidad apasionada.
                    </p>
                </div>

                {/* Botones de acción principales */}
                <div className="space-y-4 pt-4">
                    {/* Botón de registro (acción primaria) */}
                    <button
                        onClick={handleRegisterClick}
                        className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 text-lg"
                        aria-label="Crear una nueva cuenta en LootRate"
                    >
                        <span className="flex items-center justify-center">
                            <span className="mr-2">🚀</span>
                            Crear Cuenta
                        </span>
                    </button>
                    
                    {/* Botón de inicio de sesión (acción secundaria) */}
                    <button
                        onClick={handleLoginClick}
                        className="w-full bg-white border-2 border-purple-500 hover:bg-purple-50 text-purple-600 hover:text-purple-700 font-semibold py-4 px-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 text-lg"
                        aria-label="Iniciar sesión en tu cuenta existente"
                    >
                        <span className="flex items-center justify-center">
                            <span className="mr-2">🔑</span>
                            Iniciar Sesión
                        </span>
                    </button>
                </div>

                {/* Elementos decorativos y mensaje adicional */}
                <div className="pt-8">
                    {/* Indicadores animados */}
                    <div className="flex justify-center space-x-3 mb-6">
                        <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                        <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                        <div className="w-3 h-3 bg-purple-600 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                    </div>
                    
                    {/* Mensaje de comunidad */}
                    <div className="space-y-2">
                        <p className="text-sm text-gray-400">
                            Únete a miles de gamers apasionados
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Onboarding