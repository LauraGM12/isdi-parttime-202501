import { validator } from "common"
import logic from "../../../logic/index.js"

const toggleLike = (req, res, next) => {
    const { postId } = req.params
    const userId = req.userId

    try {
        validator.id(postId)
        validator.id(userId)

        logic.toggleLike(postId, userId)
            .then(() => res.status(200).send())
            .catch((error) => next(error))

    } catch (error) {
        next(error)
    }
}

export default toggleLike