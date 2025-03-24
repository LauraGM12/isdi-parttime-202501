import createPostModal from '../components/createPostModal.mjs'
import header from '../components/header.mjs'
import postList from '../components/postList.mjs'
import { createContainer } from '../lib.mjs'
import { publishPost, toggleLike } from '../logics.mjs'

const home = {
    mount: (body) => {
        console.info('home mounted')
        const homeContainer = createContainer('home')
        homeContainer.id = 'home'

        const onPublishPost = (postData) => {
            publishPost(postData)
            home.update(body)
        }

        const onLikePost = (postId) => {
            toggleLike(postId)
            home.update(body)
        }

        header.mount(homeContainer, 'home')
        createPostModal.mount(homeContainer, onPublishPost)
        postList.mount(homeContainer, onLikePost)

        body.appendChild(homeContainer)
    },
    dismount: () => {
        console.info('home dismounted')
        const home = document.getElementById('home');
        home.remove()
    },
    update: (body) => {
        home.dismount();
        home.mount(body);
    }
}

export default home