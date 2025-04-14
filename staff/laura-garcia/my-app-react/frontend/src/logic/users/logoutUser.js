const logoutUser = () => {
    if (sessionStorage.id) {
        sessionStorage.removeItem('id')
    }
    if (localStorage.id) {
        localStorage.removeItem('id')
    }
}

export default logoutUser