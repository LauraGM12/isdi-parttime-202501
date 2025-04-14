import { useEffect, useState } from "react"
import logics from "../logic"
import getLoggedUserId from "../logic/helpers/getLoggedUserId"
import UserAvatar from "./UserAvatar"
import './UserCard.css'

const UserCard = ({ userId, refreshSelf, tempAvatar }) => {
    const [user, setUser] = useState()

    useEffect(() => {
        const retrivedUsername = logics.users.getUserUsernameById(userId)
        const retrivedBio = logics.users.getUserBioById(userId)
        const retrivedAvatar = logics.users.getUserAvatarById(userId)

        setUser({ username: retrivedUsername, bio: retrivedBio, avatar: retrivedAvatar })
    }, [refreshSelf])


    return <div className="user-card">
        {
            user && <div className="user-card__username-avatar">
                <UserAvatar avatar={tempAvatar ? tempAvatar : user.avatar} letter={user.username[0]} size={'lg'} />
                <h2>{user.username}</h2>

            </div>
        }
        {(user && user.bio) && <p className="user-card__bio">{user.bio}</p>}
    </div>
}

export default UserCard