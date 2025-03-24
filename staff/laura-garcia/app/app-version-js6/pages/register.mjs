import { registerUser } from '../logics.mjs'
import { createButton, createContainer, createForm, createLogo, createTextContainer } from '../lib.mjs'
import navigate from '../navigate.mjs';
import header from '../components/header.mjs';

const register = {
    mount: (body) => {
        console.info('register mounted')
        const registerContainer = createContainer('register');
        registerContainer.id = 'register';

        header.mount(registerContainer, 'register')

        const logo = createLogo('')
        const welcomeTitle = createTextContainer('h1', 'Bienvenido a mi aplicación sin nombre', '');
        const registerTitle = createTextContainer('p', 'Crea una cuenta', 'p_login-account');
        const objectName = { label: 'Nombre', inputType: 'text', inputPlaceholder: 'Nombre', inputId: 'nombre', isRequired: true }
        const objectEmail = { label: 'Email', inputType: 'email', inputPlaceholder: 'Introduce tu dirección de email', inputId: 'email', isRequired: true };
        const objectPassword = { label: 'Contraseña', inputType: 'password', inputPlaceholder: 'Contraseña', inputId: 'password', isRequired: true }
        const objectConfirmPassword = { label: 'Confirmar Contraseña', inputType: 'password', inputPlaceholder: 'Contraseña', inputId: 'confirmation-password', isRequired: true }
        const registerForm = createForm([objectName, objectEmail, objectPassword, objectConfirmPassword], 'Register', registerUser) //usamos una función que nos permite registrar el usuario y cambiar de vista

        const newUserText = createTextContainer('p', '¿Ya tienes cuenta?', 'form-helper-text');
        const toLoginButton = createButton('Iniciar Sesión', 'secondary-button', () => navigate('login'))
        const toLoginContainer = createContainer('register__login')

        toLoginContainer.append(newUserText, toLoginButton)  // Changed from toLoginText to newUserText

        registerContainer.append(logo, welcomeTitle, registerTitle, registerForm, toLoginContainer)

        body.appendChild(registerContainer)
    },
    dismount: () => {
        console.info('register dismounted')
        const register = document.getElementById('register');
        register.remove()
    },
    update: (body) => {
        register.dismount();
        register.mount(body);
    }
}


export default register