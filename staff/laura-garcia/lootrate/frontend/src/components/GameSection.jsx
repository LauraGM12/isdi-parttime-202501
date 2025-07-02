import React from 'react'
import GameCard from './GameCard'

const GameSection = ({ title, games, showAll = false, onSeeAll }) => {
    if (!games || games.length === 0) {
        return null
    }

    const displayedGames = showAll ? games : games.slice(0, 6)

    return (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">{title}</h2>
                
                {!showAll && games.length > 6 && onSeeAll && (
                    <button 
                        onClick={onSeeAll}
                        className="text-blue-400 hover:text-blue-300 transition-colors duration-200 text-sm font-medium"
                    >
                        Ver todos →
                    </button>
                )}
            </div>
            
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

export default GameSection