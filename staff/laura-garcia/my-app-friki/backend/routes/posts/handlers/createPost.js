import { validator } from "common"
import logic from "../../../logic/index.js"

const createPost = (req, res, next) => {
    const { title, img, description } = req.body
    const authorId = req.userId

    try {
        validator.id(authorId)
        validator.text(title, 40, 1, 'Post-Title')
        validator.text(description, 210, 1, 'Post-Description')
        //validar imagen con url y base64

        logic.createPost(authorId, title, description, img)
            .then(() => res.status(201).send())
            .catch((error) => next(error))

    } catch (error) {
        next(error)
    }
}

export default createPost