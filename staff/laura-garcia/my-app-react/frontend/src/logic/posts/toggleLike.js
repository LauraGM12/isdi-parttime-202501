import data from "../../data"
import { ExistenceError } from "../../utils/errors"
import validator from "../../utils/validators"
import getLoggedUserId from "../helpers/getLoggedUserId"

const toggleLike = (postId) => {
    const loggedUserId = getLoggedUserId()
    validator.id(loggedUserId)

    const posts = JSON.parse(localStorage.getItem('posts')) || []
    const post = posts.find(post => post.id === postId)
    if (!post) throw new ExistenceError('Publicación no encontrada')

    if (!post.likes) post.likes = []
    if (!post.dislikes) post.dislikes = []

    const dislikeIndex = post.dislikes.indexOf(loggedUserId)
    if (dislikeIndex !== -1) {
        post.dislikes.splice(dislikeIndex, 1)
    }

    const likeIndex = post.likes.indexOf(loggedUserId)
    if (likeIndex !== -1) {
        post.likes.splice(likeIndex, 1)
    } else {
        post.likes.push(loggedUserId)
    }

    const postIndex = posts.findIndex(p => p.id === postId)
    posts[postIndex] = post

    localStorage.setItem('posts', JSON.stringify(posts))
}

const toggleDislike = (postId) => {
    const loggedUserId = getLoggedUserId()
    validator.id(loggedUserId)

    const posts = JSON.parse(localStorage.getItem('posts')) || []
    const post = posts.find(post => post.id === postId)
    if (!post) throw new ExistenceError('Publicación no encontrada')

    if (!post.likes) post.likes = []
    if (!post.dislikes) post.dislikes = []

    const likeIndex = post.likes.indexOf(loggedUserId)
    if (likeIndex !== -1) {
        post.likes.splice(likeIndex, 1)
    }

    const dislikeIndex = post.dislikes.indexOf(loggedUserId)
    if (dislikeIndex !== -1) {
        post.dislikes.splice(dislikeIndex, 1)
    } else {
        post.dislikes.push(loggedUserId)
    }

    const postIndex = posts.findIndex(p => p.id === postId)
    posts[postIndex] = post

    localStorage.setItem('posts', JSON.stringify(posts))
}

const toggleLikeFunctions = {
    toggleLike,
    toggleDislike
}

export default toggleLikeFunctions