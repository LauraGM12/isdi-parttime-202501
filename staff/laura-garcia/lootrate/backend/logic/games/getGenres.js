import { getGenres as rawgGetGenres } from './rawgService.js'
import { errors } from 'common'

const getGenres = async () => {
    try {
        const genresData = await rawgGetGenres()
        
        return {
            results: genresData.results || [],
            count: genresData.count || 0,
            next: genresData.next,
            previous: genresData.previous
        }
    } catch (error) {
        throw new errors.ServerError(`Error al obtener géneros: ${error.message}`)
    }
}

export { getGenres }