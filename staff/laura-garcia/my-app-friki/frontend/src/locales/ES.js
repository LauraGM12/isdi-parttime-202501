const es = {
    forms: {
        emailLabel: 'Correo',
        emailPlaceholder: 'mi@correo.com',
        passwordLabel: 'Contraseña',
        remember: 'Recordarme',
        errorMsg: 'Algo salió mal, revisa tus credenciales'
    },
    landing: {
        title: 'Bienvenido a nuestra aplicación',
        subtitle: 'Gestiona tus formularios de manera eficiente y segura',
        register: 'Registrarse',
        login: 'Iniciar Sesión'
    },
    login: {
        title: 'Iniciar Sesión',
        submit: 'Iniciar Sesión',
        new: '¿Eres nuevo aquí?',
        toRegister: '¡Regístrate ahora!'
    },
    register: {
        title: 'Registro',
        submit: 'Registrarse',
        haveAccount: '¿Ya tienes una cuenta?',
        toLogin: '¡Inicia sesión!',
        errorMsg: 'Revisa los datos del formulario, algo salió mal'
    },
    notFound: {
        title: '¡Ups! Página no encontrada',
        text: 'La página que buscas no existe o ha sido movida',
        button: 'Volver al inicio'
    },
    userProfile: {
        myProfile: {
            changeUsername: 'Cambiar nombre de usuario',
            changeAvatar: 'Cambiar avatar',
            changeBio: 'Cambiar biografía',
            saveNewName: 'Guardar nuevo nombre',
            saveNewAvatar: 'Guardar nuevo avatar',
            saveNewBio: 'Guardar nueva biografía',
            noIdeas: '¿Sin ideas?',
            generateBio: 'Genera una biografía aleatoria:',
            generate: '¡Generar!',
            error: '¡Ups! ¡Inténtalo de nuevo!',
            errorBio: 'Ups, algo salió mal',
            usernameLabel: 'Nombre de usuario',
            usernamePlaceholder: 'Nuevo nombre',
            avatarLocalLabel: 'Cargar archivo local',
            avatarUrlLabel: 'Usar imagen desde URL pública',
            avatarUrlPlaceholder: 'https/nueva.com/avatar.png',
            bioLabel: 'Biografía',
            bioPlaceholder: '¡Cuéntanos sobre ti!'
        },
        error: '¡Ups! Algo no está funcionando correctamente'
    },
    settings: {
        updateEmail: 'Actualizar correo electrónico',
        updatePassword: 'Actualizar contraseña',
        deleteAccount: 'Eliminar cuenta',
        saveNewEmail: 'Guardar nuevo correo',
        saveNewPassword: 'Guardar nueva contraseña',
        deleteMyAccount: 'Eliminar mi cuenta',
        emailSuccess: 'Correo actualizado con éxito',
        passwordSuccess: 'Contraseña actualizada con éxito',
        error: '¡Ups! Algo salió mal, intenta de nuevo',
        confirmDelete: "Si eliminas tu cuenta, se borrarán todas tus publicaciones y 'me gusta'. ¿Deseas continuar?",
        emailLabel: 'Correo electrónico',
        emailPlaceholder: 'mi_nuevo@correo.com',
        oldPasswordLabel: 'Ingresa tu contraseña actual',
        newPasswordLabel: 'Nueva contraseña',
        confirmPasswordLabel: 'Confirma tu nueva contraseña',
        deletePasswordLabel: 'Ingresa tu contraseña para eliminar tu cuenta'
    },
    posts: {
        title: 'Publicaciones de la comunidad',
        description: 'Descubre lo que otros usuarios están compartiendo',
        searchPlaceholder: 'Buscar publicaciones...',
        myPosts: {
            createPost: 'Crear nuevo post',
            editPost: 'Editar post',
            myPosts: 'Mis publicaciones',
            publish: 'Publicar',
            saveChanges: 'Guardar cambios',
            cancelEdit: 'Cancelar edición',
            titleLabel: 'Título del post',
            titlePlaceholder: 'Escribe un título...',
            descriptionLabel: 'Descripción',
            descriptionPlaceholder: 'Escribe una descripción...',
            imageLabel: 'Cargar imagen',
            imageUrlLabel: 'O usa una URL de imagen',
            imageUrlPlaceholder: '.png, .jpg, etc',
            error: '¡Ups! Algo salió mal',
            errorLoading: '¡Ups! Algo salió mal al cargar los posts',
            errorPublishing: '¡Ups! Algo salió mal al publicar'
        },
        createPostModal: {
            title: '¿Qué quieres compartir?',
            publish: 'Publicar',
            close: 'X',
            error: '¡Ups! Algo salió mal',
            form: {
                titleLabel: 'Título de tu publicación',
                titlePlaceholder: 'Soy un título :D',
                descriptionLabel: 'Tu descripción',
                descriptionPlaceholder: 'Bla bla bla bla',
                imageLabel: 'Cargar una imagen',
                imageUrlLabel: 'O usa una URL de imagen pública',
                imageUrlPlaceholder: '.png, .jpg, etc'
            }
        }
    },
    home: {
        welcome: 'Bienvenido a FrikiPosts',
        description: 'Tu espacio para compartir momentos especiales y conectar con otros usuarios',
        discover: 'Descubre todo lo que puedes hacer',
        posts: {
            title: 'Comparte tus Posts',
            description: 'Crea y comparte tus momentos favoritos',
            link: 'Ver mis posts'
        },
        community: {
            title: 'Explora la Comunidad',
            description: 'Descubre publicaciones de otros usuarios',
            link: 'Ver todos los posts'
        },
        profile: {
            title: 'Tu Perfil',
            description: 'Personaliza tu perfil y gestiona tu contenido',
            link: 'Ir a mi perfil'
        }
    },
    userCard: {
        noBio: 'Este usuario aún no tiene biografía'
    },
    userAvatar: {
        defaultIcon: '📎',
        imageAlt: 'Avatar del usuario'
    },
    voteButtons: {
        error: 'Error al dar like'
    },
    postList: {
        loading: 'Cargando posts...',
        noPosts: 'No hay publicaciones para mostrar.'
    },
    postItem: {
        loading: 'Cargando...',
        unknownUser: 'Usuario desconocido',
        edited: '(editado)',
        imageAlt: 'Imagen del post',
        comments: 'Comentarios',
        noComments: 'No hay comentarios aún.',
        writeComment: 'Escribe un comentario...',
        comment: 'Comentar',
        loginToComment: 'Debes iniciar sesión para comentar',
        loginMessage: 'Debes',
        loginLink: 'iniciar sesión',
        toComment: 'para comentar',
        confirmDelete: '¿Estás seguro de que deseas eliminar esta publicación? Esta acción no se puede deshacer.',
        deleteSuccess: 'Publicación eliminada correctamente',
        deleteError: 'No se pudo eliminar la publicación. Por favor, inténtalo de nuevo.',
        deleteCommentConfirm: '¿Estás seguro de que deseas eliminar este comentario? Esta acción no se puede deshacer.',
        deleteCommentError: 'Error al eliminar el comentario',
        updateCommentError: 'Error al actualizar el comentario'
    },
    post: {
        defaultAlt: 'Avatar por defecto',
        deleteError: '¡Ups! Algo salió mal al eliminar el post',
        likeError: 'Error al dar like',
        dislikeError: 'Error al dar dislike',
        favoriteError: 'Error al marcar como favorito'
    },
    header: {
        welcome: 'Bienvenido',
        account: 'Mi Cuenta',
        settings: 'Ajustes',
        myPosts: 'Mis Posts',
        viewPosts: 'Ver Posts',
        logout: 'Cerrar Sesión'
    },
    comment: {
        edited: '(editado)',
        save: 'Guardar',
        cancel: 'Cancelar',
        defaultAvatar: 'Avatar por defecto'
    },
    logo: {
        brandName: 'FrikiPixel',
        altText: 'Logo de FrikiPixel'
    },
    form: {
        error: 'Datos incorrectos, por favor revisa la información del formulario',
        submit: 'Enviar'
    },
    myPosts: {
        titleLabel: 'Título del post',
        titlePlaceholder: 'Escribe un título...',
        descriptionLabel: 'Descripción',
        descriptionPlaceholder: 'Escribe una descripción...',
        imageLabel: 'Subir imagen',
        imageUrlLabel: 'O usa una URL de imagen',
        imageUrlPlaceholder: '.png, .jpg, etc',
        errorLoading: 'Error al cargar las publicaciones',
        errorPublishing: 'Error al publicar',
        editPost: 'Editar publicación',
        createPost: 'Crear nueva publicación',
        saveChanges: 'Guardar cambios',
        publish: 'Publicar',
        cancelEdit: 'Cancelar edición',
        myPosts: 'Mis publicaciones'
    },
    alert: {
        close: 'Cerrar',
        defaultError: 'Ha ocurrido un error',
        defaultSuccess: 'Operación completada con éxito',
        defaultWarning: 'Atención',
        defaultInfo: 'Información'
    }
}    

export default es