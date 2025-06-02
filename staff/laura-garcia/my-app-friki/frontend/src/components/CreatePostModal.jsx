import { useEffect, useState } from "react"
import logics from "../logic"
import Btn from "./lib/Btn"
import Form from "./lib/Form"
import locales from "../locales"

const CreatePostModal = ({ setRefreshPosts, closeModal, locale }) => {
    const [translations, setTranslations] = useState(locales[locale]['createPostModal'])
    const [tempImg, setTempImg] = useState()
    const [isLocalImage, setIsLocalImage] = useState()

    useEffect(() => {
        setTranslations(locales[locale]['createPostModal'])
    }, [locale])

    const titleInput = { 
        label: translations.form.titleLabel, 
        inputType: 'text', 
        inputPlaceholder: translations.form.titlePlaceholder, 
        inputId: 'title', 
        isRequired: true 
    }
    const descriptionInput = { 
        label: translations.form.descriptionLabel, 
        inputType: 'text', 
        inputPlaceholder: translations.form.descriptionPlaceholder, 
        inputId: 'description', 
        isRequired: true 
    }
    const imgFileInput = { 
        label: translations.form.imageLabel, 
        inputType: 'file', 
        inputPlaceholder: '', 
        inputId: 'img-64', 
        isRequired: false 
    }
    const imgInput = { 
        label: translations.form.imageUrlLabel, 
        inputType: 'url', 
        inputPlaceholder: translations.form.imageUrlPlaceholder, 
        inputId: 'img-url', 
        isRequired: false 
    }

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
            alert(translations.error)
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
        <Btn 
            btnClassnames={'home__close-form-button'} 
            btnCallback={closeModal} 
            btnContent={translations.close} 
        />
        <h2>{translations.title}</h2>
        {tempImg && (
            <Btn 
                btnClassnames={'home__create-post--delete-image'} 
                btnCallback={deleteImage} 
                btnContent={<i className="bi bi-trash-fill"></i>} 
            />
        )}
        {tempImg && <img className="home__create-post--image-preview" src={tempImg} alt="" />}

        <Form 
            inputsArray={[titleInput, descriptionInput, imgFileInput, imgInput]} 
            submitButtonText={translations.publish} 
            onSubmitCallback={handlePublishPost} 
            onChangeCallback={handleImageChange} 
        />
    </div>
}

export default CreatePostModal