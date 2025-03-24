import { loginUser } from '../logics.mjs'
import { createButton, createContainer, createForm, createLogo, createTextContainer } from '../lib.mjs'
import navigate from '../navigate.mjs'
import header from '../components/header.mjs'

const login = {
    mount: (body) => {
        console.info('login mounted')
        const loginContainer = createContainer('login')
        loginContainer.id = 'login'

        header.mount(loginContainer, 'login')
        
        const logo = createLogo('')
        const welcomeTitle = createTextContainer('h1', 'Bienvenido a mi aplicación sin nombre', '');
        const loginTitle = createTextContainer('p', 'Inicia sesión en tu cuenta', 'p_login-account');
        const objectEmail = { label: 'Email', inputType: 'email', inputPlaceholder: 'Introduce tu dirección de email', inputId: 'email', isRequired: true }
        const objectPassword = { label: 'Contraseña', inputType: 'password', inputPlaceholder: 'Contraseña', inputId: 'password', isRequired: true }
        const objectRemember = { label: 'Recuérdame', inputType: 'checkbox', inputValue: 'remember', inputId: 'remember', isRequired: false }
        const loginForm = createForm([objectEmail, objectPassword, objectRemember], 'Iniciar Sesión', loginUser)
        const toRegisterText = createTextContainer('span', '¿Has olvidado tu contraseña?', 'forgot-password-text')
        const newUserText = createTextContainer('p', '¿Eres nuevo usuario?', 'form-helper-text');
        const toRegisterButton = createButton('Crear cuenta', 'secondary-button', () => navigate('register'))
        const toRegisterContainer = createContainer('login__register')

        toRegisterContainer.append(toRegisterText, toRegisterButton)

        loginContainer.append(logo, welcomeTitle, loginTitle, loginForm, toRegisterText, newUserText, toRegisterContainer)
        body.appendChild(loginContainer)
    },
    dismount: () => {
        console.info('login dismounted')
        const login = document.getElementById('login');
        login.remove()
    },
    update: (body) => {
        login.dismount();
        login.mount(body);
    }
}

export default login