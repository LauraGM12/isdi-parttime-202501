import React from 'react'

const ProfileCard = ({ user, isOwnProfile = false, onEditClick }) => {
    const formatDate = (dateString) => {
        if (!dateString) return 'No especificado'
        return new Date(dateString).toLocaleDateString('es-ES')
    }

    const translateGenre = (genreName) => {
        const translations = {
            'Action': 'Acción',
            'Adventure': 'Aventura',
            'RPG': 'RPG',
            'Strategy': 'Estrategia',
            'Shooter': 'Disparos',
            'Puzzle': 'Puzzle',
            'Racing': 'Carreras',
            'Sports': 'Deportes',
            'Simulation': 'Simulación',
            'Fighting': 'Lucha',
            'Platform': 'Plataformas',
            'Arcade': 'Arcade',
            'Family': 'Familiar',
            'Board Games': 'Juegos de Mesa',
            'Educational': 'Educativo',
            'Card': 'Cartas',
            'Casino': 'Casino',
            'Indie': 'Indie',
            'Massively Multiplayer': 'Multijugador Masivo'
        }
        return translations[genreName] || genreName
    }

    const translatePlatform = (platformName) => {
        const translations = {
            'PC': 'PC',
            'PlayStation': 'PlayStation',
            'Xbox': 'Xbox',
            'Nintendo Switch': 'Nintendo Switch',
            'iOS': 'iOS',
            'Android': 'Android',
            'PlayStation 5': 'PlayStation 5',
            'PlayStation 4': 'PlayStation 4',
            'Xbox Series S/X': 'Xbox Series S/X',
            'Xbox One': 'Xbox One',
            'Nintendo 3DS': 'Nintendo 3DS',
            'PS Vita': 'PS Vita',
            'Web': 'Web',
            'Linux': 'Linux',
            'macOS': 'macOS'
        }
        return translations[platformName] || platformName
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
                    {user.avatar ? (
                        <img 
                            src={user.avatar} 
                            alt={user.username} 
                            className="w-20 h-20 rounded-full object-cover"
                        />
                    ) : (
                        <span className="text-2xl text-gray-600">
                            {user.username?.charAt(0).toUpperCase()}
                        </span>
                    )}
                </div>
                
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900">{user.username}</h1>
                    {user.firstName && user.lastName && (
                        <p className="text-gray-600">{user.firstName} {user.lastName}</p>
                    )}
                    <p className="text-gray-500 text-sm">
                        Miembro desde: {formatDate(user.createdAt || user.registeredAt)}
                    </p>
                </div>
                
                {isOwnProfile && (
                    <button
                        onClick={onEditClick}
                        className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        Editar Perfil
                    </button>
                )}
            </div>
            
            {user.bio && (
                <div className="mt-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Biografía</h3>
                    <p className="text-gray-700">{user.bio}</p>
                </div>
            )}
            
            {user.favoriteGenres && user.favoriteGenres.length > 0 && (
                <div className="mt-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Géneros Favoritos</h3>
                    <div className="flex flex-wrap gap-2">
                        {user.favoriteGenres?.map((genre, index) => (
                            <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                                {translateGenre(genre)}
                            </span>
                        ))}
                    </div>
                </div>
            )}
            
            {user.favoritePlatforms && user.favoritePlatforms.length > 0 && (
                <div className="mt-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Plataformas Favoritas</h3>
                    <div className="flex flex-wrap gap-2">
                        {user.favoritePlatforms?.map((platform, index) => (
                            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                {translatePlatform(platform)}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProfileCard