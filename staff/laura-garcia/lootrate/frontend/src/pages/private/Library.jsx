/**
 * @fileoverview Página de biblioteca personal del usuario
 * @description Componente que muestra todas las listas de juegos del usuario autenticado
 * @author LootRate Team
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react'
import Header from '../../components/Header'
import GameListSection from '../../components/GameListSection'
import { getOwnGameList } from '../../logic/users/gameListsUser'
import { getOwnProfile } from '../../logic/users/profileUser'
import getToken from '../../helpers/getToken'

/**
 * Componente de biblioteca personal
 * 
 * @description Página que centraliza todas las listas de juegos del usuario autenticado,
 * proporcionando una vista unificada de su colección personal.
 * 
 * @component
 * @example
 * // Uso básico del componente
 * <Library />
 * 
 * @returns {JSX.Element} Página de biblioteca con listas organizadas de juegos
 * 
 * @features
 * - Vista consolidada de todas las listas de juegos
 * - Carga automática de datos del usuario
 * - Manejo de estados de autenticación
 * - Interfaz responsive y accesible
 * - Estados de carga y error
 * 
 * @accessibility
 * - Navegación clara entre secciones
 * - Mensajes descriptivos para listas vacías
 * - Indicadores de carga accesibles
 */
const Library = () => {
    // Estados del componente
    const [gameLists, setGameLists] = useState({
        wishlist: [],
        currentlyPlaying: [],
        completedGames: []
    })
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [user, setUser] = useState(null)
    
    /**
     * Efecto para cargar datos al montar el componente
     */
    useEffect(() => {
        loadUserAndGameLists()
    }, [])
    
    /**
     * Función para cargar usuario y listas de juegos
     * 
     * @async
     * @function loadUserAndGameLists
     * @description Carga el perfil del usuario y todas sus listas de juegos
     * @returns {Promise<void>}
     */
    const loadUserAndGameLists = async () => {
        try {
            const token = getToken()
            if (!token) {
                setError('No estás autenticado')
                return
            }

            // Cargar información del usuario
            const userProfile = await getOwnProfile(token)
            setUser(userProfile)

            // Cargar todas las listas de juegos en paralelo
            const [wishlist, currentlyPlaying, completedGames] = await Promise.all([
                getOwnGameList('wishlist', token),
                getOwnGameList('currentlyPlaying', token),
                getOwnGameList('completedGames', token)
            ])

            // Actualizar estado con las listas obtenidas
            setGameLists({
                wishlist: wishlist?.games || [],
                currentlyPlaying: currentlyPlaying?.games || [],
                completedGames: completedGames?.games || []
            })
        } catch (err) {
            console.error('Error cargando datos:', err)
            setError('Error al cargar los datos')
        } finally {
            setIsLoading(false)
        }
    }

    // Estado de error
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
                {/* Título principal */}
                <h1 className="text-3xl font-bold text-white mb-8">Mi Biblioteca</h1>
                
                {/* Lista de deseos */}
                <GameListSection 
                    title="Lista de Deseos"
                    games={gameLists.wishlist}
                    isLoading={isLoading}
                    error={null}
                    emptyMessage="No tienes juegos en tu lista de deseos"
                />
                
                {/* Jugando actualmente */}
                <GameListSection 
                    title="Jugando Actualmente"
                    games={gameLists.currentlyPlaying}
                    isLoading={isLoading}
                    error={null}
                    emptyMessage="No estás jugando ningún juego actualmente"
                />
                
                {/* Juegos completados */}
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