import { errors } from "common"
import { useEffect, useState } from "react"
import logics from "../../logic"
import { useNavigate } from "react-router"

const Alert = ({ error, onClose }) => {
    const [message, setMessage] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        if (error instanceof errors.ConnectionError) {
            setMessage('¡Los servidores están caídos! Inténtalo más tarde')
        } else if (error instanceof errors.ExistenceError || error instanceof errors.DuplicityError) {
            setMessage('Hay un problema con los datos enviados. ¡Revisa la información!')
        } else if (error instanceof TypeError || error instanceof RangeError || 
                   error instanceof errors.FormatError || error instanceof errors.ContentError) {
            setMessage('Revisa el formulario, ¡hay datos incorrectos!')
        } else if (error instanceof errors.AuthError) {
            setMessage('¡No tienes permiso para realizar esta acción!')
        } else if (error instanceof errors.ServerError) {
            setMessage('Hubo un problema en el servidor, por favor inténtalo de nuevo')
        } else if (error instanceof errors.TokenError) {
            logics.users.logoutUser()
            navigate('/login')
            setMessage('Tu sesión ha expirado, inicia sesión nuevamente')
        } else {
            setMessage('Ha ocurrido un error inesperado 🎮')
        }
    }, [error, navigate])

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-96 max-w-md mx-4">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center">
                        <i className="bi bi-exclamation-triangle text-red-500 text-2xl mr-2"></i>
                        <h3 className="text-lg font-semibold text-gray-900">Error</h3>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>
                <div className="px-6 py-4">
                    <p className="text-gray-700 text-center">{message}</p>
                </div>
                <div className="px-6 py-4 bg-gray-50 rounded-b-lg">
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Alert