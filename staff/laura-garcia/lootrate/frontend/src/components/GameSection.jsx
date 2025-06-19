import React from 'react'
import GameCard from './GameCard'

/**
 * Componente para mostrar una sección de juegos con opción de ver todos
 * @param {Object} props - Propiedades del componente
 * @param {string} props.title - Título de la sección
 * @param {Array} props.games - Array de juegos a mostrar
 * @param {boolean} props.showAll - Si mostrar todos los juegos o limitarlos
 * @param {Function} props.onSeeAll - Función callback para el botón "Ver todos"
 * @returns {JSX.Element|null} Sección de juegos o null si no hay juegos
 */
const GameSection = ({ title, games, showAll = false, onSeeAll }) => {
    // Si no hay juegos disponibles, no renderizamos nada
    if (!games || games.length === 0) {
        return null
    }

    // Limitamos los juegos mostrados a 6 si no es showAll
    const displayedGames = showAll ? games : games.slice(0, 6)

    return (
        <div className="mb-8">
            {/* Encabezado de la sección con título y botón opcional */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">{title}</h2>
                
                {/* Botón "Ver todos" si hay más de 6 juegos y no estamos mostrando todos */}
                {!showAll && games.length > 6 && onSeeAll && (
                    <button 
                        onClick={onSeeAll}
                        className="text-blue-400 hover:text-blue-300 transition-colors duration-200 text-sm font-medium"
                    >
                        Ver todos →
                    </button>
                )}
            </div>
            
            {/* Grid responsivo de juegos */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {displayedGames.map((game) => (
                    <GameCard 
                        key={game.id} 
                        game={game} 
                        size="normal"
                    />
                ))}
            </div>
        </div>
    )
}

// Exportamos el componente para su uso en otros archivos
export default GameSection