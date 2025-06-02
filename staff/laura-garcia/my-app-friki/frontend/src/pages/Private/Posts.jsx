import { useEffect, useRef, useState } from "react"
import PostList from "../../components/PostList"
import Btn from "../../components/lib/Btn"
import CreatePostModal from "../../components/CreatePostModal"
import logics from "../../logic"
import './Posts.css'
import useCustomContext from "../../hooks/useCustomContext"


    const Posts = ({ locale }) => {
        const [refreshPosts, setRefreshPosts] = useState(Date.now())
        const [showNewPostForm, setShowNewPostForm] = useState(false)
        const [posts, setPosts] = useState([])
        const dialogRef = useRef(null)
        const pageRef = useRef(null)
        const formRef = useRef(null)
    
        const { alert } = useCustomContext()
    
        useEffect(() => {
            try {
                logics.posts.getAllPosts().then(retrivedPosts => setPosts(retrivedPosts))
                    .catch(error => {
                        alert('ups, something is not working!')
                        setPosts([])
                        alert(error)
                    })
            } catch (error) {
                alert('ups, something is not working!')
                alert(error)
            }
        }, [refreshPosts])
    
        const handleOutsideModalClick = (event) => {
            if (!formRef.current.contains(event.target)) {
                setShowNewPostForm(false)
            }
        }
    
        useEffect(() => {
            if (pageRef.current && showNewPostForm) pageRef.current.addEventListener("click", (event) => handleOutsideModalClick(event))
    
            if ((dialogRef.current && dialogRef.current.open) && !showNewPostForm) {
                dialogRef.current.close()
            } else if (!(dialogRef.current && dialogRef.current.open) && showNewPostForm) {
                dialogRef.current.showModal()
            }
    
            return () => {
                if (pageRef.current) pageRef.current.removeEventListener("click", handleOutsideModalClick);
            };
        }, [showNewPostForm, refreshPosts])

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