import { errors } from "common"
import { data } from "../../data/index.js"

const getUserId = (id, username) => {
    return data.users.findOne({ _id: new data.ObjectId(id) })
        .catch(error => { throw new errors.ServerError(error.message) })
        .then((user) => {
            if (!user) { throw new errors.ExistenceError('logged user not found') }
            return data.users.findOne({ username: username })
                .catch(error => { throw new errors.ServerError(error.message) })
                .then((retrivedUser) => {
                    if (!retrivedUser) { throw new errors.ExistenceError('user not found') }
                    return retrivedUser._id.toString()
                })
        })

}

export default getUserId