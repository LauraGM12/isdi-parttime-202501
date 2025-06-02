import { useState } from "react"
import Btn from "./Btn"

const PasswordInput = ({ inputElement, onChangeCallback }) => {
    const [showPassword, setShowPassword] = useState(false)

    const onShowClick = () => {

        setShowPassword(!showPassword)
    }

    const onChange = (event, inputId) => {
        if (onChangeCallback) {
            onChangeCallback(event, inputElement.inputId)
        }
    }

    return <div className="form__input--password">
        <input onChange={(event) => onChange(event, inputElement.inputId)}
            className="form__input-text" required={inputElement.isRequired} placeholder={inputElement.inputPlaceholder}
            id={inputElement.inputId}
            type={showPassword ? 'text' : 'password'}
        />
        <Btn
            btnCallback={() => onShowClick()}
            btnContent={showPassword ? <i className="bi bi-eye-slash-fill" /> : <i className="bi bi-eye-fill" />}
            btnClassnames={'form__password-button'}
        />
    </div>
}

export default PasswordInput