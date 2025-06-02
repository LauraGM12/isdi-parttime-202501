import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Comment from './Comment'
import Btn from './lib/Btn'
import logics from '../logic'
import getToken from '../logic/helpers/getToken'
import locales from '../locales'
import './PostItem.css'

const PostItem = ({ post, setRefreshPosts, isMyPostsPage, onEditPost, locale }) => {
    const [translations, setTranslations] = useState(locales[locale]['postItem'])
    
    useEffect(() => {
        setTranslations(locales[locale]['postItem'])
    }, [locale])

    if (!post) {
        return <div className="post-item">{translations.loading}</div>
    }

    const [showComments, setShowComments] = useState(false)
    const [newComment, setNewComment] = useState('')
    const loggedUserId = getToken()
    const isAuthor = post?.author?.id === loggedUserId

    const [isLiked, setIsLiked] = useState(post.likes?.includes(getToken()))
    const [isDisliked, setIsDisliked] = useState(post.dislikes?.includes(getToken()))
    const [isFavorite, setIsFavorite] = useState(post.favorites?.includes(getToken()))

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
            // Implementación alternativa para toggleDislike
            const updatedPost = { ...post };
            const userId = getToken();
            
            // Si ya está en dislikes, lo quitamos
            if (updatedPost.dislikes && updatedPost.dislikes.includes(userId)) {
                updatedPost.dislikes = updatedPost.dislikes.filter(id => id !== userId);
            } else {
                // Si no está, lo añadimos
                if (!updatedPost.dislikes) updatedPost.dislikes = [];
                updatedPost.dislikes.push(userId);
                
                // Si está en likes, lo quitamos de ahí
                if (updatedPost.likes && updatedPost.likes.includes(userId)) {
                    updatedPost.likes = updatedPost.likes.filter(id => id !== userId);
                }
            }
            
            // Actualizamos el post localmente
            const posts = JSON.parse(localStorage.getItem('posts') || '[]');
            const postIndex = posts.findIndex(p => p.id === post.id);
            if (postIndex !== -1) {
                posts[postIndex] = { ...posts[postIndex], dislikes: updatedPost.dislikes, likes: updatedPost.likes };
                localStorage.setItem('posts', JSON.stringify(posts));
            }
            
            setIsDisliked(!isDisliked);
            if (isLiked) setIsLiked(false);
            setRefreshPosts(Date.now());
        } catch (error) {
            console.error(error);
            alert(translations.dislikeError || 'Error al marcar dislike');
        }
    }

    const handleFavorite = () => {
        try {
            // Implementación alternativa para toggleFavorite
            const updatedPost = { ...post };
            const userId = getToken();
            
            // Si ya está en favoritos, lo quitamos
            if (updatedPost.favorites && updatedPost.favorites.includes(userId)) {
                updatedPost.favorites = updatedPost.favorites.filter(id => id !== userId);
            } else {
                // Si no está, lo añadimos
                if (!updatedPost.favorites) updatedPost.favorites = [];
                updatedPost.favorites.push(userId);
            }
            
            // Actualizamos el post localmente
            const posts = JSON.parse(localStorage.getItem('posts') || '[]');
            const postIndex = posts.findIndex(p => p.id === post.id);
            if (postIndex !== -1) {
                posts[postIndex] = { ...posts[postIndex], favorites: updatedPost.favorites };
                localStorage.setItem('posts', JSON.stringify(posts));
            }
            
            setIsFavorite(!isFavorite);
            setRefreshPosts(Date.now());
        } catch (error) {
            console.error(error);
            alert(translations.favoriteError || 'Error al marcar como favorito');
        }
    }

    const handleDelete = () => {
        const confirmDelete = window.confirm(translations.confirmDelete)
        
        if (confirmDelete === true) {
            try {
                logics.posts.deletePost(post.id)
                setRefreshPosts(Date.now())
                alert(translations.deleteSuccess)
            } catch (error) {
                alert(translations.deleteError)
                console.error(error)
            }
        }
    }

    const handleAddComment = (e) => {
        e.preventDefault()
        if (!newComment.trim()) return

        try {
            if (!loggedUserId && loggedUserId !== 0) throw new Error(translations.loginToComment)
            
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
        const confirmDelete = window.confirm(translations.deleteCommentConfirm)
        
        if (confirmDelete) {
            try {
                const postIdString = String(postId)
                logics.comments.deleteComment(postIdString, commentId)
                setRefreshPosts(Date.now())
            } catch (error) {
                alert(translations.deleteCommentError)
                console.error(error)
            }
        }
    }

    const handleUpdateComment = (postId, commentId, newText) => {
        try {
            const postIdString = String(postId)
            logics.comments.updateComment(postIdString, commentId, newText)
            setRefreshPosts(Date.now())
        } catch (error) {
            alert(translations.updateCommentError)
            console.error(error)
        }
    }

    return (
        <div className="post-item">
            <div className="post-item__header">
                <img 
                    src={post?.author?.avatar || 'default-avatar.png'} 
                    alt={post?.author?.username || translations.unknownUser} 
                    className="post-item__avatar"
                />
                <Link to={`/profile/${post?.author?.username || ''}`} className="post-item__username">
                    {post?.author?.username || translations.unknownUser}
                </Link>
                <span className="post-item__date">
                    {new Date(post?.date || Date.now()).toLocaleDateString(locale)}
                    {post?.edited && ` ${translations.edited}`}
                </span>
            </div>

            <h3 className="post-item__title">{post?.title}</h3>
            <p className="post-item__description">{post?.description}</p>
            
            {post?.img && (
                <img 
                    src={post.img} 
                    alt={post?.title || translations.imageAlt} 
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
                    <span>{post.favorites ? post.favorites.length : 0}</span>
                </button>
                
                <button 
                    className="post-item__btn post-item__btn--comment"
                    onClick={() => setShowComments(!showComments)}
                >
                    <i className="bi bi-chat"></i>
                    <span>{post.comments?.length || 0}</span>
                </button>

                {isMyPostsPage && isAuthor && (
                    <>
                        <button 
                            className="post-item__btn post-item__btn--edit"
                            onClick={() => onEditPost(post)}
                        >
                            <i className="bi bi-pencil-fill"></i>
                        </button>
                        
                        <button 
                            className="post-item__btn post-item__btn--delete"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDelete();
                            }}
                        >
                            <i className="bi bi-trash-fill"></i>
                        </button>
                    </>
                )}
            </div>

            {showComments && (
                <div className="post-item__comments">
                    <h4 className="post-item__comments-title">{translations.comments}</h4>
                    
                    {(loggedUserId || loggedUserId === 0) ? (
                        <form className="post-item__comment-form" onSubmit={handleAddComment}>
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder={translations.writeComment}
                                className="post-item__comment-input"
                                required
                            />
                            <button type="submit" className="post-item__comment-submit">
                                {translations.comment}
                            </button>
                        </form>
                    ) : (
                        <p className="post-item__login-message">
                            {translations.loginMessage} <Link to="/login" className="post-item__login-link">{translations.loginLink}</Link> {translations.toComment}
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
                                    locale={locale}
                                />
                            ))
                        ) : (
                            <p className="post-item__no-comments">{translations.noComments}</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default PostItem