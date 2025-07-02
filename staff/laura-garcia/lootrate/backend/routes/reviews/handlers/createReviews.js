import { errors, validator } from 'common'
import { reviews } from '../../../logic/index.js'

const createReview = async (req, res, next) => {
    try {
        const { gameId, content, rating } = req.body
        const userId = req.userId

        validator.validateGameId(gameId, 'gameId')
        validator.validateText(content, 'content', 10, 2000)
        validator.validateNumber(rating, 'rating', 0, 10)

        const review = await reviews.createReview(userId, gameId, content, rating)

        res.status(201).json(review)
    } catch (error) {
        next(error)
    }
}

export { createReview }