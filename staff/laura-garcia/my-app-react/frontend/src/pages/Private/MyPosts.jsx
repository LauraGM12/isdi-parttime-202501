import { useEffect, useState } from "react"
import logics from "../../logic"
import getLoggedUserId from "../../logic/helpers/getLoggedUserId"
import PostList from "../../components/PostList"
import Form from "../../components/lib/Form"
import Btn from "../../components/lib/Btn"
import './MyPosts.css'

const MyPosts = () => {
    const [posts, setPosts] = useState([])
    const [refreshPosts, setRefreshPosts] = useState(Date.now())
    const [tempImg, setTempImg] = useState()
    const [isLocalImage, setIsLocalImage] = useState()
    const [editingPost, setEditingPost] = useState(null)

    const titleInput = { label: 'Título del post', inputType: 'text', inputPlaceholder: 'Escribe un título...', inputId: 'title', isRequired: true }
    const descriptionInput = { label: 'Descripción', inputType: 'text', inputPlaceholder: 'Escribe una descripción...', inputId: 'description', isRequired: true }
    const imgFileInput = { label: 'Cargar imagen', inputType: 'file', inputPlaceholder: '', inputId: 'img-64', isRequired: false }
    const imgInput = { label: 'O usa una URL de imagen', inputType: 'url', inputPlaceholder: '.png, .jpg, etc', inputId: 'img-url', isRequired: false }

    useEffect(() => {
        try {
            const retrievedPosts = logics.posts.getPostsByAuthor(getLoggedUserId())
            setPosts(retrievedPosts || [])
        } catch (error) {
            console.error(error)
            setPosts([])
            alert('¡Ups! Algo salió mal al cargar los posts')
        }
    }, [refreshPosts])

    useEffect(() => {
        try {
            const retrivedPosts = logics.posts.getPostsByAuthor(getLoggedUserId())
            setPosts(retrivedPosts)
        } catch (error) {
            alert('¡Ups! Algo salió mal')
            console.error(error)
        }
    }, [refreshPosts])

    const handlePublishPost = (formData) => {
        try {
            if (isLocalImage) {
                const img = formData['img-64']
                const image = new FileReader();
                image.onload = () => {
                    const base64 = image.result;
                    setTempImg(base64)
                };
                image.readAsDataURL(img)
            }
            if (!isLocalImage && formData['img-url']) {
                setTempImg(formData['img-url'])
            }

            if (editingPost) {
                logics.posts.updatePost(editingPost.id, formData['title'], formData['description'], tempImg)
                setEditingPost(null)
            } else {
                logics.posts.publishPost(formData['title'], formData['description'], tempImg)
            }

            setIsLocalImage(null)
            setTempImg(null)
            setRefreshPosts(Date.now())
        } catch (error) {
            alert('¡Ups! Algo salió mal al publicar')
            console.error(error)
        }
    }

    const handleEditPost = (post) => {
        setEditingPost(post)
        setTempImg(post.image)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleImageChange = (newImage, is64Image) => {
        setIsLocalImage(is64Image)
        setTempImg(newImage)
    }

    const deleteImage = () => {
        setIsLocalImage(null)
        setTempImg(null)
    }

    return <div className="my-posts">
        <div className="my-posts__create-section">
            <h2 className="my-posts__title">
                {editingPost ? 'Editar post' : 'Crear nuevo post'}
            </h2>
            {tempImg && (
                <>
                    <Btn 
                        btnClassnames={'my-posts__delete-image'} 
                        btnCallback={deleteImage} 
                        btnContent={<i className="bi bi-trash-fill"></i>} 
                    />
                    <img className="my-posts__image-preview" src={tempImg} alt="Preview" />
                </>
            )}
            <Form 
                inputsArray={[titleInput, descriptionInput, imgFileInput, imgInput]} 
                submitButtonText={editingPost ? 'Guardar cambios' : 'Publicar'} 
                onSubmitCallback={handlePublishPost} 
                onChangeCallback={handleImageChange}
                defaultValues={editingPost ? {
                    title: editingPost.title,
                    description: editingPost.description
                } : null}
            />
            {editingPost && (
                <Btn 
                    btnClassnames={'my-posts__cancel-edit'} 
                    btnCallback={() => {
                        setEditingPost(null)
                        setTempImg(null)
                        setIsLocalImage(null)
                    }} 
                    btnContent={'Cancelar edición'} 
                />
            )}
        </div>
        
        <div className="my-posts__list-section">
            <h2 className="my-posts__title">Mis publicaciones</h2>
            <PostList 
                posts={posts} 
                setRefreshPosts={setRefreshPosts} 
                isMyPostsPage={true}
                onEditPost={handleEditPost}
            />
        </div>
    </div>
}

export default MyPosts