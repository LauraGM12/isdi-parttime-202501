import { errors } from 'common'

const getUserProfile = async (username) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/users/profile/user/${username}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (response.status === 200) {
            const profile = await response.json()
            return profile.data 
        } else {
            const body = await response.json()
            throw new errors[body.name](body.message)
        }
    } catch (error) {
        if (error instanceof errors.ExistenceError || error instanceof errors.AuthError) {
            throw error
        }
        throw new errors.ServerError('Error al conectar con el servidor')
    }
}

const updateUserProfile = async (profileData, token) => {
    try {
        const dataToSend = { ...profileData };
        
        if (dataToSend.avatar instanceof File) {
            const base64Avatar = await convertFileToBase64(dataToSend.avatar);
            dataToSend.avatar = base64Avatar;
        }
        
        const response = await fetch(`${import.meta.env.VITE_API_URL}/users/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(dataToSend)
        })

        if (response.status === 200) {
            const updatedProfile = await response.json()
            return updatedProfile 
        } else {
            const body = await response.json()
            throw new errors[body.name](body.message)
        }
    } catch (error) {
        if (error instanceof errors.ValidationError || error instanceof errors.DuplicityError) {
            throw error
        }
        throw new errors.ServerError('Error al conectar con el servidor')
    }
}


const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file); 
        reader.onload = () => resolve(reader.result); 
        reader.onerror = (error) => reject(error); 
    });
};

const getOwnProfile = async (token) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/users/profile/own`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            }
        })

        if (response.status === 200) {
            const profile = await response.json()
            return profile.data 
        } else {
            const body = await response.json()
            throw new errors[body.name](body.message)
        }
    } catch (error) {
        if (error instanceof errors.ExistenceError || error instanceof errors.AuthError) {
            throw error
        }
        throw new errors.ServerError('Error al conectar con el servidor')
    }
}

export { getUserProfile, updateUserProfile, getOwnProfile }