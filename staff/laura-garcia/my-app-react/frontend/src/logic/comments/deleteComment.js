import validator from "../../utils/validators"
import { ExistenceError } from "../../utils/errors"

const deleteComment = (postId, commentId) => {
    validator.text(postId, 50, 1, 'Post ID')
    
    const commentIdNum = Number(commentId)
    
    const posts = JSON.parse(localStorage.getItem('posts')) || []
    const post = posts.find(post => post.id === Number(postId))
    
    if (!post) throw new ExistenceError('Publicación no encontrada')
    if (!post.comments) throw new ExistenceError('No se encontraron comentarios')
    
    const commentIndex = post.comments.findIndex(comment => comment.id === commentIdNum)
    
    if (commentIndex < 0) throw new ExistenceError('Comentario no encontrado')
    
    post.comments.splice(commentIndex, 1)
    
    localStorage.setItem('posts', JSON.stringify(posts))
}

export default deleteComment