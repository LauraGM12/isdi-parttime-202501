import { validator } from "common"
import logic from "../../../logic/index.js"

const registerUser = (req, res, next) => {
    const { email, password } = req.body

    try {
        validator.email(email)
        validator.password(password)

        const username = email.split('@')[0]
        validator.username(username)

        return logic.registerUser(email, password, username)
            .then(() => res.status(201).send())
            .catch(error => next(error))

    } catch (error) {
        next(error)
    }
}

export default registerUser