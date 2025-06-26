import { Review, Game, User } from '../../../data/models.js'
import { getGameDetails } from '../../../services/rawgService.js' // ← AÑADIR: importar getGameDetails

// Importamos las utilidades comunes: errores personalizados y validadores
import { errors, validator } from 'common'

// Desestructuramos los tipos de errores que utilizaremos en los handlers
const { SystemError, NotFoundError, DuplicityError, AuthorizationError } = errors

/**
 * Handler para crear una nueva reseña de juego
 * Permite a los usuarios autenticados crear reseñas para juegos específicos
 * 
 * @param {Object} req - Objeto de petición HTTP de Express
 * @param {Object} res - Objeto de respuesta HTTP de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Promise<void>} - Respuesta JSON con la reseña creada
 */
const createReviewHandler = async (req, res, next) => {
    try {
        // Extraemos los datos del cuerpo de la petición
        const { gameId, content, rating } = req.body
        // Obtenemos el ID del usuario desde el middleware de autenticación
        const userId = req.userId

        // Validamos los datos de entrada usando los validadores comunes
        validator.validateGameId(gameId, 'gameId') // Valida que el ID del juego sea válido
        validator.validateText(content, 'content', 10, 2000) // Valida que el contenido tenga entre 10 y 2000 caracteres
        validator.validateNumber(rating, 'rating', 0, 10) // Valida que la calificación esté entre 0 y 10

        // NOTA: Comentamos la verificación del juego en la base de datos
        // ya que los juegos provienen de la API de RAWG y no están almacenados localmente
        // const game = await Game.findById(gameId)
        // if (!game) {
        //     throw new NotFoundError('Juego no encontrado')
        // }

        // Verificamos que el usuario no haya reseñado ya este juego (evitar duplicados)
        const existingReview = await Review.findOne({ author: userId, game: gameId })
        if (existingReview) {
            throw new DuplicityError('El usuario ya ha reseñado este juego')
        }

        // Creamos una nueva instancia de reseña con los datos validados
        const review = new Review({
            author: userId,    // ID del usuario que crea la reseña
            game: gameId,      // ID del juego reseñado
            content,           // Contenido de la reseña
            rating             // Calificación numérica del juego
        })

        // Guardamos la reseña en la base de datos
        await review.save()

        // Poblamos los datos relacionados para incluir información del autor y juego
        await review.populate('author', 'username avatar') // Incluye nombre de usuario y avatar
        await review.populate('game', 'name cover')        // Incluye nombre y portada del juego

        // Retornamos la reseña creada con status 201 (Created)
        res.status(201).json(review)
    } catch (error) {
        // Pasamos cualquier error al middleware de manejo de errores
        next(error)
    }
}

/**
 * Handler para obtener todas las reseñas de un juego específico
 * Incluye paginación y ordenamiento configurable
 * 
 * @param {Object} req - Objeto de petición HTTP de Express
 * @param {Object} res - Objeto de respuesta HTTP de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Promise<void>} - Respuesta JSON con las reseñas y metadatos de paginación
 */
