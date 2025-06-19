import getToken from '../../helpers/getToken.js'

// URL base del API obtenida desde las variables de entorno
const API_URL = import.meta.env.VITE_API_APP

/**
 * Crea una nueva reseña para un juego específico.
 * Esta función permite a los usuarios autenticados escribir y publicar
 * una reseña con contenido de texto y una calificación numérica.
 * 
 * @async
 * @function createReview
 * @param {string} gameId - El ID único del juego a reseñar
 * @param {string} content - El contenido de texto de la reseña
 * @param {number} rating - La calificación numérica del juego (generalmente 1-5 o 1-10)
 * @returns {Promise<Object>} Una promesa que resuelve con los datos de la reseña creada
 * @throws {Error} Cuando hay un error en la creación o el usuario no está autenticado
 * 
 * @example
 * // Crear una nueva reseña
 * try {
 *   const nuevaReseña = await createReview('game123', 'Excelente juego!', 5)
 *   console.log('Reseña creada:', nuevaReseña)
 * } catch (error) {
 *   console.error('Error al crear reseña:', error.message)
 * }
 */
export const createReview = async (gameId, content, rating) => {
    // Obtenemos el token de autenticación del usuario actual
    const token = getToken()
    
    // Realizamos la petición POST para crear la reseña
    const response = await fetch(`${API_URL}/api/reviews`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Token para autenticación
        },
        body: JSON.stringify({ gameId, content, rating }) // Datos de la reseña
    })
    
    // Verificamos si la respuesta es exitosa
    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Error al crear la reseña')
    }
    
    // Retornamos los datos de la reseña creada
    return await response.json()
}

/**
 * Obtiene todas las reseñas de un juego específico con paginación y ordenamiento.
 * Esta función permite recuperar las reseñas de un juego con opciones
 * de paginación y diferentes criterios de ordenamiento.
 * 
 * @async
 * @function getGameReviews
 * @param {string} gameId - El ID único del juego
 * @param {number} [page=1] - El número de página para la paginación
 * @param {number} [limit=10] - El número máximo de reseñas por página
 * @param {string} [sortBy='createdAt'] - El campo por el cual ordenar (createdAt, rating, etc.)
 * @param {string} [order='desc'] - El orden de clasificación ('asc' o 'desc')
 * @returns {Promise<Object>} Una promesa que resuelve con las reseñas del juego y metadatos de paginación
 * @throws {Error} Cuando el gameId es inválido o hay un error del servidor
 * 
 * @example
 * // Obtener reseñas de un juego
 * try {
 *   const reseñas = await getGameReviews('game123', 1, 10, 'rating', 'desc')
 *   console.log('Reseñas del juego:', reseñas)
 * } catch (error) {
 *   console.error('Error al obtener reseñas:', error.message)
 * }
 */
export const getGameReviews = async (gameId, page = 1, limit = 10, sortBy = 'createdAt', order = 'desc') => {
    // Validamos que el gameId sea válido y no esté indefinido
    if (!gameId || gameId === 'undefined') {
        throw new Error('El ID del juego es requerido y no puede estar indefinido')
    }
    
    console.log('Obteniendo reseñas para gameId:', gameId) // Log de depuración
    
    // Construimos la URL con los parámetros de consulta
    const response = await fetch(`${API_URL}/api/reviews/game/${gameId}?page=${page}&limit=${limit}&sortBy=${sortBy}&order=${order}`)
    
    // Verificamos si la respuesta es exitosa
    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Error al obtener las reseñas')
    }
    
    // Retornamos las reseñas y metadatos
    return await response.json()
}

/**
 * Obtiene todas las reseñas escritas por un usuario específico.
 * Esta función permite ver el historial de reseñas de cualquier usuario
 * del sistema con paginación.
 * 
 * @async
 * @function getUserReviews
 * @param {string} userId - El ID único del usuario
 * @param {number} [page=1] - El número de página para la paginación
 * @param {number} [limit=10] - El número máximo de reseñas por página
 * @returns {Promise<Object>} Una promesa que resuelve con las reseñas del usuario y metadatos de paginación
 * @throws {Error} Cuando hay un error del servidor o el usuario no existe
 * 
 * @example
 * // Obtener reseñas de un usuario
 * try {
 *   const reseñasUsuario = await getUserReviews('user456', 1, 5)
 *   console.log('Reseñas del usuario:', reseñasUsuario)
 * } catch (error) {
 *   console.error('Error al obtener reseñas del usuario:', error.message)
 * }
 */
export const getUserReviews = async (userId, page = 1, limit = 10) => {
    // Realizamos la petición GET para obtener las reseñas del usuario
    const response = await fetch(`${API_URL}/api/reviews/user/${userId}?page=${page}&limit=${limit}`)
    
    // Verificamos si la respuesta es exitosa
    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Error al obtener las reseñas del usuario')
    }
    
    // Retornamos las reseñas del usuario
    return await response.json()
}

/**
 * Obtiene las reseñas propias del usuario autenticado.
 * Esta función permite al usuario actual ver todas sus reseñas
 * escritas con paginación.
 * 
 * @async
 * @function getOwnReviews
 * @param {number} [page=1] - El número de página para la paginación
 * @param {number} [limit=10] - El número máximo de reseñas por página
 * @returns {Promise<Object>} Una promesa que resuelve con las reseñas propias y metadatos de paginación
 * @throws {Error} Cuando el usuario no está autenticado o hay un error del servidor
 * 
 * @example
 * // Obtener mis propias reseñas
 * try {
 *   const misReseñas = await getOwnReviews(1, 10)
 *   console.log('Mis reseñas:', misReseñas)
 * } catch (error) {
 *   console.error('Error al obtener mis reseñas:', error.message)
 * }
 */
