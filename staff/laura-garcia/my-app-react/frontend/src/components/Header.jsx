import { useState, useEffect } from "react"
import Btn from "./lib/Btn"
import Logo from "./lib/Logo"
import logics from "../logic"
import './Header.css'
import getLoggedUserId from "../logic/helpers/getLoggedUserId"
import UserAvatar from "./UserAvatar"
import { useNavigate } from "react-router"

const Header = ({ refreshHeader, logout, isUserLogged }) => {
    const [username, setUsername] = useState('')
    const [isUserMenuOpen, setUserMenuOpen] = useState(false)
    const [avatar, setAvatar] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        if (isUserLogged) {
            const retrivedUsername = logics.users.getUserUsernameById(getLoggedUserId())
            setUsername(retrivedUsername)
            const retrivedAvatar = logics.users.getUserAvatarById(getLoggedUserId())
            setAvatar(retrivedAvatar)
        }
    }, [refreshHeader, isUserLogged])

    const handleLogoClick = () => navigate("/")
    const onMenuRouteClick = (path) => {
        if (path) navigate(path)
        setUserMenuOpen(false)
    }
    const onLogoutClick = () => {
        setUserMenuOpen(false)
        logout()
    }

    return (
        <header className="header">
            <div className="header__content">
                <div className="header__left">
                    <Logo onClick={handleLogoClick} size="sm" />
                </div>

                <div className="header__center">
                    {username && <p>Bienvenido, {username}</p>}
                </div>

                <div className="header__right">
                    <UserAvatar
                        size="sm"
                        avatar={avatar}
                        letter={username[0]}
                        buttonCallback={() => setUserMenuOpen(!isUserMenuOpen)}
                    />
                </div>
            </div>

            {isUserMenuOpen && (
                <aside className="header__user-menu">
                    <Btn btnContent="Mi Cuenta" btnClassnames="header__user-menu--button" btnCallback={() => onMenuRouteClick('/my-profile')} />
                    <Btn btnContent="Ajustes" btnClassnames="header__user-menu--button" btnCallback={() => onMenuRouteClick('/settings')} />
                    <Btn btnContent="Mis Posts" btnClassnames="header__user-menu--button" btnCallback={() => onMenuRouteClick('/my-posts')} />
                    <Btn btnContent="Ver Posts" btnClassnames="header__user-menu--button" btnCallback={() => onMenuRouteClick('/posts')} />
                    <Btn btnContent="Cerrar Sesión" btnClassnames="header__user-menu--button" btnCallback={onLogoutClick} />
                </aside>
            )}
        </header>
    )
}

export default Header