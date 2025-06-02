import { validator } from 'common'

const checkPasswordSecurity = (password) => {
    return validator.passwordSecurity(password)
}

export default checkPasswordSecurity