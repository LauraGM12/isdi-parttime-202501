import { useState, useEffect } from 'react'
import Btn from "./lib/Btn"
import locales from '../locales'
import './UserAvatar.css'

const UserAvatar = ({ buttonCallback, size, avatar, letter, locale = 'es' }) => {
    const [translations, setTranslations] = useState(locales[locale]?.['userAvatar'] || {
        defaultIcon: '📎',
        imageAlt: 'Avatar del usuario'
    })

    useEffect(() => {
        setTranslations(locales[locale]?.['userAvatar'] || {
            defaultIcon: '📎',
            imageAlt: 'Avatar del usuario'
        })
    }, [locale])

    return <div>
        {(avatar && buttonCallback) && <Btn
            btnContent={<img className='avatar--image' src={avatar} alt={translations.imageAlt} />}
            btnCallback={buttonCallback}
            btnClassnames={`avatar-btn ${size} avatar-with-image`}
        />}
        {(avatar && !buttonCallback) && <div className={`${size} avatar-with-image`}>
            <img className='avatar--image' src={avatar} alt={translations.imageAlt} />
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
        {(!avatar && !letter) && <p>{translations.defaultIcon}</p>}
    </div>
}

export default UserAvatar