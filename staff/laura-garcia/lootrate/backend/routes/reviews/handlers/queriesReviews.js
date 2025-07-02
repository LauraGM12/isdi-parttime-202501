import { errors, validator } from 'common'
import { reviews } from '../../../logic/index.js'

const getUserReviews = async (req, res, next) => {
    try {
        const { userId } = req.params
        const { page = 1, limit = 10 } = req.query

        validator.validateId(userId, 'userId')
        validator.validateNumber(parseInt(page), 'page', 1)
        validator.validateNumber(parseInt(limit), 'limit', 1, 50)

        const result = await reviews.getUserReviews(userId, parseInt(page), parseInt(limit))

        res.json(result)
    } catch (error) {
        next(error)
    }
}

const getGameReviews = async (req, res, next) => {
    try {
        const { gameId } = req.params
        const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query

        validator.validateGameId(gameId, 'gameId')
        validator.validateNumber(parseInt(page), 'page', 1)
        validator.validateNumber(parseInt(limit), 'limit', 1, 50)
        
        const validSortOptions = ['createdAt', 'rating', 'helpful']
        if (!validSortOptions.includes(sortBy)) {
            throw new errors.ValidationError('sortBy debe ser uno de: ' + validSortOptions.join(', '))
        }

        const result = await reviews.getGameReviews(gameId, parseInt(page), parseInt(limit), sortBy)

        res.json(result)
    } catch (error) {
        next(error)
    }
}

const getMyReviews = async (req, res, next) => {
    try {
        const userId = req.userId 
        const { page = 1, limit = 10 } = req.query

        validator.validateNumber(parseInt(page), 'page', 1)
        validator.validateNumber(parseInt(limit), 'limit', 1, 50)

        const result = await reviews.getMyReviews(userId, parseInt(page), parseInt(limit))

        res.json(result)
    } catch (error) {
        next(error)
    }
}

export {
    getUserReviews,
    getGameReviews,
    getMyReviews
}