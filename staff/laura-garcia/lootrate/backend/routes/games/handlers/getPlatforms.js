import { getPlatforms } from '../../../logic/games/getPlatforms.js'
import { errors } from 'common'

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