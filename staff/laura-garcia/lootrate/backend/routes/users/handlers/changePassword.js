// Importar las dependencias necesarias
import { errors } from 'common'
import changePassword from '../../../logic/users/changePassword.js'

// Desestructurar los tipos de errores que vamos a manejar
const { SystemError, ExistenceError, AuthError } = errors

/**
 * Handler para cambiar la contraseña de un usuario
 * Maneja la petición HTTP y llama a la lógica de negocio
 */
export default async (req, res) => {
    try {
        // Extraer el ID del usuario del middleware de autenticación
        const { userId } = req
        
        // Extraer las contraseñas del cuerpo de la petición
        const { currentPassword, newPassword } = req.body
        
        // Validar que se proporcionaron ambas contraseñas
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ 
                error: 'ValidationError', 
                message: 'Se requieren la contraseña actual y la nueva contraseña' 
            })
        }
        
        // Validar que la nueva contraseña sea diferente a la actual
        if (currentPassword === newPassword) {
            return res.status(400).json({ 
                error: 'ValidationError', 
                message: 'La nueva contraseña debe ser diferente a la actual' 
            })
        }
        
        // Llamar a la lógica de cambio de contraseña
        const result = await changePassword(userId, currentPassword, newPassword)
        
        // Responder con éxito
        res.status(200).json(result)
    } catch (error) {
        // Determinar el código de estado HTTP según el tipo de error
        let status = 500  // Error interno del servidor por defecto
        
        // Si es un error de existencia o autenticación, usar código 400
        if (error instanceof ExistenceError || 
            error instanceof AuthError) {
            status = 400
        }
        
        // Responder con el error
        res.status(status).json({ 
            error: error.constructor.name, 
            message: error.message 
        })
    }
}