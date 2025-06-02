const isUserLoggedIn = () => {
    if (localStorage.token) {
        return true
    }
    if (sessionStorage.token) {
        return true
    }

    return false
}

export default isUserLoggedIn