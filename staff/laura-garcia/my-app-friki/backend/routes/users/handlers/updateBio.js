import { validator } from "common"
import logic from "../../../logic/index.js"

const updateBio = (req, res, next) => {
    const id = req.userId
    const { bio } = req.body

    try {
        validator.id(id)
        validator.text(bio, 200, 0, 'bio')

        return logic.updateBio(id, bio)
            .then(() => res.status(200).send())
            .catch(error => next(error))
    } catch (error) {
        next(error)
    }
}

export default updateBio