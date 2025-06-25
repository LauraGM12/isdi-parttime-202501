import { getGenres as rawgGetGenres } from './rawgService.js'
import { errors } from 'common'

// Función para obtener géneros disponibles
const getGenres = async () => {
    try {
        // Obtenemos géneros usando el servicio de RAWG
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