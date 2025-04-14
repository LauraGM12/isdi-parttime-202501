import { useState, useEffect } from 'react'
import logics from '../logic'
import './VoteButtons.css'

const VoteButtons = ({ postId }) => {
    const [likes, setLikes] = useState([])
    const [hasUserLiked, setHasUserLiked] = useState(false)

    useEffect(() => {
        const post = logics.posts.getPostById(postId)
        if (post?.likes) {
            setLikes(post.likes)
            setHasUserLiked(post.likes.includes(logics.users.getLoggedUserId()))
        }
    }, [postId])

    const handleLike = () => {
        try {
            logics.posts.toggleLike(postId)
            const post = logics.posts.getPostById(postId)
            setLikes(post.likes)
            setHasUserLiked(!hasUserLiked)
        } catch (error) {
            console.error(error)
            alert('Error al dar like')
        }
    }

    return (
        <div className="vote-buttons">
            <button 
                className={`vote-button ${hasUserLiked ? 'active' : ''}`}
                onClick={handleLike}
            >
                <i className="bi bi-heart-fill"></i>
                <span>{likes.length}</span>
            </button>
        </div>
    )
}

export default VoteButtons