import { errors } from "common"  
import { data } from "../../data/index.js" 
import bcrypt from "bcrypt" 

const loginUser = (email, password) => {
    return data.users.findOne({ email: email })  // Busca usuario por email
        .catch(error => { throw new errors.ServerError(error.message) })  // Maneja errores de BD
        .then((user) => {
            if (!user) { throw new errors.ExistenceError('user not found') }  // Usuario no existe

            return bcrypt.compare(password, user.password)  // Compara contraseñas
                .catch(error => { throw new errors.ServerError(error.message) })  // Error de bcrypt
                .then(result => {
                    if (!result) { throw new errors.AuthError('invalid credentials') }  // Contraseña incorrecta
                    return user._id.toString()  // Retorna ID del usuario como string
                })
        })
}

export default loginUser