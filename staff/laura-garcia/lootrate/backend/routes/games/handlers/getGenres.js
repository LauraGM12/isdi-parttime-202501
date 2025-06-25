import { getGenres } from '../../../logic/games/getGenres.js'
import { errors } from 'common'

/**
 * Handler para obtener los géneros disponibles
 * 
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función next de Express
 */
export default (req, res, next) => {
    try {
        getGenres()
            .then(data => res.status(200).json(data))
            .catch(error => {
                next(new errors.ServerError(error.message))
            })
    } catch (error) {
        next(new errors.ServerError(error.message))
    }
}