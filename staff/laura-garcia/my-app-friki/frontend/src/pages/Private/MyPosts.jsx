import { useEffect, useState } from "react"
import logics from "../../logic"
import getToken from "../../logic/helpers/getToken"
import PostList from "../../components/PostList"
import Form from "../../components/lib/Form"
import Btn from "../../components/lib/Btn"
import locales from "../../locales"
import './MyPosts.css'

const MyPosts = ({ locale }) => {
    // Inicializa con un objeto vacío con propiedades predeterminadas para evitar errores
    const [translations, setTranslations] = useState({
        titleLabel: '',
        titlePlaceholder: '',
        descriptionLabel: '',
        descriptionPlaceholder: '',
        imageLabel: '',
        imageUrlLabel: '',
        imageUrlPlaceholder: '',
        errorLoading: '',
        errorPublishing: '',
        editPost: '',
        createPost: '',
        saveChanges: '',
        publish: '',
        cancelEdit: '',
        myPosts: ''
    })
    const [posts, setPosts] = useState([])
    const [refreshPosts, setRefreshPosts] = useState(Date.now())
    const [tempImg, setTempImg] = useState()
    const [isLocalImage, setIsLocalImage] = useState()
    const [editingPost, setEditingPost] = useState(null)

    useEffect(() => {
        // Asegúrate de que locales[locale]['myPosts'] existe antes de asignarlo
        if (locales[locale] && locales[locale]['myPosts']) {
            setTranslations(locales[locale]['myPosts'])
        }
    }, [locale])

    const titleInput = { 
        label: translations.titleLabel, 
        inputType: 'text', 
        inputPlaceholder: translations.titlePlaceholder, 
        inputId: 'title', 
        isRequired: true 
    }
    const descriptionInput = { 
        label: translations.descriptionLabel, 
        inputType: 'text', 
        inputPlaceholder: translations.descriptionPlaceholder, 
        inputId: 'description', 
        isRequired: true 
    }
    const imgFileInput = { 
        label: translations.imageLabel, 
        inputType: 'file', 
        inputPlaceholder: '', 
        inputId: 'img-64', 
        isRequired: false 
    }
    const imgInput = { 
        label: translations.imageUrlLabel, 
        inputType: 'url', 
        inputPlaceholder: translations.imageUrlPlaceholder, 
        inputId: 'img-url', 
        isRequired: false 
    }

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const retrievedPosts = await logics.posts.getPostsByAuthor();
                setPosts(retrievedPosts || []);
            } catch (error) {
                console.error(error);
                setPosts([]);
                if (error.name === 'AuthError') {
                    // Redirigir al login si el token no es válido
                    localStorage.removeItem('token');
                    sessionStorage.removeItem('token');
                    window.location.href = '/login';
                } else {
                    alert(translations.errorLoading || 'Error al cargar los posts');
                }
            }
        };

        fetchPosts();
    }, [refreshPosts, translations.errorLoading]);

    const handlePublishPost = (formData) => {
        try {
            // Procesar imagen local si existe
            if (formData['img-64'] && formData['img-64'] instanceof File) {
                const img = formData['img-64'];
                const reader = new FileReader();
                
                reader.onload = (e) => {
                    const base64 = e.target.result;
                    
                    // Publicar o actualizar el post con la imagen
                    publicarPost(formData['title'], formData['description'], base64);
                };
                
                reader.readAsDataURL(img);
            } else {
                // Sin imagen local, usar URL o ninguna imagen
                const imageToUse = formData['img-url'] || tempImg;
                publicarPost(formData['title'], formData['description'], imageToUse);
            }
        } catch (error) {
            console.error('Error al publicar:', error);
            alert(translations.errorPublishing || 'Error al publicar');
        }
    }

    const publicarPost = (title, description, image) => {
        try {
            if (editingPost) {
                // Si updatePost no existe, intentamos una alternativa
                if (typeof logics.posts.updatePost !== 'function') {
                    // Alternativa: eliminar el post antiguo y crear uno nuevo
                    logics.posts.deletePost(editingPost.id);
                    logics.posts.publishPost(title, description, image);
                } else {
                    logics.posts.updatePost(editingPost.id, title, description, image);
                }
            } else {
                logics.posts.publishPost(title, description, image);
            }
            
            // Limpiar estados
            setIsLocalImage(null);
            setTempImg(null);
            setEditingPost(null);
            setRefreshPosts(Date.now());
        } catch (error) {
            console.error('Error al publicar:', error);
            alert(translations.errorPublishing || 'Error al publicar');
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
                {editingPost ? translations.editPost : translations.createPost}
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
                submitButtonText={editingPost ? translations.saveChanges : translations.publish} 
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
                    btnContent={translations.cancelEdit} 
                />
            )}
        </div>
        
        <div className="my-posts__list-section">
            <h2 className="my-posts__title">{translations.myPosts}</h2>
            <PostList 
                posts={posts} 
                setRefreshPosts={setRefreshPosts} 
                isMyPostsPage={true}
                onEditPost={handleEditPost}
                locale={locale}
            />
        </div>
    </div>
}

export default MyPosts