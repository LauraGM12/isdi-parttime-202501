import { useState } from 'react'
import './Form.css'
import PasswordFeedback from './PasswordFeedback'
import PasswordInput from './PasswordInput'

const Form = ({ inputsArray, onSubmitCallback, submitButtonText, onFileChangeCallback, onPasswordChangeCallback, securityPasswordErrors }) => { //inputsArray = [{label: 'Email', inputType: 'email', inputPlaceholder: 'my@email.com', inputId: 'email'}, {label: 'Password....}]
    const [tempPassword, setTempPassword] = useState()
    const [arePasswordsEqual, setArePasswordsEqual] = useState(null)

    const handleFileInputChange = (event) => {
        event.preventDefault()

        if (onFileChangeCallback) {
            let img;
            if (!event.target.files) return onFileChangeCallback(event.target.value, false)

            img = event.target.files[0];

            const image = new FileReader();
            image.onloadend = () => {
                const base64 = image.result;
                onFileChangeCallback(base64, true);
            };
            image.readAsDataURL(img)
        }
    }

    const handlePasswordInputChange = (event, inputId) => {
        event.preventDefault()

        const password = event.target.value

        if (onPasswordChangeCallback) {
            if (inputId === 'password') {
                setTempPassword(password)
                onPasswordChangeCallback(password)
            }
            if (inputId === 'confirmation-password') {
                setArePasswordsEqual(password === tempPassword)
            }
        }
    }


    const handleSubmit = (event) => {
        event.preventDefault()

        const form = event.target;
        const formData = {}; 

    
        for (let i = 0; i < inputsArray.length; i++) {
            const fieldName = inputsArray[i].inputId;
            let value;
            if (inputsArray[i].inputType === 'checkbox') {
                value = form[inputsArray[i].inputId].checked
            } else if (inputsArray[i].inputType === 'file') {
                value = form[inputsArray[i].inputId].files[0]
            } else {
                value = form[inputsArray[i].inputId].value
            }

            formData[fieldName] = value;
        }

        try {
            onSubmitCallback(formData, () => form.reset())
        } catch (error) {
            console.error(error)
            if (error.name === 'FormatError' || error.name === 'RangeError' || error.name === 'TypeError') {
                alert('incorrect inputs, check your form data again')
            }
        }
    }

    return <form className="form" onSubmit={handleSubmit} >
        {
            inputsArray.map((inputElement, index) => {
                if (inputElement.inputType === 'checkbox') {
                    return <fieldset key={index}>
                        <input className="form__input-checkbox" type={inputElement.inputType} id={inputElement.inputId} required={inputElement.isRequired} value={inputElement.value} />
                        <label htmlFor={inputElement.inputId}>{inputElement.label}</label>
                    </fieldset>
                } else if (inputElement.inputType === 'text-area') {
                    return <div className="form__input" key={index}>
                        <label htmlFor={inputElement.inputId}>{inputElement.label}</label>
                        <textarea className="form__input-text" id={inputElement.inputId} required={inputElement.isRequired} placeholder={inputElement.inputPlaceholder} />
                    </div>
                } else if (inputElement.inputType === 'url' || inputElement.inputType === 'file') {
                    return <div className="form__input" key={index} >
                        <label htmlFor={inputElement.inputId}>{inputElement.label}</label>
                        <input onChange={(event) => handleFileInputChange(event)} className="form__input-text"
                            id={inputElement.inputId} required={inputElement.isRequired} type={inputElement.inputType} placeholder={inputElement.inputPlaceholder} />
                    </div>
                } else if (inputElement.inputType === 'password') {
                    return <div className="form__input" key={index} >
                        <label htmlFor={inputElement.inputId}>{inputElement.label}</label>
                        <PasswordInput inputElement={inputElement}
                            onChangeCallback={(inputElement.inputId === 'password' || inputElement.inputId === 'confirmation-password') ? handlePasswordInputChange : null} />

                    </div>
                } else {
                    return <div className="form__input" key={index} >
                        <label htmlFor={inputElement.inputId}>{inputElement.label}</label>
                        <input className="form__input-text" id={inputElement.inputId} required={inputElement.isRequired} type={inputElement.inputType} placeholder={inputElement.inputPlaceholder} />
                    </div>
                }
            })
        }
        {(securityPasswordErrors) && <PasswordFeedback securityPasswordErrors={securityPasswordErrors} arePasswordsEqual={arePasswordsEqual} />}
        <input className="form__submit-button" type="submit" value={submitButtonText} />
    </form>
}

export default Form