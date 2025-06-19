import { errors } from "common"
import deleteUser from '../../../logic/users/deleteUser.js'

const { SystemError, ExistenceError, AuthError } = errors

/**
 * Handler para eliminar un usuario del sistema
 * 
 * Este endpoint permite a un usuario eliminar su propia cuenta del sistema.
 * Requiere autenticación y confirmación mediante email y contraseña.
 * 
 * @param {Object} req - Objeto de solicitud HTTP
 * @param {string} req.userId - ID del usuario autenticado (extraído del token JWT)
 * @param {Object} req.body - Cuerpo de la solicitud
 * @param {string} req.body.email - Email del usuario para confirmación
 * @param {string} req.body.password - Contraseña del usuario para confirmación
 * @param {Object} res - Objeto de respuesta HTTP
 * 
 * @returns {Object} Respuesta JSON con el resultado de la eliminación
 * 
 * @throws {ExistenceError} Si el usuario no existe en el sistema
 * @throws {AuthError} Si las credenciales de confirmación son incorrectas
 * @throws {SystemError} Si ocurre un error interno del servidor
 */
export default async (req, res) => {
    try {
        // Extraer el ID del usuario autenticado desde el middleware de autenticación
        const { userId } = req
        
        // Extraer las credenciales de confirmación del cuerpo de la solicitud
        const { email, password } = req.body
        
        // Llamar a la lógica de negocio para eliminar el usuario
        // Se requiere confirmación con email y contraseña por seguridad
        const result = await deleteUser(userId, email, password)
        
        // Responder con éxito (200 OK) y el resultado de la operación
        res.status(200).json(result)
    } catch (error) {
        // Inicializar el código de estado por defecto para errores del servidor
        let status = 500
        
        // Determinar el código de estado HTTP apropiado según el tipo de error
        if (error instanceof ExistenceError ||
            error instanceof AuthError) {
            // 400 Bad Request para errores de validación o autenticación
            status = 400
        }
        // SystemError y otros errores no controlados mantienen el status 500
        
        // Responder con el error, incluyendo el tipo y mensaje descriptivo
        res.status(status).json({ 
            error: error.constructor.name, 
            message: error.message 
        })
    }
}