import React, { useState, useEffect } from 'react'
// Importamos la lógica de juegos
import { getGamesByGenre, getGamesByPlatform, getGenres, getPlatforms } from '../../logic/games/getExploreData'
// Importamos componentes
import GameSection from '../../components/GameSection.jsx'
import Header from '../../components/Header.jsx'
// Importamos errores
import { errors } from 'common'
import getToken from '../../helpers/getToken'

/**
 * Componente para explorar juegos por género y plataforma
 * 
 * @description Página que muestra juegos organizados por géneros y plataformas
 * 
 * @component
 * @returns {JSX.Element} Página de exploración con juegos por género y plataforma
 */
const ExploreGames = () => {
    // Estados para los datos
    const [genreGames, setGenreGames] = useState({})
    const [platformGames, setPlatformGames] = useState({})
    const [genres, setGenres] = useState([])
    const [platforms, setPlatforms] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [user, setUser] = useState(null)

    /**
     * Efecto para cargar datos iniciales al montar el componente
     */
    useEffect(() => {
        loadData()
    }, [])

    /**
     * Función para cargar todos los datos necesarios
     * 
     * @async
     * @function loadData
     * @returns {Promise<void>}
     */
    const loadData = async () => {
        try {
            setIsLoading(true)
            setError(null)

            // Obtener géneros y plataformas disponibles
            const [genresData, platformsData] = await Promise.all([
                getGenres(),
                getPlatforms()
            ])

            // Seleccionar algunos géneros y plataformas populares
            const selectedGenres = genresData.results.slice(0, 6)
            const selectedPlatforms = platformsData.results.slice(0, 6)

            setGenres(selectedGenres)
            setPlatforms(selectedPlatforms)

            // Obtener juegos para cada género y plataforma seleccionada
            const genrePromises = selectedGenres.map(genre => 
                getGamesByGenre(genre.slug).then(data => ({ [genre.slug]: data.results }))
            )

            const platformPromises = selectedPlatforms.map(platform => 
                getGamesByPlatform(platform.id).then(data => ({ [platform.id]: data.results }))
            )

            // Esperar a que se resuelvan todas las promesas
            const genreResults = await Promise.all(genrePromises)
            const platformResults = await Promise.all(platformPromises)

            // Combinar los resultados en un solo objeto
            const genreGamesData = genreResults.reduce((acc, curr) => ({ ...acc, ...curr }), {})
            const platformGamesData = platformResults.reduce((acc, curr) => ({ ...acc, ...curr }), {})

            setGenreGames(genreGamesData)
            setPlatformGames(platformGamesData)
        } catch (err) {
            console.error('Error cargando datos:', err)
            setError(err.message || 'Error al cargar los juegos')
        } finally {
            setIsLoading(false)
        }
    }

    /**
     * Función para reintentar operaciones fallidas
     * 
     * @function handleRetry
     * @description Reintenta la carga de datos
     */
    const handleRetry = () => {
        loadData()
    }

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Header con información del usuario */}
            <Header user={user} />

            {/* Contenido principal */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-white mb-8">Explora juegos por categoría</h1>

                {/* Estado de carga */}
                {isLoading && (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                        <span className="ml-3 text-white">Cargando...</span>
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

                {/* Contenido principal */}
                {!isLoading && !error && (
                    <div>
                        {/* Secciones de juegos por género */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-white mb-6">Juegos por género</h2>
                            {genres.map(genre => (
                                <GameSection 
                                    key={genre.id}
                                    title={genre.name} 
                                    games={genreGames[genre.slug] || []} 
                                />
                            ))}
                        </div>

                        {/* Secciones de juegos por plataforma */}
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-6">Juegos por plataforma</h2>
                            {platforms.map(platform => (
                                <GameSection 
                                    key={platform.id}
                                    title={platform.name} 
                                    games={platformGames[platform.id] || []} 
                                />
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}

export default ExploreGames