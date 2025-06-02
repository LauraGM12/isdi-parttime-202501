import { validator } from "common"
import logic from "../../../logic/index.js"

const getUsername = (req, res, next) => {
    const id = req.userId
    let { userId } = req.params
    if (userId === 'logged') userId = id

    try {
        validator.id(id)
        validator.id(userId)
        return logic.getUsername(id, userId)
            .then(username => { res.status(200).send({ username }) })
            .catch(error => next(error))
    } catch (error) {
        next(error)
    }

}

export default getUsername