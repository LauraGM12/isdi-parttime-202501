import React from 'react'
import GameCard from './GameCard'

const GameListSection = ({ title, games, isLoading, error, emptyMessage }) => {
    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
            </div>
        )
    }

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

    const gamesArray = Array.isArray(games) ? games : [];
    
    const validGames = gamesArray.filter(game => game && (game._id || game.id || game.gameId));

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
            
            {validGames.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {validGames.map((game) => (
                        <GameCard key={game._id || game.id || game.gameId} game={game} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-8">
                    <p className="text-gray-500">{emptyMessage}</p>
                </div>
            )}
        </div>
    )
}

export default GameListSection