import landing from './pages/landing.mjs'
import login from './pages/login.mjs'
import register from './pages/register.mjs'

const navigate = (page) => {
    const body = document.body;
    
    switch (page) {
        case 'landing':
            login.dismount();
            landing.mount(body);
            break;
        case 'login':
            if (document.getElementById('register')) {
                register.dismount();
            } else {
                landing.dismount();
            }
            login.mount(body);
            break;
        case 'register':
            login.dismount();
            register.mount(body);
            break;
        default:
            console.error('Page not found');
    }
}

export default navigate;