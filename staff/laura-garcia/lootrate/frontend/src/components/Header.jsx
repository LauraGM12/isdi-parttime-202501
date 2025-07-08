import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import getToken from '../helpers/getToken'

const Header = ({ user }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const dropdownRef = useRef(null)
    const navigate = useNavigate()
    const location = useLocation()
    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])
    
    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }

    const isActiveRoute = (path) => {
        return location.pathname === path
    }
    
    return (
        <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <Link to="/home" className="text-2xl font-bold text-white hover:text-blue-400 transition-colors">
                        LootRate
                    </Link>

                    <nav className="hidden md:flex space-x-6">
                        <Link 
                            to="/home" 
                            className={`transition-colors duration-200 ${
                                isActiveRoute('/home') 
                                    ? 'text-blue-400 font-semibold' 
                                    : 'text-white hover:text-blue-400'
                            }`}
                        >
                            Inicio
                        </Link>
                        <Link 
                            to="/library" 
                            className={`transition-colors duration-200 ${
                                isActiveRoute('/library') 
                                    ? 'text-blue-400 font-semibold' 
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            Biblioteca
                        </Link>
                        <Link 
                            to="/explore" 
                            className={`transition-colors duration-200 ${
                                isActiveRoute('/explore') 
                                    ? 'text-blue-400 font-semibold' 
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            Explorar
                        </Link>
                        <Link 
                            to="/reviews" 
                            className={`transition-colors duration-200 ${
                                isActiveRoute('/reviews') 
                                    ? 'text-blue-400 font-semibold' 
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            Reseñas
                        </Link>
                    </nav>

                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center space-x-2 text-white hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 rounded-full"
                        >
                            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center overflow-hidden">
                                {user?.avatar ? (
                                    <img 
                                        src={user.avatar} 
                                        alt={user.username} 
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                ) : (
                                    <span className="text-sm font-semibold">
                                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                                    </span>
                                )}
                            </div>

                            <span className="hidden sm:block text-sm font-medium">
                                {user?.username || (
                                    <div className="animate-pulse bg-gray-600 h-4 w-16 rounded"></div>
                                )}
                            </span>

                            <svg 
                                className={`w-4 h-4 transition-transform duration-200 ${
                                    isDropdownOpen ? 'rotate-180' : ''
                                }`} 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                                <Link
                                    to="/profile"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                    onClick={() => setIsDropdownOpen(false)}
                                >
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <span>Mi Perfil</span>
                                    </div>
                                </Link>

                                <Link
                                    to="/profile/edit"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                    onClick={() => setIsDropdownOpen(false)}
                                >
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        <span>Editar Perfil</span>
                                    </div>
                                </Link>

                                <Link
                                    to="/settings"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                    onClick={() => setIsDropdownOpen(false)}
                                >
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span>Configuración</span>
                                    </div>
                                </Link>
                                
                                <hr className="my-1" />

                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        <span>Cerrar Sesión</span>
                                    </div>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                
                <nav className="md:hidden mt-4 flex space-x-4">
                    <Link 
                        to="/home" 
                        className={`transition-colors duration-200 ${
                            isActiveRoute('/home') 
                                ? 'text-blue-400 font-semibold' 
                                : 'text-white hover:text-blue-400'
                        }`}
                    >
                        Inicio
                    </Link>
                    <Link 
                        to="/library" 
                        className={`transition-colors duration-200 ${
                            isActiveRoute('/library') 
                                ? 'text-blue-400 font-semibold' 
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        Biblioteca
                    </Link>
                    <Link 
                        to="/explore" 
                        className={`transition-colors duration-200 ${
                            isActiveRoute('/explore') 
                                ? 'text-blue-400 font-semibold' 
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        Explorar
                    </Link>
                    <Link 
                        to="/reviews" 
                        className={`transition-colors duration-200 ${
                            isActiveRoute('/reviews') 
                                ? 'text-blue-400 font-semibold' 
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        Reseñas
                    </Link>
                </nav>
            </div>
        </header>
    )
}

export default Header