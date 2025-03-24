import { createContainer, createTextContainer } from "../lib.mjs";
import { likeEmpty, likeFill } from "../icons.mjs";

const post = {
    mount: (parentNode, postData, onLikePost) => {
        const postContainer = createContainer('post-card');
        const authorAndDate = createTextContainer('p', `${postData.author} said on ${postData.createdOn}`, 'post-card__author')
        const postTitle = createTextContainer('h3', postData.title, 'post-card__title')
        const postDescription = createTextContainer('p', postData.description, 'post-card__description')

        const likeContainer = createContainer('post-card__like')
        const likeIcon = document.createElement('span')
        likeIcon.className = 'post-card__like-btn'
        likeIcon.innerHTML = postData.isLiked ? likeFill : likeEmpty
        const postLikes = createTextContainer('p', `${postData.likes.length}`)
        likeIcon.addEventListener('click', () => { onLikePost(postData.id) })
        likeContainer.append(likeIcon, postLikes)

        postContainer.append(authorAndDate, postTitle, postDescription, likeContainer)

        let postImg;
        if (postData.img !== '') {
            const imgContainer = createContainer('post-card__img-container')
            postImg = document.createElement('img')
            postImg.className = 'post-card__img'
            postImg.src = postData.img
            imgContainer.appendChild(postImg)
            postContainer.appendChild(imgContainer)
        }
        parentNode.appendChild(postContainer)
    }

}


export default post