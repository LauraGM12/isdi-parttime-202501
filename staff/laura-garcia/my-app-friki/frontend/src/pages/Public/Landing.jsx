import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Logo from "../../components/lib/Logo"
import locales from "../../locales"
import "./Landing.css"

const Landing = ({ locale }) => {
    const [translations, setTranslations] = useState(locales[locale]['landing'])
    const navigate = useNavigate()

    useEffect(() => {
        setTranslations(locales[locale]['landing'])
    }, [locale])

    const handleLoginClick = () => {
        navigate('/login')
    }

    const handleRegisterClick = () => {
        navigate('/register')
    }

    return (
        <div className="landing">
            <h1 className="landing__title">{translations.title}</h1>
            <Logo size={"lg"} />
            <h2 className="landing__subtitle">{translations.subtitle}</h2>
            <div className="landing__buttons">
                <button 
                    className="landing__button landing__button--register" 
                    onClick={handleRegisterClick}
                >
                    {translations.register}
                </button>
                <button 
                    className="landing__button landing__button--login" 
                    onClick={handleLoginClick}
                >
                    {translations.login}
                </button>
            </div>
        </div>
    )
}

export default Landing