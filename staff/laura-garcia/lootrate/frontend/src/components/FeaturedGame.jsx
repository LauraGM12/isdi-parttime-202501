import GameCard from './GameCard'

const FeaturedGame = ({ game }) => {
    if (!game) {
        return null
    }

    return (
        <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Destacado</h2>
            
            <div className="relative">
                <GameCard game={game} size="large" />
                
                <div className="absolute top-4 left-4 right-4">
                    <div className="flex items-center justify-between">
                        <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-3 py-1 rounded-full">
                            <span className="text-white text-sm font-medium">Destacado</span>
                        </div>
                        
                        {game.platforms && game.platforms.length > 0 && (
                            <div className="flex space-x-2">
                                {game.platforms.slice(0, 4).map((platform) => (
                                    <div 
                                        key={platform.platform.id}
                                        className="bg-black/50 backdrop-blur-sm p-2 rounded"
                                        title={platform.platform.name}
                                    >
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

export default FeaturedGame