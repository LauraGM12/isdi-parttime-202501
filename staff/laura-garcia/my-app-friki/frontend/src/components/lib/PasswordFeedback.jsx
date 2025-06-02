import { useState } from "react"
import Btn from "./Btn"
import "./PasswordFeedback.css"
import locales from '../../locales'

const PasswordFeedback = ({ securityPasswordErrors, arePasswordsEqual, locale }) => {
    const [showCompleteFeedback, setShowCompleteFeedback] = useState(false)
    const [translations] = useState(locales[locale]['passwordFeedback'])
    
    return <div className="password-feedback">
        {(arePasswordsEqual !== null && arePasswordsEqual === false) &&
            <div className="password-feedback__match">
                {translations.noMatch}
            </div>
        }
        <div className="password-feedback__color">
            <div className={securityPasswordErrors?.length > 2 ? 'color red' :
                securityPasswordErrors?.length > 0 ? 'color yellow' :
                    'color green'
            }></div>
        </div>
        {securityPasswordErrors?.length > 0 && 
            <div className="password-feedback__info">
                <Btn 
                    btnCallback={() => setShowCompleteFeedback(!showCompleteFeedback)} 
                    btnClassnames={'password-feedback__btn'} 
                    btnContent={<i className={`bi bi-info-circle${showCompleteFeedback ? '-fill' : ''}`}></i>} 
                />
                {showCompleteFeedback && 
                    <div className="password-feedback__text">
                        <p>{translations.goodPassword}</p>
                        <ul className="password-feedback__text-list">
                            {securityPasswordErrors.map((errorMessage, index) => (
                                <li className="password-feedback__text-item" key={index}>{errorMessage}</li>
                            ))}
                        </ul>
                    </div>
                }
            </div>
        }
    </div>
}

export default PasswordFeedback