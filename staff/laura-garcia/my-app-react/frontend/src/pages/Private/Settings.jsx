import { useState } from 'react'
import { useNavigate } from "react-router"
import Form from '../../components/lib/Form'
import logics from '../../logic'
import getLoggedUserId from '../../logic/helpers/getLoggedUserId'
import './Settings.css'

const Settings = () => {
    const [showNewEmailForm, setShowNewEmailForm] = useState(false)
    const [showNewPasswordForm, setShowNewPasswordForm] = useState(false)
    const [showDeleteAccountForm, setShowDeleteAccountForm] = useState(false)
    const navigate = useNavigate()

    const emailObject = { label: 'Correo electrónico', inputType: 'email', inputPlaceholder: 'mi_nuevo@correo.com', inputId: 'email', isRequired: true }
    const oldPasswordObject = { label: 'Ingresa tu contraseña actual', inputType: 'password', inputPlaceholder: '·········', inputId: 'old-password', isRequired: true }
    const newPasswordObject = { label: 'Nueva contraseña', inputType: 'password', inputPlaceholder: '·········', inputId: 'new-password', isRequired: true }
    const newPasswordConfirmObject = { label: 'Confirma tu nueva contraseña', inputType: 'password', inputPlaceholder: '·········', inputId: 'confirm-password', isRequired: true }

    const passwordObject = { label: 'Ingresa tu contraseña para eliminar tu cuenta', inputType: 'password', inputPlaceholder: '·········', inputId: 'password', isRequired: true }

    const onUpdateEmail = (formData) => {
        try {
            logics.users.updateEmail(formData.email)
            alert('Correo actualizado con éxito')
            setShowNewEmailForm(false)
        } catch (error) {
            alert('¡Ups! Algo salió mal, intenta de nuevo')
            console.error(error)
        }
    }

    const onUpdatePassword = (formData) => {
        try {
            logics.users.updatePassword(formData['new-password'], formData['confirm-password'], formData['old-password'])
            alert('Contraseña actualizada con éxito')
            setShowNewPasswordForm(false)
        } catch (error) {
            alert('¡Ups! Algo salió mal, intenta de nuevo')
            console.error(error)
        }
    }

    const onDeleteAccount = (formData) => {
        try {
            const doesUserAgree = confirm("Si eliminas tu cuenta, se borrarán todas tus publicaciones y 'me gusta'. ¿Deseas continuar?")
            if (doesUserAgree) {
                logics.users.deleteUserById(getLoggedUserId(), formData.password)
                logics.users.logoutUser()
                navigate('/register')
            }
        } catch (error) {
            alert(error)
            console.error(error)
        }
    }

    return (
        <div className='settings'>
            <section className='settings__section'>
                <div className='settings__section-header' onClick={() => setShowNewEmailForm(!showNewEmailForm)}>
                    <h2 className='settings__section-title'>
                        <i className="bi bi-envelope"></i>
                        Actualizar correo electrónico
                    </h2>
                    <i className={`settings__section-icon bi bi-chevron-down ${showNewEmailForm ? 'settings__section-icon--open' : ''}`}></i>
                </div>
                {showNewEmailForm && (
                    <div className='settings__form-container'>
                        <Form inputsArray={[emailObject]} submitButtonText={'Guardar nuevo correo'} onSubmitCallback={onUpdateEmail} />
                    </div>
                )}
            </section>

            <section className='settings__section'>
                <div className='settings__section-header' onClick={() => setShowNewPasswordForm(!showNewPasswordForm)}>
                    <h2 className='settings__section-title'>
                        <i className="bi bi-key"></i>
                        Actualizar contraseña
                    </h2>
                    <i className={`settings__section-icon bi bi-chevron-down ${showNewPasswordForm ? 'settings__section-icon--open' : ''}`}></i>
                </div>
                {showNewPasswordForm && (
                    <div className='settings__form-container'>
                        <Form 
                            inputsArray={[oldPasswordObject, newPasswordObject, newPasswordConfirmObject]} 
                            submitButtonText={'Guardar nueva contraseña'} 
                            onSubmitCallback={onUpdatePassword} 
                        />
                    </div>
                )}
            </section>

            <section className='settings__section settings__section--danger'>
                <div className='settings__section-header' onClick={() => setShowDeleteAccountForm(!showDeleteAccountForm)}>
                    <h2 className='settings__section-title'>
                        <i className="bi bi-exclamation-triangle"></i>
                        Eliminar cuenta
                    </h2>
                    <i className={`settings__section-icon bi bi-chevron-down ${showDeleteAccountForm ? 'settings__section-icon--open' : ''}`}></i>
                </div>
                {showDeleteAccountForm && (
                    <div className='settings__form-container'>
                        <Form inputsArray={[passwordObject]} submitButtonText={'Eliminar mi cuenta'} onSubmitCallback={onDeleteAccount} />
                    </div>
                )}
            </section>
        </div>
    )
}

export default Settings