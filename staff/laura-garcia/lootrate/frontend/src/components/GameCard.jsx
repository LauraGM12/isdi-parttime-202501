import React from 'react'
import { useNavigate } from 'react-router-dom'

const GameCard = ({ game, size = 'normal', featured = false }) => {
    const navigate = useNavigate()

    const handleClick = () => {
        const gameId = game?.id || game?.gameId
        
        if (!game || !gameId) {
            console.error('No se puede navegar: falta el ID del juego', { game })
            return
        }
        
        navigate(`/game/${gameId}`)
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'Por anunciar'
        const date = new Date(dateString)
        return date.toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        })
    }

    const formatRating = (rating) => {
        if (!rating) return 'N/A'
        return rating.toFixed(1)
    }

    const cardClasses = size === 'large' 
        ? 'w-full h-64 relative rounded-lg overflow-hidden cursor-pointer group'
        : 'w-full h-48 relative rounded-lg overflow-hidden cursor-pointer group'

    const gameName = game?.name || game?.gameName
    const gameImage = game?.background_image || game?.gameImage

    return (
        <div className={cardClasses} onClick={handleClick}>
            <img 
                src={gameImage || '/placeholder-game.jpg'} 
                alt={gameName}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className={`font-bold mb-1 ${size === 'large' ? 'text-xl' : 'text-lg'}`}>
                    {gameName}
                </h3>
                
                <div className="flex items-center justify-between text-sm opacity-90">
                    <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                            <span className="text-yellow-400">★</span>
                            <span className="ml-1">{formatRating(game.rating)}</span>
                        </div>

                        {game.metacritic && (
                            <div className="bg-green-600 px-2 py-1 rounded text-xs">
                                {game.metacritic}
                            </div>
                        )}
                    </div>
                    
                    <span>{formatDate(game.released)}</span>
                </div>
                
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
            
            {featured && (
                <div 
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-4 transition-opacity opacity-0 group-hover:opacity-100"
                    onClick={(evento) => {
                        evento.stopPropagation();
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