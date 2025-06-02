import { validator } from "common"
import logic from "../../../logic/index.js"

const toggleFollow = (req, res, next) => {
    const userIdToFollow = req.params.userId
    const userIdLogged = req.userId

    try {
        validator.id(userIdToFollow)
        validator.id(userIdLogged)

        logic.toggleFollow(userIdToFollow, userIdLogged)
            .then(() => res.status(200).send())
            .catch((error) => next(error))

    } catch (error) {
        next(error)
    }
}

export default toggleFollow