import React from 'react'
// Importamos el componente GameCard para mostrar el juego destacado
import GameCard from './GameCard'

/**
 * Componente para mostrar un juego destacado en la página principal
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.game - Objeto del juego a destacar
 * @returns {JSX.Element|null} Componente del juego destacado o null si no hay juego
 */
const FeaturedGame = ({ game }) => {
    // Si no hay juego proporcionado, no renderizamos nada
    if (!game) {
        return null
    }

    return (
        <div className="mb-8">
            {/* Título de la sección destacada */}
            <h2 className="text-2xl font-bold text-white mb-4">Destacado</h2>
            
            {/* Contenedor del juego destacado */}
            <div className="relative">
                {/* Renderizamos el juego usando GameCard en tamaño grande */}
                <GameCard game={game} size="large" />
                
                {/* Información adicional superpuesta sobre la imagen */}
                <div className="absolute top-4 left-4 right-4">
                    <div className="flex items-center justify-between">
                        {/* Badge indicador de "Destacado" */}
                        <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-3 py-1 rounded-full">
                            <span className="text-white text-sm font-medium">Destacado</span>
                        </div>
                        
                        {/* Lista de plataformas disponibles */}
                        {game.platforms && game.platforms.length > 0 && (
                            <div className="flex space-x-2">
                                {/* Mostramos máximo 4 plataformas */}
                                {game.platforms.slice(0, 4).map((platform) => (
                                    <div 
                                        key={platform.platform.id}
                                        className="bg-black/50 backdrop-blur-sm p-2 rounded"
                                        title={platform.platform.name}
                                    >
                                        {/* Iconos simplificados de plataformas (placeholder) */}
                                        <div className="w-4 h-4 bg-white/70 rounded-sm" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

// Exportamos el componente
export default FeaturedGame