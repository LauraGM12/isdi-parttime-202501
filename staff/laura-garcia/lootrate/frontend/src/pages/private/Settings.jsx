import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header'
import ErrorModal from '../../components/ErrorModal'
import { errors } from 'common'
import getToken from '../../helpers/getToken'
import { getOwnProfile } from '../../logic/users/profileUser'
import { deleteUserAccount } from '../../logic/users/deleteUser'
import { changePassword } from '../../logic/users/changePassword'

const Settings = () => {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [showErrorModal, setShowErrorModal] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
    const [deleteForm, setDeleteForm] = useState({
        email: '',
        password: ''
    })
    const [deleteError, setDeleteError] = useState('')
    const [isDeleting, setIsDeleting] = useState(false)
    const [showChangePassword, setShowChangePassword] = useState(false)
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })
    const [passwordError, setPasswordError] = useState('')
    const [passwordSuccess, setPasswordSuccess] = useState('')
    const [isChangingPassword, setIsChangingPassword] = useState(false)
    const showError = (message) => {
        setErrorMessage(message)
        setShowErrorModal(true)
    }

    useEffect(() => {
        loadUserData()
    }, [])

    const loadUserData = async () => {
        try {
            setIsLoading(true)
            
            const token = getToken()
            if (!token) {
                navigate('/login')
                return
            }
    
            const userData = await getOwnProfile(token)
            setUser(userData)
        } catch (err) {
            showError(err.message || 'Error al cargar los datos del usuario')
            setTimeout(() => navigate('/home'), 2000)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeleteFormChange = (field, value) => {
        setDeleteForm(prev => ({
            ...prev,
            [field]: value
        }))
        if (deleteError) {
            setDeleteError('')
        }
    }
    
    const handlePasswordFormChange = (field, value) => {
        setPasswordForm(prev => ({
            ...prev,
            [field]: value
        }))
        if (passwordError) {
            setPasswordError('')
        }
        if (passwordSuccess) {
            setPasswordSuccess('')
        }
    }

    const handleChangePassword = async () => {
        setPasswordError('')
        setPasswordSuccess('')
        
        if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
            setPasswordError('Por favor, completa todos los campos')
            return
        }
        
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPasswordError('La nueva contraseña y su confirmación no coinciden')
            return
        }
        
        if (passwordForm.currentPassword === passwordForm.newPassword) {
            setPasswordError('La nueva contraseña debe ser diferente a la actual')
            return
        }
        
        if (passwordForm.newPassword.length < 6) {
            setPasswordError('La nueva contraseña debe tener al menos 6 caracteres')
            return
        }

        try {
            setIsChangingPassword(true)
            
            const token = getToken()
            
            await changePassword(passwordForm.currentPassword, passwordForm.newPassword, token)
            
            setPasswordSuccess('Contraseña cambiada exitosamente')
            
            setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            })
            
            setTimeout(() => {
                setShowChangePassword(false)
                setPasswordSuccess('')
            }, 2000)
            
        } catch (err) {
            showError(err.message || 'Error al cambiar la contraseña')
        } finally {
            setIsChangingPassword(false)
        }
    }
    
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

    const handleDeleteAccount = async () => {
        setDeleteError('')
        
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
            
            setTimeout(() => {
                localStorage.removeItem('token')
                navigate('/login')
            }, 1000)
            
        } catch (err) {
            showError(err.message || 'Error al eliminar la cuenta. Verifica tus credenciales.')
        } finally {
            setIsDeleting(false)
        }
    }

    const cancelDelete = () => {
        setShowDeleteConfirmation(false)
        setDeleteForm({ email: '', password: '' })
        setDeleteError('')
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        )
    }
    
    return (
        <div className="min-h-screen bg-gray-100">
            <Header user={user} />
            
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <div className="bg-white rounded-lg shadow-md">
                    <div className="border-b border-gray-200 px-6 py-4">
                        <h1 className="text-2xl font-bold text-gray-900">Configuraciones de Cuenta</h1>
                        <p className="text-gray-600 mt-1">Gestiona tu cuenta de usuario</p>
                    </div>
                    
                    <div className="p-6">
                        {!showDeleteConfirmation && !showChangePassword ? (
                            <div className="space-y-6">
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
                            <div className="space-y-6">
                                <div className="text-center">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Cambiar Contraseña</h3>
                                    <p className="text-gray-600">
                                        Ingresa tu contraseña actual y la nueva contraseña.
                                    </p>
                                </div>

                                {passwordError && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                        <p className="text-red-700 text-sm">{passwordError}</p>
                                    </div>
                                )}

                                {passwordSuccess && (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                        <p className="text-green-700 text-sm">{passwordSuccess}</p>
                                    </div>
                                )}
                                
                                <div className="space-y-4">
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
