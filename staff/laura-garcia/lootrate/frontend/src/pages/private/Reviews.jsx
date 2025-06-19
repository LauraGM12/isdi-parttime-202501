/**
 * @fileoverview Página de gestión de reseñas del usuario
 * @description Componente para mostrar, gestionar y navegar por las reseñas del usuario
 * @author LootRate Team
 * @version 1.0.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header'
import ReviewCard from '../../components/ReviewCard'
import { getOwnReviews } from '../../logic/reviews/reviewsUser'
import { getOwnProfile } from '../../logic/users/profileUser'
import { errors } from 'common'
import getToken from '../../helpers/getToken'

/**
 * Componente de gestión de reseñas del usuario
 * 
 * @description Página que muestra todas las reseñas escritas por el usuario,
 * con funcionalidades de scroll infinito, estadísticas y gestión.
 * 
 * @component
 * @example
 * // Uso básico del componente
 * <Reviews />
 * 
 * @returns {JSX.Element} Página de reseñas con scroll infinito y estadísticas
 * 
 * @features
 * - Lista de todas las reseñas del usuario
 * - Scroll infinito para carga progresiva
 * - Estadísticas de reseñas (total, likes, útiles)
 * - Edición y eliminación de reseñas
 * - Estados de carga y error
 * - Sincronización con cambios de perfil
 * 
 * @performance
 * - Carga paginada de reseñas (10 por página)
 * - Intersection Observer para scroll infinito
 * - Optimización de re-renders con useCallback
 */
