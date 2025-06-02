import { validator } from "common"
import logic from "../../../logic/index.js"

const updatePassword = (req, res, next) => {
    const id = req.userId
    const { 'new-password': newPassword, 'old-password': oldPassword } = req.body

    try {
        validator.id(id)
        validator.password(newPassword)
        validator.password(oldPassword)

        return logic.updatePassword(id, newPassword, oldPassword)
            .then(() => res.status(200).send())
            .catch(error => next(error))
    } catch (error) {
        next(error)
    }
}

export default updatePassword