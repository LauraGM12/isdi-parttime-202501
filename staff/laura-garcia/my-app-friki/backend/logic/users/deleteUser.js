// userId, contraseña

import { errors } from "common"
import { data } from "../../data/index.js"
import bcrypt from "bcrypt"

const deleteUser = (id, password) => {
    const userObjectId = new data.ObjectId(id)

    return data.users.findOne({ _id: userObjectId })
        .catch(error => { throw new errors.ServerError(error.message) })
        .then(user => {
            if (!user) { throw new errors.ExistenceError('user not found') }
            return bcrypt.compare(password, user.password)
                .catch(error => { throw new errors.ServerError(error.message) })
                .then((result) => {
                    if (!result) { throw new errors.AuthError('invalid credentials') }
                    return data.users.deleteOne({ _id: userObjectId })
                        .catch(error => { throw new errors.ServerError(error.message) })
                        .then((deletedData) => {
                            if (deletedData.deletedCount !== 1) { throw new errors.ExistenceError('user not found') }

                            return data.posts.deleteMany({ author: userObjectId })
                        })
                })
        })
}

export default deleteUser