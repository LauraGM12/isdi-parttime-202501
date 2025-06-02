import { useNavigate } from "react-router"
import { useEffect, useState } from "react"
import Form from "../../components/lib/Form"
import logics from "../../logic"
import Btn from "../../components/lib/Btn"
import locales from "../../locales"
import "./Login.css"

const Login = ({ setRefreshHeader, locale }) => {
    const [translations, setTranslations] = useState(locales[locale]['login'])
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
    const objectRemember = { 
        label: formTranslations.remember, 
        inputType: 'checkbox', 
        inputValue: 'remember', 
        inputId: 'remember', 
        isRequired: false 
    }
    const navigate = useNavigate()
    
    useEffect(() => {
        setTranslations(locales[locale]['login'])
        setFormTranslations(locales[locale]['forms'])
    }, [locale])

    const onLoginUser = (formData, onSuccess) => {
        try {
            logics.users.loginUser(formData)
                .then(() => {
                    onSuccess()
                    setRefreshHeader(Date.now())
                    navigate('/home')
                })
                .catch(error => alert(error))
        } catch (error) {
            alert(error)
        }
    }

    return <div className="main-container">
        <h1>{translations.title}</h1>
        <Form 
            inputsArray={[objectEmail, objectPassword, objectRemember]} 
            submitButtonText={translations.submit} 
            onSubmitCallback={onLoginUser} 
        />
        <div className="login__register">
            <span className="login__register--text">{translations.new}</span>
            <Btn 
                btnClassnames="register-button" 
                btnContent={translations.toRegister} 
                btnCallback={() => navigate('/register')} 
            />
        </div>
    </div>
}

export default Login