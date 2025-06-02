import { validator } from "common"
import logic from "../../../logic/index.js"

const getAllPosts = (req, res, next) => {
    const id = req.userId

    try {
        validator.id(id)

        logic.getAllPosts(id)
            .then((posts) => res.status(200).send(JSON.stringify({ posts })))
            .catch(error => next(error))
    } catch (error) {
        next(error)
    }
}

export default getAllPosts