var data = {
    findUserById: function (id) { 
        // Obtenemos los usuarios almacenados en localStorage (si existen)
        var usersJson = localStorage.users;

        // Si no hay usuarios en la base de datos, devolvemos undefined
        if (!usersJson) return undefined;

        // Convertimos la cadena JSON en un array de objetos JavaScript
        var users = JSON.parse(usersJson);

        // Buscamos en el array el usuario que tenga el mismo ID que el proporcionado
        var userFound = users.find(function (user) { 
            return user.id === id;
        });

        // Retornamos el usuario encontrado (o undefined si no se encuentra)
        return userFound;
    },

    findUserByEmail: function (email) { 
        // Obtenemos los usuarios almacenados en localStorage
        var usersJson = localStorage.users;

        // Si no hay usuarios guardados, devolvemos undefined
        if (!usersJson) return undefined;

        // Convertimos la cadena JSON en un array de objetos JavaScript
        var users = JSON.parse(usersJson);

        // Buscamos en el array el usuario que tenga el mismo email que el proporcionado
        var userFound = users.find(function (user) { 
            return user.email === email;
        });

        // Retornamos el usuario encontrado (o undefined si no existe)
        return userFound;
    },

    createUser: function (user) { 
        // user = {email: "percy1@mail.com", password: "percy1@mail.com", username: "percy1", id: 1740600285989}

        // Obtenemos los usuarios almacenados en localStorage
        var usersJson = localStorage.users;
        var users;

        // Si no hay usuarios en localStorage, inicializamos un array vacío
        if (!usersJson) {
            users = [];
        } else {
            // Si existen usuarios, convertimos la cadena JSON en un array de objetos JavaScript
            users = JSON.parse(usersJson);
        }

        // Agregamos el nuevo usuario al array de usuarios
        users.push(user);

        // Guardamos el array actualizado en localStorage convirtiéndolo a JSON
        localStorage.setItem('users', JSON.stringify(users));
    }
}

