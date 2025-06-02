import { useNavigate } from "react-router"
import { useState, useEffect } from "react"
import Form from "../../components/lib/Form"
import logics from "../../logic"
import Btn from "../../components/lib/Btn"
import locales from "../../locales"
import "./Register.css"

const Register = ({ setRefreshHeader, locale }) => {
    const [translations, setTranslations] = useState(locales[locale]['register'])
    const [formTranslations, setFormTranslations] = useState(locales[locale]['forms'])

    const objectEmail = { 
        label: formTranslations.emailLabel, 
        inputType: 'email', 
        inputPlaceholder: formTranslations.emailPlaceholder, 
        inputId: 'email', 
        isRequired: true 
    }
    const objectPassword = { 
        label: formTranslations.passwordLabel, 
        inputType: 'password', 
        inputPlaceholder: '·········', 
        inputId: 'password', 
        isRequired: true 
    }
    const objectConfirmPassword = { 
        label: formTranslations.confirmPasswordLabel, 
        inputType: 'password', 
        inputPlaceholder: '·········', 
        inputId: 'confirmation-password', 
        isRequired: true 
    }
    
    const navigate = useNavigate()

    useEffect(() => {
        setTranslations(locales[locale]['register'])
        setFormTranslations(locales[locale]['forms'])
    }, [locale])

    const onRegisterUser = (formData) => {
        try {
            logics.users.registerUser(formData)
            setRefreshHeader(Date.now())
            navigate('/')
        } catch (error) {
            alert(translations.errorMsg)
            console.error(error)
        }
    }

    return <div className="main-container">
        <h1>{translations.title}</h1>
        <Form 
            inputsArray={[objectEmail, objectPassword, objectConfirmPassword]} 
            submitButtonText={translations.submit} 
            onSubmitCallback={onRegisterUser} 
        />
        <div className="register__login">
            <span className="register__login--text">{translations.haveAccount}</span>
            <Btn 
                btnClassnames="register-button" 
                btnContent={translations.toLogin} 
                btnCallback={() => navigate('/login')} 
            />
        </div>
    </div>
}

export default Register