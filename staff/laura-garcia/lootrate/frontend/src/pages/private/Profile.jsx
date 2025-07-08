import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getUserProfile, getOwnProfile } from '../../logic/users/profileUser'
import { getGameList, getOwnGameList } from '../../logic/users/gameListsUser'
import ProfileCard from '../../components/ProfileCard'
import GameListSection from '../../components/GameListSection'
import Header from '../../components/Header'
import ErrorModal from '../../components/ErrorModal'
import { errors } from 'common'
import getToken from '../../helpers/getToken'

const Profile = () => {
    const { username } = useParams()
    const navigate = useNavigate()
    
    const [user, setUser] = useState(null)
    const [wishlist, setWishlist] = useState([])
    const [currentlyPlaying, setCurrentlyPlaying] = useState([])
    const [completedGames, setCompletedGames] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [listsLoading, setListsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [listsError, setListsError] = useState(null)
    
    const [showErrorModal, setShowErrorModal] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    
    const token = getToken()
    const isOwnProfile = !username 
    
    const showError = (message) => {
        setErrorMessage(message)
        setShowErrorModal(true)
    }
    
    useEffect(() => {
        loadProfile()
        loadGameLists()
        
        const handleStorageChange = (e) => {
            if (e.key === 'userListsUpdated') {
                console.log('Detectado cambio en listas, recargando...');
                loadGameLists();
            }
        };
        
        window.addEventListener('storage', handleStorageChange);
        
        const handleGameListUpdate = () => {
            loadGameLists();
        };
        window.addEventListener('gameListUpdated', handleGameListUpdate);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('gameListUpdated', handleGameListUpdate);
        };
    }, [username])

    const loadProfile = async () => {
        try {
            setIsLoading(true)
            setError(null)
            
            let profileData
            if (isOwnProfile) {
                if (!token) {
                    navigate('/login')
                    return
                }
                profileData = await getOwnProfile(token)
            } else {
                profileData = await getUserProfile(username)
            }
            
            setUser(profileData)
        } catch (err) {
            showError(err.message || 'Error al cargar el perfil')
            setError(err.message || 'Error al cargar el perfil')
        } finally {
            setIsLoading(false)
        }
    }
    
    const loadGameLists = async () => {
        try {
            setListsLoading(true);
            setListsError(null);
            
            let wishlistData, currentlyPlayingData, completedData;
            
            if (isOwnProfile) {
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
                ;[wishlistData, currentlyPlayingData, completedData] = await Promise.all([
                    getGameList(username, 'wishlist'),
                    getGameList(username, 'currentlyPlaying'),
                    getGameList(username, 'completedGames')
                ]);
            }
            
            const processGames = (games) => {
                if (!Array.isArray(games)) return [];
                return games.map(game => {
                    if (!game) return null;
                    if (game.id && !game.gameId) {
                        return {...game, gameId: game.id.toString()};
                    }
                    if (game.gameId && !game.id) {
                        return {...game, gameId: game.gameId.toString()};
                    }
                    return game;
                }).filter(Boolean); 
            };
            
            const processedWishlist = processGames(wishlistData || []);
            const processedCurrentlyPlaying = processGames(currentlyPlayingData || []);
            const processedCompletedGames = processGames(completedData || []);
            
            setWishlist(processedWishlist);
            setCurrentlyPlaying(processedCurrentlyPlaying);
            setCompletedGames(processedCompletedGames);
            
        } catch (err) {
            showError(err.message || 'Error al cargar las listas de juegos')
            setListsError(err.message || 'Error al cargar las listas de juegos');
        } finally {
            setListsLoading(false);
        }
    };

    const handleEditProfile = () => {
        navigate('/profile/edit')
    }
    
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
        )
    }
    
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
                {user && (
                    <ProfileCard 
                        user={user} 
                        isOwnProfile={isOwnProfile}
                        onEditClick={handleEditProfile}
                    />
                )}
                
                <GameListSection
                    title="Lista de Deseos"
                    games={wishlist}
                    isLoading={listsLoading}
                    error={listsError}
                    emptyMessage="No hay juegos en la lista de deseos"
                />

                <GameListSection
                    title="Jugando Actualmente"
                    games={currentlyPlaying}
                    isLoading={listsLoading}
                    error={listsError}
                    emptyMessage="No hay juegos en progreso"
                />

                <GameListSection
                    title="Juegos Completados"
                    games={completedGames}
                    isLoading={listsLoading}
                    error={listsError}
                    emptyMessage="No hay juegos completados"
                />
            </div>

            <ErrorModal
                isVisible={showErrorModal}
                message={errorMessage}
                type="error"
                onClose={() => setShowErrorModal(false)}
            />
        </div>
    )
}

export default Profile