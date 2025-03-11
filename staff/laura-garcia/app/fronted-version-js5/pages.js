var body = document.body;  // Guarda una referencia al elemento <body> del HTML
var currentView;  // Variable para almacenar la vista actual

/*PAGES crean las diferentes vistas de la app*/

// Función que crea la página de registro
function createRegisterPage() {
    var registerContainer = createContainer('');  // Crea un contenedor vacío para la página de registro
    var logo = createLogo('2rem');  // Crea el logo con un tamaño de 2rem
    logo.addEventListener('click', function () { navigateToLanding(registerContainer) })  // Redirige a la página de inicio cuando se hace clic en el logo
    var header = createHeader(logo);  // Crea el encabezado con el logo
    var welcomeTitle = createTextContainer('h1', 'Bienvenido a mi aplicación sin nombre', '');  // Título de bienvenida
    var registerTitle = createTextContainer('p', 'Crea una cuenta', 'p_login-account');  // Subtítulo de registro
    var objectName = { label: 'Nombre', inputType: 'text', inputPlaceholder: 'Nombre', inputId: 'nombre', isRequired: true }  // Objeto para el campo de nombre
    var objectEmail = { label: 'Email', inputType: 'email', inputPlaceholder: 'my@email.com', inputId: 'email', isRequired: true };  // Objeto para el campo de email
    var objectPassword = { label: 'Contraseña', inputType: 'password', inputPlaceholder: '*******', inputId: 'password', isRequired: true }  // Objeto para el campo de contraseña
    var objectConfirmPassword = { label: 'Confirmar contraseña', inputType: 'password', inputPlaceholder: '*******', inputId: 'confirmation-password', isRequired: true }  // Objeto para el campo de confirmación de contraseña
    var registerForm = createForm([objectName, objectEmail, objectPassword, objectConfirmPassword], 'Crear cuenta', registerUser)  // Crea el formulario de registro con los objetos creados y la función de registro

    var toLoginButton = createButton('Iniciar Sesión', 'secondary-button', function () { navigateToLogin(view) })  // Crea un botón que redirige a la página de login
    var view = appendChildren(registerContainer, header, welcomeTitle, registerTitle, registerForm, toLoginButton)  // Agrega todos los elementos creados al contenedor de registro

    return view  // Devuelve la vista de registro creada
}

// Función que crea la página de inicio (Home)
function createHomePage() {
    var homeContainer = createContainer('');  // Crea un contenedor vacío para la página de inicio
    var loggedUserId;  // Variable para almacenar el ID del usuario logueado
    if (localStorage.id) {
        loggedUserId = JSON.parse(localStorage.getItem('id'));  // Si hay un ID en localStorage, lo obtiene
    } else {
        loggedUserId = JSON.parse(sessionStorage.getItem('id'));  // Si no, lo obtiene de sessionStorage
    }

    var userLogged = data.findUserById(loggedUserId)  // Busca al usuario en la base de datos por su ID

    if (!userLogged) {
        showModal('inicia sesión o create una cuenta primero, listillo tocacódigos')  // Si no se encuentra el usuario, muestra un mensaje de error
        return createRegisterPage();  // Redirige a la página de registro si no hay usuario logueado
    }

    // Crea los elementos del encabezado
    var headerLeft = createContainer('header-left');  // Contenedor para la parte izquierda del encabezado
    var logo = createLogo('2rem');  // Crea el logo con tamaño de 2rem
    logo.className = 'header-logo';  // Asigna una clase CSS al logo
    appendChildren(headerLeft, logo);  // Añade el logo al contenedor izquierdo del encabezado

    var headerCenter = createContainer('header-center');  // Contenedor para la parte central del encabezado
    var welcomeText = createTextContainer('h1', `Bienvenido, ${userLogged.username}`, 'welcome-text');  // Crea un texto de bienvenida con el nombre del usuario
    appendChildren(headerCenter, welcomeText);  // Añade el texto de bienvenida al centro del encabezado

    var headerRight = createContainer('header-right');  // Contenedor para la parte derecha del encabezado
    var userIconContainer = createContainer('user-icon-container');  // Contenedor para el icono del usuario
    userIconContainer.innerHTML = icons_login_user;  // Asigna el icono del usuario al contenedor
    var dropdownContent = createContainer('dropdown-content');  // Contenedor para el contenido desplegable
    var profileButton = createButton('Perfil', 'dropdown-button', function () {navigateToProfile(homeContainer)})  // Crea un botón para ir al perfil del usuario
    var favouritesButton = createButton('Favoritos', 'dropdown-button', function () {navigateToFavourites(homeContainer)})  // Crea un botón para ver los favoritos
    var formsButton = createButton('Formularios', 'dropdown-button', function () {navigateToForms(homeContainer)})  // Crea un botón para ver los formularios
    var logoutButton = createButton('Cerrar Sesión', 'dropdown-button', function () {  // Crea un botón para cerrar sesión
        if (sessionStorage.id) {
            sessionStorage.removeItem('id');  // Elimina el ID de la sesión
        }
        if (localStorage.id) {
            localStorage.removeItem('id');  // Elimina el ID de localStorage
        }
        navigateToLogin(homeContainer);  // Redirige a la página de login
    })
    
    appendChildren(dropdownContent, profileButton, favouritesButton, formsButton, logoutButton);  // Añade los botones al contenido desplegable
    appendChildren(userIconContainer, dropdownContent);  // Añade el contenido desplegable al contenedor del icono de usuario
    appendChildren(headerRight, userIconContainer);  // Añade el contenedor con el icono del usuario al lado derecho del encabezado

    // Crea el encabezado completo
    var header = createHeader(headerLeft, headerCenter, headerRight);  // Junta las tres partes del encabezado
    header.className = 'home-header';  // Asigna una clase CSS al encabezado

    appendChildren(homeContainer, header);  // Añade el encabezado a la página de inicio
    return homeContainer;  // Devuelve la vista de la página de inicio
}

