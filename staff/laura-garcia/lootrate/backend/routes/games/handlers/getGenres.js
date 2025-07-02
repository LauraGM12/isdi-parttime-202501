import { getGenres } from '../../../logic/games/getGenres.js'
import { errors } from 'common'

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