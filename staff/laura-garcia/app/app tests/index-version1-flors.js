var body = document.body;  // Obtiene el cuerpo del documento HTML (la etiqueta <body>) para manipularla.
var currentView;  // Variable para almacenar la vista actual.

/*Función para añadir multiples hijos a el elemento padre que es el primero que pasamos hecha por nosotros para ver más fors*/
function appendChildren() {
    var parent = arguments[0];  // El primer argumento será el contenedor al que vamos a agregar hijos.
    for (var i = 1; i < arguments.length; i++) {
        parent.appendChild(arguments[i]);   // Agrega todos los elementos posteriores como hijos del contenedor.
    }
    return parent;  // Retorna el contenedor con los hijos añadidos.
}

/*Crear un elemento html que contiene texto*/
function createTextContainer(tag, text, style) {
    var element = document.createElement(tag);  // Crea un nuevo elemento HTML del tipo especificado por 'tag'.
    element.textContent = text;  // Establece el texto del elemento.
    element.className = style;  // Establece el estilo CSS del elemento.
    return element;  // Retorna el nuevo elemento creado.
}

/*Crear un botón y le pasa en el parametro "callback" que es la función que se ejecuta al hacer click*/
function createButton(text, style, callback) {
    var button = document.createElement('button');  // Crea un botón HTML.
    button.className = style;  // Establece el estilo del botón.
    button.textContent = text;  // Establece el texto que aparecerá en el botón.
    button.addEventListener('click', callback);  // Asocia la función 'callback' que se ejecutará al hacer click en el botón.
    return button;  // Retorna el botón creado.
}

/*Crear un contenedor (un div con estilos definidos)*/
function createContainer(style) {
    var container = document.createElement('div');  // Crea un contenedor (div) HTML.
    container.className = style;  // Asigna una clase CSS al contenedor.
    return container;  // Retorna el contenedor.
}

/*Crear un formulario dinámico*/
function createForm(inputsArray, submitButtonText, callback) {
    var formContainer = document.createElement('form');  // Crea un formulario.
    formContainer.className = 'form';  // Establece el estilo del formulario.
    
    for (var i = 0; i < inputsArray.length; i++) {
        var input = inputsArray[i];  // Accede a cada objeto que contiene información del input.
        var label = document.createElement('label');  // Crea una etiqueta para el input.
        label.htmlFor = input.inputId;  // Asocia la etiqueta con el id del input.
        label.textContent = input.label;  // Establece el texto de la etiqueta.

        var inputElement = document.createElement('input');  // Crea el input.
        inputElement.type = input.inputType;  // Define el tipo de input (ej., 'email', 'password').
        inputElement.id = input.inputId;  // Asigna un id único al input.
        inputElement.placeholder = input.inputPlaceholder;  // Define un texto de sugerencia en el input.
        inputElement.required = input.isRequired;  // Define si el campo es obligatorio.

        appendChildren(formContainer, label, inputElement);  // Añade la etiqueta y el input al formulario.
    }

    // Cambiar a un botón <button> en lugar de un <input>
    var submitButton = document.createElement('button');  // Crea un botón imput HTML.
    submitButton.textContent = submitButtonText;  // Establece el texto que aparecerá en el botón.
    submitButton.className = 'create-account';  // Asigna la clase para estilizarlo (como lo has hecho en CSS).

    formContainer.appendChild(submitButton);  // Añade el botón al formulario.

    formContainer.addEventListener('submit', function (event) {
        event.preventDefault();  // Evita que el formulario se envíe de forma tradicional.

        var form = event.target;  // Obtiene el formulario desde el evento.
        var formData = {};  // Crea un objeto vacío para almacenar los datos del formulario.

        for (var i = 0; i < inputsArray.length; i++) {
            var fieldName = inputsArray[i].inputId;  // Obtiene el id del campo.
            var value;
            
            // Manejar correctamente los campos de checkbox
            if (inputsArray[i].inputType === 'checkbox') {
                value = form[inputsArray[i].inputId].checked;
            } else {
                value = form[inputsArray[i].inputId].value;  // Obtiene el valor ingresado por el usuario en el campo.
            }

            formData[fieldName] = value;  // Almacena el valor del campo en el objeto formData.
        }

        callback(formData);  // Llama a la función callback con los datos del formulario.
    });

    return formContainer;  // Retorna el formulario con todos los inputs y el botón de envío.
}

