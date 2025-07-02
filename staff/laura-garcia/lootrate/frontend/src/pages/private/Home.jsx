import { useState, useEffect } from 'react'
import { getHomeData, searchGames } from '../../logic/games/getHomeData'
import { getOwnProfile } from '../../logic/users/profileUser'
import FeaturedGame from '../../components/FeaturedGame.jsx'
import GameSection from '../../components/GameSection.jsx'
import SearchBar from '../../components/SearchBar.jsx'
import Header from '../../components/Header.jsx'
import GameCard from '../../components/GameCard.jsx'
import { errors } from 'common'
import getToken from '../../helpers/getToken'

const Home = () => {
    const [homeData, setHomeData] = useState(null)
    const [searchResults, setSearchResults] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSearching, setIsSearching] = useState(false)
    const [error, setError] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [user, setUser] = useState(null)

    useEffect(() => {
        loadHomeData()
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
            showError(err.message || 'Error al cargar datos del usuario')
        }
    }
    
    const loadHomeData = async () => {
        try {
            setIsLoading(true)
            setError(null)
            const data = await getHomeData()
            setHomeData(data)
        } catch (err) {
            showError(err.message || 'Error al cargar los juegos')
            setError(err.message || 'Error al cargar los juegos')
        } finally {
            setIsLoading(false)
        }
    }
    
    const handleSearch = async (query) => {
        try {
            setIsSearching(true);
            setError(null);
            setSearchQuery(query);
            
            const results = await searchGames(query);
            
            const transformedResults = {
                ...results,
                games: results.results
            };
            
            setSearchResults(transformedResults);
        } catch (err) {
            showError(err.message || 'Error al buscar juegos')
            setError(err.message || 'Error al buscar juegos');
            setSearchResults(null);
        } finally {
            setIsSearching(false);
        }
    }

    const clearSearch = () => {
        setSearchResults(null)
        setSearchQuery('')
        setError(null)
    }

    const handleRetry = () => {
        if (searchQuery) {
            handleSearch(searchQuery)
        } else {
            loadHomeData()
        }
    }

    return (
        <div className="min-h-screen bg-gray-900">
            <Header user={user} />
            <main className="max-w-7xl mx-auto px-4 py-8">
                <SearchBar onSearch={handleSearch} />
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

                {(isLoading || isSearching) && (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                        <span className="ml-3 text-white">
                            {isSearching ? 'Buscando...' : 'Cargando...'}
                        </span>
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

                {searchResults && !isSearching && (
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-6">
                            Resultados para "{searchQuery}"
                        </h2>
                        {searchResults.results && searchResults.results.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                {searchResults.results.map((game) => (
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

                {!searchResults && homeData && !isLoading && (
                    <div>
                        {homeData.featured && (
                            <FeaturedGame game={homeData.featured} />
                        )}
                        
                        {homeData.trending && (
                            <GameSection 
                                title="Juegos en Tendencia" 
                                games={homeData.trending} 
                            />
                        )}
                        
                        {homeData.newReleases && (
                            <GameSection 
                                title="Nuevos Lanzamientos" 
                                games={homeData.newReleases} 
                            />
                        )}
                        
                        {homeData.topRated && (
                            <GameSection 
                                title="Mejor Valorados" 
                                games={homeData.topRated} 
                            />
                        )}
                        
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