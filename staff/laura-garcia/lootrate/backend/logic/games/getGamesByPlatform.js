import { getGamesByPlatform as rawgGetGamesByPlatform } from './rawgService.js'
import { errors } from 'common'

// Función para obtener juegos por plataforma
const getGamesByPlatform = async (platformId, page = 1) => {
    try {
        // Validamos los parámetros
        if (!platformId || platformId.trim().length === 0) {
            throw new errors.ValidationError('El ID de la plataforma es requerido')
        }

        if (page < 1) {
            throw new errors.ValidationError('La página debe ser mayor a 0')
        }

        // Obtenemos juegos por plataforma usando el servicio de RAWG
        const gamesData = await rawgGetGamesByPlatform(platformId, page)
        
        return {
            platform: platformId,
            page,
            results: gamesData.results || [],
            count: gamesData.count || 0,
            next: gamesData.next,
            previous: gamesData.previous
        }
    } catch (error) {
        if (error instanceof errors.ValidationError) {
            throw error
        }
        throw new errors.ServerError(`Error al obtener juegos por plataforma: ${error.message}`)
    }
}

export { getGamesByPlatform }