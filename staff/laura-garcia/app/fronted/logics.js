/* Lógicas internas de las funcionalidades de la app */

function loginUser(loginData) { // loginData = {'email': 'patata@mail.com'}
    // Comprobamos si el email ingresado por el usuario existe en la base de datos
    var userLoginCheckout = data.findUserByEmail(loginData['email']);

    // Si el usuario no existe o la contraseña no coincide, mostramos un mensaje de error
    if (!userLoginCheckout || userLoginCheckout['password'] !== loginData['password']) {
        showModal("Credenciales incorrectas");
        return;
    }

    // Si el usuario eligió "recordar sesión", guardamos el ID en localStorage (persistente)
    if (loginData['remember']) {
        localStorage.id = userLoginCheckout.id;
    } else {
        // Si no, guardamos el ID en sessionStorage (se borra al cerrar la pestaña)
        sessionStorage.id = userLoginCheckout.id;
    }

    // Redirigimos a la página de inicio
    navigateToHome(currentView);
}

/* Función para registrar un nuevo usuario */
function registerUser(registerData) { 
    // registerData = {'email': '', 'password': '', 'confirmation-password': ''}

    // Verificamos que el usuario ha ingresado todos los datos obligatorios
    if (!registerData['email'] || !registerData['password'] || !registerData['confirmation-password']) { 
        showModal('Registro de datos incompleto');
        return;
    }

    // Verificamos si las contraseñas coinciden
    if (registerData['password'] !== registerData['confirmation-password']) {
        showModal('La contraseña y la confirmación no coinciden');
        return;
    }

    /* Aquí podríamos validar:
       - Longitud y seguridad de la contraseña
       - Que el email tenga formato válido
       - Que el email no esté en uso, etc.
    */

    // Comprobamos si el usuario ya existe en la base de datos
    var doesUserExist = data.findUserByEmail(registerData['email']);
    if (doesUserExist) {
        showModal('Algo ha ido mal, inténtalo de nuevo con nuevas credenciales');
        return;
    }

    // Creamos un nombre de usuario usando la parte antes del @ en el email
    var username = registerData['email'].split('@')[0];

    // Creamos el objeto del usuario con un ID único basado en la fecha actual
    var userCreated = { 
        email: registerData['email'], 
        password: registerData['password'], 
        username, 
        id: Date.now() 
    };

    // Guardamos el usuario en la base de datos (localStorage)
    data.createUser(userCreated);

    // Almacenamos su ID en sessionStorage para mantener la sesión activa
    sessionStorage.id = userCreated.id;

    // Redirigimos a la página de inicio
    navigateToHome(currentView);
}

/* Función para mostrar un mensaje modal */
function showModal(message) {
    var modal = document.getElementById("myModal"); // Obtenemos el modal
    var span = modal.querySelector(".close"); // Botón de cierre (X)
    var modalText = modal.querySelector("p"); // Elemento donde se muestra el mensaje
    
    modalText.textContent = message; // Insertamos el mensaje en el modal
    modal.style.display = "flex"; // Hacemos visible el modal

    // Cerrar el modal cuando el usuario haga clic en la "X"
    span.onclick = function() {
        modal.style.display = "none";
    };

    // Cerrar el modal si el usuario hace clic fuera de él
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
}
