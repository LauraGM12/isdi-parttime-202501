import React, { useState, useEffect } from 'react'
import { getGamesByGenre, getGamesByPlatform, getGenres, getPlatforms } from '../../logic/games/getExploreData'
import { getOwnProfile } from '../../logic/users/profileUser'
import GameSection from '../../components/GameSection.jsx'
import Header from '../../components/Header.jsx'
import { errors } from 'common'
import getToken from '../../helpers/getToken'

const ExploreGames = () => {
    const [genreGames, setGenreGames] = useState({})
    const [platformGames, setPlatformGames] = useState({})
    const [genres, setGenres] = useState([])
    const [platforms, setPlatforms] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [user, setUser] = useState(null)

    useEffect(() => {
        loadData()
        loadUserData()
    }, [])

    const loadUserData = async () => {
        try {
            const token = getToken()
            if (token) {
                const userData = await getOwnProfile(token)
                setUser(userData)
            }
        } catch (err) {
        }
    }

    const loadData = async () => {
        try {
            setIsLoading(true)
            setError(null)
            const [genresData, platformsData] = await Promise.all([
                getGenres(),
                getPlatforms()
            ])

            const selectedGenres = genresData.results.slice(0, 6)
            const selectedPlatforms = platformsData.results.slice(0, 6)

            setGenres(selectedGenres)
            setPlatforms(selectedPlatforms)

            const genrePromises = selectedGenres.map(genre => 
                getGamesByGenre(genre.slug).then(data => ({ [genre.slug]: data.results }))
            )

            const platformPromises = selectedPlatforms.map(platform => 
                getGamesByPlatform(platform.id).then(data => ({ [platform.id]: data.results }))
            )

            const genreResults = await Promise.all(genrePromises)
            const platformResults = await Promise.all(platformPromises)
            const genreGamesData = genreResults.reduce((acc, curr) => ({ ...acc, ...curr }), {})
            const platformGamesData = platformResults.reduce((acc, curr) => ({ ...acc, ...curr }), {})

            setGenreGames(genreGamesData)
            setPlatformGames(platformGamesData)
        } catch (err) {
            setError(err.message || 'Error al cargar los juegos')
        } finally {
            setIsLoading(false)
        }
    }

    const handleRetry = () => {
        loadData()
    }

    return (
        <div className="min-h-screen bg-gray-900">
            <Header user={user} />
            <main className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-white mb-8">Explora juegos por categoría</h1>
                {isLoading && (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                        <span className="ml-3 text-white">Cargando...</span>
                    </div>
                )}
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

                {!isLoading && !error && (
                    <div>
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