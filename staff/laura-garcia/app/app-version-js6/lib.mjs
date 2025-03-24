
const createTextContainer = (tag, text, style) => {
    const element = document.createElement(tag);
    element.textContent = text;
    element.className = style;
    return element
}

const createButton = (text, style, callback) => {
    const button = document.createElement('button');
    button.className = style;
    button.textContent = text;
    button.addEventListener('click', callback) 
    return button
}

const createContainer = (style) => {
    const container = document.createElement('div');
    container.className = style;
    return container
}

const createForm = (inputsArray, submitButtonText, callback) => { 
    const formContainer = document.createElement('form');
    formContainer.className = 'form'
    for (let i = 0; i < inputsArray.length; i++) {
        const input = inputsArray[i] 
        const label = document.createElement('label')
        label.htmlFor = input.inputId 
        label.textContent = input.label
        const inputElement = document.createElement('input')
        inputElement.type = input.inputType;
        inputElement.id = input.inputId;
        inputElement.required = input.isRequired;
        
        if (input.inputId === 'password') {
            inputElement.pattern = "(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[$&!@=*^ñ?¿¡/#ªº¬])[A-Za-z\\d$&!@=*^ñ?¿¡/#ªº¬]{8,}";
            inputElement.title = "La contraseña debe contener al menos una mayúscula, una minúscula, un número, un carácter especial y mínimo 8 caracteres";
        }

        if (input.inputType === 'checkbox') {
            const fieldset = document.createElement('fieldset');
            inputElement.className = 'form__input-checkbox'
            inputElement.value = input.inputValue;
            inputElement.required = input.isRequired;
            fieldset.append(inputElement, label)
            formContainer.appendChild(fieldset)
        } else {
            inputElement.placeholder = input.inputPlaceholder
            inputElement.className = 'form__input-text'
            formContainer.append(label, inputElement)
        }
    }

    const submitButton = document.createElement('input');
    submitButton.type = 'submit';
    submitButton.className = 'form__submit-button'
    submitButton.value = submitButtonText

    formContainer.appendChild(submitButton)

    formContainer.addEventListener('submit', event => {
        event.preventDefault()

        const form = event.target; 
        const formData = {};

        for (let i = 0; i < inputsArray.length; i++) {

            const fieldName = inputsArray[i].inputId;
            let value;
            if (inputsArray[i].inputType === 'checkbox') {
                value = form[inputsArray[i].inputId].checked
            } else {
                value = form[inputsArray[i].inputId].value
            }


            formData[fieldName] = value;
        }

        try {
            callback(formData)
            formContainer.reset()
        } catch (error) {
            if (error.name === 'FormatError') {
                alert(`Error de formato: ${error.message}\n\nLa contraseña debe contener:\n- Una mayúscula\n- Una minúscula\n- Un número\n- Un carácter especial ($&!@=*^ñ?¿¡/#ªº¬)\n- Mínimo 8 caracteres`);
            } else if (error.name === 'RangeError' || error.name === 'TypeError') {
                alert('Credenciales incorrectas, compruebe de nuevo los datos del formulario');
            }
        }


    })

    return formContainer;

}


const createLogo = (size) => {
    const logo = createContainer('logo');
    const imgElement = document.createElement('img');
    
    logo.style.width = size;
    logo.style.height = size;
    
    logo.appendChild(imgElement);
    return logo;
}


export {
    createTextContainer,
    createButton,
    createContainer,
    createForm,
    createLogo
}