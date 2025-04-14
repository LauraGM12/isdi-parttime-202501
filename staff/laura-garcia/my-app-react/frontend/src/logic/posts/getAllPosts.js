import data from "../../data";
import { ExistenceError } from "../../utils/errors";
import validator from "../../utils/validators";
import getLoggedUserId from "../helpers/getLoggedUserId";

const getAllPosts = () => {
    const loggedUserId = getLoggedUserId()

    validator.id(loggedUserId)

    const posts = data.posts.retrievePosts()

    if (posts.length > 0) posts.sort((item1, item2) => new Date(item2.createdOn) - new Date(item1.createdOn))

    for (let i = 0; i < posts.length; i++) {
        const author = data.users.findUserById(posts[i].author)
        if (!author) throw new ExistenceError('author not found')
        posts[i].author = { id: author.id, username: author.username, avatar: author.avatar }
        const date = new Date(posts[i].createdOn)
        posts[i].createdOn = date.toLocaleString()
        if (!posts[i].likes) posts[i].likes = []; //para manejar posts sin arrays de likes
        if (posts[i].likes.length > 0 && posts[i].likes.includes(loggedUserId)) {
            posts[i].isLiked = true
        } else {
            posts[i].isLiked = false
        }

    }

    return posts
}

export default getAllPosts