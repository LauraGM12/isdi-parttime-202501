import { createButton, createLogo, createTextContainer } from '../lib.mjs'
import { getLoggedUserUsername } from '../logics.mjs'
import navigate from '../navigate.mjs'


const onUserMenuClick = (homeContainer) => {
    const menu = document.getElementById('user-menu')
    if (menu) {
        closeUserMenu()
    } else {
        openUserMenu(homeContainer)
    }
}

const openUserMenu = (homeContainer) => {
    const menu = document.createElement('aside')
    menu.className = 'header__user-menu'
    menu.id = 'user-menu'

    const button1 = createButton('Mi perfil', 'secondary-button', () => closeUserMenu)
    const button2 = createButton('Formularios', 'secondary-button', () => closeUserMenu)
    const button3 = createButton('Cambiar Contraseña', 'secondary-button', () => closeUserMenu)

    const logoutButton = createButton('Cerrar Sesión', 'form__submit-button', () => {
        if (sessionStorage.id) {
            sessionStorage.removeItem('id')
        }
        if (localStorage.id) {
            localStorage.removeItem('id')
        }
        closeUserMenu()
        navigate('home', 'login')
    })

    menu.append(button1, button2, button3, logoutButton)
    homeContainer.appendChild(menu)
}

const closeUserMenu = () => {
    const menu = document.getElementById('user-menu')

    menu.remove()
}


const header = {
    mount: (parentNode, parentName) => {
        const header = document.createElement('header')
        header.className = 'header'

        const logo = parentName !== 'landing' ? createLogo('2rem') : undefined
        switch (parentName) {
            case "home":
                //header de home
                const username = getLoggedUserUsername()
                const welcomeText = createTextContainer('p', `Bienvenido, ${username}`, '')
                const userButton = createButton(username[0].toUpperCase(), 'header__user-button', () => onUserMenuClick(parentNode))

                header.append(logo, welcomeText, userButton)
                break
            case "landing":
                const joinButton = createButton('Join in!', 'header__join-button', () => navigate('landing', 'register'))

                header.appendChild(joinButton)
                break
            case "login":
            case "register":
                logo.addEventListener('click', () => navigate(parentName, 'landing'))

                header.appendChild(logo)
                break
            default:
                //otro
                break
        }

        parentNode.appendChild(header)
    }
}

export default header