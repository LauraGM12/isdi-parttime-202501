import { ExistenceError } from "../../utils/errors"
import validator from "../../utils/validators"
import getLoggedUserId from "../helpers/getLoggedUserId"

const updatePost = (postId, title, description, image = null) => {
    validator.string(postId, 'postId')
    validator.string(title, 'title')
    validator.string(description, 'description')
    if (image) validator.string(image, 'image')

    const posts = JSON.parse(localStorage.getItem('posts')) || []
    const post = posts.find(post => post.id.toString() === postId)

    if (!post) throw new ExistenceError('Publicación no encontrada')
    
    if (post.author.id !== getLoggedUserId())
        throw new Error('No eres el autor de esta publicación')

    post.title = title
    post.description = description
    if (image) post.image = image

    localStorage.setItem('posts', JSON.stringify(posts))
}

export default updatePost