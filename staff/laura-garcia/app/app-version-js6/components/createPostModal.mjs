import { createButton, createContainer, createForm, createTextContainer } from "../lib.mjs"
import { publishPost } from "../logics.mjs"

const onNewPostClick = () => {
    const newPostDialog = document.getElementById('new-post')
    newPostDialog.showModal()
}

const createPostModal = {
    mount: (parentNode, onPublishPost) => {
        const newPostBtn = createButton('+', 'home__new-post-button', onNewPostClick)
        const createPostContainer = document.createElement('dialog')
        createPostContainer.id = 'new-post'
        const containerForm = createContainer('home__create-post-dialog')
        containerForm.id = 'create-post-form'
        const createPostTitle = createTextContainer('h2', '¿Tienes alguna pregunta?', '')
        const closeCreatePostBtn = createButton('X', 'home__close-form-button', () => createPostContainer.close())


        const titleInput = { label: 'Título de su mensaje', inputType: 'text', inputPlaceholder: 'Escribe un título', inputId: 'title', isRequired: true }
        const descriptionInput = { label: 'Tu descripción', inputType: 'text', inputPlaceholder: 'Escribe una descripción', inputId: 'description', isRequired: true }
        const imgInput = { label: 'URL de la imagen', inputType: 'url', inputPlaceholder: 'Añade la url', inputId: 'img', isRequired: false }

        const createPostForm = createForm([titleInput, descriptionInput, imgInput], 'Post', (postData) => {
            onPublishPost(postData)
        })

        containerForm.append(closeCreatePostBtn, createPostTitle, createPostForm)
        createPostContainer.appendChild(containerForm)

        parentNode.append(newPostBtn, createPostContainer)


        parentNode.addEventListener('click', (event) => {
            const newPostForm = document.getElementById('create-post-form')
            const dialog = document.getElementById('new-post')
            const newPostBtn = document.querySelector('.home__new-post-button')

            if ((newPostForm && newPostBtn) && !newPostForm.contains(event.target) && !newPostBtn.contains(event.target)) dialog.close()
        })
    }
}


export default createPostModal