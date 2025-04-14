import { useState } from 'react'
import { Link } from 'react-router-dom'
import Comment from './Comment'
import Btn from './lib/Btn'
import logics from '../logic'
import getLoggedUserId from '../logic/helpers/getLoggedUserId'
import './PostItem.css'

const PostItem = ({ post, setRefreshPosts, isMyPostsPage, onEditPost }) => {
    if (!post) {
        return <div className="post-item">Cargando...</div>
    }

    const [showComments, setShowComments] = useState(false)
    const [newComment, setNewComment] = useState('')
    const loggedUserId = getLoggedUserId()
    const isAuthor = post?.author?.id === loggedUserId

    const [isLiked, setIsLiked] = useState(post.likes?.includes(getLoggedUserId()))
    const [isDisliked, setIsDisliked] = useState(post.dislikes?.includes(getLoggedUserId()))
    const [isFavorite, setIsFavorite] = useState(post.favorites?.includes(getLoggedUserId()))

    const handleLike = () => {
        try {
            logics.posts.toggleLike(post.id)
            setIsLiked(!isLiked)
            if (isDisliked) setIsDisliked(false)
            setRefreshPosts(Date.now())
        } catch (error) {
            console.error(error)
        }
    }

    const handleDislike = () => {
        try {
            logics.posts.toggleDislike(post.id)
            setIsDisliked(!isDisliked)
            if (isLiked) setIsLiked(false)
            setRefreshPosts(Date.now())
        } catch (error) {
            console.error(error)
        }
    }

    const handleDelete = () => {
        const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar esta publicación? Esta acción no se puede deshacer.')
        
        if (confirmDelete === true) {
            try {
                logics.posts.deletePost(post.id)
                setRefreshPosts(Date.now())
                alert('Publicación eliminada correctamente')
            } catch (error) {
                alert('No se pudo eliminar la publicación. Por favor, inténtalo de nuevo.')
                console.error(error)
            }
        }
    }

    const handleAddComment = (e) => {
        e.preventDefault()
        if (!newComment.trim()) return

        try {
            if (!loggedUserId && loggedUserId !== 0) throw new Error('Debes iniciar sesión para comentar')
            
            const postIdString = String(post.id)
            logics.comments.addComment(postIdString, newComment)
            setNewComment('')
            setRefreshPosts(Date.now())
        } catch (error) {
            alert(error.message)
            console.error(error)
        }
    }

    const handleDeleteComment = (postId, commentId) => {
        const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este comentario? Esta acción no se puede deshacer.');
        
        if (confirmDelete) {
            try {
                const postIdString = String(postId);
                logics.comments.deleteComment(postIdString, commentId)
                setRefreshPosts(Date.now())
            } catch (error) {
                alert('Error al eliminar el comentario')
                console.error(error)
            }
        }
    }

    const handleUpdateComment = (postId, commentId, newText) => {
        try {
            const postIdString = String(postId);
            logics.comments.updateComment(postIdString, commentId, newText)
            setRefreshPosts(Date.now())
        } catch (error) {
            alert('Error al actualizar el comentario')
            console.error(error)
        }
    }

    const handleFavorite = () => {
        try {
            logics.posts.toggleFavorite(post.id)
            setIsFavorite(!isFavorite)
            setRefreshPosts(Date.now())
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="post-item">
            <div className="post-item__header">
                <img 
                    src={post?.author?.avatar || 'default-avatar.png'} 
                    alt={post?.author?.username || 'Usuario'} 
                    className="post-item__avatar"
                />
                <Link to={`/profile/${post?.author?.username || ''}`} className="post-item__username">
                    {post?.author?.username || 'Usuario desconocido'}
                </Link>
                <span className="post-item__date">
                    {new Date(post?.date || Date.now()).toLocaleDateString()}
                    {post?.edited && ' (editado)'}
                </span>
            </div>

            <h3 className="post-item__title">{post?.title}</h3>
            <p className="post-item__description">{post?.description}</p>
            
            {post?.image && (
                <img 
                    src={post.image} 
                    alt={post?.title || 'Imagen del post'} 
                    className="post-item__image"
                />
            )}

            <div className="post-item__actions">
                <button 
                    className={`post-item__btn post-item__btn--like ${isLiked ? 'active' : ''}`}
                    onClick={handleLike}
                >
                    <i className={`bi bi-hand-thumbs-up${isLiked ? '-fill' : ''}`}></i>
                    <span>{post.likes ? post.likes.length : 0}</span>
                </button>

                <button 
                    className={`post-item__btn post-item__btn--dislike ${isDisliked ? 'active' : ''}`}
                    onClick={handleDislike}
                >
                    <i className={`bi bi-hand-thumbs-down${isDisliked ? '-fill' : ''}`}></i>
                    <span>{post.dislikes ? post.dislikes.length : 0}</span>
                </button>

                <button 
                    className={`post-item__btn post-item__btn--favorite ${isFavorite ? 'active' : ''}`}
                    onClick={handleFavorite}
                >
                    <i className={`bi bi-heart${isFavorite ? '-fill' : ''}`}></i>
                </button>
                
                <Btn 
                    btnClassnames="post-item__btn post-item__btn--comment"
                    btnContent={
                        <>
                            <i className="bi bi-chat"></i>
                            <span>{post.comments?.length || 0}</span>
                        </>
                    }
                    btnCallback={() => setShowComments(!showComments)}
                />

                {isMyPostsPage && isAuthor && (
                    <>
                        <Btn 
                            btnClassnames="post-item__btn post-item__btn--edit"
                            btnContent={<i className="bi bi-pencil-fill"></i>}
                            btnCallback={() => onEditPost(post)}
                        />
                        
                        <Btn 
                            btnClassnames="post-item__btn post-item__btn--delete"
                            btnContent={<i className="bi bi-trash-fill"></i>}
                            btnCallback={(e) => {
                                e.stopPropagation()
                                handleDelete()
                            }}
                        />
                    </>
                )}
            </div>

            {showComments && (
                <div className="post-item__comments">
                    <h4 className="post-item__comments-title">Comentarios</h4>
                    
                    {(loggedUserId || loggedUserId === 0) ? (
                        <form className="post-item__comment-form" onSubmit={handleAddComment}>
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Escribe un comentario..."
                                className="post-item__comment-input"
                                required
                            />
                            <button type="submit" className="post-item__comment-submit">
                                Comentar
                            </button>
                        </form>
                    ) : (
                        <p className="post-item__login-message">
                            Debes <Link to="/login" className="post-item__login-link">iniciar sesión</Link> para comentar
                        </p>
                    )}
                    
                    <div className="post-item__comments-list">
                        {post.comments && post.comments.length > 0 ? (
                            post.comments.map(comment => (
                                <Comment
                                    key={comment.id}
                                    comment={comment}
                                    postId={post.id}
                                    onDelete={handleDeleteComment}
                                    onUpdate={handleUpdateComment}
                                />
                            ))
                        ) : (
                            <p className="post-item__no-comments">No hay comentarios aún.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default PostItem