import { useEffect, useState } from "react"
import logics from "../../logic"
import PostList from "../../components/PostList"
import locales from "../../locales"
import './Posts.css'

const Posts = ({ locale }) => {
    const [translations, setTranslations] = useState(locales[locale]['posts'])
    const [posts, setPosts] = useState([])
    const [refreshPosts, setRefreshPosts] = useState(Date.now())
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        setTranslations(locales[locale]['posts'])
    }, [locale])

    useEffect(() => {
        try {
            const retrievedPosts = logics.posts.getAllPosts()
            const filteredPosts = searchTerm
                ? retrievedPosts.filter(post => 
                    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    post.description.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                : retrievedPosts
            setPosts(filteredPosts)
        } catch (error) {
            alert(translations.error)
            console.error(error)
        }
    }, [refreshPosts, searchTerm])

    return (
        <div className="posts">
            <div className="posts__header">
                <h1 className="posts__title">{translations.title}</h1>
                <p className="posts__description">{translations.description}</p>
                <input
                    type="text"
                    placeholder={translations.searchPlaceholder}
                    className="posts__search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            <PostList 
                posts={posts} 
                setRefreshPosts={setRefreshPosts}
                isMyPostsPage={false}
                onEditPost={() => {}}
                locale={locale}
            />
        </div>
    )
}

export default Posts