var data
/** EL ARCHIVO LIB CONTIENE LAS FUNCIONES QUE PERMITEN CREAR ELEMENTOS PARA EL DOM **/

/* Función para añadir múltiples hijos a un elemento padre */
function appendChildren() {
    var parent = arguments[0]; // El primer argumento es el elemento padre
    for (var i = 1; i < arguments.length; i++) {
        parent.appendChild(arguments[i]); // Añadimos cada elemento hijo al padre
    }
    return parent; // Retornamos el elemento padre con los hijos añadidos
}

/* Función para crear un elemento HTML con texto */
function createTextContainer(tag, text, style) {
    var element = document.createElement(tag); // Creamos el elemento con la etiqueta especificada
    element.textContent = text; // Le asignamos el texto
    element.className = style; // Le aplicamos la clase CSS
    return element; // Retornamos el elemento creado
}

/* Función para crear un botón con un callback para el evento click */
function createButton(text, style, callback) {
    var button = document.createElement('button'); // Creamos el botón
    button.className = style; // Le aplicamos la clase CSS
    button.textContent = text; // Le asignamos el texto
    button.addEventListener('click', callback); // Añadimos el evento click con la función callback
    return button; // Retornamos el botón creado
}

/* Función para crear un contenedor (div con estilos) */
function createContainer(style) {
    var container = document.createElement('div'); // Creamos el div
    container.className = style; // Le aplicamos la clase CSS
    return container; // Retornamos el contenedor creado
}

/* Función para crear un formulario dinámico */
function createForm(inputsArray, submitButtonText, callback) { 
    // inputsArray = [{label: 'Email', inputType: 'email', inputPlaceholder: 'my@email.com', inputId: 'email'}, ...]

    var formContainer = document.createElement('form'); // Creamos el formulario
    formContainer.className = 'form'; // Le aplicamos la clase CSS

    // Iteramos sobre el array de inputs para crearlos dinámicamente
    for (var i = 0; i < inputsArray.length; i++) {
        var input = inputsArray[i]; // Extraemos la información del input actual
        var label = document.createElement('label'); // Creamos la etiqueta del input
        label.htmlFor = input.inputId; // Asignamos el atributo "for" al ID del input
        label.textContent = input.label; // Asignamos el texto de la etiqueta

        var inputElement = document.createElement('input'); // Creamos el input
        inputElement.type = input.inputType; // Asignamos el tipo de input
        inputElement.id = input.inputId; // Asignamos el ID
        inputElement.required = input.isRequired; // Definimos si es obligatorio

        if (input.inputType === 'checkbox') {
            var fieldset = document.createElement('fieldset'); // Creamos un fieldset para agrupar checkbox
            inputElement.value = input.inputValue; // Asignamos un valor
            appendChildren(fieldset, inputElement, label); // Añadimos el input y la etiqueta al fieldset
            formContainer.appendChild(fieldset); // Agregamos el fieldset al formulario
        } else {
            inputElement.placeholder = input.inputPlaceholder; // Asignamos un placeholder
            appendChildren(formContainer, label, inputElement); // Añadimos la etiqueta y el input al formulario
        }
    }

    // Creamos el botón de enviar
    var submitButton = document.createElement('input');
    submitButton.type = 'submit'; // Definimos el tipo como "submit"
    submitButton.value = submitButtonText; // Asignamos el texto del botón

    formContainer.appendChild(submitButton); // Agregamos el botón al formulario

    // Evento para capturar el envío del formulario
    formContainer.addEventListener('submit', function (event) {
        event.preventDefault(); // Evitamos que el formulario recargue la página

        var form = event.target; // Obtenemos el formulario enviado
        var formData = {}; // Creamos un objeto para almacenar los datos

        // Iteramos sobre los inputs para capturar los valores ingresados por el usuario
        for (var i = 0; i < inputsArray.length; i++) {
            var fieldName = inputsArray[i].inputId; // Obtenemos el ID del input
            var value;

            // Si es un checkbox, almacenamos "true" o "false", de lo contrario, el valor ingresado
            if (inputsArray[i].inputType === 'checkbox') {
                value = form[inputsArray[i].inputId].checked;
            } else {
                value = form[inputsArray[i].inputId].value;
            }

            formData[fieldName] = value; // Guardamos el valor en el objeto formData
        }

        callback(formData); // Llamamos a la función callback con los datos del formulario
    });

    return formContainer; // Retornamos el formulario creado
}

/* Función para crear un logo */
function createLogo(size) {
    var logo = document.createElement('img'); // Creamos el elemento imagen
    logo.src = './img/logo-smarthive.png'; // Asignamos la ruta de la imagen
    logo.alt = 'SmartHive Logo'; // Definimos el texto alternativo
    logo.className = 'logo'; // Le aplicamos la clase CSS
    return logo; // Retornamos el logo
}

/* Función para crear un encabezado */
function createHeader() {
    var header = document.createElement('header'); // Creamos el encabezado
    header.className = 'header'; // Le aplicamos la clase CSS

    // Añadimos los elementos pasados como argumentos al header
    for (var i = 0; i < arguments.length; i++) {
        header.appendChild(arguments[i]);
    }

    return header; // Retornamos el encabezado creado
}