const getGameReviewsHandler = async (req, res, next) => {
    try {
        // Extraemos el ID del juego desde los parámetros de la URL
        const { gameId } = req.params
        // Extraemos parámetros de consulta con valores por defecto
        const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query

        // Validamos que el ID del juego sea válido para RAWG
        validator.validateRawgId(gameId, 'gameId')

        // Calculamos cuántos documentos saltar para la paginación
        const skip = (page - 1) * limit
        // Determinamos el orden de clasificación (1 = ascendente, -1 = descendente)
        const sortOrder = order === 'asc' ? 1 : -1

        // Buscamos las reseñas del juego con paginación y ordenamiento
        const reviews = await Review.find({ game: gameId })
            .populate('author', 'username avatar') // Incluimos datos del autor
            .sort({ [sortBy]: sortOrder })         // Ordenamos por el campo especificado
            .skip(skip)                            // Saltamos documentos para paginación
            .limit(parseInt(limit))                // Limitamos el número de resultados

        // Contamos el total de reseñas para este juego (para metadatos de paginación)
        const total = await Review.countDocuments({ game: gameId })

        // Retornamos las reseñas con metadatos de paginación
        res.json({
            reviews,
            pagination: {
                page: parseInt(page),           // Página actual
                limit: parseInt(limit),         // Límite por página
                total,                          // Total de documentos
                pages: Math.ceil(total / limit) // Total de páginas
            }
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Handler para obtener todas las reseñas de un usuario específico
 * Útil para ver el historial de reseñas de cualquier usuario
 * 
 * @param {Object} req - Objeto de petición HTTP de Express
 * @param {Object} res - Objeto de respuesta HTTP de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Promise<void>} - Respuesta JSON con las reseñas del usuario y paginación
 */
const getUserReviewsHandler = async (req, res, next) => {
    try {
        // Extraemos el ID del usuario desde los parámetros de la URL
        const { userId } = req.params
        // Parámetros de paginación con valores por defecto
        const { page = 1, limit = 10 } = req.query

        // Validamos que el ID del usuario sea válido
        validator.validateId(userId, 'userId')

        // Calculamos el offset para la paginación
        const skip = (page - 1) * limit

        // Buscamos las reseñas del usuario ordenadas por fecha de creación (más recientes primero)
        const reviews = await Review.find({ author: userId })
            .populate('game', 'name cover genre') // Incluimos datos del juego reseñado
            .sort({ createdAt: -1 })              // Ordenamos por fecha descendente
            .skip(skip)                           // Aplicamos paginación
            .limit(parseInt(limit))

        // Contamos el total de reseñas del usuario
        const total = await Review.countDocuments({ author: userId })

        // Retornamos las reseñas con metadatos de paginación
        res.json({
            reviews,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Handler para obtener las reseñas del usuario autenticado
 * Permite a los usuarios ver sus propias reseñas
 * 
 * @param {Object} req - Objeto de petición HTTP de Express
 * @param {Object} res - Objeto de respuesta HTTP de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Promise<void>} - Respuesta JSON con las reseñas propias del usuario
 */
const getOwnReviewsHandler = async (req, res, next) => {
    try {
        const userId = req.userId
        const { page = 1, limit = 10 } = req.query
        const skip = (page - 1) * limit

        // Buscamos las reseñas del usuario autenticado
        const reviews = await Review.find({ author: userId })
            .populate('author', 'username avatar') // ← AÑADIR: populate del autor
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))

        // Para cada review, obtener información del juego desde RAWG API
        const reviewsWithGameData = await Promise.all(
            reviews.map(async (review) => {
                try {
                    // Aquí necesitarías llamar a la API de RAWG para obtener datos del juego
                    const gameData = await getGameDetails(review.game)
                    return {
                        ...review.toObject(),
                        game: {
                            _id: review.game,
                            name: gameData.name,
                            background_image: gameData.background_image
                        }
                    }
                } catch (error) {
                    console.error(`Error obteniendo datos del juego ${review.game}:`, error)
                    return {
                        ...review.toObject(),
                        game: {
                            _id: review.game,
                            name: 'Juego no encontrado',
                            background_image: null
                        }
                    }
                }
            })
        )

        const total = await Review.countDocuments({ author: userId })

        res.json({
            reviews: reviewsWithGameData,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Handler para actualizar una reseña existente
 * Solo el autor de la reseña puede modificarla
 * 
 * @param {Object} req - Objeto de petición HTTP de Express
 * @param {Object} res - Objeto de respuesta HTTP de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Promise<void>} - Respuesta JSON con la reseña actualizada
 */
const updateReviewHandler = async (req, res, next) => {
    try {
        // Extraemos el ID de la reseña desde los parámetros de la URL
        const { reviewId } = req.params
        // Extraemos los campos a actualizar del cuerpo de la petición
        const { content, rating } = req.body
        // ID del usuario autenticado
        const userId = req.userId

        // Validamos el ID de la reseña
        validator.validateId(reviewId, 'reviewId')
        // Validamos los campos solo si están presentes (actualización parcial)
        if (content !== undefined) validator.validateText(content, 'content', 10, 2000)
        if (rating !== undefined) validator.validateNumber(rating, 'rating', 0, 10)

        // Buscamos la reseña en la base de datos
        const review = await Review.findById(reviewId)
        if (!review) {
            throw new NotFoundError('Reseña no encontrada')
        }

        // Verificamos que el usuario autenticado sea el autor de la reseña
        if (review.author.toString() !== userId) {
            throw new AuthorizationError('El usuario no es el autor de esta reseña')
        }

        // Actualizamos solo los campos proporcionados
        if (content !== undefined) review.content = content
        if (rating !== undefined) review.rating = rating

        // Guardamos los cambios en la base de datos
        await review.save()

        // Poblamos los datos relacionados para la respuesta
        await review.populate('author', 'username avatar')
        await review.populate('game', 'name cover')

        // Retornamos la reseña actualizada
        res.json(review)
    } catch (error) {
        next(error)
    }
}

/**
 * Handler para eliminar una reseña
 * Solo el autor puede eliminar su propia reseña
 * 
 * @param {Object} req - Objeto de petición HTTP de Express
 * @param {Object} res - Objeto de respuesta HTTP de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Promise<void>} - Respuesta vacía con status 204
 */
const deleteReviewHandler = async (req, res, next) => {
    try {
        const { reviewId } = req.params
        const userId = req.userId

        // Validamos el ID de la reseña
        validator.validateId(reviewId, 'reviewId')

        // Buscamos la reseña a eliminar
        const review = await Review.findById(reviewId)
        if (!review) {
            throw new NotFoundError('Reseña no encontrada')
        }

        // Verificamos autorización: solo el autor puede eliminar su reseña
        if (review.author.toString() !== userId) {
            throw new AuthorizationError('El usuario no es el autor de esta reseña')
        }

        // Eliminamos la reseña de la base de datos
        await Review.findByIdAndDelete(reviewId)

        // Retornamos status 204 (No Content) indicando eliminación exitosa
        res.status(204).send()
    } catch (error) {
        next(error)
    }
}

/**
 * Handler para dar o quitar "me gusta" a una reseña
 * Implementa un sistema de toggle: si ya le gustó, lo quita; si no, lo agrega
 * 
 * @param {Object} req - Objeto de petición HTTP de Express
 * @param {Object} res - Objeto de respuesta HTTP de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Promise<void>} - Respuesta JSON con el estado del like y contador
 */
const toggleLikeHandler = async (req, res, next) => {
    try {
        const { reviewId } = req.params
        const userId = req.userId

        validator.validateId(reviewId, 'reviewId')

        // Buscamos la reseña a la que se dará/quitará like
        const review = await Review.findById(reviewId)
        if (!review) {
            throw new NotFoundError('Reseña no encontrada')
        }

        // Verificamos si el usuario ya le dio like a esta reseña
        const hasLiked = review.likes.includes(userId)

        if (hasLiked) {
            // Si ya le gustó, removemos el like del array
            review.likes = review.likes.filter(id => id.toString() !== userId)
        } else {
            // Si no le había gustado, agregamos el like
            review.likes.push(userId)
        }

        // Guardamos los cambios
        await review.save()

        // Retornamos el nuevo estado y el contador actualizado
        res.json({ 
            liked: !hasLiked,                    // Estado actual del like
            likesCount: review.likes.length      // Número total de likes
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Handler para marcar o desmarcar una reseña como "útil"
 * Similar al sistema de likes pero para indicar utilidad de la reseña
 * 
 * @param {Object} req - Objeto de petición HTTP de Express
 * @param {Object} res - Objeto de respuesta HTTP de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Promise<void>} - Respuesta JSON con el estado de utilidad y contador
 */
const toggleHelpfulHandler = async (req, res, next) => {
    try {
        const { reviewId } = req.params
        const userId = req.userId

        validator.validateId(reviewId, 'reviewId')

        // Buscamos la reseña a marcar como útil/no útil
        const review = await Review.findById(reviewId)
        if (!review) {
            throw new NotFoundError('Reseña no encontrada')
        }

        // Verificamos si el usuario ya marcó esta reseña como útil
        const hasMarkedHelpful = review.helpful.includes(userId)

        if (hasMarkedHelpful) {
            // Si ya la marcó como útil, removemos la marca
            review.helpful = review.helpful.filter(id => id.toString() !== userId)
        } else {
            // Si no la había marcado, agregamos la marca de útil
            review.helpful.push(userId)
        }

        // Guardamos los cambios
        await review.save()

        // Retornamos el nuevo estado y contador
        res.json({ 
            helpful: !hasMarkedHelpful,              // Estado actual de la marca de utilidad
            helpfulCount: review.helpful.length      // Número total de marcas de utilidad
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Handler para añadir un comentario a una reseña
 * Permite a los usuarios autenticados comentar en reseñas de otros usuarios
 * 
 * @param {Object} req - Objeto de petición HTTP de Express
 * @param {Object} res - Objeto de respuesta HTTP de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Promise<void>} - Respuesta JSON con el comentario creado
 */
const addCommentHandler = async (req, res, next) => {
    try {
        const { reviewId } = req.params
        const { content } = req.body
        const userId = req.userId

        // Validamos los datos de entrada
        validator.validateId(reviewId, 'reviewId')
        validator.validateText(content, 'content', 1, 500) // Comentarios más cortos que reseñas

        // Buscamos la reseña a la que se añadirá el comentario
        const review = await Review.findById(reviewId)
        if (!review) {
            throw new NotFoundError('Reseña no encontrada')
        }

        // Creamos el nuevo comentario
        const newComment = {
            author: userId,
            content,
            createdAt: new Date()
        }

        // Añadimos el comentario a la reseña
        review.comments.push(newComment)

        // Guardamos los cambios
        await review.save()

        // Poblamos los datos del autor para la respuesta
        await review.populate('comments.author', 'username avatar')

        // Obtenemos el comentario recién creado
        const addedComment = review.comments[review.comments.length - 1]

        // Retornamos el comentario creado
        res.status(201).json(addedComment)
    } catch (error) {
        next(error)
    }
}

/**
 * Handler para obtener todos los comentarios de una reseña
 * 
 * @param {Object} req - Objeto de petición HTTP de Express
 * @param {Object} res - Objeto de respuesta HTTP de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Promise<void>} - Respuesta JSON con los comentarios
 */
const getCommentsHandler = async (req, res, next) => {
    try {
        const { reviewId } = req.params

        validator.validateId(reviewId, 'reviewId')

        // Buscamos la reseña y seleccionamos solo los comentarios
        const review = await Review.findById(reviewId)
            .select('comments')
            .populate('comments.author', 'username avatar')

        if (!review) {
            throw new NotFoundError('Reseña no encontrada')
        }

        // Retornamos los comentarios
        res.json(review.comments)
    } catch (error) {
        next(error)
    }
}

/**
 * Handler para eliminar un comentario de una reseña
 * Solo el autor del comentario o el autor de la reseña pueden eliminar un comentario
 * 
 * @param {Object} req - Objeto de petición HTTP de Express
 * @param {Object} res - Objeto de respuesta HTTP de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Promise<void>} - Respuesta JSON con confirmación
 */
const deleteCommentHandler = async (req, res, next) => {
    try {
        const { reviewId, commentId } = req.params
        const userId = req.userId

        validator.validateId(reviewId, 'reviewId')
        validator.validateId(commentId, 'commentId')

        // Buscamos la reseña
        const review = await Review.findById(reviewId)
        if (!review) {
            throw new NotFoundError('Reseña no encontrada')
        }

        // Buscamos el comentario
        const comment = review.comments.id(commentId)
        if (!comment) {
            throw new NotFoundError('Comentario no encontrado')
        }

        // Verificamos que el usuario sea el autor del comentario o de la reseña
        if (comment.author.toString() !== userId && review.author.toString() !== userId) {
            throw new AuthorizationError('No tienes permiso para eliminar este comentario')
        }

        // Eliminamos el comentario (reemplazamos comment.remove() con pull)
        review.comments.pull({ _id: commentId })

        // Guardamos los cambios
        await review.save()

        // Retornamos confirmación
        res.json({ message: 'Comentario eliminado correctamente' })
    } catch (error) {
        next(error)
    }
}

// Exportamos todos los handlers para uso en las rutas
export {
    createReviewHandler,      // Crear nueva reseña
    getGameReviewsHandler,    // Obtener reseñas de un juego
    getUserReviewsHandler,    // Obtener reseñas de un usuario
    getOwnReviewsHandler,     // Obtener reseñas propias
    updateReviewHandler,      // Actualizar reseña existente
    deleteReviewHandler,      // Eliminar reseña
    toggleLikeHandler,        // Dar/quitar like
    toggleHelpfulHandler,     // Marcar/desmarcar como útil
    addCommentHandler,        // Añadir comentario
    getCommentsHandler,       // Obtener comentarios
    deleteCommentHandler      // Eliminar comentario
}