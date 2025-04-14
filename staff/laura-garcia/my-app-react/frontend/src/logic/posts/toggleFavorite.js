import data from "../../data"
import { ExistenceError } from "../../utils/errors"
import validator from "../../utils/validators"
import getLoggedUserId from "../helpers/getLoggedUserId"

const toggleFavorite = (postId) => {
    const loggedUserId = getLoggedUserId()
    validator.id(loggedUserId)

    const post = data.posts.findPostById(postId)
    if (!post) throw new ExistenceError('Publicación no encontrada')

    if (!post.favorites) post.favorites = []

    const favoriteIndex = post.favorites.indexOf(loggedUserId)
    if (favoriteIndex !== -1) {
        post.favorites.splice(favoriteIndex, 1)
    } else {
        post.favorites.push(loggedUserId)
    }

    data.posts.updatePostById(postId, post)
}

export default toggleFavorite