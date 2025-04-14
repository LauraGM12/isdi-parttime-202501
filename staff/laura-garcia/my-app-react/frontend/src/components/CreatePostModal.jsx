import { useEffect, useState } from "react"
import logics from "../logic"
import Btn from "./lib/Btn"
import Form from "./lib/Form"

const CreatePostModal = ({ setRefreshPosts, closeModal }) => {
    const [tempImg, setTempImg] = useState()
    const [isLocalImage, setIsLocalImage] = useState()
    const titleInput = { label: 'Título de tu publicación', inputType: 'text', inputPlaceholder: 'Soy un título :D', inputId: 'title', isRequired: true }
    const descriptionInput = { label: 'Tu descripción', inputType: 'text', inputPlaceholder: 'Bla bla bla bla', inputId: 'description', isRequired: true }
    const imgFileInput = { label: 'Cargar una imagen', inputType: 'file', inputPlaceholder: '', inputId: 'img-64', isRequired: false }
    const imgInput = { label: 'O usa una URL de imagen pública', inputType: 'url', inputPlaceholder: '.png, .jpg, etc', inputId: 'img-url', isRequired: false }

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

            logics.posts.publishPost(formData['title'], formData['description'], tempImg)
            setIsLocalImage(null)
            setTempImg(null)
            closeModal()
            setRefreshPosts(Date.now())
        } catch (error) {
            alert('¡Ups! Algo salió mal')
            console.error(error)
        }
    }

    const handleImageChange = (newImage, is64Image) => {
        setIsLocalImage(is64Image)
        setTempImg(newImage)
    }

    const deleteImage = () => {
        setIsLocalImage(null)
        setTempImg(null)
    }


    return <div className="home__create-post-dialog">
        <Btn btnClassnames={'home__close-form-button'} btnCallback={closeModal} btnContent={'X'} />
        <h2>¿Qué quieres compartir?</h2>
        {tempImg && <Btn btnClassnames={'home__create-post--delete-image'} btnCallback={deleteImage} btnContent={<i className="bi bi-trash-fill"></i>} />}
        {tempImg && <img className="home__create-post--image-preview" src={tempImg} />}


        <Form inputsArray={[titleInput, descriptionInput, imgFileInput, imgInput]} submitButtonText={'Publicar'} onSubmitCallback={handlePublishPost} onChangeCallback={handleImageChange} />
    </div>
}

export default CreatePostModal