import { validator } from "common"
import logic from "../../../logic/index.js"

const updateAvatar = (req, res, next) => {
    const id = req.userId
    const { avatar } = req.body

    try {
        validator.id(id)

        return logic.updateAvatar(id, avatar)
            .then(() => res.status(200).send())
            .catch(error => next(error))
    } catch (error) {
        next(error)
    }
}

export default updateAvatar