import Btn from "./lib/Btn"
import './UserAvatar.css'

const UserAvatar = ({ buttonCallback, size, avatar, letter }) => {
    return <div>
        {(avatar && buttonCallback) && <Btn
            btnContent={<img className='avatar--image' src={avatar} />}
            btnCallback={buttonCallback}
            btnClassnames={`avatar-btn ${size} avatar-with-image`}
        />}
        {(avatar && !buttonCallback) && <div className={`${size} avatar-with-image`}>
            <img className='avatar--image' src={avatar} />
        </div>
        }
        {(!avatar && letter && buttonCallback) && <Btn
            btnContent={<div>{letter.toUpperCase()}</div>}
            btnCallback={buttonCallback}
            btnClassnames={`avatar-btn ${size} avatar`}
        />
        }
        {(!avatar && letter && !buttonCallback) && <div className={`${size} avatar`}>
            <div className="">{letter.toUpperCase()}</div>
        </div>
        }
        {(!avatar && !letter) && <p>📎</p>}
    </div>
}


export default UserAvatar