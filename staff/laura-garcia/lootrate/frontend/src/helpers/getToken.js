import { validator } from "common";

const getToken = () => {
    let token;
    if (localStorage.token) {
        token = localStorage.getItem('token');
    } else {
        token = sessionStorage.getItem('token');
    }

    return token
}

export default getToken