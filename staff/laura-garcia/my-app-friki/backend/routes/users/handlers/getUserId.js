import { validator } from "common"
import logic from "../../../logic/index.js"

const getUserId = (req, res, next) => {
    const id = req.userId
    const { username } = req.params

    try {
        validator.id(id)
        return logic.getUserId(id, username)
            .then(id => { res.status(200).send({ id }) })
            .catch(error => next(error))
    } catch (error) {
        next(error)
    }

}

export default getUserId