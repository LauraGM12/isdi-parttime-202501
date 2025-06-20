/**
 * @fileoverview Página de edición de perfil de usuario
 * @description Componente para editar información personal y preferencias del usuario
 * @author LootRate Team
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header'
import { getOwnProfile, updateUserProfile as updateProfile } from '../../logic/users/profileUser'
import getToken from '../../helpers/getToken'
import { errors } from 'common'

/**
 * Componente de edición de perfil
 * 
 * @description Página que permite a los usuarios editar su información personal,
 * incluyendo datos básicos, avatar, biografía y preferencias de juegos.
 * 
 * @component
 * @example
 * // Uso básico del componente
 * <EditProfile />
 * 
 * @returns {JSX.Element} Página de edición de perfil con formulario completo
 * 
 * @features
 * - Edición de información personal (nombre, apellido, email, username)
 * - Carga y previsualización de avatar
 * - Edición de biografía
 * - Selección de géneros favoritos
 * - Selección de plataformas favoritas
 * - Validaciones de formulario
 * - Estados de carga y guardado
 * 
 * @accessibility
 * - Labels descriptivos para todos los campos
 * - Indicadores de estado de carga
 * - Mensajes de error claros
 * - Navegación por teclado
 */
const EditProfile = () => {
    const navigate = useNavigate()
    
    // Estados para los datos del formulario
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        name: '',
        surname: '',
        bio: '',
        avatar: null,
        favoriteGenres: [],
        favoritePlatforms: []
    })
    
    // Estados para la previsualización del avatar
    const [avatarPreview, setAvatarPreview] = useState(null)
    
    // Estados de control
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    
    // Opciones predefinidas para géneros
    const genreOptions = [
        'Acción', 'Aventura', 'RPG', 'Estrategia', 'Simulación',
        'Deportes', 'Carreras', 'Puzzle', 'Plataformas', 'Shooter',
        'Terror', 'Supervivencia', 'Indie', 'Multijugador', 'Casual'
    ]
    
    // Opciones predefinidas para plataformas
    const platformOptions = [
        'PC', 'PlayStation 5', 'PlayStation 4', 'Xbox Series X/S',
        'Xbox One', 'Nintendo Switch', 'Mobile', 'VR'
    ]

    /**
     * Efecto para cargar datos del perfil al montar el componente
     */
    useEffect(() => {
        loadProfileData()
    }, [])

    /**
     * Función para cargar los datos del perfil desde el backend
     * 
     * @async
     * @function loadProfileData
     * @description Obtiene el perfil del usuario y llena el formulario
     * @returns {Promise<void>}
     */
    const loadProfileData = async () => {
        try {
            setIsLoading(true)
            setError('')
            
            // Verificar autenticación
            const token = getToken()
            if (!token) {
                navigate('/login')
                return
            }

            // Obtener datos del perfil
            const profile = await getOwnProfile(token)
            
            // Llenar el formulario con los datos existentes
            setFormData({
                username: profile.username || '',
                email: profile.email || '',
                name: profile.name || '',
                surname: profile.surname || '',
                bio: profile.bio || '',
                avatar: null, // El avatar se maneja por separado
                favoriteGenres: profile.favoriteGenres || [],
                favoritePlatforms: profile.favoritePlatforms || []
            })
            
            // Establecer preview del avatar actual si existe
            if (profile.avatar) {
                setAvatarPreview(profile.avatar)
            }
            
        } catch (err) {
            console.error('Error cargando perfil:', err)
            setError(err.message || 'Error al cargar los datos del perfil')
        } finally {
            setIsLoading(false)
        }
    }

    /**
     * Manejar cambios en los campos de texto del formulario
     * 
     * @function handleInputChange
     * @param {Event} e - Evento del input
     */
    const handleInputChange = (event) => {
        const { name, value } = event.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        
        // Limpiar mensajes cuando el usuario empiece a escribir
        if (error) setError('')
        if (successMessage) setSuccessMessage('')
    }

    /**
     * Manejar la carga de archivo de avatar
     * 
     * @function handleAvatarChange
     * @param {Event} e - Evento del input de archivo
     */
    const handleAvatarChange = (event) => {
        const file = event.target.files[0]
        if (file) {
            // Validar tipo de archivo
            if (!file.type.startsWith('image/')) {
                setError('Por favor selecciona un archivo de imagen válido')
                return
            }
            
            // Validar tamaño (máximo 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('El archivo es demasiado grande. Máximo 5MB permitido')
                return
            }
            
            setFormData(prev => ({
                ...prev,
                avatar: file
            }))
            
            // Crear preview
            const reader = new FileReader()
            reader.onload = (event) => {
                setAvatarPreview(event.target.result)
            }
            reader.readAsDataURL(file)
            
            // Limpiar errores
            setError('')
        }
    }

    /**
     * Manejar selección de géneros favoritos
     * 
     * @function handleGenreToggle
     * @param {string} genre - Género a agregar/quitar
     */
    const handleGenreToggle = (genre) => {
        setFormData(prev => ({
            ...prev,
            favoriteGenres: prev.favoriteGenres.includes(genre)
                ? prev.favoriteGenres.filter(g => g !== genre)
                : [...prev.favoriteGenres, genre]
        }))
    }

    /**
     * Manejar selección de plataformas favoritas
     * 
     * @function handlePlatformToggle
     * @param {string} platform - Plataforma a agregar/quitar
     */
    const handlePlatformToggle = (platform) => {
        setFormData(prev => ({
            ...prev,
            favoritePlatforms: prev.favoritePlatforms.includes(platform)
                ? prev.favoritePlatforms.filter(p => p !== platform)
                : [...prev.favoritePlatforms, platform]
        }))
    }

    /**
     * Función para enviar el formulario de actualización
     * 
     * @async
     * @function handleSubmit
     * @param {Event} e - Evento del formulario
     * @description Valida y envía los datos actualizados del perfil
     * @returns {Promise<void>}
     */
    const handleSubmit = async (event) => {
        event.preventDefault()  
        setError('')
        setSuccessMessage('')
        
        // Validaciones básicas
        if (!formData.username.trim()) {
            setError('El nombre de usuario es requerido')
            return
        }
        
        if (!formData.email.trim()) {
            setError('El email es requerido')
            return
        }
        
        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email)) {
            setError('Por favor ingresa un email válido')
            return
        }

        try {
            setIsSaving(true)
            
            const token = getToken()
            
            // Mapeo de géneros del frontend al backend
            const genreMapping = {
                'Acción': 'action',
                'Aventura': 'adventure',
                'RPG': 'rpg',
                'Estrategia': 'strategy',
                'Simulación': 'simulation',
                'Deportes': 'sports',
                'Carreras': 'racing',
                'Puzzle': 'puzzle',
                'Shooter': 'fps',
                'Terror': 'horror',
                'Indie': 'indie'
                // Añade los demás mapeos según sea necesario
            }
            
            // Mapeo de plataformas del frontend al backend
            const platformMapping = {
                'PC': 'pc',
                'PlayStation 5': 'playstation',
                'PlayStation 4': 'playstation',
                'Xbox Series X/S': 'xbox',
                'Xbox One': 'xbox',
                'Nintendo Switch': 'nintendo-switch',
                'Mobile': 'mobile',
                'VR': 'pc' // Asumiendo que VR se considera parte de PC
            }
            
            // Preparar datos para envío
            const updateData = {
                username: formData.username.trim(),
                email: formData.email.trim(),
                firstName: formData.name.trim(),
                lastName: formData.surname.trim(),
                bio: formData.bio.trim(),
                favoriteGenres: formData.favoriteGenres.map(genre => genreMapping[genre] || ''),
                favoritePlatforms: formData.favoritePlatforms.map(platform => platformMapping[platform] || '')
            }
            
            // Filtrar valores vacíos que podrían resultar de mapeos no encontrados
            updateData.favoriteGenres = updateData.favoriteGenres.filter(genre => genre !== '')
            updateData.favoritePlatforms = updateData.favoritePlatforms.filter(platform => platform !== '')
            
            // Agregar avatar si se seleccionó uno nuevo
            if (formData.avatar) {
                updateData.avatar = formData.avatar
            }
            
            // Antes de enviar los datos
            console.log('Datos a enviar:', updateData);
            
            // Actualizar perfil
            const updatedProfile = await updateProfile(updateData, token);
            
            // Después de la respuesta exitosa
            console.log('Respuesta del servidor:', updatedProfile);
            
            setSuccessMessage('Perfil actualizado exitosamente');
            
            // Redirigir al perfil después de 2 segundos
            setTimeout(() => {
                navigate(`/profile/user/${formData.username}`)
            }, 2000) 
            
        } catch (err) {
            console.error('Error actualizando perfil:', err)
            setError(err.message || 'Error al actualizar el perfil')
        } finally {
            setIsSaving(false)
        }
    }

    // Estado de carga
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Header user={formData} /> 
            
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <div className="bg-white rounded-lg shadow-md">
                    {/* Header de la página */}
                    <div className="border-b border-gray-200 px-6 py-4">
                        <h1 className="text-2xl font-bold text-gray-900">Editar Perfil</h1>
                        <p className="text-gray-600 mt-1">Actualiza tu información personal y preferencias</p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="p-6">
                        {/* Mostrar mensajes de error */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                                <p className="text-red-700 text-sm">{error}</p>
                            </div>
                        )}
                        
                        {/* Mostrar mensaje de éxito */}
                        {successMessage && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                                <p className="text-green-700 text-sm">{successMessage}</p>
                            </div>
                        )}
                        
                        <div className="space-y-6">
                            {/* Sección de avatar */}
                            <div className="text-center">
                                <label className="block text-sm font-medium text-gray-700 mb-4">
                                    Foto de Perfil
                                </label>
                                <div className="flex flex-col items-center">
                                    {avatarPreview ? (
                                        <img
                                            src={avatarPreview}
                                            alt="Preview del avatar"
                                            className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 mb-4"
                                        />
                                    ) : (
                                        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                                            <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                            </svg>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        className="hidden"
                                        id="avatar-upload"
                                        disabled={isSaving}
                                    />
                                    <label
                                        htmlFor="avatar-upload"
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors"
                                    >
                                        Cambiar Foto
                                    </label>
                                </div>
                            </div>
                            
                            {/* Información básica */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nombre de Usuario *
                                    </label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        disabled={isSaving}
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        disabled={isSaving}
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nombre
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        disabled={isSaving}
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Apellido
                                    </label>
                                    <input
                                        type="text"
                                        name="surname"
                                        value={formData.surname}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        disabled={isSaving}
                                    />
                                </div>
                            </div>
                            
                            {/* Biografía */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Biografía
                                </label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleInputChange}
                                    rows={4}
                                    placeholder="Cuéntanos algo sobre ti..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    disabled={isSaving}
                                />
                            </div>
                            
                            {/* Géneros favoritos */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Géneros Favoritos
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {genreOptions.map(genre => (
                                        <label key={genre} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={formData.favoriteGenres.includes(genre)}
                                                onChange={() => handleGenreToggle(genre)}
                                                className="mr-2"
                                                disabled={isSaving}
                                            />
                                            <span className="text-sm">{genre}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Plataformas favoritas */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Plataformas Favoritas
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {platformOptions.map(platform => (
                                        <label key={platform} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={formData.favoritePlatforms.includes(platform)}
                                                onChange={() => handlePlatformToggle(platform)}
                                                className="mr-2"
                                                disabled={isSaving}
                                            />
                                            <span className="text-sm">{platform}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                        
                        {/* Botones de acción */}
                        <div className="flex justify-between items-center pt-6 mt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={() => navigate('/profile')}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
                                disabled={isSaving}
                            >
                                Cancelar
                            </button>
                            
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center"
                                disabled={isSaving}
                            >
                                {isSaving ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Guardando...
                                    </>
                                ) : (
                                    'Guardar Cambios'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EditProfile