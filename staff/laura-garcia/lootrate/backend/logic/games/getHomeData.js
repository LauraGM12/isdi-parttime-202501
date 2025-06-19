import * as rawgService from './rawgService.js'
import { errors } from 'common'

// Función para obtener todos los datos necesarios para el home
const getHomeData = async () => {
    try {
        const [featuredGames, genres, upcomingGames, trendingGames, newReleases, topRated] = await Promise.all([
            rawgService.getFeaturedGames(1, 10),
            rawgService.getGenres(),
            rawgService.getUpcomingGames(1, 6),
            // Trending: juegos populares recientes
            rawgService.getTrendingGames(1, 6),
            // New Releases: juegos lanzados recientemente
            rawgService.getNewReleases(1, 6),
            // Top Rated: juegos mejor valorados
            rawgService.getTopRatedGames(1, 6)
        ])
        
        return {
            featured: featuredGames.results?.[0] || null,
            trending: trendingGames.results || [],
            newReleases: newReleases.results || [],
            topRated: topRated.results || [],
            upcoming: upcomingGames.results || [],
            genres: genres.results || []
        }
    } catch (error) {
        throw new errors.ServerError(`Error al obtener datos del home: ${error.message}`)
    }
}

// Función para obtener juegos por género específico
const getGamesByGenre = async (genreSlug, page = 1) => {
    try {
        // Obtenemos juegos del género especificado
        const gamesData = await rawgService.getGamesByGenre(genreSlug, page, 20)
        
        return {
            games: gamesData.results || [],
            total: gamesData.count || 0,
            next: gamesData.next,
            previous: gamesData.previous
        }
    } catch (error) {
        throw new errors.ServerError(`Error al obtener juegos por género: ${error.message}`)
    }
}

// Función para buscar juegos
const searchGames = async (query, page = 1) => {
    try {
        // Validamos que haya una consulta
        if (!query || query.trim().length === 0) {
            throw new errors.ValidationError('La consulta de búsqueda es requerida')
        }

        // Realizamos la búsqueda
        const searchResults = await rawgService.searchGames(query.trim(), page, 20)
        
        return {
            games: searchResults.results || [],
            total: searchResults.count || 0,
            next: searchResults.next,
            previous: searchResults.previous,
            query: query.trim()
        }
    } catch (error) {
        throw new errors.ServerError(`Error al buscar juegos: ${error.message}`)
    }
}

// Exportamos las funciones
export {
    getHomeData,
    getGamesByGenre,
    searchGames
}