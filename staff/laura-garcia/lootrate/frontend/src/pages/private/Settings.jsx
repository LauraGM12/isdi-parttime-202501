/**
 * @fileoverview Página de configuraciones de cuenta de usuario
 * @description Componente para gestionar configuraciones de cuenta, cambio de contraseña y eliminación
 * @author LootRate Team
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header'
import { errors } from 'common'
import getToken from '../../helpers/getToken'
import { getOwnProfile } from '../../logic/users/profileUser'
import { deleteUserAccount } from '../../logic/users/deleteUser'
import { changePassword } from '../../logic/users/changePassword'

/**
 * Componente de configuraciones de cuenta
 * 
 * @description Página que permite a los usuarios gestionar su cuenta,
 * incluyendo cambio de contraseña y eliminación de cuenta.
 * 
 * @component
 * @example
 * // Uso básico del componente
 * <Settings />
 * 
 * @returns {JSX.Element} Página de configuraciones con opciones de cuenta
 * 
 * @features
 * - Cambio de contraseña con validaciones
 * - Eliminación de cuenta con confirmación
 * - Validaciones de seguridad
 * - Interfaz intuitiva y segura
 * - Manejo de estados de carga
 * 
 * @security
 * - Validación de contraseña actual
 * - Confirmación de email para eliminación
 * - Limpieza de tokens al eliminar cuenta
 * - Validaciones de formulario robustas
 */
