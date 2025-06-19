import { errors } from "common"
import { data } from "../../data/index.js" 
import bcrypt from "bcrypt" 

/**
 * Función para cambiar la contraseña de un usuario
 * @param {string} userId - ID del usuario autenticado
 * @param {string} currentPassword - Contraseña actual del usuario
 * @param {string} newPassword - Nueva contraseña del usuario
 * @returns {Promise} - Promesa que resuelve cuando se cambia la contraseña
 */
const changePassword = (userId, currentPassword, newPassword) => {
    // Buscar el usuario por su ID en la base de datos
    return data.users.findById(userId)
        .catch(error => { 
            // Manejar errores de conexión a la base de datos
            throw new errors.ServerError(error.message) 
        })
        .then((user) => {
            // Verificar que el usuario existe
            if (!user) { 
                throw new errors.ExistenceError('Usuario no encontrado') 
            }

            // Comparar la contraseña actual con la almacenada en la base de datos
            return bcrypt.compare(currentPassword, user.password)
                .catch(error => { 
                    // Manejar errores de bcrypt
                    throw new errors.ServerError(error.message) 
                })
                .then(isCurrentPasswordValid => {
                    // Verificar que la contraseña actual es correcta
                    if (!isCurrentPasswordValid) {
                        throw new errors.AuthError('La contraseña actual es incorrecta')
                    }

                    // Generar hash de la nueva contraseña
                    return bcrypt.hash(newPassword, 10)
                        .catch(error => { 
                            // Manejar errores al generar el hash
                            throw new errors.ServerError(error.message) 
                        })
                        .then(hashedNewPassword => {
                            // Actualizar la contraseña en la base de datos
                            user.password = hashedNewPassword
                            return user.save()
                                .catch(error => { 
                                    // Manejar errores al guardar en la base de datos
                                    throw new errors.ServerError(error.message) 
                                })
                                .then(() => {
                                    // Retornar mensaje de éxito
                                    return { success: true, message: 'Contraseña cambiada exitosamente' }
                                })
                        })
                })
        })
}

export default changePassword