import { validator } from "common"
import logic from "../../../logic/index.js"

const updateUsername = (req, res, next) => {
    const id = req.userId
    const { username } = req.body

    try {
        validator.id(id)
        validator.username(username)

        return logic.updateUsername(id, username)
            .then(() => res.status(200).send())
            .catch(error => next(error))
    } catch (error) {
        next(error)
    }
}

export default updateUsername