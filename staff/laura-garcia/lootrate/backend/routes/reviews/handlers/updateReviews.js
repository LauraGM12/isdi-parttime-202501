import { validator } from 'common'
import { reviews } from '../../../logic/index.js'

const updateReview = async (req, res, next) => {
    try {
        const { reviewId } = req.params
        const { content, rating } = req.body
        const userId = req.userId

        validator.validateId(reviewId, 'reviewId')
        if (content !== undefined) validator.validateText(content, 'content', 10, 2000)
        if (rating !== undefined) validator.validateNumber(rating, 'rating', 0, 10)

        const review = await reviews.updateReview(reviewId, userId, { content, rating })

        res.json(review)
    } catch (error) {
        next(error)
    }
}

export { updateReview }