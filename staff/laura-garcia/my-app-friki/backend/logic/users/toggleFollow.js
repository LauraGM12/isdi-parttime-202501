import { errors } from "common"
import { data } from "../../data/index.js"

const toggleFollow = (userToFollowId, loggedUserId) => {
    const userToFollowIdObject = new data.ObjectId(userToFollowId)
    const loggedUserIdObject = new data.ObjectId(loggedUserId)

    return data.users.findOne({ _id: loggedUserIdObject })
        .catch(error => { throw new errors.ServerError(error.message) })
        .then((loggedUser) => {
            if (!loggedUser) { throw new errors.ExistenceError('loggedUser not found') }
            return data.users.findOne({ _id: userToFollowIdObject })
                .catch(error => { throw new errors.ServerError(error.message) })
                .then((userToFollow) => {
                    if (!userToFollow) { throw new errors.ExistenceError('userToFollow not found') }
                    const loggedUserFollowing = loggedUser.following ? loggedUser.following : []
                    const userFollowers = userToFollow.followers ? userToFollow.followers : []

                    const followingIndex = loggedUserFollowing.indexOf(userToFollowId)
                    const followerIndex = userFollowers.indexOf(loggedUserId)

                    if (followingIndex !== -1) {
                        loggedUserFollowing.splice(followingIndex, 1)
                        userFollowers.splice(followerIndex, 1)
                    } else {
                        loggedUserFollowing.push(userToFollowId)
                        userFollowers.push(loggedUserId)
                    }
                    return data.users.findOneAndUpdate({ _id: loggedUserIdObject }, { $set: { following: loggedUserFollowing } })
                        .then((oldUser) => {
                            if (!oldUser) throw new errors.ExistenceError('loggedUser updated not found')
                            return data.users.findOneAndUpdate({ _id: userToFollowIdObject }, { $set: { followers: userFollowers } })
                        })
                        .catch(error => { throw new errors.ServerError(error.message) })
                })
        })
}

export default toggleFollow