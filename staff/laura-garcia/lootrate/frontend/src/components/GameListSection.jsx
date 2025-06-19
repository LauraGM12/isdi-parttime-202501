import React from 'react'
import GameCard from './GameCard'

/**
 * Componente para mostrar una sección de lista de juegos con estados de carga y error
 * @param {Object} props - Propiedades del componente
 * @param {string} props.title - Título de la sección
 * @param {Array} props.games - Array de juegos a mostrar
 * @param {boolean} props.isLoading - Estado de carga
 * @param {string} props.error - Mensaje de error si existe
 * @param {string} props.emptyMessage - Mensaje cuando no hay juegos
 * @returns {JSX.Element} Sección de lista de juegos
 */
const GameListSection = ({ title, games, isLoading, error, emptyMessage }) => {
    // Estado de carga - mostrar spinner
    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
                <div className="flex justify-center py-8">
                    {/* Spinner de carga animado */}
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
            </div>
        )
    }

    // Estado de error - mostrar mensaje de error
    if (error) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
                <div className="text-center py-8">
                    <p className="text-red-600">{error}</p>
                </div>
            </div>
        )
    }

    // Asegurarse de que games sea un array antes de filtrar
    const gamesArray = Array.isArray(games) ? games : [];
    
    // Filtrar juegos válidos que tengan un ID identificable
    const validGames = gamesArray.filter(game => game && (game._id || game.id || game.gameId));

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            {/* Título de la sección */}
            <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
            
            {validGames.length > 0 ? (
                // Grid responsivo de juegos
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {validGames.map((game) => (
                        <GameCard key={game._id || game.id || game.gameId} game={game} />
                    ))}
                </div>
            ) : (
                // Mensaje cuando no hay juegos disponibles
                <div className="text-center py-8">
                    <p className="text-gray-500">{emptyMessage}</p>
                </div>
            )}
        </div>
    )
}

export default GameListSection