// Función que crea la página de login
function createLoginPage() {
    var loginContainer = createContainer('');  // Crea un contenedor vacío para la página de login
    var logo = createLogo('2rem');  // Crea el logo con tamaño de 2rem
    logo.addEventListener('click', function () { navigateToLanding(loginContainer) })  // Redirige a la página de inicio cuando se hace clic en el logo
    var header = createHeader(logo);  // Crea el encabezado con el logo
    var welcomeTitle = createTextContainer('h1', 'Bienvenido a mi aplicación sin nombre', '');  // Título de bienvenida
    var loginTitle = createTextContainer('p', 'Inicia sesión en tu cuenta', 'p_login-account');  // Subtítulo de login
    var objectEmail = { label: 'Email', inputType: 'email', inputPlaceholder: 'Introduce tu dirección de email', inputId: 'email', isRequired: true }  // Objeto para el campo de email
    var objectPassword = { label: 'Contraseña', inputType: 'password', inputPlaceholder: 'Contraseña', inputId: 'password', isRequired: true }  // Objeto para el campo de contraseña
    var objectRemember = { label: 'Recuérdame', inputType: 'checkbox', inputValue: 'remember', inputId: 'remember', isRequired: false }  // Objeto para la opción de "recordarme"
    var forgotPassword = createTextContainer('p', '¿Has olvidado tu contraseña?', 'forgot-password-text');  // Enlace para recuperar la contraseña
    var loginForm = createForm([objectEmail, objectPassword, objectRemember], 'Iniciar Sesión', loginUser);  // Crea el formulario de login con los objetos creados
    var newUserText = createTextContainer('p', '¿Eres nuevo usuario?', 'form-helper-text');  // Texto que pregunta si el usuario es nuevo
    var toRegisterButton = createButton('Crear cuenta', 'secondary-button', function () { navigateToRegister(loginContainer) })  // Crea un botón para redirigir a la página de registro

    appendChildren(loginContainer, header, welcomeTitle, loginTitle, loginForm, forgotPassword, newUserText, toRegisterButton);  // Añade todos los elementos al contenedor de login
    return loginContainer;  // Devuelve la vista de la página de login
}

// Crea la página de inicio
function createLandingPage() {
    var landingContainer = createContainer('landing');  // Crea un contenedor para la landing page
    var contentContainer = createContainer('landing__content');  // Crea un contenedor para el contenido de la landing page
    var landingTitle = createTextContainer('h1', 'Mi app sin nombre', 'landing__title');  // Título de la landing page
    var landingSubtitle = createTextContainer('h2', 'Mi red social', 'landing__subtitle');  // Subtítulo de la landing page
    var joinButton = createButton('Entrar', 'header__join-button', function () { navigateToRegister(landingContainer) })  // Botón para entrar, redirige al registro

    var logo = createLogo('20rem');  // Crea el logo con tamaño de 20rem
    var header = createHeader(joinButton);  // Crea el encabezado con el botón de unirse
    
    currentView = landingContainer;  // Asigna la vista actual como la landing page

    // Agrega los elementos creados al contenedor de contenido
    appendChildren(contentContainer, landingTitle, logo, landingSubtitle, joinButton);

    // Agrega el contenido y el encabezado al contenedor de la landing page
    appendChildren(landingContainer, header, contentContainer);
    return landingContainer;  // Devuelve el contenedor de la landing page
}

