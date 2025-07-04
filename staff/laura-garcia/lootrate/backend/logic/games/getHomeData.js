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

export { getHomeData }