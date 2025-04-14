import { useNavigate } from "react-router"
import Form from "../../components/lib/Form"
import logics from "../../logic"
import Btn from "../../components/lib/Btn"
import "./Login.css"

const Login = ({ setRefreshHeader }) => {
    const objectEmail = { label: 'Correo', inputType: 'email', inputPlaceholder: 'mi@correo.com', inputId: 'email', isRequired: true }
    const objectPassword = { label: 'Contraseña', inputType: 'password', inputPlaceholder: '·········', inputId: 'password', isRequired: true }
    const objectRemember = { label: 'Recordarme', inputType: 'checkbox', inputValue: 'remember', inputId: 'remember', isRequired: false }
    const navigate = useNavigate()

    const onLoginUser = (formData) => {
        try {
            logics.users.loginUser(formData)
            setRefreshHeader(Date.now())
            navigate('/')
        } catch (error) {
            alert('Algo salió mal, revisa tus credenciales')
            console.error(error)
        }
    }

    return <div className="main-container">
        <h1>Iniciar Sesión</h1>
        <Form inputsArray={[objectEmail, objectPassword, objectRemember]} submitButtonText={'Iniciar Sesión'} onSubmitCallback={onLoginUser} />
        <div className="login__register">
            <span className="login__register--text">¿Eres nuevo aquí?</span>
            <Btn 
                btnClassnames="landing__button" 
                btnContent="¡Regístrate ahora!" 
                btnCallback={() => navigate('/register')} 
            />
        </div>
    </div>
}

export default Login