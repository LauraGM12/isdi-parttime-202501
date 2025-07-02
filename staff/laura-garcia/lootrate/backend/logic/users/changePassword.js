import { errors } from 'common'
import { data } from "../../data/index.js" 
import bcrypt from "bcryptjs" 

const changePassword = (userId, currentPassword, newPassword) => {
    return data.users.findById(userId)
        .catch(error => { 
            throw new errors.ServerError(error.message) 
        })
        .then((user) => {
            if (!user) { 
                throw new errors.ExistenceError('Usuario no encontrado') 
            }

            return bcrypt.compare(currentPassword, user.password)
                .catch(error => { 
                    throw new errors.ServerError(error.message) 
                })
                .then(isCurrentPasswordValid => {
                    if (!isCurrentPasswordValid) {
                        throw new errors.AuthError('La contraseña actual es incorrecta')
                    }

                    return bcrypt.hash(newPassword, 10)
                        .catch(error => { 
                            throw new errors.ServerError(error.message) 
                        })
                        .then(hashedNewPassword => {
                            user.password = hashedNewPassword
                            return user.save()
                                .catch(error => { 
                                    throw new errors.ServerError(error.message) 
                                })
                                .then(() => {
                                    return { success: true, message: 'Contraseña cambiada exitosamente' }
                                })
                        })
                })
        })
}

export default changePassword