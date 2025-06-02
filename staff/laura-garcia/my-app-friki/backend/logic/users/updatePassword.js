import { errors } from "common"
import { data } from "../../data/index.js"
import bcrypt from "bcrypt"

const updatePassword = (id, newPassword, oldPassword) => {
    return data.users.findOne({ _id: new data.ObjectId(id) })
        .catch(error => { throw new errors.ServerError(error.message) })
        .then((user) => {
            if (!user) { throw new errors.ExistenceError('user not found') }

            return bcrypt.compare(oldPassword, user.password)
                .catch(error => { throw new errors.ServerError(error.message) })
                .then(result => {
                    if (!result) { throw new errors.AuthError('invalid credentials') }
                    return bcrypt.hash(newPassword, 5)
                        .catch(error => { throw new errors.ServerError(error.message) })
                        .then((hashedPassword) => {
                            return data.users.findOneAndUpdate({ _id: new data.ObjectId(id) }, { $set: { password: hashedPassword } })
                                .catch(error => { throw new errors.ServerError(error.message) })
                                .then((oldUser) => {
                                    if (!oldUser) throw new errors.ExistenceError('user not found')
                                })
                        })
                })
        })
}

export default updatePassword