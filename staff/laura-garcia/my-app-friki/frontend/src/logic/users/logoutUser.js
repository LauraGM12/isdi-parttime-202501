const logoutUser = () => {
    if (sessionStorage.token) {
        sessionStorage.removeItem('token')
    }
    if (localStorage.token) {
        localStorage.removeItem('token')
    }
}

export default logoutUser