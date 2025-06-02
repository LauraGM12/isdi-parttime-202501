import { errors } from "common"
import { data } from "../../data/index.js"

const deletePost = (postId, userId) => {
    return data.users.findOne({ _id: new data.ObjectId(userId) })
        .catch(error => { throw new errors.ServerError(error.message) })
        .then((user) => {
            if (!user) { throw new errors.ExistenceError('user not found') }
            return data.posts.findOne({ _id: new data.ObjectId(postId) })
                .catch(error => { throw new errors.ServerError(error.message) })
                .then(post => {
                    if (!post) { throw new errors.ExistenceError('post not found') }
                    if (userId !== post.author.toString()) { throw new errors.AuthError('no permissions to delete this post') }

                    return data.posts.deleteOne({ _id: new data.ObjectId(postId) })
                        .catch(error => { throw new errors.ServerError(error.message) })
                })
        })
}

export default deletePost