// Renderiza la landing page en el body
function renderLanding() {
    var landingContainer = createLandingPage();  // Crea la landing page

    body.appendChild(landingContainer);  // Añade la landing page al body
}

// Renderiza la página principal (home) en el body
function renderHomePage() {
    var homePage = createHomePage();  // Crea la página principal (home)
    body.appendChild(homePage);  // Añade la página principal al body
}

// Funciones de navegación entre vistas

// Crea la vista de registro y reemplaza la vista anterior
function navigateToRegister(previousView) {
    var registerView = createRegisterPage();  // Crea la vista de registro
    currentView = registerView;  // Asigna la vista actual como la vista de registro

    body.replaceChild(registerView, previousView);  // Reemplaza la vista anterior por la de registro
}

// Crea la vista principal (home) y reemplaza la vista anterior
function navigateToHome(previousView) {
    var homeView = createHomePage();  // Crea la vista de home
    currentView = homeView;  // Asigna la vista actual como la vista de home

    body.replaceChild(homeView, previousView);  // Reemplaza la vista anterior por la de home
}

// Renderiza la vista de login y reemplaza la vista anterior
function navigateToLogin(previousView) {
    var loginContainer = createLoginPage();  // Crea la vista de login

    currentView = loginContainer;  // Asigna la vista actual como la de login

    body.replaceChild(loginContainer, previousView);  // Reemplaza la vista anterior por la de login
}

// Crea la vista de landing y reemplaza la vista anterior
function navigateToLanding(previousView) {
    var landingContainer = createLandingPage();  // Crea la vista de landing

    currentView = landingContainer;  // Asigna la vista actual como la de landing

    body.replaceChild(landingContainer, previousView);  // Reemplaza la vista anterior por la de landing
}

// Función que maneja la navegación hacia la vista de formularios
function navigateToForms(previousView) {
    var formsView = createFormsPage();  // Crea la vista de formularios
    currentView = formsView;  // Asigna la vista actual como la de formularios
    body.replaceChild(formsView, previousView);  // Reemplaza la vista anterior por la de formularios
}

// Crea la vista de formularios
function createFormsPage() {
    var formsContainer = createContainer('');  // Crea el contenedor para la vista de formularios
    
    // Reutiliza el encabezado de la página de home
    var headerLeft = createContainer('header-left');  // Contenedor para el lado izquierdo del encabezado
    var logo = createLogo('2rem');  // Crea el logo con tamaño de 2rem
    logo.className = 'header-logo';  // Asigna una clase al logo
    appendChildren(headerLeft, logo);  // Añade el logo al contenedor izquierdo

    var headerCenter = createContainer('header-center');  // Contenedor para el centro del encabezado
    var welcomeText = createTextContainer('h1', 'Mis Publicaciones', 'welcome-text');  // Texto de bienvenida
    appendChildren(headerCenter, welcomeText);  // Añade el texto de bienvenida al centro del encabezado

    var headerRight = createContainer('header-right');  // Contenedor para el lado derecho del encabezado
    var userIconContainer = createContainer('user-icon-container');  // Contenedor para el icono de usuario
    userIconContainer.innerHTML = icons_login_user;  // Asigna el icono de usuario al contenedor
    var dropdownContent = createContainer('dropdown-content');  // Contenedor para el menú desplegable
    var profileButton = createButton('Perfil', 'dropdown-button', function () { navigateToProfile(formsContainer) })  // Botón para el perfil
    var favouritesButton = createButton('Favoritos', 'dropdown-button', function () { navigateToFavourites(formsContainer) })  // Botón para favoritos
    var formsButton = createButton('Formularios', 'dropdown-button', function () { navigateToForms(formsContainer) })  // Botón para formularios
    var logoutButton = createButton('Cerrar Sesión', 'dropdown-button', function () {  // Botón para cerrar sesión
        if (sessionStorage.id) sessionStorage.removeItem('id');  // Elimina el ID de la sesión
        if (localStorage.id) localStorage.removeItem('id');  // Elimina el ID del almacenamiento local
        navigateToLogin(formsContainer);  // Redirige a la página de login
    });

    appendChildren(dropdownContent, profileButton, favouritesButton, formsButton, logoutButton);  // Añade los botones al menú desplegable
    appendChildren(userIconContainer, dropdownContent);  // Añade el contenido desplegable al icono del usuario
    appendChildren(headerRight, userIconContainer);  // Añade el icono del usuario al lado derecho del encabezado

    var header = createHeader(headerLeft, headerCenter, headerRight);  // Crea el encabezado completo
    header.className = 'home-header';  // Asigna una clase CSS al encabezado

    // Crea el formulario para crear publicaciones
    var formContainer = createContainer('post-form-container');  // Contenedor para el formulario de publicación
    var formTitle = createTextContainer('h2', 'Crear nueva publicación', 'post-form-title');  // Título del formulario
    var titleInput = {  // Objeto para el campo de título
        label: 'Título', 
        inputType: 'text', 
        inputPlaceholder: 'Escribe un título...', 
        inputId: 'post_title', 
        isRequired: true 
    };
    var contentInput = {  // Objeto para el campo de contenido
        label: 'Contenido', 
        inputType: 'text', 
        inputPlaceholder: 'Escribe el contenido...', 
        inputId: 'post_content', 
        isRequired: true 
    };

    var postForm = createForm([titleInput, contentInput], 'Publicar', savePost);  // Crea el formulario de publicación
    appendChildren(formContainer, formTitle, postForm);  // Añade el formulario al contenedor

    // Contenedor para mostrar las publicaciones existentes
    var postsContainer = createContainer('posts-container');
    displayExistingPosts(postsContainer);  // Muestra las publicaciones existentes

    appendChildren(formsContainer, header, formContainer, postsContainer);  // Añade todos los elementos a la vista de formularios
    return formsContainer;  // Devuelve el contenedor de formularios
}

