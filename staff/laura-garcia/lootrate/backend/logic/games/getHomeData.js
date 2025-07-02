import * as rawgService from './rawgService.js'
import { errors } from 'common'

const getHomeData = async () => {
    try {
        const [featuredGames, genres, upcomingGames, trendingGames, newReleases, topRated] = await Promise.all([
            rawgService.getFeaturedGames(1, 10),
            rawgService.getGenres(),
            rawgService.getUpcomingGames(1, 6),
            rawgService.getTrendingGames(1, 6),
            rawgService.getNewReleases(1, 6),
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

const getGamesByGenre = async (genreSlug, page = 1) => {
    try {
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

const searchGames = async (query, page = 1) => {
    try {
        if (!query || query.trim().length === 0) {
            throw new errors.ValidationError('La consulta de búsqueda es requerida')
        }

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

export {
    getHomeData,
    getGamesByGenre,
    searchGames
}