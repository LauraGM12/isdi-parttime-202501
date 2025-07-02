import React, { useState, useEffect } from 'react'
import Header from '../../components/Header'
import GameListSection from '../../components/GameListSection'
import { getOwnGameList } from '../../logic/users/gameListsUser'
import { getOwnProfile } from '../../logic/users/profileUser'
import getToken from '../../helpers/getToken'

const Library = () => {
    const [gameLists, setGameLists] = useState({
        wishlist: [],
        currentlyPlaying: [],
        completedGames: []
    })
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [user, setUser] = useState(null)
    
    useEffect(() => {
        loadUserAndGameLists()
    }, [])
    
    const loadUserAndGameLists = async () => {
        try {
            const token = getToken()
            if (!token) {
                setError('No estás autenticado')
                return
            }

            const userProfile = await getOwnProfile(token)
            setUser(userProfile)

            const [wishlist, currentlyPlaying, completedGames] = await Promise.all([
                getOwnGameList('wishlist', token),
                getOwnGameList('currentlyPlaying', token),
                getOwnGameList('completedGames', token)
            ])

            setGameLists({
                wishlist: wishlist?.games || [],
                currentlyPlaying: currentlyPlaying?.games || [],
                completedGames: completedGames?.games || []
            })
        } catch (err) {
            setError('Error al cargar los datos')
        } finally {
            setIsLoading(false)
        }
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-900">
                <Header />
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center text-red-400">
                        <p>{error}</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-900">
            <Header user={user} />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-white mb-8">Mi Biblioteca</h1>
                
                <GameListSection 
                    title="Lista de Deseos"
                    games={gameLists.wishlist}
                    isLoading={isLoading}
                    error={null}
                    emptyMessage="No tienes juegos en tu lista de deseos"
                />
                
                <GameListSection 
                    title="Jugando Actualmente"
                    games={gameLists.currentlyPlaying}
                    isLoading={isLoading}
                    error={null}
                    emptyMessage="No estás jugando ningún juego actualmente"
                />
                
                <GameListSection 
                    title="Juegos Completados"
                    games={gameLists.completedGames}
                    isLoading={isLoading}
                    error={null}
                    emptyMessage="No has completado ningún juego aún"
                />
            </div>
        </div>
    )
}

export default Library