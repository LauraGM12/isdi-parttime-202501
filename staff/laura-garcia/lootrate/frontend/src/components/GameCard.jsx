import React from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * Componente de tarjeta de juego reutilizable
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.game - Datos del juego a mostrar
 * @param {string} props.size - Tamaño de la tarjeta ('normal' o 'large')
 * @param {boolean} props.featured - Si el juego es destacado (muestra botón de play)
 * @returns {JSX.Element} Tarjeta del juego
 */
const GameCard = ({ game, size = 'normal', featured = false }) => {
    // Log para depuración - verificar datos recibidos
    console.log('GameCard recibió datos del juego:', game)
    
    const navigate = useNavigate()
    
    /**
     * Maneja el evento de clic en la tarjeta para navegar a la página del juego
     */
    const handleClick = () => {
        // Obtener el ID del juego de diferentes posibles propiedades
        const gameId = game?.id || game?.gameId
        console.log('Intentando navegar con ID del juego:', gameId)
        
        // Validar que tenemos un ID válido antes de navegar
        if (!game || !gameId) {
            console.error('No se puede navegar: falta el ID del juego', { game })
            return
        }
        
        // Navegar a la página de detalles del juego
        navigate(`/game/${gameId}`)
    }
    
    /**
     * Formatea una fecha para mostrar en formato legible
     * @param {string} dateString - Fecha en formato string
     * @returns {string} Fecha formateada o 'Por anunciar'
     */
    const formatDate = (dateString) => {
        if (!dateString) return 'Por anunciar'
        const date = new Date(dateString)
        return date.toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        })
    }

    /**
     * Formatea la calificación del juego
     * @param {number} rating - Calificación numérica
     * @returns {string} Calificación formateada o 'N/A'
     */
    const formatRating = (rating) => {
        if (!rating) return 'N/A'
        return rating.toFixed(1)
    }

    // Clases CSS dinámicas según el tamaño especificado
    const cardClasses = size === 'large' 
        ? 'w-full h-64 relative rounded-lg overflow-hidden cursor-pointer group'
        : 'w-full h-48 relative rounded-lg overflow-hidden cursor-pointer group'

    // Obtener nombre e imagen del juego de diferentes propiedades posibles
    const gameName = game?.name || game?.gameName
    const gameImage = game?.background_image || game?.gameImage

    return (
        <div className={cardClasses} onClick={handleClick}>
            {/* Imagen de fondo del juego */}
            <img 
                src={gameImage || '/placeholder-game.jpg'} 
                alt={gameName}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            
            {/* Gradiente superpuesto para mejorar legibilidad del texto */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            {/* Información del juego superpuesta */}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                {/* Título del juego */}
                <h3 className={`font-bold mb-1 ${size === 'large' ? 'text-xl' : 'text-lg'}`}>
                    {gameName}
                </h3>
                
                {/* Información adicional: rating, metacritic y fecha */}
                <div className="flex items-center justify-between text-sm opacity-90">
                    <div className="flex items-center space-x-2">
                        {/* Calificación con estrella */}
                        <div className="flex items-center">
                            <span className="text-yellow-400">★</span>
                            <span className="ml-1">{formatRating(game.rating)}</span>
                        </div>
                        
                        {/* Puntuación de Metacritic si está disponible */}
                        {game.metacritic && (
                            <div className="bg-green-600 px-2 py-1 rounded text-xs">
                                {game.metacritic}
                            </div>
                        )}
                    </div>
                    
                    {/* Fecha de lanzamiento */}
                    <span>{formatDate(game.released)}</span>
                </div>
                
                {/* Géneros del juego */}
                {game.genres && game.genres.length > 0 && (
                    <div className="mt-2">
                        <div className="flex flex-wrap gap-1">
                            {game.genres.slice(0, 3).map((genre) => (
                                <span 
                                    key={genre.id} 
                                    className="bg-white/20 px-2 py-1 rounded-full text-xs"
                                >
                                    {genre.name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            
            {/* Solo mostrar el botón de play para juegos destacados */}
            {featured && (
                <div 
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-4 transition-opacity opacity-0 group-hover:opacity-100"
                    onClick={(event) => {
                        event.stopPropagation(); // Evitar que el clic se propague a la tarjeta
                        handleClick();
                    }}
                >
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                </div>
            )}
        </div>
    )
}

export default GameCard