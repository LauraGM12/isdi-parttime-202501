import { useState, useEffect } from "react"
import logics from "../logic"
import Post from "./Post"
import locales from "../locales"
import "./PostList.css"
import PostItem from './PostItem'

const PostList = ({ posts, setRefreshPosts, isMyPostsPage, onEditPost, locale }) => {
    const [translations, setTranslations] = useState(locales[locale]['postList'])

    useEffect(() => {
        setTranslations(locales[locale]['postList'])
    }, [locale])

    if (!posts) {
        return <div>{translations.loading}</div>
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
                        locale={locale}
                    />
                ))
            ) : (
                <p>{translations.noPosts}</p>
            )}
        </div>
    )
}

export default PostList