import { useState, useEffect } from "react"
import logics from "../logic"
import Post from "./Post"
import "./PostList.css"
import PostItem from './PostItem'

const PostList = ({ posts, setRefreshPosts, isMyPostsPage, onEditPost }) => {
    if (!posts) {
        return <div>Cargando posts...</div>
    }

    return (
        <div className="post-list">
            {posts.length > 0 ? (
                posts.map(post => (
                    <PostItem
                        key={post.id}
                        post={post}
                        setRefreshPosts={setRefreshPosts}
                        isMyPostsPage={isMyPostsPage}
                        onEditPost={onEditPost}
                    />
                ))
            ) : (
                <p>No hay publicaciones para mostrar.</p>
            )}
        </div>
    )
}

export default PostList