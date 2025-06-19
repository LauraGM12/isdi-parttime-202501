import React from 'react'
import { Navigate } from 'react-router-dom'
import getToken from '../helpers/getToken'

/**
 * Componente de ruta protegida que requiere autenticación
 * Redirige al login si no hay token válido
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Componentes hijos a renderizar si está autenticado
 * @returns {JSX.Element} Componente hijo o redirección al login
 */
const PrivateRoute = ({ children }) => {
  // Obtener el token de autenticación del almacenamiento local
  const token = getToken()
  
  // Si no hay token válido, redirigir al login
  if (!token) {
    return <Navigate to="/login" replace />
  }
  
  // Si hay token válido, renderizar el componente hijo
  return children
}

export default PrivateRoute