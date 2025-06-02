import createPost from "./posts/createPost.js";
import deletePost from "./posts/deletePost.js";
import getAllPosts from "./posts/getAllPosts.js";
import getPostsByAuthor from "./posts/getPostsByAuthor.js";
import getAvatar from "./users/getAvatar.js";
import getBio from "./users/getBio.js";
import getUserId from "./users/getUserId.js";
import getUsername from "./users/getUsername.js";
import loginUser from "./users/loginUser.js";
import registerUser from "./users/registerUser.js";
import toggleLike from "./posts/toggleLike.js";
import toggleFollow from "./users/toggleFollow.js";
import updateAvatar from "./users/updateAvatar.js";
import updateBio from "./users/updateBio.js";
import updateUsername from "./users/updateUsername.js";
import getUserMainInfo from "./users/getUserMainInfo.js";
/*import getHomePosts from "./posts/getHomePosts.js";*/
import updateEmail from "./users/updateEmail.js";
import updatePassword from "./users/updatePassword.js";
import deleteUser from "./users/deleteUser.js";

export default {
    registerUser,
    loginUser,
    getUsername,
    updateUsername,
    getAvatar,
    updateAvatar,
    createPost,
    getAllPosts,
    toggleLike,
    deletePost,
    updateBio,
    getBio,
    getPostsByAuthor,
    getUserId,
    toggleFollow,
    getUserMainInfo,
    /*getHomePosts,*/
    updateEmail,
    updatePassword,
    deleteUser
}