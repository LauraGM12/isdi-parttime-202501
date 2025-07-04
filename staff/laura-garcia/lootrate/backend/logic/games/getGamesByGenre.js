import * as rawgService from './rawgService.js'
import { errors } from 'common'

const getGamesByGenre = async (genreSlug, page = 1) => {
    try {
        if (!genreSlug || genreSlug.trim().length === 0) {
            throw new errors.ValidationError('El slug del género es requerido')
        }

        if (page < 1) {
            throw new errors.ValidationError('La página debe ser mayor a 0')
        }

        const gamesData = await rawgService.getGamesByGenre(genreSlug, page)
        
        return {
            genre: genreSlug,
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
        throw new errors.ServerError(`Error al obtener juegos por género: ${error.message}`)
    }
}

export { getGamesByGenre }