const Reviews = () => {
    const navigate = useNavigate()
    
    // Estados para datos del usuario y reseñas
    const [user, setUser] = useState(null)
    const [reviews, setReviews] = useState([])
    
    // Estados para carga y paginación
    const [isLoading, setIsLoading] = useState(true)
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const [error, setError] = useState(null)
    const [hasMore, setHasMore] = useState(true)
    const [page, setPage] = useState(1)
    const [totalReviews, setTotalReviews] = useState(0)
    
    // Ref para el observer del scroll infinito
    const observer = useRef()
    
    /**
     * Efectos para cargar datos iniciales
     */
    useEffect(() => {
        loadUserData()
        loadReviews()
    }, [])
    
    /**
     * Función para cargar los datos del usuario
     * 
     * @async
     * @function loadUserData
     * @description Obtiene el perfil del usuario autenticado
     * @returns {Promise<void>}
     */
    const loadUserData = async () => {
        try {
            const token = getToken()
            if (!token) {
                navigate('/login')
                return
            }
            
            const userData = await getOwnProfile(token)
            setUser(userData)
        } catch (err) {
            console.error('Error cargando datos del usuario:', err)
        }
    }
    
    /**
     * Función para cargar reseñas del usuario
     * 
     * @async
     * @function loadReviews
     * @param {number} pageNum - Número de página a cargar
     * @param {boolean} append - Si true, añade a las reseñas existentes; si false, las reemplaza
     * @description Carga reseñas con paginación
     * @returns {Promise<void>}
     */
    const loadReviews = async (pageNum = 1, append = false) => {
        try {
            if (pageNum === 1) {
                setIsLoading(true)
            } else {
                setIsLoadingMore(true)
            }
            setError(null)
            
            const data = await getOwnReviews(pageNum, 10)
            
            if (append) {
                setReviews(prev => [...prev, ...data.reviews])
            } else {
                setReviews(data.reviews)
            }
            
            setTotalReviews(data.pagination.total)
            setHasMore(data.reviews.length === 10 && pageNum < data.pagination.pages)
            
        } catch (err) {
            console.error('Error cargando reseñas:', err)
            setError(err.message || 'Error al cargar las reseñas')
        } finally {
            setIsLoading(false)
            setIsLoadingMore(false)
        }
    }
    
    /**
     * Función para cargar más reseñas (scroll infinito)
     * 
     * @function loadMoreReviews
     * @description Carga la siguiente página de reseñas
     */
    const loadMoreReviews = useCallback(() => {
        if (hasMore && !isLoadingMore) {
            const nextPage = page + 1
            setPage(nextPage)
            loadReviews(nextPage, true)
        }
    }, [hasMore, isLoadingMore, page])
    
    /**
     * Ref callback para el último elemento (Intersection Observer)
     * 
     * @function lastReviewElementRef
     * @param {HTMLElement} node - Elemento DOM del último review
     * @description Configura el observer para detectar cuando se llega al final
     */
    const lastReviewElementRef = useCallback(node => {
        if (isLoadingMore) return
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                loadMoreReviews()
            }
        })
        if (node) observer.current.observe(node)
    }, [isLoadingMore, hasMore, loadMoreReviews])
    
    /**
     * Manejar eliminación de reseña
     * 
     * @function handleReviewDeleted
     * @param {string} reviewId - ID de la reseña eliminada
     * @description Actualiza el estado local tras eliminar una reseña
     */
    const handleReviewDeleted = (reviewId) => {
        setReviews(prev => prev.filter(review => review._id !== reviewId))
        setTotalReviews(prev => prev - 1)
    }
    
    /**
     * Manejar actualización de reseña
     * 
     * @function handleReviewUpdated
     * @param {string} reviewId - ID de la reseña actualizada
     * @param {Object} updatedData - Datos actualizados de la reseña
     * @description Actualiza el estado local tras editar una reseña
     */
    const handleReviewUpdated = (reviewId, updatedData) => {
        setReviews(prev => prev.map(review => 
            review._id === reviewId 
                ? { ...review, ...updatedData }
                : review
        ))
    }
    
    /**
     * Función para refrescar datos del usuario
     * 
     * @async
     * @function refreshUserData
     * @description Recarga los datos del usuario desde el backend
     * @returns {Promise<void>}
     */
    const refreshUserData = async () => {
        try {
            const token = getToken()
            if (token) {
                const userData = await getOwnProfile(token)
                setUser(userData)
            }
        } catch (err) {
            console.error('Error refrescando datos del usuario:', err)
        }
    }
    
    /**
     * Efecto para escuchar cambios en localStorage y eventos de perfil
     */
    useEffect(() => {
        const handleStorageChange = () => {
            refreshUserData()
        }
        
        window.addEventListener('storage', handleStorageChange)
        window.addEventListener('profileUpdated', handleStorageChange)
        
        return () => {
            window.removeEventListener('storage', handleStorageChange)
            window.removeEventListener('profileUpdated', handleStorageChange)
        }
    }, [])
    
    // Estado de error
    if (error) {
        return (
            <div className="min-h-screen bg-gray-100">
                <Header user={user} />
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
                        <p className="text-red-600 mb-4">{error}</p>
                        <button 
                            onClick={() => loadReviews()}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                        >
                            Reintentar
                        </button>
                    </div>
                </div>
            </div>
        )
    }
    
    return (
        <div className="min-h-screen bg-gray-100">
            <Header user={user} />
            
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Header de la página */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Reseñas</h1>
                    <p className="text-gray-600">Gestiona y revisa todas tus reseñas de juegos</p>
                </div>
                
                {/* Estadísticas de reseñas */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{totalReviews}</div>
                            <div className="text-sm text-gray-600">Total de Reseñas</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                                {reviews.reduce((sum, review) => sum + review.likes.length, 0)}
                            </div>
                            <div className="text-sm text-gray-600">Likes Recibidos</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">
                                {reviews.reduce((sum, review) => sum + review.helpful.length, 0)}
                            </div>
                            <div className="text-sm text-gray-600">Marcadas como Útiles</div>
                        </div>
                    </div>
                </div>
                
                {/* Lista de reseñas */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <div className="text-gray-400 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes reseñas aún</h3>
                        <p className="text-gray-600 mb-4">Comienza escribiendo reseñas de tus juegos favoritos</p>
                        <button
                            onClick={() => navigate('/home')}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Explorar Juegos
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {reviews.map((review, index) => {
                            // Asignar ref al último elemento para scroll infinito
                            if (reviews.length === index + 1) {
                                return (
                                    <div key={review._id} ref={lastReviewElementRef}>
                                        <ReviewCard 
                                            review={review} 
                                            isOwn={true}
                                            onDeleted={handleReviewDeleted}
                                            onUpdated={handleReviewUpdated}
                                        />
                                    </div>
                                )
                            } else {
                                return (
                                    <ReviewCard 
                                        key={review._id}
                                        review={review} 
                                        isOwn={true}
                                        onDeleted={handleReviewDeleted}
                                        onUpdated={handleReviewUpdated}
                                    />
                                )
                            }
                        })}
                        
                        {/* Indicador de carga para más elementos */}
                        {isLoadingMore && (
                            <div className="flex justify-center items-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                <span className="ml-2 text-gray-600">Cargando más reseñas...</span>
                            </div>
                        )}
                        
                        {/* Mensaje cuando no hay más elementos */}
                        {!hasMore && reviews.length > 0 && (
                            <div className="text-center py-8">
                                <p className="text-gray-500">Has visto todas tus reseñas</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Reviews