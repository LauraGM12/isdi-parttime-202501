var data = {
    // Función para encontrar un usuario por su ID
    findUserById: function (id) { 
        var usersJson = localStorage.users // Obtiene los datos de los usuarios almacenados en localStorage
        
        if (!usersJson) return undefined // Si no hay usuarios almacenados, devuelve undefined

        var users = JSON.parse(usersJson) // Convierte la cadena JSON en un array de objetos JavaScript

        // Busca un usuario en el array cuyo ID coincida con el proporcionado
        var userFound = users.find(function (user) { return user.id === id }) 

        return userFound // Devuelve el usuario encontrado o undefined si no existe
    },

    // Función para encontrar un usuario por su email
    findUserByEmail: function (email) {
        var usersJson = localStorage.users // Obtiene los usuarios almacenados en localStorage
        
        if (!usersJson) return undefined // Si no hay usuarios almacenados, devuelve undefined

        var users = JSON.parse(usersJson) // Convierte la cadena JSON en un array de objetos JavaScript

        // Busca un usuario en el array cuyo email coincida con el proporcionado
        var userFound = users.find(function (user) { return user.email === email })

        return userFound // Devuelve el usuario encontrado o undefined si no existe
    },

    // Función para crear un nuevo usuario y almacenarlo en localStorage
    createUser: function (user) { 
        // user debería tener la estructura: {email: "correo", password: "clave", username: "nombre", id: 123456789}

        var usersJson = localStorage.users // Obtiene los datos de los usuarios en localStorage
        var users; 
        
        if (!usersJson) {
            users = [] // Si no hay datos almacenados, inicializa un array vacío
        } else {
            users = JSON.parse(usersJson) // Si hay datos, conviértelos de JSON a un array de objetos
        }

        users.push(user) // Agrega el nuevo usuario al array

        localStorage.setItem('users', JSON.stringify(users)) // Guarda el array actualizado en localStorage
    }
}
