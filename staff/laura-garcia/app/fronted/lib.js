/**EL ARCHIVO LIB CONTIENE LAS FUNCIONES QUE PERMITEN CREAR ELEMENTOS PARA EL DOM**/

var body = document.body;  // Obtiene el cuerpo del documento HTML (la etiqueta <body>) para manipularla.
var currentView;  // Variable para almacenar la vista actual.

/*Función para añadir multiples hijos a el elemento padre que es el primero que pasamos hecha por nosotros para ver más fors*/
function appendChildren() {
    var parent = arguments[0];  // El primer argumento será el contenedor al que vamos a agregar hijos.
    for (var i = 1; i < arguments.length; i++) {
        parent.appendChild(arguments[i]);   // Agrega todos los elementos posteriores como hijos del contenedor.
    }
    return parent;  // Retorna el contenedor con los hijos añadidos.
}

/*Crear un elemento html que contiene texto*/
function createTextContainer(tag, text, style) {
    var element = document.createElement(tag);  // Crea un nuevo elemento HTML del tipo especificado por 'tag'.
    element.textContent = text;  // Establece el texto del elemento.
    element.className = style;  // Establece el estilo CSS del elemento.
    return element;  // Retorna el nuevo elemento creado.
}

/*Crear un botón y le pasa en el parametro "callback" que es la función que se ejecuta al hacer click*/
function createButton(text, style, callback) {
    var button = document.createElement('button');  // Crea un botón HTML.
    button.className = style;  // Establece el estilo del botón.
    button.textContent = text;  // Establece el texto que aparecerá en el botón.
    button.addEventListener('click', callback);  // Asocia la función 'callback' que se ejecutará al hacer click en el botón.
    return button;  // Retorna el botón creado.
}

/*Crear un contenedor (un div con estilos definidos)*/
function createContainer(style) {
    var container = document.createElement('div');  // Crea un contenedor (div) HTML.
    container.className = style;  // Asigna una clase CSS al contenedor.
    return container;  // Retorna el contenedor.
}

function createForm(inputsArray, submitButtonText, callback) {
    var formContainer = document.createElement('form');  // Crea un formulario.
    formContainer.className = 'form';  // Establece el estilo del formulario.
    
    for (var i = 0; i < inputsArray.length; i++) {
        var input = inputsArray[i];  // Accede a cada objeto que contiene información del input.
        var label = document.createElement('label');  // Crea una etiqueta para el input.
        label.htmlFor = input.inputId;  // Asocia la etiqueta con el id del input.
        label.textContent = input.label;  // Establece el texto de la etiqueta.

        var inputElement = document.createElement('input');  // Crea el input.
        inputElement.type = input.inputType;  // Define el tipo de input (ej., 'email', 'password').
        inputElement.id = input.inputId;  // Asigna un id único al input.
        inputElement.placeholder = input.inputPlaceholder;  // Define un texto de sugerencia en el input.
        inputElement.required = input.isRequired;  // Define si el campo es obligatorio.

        appendChildren(formContainer, label, inputElement);  // Añade la etiqueta y el input al formulario.
    }

// Cambiar a un botón <button> en lugar de un <input>
var submitButton = document.createElement('button');  // Crea un botón HTML.
submitButton.textContent = submitButtonText;  // Establece el texto que aparecerá en el botón.
submitButton.className = 'create-account';  // Asigna la clase para estilizarlo (como lo has hecho en CSS).

formContainer.appendChild(submitButton);  // Añade el botón al formulario.

formContainer.addEventListener('submit', function (event) {
    event.preventDefault();  // Evita que el formulario se envíe de forma tradicional.

    var form = event.target;  // Obtiene el formulario desde el evento.
    var formData = {};  // Crea un objeto vacío para almacenar los datos del formulario.

    for (var i = 0; i < inputsArray.length; i++) {
        var fieldName = inputsArray[i].inputId;  // Obtiene el id del campo.
        var value = form[inputsArray[i].inputId].value;  // Obtiene el valor ingresado por el usuario en el campo.

        formData[fieldName] = value;  // Almacena el valor del campo en el objeto formData.
    }

    callback(formData);  // Llama a la función callback con los datos del formulario.
});

return formContainer;  // Retorna el formulario con todos los inputs y el botón de envío.
}

// Función para mostrar el modal
function showModal(message) {
    var modal = document.getElementById("myModal");
    var modalText = modal.querySelector(".modal-content p");
    modalText.textContent = message;  // Cambia el mensaje del modal
    modal.style.display = "block";  // Muestra el modal

    // Obtener el botón de cerrar y agregar el evento de cierre
    var span = modal.querySelector(".close");
    span.onclick = function() {
        modal.style.display = "none";  // Cierra el modal cuando se hace clic en el "X"
    }

    // Cierra el modal si se hace clic fuera del modal
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}