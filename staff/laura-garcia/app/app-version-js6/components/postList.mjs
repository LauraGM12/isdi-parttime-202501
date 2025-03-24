import { createContainer } from "../lib.mjs";
import { getAllPosts } from "../logics.mjs";
import post from "./post.mjs";

const postList = {
    mount: (parentNode, onLikePost) => {
        const posts = getAllPosts();
        const postsContainer = createContainer('posts')

        posts.forEach((_post) => post.mount(postsContainer, _post, onLikePost))
        parentNode.appendChild(postsContainer)
    }
}

export default postList