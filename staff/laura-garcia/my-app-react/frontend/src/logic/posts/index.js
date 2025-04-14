import toggleLikeFunctions from "./toggleLike";
import getAllPosts from "./getAllPosts";
import getPostsByAuthor from "./getPostsByAuthor";
import publishPost from "./publishPost";
import toggleFavorite from "./toggleFavorite";
import updatePost from "./updatePost";
import deletePost from "./deletePost";

const posts = {
    getAllPosts,
    publishPost,
    toggleLike: toggleLikeFunctions.toggleLike,
    toggleDislike: toggleLikeFunctions.toggleDislike,
    toggleFavorite,
    getPostsByAuthor,
    deletePost,
    updatePost
}

export default posts