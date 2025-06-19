// Importamos las clases de error desde el módulo común
import * as errors from '../../../../common/errors.js'

/**
 * Obtiene el perfil público de un usuario específico por su nombre de usuario.
 * Esta función permite ver la información de perfil de cualquier usuario
 * registrado en el sistema sin necesidad de autenticación.
 * 
 * @async
 * @function getUserProfile
 * @param {string} username - El nombre de usuario del perfil a obtener
 * @returns {Promise<Object>} Una promesa que resuelve con los datos del perfil del usuario
 * @throws {ExistenceError} Cuando el usuario no existe
 * @throws {AuthError} Cuando hay problemas de autorización
 * @throws {ServerError} Cuando hay problemas de conexión con el servidor
 * 
 * @example
 * // Obtener perfil de usuario
 * try {
 *   const perfil = await getUserProfile('nombreUsuario')
 *   console.log('Perfil del usuario:', perfil)
 * } catch (error) {
 *   console.error('Error al obtener perfil:', error.message)
 * }
 */
const getUserProfile = async (username) => {
    try {
        // Realizamos petición GET al endpoint de perfil público
        const response = await fetch(`${import.meta.env.VITE_API_APP}/api/users/profile/user/${username}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        // Si la respuesta es exitosa (status 200)
        if (response.status === 200) {
            const profile = await response.json()
            return profile.data // Retornamos los datos del perfil
        } else {
            // Si hay error, extraemos el mensaje y lanzamos el error correspondiente
            const body = await response.json()
            throw new errors[body.name](body.message)
        }
    } catch (error) {
        // Si es un error conocido de existencia o autorización, lo propagamos
        if (error instanceof errors.ExistenceError || error instanceof errors.AuthError) {
            throw error
        }
        // Si es otro tipo de error, lo tratamos como error del servidor
        throw new errors.ServerError('Error al conectar con el servidor')
    }
}

/**
 * Actualiza el perfil del usuario autenticado.
 * Esta función permite modificar la información personal del usuario,
 * incluyendo la posibilidad de subir un nuevo avatar.
 * 
 * @async
 * @function updateUserProfile
 * @param {Object} profileData - Los nuevos datos del perfil
 * @param {string} [profileData.fullName] - Nombre completo del usuario
 * @param {string} [profileData.bio] - Biografía del usuario
 * @param {Array} [profileData.favoriteGenres] - Géneros favoritos del usuario
 * @param {Array} [profileData.favoritePlatforms] - Plataformas favoritas del usuario
 * @param {File|string} [profileData.avatar] - Archivo de imagen o URL del avatar
 * @param {string} token - Token JWT del usuario autenticado
 * @returns {Promise<Object>} Una promesa que resuelve con el perfil actualizado
 * @throws {ValidationError} Cuando los datos no son válidos
 * @throws {DuplicityError} Cuando hay conflictos con datos existentes
 * @throws {ServerError} Cuando hay problemas de conexión con el servidor
 * 
 * @example
 * // Actualizar perfil de usuario
 * try {
 *   const perfilActualizado = await updateUserProfile({
 *     fullName: 'Juan Pérez',
 *     bio: 'Amante de los videojuegos',
 *     favoriteGenres: ['RPG', 'Action'],
 *     favoritePlatforms: ['PC', 'PlayStation']
 *   }, 'jwt_token')
 *   console.log('Perfil actualizado:', perfilActualizado)
 * } catch (error) {
 *   console.error('Error al actualizar perfil:', error.message)
 * }
 */
const updateUserProfile = async (profileData, token) => {
    try {
        // Creamos una copia de los datos para no modificar el objeto original
        const dataToSend = { ...profileData };
        
        // Si hay un archivo de avatar, lo convertimos a base64 para el envío
        if (dataToSend.avatar instanceof File) {
            const base64Avatar = await convertFileToBase64(dataToSend.avatar);
            dataToSend.avatar = base64Avatar;
        }
        
        // Realizamos petición PUT al endpoint de actualización de perfil
        const response = await fetch(`${import.meta.env.VITE_API_APP}/api/users/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Token para autenticación
            },
            body: JSON.stringify(dataToSend)
        })

        // Si la actualización es exitosa (status 200)
        if (response.status === 200) {
            const updatedProfile = await response.json()
            return updatedProfile // Retornamos el perfil actualizado
        } else {
            // Si hay error, extraemos el mensaje y lanzamos el error correspondiente
            const body = await response.json()
            throw new errors[body.name](body.message)
        }
    } catch (error) {
        // Si es un error conocido de validación o duplicidad, lo propagamos
        if (error instanceof errors.ValidationError || error instanceof errors.DuplicityError) {
            throw error
        }
        // Si es otro tipo de error, lo tratamos como error del servidor
        throw new errors.ServerError('Error al conectar con el servidor')
    }
}

/**
 * Función auxiliar para convertir un archivo a formato base64.
 * Esta función es utilizada internamente para procesar archivos de avatar
 * antes de enviarlos al servidor.
 * 
 * @async
 * @function convertFileToBase64
 * @param {File} file - El archivo a convertir
 * @returns {Promise<string>} Una promesa que resuelve con la representación base64 del archivo
 * @throws {Error} Cuando hay un error en la conversión del archivo
 * 
 * @example
 * // Convertir archivo a base64
 * const base64 = await convertFileToBase64(archivoImagen)
 * console.log('Archivo en base64:', base64)
 */
const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file); // Leemos el archivo como URL de datos
        reader.onload = () => resolve(reader.result); // Resolvemos con el resultado
        reader.onerror = (error) => reject(error); // Rechazamos si hay error
    });
};

/**
 * Obtiene el perfil del usuario autenticado actualmente.
 * Esta función permite al usuario obtener su propia información
 * de perfil, incluyendo datos privados no visibles en el perfil público.
 * 
 * @async
 * @function getOwnProfile
 * @param {string} token - Token JWT del usuario autenticado
 * @returns {Promise<Object>} Una promesa que resuelve con los datos del perfil propio
 * @throws {ExistenceError} Cuando el usuario no existe
 * @throws {AuthError} Cuando el token no es válido
 * @throws {ServerError} Cuando hay problemas de conexión con el servidor
 * 
 * @example
 * // Obtener mi propio perfil
 * try {
 *   const miPerfil = await getOwnProfile('jwt_token')
 *   console.log('Mi perfil:', miPerfil)
 * } catch (error) {
 *   console.error('Error al obtener mi perfil:', error.message)
 * }
 */
const getOwnProfile = async (token) => {
    try {
        // Realizamos petición GET autenticada al endpoint de perfil propio
        const response = await fetch(`${import.meta.env.VITE_API_APP}/api/users/profile/own`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Token para autenticación
            }
        })

        // Si la respuesta es exitosa (status 200)
        if (response.status === 200) {
            const profile = await response.json()
            return profile.data // Retornamos los datos del perfil
        } else {
            // Si hay error, extraemos el mensaje y lanzamos el error correspondiente
            const body = await response.json()
            throw new errors[body.name](body.message)
        }
    } catch (error) {
        // Si es un error conocido de existencia o autorización, lo propagamos
        if (error instanceof errors.ExistenceError || error instanceof errors.AuthError) {
            throw error
        }
        // Si es otro tipo de error, lo tratamos como error del servidor
        throw new errors.ServerError('Error al conectar con el servidor')
    }
}

// Exportamos todas las funciones de perfil
export { getUserProfile, updateUserProfile, getOwnProfile }