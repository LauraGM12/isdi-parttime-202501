import getProfile from '../../../logic/users/getProfile.js'
import { data } from '../../../data/index.js'

/**
 * Handler para obtener el perfil de un usuario
 * 
 * Este endpoint maneja dos casos de uso:
 * 1. Obtener el perfil propio del usuario autenticado (/profile/own)
 * 2. Obtener el perfil público de otro usuario por username (/profile/user/:username)
 * 
 * @param {Object} req - Objeto de solicitud HTTP
 * @param {string} req.userId - ID del usuario autenticado (disponible cuando viene del middleware de auth)
 * @param {Object} req.params - Parámetros de la URL
 * @param {string} req.params.username - Nombre de usuario del perfil a consultar (opcional)
 * @param {Object} req.route - Información de la ruta actual
 * @param {string} req.route.path - Ruta específica que se está ejecutando
 * @param {Object} res - Objeto de respuesta HTTP
 * @param {Function} next - Función para pasar al siguiente middleware
 * 
 * @returns {Object} Respuesta JSON con los datos del perfil del usuario
 * 
 * @throws {ExistenceError} Si el usuario solicitado no existe
 * @throws {SystemError} Si ocurre un error interno del servidor
 */
const getProfileHandler = async (req, res, next) => {
    try {
        let targetUserId
        
        // Determinar el ID del usuario objetivo según la ruta utilizada
        // Si viene de /profile/own, usar userId del token JWT
        if (req.route.path === '/profile/own') {
            // El usuario quiere ver su propio perfil
            targetUserId = req.userId
        } 
        // Si viene de /profile/user/:username, buscar por nombre de usuario
        else if (req.params.username) {
            // Buscar el usuario en la base de datos por su nombre de usuario
            // Solo necesitamos el _id, por eso usamos select('_id')
            const user = await data.users.findOne({ username: req.params.username }).select('_id')
            
            // Verificar si el usuario existe
            if (!user) {
                // Responder con error 404 si el usuario no se encuentra
                return res.status(404).json({
                    success: false,
                    name: 'ExistenceError',
                    message: 'usuario no encontrado'
                })
            }
            
            // Usar el ID del usuario encontrado
            targetUserId = user._id
        }
        
        // Llamar a la lógica de negocio para obtener los datos del perfil
        // Esta función maneja la lógica de qué información mostrar según la privacidad
        const profile = await getProfile(targetUserId)
        
        // Responder con éxito (200 OK) y los datos del perfil
        res.status(200).json({
            success: true,
            data: profile
        })
    } catch (error) {
        // Pasar cualquier error al middleware de manejo de errores
        // Esto permite un manejo centralizado de errores en la aplicación
        next(error)
    }
}

export default getProfileHandler