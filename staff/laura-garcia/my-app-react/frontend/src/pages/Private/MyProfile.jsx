import { useState } from "react"
import Form from "../../components/lib/Form"
import logics from "../../logic/index"
import UserCard from "../../components/UserCard"
import getLoggedUserId from "../../logic/helpers/getLoggedUserId"
import './MyProfile.css'

const MyProfile = ({ updateHeader }) => {
    const [showUsernameForm, setShowUsernameForm] = useState(false)
    const [showAvatarForm, setShowAvatarForm] = useState(false)
    const [showBioForm, setShowBioForm] = useState(false)
    const [refreshUserCard, setRefreshUserCard] = useState(Date.now())
    const [tempAvatar, setTempAvatar] = useState()
    const [isLocalAvatar, setIsLocalAvatar] = useState(false)

    const usernameObject = { label: 'Nombre de usuario', inputType: 'text', inputPlaceholder: 'Nuevo nombre', inputId: 'username', isRequired: true }
    const avatarObject = { label: 'Cargar archivo local', inputType: 'file', inputPlaceholder: '', inputId: 'avatar-64', isRequired: false }
    const avatarObject2 = { label: 'Usar imagen desde URL pública', inputType: 'url', inputPlaceholder: 'https/nueva.com/avatar.png', inputId: 'avatar-url', isRequired: false }
    const bioObject = { label: 'Biografía', inputType: 'text-area', inputPlaceholder: '¡Cuéntanos sobre ti!', inputId: 'bio', isRequired: true }

    const onUpdateUsername = (formData) => {
        try {
            logics.users.updateUsername(formData['username'])
            updateHeader(Date.now())
            setRefreshUserCard(Date.now())
            setShowUsernameForm(false)
        } catch (error) {
            alert('¡Ups! ¡Inténtalo de nuevo!')
            console.error(error)
        }
    }

    const onUpdateAvatar = (formData) => {
        setIsLocalAvatar(formData['avatar-64'] ? true : false)
        try {
            if (isLocalAvatar) {
                const newAvatar = formData['avatar-64']
                const image = new FileReader();
                image.onload = () => {
                    const base64 = image.result;
                    setTempAvatar(base64)
                };
                image.readAsDataURL(newAvatar)
            } else {
                setTempAvatar(formData['avatar-url'])
            }


            logics.users.updateAvatar(tempAvatar)
            updateHeader(Date.now())
            setRefreshUserCard(Date.now())
            setShowAvatarForm(false)

        } catch (error) {
            alert('¡Ups! ¡Inténtalo de nuevo!')
            console.error(error)
        }
    }

    const onUpdateBio = (formData) => {
        try {
            logics.users.updateBio(formData['bio'])
            updateHeader(Date.now())
            setRefreshUserCard(Date.now())
            setShowBioForm(false)
        } catch (error) {
            alert('¡Ups! ¡Inténtalo de nuevo!')
            console.error(error)
        }
    }

    const onChangeTemporal = (newTempAvatar, isBase64Avatar) => {
        setIsLocalAvatar(isBase64Avatar)
        setTempAvatar(newTempAvatar)
    }

    const saveRandomBio = (error, newBio) => {
        if (error) alert(error)
        else {
            logics.users.updateBio(newBio)
            setRefreshUserCard(Date.now())
        }
    }

    const onRandomBioClick = () => {
        try {
            logics.users.getRandomBio(saveRandomBio)
        } catch (error) {
            alert('Ups, algo salió mal')
            console.error(error)
        }
    }

    return (
        <div className="profile">
            <UserCard userId={getLoggedUserId()} refreshSelf={refreshUserCard} tempAvatar={tempAvatar} />
            
            <section className="profile__section">
                <div className="profile__section-header" onClick={() => setShowUsernameForm(!showUsernameForm)}>
                    <h2 className="profile__section-title">
                        <i className="bi bi-person"></i>
                        Cambiar nombre de usuario
                    </h2>
                    <i className={`profile__section-icon bi bi-chevron-down ${showUsernameForm ? 'profile__section-icon--open' : ''}`}></i>
                </div>
                {showUsernameForm && (
                    <div className="profile__form-container">
                        <Form inputsArray={[usernameObject]} onSubmitCallback={onUpdateUsername} submitButtonText="Guardar nuevo nombre" />
                    </div>
                )}
            </section>

            <section className="profile__section">
                <div className="profile__section-header" onClick={() => setShowAvatarForm(!showAvatarForm)}>
                    <h2 className="profile__section-title">
                        <i className="bi bi-image"></i>
                        Cambiar avatar
                    </h2>
                    <i className={`profile__section-icon bi bi-chevron-down ${showAvatarForm ? 'profile__section-icon--open' : ''}`}></i>
                </div>
                {showAvatarForm && (
                    <div className="profile__form-container">
                        <Form inputsArray={[avatarObject, avatarObject2]} onSubmitCallback={onUpdateAvatar} submitButtonText="Guardar nuevo avatar" onChangeCallback={onChangeTemporal} />
                    </div>
                )}
            </section>

            <section className="profile__section">
                <div className="profile__section-header" onClick={() => setShowBioForm(!showBioForm)}>
                    <h2 className="profile__section-title">
                        <i className="bi bi-file-text"></i>
                        Cambiar biografía
                    </h2>
                    <i className={`profile__section-icon bi bi-chevron-down ${showBioForm ? 'profile__section-icon--open' : ''}`}></i>
                </div>
                {showBioForm && (
                    <>
                        <div className="profile__form-container">
                            <Form inputsArray={[bioObject]} onSubmitCallback={onUpdateBio} submitButtonText="Guardar nueva biografía" />
                        </div>
                        <div className="profile__bio-section">
                            <h3 className="profile__bio-title">¿Sin ideas?</h3>
                            <p>Genera una biografía aleatoria:</p>
                            <button className="profile__random-btn" onClick={onRandomBioClick}>
                                ¡Generar!
                            </button>
                        </div>
                    </>
                )}
            </section>
        </div>
    )
}

export default MyProfile