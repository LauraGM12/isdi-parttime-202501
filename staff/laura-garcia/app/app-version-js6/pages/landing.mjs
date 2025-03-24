import { createContainer, createLogo, createTextContainer, createButton } from '../lib.mjs'
import navigate from '../navigate.mjs';

const landing = {
    mount: (body) => {
        console.info('landing mounted')
        const landingContainer = createContainer('landing');
        landingContainer.id = 'landing'
        const contentContainer = createContainer('landing__content')
        const landingTitle = createTextContainer('h1', 'Mi app sin nombre', 'landing__title');
        const landingSubtitle = createTextContainer('h2', 'Mi red social', 'landing__subtitle');
        const joinButton = createButton('¡Entrar!', 'header__join-button', () => {
            console.log('Button clicked');
            navigate('login'); 
        });

        joinButton.style.cursor = 'pointer';
        joinButton.type = 'button';

        const logo = createLogo('10rem');

        contentContainer.append(landingTitle, logo, landingSubtitle, joinButton)

        landingContainer.append(contentContainer)

        body.appendChild(landingContainer)
    },
    dismount: () => {
        console.info('landing dismounted')
        const landing = document.getElementById('landing');
        landing.remove()
    },
    update: (body) => {
        landing.dismount();
        landing.mount(body);
    }
}

export default landing