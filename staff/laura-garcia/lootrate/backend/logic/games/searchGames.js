import { searchGames as rawgSearchGames } from './rawgService.js'
import { errors } from 'common'

const searchGames = async (query, page = 1) => {
    try {
        if (!query || query.trim().length === 0) {
            throw new errors.ValidationError('La consulta de búsqueda es requerida')
        }

        if (page < 1) {
            throw new errors.ValidationError('La página debe ser mayor a 0')
        }

        const searchResults = await rawgSearchGames(query, page)
        
        return {
            query: query.trim(),
            page,
            results: searchResults.results || [],
            count: searchResults.count || 0,
            next: searchResults.next,
            previous: searchResults.previous
        }
    } catch (error) {
        if (error instanceof errors.ValidationError) {
            throw error
        }
        throw new errors.ServerError(`Error al buscar juegos: ${error.message}`)
    }
}

export { searchGames }