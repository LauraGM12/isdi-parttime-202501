import { errors, validator } from 'common'
import { reviews } from '../../../logic/index.js'

const { NotFoundError } = errors

const toggleLike = async (req, res, next) => {
    try {
        const { reviewId } = req.params
        const userId = req.userId

        validator.validateId(reviewId, 'reviewId')

        const result = await reviews.toggleLike(reviewId, userId)
        res.json(result)
    } catch (error) {
        next(error)
    }
}

const toggleHelpful = async (req, res, next) => {
    try {
        const { reviewId } = req.params
        const userId = req.userId

        validator.validateId(reviewId, 'reviewId')

        const result = await reviews.toggleHelpful(reviewId, userId)
        res.json(result)
    } catch (error) {
        next(error)
    }
}

export {
    toggleLike,
    toggleHelpful
}