import { Link } from "react-router-dom"
import Btn from "./lib/Btn"
import logics from "../logic"
import getLoggedUserId from "../logic/helpers/getLoggedUserId"
import toggles from "../logic/posts/toggleLike"
import "./Post.css"

const ThumbsIcon = () => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 20h2c0.55 0 1-0.45 1-1v-9c0-0.55-0.45-1-1-1H2v11zm19.83-7.12c0.11-0.25 0.17-0.52 0.17-0.8V11c0-1.1-0.9-2-2-2h-5.5l0.92-4.65c0.05-0.22 0.02-0.46-0.08-0.66-0.23-0.45-0.52-0.86-0.88-1.22L14 2 7.59 8.41C7.21 8.79 7 9.3 7 9.83v7.84C7 18.95 8.05 20 9.34 20h8.11c0.7 0 1.36-0.37 1.72-0.97l2.66-6.15z"/>
    </svg>
)

const HeartIcon = () => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
)

const TrashIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
    </svg>
)

const EditIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
    </svg>
)

const Post = ({ postData, setRefreshPosts, isMyPostsPage, onEditPost = () => {} }) => {
    const handleDeletePost = (postId) => {
        try {
            if (!postId) return
            logics.posts.deletePost(postId.toString())
            setRefreshPosts(Date.now())
        } catch (error) {
            if (error.name === 'ExistenceError') {
                setRefreshPosts(Date.now())
            } else {
                alert('¡Ups! Algo salió mal al eliminar el post')
                console.error(error)
            }
        }
    }

    const handleLike = () => {
        try {
            toggles.toggleLike(postData.id)
            setRefreshPosts(Date.now())
        } catch (error) {
            alert('Error al dar like')
            console.error(error)
        }
    }

    const handleDislike = () => {
        try {
            toggles.toggleDislike(postData.id)
            setRefreshPosts(Date.now())
        } catch (error) {
            alert('Error al dar dislike')
            console.error(error)
        }
    }

    const handleFavorite = () => {
        try {
            logics.posts.toggleFavorite(postData.id)
            setRefreshPosts(Date.now())
        } catch (error) {
            alert('Error al marcar como favorito')
            console.error(error)
        }
    }

    return (
        <article className="post">
            <div className="post__header">
                <div className="post__author-container">
                    <img 
                        src={postData.author.avatar || 'default-avatar.png'} 
                        alt={postData.author.username} 
                        className="post__author-avatar"
                    />
                    <Link to={`/profile/${postData.author.username}`} className="post__author">
                        {postData.author.username}
                    </Link>
                </div>
                {isMyPostsPage && (
                    <div className="post__header-actions">
                        <Btn
                            btnClassnames="post__edit-button"
                            btnContent={<EditIcon />}
                            btnCallback={() => onEditPost(postData)}
                        />
                        <Btn
                            btnClassnames="post__delete-button"
                            btnContent={<TrashIcon />}
                            btnCallback={() => handleDeletePost(postData.id)}
                        />
                    </div>
                )}
            </div>
            <h2 className="post__title">{postData.title}</h2>
            <p className="post__description">{postData.description}</p>
            {postData.img && (
                <img className="post__image" src={postData.img} alt={postData.title} />
            )}
            <div className="post__actions">
                <Btn 
                    btnClassnames={`post__like-button ${postData.likes?.includes(getLoggedUserId()) ? 'active' : ''}`}
                    btnContent={<>
                        <ThumbsIcon />
                        <span>{postData.likes?.length || 0}</span>
                    </>}
                    btnCallback={handleLike}
                />
                <Btn 
                    btnClassnames={`post__dislike-button ${postData.dislikes?.includes(getLoggedUserId()) ? 'active' : ''}`}
                    btnContent={<>
                        <ThumbsIcon />
                        <span>{postData.dislikes?.length || 0}</span>
                    </>}
                    btnCallback={handleDislike}
                />
                <Btn 
                    btnClassnames={`post__favorite-button ${postData.favorites?.includes(getLoggedUserId()) ? 'active' : ''}`}
                    btnContent={<>
                        <HeartIcon />
                        <span>{postData.favorites?.length || 0}</span>
                    </>}
                    btnCallback={handleFavorite}
                />
            </div>
        </article>
    )
}

export default Post