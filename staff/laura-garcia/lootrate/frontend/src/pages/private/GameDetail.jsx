import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getGameDetails, getGameStores } from '../../services/gameService'
import { addToGameList, removeFromGameList, getOwnGameList } from '../../logic/users/gameListsUser'
import { createReview, getGameReviews } from '../../logic/reviews/reviewsUser'
import { getOwnProfile } from '../../logic/users/profileUser'
import ReviewCard from '../../components/ReviewCard'
import Header from '../../components/Header.jsx'

const GameDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [game, setGame] = useState(null)
    const [stores, setStores] = useState([])
    const [loading, setLoading] = useState(true)
    const [userLists, setUserLists] = useState({
        wishlist: false,
        currentlyPlaying: false,
        completedGames: false
    })
    const [reviews, setReviews] = useState([])
    const [reviewContent, setReviewContent] = useState('')
    const [reviewRating, setReviewRating] = useState(10)
    const [isSubmittingReview, setIsSubmittingReview] = useState(false)
    const [error, setError] = useState(null)
    const [user, setUser] = useState(null)
    
    useEffect(() => {
        const loadGameData = async () => {
            // Verificar que id existe y es un número válido
            if (!id || isNaN(Number(id)) || id === 'undefined') {
                console.error('Game ID is undefined or invalid:', id);
                navigate('/404');
                return;
            }
            
            try {
                setLoading(true)
                setError(null)
                console.log('Loading game with ID:', id)
                
                const token = localStorage.getItem('token')
                
                // Cargar datos del usuario si hay token
                if (token) {
                    const userData = await getOwnProfile(token)
                    setUser(userData)
                    
                    // Cargar estado de las listas del usuario con validaciones
                    const [wishlist, currentlyPlaying, completedGames] = await Promise.all([
                        getOwnGameList('wishlist', token),
                        getOwnGameList('currentlyPlaying', token),
                        getOwnGameList('completedGames', token)
                    ])
                    
                    // Agregar validaciones para evitar errores de undefined
                    setUserLists({
                        wishlist: wishlist?.games?.some(game => game.gameId === id) || false,
                        currentlyPlaying: currentlyPlaying?.games?.some(game => game.gameId === id) || false,
                        completedGames: completedGames?.games?.some(game => game.gameId === id) || false
                    })
                }
                
                // Cargar datos del juego, tiendas y reseñas
                const [gameData, storesData, reviewsData] = await Promise.all([
                    getGameDetails(id),
                    getGameStores(id),
                    getGameReviews(id)
                ])
                
                // Verificar si el juego existe
                if (!gameData || !gameData.id) {
                    navigate('/404')
                    return
                }
                
                setGame(gameData)
                setStores(storesData.results || [])
                setReviews(reviewsData.reviews || [])
            } catch (error) {
                console.error('Error loading game data:', error)
                setError(error.message)
                // Si es un error 404, redirigir a NotFound
                if (error.message.includes('404') || error.message.includes('not found')) {
                    navigate('/404')
                }
            } finally {
                setLoading(false)
            }
        }

        loadGameData();
    }, [id, navigate]);

    // Mover la función handleSubmitReview DENTRO del componente
    const handleSubmitReview = async (event) => {
        event.preventDefault()
        if (!reviewContent.trim()) return
        
        try {
            setIsSubmittingReview(true)
            const token = localStorage.getItem('token')
            await createReview(id, reviewContent, reviewRating, token)
            
            // Limpiar formulario y recargar reseñas
            setReviewContent('')
            setReviewRating(10)
            const updatedReviews = await getGameReviews(id)
            setReviews(updatedReviews.reviews || [])
        } catch (error) {
            console.error('Error submitting review:', error)
        } finally {
            setIsSubmittingReview(false)
        }
    }

    const handleAddToList = async (listType) => {
        try {
            const token = localStorage.getItem('token')
            
            // Si ya está en la lista, removerlo; si no, agregarlo
            if (userLists[listType]) {
                await removeFromGameList(id, listType, token)
                setUserLists(prev => ({ ...prev, [listType]: false }))
            } else {
                await addToGameList(id, listType, token, game)
                setUserLists(prev => ({ ...prev, [listType]: true }))
            }
            
            // Forzar actualización del localStorage para sincronizar entre páginas
            window.dispatchEvent(new Event('gameListUpdated'))
            
        } catch (error) {
            console.error('Error managing list:', error)
            // Revertir el estado en caso de error
            const currentLists = await Promise.all([
                getOwnGameList('wishlist', token),
                getOwnGameList('currentlyPlaying', token),
                getOwnGameList('completedGames', token)
            ])
            
            setUserLists({
                wishlist: currentLists[0]?.games?.some(game => game.gameId === id) || false,
                currentlyPlaying: currentLists[1]?.games?.some(game => game.gameId === id) || false,
                completedGames: currentLists[2]?.games?.some(game => game.gameId === id) || false
            })
        }
    }

    // Eliminar el renderizado duplicado - mantener solo uno
    if (loading) return <div>Cargando...</div>
    if (error) return <div>Error: {error}</div>
    if (!game) return <div>Juego no encontrado</div>

    return (
        <div className="min-h-screen bg-gray-900">
            <Header user={user} />
            <div className="container mx-auto px-4 py-8">
                {/* Header del juego */}
                <div className="bg-gray-900 rounded-lg overflow-hidden mb-8">
                    <div className="relative h-96">
                        <img 
                            src={game.background_image} 
                            alt={game.name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end">
                            <div className="p-8">
                                <h1 className="text-4xl font-bold text-white mb-2">{game.name}</h1>
                                <div className="flex items-center gap-4 text-white">
                                    <span className="flex items-center">
                                        <span className="text-yellow-400 mr-1">★</span>
                                        {game.rating}
                                    </span>
                                    {game.metacritic && (
                                        <span className="bg-green-600 px-2 py-1 rounded">
                                            {game.metacritic}
                                        </span>
                                    )}
                                    <span>{game.released}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Información principal */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg p-6 mb-6">
                            <h2 className="text-2xl font-bold mb-4">Descripción</h2>
                            <div 
                                className="prose max-w-none"
                                dangerouslySetInnerHTML={{ __html: game.description }}
                            />
                        </div>

                        {/* FORMULARIO DE RESEÑA */}
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <h3 className="text-xl font-bold mb-4">Escribir una Reseña</h3>
                            <form onSubmit={handleSubmitReview}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-2">Puntuación</label>
                                    <select 
                                        value={reviewRating} 
                                        onChange={(e) => setReviewRating(Number(e.target.value))}
                                        className="border rounded px-3 py-2"
                                    >
                                        {[...Array(11)].map((_, i) => (
                                            <option key={i} value={i}>{i}/10</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-2">Reseña</label>
                                    <textarea
                                        value={reviewContent}
                                        onChange={(e) => setReviewContent(e.target.value)}
                                        className="w-full border rounded px-3 py-2 h-32"
                                        placeholder="Escribe tu reseña..."
                                        required
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={isSubmittingReview}
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                                >
                                    {isSubmittingReview ? 'Enviando...' : 'Enviar Reseña'}
                                </button>
                            </form>
                        </div>

                        {/* MOSTRAR RESEÑAS EXISTENTES */}
                        {reviews.length > 0 && (
                            <div className="bg-white rounded-lg p-6 mb-6">
                                <h3 className="text-xl font-bold mb-4">Reseñas</h3>
                                <div className="space-y-4">
                                    {reviews.map((review) => (
                                        <ReviewCard 
                                            key={review._id} 
                                            review={review} 
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Screenshots */}
                        {game.short_screenshots && (
                            <div className="bg-white rounded-lg p-6">
                                <h2 className="text-2xl font-bold mb-4">Capturas</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {game.short_screenshots.slice(1).map((screenshot, index) => (
                                        <img 
                                            key={index}
                                            src={screenshot.image}
                                            alt={`Screenshot ${index + 1}`}
                                            className="rounded-lg w-full h-32 object-cover"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Botones de acción */}
                        <div className="bg-white rounded-lg p-6">
                            <h3 className="text-xl font-bold mb-4">Añadir a mis listas</h3>
                            <div className="space-y-3">
                                <button 
                                    onClick={() => handleAddToList('wishlist')}
                                    className={`w-full py-2 px-4 rounded flex items-center justify-center transition-colors ${
                                        userLists.wishlist 
                                            ? 'bg-gray-400 hover:bg-gray-500 text-white' 
                                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                                    }`}
                                >
                                    <span className="mr-2">♡</span>
                                    {userLists.wishlist ? 'Quitar de Lista de Deseos' : 'Añadir a Lista de Deseos'}
                                </button>
                                
                                <button 
                                    onClick={() => handleAddToList('currentlyPlaying')}
                                    className={`w-full py-2 px-4 rounded flex items-center justify-center transition-colors ${
                                        userLists.currentlyPlaying 
                                            ? 'bg-gray-400 hover:bg-gray-500 text-white' 
                                            : 'bg-green-500 hover:bg-green-600 text-white'
                                    }`}
                                >
                                    <span className="mr-2">▶</span>
                                    {userLists.currentlyPlaying ? 'Quitar de Jugando' : 'Marcar como Jugando'}
                                </button>
                                
                                <button 
                                    onClick={() => handleAddToList('completedGames')}
                                    className={`w-full py-2 px-4 rounded flex items-center justify-center transition-colors ${
                                        userLists.completedGames 
                                            ? 'bg-gray-400 hover:bg-gray-500 text-white' 
                                            : 'bg-purple-500 hover:bg-purple-600 text-white'
                                    }`}
                                >
                                    <span className="mr-2">✓</span>
                                    {userLists.completedGames ? 'Quitar de Completados' : 'Marcar como Completado'}
                                </button>
                            </div>
                        </div>

                        {/* Información del juego */}
                        <div className="bg-white rounded-lg p-6">
                            <h3 className="text-xl font-bold mb-4">Información</h3>
                            <div className="space-y-3 text-sm">
                                <div>
                                    <span className="font-semibold">Desarrollador:</span>
                                    <div>{game.developers?.map(dev => dev.name).join(', ')}</div>
                                </div>
                                <div>
                                    <span className="font-semibold">Editor:</span>
                                    <div>{game.publishers?.map(pub => pub.name).join(', ')}</div>
                                </div>
                                <div>
                                    <span className="font-semibold">Plataformas:</span>
                                    <div>{game.platforms?.map(p => p.platform.name).join(', ')}</div>
                                </div>
                                <div>
                                    <span className="font-semibold">Géneros:</span>
                                    <div>{game.genres?.map(genre => genre.name).join(', ')}</div>
                                </div>
                                {game.playtime && (
                                    <div>
                                        <span className="font-semibold">Tiempo de juego:</span>
                                        <div>{game.playtime} horas</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Enlaces de compra */}
                        {stores.length > 0 && (
                            <div className="bg-white rounded-lg p-6">
                                <h3 className="text-xl font-bold mb-4">Dónde Comprar</h3>
                                <div className="space-y-2">
                                    {stores.map((store, index) => (
                                        <a 
                                            key={index}
                                            href={store.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block w-full bg-gray-100 hover:bg-gray-200 p-3 rounded text-center transition-colors"
                                        >
                                            {store.store?.name || 'Tienda'}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GameDetail