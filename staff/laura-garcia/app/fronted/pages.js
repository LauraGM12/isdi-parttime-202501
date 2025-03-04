function createRegisterPage() {
    var registerContainer = createContainer('');  // El contenedor para la página
    var registerTitle = createTextContainer('h1', 'Crear cuenta', '');
    var objectEmail = { inputType: 'email', inputPlaceholder: 'Email', inputId: 'email', isRequired: true };
    var objectPassword = { inputType: 'password', inputPlaceholder: 'Contraseña', inputId: 'password', isRequired: true };
    var objectConfirmPassword = { inputType: 'password', inputPlaceholder: 'Confirmar Contraseña', inputId: 'confirmation-password', isRequired: true };
    var registerForm = createForm([objectEmail, objectPassword, objectConfirmPassword], 'Crear Cuenta', registerUser);  // Crea el formulario de registro.

    var toLoginButton = createButton('Iniciar Sesión', '', function () { navigateToLogin(view); });  // Crea un botón para ir a la página de login.
    var view = appendChildren(registerContainer, registerTitle, registerForm, toLoginButton);  // Añade todo al contenedor.

    return view;  // Retorna la vista de registro.
}

function createHomePage() {
    var homeContainer = createContainer('');
    var loggedUserId = JSON.parse(sessionStorage.getItem('id'));  // Obtiene el id del usuario logueado desde sessionStorage.
    var usersJson = localStorage.getItem('users');  // Obtiene la lista de usuarios de localStorage.
    var users = JSON.parse(usersJson);  // Convierte el JSON a un objeto JavaScript.

    var userLogged = users ? users.find(function (_user) { return _user.id === loggedUserId; }) : undefined;  // Busca el usuario logueado en la lista.

    if (!userLogged) {  // Si no se encuentra el usuario logueado, muestra la vista de registro.
        alert('inicia sesión o crea una cuenta primero');
        return createRegisterPage();  // Muestra la página de registro.
    }

    var loggedUserUsername = userLogged.username;  // Obtiene el nombre de usuario para mostrar un mensaje personalizado.
    var welcomeText = createTextContainer('h1', `Bienvenid@, ${loggedUserUsername}`, '');  // Crea un mensaje de bienvenida.

    var logoutButton = createButton('Logout', '', function () { sessionStorage.removeItem('id'); navigateToLogin(homeContainer); });  // Crea un botón para cerrar sesión.
    appendChildren(homeContainer, welcomeText, logoutButton);  // Añade los elementos al contenedor de la página de inicio.

    return homeContainer;  // Retorna la vista de inicio.
}

function loginUser(loginData) {
    var usersJson = localStorage.getItem('users');  // Obtiene la lista de usuarios desde localStorage.
    var users = JSON.parse(usersJson);  // Convierte el JSON de usuarios a un objeto JavaScript.

    var userLoginCheckout = users ? users.find(function (_user) { return _user['email'] === loginData['email']; }) : undefined;  // Verifica si el email existe en los usuarios.

    if (!userLoginCheckout || userLoginCheckout['password'] !== loginData['password']) {  // Si el email o la contraseña no coinciden, muestra una alerta.
        alert("Las credenciales son incorrectas");
        return;
    }

    sessionStorage.id = userLoginCheckout.id;  // Si las credenciales son correctas, guarda el id en sessionStorage.
    navigateToHome(currentView);  // Navega a la página de inicio.
}

function createLoginPage() {
    var loginContainer = createContainer('');
    var loginTitle = createTextContainer('h1', 'Iniciar sesión', '');
    var objectEmail = { label: 'Email', inputType: 'email', inputPlaceholder: 'my@email.com', inputId: 'email', isRequired: true };
    var objectPassword = { label: 'Password', inputType: 'password', inputPlaceholder: 'Contraseña', inputId: 'password', isRequired: true };
    var loginForm = createForm([objectEmail, objectPassword], 'Iniciar sesión', loginUser);  // Crea el formulario de login.
    var toRegisterButton = createButton('Crear cuenta', '', function () { navigateToRegister(loginContainer); });  // Crea un botón para ir a la página de registro.

    appendChildren(loginContainer, loginTitle, loginForm, toRegisterButton);  // Añade todo al contenedor de login.
    return loginContainer;  // Retorna la vista de login.
}

function navigateToRegister(previousView) {
    var registerView = createRegisterPage();  // Crea la vista de registro.
    currentView = registerView;  // Actualiza la vista actual.

    body.replaceChild(registerView, previousView);  // Reemplaza la vista anterior con la nueva vista de registro.
}

function navigateToHome(previousView) {
    var homeView = createHomePage();  // Crea la vista de inicio.
    currentView = homeView;  // Actualiza la vista actual.

    body.replaceChild(homeView, previousView);  // Reemplaza la vista anterior con la nueva vista de inicio.
}

function navigateToLogin(previousView) {
    var loginContainer = createLoginPage();  // Crea la vista de login.
    currentView = loginContainer;  // Actualiza la vista actual.

    body.replaceChild(loginContainer, previousView);  // Reemplaza la vista anterior con la nueva vista de login.
}
//CÓDIGO FLORS
/*function renderLanding() {
    var landingContainer = createContainer('');
    var landingTitle = createTextContainer('h1', 'MY APP', 'title');  // Crea el título de la página de aterrizaje.
    var joinButton = createButton('¡Entrar!', '', function () { navigateToRegister(landingContainer); });  // Crea un botón para unirse.

    currentView = landingContainer;  // Actualiza la vista actual.
    landingContainer.appendChild(landingTitle);  // Añade el título al contenedor de landing.
    landingContainer.appendChild(joinButton);  // Añade el botón de unirse al contenedor de landing.
    body.appendChild(landingContainer);  // Añade el contenedor de landing al cuerpo del documento.
}*/

function renderLanding() {
    var landingContainer = createContainer('logo-container');
    var landingTitleImage = document.createElement('img');
    landingTitleImage.src = 'img/logo-smarthive.png';  // Ruta correcta de tu imagen
    landingTitleImage.alt = 'SmartHive';  // Descripción para accesibilidad y SEO
    landingTitleImage.className = 'logo';  // Si necesitas aplicar una clase CSS
    
    var joinButton = createButton('¡Entrar!', '', function () { navigateToRegister(landingContainer); });

    currentView = landingContainer;  // Actualiza la vista actual.
    landingContainer.appendChild(landingTitleImage);  // Añadir la imagen en vez del texto
    landingContainer.appendChild(joinButton);  // Añadir el botón de unirse al contenedor de landing
    body.appendChild(landingContainer);  // Añadir el contenedor de landing al cuerpo del documento.
}


function renderHomePage() {
    var homePage = createHomePage();  // Crea la vista de inicio.
    body.appendChild(homePage);  // Añade la vista de inicio al cuerpo del documento.
}

sessionStorage.id ? renderHomePage() : renderLanding();  // Si hay un id de usuario logueado, renderiza la página de inicio. Si no, muestra la página de aterrizaje (landing).