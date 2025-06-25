import { getPlatforms as rawgGetPlatforms } from './rawgService.js'
import { errors } from 'common'

// Función para obtener plataformas disponibles
const getPlatforms = async () => {
    try {
        // Obtenemos plataformas usando el servicio de RAWG
        const platformsData = await rawgGetPlatforms()
        
        return {
            results: platformsData.results || [],
            count: platformsData.count || 0,
            next: platformsData.next,
            previous: platformsData.previous
        }
    } catch (error) {
        throw new errors.ServerError(`Error al obtener plataformas: ${error.message}`)
    }
}

export { getPlatforms }