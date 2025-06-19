// Importar dependencias necesarias
import { errors } from "common"
import { data } from "../../data/index.js" 
import bcrypt from "bcrypt" 

/**
 * Función para autenticar un usuario
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Promise<string>} - ID del usuario autenticado
 */
const loginUser = (email, password) => {
    // Normalizar el email (convertir a minúsculas y quitar espacios)
    const normalizedEmail = email.toLowerCase().trim()
    
    // Buscar usuario por email en la base de datos
    return data.users.findOne({ email: normalizedEmail })
        .catch(error => { 
            // Log del error para debugging
            console.error('Error en base de datos al buscar usuario:', error)
            // Lanzar error del servidor
            throw new errors.ServerError(error.message) 
        })
        .then((user) => {
            // Log para debugging (sin mostrar datos sensibles)
            console.log('Búsqueda de usuario:', { 
                emailBuscado: normalizedEmail, 
                usuarioEncontrado: !!user 
            })
            
            // Verificar que el usuario existe
            if (!user) { 
                throw new errors.ExistenceError('Usuario no encontrado') 
            }

            // Comparar la contraseña proporcionada con la almacenada
            return bcrypt.compare(password, user.password)
                .catch(error => { 
                    // Log del error de bcrypt
                    console.error('Error en bcrypt.compare:', error)
                    // Lanzar error del servidor
                    throw new errors.ServerError(error.message) 
                })
                .then(result => {
                    // Verificar que la contraseña es correcta
                    if (!result) { 
                        throw new errors.AuthError('Credenciales inválidas') 
                    }
                    
                    // Log de login exitoso (sin datos sensibles)
                    console.log('Login exitoso para usuario:', user._id.toString())
                    
                    // Retornar ID del usuario como string
                    return user._id.toString()
                })
        })
}

export default loginUser