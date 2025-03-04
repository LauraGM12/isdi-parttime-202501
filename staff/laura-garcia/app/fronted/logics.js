function registerUser(registerData) {
    if (!registerData['email'] && !registerData['password'] && !registerData['confirmation-password']) {
        alert('Registro de datos incompleto');  // Si los datos del formulario no están completos, muestra una alerta.
        return;
    }
    if (registerData['password'] !== registerData['confirmation-password']) {
        alert('La contraseña y la contraseña de confirmación no coinciden');  // Si las contraseñas no coinciden, muestra una alerta.
        return;
    }

    /*Podriamos longitud, y caracteres de la contraseñar, validar que el mail no esta en uso, etc*/

    var usersJson = localStorage.getItem('users'); //comprobamos si en el localStorage hay una bbdd de juguete ya creada (se almacena como JSON)

    var usersJson = localStorage.getItem('users');  // Obtiene los usuarios almacenados en localStorage.
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
    localStorage.users = JSON.stringify(users);  // Guarda el array de usuarios en localStorage como JSON.

    sessionStorage.id = userCreated.id;  // Guarda el id del usuario en sessionStorage (para mantener la sesión abierta).
    navigateToHome(currentView);  // Navega a la página de inicio.
}