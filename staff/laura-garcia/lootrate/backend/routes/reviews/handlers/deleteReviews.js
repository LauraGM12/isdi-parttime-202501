import { validator } from 'common'
import { reviews } from '../../../logic/index.js'

const deleteReview = async (req, res, next) => {
    try {
        const { reviewId } = req.params
        const userId = req.userId

        validator.validateId(reviewId, 'reviewId')

        await reviews.deleteReview(reviewId, userId)
        
        res.status(204).send()
    } catch (error) {
        next(error)
    }
}

export { deleteReview }