import { addToGameList, removeFromGameList, getGameList } from '../../../logic/users/index.js'

/**
 * Handler para agregar un juego a una lista del usuario
 * 
 * Permite a un usuario autenticado agregar un juego a una de sus listas
 * (favoritos, jugando, completados, etc.)
 * 
 * @param {Object} req - Objeto de solicitud HTTP
 * @param {string} req.userId - ID del usuario autenticado
 * @param {Object} req.body - Cuerpo de la solicitud
 * @param {Object} req.body.gameData - Datos del juego a agregar
 * @param {string} req.body.listType - Tipo de lista (favorites, playing, completed, etc.)
 * @param {Object} res - Objeto de respuesta HTTP
 * @param {Function} next - Función para pasar al siguiente middleware
 */
const addToListHandler = async (req, res, next) => {
    try {
        // Extraer el ID del usuario autenticado desde el middleware de auth
        const { userId } = req
        
        // Extraer los datos del juego y el tipo de lista del cuerpo de la solicitud
        const { gameData, listType } = req.body
        
        // Llamar a la lógica de negocio para agregar el juego a la lista
        const result = await addToGameList(userId, gameData, listType)
        
        // Responder con éxito y información detallada de la operación
        res.status(200).json({
            success: true,
            message: result.message || `Juego agregado a ${listType}`,
            action: result.action || 'added', // Acción realizada (added, updated, etc.)
            data: result
        })
    } catch (error) {
        // Pasar errores al middleware de manejo de errores
        next(error)
    }
}

/**
 * Handler para eliminar un juego de una lista del usuario
 * 
 * Permite a un usuario autenticado eliminar un juego de una de sus listas
 * 
 * @param {Object} req - Objeto de solicitud HTTP
 * @param {string} req.userId - ID del usuario autenticado
 * @param {Object} req.body - Cuerpo de la solicitud
 * @param {string} req.body.listType - Tipo de lista de la cual eliminar
 * @param {string} req.body.gameId - ID del juego a eliminar
 * @param {Object} res - Objeto de respuesta HTTP
 * @param {Function} next - Función para pasar al siguiente middleware
 */
const removeFromListHandler = async (req, res, next) => {
    try {
        // Extraer el ID del usuario autenticado
        const { userId } = req
        
        // Extraer el tipo de lista y el ID del juego a eliminar
        const { listType, gameId } = req.body
        
        // Llamar a la lógica de negocio para eliminar el juego de la lista
        const result = await removeFromGameList(userId, listType, gameId)
        
        // Responder con éxito confirmando la eliminación
        res.status(200).json({
            success: true,
            message: `Juego eliminado de ${listType}`,
            data: result
        })
    } catch (error) {
        // Pasar errores al middleware de manejo de errores
        next(error)
    }
}

/**
 * Handler para obtener las listas de juegos de un usuario
 * 
 * Maneja dos casos de uso:
 * 1. Obtener listas propias del usuario autenticado (/lists/own/:listType)
 * 2. Obtener listas públicas de otro usuario (/lists/user/:username/:listType)
 * 
 * @param {Object} req - Objeto de solicitud HTTP
 * @param {Object} req.params - Parámetros de la URL
 * @param {string} req.params.listType - Tipo de lista a obtener
 * @param {string} req.params.username - Nombre de usuario (solo para rutas públicas)
 * @param {string} req.userId - ID del usuario autenticado (solo para rutas propias)
 * @param {Object} req.route - Información de la ruta actual
 * @param {Object} res - Objeto de respuesta HTTP
 * @param {Function} next - Función para pasar al siguiente middleware
 */
const getGameListHandler = async (req, res, next) => {
    try {
        // Extraer el tipo de lista de los parámetros de la URL
        const { listType } = req.params
        
        // Determinar si la solicitud es para listas propias o públicas
        if (req.route.path.includes('/own/')) {
            // Ruta propia: /lists/own/:listType
            // El usuario quiere ver sus propias listas (incluye elementos privados)
            const { userId } = req
            const gameList = await getGameList(userId, listType, false) // false = no es consulta pública
            res.status(200).json(gameList)
        } else {
            // Ruta pública: /lists/user/:username/:listType
            // Se consultan las listas públicas de otro usuario
            const { username } = req.params
            const gameList = await getGameList(username, listType, true) // true = es consulta pública
            res.status(200).json(gameList)
        }
    } catch (error) {
        // Pasar errores al middleware de manejo de errores
        next(error)
    }
}

export { addToListHandler, removeFromListHandler, getGameListHandler }