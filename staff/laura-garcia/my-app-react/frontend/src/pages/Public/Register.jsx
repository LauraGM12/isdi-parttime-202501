import { useNavigate } from "react-router"
import Form from "../../components/lib/Form"
import logics from "../../logic"
import Btn from "../../components/lib/Btn"
import "./Register.css"

const Register = ({ setRefreshHeader }) => {
    const objectEmail = { label: 'Correo', inputType: 'email', inputPlaceholder: 'mi@correo.com', inputId: 'email', isRequired: true }
    const objectPassword = { label: 'Contraseña', inputType: 'password', inputPlaceholder: '·········', inputId: 'password', isRequired: true }
    const objectConfirmPassword = { label: 'Confirmar contraseña', inputType: 'password', inputPlaceholder: '·········', inputId: 'confirmation-password', isRequired: true }
    const navigate = useNavigate()

    const onRegisterUser = (formData) => {
        try {
            logics.users.registerUser(formData)
            setRefreshHeader(Date.now())
            navigate('/')
        } catch (error) {
            alert('Revisa los datos del formulario, algo salió mal')
            console.error(error)
        }
    }

    return <div className="main-container">
        <h1>Registro</h1>
        <Form inputsArray={[objectEmail, objectPassword, objectConfirmPassword]} submitButtonText={'Registrarse'} onSubmitCallback={onRegisterUser} />
        <div className="register__login">
            <span className="register__login--text">¿Ya tienes una cuenta?</span>
            <Btn 
                btnClassnames="landing__button" 
                btnContent="¡Inicia sesión!" 
                btnCallback={() => navigate('/login')} 
            />
        </div>
    </div>
}

export default Register