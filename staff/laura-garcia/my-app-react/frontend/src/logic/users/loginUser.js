import data from "../../data"
import { AuthError, ExistenceError } from "../../utils/errors"
import validator from "../../utils/validators"

const loginUser = (loginData) => { //{'email': 'patata@mail.com'}
    //comprobamos si el email que ha puesto el usuario esta en la bbdd y si no lo esta, lanzamos un alert
    validator.password(loginData['password'])
    validator.email(loginData['email'])

    const userLoginCheckout = data.users.findUserByEmail(loginData['email'])

    //comprueba que el usuario loggeado esta en nuestra ddbb(si es que tenemos una base de datos)
    //si esta en la base de datos, comprobamos que la cotnraseña coincide con la del usuario, sino, lanzamos un alert
    if (!userLoginCheckout) throw new ExistenceError('Usuario no encontrado')

    if (userLoginCheckout['password'] !== loginData['password']) {
        throw new AuthError("Credenciales incorrectas")
    }

    if (loginData['remember']) {
        localStorage.id = userLoginCheckout.id
    } else {
        sessionStorage.id = userLoginCheckout.id
    }

    //y si se cumple todo, guardamos el id en el session storage y navegamos a home*/

}

export default loginUser