// Función para guardar la publicación
function savePost(formData) {  // Recibe los datos del formulario
    var userId = localStorage.id || sessionStorage.id;  // Obtiene el ID del usuario desde el almacenamiento

    var post = {  // Crea el objeto de la publicación
        id: Date.now(),  // Asigna un ID único basado en la fecha
        userId: JSON.parse(userId),  // Asigna el ID del usuario
        title: formData.post_title,  // Asigna el título de la publicación
        content: formData.post_content,  // Asigna el contenido de la publicación
        date: new Date().toISOString()  // Asigna la fecha de creación de la publicación
    };

    var posts = JSON.parse(localStorage.getItem('posts') || '[]');  // Obtiene las publicaciones existentes o un arreglo vacío
    posts.push(post);  // Añade la nueva publicación al arreglo
    localStorage.setItem('posts', JSON.stringify(posts));  // Guarda las publicaciones en el almacenamiento local

    navigateToForms(currentView);  // Redirige a la vista de formularios
}

// Función para mostrar las publicaciones existentes
function displayExistingPosts(container) {
    var posts = JSON.parse(localStorage.getItem('posts') || '[]');  // Obtiene las publicaciones del almacenamiento local
    var userId = localStorage.id || sessionStorage.id;  // Obtiene el ID del usuario

    if (!userId) return;  // Si no hay usuario logueado, sale de la función

    var userPosts = posts.filter(post => post.userId === JSON.parse(userId));  // Filtra las publicaciones del usuario logueado

    if (userPosts.length === 0) {  // Si no hay publicaciones, muestra un mensaje
        var noPostsMessage = createTextContainer('p', 'No hay publicaciones todavía', 'no-posts-message');
        container.appendChild(noPostsMessage);
        return;
    }

    // Ordena las publicaciones por fecha, de la más reciente a la más antigua
    userPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Crea un elemento para cada publicación
    userPosts.forEach(post => {
        var postElement = createContainer('post-item');
        var postTitle = createTextContainer('h3', post.title, 'post-title');  // Título de la publicación
        var postContent = createTextContainer('p', post.content, 'post-content');  // Contenido de la publicación
        var postDate = createTextContainer('span', new Date(post.date).toLocaleDateString(), 'post-date');  // Fecha de la publicación

        // Añade el nombre de usuario
        var user = data.findUserById(post.userId);  // Obtiene el usuario que hizo la publicación
        var userName = createTextContainer('span', `Publicado por: ${user.username}`, 'post-author');

        appendChildren(postElement, userName, postTitle, postContent, postDate);  // Añade los elementos a la publicación
        container.appendChild(postElement);  // Añade la publicación al contenedor
    });
}
