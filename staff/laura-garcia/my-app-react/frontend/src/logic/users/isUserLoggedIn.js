const isUserLoggedIn = () => {
    if (localStorage.id) {
        return true
    }
    if (sessionStorage.id) {
        return true
    }

    return false
}

export default isUserLoggedIn