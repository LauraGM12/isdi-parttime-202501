import { useState, useEffect } from "react"
import Form from "../../components/lib/Form"
import logics from "../../logic/index"
import UserCard from "../../components/UserCard"
import getToken from "../../logic/helpers/getToken"
import locales from "../../locales"
import './MyProfile.css'
import useCustomContext from "../../hooks/useCustomContext"

const MyProfile = ({ updateHeader, locale }) => {
    const [showUsernameForm, setShowUsernameForm] = useState(false)
    const [showAvatarForm, setShowAvatarForm] = useState(false)
    const [showBioForm, setShowBioForm] = useState(false)
    const [refreshUserCard, setRefreshUserCard] = useState(Date.now())
    const [tempAvatar, setTempAvatar] = useState()
    const [isLocalAvatar, setIsLocalAvatar] = useState(false)
    const [translations, setTranslations] = useState(locales[locale]['userProfile']['myProfile'])
    const [formTranslations, setFormTranslations] = useState(locales[locale]['forms'])

    const { alert } = useCustomContext()

    useEffect(() => {
        setTranslations(locales[locale]['userProfile']['myProfile'])
        setFormTranslations(locales[locale]['forms'])
    }, [locale])



    const usernameObject = { 
        label: translations.usernameLabel, 
        inputType: 'text', 
        inputPlaceholder: translations.usernamePlaceholder, 
        inputId: 'username', 
        isRequired: true 
    }
    const avatarObject = { 
        label: translations.avatarLocalLabel, 
        inputType: 'file', 
        inputPlaceholder: '', 
        inputId: 'avatar-64', 
        isRequired: false 
    }
    const avatarObject2 = { 
        label: translations.avatarUrlLabel, 
        inputType: 'url', 
        inputPlaceholder: translations.avatarUrlPlaceholder, 
        inputId: 'avatar-url', 
        isRequired: false 
    }
    const bioObject = { 
        label: translations.bioLabel, 
        inputType: 'text-area', 
        inputPlaceholder: translations.bioPlaceholder, 
        inputId: 'bio', 
        isRequired: true 
    }

     const onUpdateUsername = (formData, onSuccess) => {
        try {
            logics.users.updateUsername(formData['username'])
                .catch(error => alert(error))
                .then(() => {
                    onSuccess()
                    updateHeader(Date.now())
                    setRefreshUserCard(Date.now())
                    setShowUsernameForm(false)
                })
        } catch (error) {
            alert(error)
        }
    }

    const onUpdateAvatar = (formData, onSuccess) => {
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
                .then(() => {
                    onSuccess()
                    updateHeader(Date.now())
                    setRefreshUserCard(Date.now())
                    setShowAvatarForm(false)
                })
                .catch(error => alert(error))

        } catch (error) {
            alert(formTranslations.errorMsg)
            alert(error)
        }
    }

    const onUpdateBio = (formData, onSuccess) => {
        try {
            logics.users.updateBio(formData['bio'])
                .then(() => {
                    onSuccess()
                    setRefreshUserCard(Date.now())
                    setShowBioForm(false)
                })
                .catch(error => {
                    alert(error)
                })

        } catch (error) {
            alert(formTranslations.errorMsg)
            alert(error)
        }
    }

    const onChangeTemporal = (newTempAvatar, isBase64Avatar) => {
        setIsLocalAvatar(isBase64Avatar)
        setTempAvatar(newTempAvatar)
    }

    const onRandomBioClick = () => {
        try {
            logics.users.getRandomBio()
                .then((randomBio) => {
                    logics.users.updateBio(randomBio)
                        .then(() => {
                            setRefreshUserCard(Date.now())
                            setShowBioForm(false)
                        })
                        .catch(error => {
                            alert(error)
                        })
                })
                .catch(error => alert(error))
        } catch (error) {
            alert(error)
        }
    }

    return (
        <div className="profile">
            <UserCard userId="me" refreshSelf={refreshUserCard} tempAvatar={tempAvatar} locale={locale} isMyProfile={true} />
            
            <section className="profile__section">
                <div className="profile__section-header" onClick={() => setShowUsernameForm(!showUsernameForm)}>
                    <h2 className="profile__section-title">
                        <i className="bi bi-person"></i>
                        {translations.changeUsername}
                    </h2>
                    <i className={`profile__section-icon bi bi-chevron-down ${showUsernameForm ? 'profile__section-icon--open' : ''}`}></i>
                </div>
                {showUsernameForm && (
                    <div className="profile__form-container">
                        <Form inputsArray={[usernameObject]} onSubmitCallback={onUpdateUsername} submitButtonText={translations.saveNewName} />
                    </div>
                )}
            </section>

            <section className="profile__section">
                <div className="profile__section-header" onClick={() => setShowAvatarForm(!showAvatarForm)}>
                    <h2 className="profile__section-title">
                        <i className="bi bi-image"></i>
                        {translations.changeAvatar}
                    </h2>
                    <i className={`profile__section-icon bi bi-chevron-down ${showAvatarForm ? 'profile__section-icon--open' : ''}`}></i>
                </div>
                {showAvatarForm && (
                    <div className="profile__form-container">
                        <Form inputsArray={[avatarObject, avatarObject2]} onSubmitCallback={onUpdateAvatar} submitButtonText={translations.saveNewAvatar} onChangeCallback={onChangeTemporal} />
                    </div>
                )}
            </section>

            <section className="profile__section">
                <div className="profile__section-header" onClick={() => setShowBioForm(!showBioForm)}>
                    <h2 className="profile__section-title">
                        <i className="bi bi-file-text"></i>
                        {translations.changeBio}
                    </h2>
                    <i className={`profile__section-icon bi bi-chevron-down ${showBioForm ? 'profile__section-icon--open' : ''}`}></i>
                </div>
                {showBioForm && (
                    <>
                        <div className="profile__form-container">
                            <Form inputsArray={[bioObject]} onSubmitCallback={onUpdateBio} submitButtonText={translations.saveNewBio} />
                        </div>
                        <div className="profile__bio-section">
                            <h3 className="profile__bio-title">{translations.noIdeas}</h3>
                            <p>{translations.generateBio}</p>
                            <button className="profile__random-btn" onClick={onRandomBioClick}>
                                {translations.generate}
                            </button>
                        </div>
                    </>
                )}
            </section>
        </div>
    )
}

export default MyProfile