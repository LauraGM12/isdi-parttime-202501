import { errors } from "common"
import { data } from "../../data/index.js"

const updateBio = (id, newBio) => {

    return data.users.findOneAndUpdate({ _id: new data.ObjectId(id) }, { $set: { bio: newBio } })
        .catch(error => { throw new errors.ServerError(error.message) })
        .then((oldUser) => {
            if (!oldUser) throw new errors.ExistenceError('user not found')
        })
}

export default updateBio