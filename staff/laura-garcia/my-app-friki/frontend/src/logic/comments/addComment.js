import data from "../../data";
import { errors } from "common"
import getToken from "../helpers/getToken";

const addComment = (postId, text) => {
    try {
        // Intentar obtener los posts del localStorage
        let posts = JSON.parse(localStorage.getItem('posts') || '[]');
        
        // Verificar si el post existe
        let postIndex = posts.findIndex(post => post.id === postId);
        
        // Si no encontramos el post, intentamos buscarlo por ID como string
        if (postIndex === -1) {
            postIndex = posts.findIndex(post => String(post.id) === String(postId));
        }
        
        // Si aún no encontramos el post, creamos uno nuevo
        if (postIndex === -1) {
            console.log('Post no encontrado, creando uno nuevo para el comentario');
            const newPost = {
                id: postId,
                title: 'Post',
                description: 'Contenido del post',
                comments: [],
                author: {
                    id: 'system',
                    username: 'Sistema',
                    avatar: ''
                },
                date: new Date().toISOString()
            };
            posts.push(newPost);
            postIndex = posts.length - 1;
        }
        
        // Asegurarnos de que el post tiene un array de comentarios
        if (!posts[postIndex].comments) {
            posts[postIndex].comments = [];
        }
        
        // Crear el nuevo comentario
        const newComment = {
            id: Date.now().toString(),
            text,
            author: {
                id: localStorage.getItem('userId') || getToken(),
                username: localStorage.getItem('username') || 'Usuario',
                avatar: localStorage.getItem('avatar') || ''
            },
            date: new Date().toISOString(),
            edited: false
        };
        
        // Añadir el comentario y guardar
        posts[postIndex].comments.push(newComment);
        localStorage.setItem('posts', JSON.stringify(posts));
        
        return Promise.resolve(newComment);
    } catch (error) {
        console.error('Error al añadir comentario localmente:', error);
        return Promise.reject(error);
    }
}

export default addComment