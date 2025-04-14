import validator from "../../utils/validators"
import { ExistenceError } from "../../utils/errors"
import getLoggedUserId from "../helpers/getLoggedUserId"

const addComment = (postId, text) => {
    validator.text(postId, 50, 1, 'Post ID')
    validator.text(text, 500, 1, 'Comment text')

    const userId = getLoggedUserId()
    if (userId === null) throw new Error('Debes iniciar sesión para comentar')

    const users = JSON.parse(localStorage.getItem('users')) || []
    const currentUser = users.find(user => user.id === userId)
    
    if (!currentUser) throw new Error('Usuario no encontrado')

    const posts = JSON.parse(localStorage.getItem('posts')) || []
    const post = posts.find(post => post.id === Number(postId))

    if (!post) throw new ExistenceError('Publicación no encontrada')

    if (!post.comments) post.comments = []

    const comment = {
        id: Date.now(),
        text,
        author: {
            id: userId,
            username: currentUser.username,
            avatar: currentUser.avatar || 'default-avatar.png'
        },
        date: new Date().toISOString()
    }

    post.comments.push(comment)
    localStorage.setItem('posts', JSON.stringify(posts))
}

export default addComment