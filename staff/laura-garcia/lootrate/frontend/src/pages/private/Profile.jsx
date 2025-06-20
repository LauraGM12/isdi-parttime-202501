/**
 * @fileoverview Página de perfil de usuario (propio y público)
 * @description Componente que muestra el perfil de un usuario con sus listas de juegos
 * @author LootRate Team
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getUserProfile, getOwnProfile } from '../../logic/users/profileUser'
import { getGameList, getOwnGameList } from '../../logic/users/gameListsUser'
import ProfileCard from '../../components/ProfileCard'
import GameListSection from '../../components/GameListSection'
import Header from '../../components/Header'
import { errors } from 'common'
import getToken from '../../helpers/getToken'

/**
 * Componente de perfil de usuario
 * 
 * @description Muestra el perfil de un usuario (propio o público) con sus listas de juegos.
 * Determina automáticamente si es el perfil propio basándose en la presencia del parámetro username.
 * 
 * @component
 * @example
 * // Perfil propio (sin username en URL)
 * <Profile /> // /profile
 * 
 * // Perfil público (con username en URL)
 * <Profile /> // /profile/user/nombreusuario
 * 
 * @returns {JSX.Element} Página de perfil con información del usuario y listas de juegos
 * 
 * @features
 * - Visualización de perfil propio y público
 * - Listas de juegos (wishlist, jugando, completados)
 * - Edición de perfil (solo perfil propio)
 * - Carga diferenciada según tipo de perfil
 * - Manejo de estados de carga y error
 * 
 * @accessibility
 * - Navegación clara entre secciones
 * - Estados de carga descriptivos
 * - Mensajes de error informativos
 */
const Profile = () => {
    const { username } = useParams() // Obtener username de la URL
    const navigate = useNavigate()
    
    // Estados del componente
    const [user, setUser] = useState(null)
    const [wishlist, setWishlist] = useState([])
    const [currentlyPlaying, setCurrentlyPlaying] = useState([])
    const [completedGames, setCompletedGames] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [listsLoading, setListsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [listsError, setListsError] = useState(null)
    
    // Determinar si es el perfil propio
    const token = getToken()
    const isOwnProfile = !username // Si no hay username en la URL, es el perfil propio
    
    /**
     * Efecto para cargar datos cuando cambia el username
     */
    useEffect(() => {
        loadProfile()
        loadGameLists()
    }, [username])
    
    /**
     * Función para cargar el perfil del usuario
     * 
     * @async
     * @function loadProfile
     * @description Carga el perfil usando diferentes métodos según sea propio o público
     * @returns {Promise<void>}
     */
    const loadProfile = async () => {
        try {
            setIsLoading(true)
            setError(null)
            
            let profileData
            if (isOwnProfile) {
                // Para perfil propio, verificar autenticación
                if (!token) {
                    navigate('/login')
                    return
                }
                profileData = await getOwnProfile(token)
            } else {
                // Para perfil público, usar username
                profileData = await getUserProfile(username)
            }
            
            setUser(profileData)
        } catch (err) {
            console.error('Error cargando perfil:', err)
            setError(err.message || 'Error al cargar el perfil')
        } finally {
            setIsLoading(false)
        }
    }
    
    /**
     * Función para cargar las listas de juegos del usuario
     * 
     * @async
     * @function loadGameLists
     * @description Carga wishlist, juegos actuales y completados
     * @returns {Promise<void>}
     */
    const loadGameLists = async () => {
        try {
            setListsLoading(true);
            setListsError(null);
            
            let wishlistData, currentlyPlayingData, completedData;
            
            if (isOwnProfile) {
                // Para perfil propio, usar funciones con token
                const token = getToken();
                if (!token) {
                    navigate('/login');
                    return;
                }
                ;[wishlistData, currentlyPlayingData, completedData] = await Promise.all([
                    getOwnGameList('wishlist', token),
                    getOwnGameList('currentlyPlaying', token),
                    getOwnGameList('completedGames', token)
                ]);
            } else {
                // Para perfil público, usar username
                ;[wishlistData, currentlyPlayingData, completedData] = await Promise.all([
                    getGameList(username, 'wishlist'),
                    getGameList(username, 'currentlyPlaying'),
                    getGameList(username, 'completedGames')
                ]);
            }
            
            // Asegúrate de extraer el array de juegos correctamente
            setWishlist(wishlistData?.games || []);
            setCurrentlyPlaying(currentlyPlayingData?.games || []);
            setCompletedGames(completedData?.games || []);
            
            // Para depuración
            console.log('Wishlist cargada:', wishlistData);
        } catch (err) {
            console.error('Error cargando listas de juegos:', err);
            setListsError(err.message || 'Error al cargar las listas de juegos');
        } finally {
            setListsLoading(false);
        }
    };
    
    /**
     * Función para navegar a la edición de perfil
     * 
     * @function handleEditProfile
     * @description Redirige a la página de edición de perfil
     */
    const handleEditProfile = () => {
        navigate('/profile/edit')
    }
    
    // Estado de carga
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
        )
    }
    
    // Estado de error
    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
                    <p className="text-red-600 mb-4">{error}</p>
                    <button 
                        onClick={() => navigate('/home')}
                        className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg"
                    >
                        Volver al Inicio
                    </button>
                </div>
            </div>
        )
    }
    
    return (
        <div className="min-h-screen bg-gray-100">
            <Header user={user} />
            <div className="container mx-auto px-4 py-8">
                {/* Tarjeta de perfil */}
                {user && (
                    <ProfileCard 
                        user={user} 
                        isOwnProfile={isOwnProfile}
                        onEditClick={handleEditProfile}
                    />
                )}
                
                {/* Lista de deseos */}
                <GameListSection
                    title="Lista de Deseos"
                    games={wishlist}
                    isLoading={listsLoading}
                    error={listsError}
                    emptyMessage="No hay juegos en la lista de deseos"
                />
                
                {/* Jugando actualmente */}
                <GameListSection
                    title="Jugando Actualmente"
                    games={currentlyPlaying}
                    isLoading={listsLoading}
                    error={listsError}
                    emptyMessage="No hay juegos en progreso"
                />
                
                {/* Juegos completados */}
                <GameListSection
                    title="Juegos Completados"
                    games={completedGames}
                    isLoading={listsLoading}
                    error={listsError}
                    emptyMessage="No hay juegos completados"
                />
            </div>
        </div>
    )
}

export default Profile