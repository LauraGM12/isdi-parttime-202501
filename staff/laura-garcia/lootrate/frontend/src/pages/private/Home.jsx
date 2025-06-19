/**
 * @fileoverview Página principal del dashboard de usuario autenticado
 * @description Componente que muestra la página de inicio con juegos destacados,
 * tendencias, nuevos lanzamientos y funcionalidad de búsqueda
 * @author LootRate Team
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react'
// Importamos la lógica de juegos
import { getHomeData, searchGames } from '../../logic/games/getHomeData'
// Importamos la lógica de usuario
import { getOwnProfile } from '../../logic/users/profileUser'
// Importamos componentes
import FeaturedGame from '../../components/FeaturedGame.jsx'
import GameSection from '../../components/GameSection.jsx'
import SearchBar from '../../components/SearchBar.jsx'
import Header from '../../components/Header.jsx'
// Importamos errores
import { errors } from 'common'
import getToken from '../../helpers/getToken'

/**
 * Componente principal del dashboard de usuario
 * 
 * @description Página de inicio que muestra contenido personalizado para usuarios autenticados,
 * incluyendo juegos destacados, tendencias, búsqueda y navegación principal
 * 
 * @component
 * @example
 * // Uso básico del componente
 * <Home />
 * 
 * @returns {JSX.Element} Página principal con contenido dinámico de juegos
 * 
 * @features
 * - Visualización de juegos destacados y tendencias
 * - Funcionalidad de búsqueda en tiempo real
 * - Carga de datos del usuario autenticado
 * - Estados de carga y manejo de errores
 * - Navegación responsive
 * 
 * @accessibility
 * - Indicadores de carga accesibles
 * - Mensajes de error descriptivos
 * - Navegación por teclado
 * - Contraste adecuado para elementos interactivos
 */
const Home = () => {
    // Estados para los datos del home
    const [homeData, setHomeData] = useState(null)
    const [searchResults, setSearchResults] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSearching, setIsSearching] = useState(false)
    const [error, setError] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [user, setUser] = useState(null)

    /**
     * Efecto para cargar datos iniciales al montar el componente
     * Carga tanto los datos del home como la información del usuario
     */
    useEffect(() => {
        loadHomeData()
        loadUserData()
    }, [])

    /**
     * Función para cargar datos del usuario autenticado
     * 
     * @async
     * @function loadUserData
     * @description Obtiene el perfil del usuario usando el token almacenado
     * @returns {Promise<void>}
     */
    const loadUserData = async () => {
        try {
            const token = getToken()
            if (token) {
                // Obtener perfil del usuario autenticado
                const userData = await getOwnProfile(token)
                setUser(userData)
            }
        } catch (err) {
            console.error('Error cargando datos del usuario:', err)
            // No mostrar error al usuario, solo registrar en consola
        }
    }

    /**
     * Función para cargar datos principales del home
     * 
     * @async
     * @function loadHomeData
     * @description Obtiene juegos destacados, tendencias y nuevos lanzamientos
     * @returns {Promise<void>}
     */
    const loadHomeData = async () => {
        try {
            setIsLoading(true)
            setError(null)
            // Obtener datos del home desde la API
            const data = await getHomeData()
            setHomeData(data)
        } catch (err) {
            console.error('Error cargando datos del home:', err)
            setError(err.message || 'Error al cargar los juegos')
        } finally {
            setIsLoading(false)
        }
    }

    /**
     * Función para manejar búsquedas de juegos
     * 
     * @async
     * @function handleSearch
     * @param {string} query - Término de búsqueda ingresado por el usuario
     * @description Realiza búsqueda de juegos y actualiza los resultados
     * @returns {Promise<void>}
     */
    const handleSearch = async (query) => {
        try {
            setIsSearching(true)
            setError(null)
            setSearchQuery(query)
            // Realizar búsqueda en la API
            const results = await searchGames(query)
            setSearchResults(results)
        } catch (err) {
            console.error('Error en la búsqueda:', err)
            setError(err.message || 'Error al buscar juegos')
            setSearchResults(null)
        } finally {
            setIsSearching(false)
        }
    }

    /**
     * Función para limpiar resultados de búsqueda
     * 
     * @function clearSearch
     * @description Resetea la búsqueda y vuelve a mostrar el contenido principal
     */
    const clearSearch = () => {
        setSearchResults(null)
        setSearchQuery('')
        setError(null)
    }

    /**
     * Función para reintentar operaciones fallidas
     * 
     * @function handleRetry
     * @description Reintenta la última operación (búsqueda o carga de datos)
     */
    const handleRetry = () => {
        if (searchQuery) {
            handleSearch(searchQuery)
        } else {
            loadHomeData()
        }
    }

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Header con información del usuario */}
            <Header user={user} />

            {/* Contenido principal */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Barra de búsqueda */}
                <SearchBar onSearch={handleSearch} />
                
                {/* Botón para limpiar búsqueda */}
                {searchResults && (
                    <div className="mb-6">
                        <button 
                            onClick={clearSearch}
                            className="text-blue-400 hover:text-blue-300 transition-colors duration-200 text-sm"
                        >
                            ← Volver al inicio
                        </button>
                    </div>
                )}

                {/* Estado de carga */}
                {(isLoading || isSearching) && (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                        <span className="ml-3 text-white">
                            {isSearching ? 'Buscando...' : 'Cargando...'}
                        </span>
                    </div>
                )}

                {/* Estado de error */}
                {error && (
                    <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-red-400 font-medium">Error</h3>
                                <p className="text-red-300 text-sm mt-1">{error}</p>
                            </div>
                            <button 
                                onClick={handleRetry}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors duration-200"
                            >
                                Reintentar
                            </button>
                        </div>
                    </div>
                )}

                {/* Resultados de búsqueda */}
                {searchResults && !isSearching && (
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-6">
                            Resultados para "{searchQuery}"
                        </h2>
                        {searchResults.games && searchResults.games.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                {searchResults.games.map((game) => (
                                    <GameCard key={game.id} game={game} size="normal" />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-400 text-lg">No se encontraron juegos para "{searchQuery}"</p>
                                <p className="text-gray-500 text-sm mt-2">Intenta con un término diferente</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Contenido principal del home */}
                {!searchResults && homeData && !isLoading && (
                    <div>
                        {/* Juego destacado */}
                        {homeData.featured && (
                            <FeaturedGame game={homeData.featured} />
                        )}
                        
                        {/* Juegos en tendencia */}
                        {homeData.trending && (
                            <GameSection 
                                title="Juegos en Tendencia" 
                                games={homeData.trending} 
                            />
                        )}
                        
                        {/* Nuevos lanzamientos */}
                        {homeData.newReleases && (
                            <GameSection 
                                title="Nuevos Lanzamientos" 
                                games={homeData.newReleases} 
                            />
                        )}
                        
                        {/* Mejor valorados */}
                        {homeData.topRated && (
                            <GameSection 
                                title="Mejor Valorados" 
                                games={homeData.topRated} 
                            />
                        )}
                        
                        {/* Próximamente */}
                        {homeData.upcoming && (
                            <GameSection 
                                title="Próximamente" 
                                games={homeData.upcoming} 
                            />
                        )}
                    </div>
                )}
            </main>
        </div>
    )
}

export default Home