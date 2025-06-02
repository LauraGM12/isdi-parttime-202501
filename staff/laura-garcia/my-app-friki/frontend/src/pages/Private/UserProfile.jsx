import './UserProfile.css'
import { useEffect, useState } from "react"
import UserCard from "../../components/UserCard"
import PostList from "../../components/PostList"
import logics from "../../logic"
import { useParams } from "react-router"
import NotFound from "../NotFound"
import locales from "../../locales"

const UserProfile = ({ locale }) => {
    const [translations, setTranslations] = useState(locales[locale]['userProfile'])
    const [posts, setPosts] = useState()
    const [userId, setUserId] = useState()
    const [refreshPosts, setRefreshPosts] = useState(Date.now())
    const { username } = useParams()

    useEffect(() => {
        setTranslations(locales[locale]['userProfile'])
    }, [locale])

    useEffect(() => {
        try {
            const retrivedId = logics.users.getUserIdByUsername(username)
            setUserId(retrivedId)
            const retrivedPosts = logics.posts.getPostsByAuthor(retrivedId)
            setPosts(retrivedPosts)
        } catch (error) {
            if (error.name === 'ExistenceError') {
                setUserId('not-found')
            } else {
                alert(translations.error)
                console.error(error)
            }
        }
    }, [refreshPosts])

    return <>
        {
            userId === 'not-found' ? <NotFound locale={locale} />
                :
                <div className="perfil-usuario">
                    <div className="perfil-usuario__contenido">
                        {userId && <UserCard userId={userId} locale={locale} />}
                        {posts && 
                            <div className="perfil-usuario__publicaciones">
                                <PostList 
                                    posts={posts} 
                                    setRefreshPosts={setRefreshPosts} 
                                    handleNavigateToUserProfile={setRefreshPosts}
                                    locale={locale} 
                                />
                            </div>
                        }
                    </div>
                </div>
        }
    </>
}

export default UserProfile