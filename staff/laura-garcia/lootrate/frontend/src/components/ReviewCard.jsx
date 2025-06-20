import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { deleteReview, updateReview, toggleLike, toggleHelpful } from '../logic/reviews/reviewsUser'
import getToken from '../helpers/getToken'
import { jwtDecode } from 'jwt-decode'

/**
 * Componente de tarjeta de reseña con funcionalidades de edición y interacción
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.review - Datos de la reseña
 * @param {boolean} props.isOwn - Si la reseña pertenece al usuario actual
 * @param {Function} props.onDeleted - Callback cuando se elimina la reseña
 * @param {Function} props.onUpdated - Callback cuando se actualiza la reseña
 * @returns {JSX.Element} Tarjeta de reseña
 */
const ReviewCard = ({ review, isOwn, onDeleted, onUpdated }) => {
    const navigate = useNavigate()
    
    // Estados para el modo de edición
    const [isEditing, setIsEditing] = useState(false)
    const [editContent, setEditContent] = useState(review.content)
    const [editRating, setEditRating] = useState(review.rating)
    const [isLoading, setIsLoading] = useState(false)
    
    // Estados para las interacciones (likes y helpful) con contadores
    const [isLiked, setIsLiked] = useState(false)
    const [isHelpful, setIsHelpful] = useState(false)
    const [likesCount, setLikesCount] = useState(review.likes?.length || 0)
    const [helpfulCount, setHelpfulCount] = useState(review.helpful?.length || 0)
    
    // Efecto para verificar si el usuario actual ha dado like o ha marcado como útil la reseña
    useEffect(() => {
        const checkUserInteractions = () => {
            try {
                const token = getToken()
                if (!token) return
                
                const decodedToken = jwtDecode(token)
                const userId = decodedToken.id
                
                // Verificar si el usuario ha dado like
                if (review.likes && Array.isArray(review.likes)) {
                    const userLiked = review.likes.includes(userId)
                    setIsLiked(userLiked)
                }
                
                // Verificar si el usuario ha marcado como útil
                if (review.helpful && Array.isArray(review.helpful)) {
                    const userHelpful = review.helpful.includes(userId)
                    setIsHelpful(userHelpful)
                }
            } catch (error) {
                console.error('Error al verificar interacciones del usuario:', error)
            }
        }
        
        checkUserInteractions()
    }, [review.likes, review.helpful])
    
    /**
     * Maneja el toggle de "me gusta" en la reseña
     * @param {string} reviewId - ID de la reseña
     */
    const handleLike = async (reviewId) => {
        try {
            // Actualizar UI inmediatamente para mejor experiencia de usuario
            const newIsLiked = !isLiked
            setIsLiked(newIsLiked)
            setLikesCount(prev => newIsLiked ? prev + 1 : prev - 1)
            
            // Llamar a la API para guardar el cambio en el servidor
            const result = await toggleLike(reviewId)
            
            // Actualizar el objeto review original
            if (newIsLiked) {
                // Añadir el ID del usuario actual al array de likes si no está
                const token = getToken()
                const decodedToken = jwtDecode(token)
                const userId = decodedToken.id
                
                if (!review.likes.includes(userId)) {
                    review.likes.push(userId)
                }
            } else {
                // Eliminar el ID del usuario actual del array de likes
                const token = getToken()
                const decodedToken = jwtDecode(token)
                const userId = decodedToken.id
                
                review.likes = review.likes.filter(id => id !== userId)
            }
            
            // Notificar al componente padre sobre la actualización
            if (onUpdated) {
                onUpdated(review._id, { likes: review.likes })
            }
        } catch (error) {
            // Revertir cambios locales en caso de error
            setIsLiked(!isLiked)
            setLikesCount(prev => isLiked ? prev + 1 : prev - 1)
            console.error('Error al alternar like:', error)
            alert('Error al procesar el like. Por favor, inténtalo de nuevo.')
        }
    }
    
    /**
     * Maneja el toggle de "útil" en la reseña
     * @param {string} reviewId - ID de la reseña
     */
    const handleHelpful = async (reviewId) => {
        try {
            // Actualizar UI inmediatamente para mejor experiencia de usuario
            const newIsHelpful = !isHelpful
            setIsHelpful(newIsHelpful)
            setHelpfulCount(prev => newIsHelpful ? prev + 1 : prev - 1)
            
            // Llamar a la API para guardar el cambio en el servidor
            const result = await toggleHelpful(reviewId)
            
            // Actualizar el objeto review original
            if (newIsHelpful) {
                // Añadir el ID del usuario actual al array de helpful si no está
                const token = getToken()
                const decodedToken = jwtDecode(token)
                const userId = decodedToken.id
                
                if (!review.helpful.includes(userId)) {
                    review.helpful.push(userId)
                }
            } else {
                // Eliminar el ID del usuario actual del array de helpful
                const token = getToken()
                const decodedToken = jwtDecode(token)
                const userId = decodedToken.id
                
                review.helpful = review.helpful.filter(id => id !== userId)
            }
            
            // Notificar al componente padre sobre la actualización
            if (onUpdated) {
                onUpdated(review._id, { helpful: review.helpful })
            }
        } catch (error) {
            // Revertir cambios locales en caso de error
            setIsHelpful(!isHelpful)
            setHelpfulCount(prev => isHelpful ? prev + 1 : prev - 1)
            console.error('Error al alternar útil:', error)
            alert('Error al marcar como útil. Por favor, inténtalo de nuevo.')
        }
    }
    
    /**
     * Maneja la eliminación de la reseña con confirmación
     */
    const handleDelete = async () => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar esta reseña?')) {
            return
        }
        
        try {
            setIsLoading(true)
            await deleteReview(review._id)
            // Notificar al componente padre sobre la eliminación
            onDeleted && onDeleted(review._id)
        } catch (error) {
            console.error('Error al eliminar reseña:', error)
            alert('Error al eliminar la reseña')
        } finally {
            setIsLoading(false)
        }
    }
    
    /**
     * Maneja la actualización de la reseña
     */
    const handleUpdate = async () => {
        // Validar contenido mínimo
        if (!editContent.trim() || editContent.length < 10) {
            alert('El contenido debe tener al menos 10 caracteres')
            return
        }
        
        setIsLoading(true)
        try {
            // Pasar los parámetros como argumentos separados, no como un objeto
            await updateReview(review._id, editContent, editRating)
            
            // Actualizar el estado local de la reseña
            review.content = editContent
            review.rating = editRating
            
            setIsEditing(false)
            
            // Notificar al componente padre sobre la actualización
            if (onUpdated) {
                onUpdated(review._id, { content: editContent, rating: editRating })
            }
            
        } catch (error) {
            console.error('Error al actualizar reseña:', error)
            alert('Error al actualizar la reseña')
        } finally {
            setIsLoading(false)
        }
    }
    
    /**
     * Cancela la edición y restaura los valores originales
     */
    const handleCancelEdit = () => {
        setEditContent(review.content)
        setEditRating(review.rating)
        setIsEditing(false)
    }
    
    /**
     * Formatea una fecha para mostrar en formato español
     * @param {string} dateString - Fecha en formato string
     * @returns {string} Fecha formateada
     */
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }
    
    /**
     * Renderiza las estrellas de calificación basadas en el rating
     * @param {number} rating - Calificación del 0 al 10
     * @returns {Array} Array de elementos SVG de estrellas
     */
    const renderStars = (rating) => {
        const stars = []
        const fullStars = Math.floor(rating / 2) // Convertir de escala 0-10 a 0-5
        const hasHalfStar = rating % 2 !== 0
        
        // Generar 5 estrellas
        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                // Estrella completa
                stars.push(
                    <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                )
            } else if (i === fullStars && hasHalfStar) {
                // Media estrella
                stars.push(
                    <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <defs>
                            <linearGradient id={`half-${i}`}>
                                <stop offset="50%" stopColor="currentColor"/>
                                <stop offset="50%" stopColor="transparent"/>
                            </linearGradient>
                        </defs>
                        <path fill={`url(#half-${i})`} d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                )
            } else {
                // Estrella vacía
                stars.push(
                    <svg key={i} className="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                )
            }
        }
        
        return stars
    }
    
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            {/* Encabezado de la reseña */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                    {/* Avatar del autor */}
                    {!isOwn && (
                        <img 
                            src={review.author?.avatar || '/default-avatar.png'} 
                            alt={review.author?.username || "Usuario desconocido"}
                            className="w-16 h-16 object-cover rounded-lg border border-gray-200" 
                        />
                    )}

                    {/* Información del juego, nombre de usuario y fecha */}
                    <div>
                        <h3 
                            className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer"
                            onClick={() => navigate(`/game/${review.game._id}`)}
                        >
                            {review.game.name}
                        </h3>

                        {!isOwn && (
                            <div>
                                <p className="text-sm text-gray-600">
                                    Por {review.author?.username || "usuario desconocido"}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {formatDate(review.createdAt)}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Calificación y acciones */}
                <div className="flex items-center space-x-2">
                    {isEditing ? (
                        // Selector de calificación en modo edición
                        <select 
                            value={editRating} 
                            onChange={(event) => setEditRating(Number(event.target.value))}
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                            {[...Array(11)].map((_, i) => (
                                <option key={i} value={i}>{i}/10</option>
                            ))}
                        </select>
                    ) : (
                        // Mostrar estrellas y calificación
                        <div className="flex items-center space-x-1">
                            <div className="flex">{renderStars(review.rating)}</div>
                            <span className="text-sm font-medium text-gray-700">
                                {review.rating}/10
                            </span>
                        </div>
                    )}
                    
                    {/* Botones de acción para reseñas propias */}
                    {isOwn && (
                        <div className="flex space-x-1">
                            {isEditing ? (
                                // Botones de guardar y cancelar
                                <>
                                    <button
                                        onClick={handleUpdate}
                                        disabled={isLoading}
                                        className="text-green-600 hover:text-green-800 p-1"
                                        title="Guardar cambios"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={handleCancelEdit}
                                        disabled={isLoading}
                                        className="text-gray-600 hover:text-gray-800 p-1"
                                        title="Cancelar edición"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </>
                            ) : (
                                // Botones de editar y eliminar
                                <>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="text-blue-600 hover:text-blue-800 p-1"
                                        title="Editar reseña"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        disabled={isLoading}
                                        className="text-red-600 hover:text-red-800 p-1"
                                        title="Eliminar reseña"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
            
            {/* Contenido de la reseña */}
            <div className="mb-4">
                {isEditing ? (
                    // Textarea para editar contenido
                    <textarea
                        value={editContent}
                        onChange={(event) => setEditContent(event.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={4}
                        minLength={10}
                        maxLength={2000}
                        placeholder="Escribe tu reseña aquí..."
                    />
                ) : (
                    // Mostrar contenido de la reseña
                    <p className="text-gray-700 leading-relaxed">{review.content}</p>
                )}
            </div>
            
            {/* Estadísticas e interacciones */}
            <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex space-x-4">
                    {/* Botón de "me gusta" */}
                    <button 
                        onClick={() => handleLike(review._id)}
                        className="flex items-center space-x-1 hover:text-red-500 transition-colors"
                    >
                        <svg className="w-4 h-4" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span>{likesCount} me gusta</span>
                    </button>
                    
                    {/* Botón de "útil" */}
                    <button 
                        onClick={() => handleHelpful(review._id)}
                        className="flex items-center space-x-1 hover:text-blue-500 transition-colors"
                    >
                        <svg className="w-4 h-4" fill={isHelpful ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                        <span>{helpfulCount} útiles</span>
                    </button>
                </div>
                
                {/* Indicador de edición */}
                {review.updatedAt !== review.createdAt && (
                    <span className="text-xs text-gray-400">
                        Editado el {formatDate(review.updatedAt)}
                    </span>
                )}
            </div>
        </div>
    )
}

export default ReviewCard