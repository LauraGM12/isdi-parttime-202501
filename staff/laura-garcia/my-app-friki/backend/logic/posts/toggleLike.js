import { errors } from "common"
import { data } from "../../data/index.js"

const toggleLike = (postId, userId) => {
    const userIdObject = new data.ObjectId(userId)
    const postIdObject = new data.ObjectId(postId)

    return data.users.findOne({ _id: userIdObject })
        .catch(error => { throw new errors.ServerError(error.message) })
        .then((user) => {
            if (!user) { throw new errors.ExistenceError('user not found') }
            return data.posts.findOne({ _id: postIdObject })
                .catch(error => { throw new errors.ServerError(error.message) })
                .then((post) => {
                    if (!post) { throw new errors.ExistenceError('post not found') }
                    const updatedLikesArray = post.likes
                    const userIndex = updatedLikesArray.indexOf(userId)
                    if (userIndex !== -1) {
                        updatedLikesArray.splice(userIndex, 1);
                    } else {
                        updatedLikesArray.push(userId)
                    }
                    return data.posts.findOneAndUpdate({ _id: postIdObject }, { $set: { likes: updatedLikesArray } })
                })
        })
}

export default toggleLike