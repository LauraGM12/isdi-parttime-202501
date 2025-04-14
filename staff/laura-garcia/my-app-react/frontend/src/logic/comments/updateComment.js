import validator from "../../utils/validators"
import { ExistenceError } from "../../utils/errors"

const updateComment = (postId, commentId, text) => {
    validator.text(postId, 50, 1, 'Post ID')
    validator.text(text, 500, 1, 'Comment text')
    
    const commentIdNum = Number(commentId)
    
    const posts = JSON.parse(localStorage.getItem('posts')) || []
    const post = posts.find(post => post.id === Number(postId))
    
    if (!post) throw new ExistenceError('Publicación no encontrada')
    if (!post.comments) throw new ExistenceError('No se encontraron comentarios')
    
    const comment = post.comments.find(comment => comment.id === commentIdNum)
    
    if (!comment) throw new ExistenceError('Comentario no encontrado')
    
    comment.text = text
    comment.edited = true
    
    localStorage.setItem('posts', JSON.stringify(posts))
}

export default updateComment