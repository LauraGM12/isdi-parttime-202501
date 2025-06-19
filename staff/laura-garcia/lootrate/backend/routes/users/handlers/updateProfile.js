import { errors } from 'common'
import updateProfile from '../../../logic/users/updateProfile.js'

/**
 * Handler para actualizar el perfil de un usuario
 * 
 * Permite a un usuario autenticado modificar los datos de su perfil,
 * como información personal, configuraciones de privacidad, etc.
 * 
 * @param {Object} req - Objeto de solicitud HTTP
 * @param {string} req.userId - ID del usuario autenticado
 * @param {Object} req.body - Cuerpo de la solicitud con los datos a actualizar
 * @param {Object} res - Objeto de respuesta HTTP
 * @param {Function} next - Función para pasar al siguiente middleware
 * 
 * @returns {Object} Respuesta JSON con los datos del perfil actualizado
 * 
 * @throws {ValidationError} Si algún campo no cumple el formato requerido
 * @throws {DuplicityError} Si se intenta usar un email/username ya existente
 * @throws {ExistenceError} Si el usuario no existe
 * @throws {SystemError} Si ocurre un error interno del servidor
 */
const updateProfileHandler = async (req, res, next) => {
    try {
        // Extraer el ID del usuario autenticado desde el middleware de auth
        const { userId } = req
        
        // Extraer los datos del perfil a actualizar del cuerpo de la solicitud
        const profileData = req.body
        
        // Llamar a la lógica de negocio para actualizar el perfil
        // La función filtra automáticamente campos no permitidos y valida los datos
        const updatedProfile = await updateProfile(userId, profileData)
        
        // Responder con éxito (200 OK) y los datos actualizados
        res.status(200).json({
            success: true,
            message: 'Perfil actualizado correctamente',
            data: updatedProfile // Datos del perfil después de la actualización
        })
    } catch (error) {
        // Pasar errores al middleware de manejo de errores
        next(error)
    }
}

export default updateProfileHandler