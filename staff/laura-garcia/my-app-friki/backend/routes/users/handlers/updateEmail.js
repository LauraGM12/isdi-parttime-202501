import { validator } from "common"
import logic from "../../../logic/index.js"

const updateEmail = (req, res, next) => {
    const id = req.userId
    const { email } = req.body

    try {
        validator.id(id)
        validator.email(email)

        return logic.updateEmail(id, email)
            .then(() => res.status(200).send())
            .catch(error => next(error))
    } catch (error) {
        next(error)
    }
}

export default updateEmail