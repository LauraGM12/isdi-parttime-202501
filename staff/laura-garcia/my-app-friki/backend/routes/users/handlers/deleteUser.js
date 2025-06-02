import { validator } from "common"
import logic from "../../../logic/index.js"

const deleteUser = (req, res, next) => {
    const id = req.userId
    const { password } = req.body

    try {
        validator.id(id)
        validator.password(password)

        return logic.deleteUser(id, password)
            .then(() => res.status(200).send())
            .catch(error => next(error))
    } catch (error) {
        next(error)
    }
}

export default deleteUser