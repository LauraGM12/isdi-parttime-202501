import { useEffect, useState } from "react"
import logics from "../logic"
import UserAvatar from "./UserAvatar"
import useCustomContext from "../hooks/useCustomContext"

const UserCard = ({ userId, refreshSelf, tempAvatar, isMyProfile }) => {
    const [user, setUser] = useState()
    const [updateFollow, setUpdateFollow] = useState(Date.now())
    const [error, setError] = useState(null)

    const { alert } = useCustomContext()

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                // Si isMyProfile es true o no hay userId, obtener el perfil propio
                const retrivedUser = await logics.users.getUserMainInfo(isMyProfile ? null : userId)
                setUser(retrivedUser)
                setError(null)
            } catch (error) {
                setError(error.message || "Error al cargar información del usuario")
                alert(error.message || "Error al cargar información del usuario")
            }
        }
        
        fetchUserInfo()
    }, [refreshSelf, updateFollow, userId, alert, isMyProfile])

    const onFollowClick = async () => {
        try {
            await logics.users.toggleFollow(userId)
            setUpdateFollow(Date.now())
        } catch (error) {
            alert(error.message || "Error al actualizar seguimiento")
        }
    }

    if (error) {
        return <div className="user-card">
            <p className="text-red-500">Error: {error}</p>
        </div>
    }

    return <div className="user-card">
        {
            user && <div className="flex flex-row w-full justify-between">
                <div className="user-card__username-avatar">
                    <UserAvatar avatar={tempAvatar ? tempAvatar : user.avatar} letter={user.username[0]} size={'lg'} />
                    <h2>{user.username}</h2>

                </div>
                {!isMyProfile && <button className={`max-h-9 ${user.isFollowing ? '!bg-red-500 hover:!bg-red-700' : '!bg-green-500 hover:!bg-green-700'} !text-white !font-bold !py-1 !px-4 !rounded cursor-pointer`} onClick={onFollowClick}>
                    {user.isFollowing ? 'Unfollow' : 'Follow'}
                </button>}
            </div>
        }
        {(user && user.bio) && <p className="user-card__bio"><i className="bi bi-person-circle"></i>{user.bio}</p>}
    </div>
}

export default UserCard