const Settings = () => {
    const navigate = useNavigate()
    
    // Estados para datos del usuario
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    
    // Estados para la confirmación de eliminación de cuenta
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
    const [deleteForm, setDeleteForm] = useState({
        email: '',
        password: ''
    })
    const [deleteError, setDeleteError] = useState('')
    const [isDeleting, setIsDeleting] = useState(false)
    
    // Estados para el cambio de contraseña
    const [showChangePassword, setShowChangePassword] = useState(false)
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })
    const [passwordError, setPasswordError] = useState('')
    const [passwordSuccess, setPasswordSuccess] = useState('')
    const [isChangingPassword, setIsChangingPassword] = useState(false)

    /**
     * Efecto para cargar datos del usuario al montar el componente
     */
    useEffect(() => {
        loadUserData()
    }, [])

    /**
     * Función para cargar los datos del usuario desde el backend
     * 
     * @async
     * @function loadUserData
     * @description Obtiene el perfil del usuario autenticado
     * @returns {Promise<void>}
     */
    const loadUserData = async () => {
        try {
            setIsLoading(true)
            setError(null)
            
            // Verificar autenticación
            const token = getToken()
            if (!token) {
                navigate('/login')
                return
            }

            // Obtener datos del perfil del usuario
            const userData = await getOwnProfile(token)
            setUser(userData)
        } catch (err) {
            console.error('Error cargando datos del usuario:', err)
            setError(err.message || 'Error al cargar los datos del usuario')
        } finally {
            setIsLoading(false)
        }
    }

    /**
     * Manejar cambios en el formulario de eliminación de cuenta
     * 
     * @function handleDeleteFormChange
     * @param {string} field - Campo del formulario a actualizar
     * @param {string} value - Nuevo valor del campo
     */
    const handleDeleteFormChange = (field, value) => {
        setDeleteForm(prev => ({
            ...prev,
            [field]: value
        }))
        // Limpiar error cuando el usuario empiece a escribir
        if (deleteError) {
            setDeleteError('')
        }
    }
    
    /**
     * Manejar cambios en el formulario de cambio de contraseña
     * 
     * @function handlePasswordFormChange
     * @param {string} field - Campo del formulario a actualizar
     * @param {string} value - Nuevo valor del campo
     */
    const handlePasswordFormChange = (field, value) => {
        setPasswordForm(prev => ({
            ...prev,
            [field]: value
        }))
        // Limpiar mensajes cuando el usuario empiece a escribir
        if (passwordError) {
            setPasswordError('')
        }
        if (passwordSuccess) {
            setPasswordSuccess('')
        }
    }

    /**
     * Función para manejar el cambio de contraseña
     * 
     * @async
     * @function handleChangePassword
     * @description Valida y procesa el cambio de contraseña
     * @returns {Promise<void>}
     */
    const handleChangePassword = async () => {
        setPasswordError('')
        setPasswordSuccess('')
        
        // Validaciones del formulario
        if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
            setPasswordError('Por favor, completa todos los campos')
            return
        }
        
        // Validar que la nueva contraseña coincida con la confirmación
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPasswordError('La nueva contraseña y su confirmación no coinciden')
            return
        }
        
        // Validar que la nueva contraseña sea diferente a la actual
        if (passwordForm.currentPassword === passwordForm.newPassword) {
            setPasswordError('La nueva contraseña debe ser diferente a la actual')
            return
        }
        
        // Validar longitud mínima de la nueva contraseña
        if (passwordForm.newPassword.length < 6) {
            setPasswordError('La nueva contraseña debe tener al menos 6 caracteres')
            return
        }

        try {
            setIsChangingPassword(true)
            
            const token = getToken()
            
            // Llamar a la función de cambio de contraseña
            await changePassword(passwordForm.currentPassword, passwordForm.newPassword, token)
            
            // Mostrar mensaje de éxito
            setPasswordSuccess('Contraseña cambiada exitosamente')
            
            // Limpiar formulario
            setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            })
            
            // Ocultar formulario después de 2 segundos
            setTimeout(() => {
                setShowChangePassword(false)
                setPasswordSuccess('')
            }, 2000)
            
        } catch (err) {
            console.error('Error cambiando contraseña:', err)
            setPasswordError(err.message || 'Error al cambiar la contraseña')
        } finally {
            setIsChangingPassword(false)
        }
    }
    
    /**
     * Cancelar el cambio de contraseña
     * 
     * @function cancelChangePassword
     * @description Resetea el formulario y oculta la sección de cambio de contraseña
     */
    const cancelChangePassword = () => {
        setShowChangePassword(false)
        setPasswordForm({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        })
        setPasswordError('')
        setPasswordSuccess('')
    }

    /**
     * Función para manejar la eliminación de cuenta
     * 
     * @async
     * @function handleDeleteAccount
     * @description Valida y procesa la eliminación de la cuenta del usuario
     * @returns {Promise<void>}
     */
    const handleDeleteAccount = async () => {
        setDeleteError('')
        
        // Validaciones
        if (!deleteForm.email || !deleteForm.password) {
            setDeleteError('Por favor, completa todos los campos')
            return
        }
        
        if (deleteForm.email !== user.email) {
            setDeleteError('El email no coincide con el de tu cuenta')
            return
        }

        try {
            setIsDeleting(true)
            
            const token = getToken()
            await deleteUserAccount(deleteForm.email, deleteForm.password, token)
            
            alert('Cuenta eliminada exitosamente. Serás redirigido al inicio.')
            
            // Limpiar token y redirigir
            localStorage.removeItem('token')
            navigate('/login')
            
        } catch (err) {
            console.error('Error eliminando cuenta:', err)
            setDeleteError(err.message || 'Error al eliminar la cuenta. Verifica tus credenciales.')
        } finally {
            setIsDeleting(false)
        }
    }

    /**
     * Cancelar eliminación de cuenta
     * 
     * @function cancelDelete
     * @description Resetea el formulario y oculta la confirmación de eliminación
     */
    const cancelDelete = () => {
        setShowDeleteConfirmation(false)
        setDeleteForm({ email: '', password: '' })
        setDeleteError('')
    }

    // Estado de carga
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
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
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
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
            
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <div className="bg-white rounded-lg shadow-md">
                    {/* Header de la página */}
                    <div className="border-b border-gray-200 px-6 py-4">
                        <h1 className="text-2xl font-bold text-gray-900">Configuraciones de Cuenta</h1>
                        <p className="text-gray-600 mt-1">Gestiona tu cuenta de usuario</p>
                    </div>
                    
                    <div className="p-6">
                        {!showDeleteConfirmation && !showChangePassword ? (
                            <div className="space-y-6">
                                {/* Sección de cambio de contraseña */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                    <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 0h12a2 2 0 002-2v-4a2 2 0 00-2-2H6a2 2 0 00-2 2v4a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-blue-900 mb-2 text-center">Cambiar Contraseña</h3>
                                    <p className="text-blue-700 mb-4 text-center">
                                        Actualiza tu contraseña para mantener tu cuenta segura.
                                    </p>
                                    <div className="text-center">
                                        <button
                                            onClick={() => setShowChangePassword(true)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors font-medium"
                                        >
                                            Cambiar Contraseña
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Sección de eliminación de cuenta */}
                                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                                    <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-red-900 mb-2 text-center">Eliminar Cuenta</h3>
                                    <p className="text-red-700 mb-4 text-center">
                                        Esta acción eliminará permanentemente tu cuenta y todos los datos asociados. 
                                        Esta acción no se puede deshacer.
                                    </p>
                                    <div className="text-center">
                                        <button
                                            onClick={() => setShowDeleteConfirmation(true)}
                                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors font-medium"
                                        >
                                            Eliminar Mi Cuenta
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Botón para volver al perfil */}
                                <div className="text-center">
                                    <button
                                        onClick={() => navigate('/profile')}
                                        className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
                                    >
                                        Volver al Perfil
                                    </button>
                                </div>
                            </div>
                        ) : showChangePassword ? (
                            /* Formulario de cambio de contraseña */
                            <div className="space-y-6">
                                <div className="text-center">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Cambiar Contraseña</h3>
                                    <p className="text-gray-600">
                                        Ingresa tu contraseña actual y la nueva contraseña.
                                    </p>
                                </div>
                                
                                {/* Mostrar errores */}
                                {passwordError && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                        <p className="text-red-700 text-sm">{passwordError}</p>
                                    </div>
                                )}
                                
                                {/* Mostrar mensaje de éxito */}
                                {passwordSuccess && (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                        <p className="text-green-700 text-sm">{passwordSuccess}</p>
                                    </div>
                                )}
                                
                                <div className="space-y-4">
                                    {/* Campo de contraseña actual */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Contraseña actual
                                        </label>
                                        <input
                                            type="password"
                                            value={passwordForm.currentPassword}
                                            onChange={(e) => handlePasswordFormChange('currentPassword', e.target.value)}
                                            placeholder="Tu contraseña actual"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            disabled={isChangingPassword}
                                        />
                                    </div>
                                    
                                    {/* Campo de nueva contraseña */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nueva contraseña
                                        </label>
                                        <input
                                            type="password"
                                            value={passwordForm.newPassword}
                                            onChange={(e) => handlePasswordFormChange('newPassword', e.target.value)}
                                            placeholder="Tu nueva contraseña (mínimo 6 caracteres)"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            disabled={isChangingPassword}
                                        />
                                    </div>
                                    
                                    {/* Campo de confirmación de nueva contraseña */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Confirmar nueva contraseña
                                        </label>
                                        <input
                                            type="password"
                                            value={passwordForm.confirmPassword}
                                            onChange={(e) => handlePasswordFormChange('confirmPassword', e.target.value)}
                                            placeholder="Confirma tu nueva contraseña"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            disabled={isChangingPassword}
                                        />
                                    </div>
                                </div>
                                
                                {/* Botones de acción */}
                                <div className="flex justify-between items-center pt-4">
                                    <button
                                        onClick={cancelChangePassword}
                                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                                        disabled={isChangingPassword}
                                    >
                                        Cancelar
                                    </button>
                                    
                                    <button
                                        onClick={handleChangePassword}
                                        disabled={isChangingPassword || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors font-medium flex items-center space-x-2"
                                    >
                                        {isChangingPassword && (
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        )}
                                        <span>{isChangingPassword ? 'Cambiando...' : 'Cambiar Contraseña'}</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* Formulario de confirmación de eliminación */
                            <div className="space-y-6">
                                <div className="text-center">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirmar Eliminación de Cuenta</h3>
                                    <p className="text-gray-600">
                                        Por seguridad, confirma tu email y contraseña para eliminar tu cuenta.
                                    </p>
                                </div>
                                
                                {deleteError && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                        <p className="text-red-700 text-sm">{deleteError}</p>
                                    </div>
                                )}
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Confirma tu email
                                        </label>
                                        <input
                                            type="email"
                                            value={deleteForm.email}
                                            onChange={(e) => handleDeleteFormChange('email', e.target.value)}
                                            placeholder={user?.email || 'tu@email.com'}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                            disabled={isDeleting}
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Confirma tu contraseña
                                        </label>
                                        <input
                                            type="password"
                                            value={deleteForm.password}
                                            onChange={(e) => handleDeleteFormChange('password', e.target.value)}
                                            placeholder="Tu contraseña actual"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                            disabled={isDeleting}
                                        />
                                    </div>
                                </div>
                                
                                <div className="flex justify-between items-center pt-4">
                                    <button
                                        onClick={cancelDelete}
                                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                                        disabled={isDeleting}
                                    >
                                        Cancelar
                                    </button>
                                    
                                    <button
                                        onClick={handleDeleteAccount}
                                        disabled={isDeleting || !deleteForm.email || !deleteForm.password}
                                        className="bg-red-600 hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors font-medium flex items-center space-x-2"
                                    >
                                        {isDeleting && (
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        )}
                                        <span>{isDeleting ? 'Eliminando...' : 'Confirmar Eliminación'}</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings