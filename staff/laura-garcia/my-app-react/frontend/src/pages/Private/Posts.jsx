import { useEffect, useState } from "react"
import logics from "../../logic"
import PostList from "../../components/PostList"
import './Posts.css'

const Posts = () => {
    const [posts, setPosts] = useState([])
    const [refreshPosts, setRefreshPosts] = useState(Date.now())
    const [searchTerm, setSearchTerm] = useState('')

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
            alert('¡Ups! Algo salió mal al cargar los posts')
            console.error(error)
        }
    }, [refreshPosts, searchTerm])

    return (
        <div className="posts">
            <div className="posts__header">
                <h1 className="posts__title">Publicaciones de la comunidad</h1>
                <p className="posts__description">Descubre lo que otros usuarios están compartiendo</p>
                <input
                    type="text"
                    placeholder="Buscar publicaciones..."
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
            />
        </div>
    )
}

export default Posts