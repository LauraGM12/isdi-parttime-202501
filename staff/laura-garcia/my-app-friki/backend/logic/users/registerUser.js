import { errors } from "common"
import { data } from "../../data/index.js"
import bcrypt from "bcrypt"


const registerUser = (email, password, username) => {
    return data.users.findOne({ email: email })
        .catch(error => { throw new errors.ServerError(error.message) })
        .then((user) => {
            if (user) { throw new errors.DuplicityError('user already exists') }

            return bcrypt.hash(password, 5).then(hashPassword => {
                return data.users.insertOne({ email, password: hashPassword, username, following: [], followers: [] })
                    .catch(error => { throw new errors.ServerError(error.message) })
            })
                .catch(error => { throw new errors.ServerError(error.message) });
        })
}

export default registerUser