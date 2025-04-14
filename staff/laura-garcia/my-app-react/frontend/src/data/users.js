const users = {
    findUserById: (id) => { //definimos la función para poder acceder a ella
        const usersJson = localStorage.users //nos traemos los users de la bbdd del localStorage
        if (!usersJson) return undefined //si no hay bbdd devolvemos undefined porque no hay ningun usuario

        const users = JSON.parse(usersJson) //si sí hay bbdd la convertimos a js

        const userFound = users.find(user => user.id === id) //buscamos el usuario con el mismo id usando el metodo find

        return userFound //lo devolvemos
    },
    findUserByEmail: (email) => {
        const usersJson = localStorage.users
        if (!usersJson) return undefined

        const users = JSON.parse(usersJson)

        const userFound = users.find(user => user.email === email)

        return userFound
    },
    findUserByUsername: (username) => {
        const usersJson = localStorage.users
        if (!usersJson) return undefined

        const users = JSON.parse(usersJson)

        const userFound = users.find(user => user.username === username)

        return userFound
    },
    createUser: (user) => { //e.g user = {email: "percy1@mail.com", password: "percy1@mail.com", username: "percy1", id: 1740600285989}
        const usersJson = localStorage.users
        let users;
        if (!usersJson) {
            users = []
        } else {
            users = JSON.parse(usersJson)
        }

        users.push(user)

        localStorage.setItem('users', JSON.stringify(users))
    },
    updateUserById: (id, newUserData) => {
        const users = localStorage.users ? JSON.parse(localStorage.getItem("users")) : [];
        const userIndex = users.findIndex(user => user.id === id)
        if (userIndex === -1) {
            return
        }

        users[userIndex] = newUserData

        localStorage.users = JSON.stringify(users)
    },
    deleteUserById: (id) => {
        const users = localStorage.users ? JSON.parse(localStorage.getItem("users")) : [];
        const userIndex = users.findIndex(user => user.id === id)
        if (userIndex === -1) {
            return
        }

        users.splice(userIndex, 1)

        localStorage.users = JSON.stringify(users)
    }
}

export default users