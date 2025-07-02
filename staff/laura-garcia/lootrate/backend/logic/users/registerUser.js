import { errors } from 'common'
import { data } from "../../data/index.js"
import bcrypt from "bcryptjs"


const registerUser = (email, password, username) => {
    return data.users.findOne({ email: email })
        .catch(error => { throw new errors.ServerError(error.message) })
        .then((user) => {
            if (user) { throw new errors.DuplicityError('el usuario ya existe') }

            return bcrypt.hash(password, 5)
                .catch(error => { throw new errors.ServerError(error.message) })
                .then(hashPassword => {
                    const newUser = new data.users({
                        email,          
                        password: hashPassword,  
                        username     
                    })

                    return newUser.save()
                        .catch(error => { throw new errors.ServerError(error.message) })
                })
        })
}

export default registerUser