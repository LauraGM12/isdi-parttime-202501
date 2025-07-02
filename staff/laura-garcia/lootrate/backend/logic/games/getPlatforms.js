import { getPlatforms as rawgGetPlatforms } from './rawgService.js'
import { errors } from 'common'

const getPlatforms = async () => {
    try {
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