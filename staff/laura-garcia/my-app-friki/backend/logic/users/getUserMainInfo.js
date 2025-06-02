import { errors } from "common"
import { data } from "../../data/index.js"

const getUserMainInfo = (id, userId) => {
    return data.users.findOne({ _id: new data.ObjectId(id) })
        .catch(error => { throw new errors.ServerError(error.message) })
        .then((user) => {
            if (!user) { throw new errors.ExistenceError('logged user not found') }
            return data.users.findOne({ _id: new data.ObjectId(userId) })
                .catch(error => { throw new errors.ServerError(error.message) })
                .then((user) => {
                    if (!user) { throw new errors.ExistenceError('user not found') }
                    const result = {
                        username: user.username,
                        avatar: user.avatar,
                        bio: user.bio,
                        isFollowing: user.followers ? user.followers.includes(id) : false,
                        id: user._id.toString()
                    }
                    return result
                })
        })
}

export default getUserMainInfo