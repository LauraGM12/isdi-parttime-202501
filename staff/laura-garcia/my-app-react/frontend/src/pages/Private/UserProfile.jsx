import './UserProfile.css'
import { useEffect, useState } from "react"
import UserCard from "../../components/UserCard"
import PostList from "../../components/PostList"
import logics from "../../logic"
import { useParams } from "react-router"
import { ExistenceError } from "../../utils/errors"
import NotFound from "../NotFound"

const UserProfile = () => {
    const [posts, setPosts] = useState()
    const [userId, setUserId] = useState()
    const [refreshPosts, setRefreshPosts] = useState(Date.now())
    const { username } = useParams()

    useEffect(() => {
        try {
            const retrivedId = logics.users.getUserIdByUsername(username)
            setUserId(retrivedId)
            const retrivedPosts = logics.posts.getPostsByAuthor(retrivedId)
            setPosts(retrivedPosts)
        } catch (error) {
            if (error instanceof ExistenceError) {
                setUserId('not-found')
            } else {
                alert('¡Ups! Algo no está funcionando correctamente')
                console.error(error)
            }
        }
    }, [refreshPosts])

    return <>
        {
            userId === 'not-found' ? <NotFound />
                :
                <div className="perfil-usuario">
                    <div className="perfil-usuario__contenido">
                        {userId && <UserCard userId={userId} />}
                        {posts && 
                            <div className="perfil-usuario__publicaciones">
                                <PostList 
                                    posts={posts} 
                                    setRefreshPosts={setRefreshPosts} 
                                    handleNavigateToUserProfile={setRefreshPosts} 
                                />
                            </div>
                        }
                    </div>
                </div>
        }
    </>
}

export default UserProfile