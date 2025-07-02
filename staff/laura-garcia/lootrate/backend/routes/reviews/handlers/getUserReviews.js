import { validator } from 'common'
import { reviews } from '../../../logic/index.js'

const getUserPost = async (req, res, next) => {
    try {
        const { userId } = req.params
        const { page = 1, limit = 10 } = req.query

        validator.validateId(userId, 'userId')
        validator.validateNumber(page, 'page', 1)
        validator.validateNumber(limit, 'limit', 1, 50)

        const result = await reviews.getUserPost(userId, page, limit)

        res.json(result)
    } catch (error) {
        next(error)
    }
}

export { getUserPost }