import React from 'react'

/**
 * Componente de tarjeta de perfil de usuario
 * Muestra información del usuario incluyendo avatar, datos personales y preferencias
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.user - Datos del usuario a mostrar
 * @param {boolean} props.isOwnProfile - Si es el perfil del usuario actual
 * @param {Function} props.onEditClick - Función callback para editar perfil
 * @returns {JSX.Element} Tarjeta de perfil del usuario
 */
const ProfileCard = ({ user, isOwnProfile = false, onEditClick }) => {
    /**
     * Formatea una fecha para mostrar en formato español
     * @param {string} dateString - Fecha en formato string
     * @returns {string} Fecha formateada o mensaje por defecto
     */
    const formatDate = (dateString) => {
        if (!dateString) return 'No especificado'
        return new Date(dateString).toLocaleDateString('es-ES')
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            {/* Sección principal con avatar y datos básicos */}
            <div className="flex items-center space-x-4">
                {/* Avatar del usuario */}
                <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
                    {user.avatar ? (
                        <img 
                            src={user.avatar} 
                            alt={user.username} 
                            className="w-20 h-20 rounded-full object-cover"
                        />
                    ) : (
                        // Inicial del nombre de usuario como fallback
                        <span className="text-2xl text-gray-600">
                            {user.username?.charAt(0).toUpperCase()}
                        </span>
                    )}
                </div>
                
                {/* Información básica del usuario */}
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900">{user.username}</h1>
                    {/* Nombre completo si está disponible */}
                    {user.firstName && user.lastName && (
                        <p className="text-gray-600">{user.firstName} {user.lastName}</p>
                    )}
                    {/* Fecha de registro */}
                    <p className="text-gray-500 text-sm">
                        Miembro desde: {formatDate(user.createdAt || user.registeredAt)}
                    </p>
                </div>
                
                {/* Botón de editar perfil (solo para el propio perfil) */}
                {isOwnProfile && (
                    <button
                        onClick={onEditClick}
                        className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        Editar Perfil
                    </button>
                )}
            </div>
            
            {/* Biografía del usuario */}
            {user.bio && (
                <div className="mt-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Biografía</h3>
                    <p className="text-gray-700">{user.bio}</p>
                </div>
            )}
            
            {/* Géneros favoritos */}
            {user.favoriteGenres && user.favoriteGenres.length > 0 && (
                <div className="mt-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Géneros Favoritos</h3>
                    <div className="flex flex-wrap gap-2">
                        {user.favoriteGenres.map((genre, index) => (
                            <span 
                                key={index}
                                className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                            >
                                {genre}
                            </span>
                        ))}
                    </div>
                </div>
            )}
            
            {/* Plataformas favoritas */}
            {user.favoritePlatforms && user.favoritePlatforms.length > 0 && (
                <div className="mt-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Plataformas Favoritas</h3>
                    <div className="flex flex-wrap gap-2">
                        {user.favoritePlatforms.map((platform, index) => (
                            <span 
                                key={index}
                                className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                            >
                                {platform}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProfileCard