import { getPlatforms } from '../../../logic/games/getPlatforms.js'
import { errors } from 'common'

/**
 * Handler para obtener las plataformas disponibles
 * 
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función next de Express
 */
export default (req, res, next) => {
    try {
        getPlatforms()
            .then(data => res.status(200).json(data))
            .catch(error => {
                next(new errors.ServerError(error.message))
            })
    } catch (error) {
        next(new errors.ServerError(error.message))
    }
}