export const getOwnReviews = async (page = 1, limit = 10) => {
    // Obtenemos el token de autenticación del usuario actual
    const token = getToken()
    
    // Realizamos la petición GET autenticada para obtener las reseñas propias
    const response = await fetch(`${API_URL}/api/reviews/own?page=${page}&limit=${limit}`, {
        headers: {
            'Authorization': `Bearer ${token}` // Token para autenticación
        }
    })
    
    // Verificamos si la respuesta es exitosa
    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Error al obtener tus reseñas')
    }
    
    // Retornamos las reseñas propias
    return await response.json()
}

/**
 * Actualiza una reseña existente del usuario autenticado.
 * Esta función permite modificar el contenido y/o la calificación
 * de una reseña previamente creada por el usuario.
 * 
 * @async
 * @function updateReview
 * @param {string} reviewId - El ID único de la reseña a actualizar
 * @param {string} content - El nuevo contenido de texto de la reseña
 * @param {number} rating - La nueva calificación numérica
 * @returns {Promise<Object>} Una promesa que resuelve con los datos de la reseña actualizada
 * @throws {Error} Cuando el usuario no tiene permisos o hay un error del servidor
 * 
 * @example
 * // Actualizar una reseña existente
 * try {
 *   const reseñaActualizada = await updateReview('review789', 'Contenido actualizado', 4)
 *   console.log('Reseña actualizada:', reseñaActualizada)
 * } catch (error) {
 *   console.error('Error al actualizar reseña:', error.message)
 * }
 */
export const updateReview = async (reviewId, content, rating) => {
    // Obtenemos el token de autenticación del usuario actual
    const token = getToken()
    
    // Realizamos la petición PUT para actualizar la reseña
    const response = await fetch(`${API_URL}/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Token para autenticación
        },
        body: JSON.stringify({ content, rating }) // Nuevos datos de la reseña
    })
    
    // Verificamos si la respuesta es exitosa
    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Error al actualizar la reseña')
    }
    
    // Retornamos los datos de la reseña actualizada
    return await response.json()
}

/**
 * Elimina una reseña existente del usuario autenticado.
 * Esta función permite al usuario borrar permanentemente
 * una de sus reseñas del sistema.
 * 
 * @async
 * @function deleteReview
 * @param {string} reviewId - El ID único de la reseña a eliminar
 * @returns {Promise<void>} Una promesa que se resuelve cuando la reseña es eliminada
 * @throws {Error} Cuando el usuario no tiene permisos o hay un error del servidor
 * 
 * @example
 * // Eliminar una reseña
 * try {
 *   await deleteReview('review789')
 *   console.log('Reseña eliminada exitosamente')
 * } catch (error) {
 *   console.error('Error al eliminar reseña:', error.message)
 * }
 */
export const deleteReview = async (reviewId) => {
    // Obtenemos el token de autenticación del usuario actual
    const token = getToken()
    
    // Realizamos la petición DELETE para eliminar la reseña
    const response = await fetch(`${API_URL}/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}` // Token para autenticación
        }
    })
    
    // Verificamos si la respuesta es exitosa
    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Error al eliminar la reseña')
    }
    // No retornamos nada ya que la eliminación fue exitosa
}

/**
 * Alterna el estado de "me gusta" en una reseña.
 * Esta función permite al usuario dar o quitar "like" a una reseña.
 * Si ya había dado like, lo quita; si no había dado like, lo añade.
 * 
 * @async
 * @function toggleLike
 * @param {string} reviewId - El ID único de la reseña
 * @returns {Promise<Object>} Una promesa que resuelve con el nuevo estado del like
 * @throws {Error} Cuando el usuario no está autenticado o hay un error del servidor
 * 
 * @example
 * // Dar o quitar like a una reseña
 * try {
 *   const resultado = await toggleLike('review789')
 *   console.log('Estado del like:', resultado)
 * } catch (error) {
 *   console.error('Error al procesar like:', error.message)
 * }
 */
export const toggleLike = async (reviewId) => {
    // Obtenemos el token de autenticación del usuario actual
    const token = getToken()
    
    // Realizamos la petición POST para alternar el like
    const response = await fetch(`${API_URL}/api/reviews/${reviewId}/like`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}` // Token para autenticación
        }
    })
    
    // Verificamos si la respuesta es exitosa
    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Error al procesar el like')
    }
    
    // Retornamos el nuevo estado del like
    return await response.json()
}

/**
 * Alterna el estado de "útil" en una reseña.
 * Esta función permite al usuario marcar o desmarcar una reseña como útil.
 * Si ya había marcado como útil, lo quita; si no había marcado, lo añade.
 * 
 * @async
 * @function toggleHelpful
 * @param {string} reviewId - El ID único de la reseña
 * @returns {Promise<Object>} Una promesa que resuelve con el nuevo estado de "útil"
 * @throws {Error} Cuando el usuario no está autenticado o hay un error del servidor
 * 
 * @example
 * // Marcar o desmarcar como útil una reseña
 * try {
 *   const resultado = await toggleHelpful('review789')
 *   console.log('Estado de útil:', resultado)
 * } catch (error) {
 *   console.error('Error al marcar como útil:', error.message)
 * }
 */
export const toggleHelpful = async (reviewId) => {
    // Obtenemos el token de autenticación del usuario actual
    const token = getToken()
    
    // Realizamos la petición POST para alternar el estado de "útil"
    const response = await fetch(`${API_URL}/api/reviews/${reviewId}/helpful`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}` // Token para autenticación
        }
    })
    
    // Verificamos si la respuesta es exitosa
    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Error al marcar como útil')
    }
    
    // Retornamos el nuevo estado de "útil"
    return await response.json()
}