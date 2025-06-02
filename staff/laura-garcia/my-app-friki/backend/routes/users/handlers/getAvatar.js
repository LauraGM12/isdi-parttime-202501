import { validator } from "common"
import logic from "../../../logic/index.js"

const getAvatar = (req, res, next) => {
    const id = req.userId
    let { userId } = req.params
    if (userId === 'logged') userId = id

    try {
        validator.id(id)
        validator.id(userId)
        return logic.getAvatar(id, userId)
            .then(avatar => { res.status(200).send({ avatar }) })
            .catch(error => next(error))
    } catch (error) {
        next(error)
    }
}

export default getAvatar