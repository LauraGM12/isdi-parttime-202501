import { errors } from "common"
import { data } from "../../data/index.js"
import bcrypt from "bcrypt"

const loginUser = (email, password) => {

    return data.users.findOne({ email: email })
        .catch(error => { throw new errors.ServerError(error.message) })
        .then((user) => {
            if (!user) { throw new errors.ExistenceError('user not found') }

            return bcrypt.compare(password, user.password)
                .then(result => {
                    if (!result) { throw new errors.AuthError('invalid credentials') }
                    return user._id.toString()
                })
                .catch(error => { throw new errors.ServerError(error.message) })
        })
}

export default loginUser