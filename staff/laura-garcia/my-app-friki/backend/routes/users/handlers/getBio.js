import { validator } from "common"
import logic from "../../../logic/index.js"

const getBio = (req, res, next) => {
    const id = req.userId
    let { userId } = req.params
    if (userId === 'logged') userId = id

    try {
        validator.id(id)
        validator.id(userId)
        return logic.getBio(id, userId)
            .then(bio => { res.status(200).send({ bio }) })
            .catch(error => next(error))
    } catch (error) {
        next(error)
    }

}

export default getBio