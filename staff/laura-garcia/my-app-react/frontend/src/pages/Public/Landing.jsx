import { useNavigate } from 'react-router-dom'
import Logo from "../../components/lib/Logo"
import "./Landing.css"

const Landing = () => {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleRegisterClick = () => {
        navigate('/register');
    };

    return (
        <div className="landing">
            <h1 className="landing__title">Bienvenido a nuestra aplicación</h1>
            <Logo size={"lg"} />
            <h2 className="landing__subtitle">Gestiona tus formularios de manera eficiente y segura</h2>
            <div className="landing__buttons">
                <button 
                    className="landing__button landing__button--register" 
                    onClick={handleRegisterClick}
                >
                    Registrarse
                </button>
                <button 
                    className="landing__button landing__button--login" 
                    onClick={handleLoginClick}
                >
                    Iniciar Sesión
                </button>
            </div>
        </div>
    )
}

export default Landing