// Función para mostrar el modal
function showModal(message) {
    var modal = document.getElementById("myModal");
    var modalText = modal.querySelector(".modal-content p");
    modalText.textContent = message;  // Cambia el mensaje del modal
    modal.style.display = "block";  // Muestra el modal

    // Obtener el botón de cerrar y agregar el evento de cierre
    var span = modal.querySelector(".close");
    span.onclick = function() {
        modal.style.display = "none";  // Cierra el modal cuando se hace clic en el "X"
    }

    // Cierra el modal si se hace clic fuera del modal
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

function registerUser(registerData) {
    if (!registerData['email'] || !registerData['password'] || !registerData['confirmation-password']) {
        alert('Registro de datos incompleto');  // Si los datos del formulario no están completos, muestra una alerta.
        return;
    }
    if (registerData['password'] !== registerData['confirmation-password']) {
        alert('La contraseña y la contraseña de confirmación no coinciden');  // Si las contraseñas no coinciden, muestra una alerta.
        return;
    }

    /*Podriamos longitud, y caracteres de la contraseñar, validar que el mail no esta en uso, etc*/

    var usersJson = localStorage.getItem('users'); // Cambiado a localStorage para consistencia

    var users;
    if (!usersJson) {  // Si no hay usuarios guardados, crea un array vacío.
        users = [];
    } else {
        users = JSON.parse(usersJson);  // Si hay usuarios, los convierte de JSON a un objeto JavaScript.
    }

    //comprobar si el user ya existe
    var doesUserExist = users.some(function (_user) { return _user.email === registerData['email']; });  // Verifica si el usuario ya existe.
    if (doesUserExist) {
        showModal('¡Esta cuenta ya está en uso!');  // Muestra el modal si la cuenta ya existe.
        return;
    }

    var username = registerData['email'].split('@')[0];  // Usa el correo para generar un nombre de usuario (antes del '@').
    var userCreated = { email: registerData['email'], password: registerData['password'], username, id: Date.now() };  // Crea un objeto con la información del usuario.

    users.push(userCreated);  // Añade el nuevo usuario al array de usuarios.
    localStorage.setItem('users', JSON.stringify(users));  // Guarda el array de usuarios en localStorage como JSON.

    sessionStorage.setItem('id', userCreated.id);  // Guarda el id del usuario en sessionStorage (para mantener la sesión abierta).
    
    navigateToHome(currentView);  // Navega a la página de inicio.
}

function loginUser(loginData) {
    var usersJson = localStorage.getItem('users');  // Obtiene la lista de usuarios desde localStorage.
    
    if (!usersJson) {
        alert("No hay usuarios registrados");
        return;
    }
    
    var users = JSON.parse(usersJson);  // Convierte el JSON de usuarios a un objeto JavaScript.
    var userLoginCheckout = users.find(function (_user) { return _user['email'] === loginData['email']; });  // Verifica si el email existe en los usuarios.

    if (!userLoginCheckout || userLoginCheckout['password'] !== loginData['password']) {  // Si el email o la contraseña no coinciden, muestra una alerta.
        alert("Las credenciales son incorrectas");
        return;
    }

    if (loginData['remember-me']) {
        localStorage.setItem('id', userLoginCheckout.id); // Si "Recuérdame" está marcado, guarda en localStorage
    } else {
        sessionStorage.setItem('id', userLoginCheckout.id); // Si no, guarda en sessionStorage
    }
    
    navigateToHome(currentView);  // Navega a la página de inicio.
}

function createLoginPage() {
    var loginContainer = createContainer('');
    var loginTitle = createTextContainer('h1', 'Iniciar sesión', '');
    var objectEmail = { label: 'Email', inputType: 'email', inputPlaceholder: 'my@email.com', inputId: 'email', isRequired: true };
    var objectPassword = { label: 'Password', inputType: 'password', inputPlaceholder: 'Contraseña', inputId: 'password', isRequired: true };
    var objectRememberMe = { label: 'Recuerdarme', inputType: 'checkbox', inputId: 'remember-me', isRequired: false };
    
    var loginForm = createForm(
        [objectEmail, objectPassword, objectRememberMe],
        'Iniciar Sesión', 
        loginUser
    );

    var toRegisterButton = createButton('Crear cuenta', '', function () { navigateToRegister(loginContainer); });  // Crea un botón para ir a la página de registro.

    appendChildren(loginContainer, loginTitle, loginForm, toRegisterButton);  // Añade todo al contenedor de login.
    return loginContainer;  // Retorna la vista de login.
}

function createRegisterPage() {
    var registerContainer = createContainer('');  // El contenedor para la página
    var registerTitle = createTextContainer('h1', 'Crear cuenta', '');
    var objectEmail = { label: 'Email', inputType: 'email', inputPlaceholder: 'Email', inputId: 'email', isRequired: true };
    var objectPassword = { label: 'Contraseña', inputType: 'password', inputPlaceholder: 'Contraseña', inputId: 'password', isRequired: true };
    var objectConfirmPassword = { label: 'Confirmar contraseña', inputType: 'password', inputPlaceholder: 'Confirmar Contraseña', inputId: 'confirmation-password', isRequired: true };
    var registerForm = createForm([objectEmail, objectPassword, objectConfirmPassword], 'Crear Cuenta', registerUser);  // Crea el formulario de registro.
    var toLoginButton = createButton('Iniciar Sesión', '', function () { navigateToLogin(registerContainer); });  // Crea un botón para ir a la página de login.
    var view = appendChildren(registerContainer, registerTitle, registerForm, toLoginButton);  // Añade todo al contenedor.

    return view;  // Retorna la vista de registro.
}

function createHomePage() {
    var homeContainer = createContainer('');
    // Intentar obtener el id desde localStorage primero (si "Recuérdame" estaba activo)
    var loggedUserId = localStorage.getItem('id');
    
    // Si no está en localStorage, intentar obtenerlo de sessionStorage
    if (!loggedUserId) {
        loggedUserId = sessionStorage.getItem('id');
    }
    
    if (loggedUserId) {
        loggedUserId = parseInt(loggedUserId); // Convertir a número si es necesario
    }
    
    var usersJson = localStorage.getItem('users');  // Obtiene la lista de usuarios de localStorage.
    
    if (!usersJson) {
        alert('No hay usuarios registrados');
        return createRegisterPage();
    }
    
    var users = JSON.parse(usersJson);  // Convierte el JSON a un objeto JavaScript.
    var userLogged = users.find(function (_user) { return _user.id === loggedUserId; });  // Busca el usuario logueado en la lista.

    if (!userLogged) {  // Si no se encuentra el usuario logueado, muestra la vista de registro.
        alert('Inicia sesión o crea una cuenta primero');
        return createRegisterPage();  // Muestra la página de registro.
    }

    var loggedUserUsername = userLogged.username;  // Obtiene el nombre de usuario para mostrar un mensaje personalizado.
    var welcomeText = createTextContainer('h1', `Bienvenid@, ${loggedUserUsername}`, '');  // Crea un mensaje de bienvenida.

    var logoutButton = createButton('Cerrar Sesión', '', function () { 
        // Al cerrar sesión, eliminar tanto de localStorage como de sessionStorage
        localStorage.removeItem('id'); 
        sessionStorage.removeItem('id');
        navigateToLogin(homeContainer); 
    });  // Crea un botón para cerrar sesión.
    
    appendChildren(homeContainer, welcomeText, logoutButton);  // Añade los elementos al contenedor de la página de inicio.

    return homeContainer;  // Retorna la vista de inicio.
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
    currentView = homePage;  // Actualiza la vista actual
    body.appendChild(homePage);  // Añade la vista de inicio al cuerpo del documento.
}


///************AÑADIDO A INDEX.JS *********/
// Verificar si hay una sesión activa (en localStorage o sessionStorage)
if (localStorage.getItem('id') || sessionStorage.getItem('id')) {
    renderHomePage();
} else {
    renderLanding();
}
////***************************************/