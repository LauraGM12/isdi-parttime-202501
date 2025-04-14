import { ExistenceError } from "../../utils/errors"
import getLoggedUserId from "../helpers/getLoggedUserId"

const deletePost = (postId) => {
    const loggedUserId = getLoggedUserId()
    
    let posts = JSON.parse(localStorage.getItem('posts')) || []
    const post = posts.find(p => String(p.id) === String(postId))
    
    if (!post) throw new ExistenceError('Post no encontrado')
    
    posts = posts.filter(p => String(p.id) !== String(postId))
    localStorage.setItem('posts', JSON.stringify(posts))
}

export default deletePost